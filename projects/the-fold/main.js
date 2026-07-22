/*
============================================
MAIN LOOP + UI BINDINGS
============================================
JS translation of main.py, plus the DOM interaction layer that
stands in for input()/print() in the CLI version.
*/

function createUI() {
  const output = document.getElementById('output');
  const controls = document.getElementById('controls');
  const statusChapter = document.getElementById('status-chapter');
  const statusEndings = document.getElementById('status-endings');

  const TYPE_SPEED_MS = 14;

  // A single cursor element that lives at whatever point text is
  // currently being printed. It travels into each new block as it's
  // created, sitting after the most recently typed character.
  const cursor = document.createElement('span');
  cursor.className = 'cursor cursor-idle';
  output.appendChild(cursor);

  let skipRequested = false;
  output.addEventListener('click', () => {
    skipRequested = true;
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
  }

  async function typeInto(block, text) {
    skipRequested = false;
    cursor.classList.remove('cursor-idle');
    cursor.classList.add('cursor-typing');
    block.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      if (skipRequested) {
        block.insertBefore(document.createTextNode(text.slice(i)), cursor);
        break;
      }
      block.insertBefore(document.createTextNode(text[i]), cursor);
      scrollToBottom();
      await sleep(TYPE_SPEED_MS);
    }

    cursor.classList.remove('cursor-typing');
    cursor.classList.add('cursor-idle');
    scrollToBottom();
  }

  async function appendText(text) {
    if (!text) return;
    const trimmed = text.replace(/^\n+/, '').replace(/\n+$/, '');
    if (!trimmed) return;

    const block = document.createElement('p');
    block.className = 'story-block';
    output.appendChild(block);
    await typeInto(block, trimmed);
  }

  function appendHeader(text) {
    const block = document.createElement('div');
    block.className = 'chrome-header';
    block.textContent = text;
    output.appendChild(block);
    output.appendChild(cursor); // keep cursor trailing the visible log
    cursor.classList.remove('cursor-typing');
    cursor.classList.add('cursor-idle');
    scrollToBottom();
  }

  function appendDivider() {
    const hr = document.createElement('div');
    hr.className = 'chrome-divider';
    output.appendChild(hr);
    output.appendChild(cursor);
    scrollToBottom();
  }

  function clearControls() {
    controls.innerHTML = '';
  }

  function waitForContinue() {
    return new Promise((resolve) => {
      clearControls();
      const btn = document.createElement('button');
      btn.className = 'btn btn-continue';
      btn.textContent = '\u25B6 continue';
      btn.onclick = () => {
        clearControls();
        resolve();
      };
      controls.appendChild(btn);
      btn.focus();
      scrollToBottom();
    });
  }

  function getChoice(options) {
    return new Promise((resolve) => {
      clearControls();
      const prompt = document.createElement('div');
      prompt.className = 'choice-prompt';
      prompt.textContent = 'What do you do?';
      controls.appendChild(prompt);

      options.forEach((text, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-choice';
        btn.innerHTML = `<span class="choice-index">${idx + 1}</span> ${escapeHtml(text)}`;
        btn.onclick = () => {
          clearControls();
          resolve(idx);
        };
        controls.appendChild(btn);
      });
      scrollToBottom();
    });
  }

  function confirmContinue(promptText) {
    return new Promise((resolve) => {
      clearControls();
      const prompt = document.createElement('div');
      prompt.className = 'choice-prompt';
      prompt.textContent = promptText;
      controls.appendChild(prompt);

      const yes = document.createElement('button');
      yes.className = 'btn btn-choice';
      yes.textContent = 'Yes';
      yes.onclick = () => {
        clearControls();
        resolve(true);
      };

      const no = document.createElement('button');
      no.className = 'btn btn-choice';
      no.textContent = 'No';
      no.onclick = () => {
        clearControls();
        resolve(false);
      };

      controls.appendChild(yes);
      controls.appendChild(no);
      scrollToBottom();
    });
  }

  function updateStatus() {
    statusChapter.textContent = `CHAPTER ${gameState.chapter}`;
    statusEndings.textContent = `ENDINGS ${gameState.endingsSeen.length}/${Object.keys(ENDINGS).length}`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    appendText,
    appendHeader,
    appendDivider,
    waitForContinue,
    getChoice,
    confirmContinue,
    updateStatus
  };
}

const ui = createUI();

// ============================================
// CHAPTER SYSTEM
// Mirrors main.py chapter_start / chapter_play / chapter_record / chapter_reset
// ============================================

async function chapterStart() {
  const chapter = gameState.chapter;
  let header = `CHAPTER ${chapter}`;
  if (chapter >= 6) {
    header += `\nCROSSING: ${generateCrossingId(chapter)}`;
  }
  ui.appendDivider();
  ui.appendHeader(header);
  ui.updateStatus();
}

async function playScene(sceneId) {
  gameState.currentScene = sceneId;
  if (sceneId === 'start') return executeScene('insertion', ui);
  if (sceneId === 'ending') return getEnding(ui);
  return executeScene(sceneId, ui);
}

async function chapterPlay() {
  let current = 'start';
  while (current !== 'ending') {
    current = await playScene(current);
  }
  await playScene('ending');
}

function chapterRecord() {
  gameState.chapter += 1;
  saveProgress();
}

function chapterReset() {
  gameState.currentSession = {};
  gameState.currentScene = 'start';
}

// ============================================
// MAIN LOOP
// ============================================

async function mainLoop() {
  await chapterStart();
  await chapterPlay();
  chapterRecord();

  const cont = await ui.confirmContinue('Continue to next chapter?');
  if (!cont) {
    await ui.appendText('Progress saved. Thanks for playing this demo of The Fold.');
    saveProgress();
    return;
  }
  chapterReset();
  await mainLoop();
}

async function startGame() {
  const hasSave = !!localStorage.getItem('the_fold_save');

  ui.appendHeader('THE FOLD\nTemporal Loop Horror \u2014 Web Demo');
  await ui.appendText(
    'This is a work-in-progress web port of a longer CLI game. ' +
      'Some branches beyond this demo path will say so honestly rather than pretend to be finished.'
  );

  if (hasSave) {
    const load = await ui.confirmContinue('Save file detected. Continue previous session?');
    if (load) {
      loadProgress();
      await ui.appendText(`Resuming at Chapter ${gameState.chapter}...`);
    } else {
      deleteSave();
      await ui.appendText('Starting new game...');
    }
  } else {
    await ui.appendText('No save file found. Starting new game...');
  }

  ui.updateStatus();
  await ui.waitForContinue();
  await mainLoop();
}

startGame();
