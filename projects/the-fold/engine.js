/*
============================================
GAME ENGINE
============================================
JS translation of game_state.py + utils.py + scenes.py + endings.py.
Depends on SCENES / ENDINGS / ENDING_PRIORITY from content.js.
*/

// ============================================
// GAME STATE
// ============================================

const gameState = {
  chapter: 1,
  flags: {},
  endingsSeen: [],
  currentSession: {},
  currentScene: 'start',
  sceneVisits: {}
};

// ---- Flags ----

function setFlag(name, value = true) {
  gameState.flags[name] = value;
}
function hasFlag(name) {
  return !!gameState.flags[name];
}
function setSessionFlag(name, value = true) {
  gameState.currentSession[name] = value;
}
function hasSessionFlag(name) {
  return !!gameState.currentSession[name];
}

// ---- Scene visit tracking ----

function incrementSceneVisit(sceneId) {
  gameState.sceneVisits[sceneId] = (gameState.sceneVisits[sceneId] || 0) + 1;
}
function getSceneVisits(sceneId) {
  return gameState.sceneVisits[sceneId] || 0;
}

// ---- Save / load (localStorage stands in for savegame.json) ----

const SAVE_KEY = 'the_fold_save';

function saveProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.error('Save failed:', e);
  }
}

function loadProgress() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const loaded = JSON.parse(raw);
    Object.assign(gameState, loaded);
    gameState.currentSession = {}; // reset session flags on load, same as game_state.py
    return true;
  } catch (e) {
    console.error('Load failed:', e);
    return false;
  }
}

function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ============================================
// CONTENT LOADING
// ============================================

const CONTENT_DIR = 'content';

function generateCrossingId(chapter) {
  const baseSequence = [1, 2, 3, 4, 5, 847, 12, 1193, 89, 2401, 156, 3, 891, 47, 2106];
  if (chapter <= baseSequence.length) return baseSequence[chapter - 1];
  return (chapter * 173 + 89) % 3000;
}

async function loadText(filename, vars = {}) {
  const templateVars = { ...vars };
  if (gameState.chapter >= 6) {
    templateVars.crossing_id = generateCrossingId(gameState.chapter);
  }
  try {
    const res = await fetch(`${CONTENT_DIR}/${filename}`);
    if (!res.ok) return `[Missing content: ${filename}]`;
    let text = await res.text();
    text = text.replace(/\{(\w+)\}/g, (match, key) =>
      key in templateVars ? templateVars[key] : match
    );
    return text;
  } catch (e) {
    return `[Error loading ${filename}: ${e}]`;
  }
}

function getContentFile(contentFiles, key) {
  if (!contentFiles) return null;
  if (key in contentFiles) return contentFiles[key];

  const validKeys = Object.keys(contentFiles)
    .map(Number)
    .filter((k) => k <= key);
  if (validKeys.length) return contentFiles[Math.max(...validKeys)];

  const allKeys = Object.keys(contentFiles).map(Number);
  return contentFiles[Math.min(...allKeys)];
}

// ============================================
// DISPLAY WITH PAUSES
// Mirrors utils.py display_with_pauses(), but a click resolves
// each pause instead of blocking on input().
// ============================================

async function displayWithPauses(text, ui) {
  const parts = text.split('[Press Enter');
  await ui.appendText(parts[0]);

  for (const part of parts.slice(1)) {
    const closeIdx = part.indexOf(']');
    if (closeIdx === -1) {
      await ui.appendText('[Press Enter' + part);
      continue;
    }
    const remaining = part.slice(closeIdx + 1);
    await ui.waitForContinue();
    await ui.appendText(remaining);
  }
}

async function displayText(text, ui) {
  if (text.includes('[Press Enter')) {
    await displayWithPauses(text, ui);
  } else {
    await ui.appendText(text);
  }
}

// ============================================
// SCENE ENGINE
// Mirrors scenes.py execute_scene()
// ============================================

async function executeScene(sceneId, ui) {
  const scene = SCENES[sceneId];

  if (!scene) {
    // Graceful fallback for content not yet ported to the web demo
    await ui.appendText(
      "\nThis branch hasn't been built into the web demo yet.\n" +
        'Returning you to the insertion point...\n'
    );
    await ui.waitForContinue();
    return 'start';
  }

  const chapter = gameState.chapter;
  const useVisits = !!scene.use_visit_count;
  let contentKey;

  if (useVisits) {
    const visits = getSceneVisits(sceneId);
    incrementSceneVisit(sceneId);
    contentKey = visits + 1;
  } else {
    contentKey = chapter;
  }

  const contentFile = getContentFile(scene.content_files, contentKey);
  if (contentFile) {
    const description = await loadText(contentFile, {
      chapter,
      prev_count: chapter - 1,
      visits: useVisits ? contentKey : 0
    });
    await displayText(description, ui);
  }

  const options = [];
  const handlers = [];

  for (const opt of scene.base_options || []) {
    options.push(opt.text);
    handlers.push(opt);
  }
  for (const opt of scene.conditional_options || []) {
    if (opt.condition && opt.condition()) {
      options.push(opt.text);
      handlers.push(opt);
    }
  }

  if (!options.length) {
    await ui.appendText('\n[Error: No options available for this scene]');
    return 'ending';
  }

  const choiceIdx = await ui.getChoice(options);
  const chosen = handlers[choiceIdx];

  if (chosen.flag) setSessionFlag(chosen.flag);
  if (chosen.permanent_flag) setFlag(chosen.permanent_flag);

  if (chosen.response) {
    const response = await loadText(chosen.response, { chapter, prev_count: chapter - 1 });
    await displayText(response, ui);
  } else if (chosen.response_files) {
    const responseFile = getContentFile(chosen.response_files, chapter);
    if (responseFile) {
      const response = await loadText(responseFile, { chapter, prev_count: chapter - 1 });
      await displayText(response, ui);
    }
  }

  return chosen.next || scene.next_scene || 'ending';
}

// ============================================
// ENDING SYSTEM
// Mirrors endings.py
// ============================================

function determineEnding() {
  for (const endingId of ENDING_PRIORITY) {
    const ending = ENDINGS[endingId];
    if (ending && ending.condition && ending.condition()) {
      return endingId;
    }
  }
  return null;
}

async function displayEnding(endingId, ui) {
  const ending = ENDINGS[endingId];
  if (!ending) {
    await ui.appendText(`\n[Error: Unknown ending '${endingId}']`);
    return;
  }

  const text = await loadText(ending.content_file, {});

  ui.appendDivider();
  await displayText(text, ui);
  ui.appendDivider();

  if (!gameState.endingsSeen.includes(endingId)) {
    gameState.endingsSeen.push(endingId);
    await ui.appendText(`\n\u2728 NEW ENDING: ${ending.name}`);
    if (ending.unlocks) {
      setFlag(ending.unlocks);
      await ui.appendText('\uD83D\uDD13 Something new has been unlocked...');
    }
  } else {
    await ui.appendText(`\n[Ending seen before: ${ending.name}]`);
  }

  const total = Object.keys(ENDINGS).length;
  const discovered = gameState.endingsSeen.length;
  await ui.appendText(`\n\uD83D\uDCCA Endings discovered: ${discovered}/${total}`);
  ui.updateStatus();
}

async function getEnding(ui) {
  const endingId = determineEnding();
  if (endingId) {
    await displayEnding(endingId, ui);
    return endingId;
  }
  await ui.appendText('\n[Error: No valid ending found - defaulting to violent emergence]');
  await displayEnding('ending_violent_emergence', ui);
  return 'ending_violent_emergence';
}
