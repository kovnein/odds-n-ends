# The Fold — Web Demo

A browser port of the CLI game, built as static HTML/CSS/JS so it can drop
straight into GitHub Pages with no build step.

## Current scope

Three major scenes are now live — The Presence, The Reflection, and the
Instrument Cameras — reachable from multiple entry points, with several
cross-links between branches (e.g. bailing out of the instinct path drops
you back into the instrument path; the camera branch loops back into
Instrument Maintain if you don't trust what you see):

```
Insertion → First Hour
  ├─ Trust the instruments → Instrument Path
  │     ├─ Keep eyes on instruments → Instrument Maintain
  │     │     ├─ Ignore it → Forced Confrontation → Consumption / Fragmentation
  │     │     └─ Check sensors → Instrument Cameras
  │     │           ├─ Trust instruments → back to Instrument Maintain
  │     │           └─ Trust cameras → The Reflection
  │     └─ Glance at the viewport → Instrument Glance
  │           ├─ Return focus → Forced Confrontation (same branch as above)
  │           ├─ Keep looking → The Reflection
  │           └─ Emergency maneuvers → The Presence → Fragmentation
  │
  └─ Trust your instinct → Instinct Path
        ├─ Embrace it → Go deeper → Dissolution / Pull back → Instinct Resist
        └─ Resist communion → Instinct Resist
              ├─ Return to instruments → rejoins Instrument Path above
              ├─ Careful navigation → Compromise
              ├─ Abort the insertion → Regression
              └─ Force through → Violent Emergence
```

**The Presence** (from Instrument Glance's emergency maneuvers) branches into
communicate / observe / evade, with the observe branch splitting further
into movement-analysis and scan sub-scenes — all funneling into either
Fragmentation, Consumption, or onward into **The Reflection**.

**The Reflection** (from several entry points above) offers communicate /
attack / retreat, each reachable from multiple upstream branches.

**Small callback unlock:** after seeing the Consumption ending once, a
permanent flag (`knows_presence_real`) unlocks a new option — "Accept that
something is out there" — on Instrument Path in later loops, leading
straight into The Reflection via a short acceptance scene. This mirrors the
Python version's cross-loop knowledge persistence.

All six endings so far — **Consumption, Fragmentation, Dissolution,
Regression, Compromise, Violent Emergence** — are reachable through multiple
routes now, not just one path each. Every transition above has been verified
by scripting full playthroughs against the real engine/content files, plus
a real headless-browser click-through of one branch to confirm rendering
and content-fetching, not just the underlying logic.

Still stubbed with the graceful fallback message: "Investigate the
discrepancy" from First Hour, and anything past The Understanding scene
(reached from several `[Continue]` chains above) — the true endings
(Emergence Protocol, Navigation by Nightmare) live beyond that point.

## How it maps to the Python source

| Python file | JS equivalent | Notes |
|---|---|---|
| `game_state.py` | `engine.js` (top section) | `localStorage` replaces `savegame.json` |
| `utils.py` | `engine.js` (`displayWithPauses`, `displayText`) | pauses resolve on click instead of blocking on `input()` |
| `scenes.py` | `engine.js` (`executeScene`) | same content-file lookup + option-building logic |
| `endings.py` | `engine.js` (`determineEnding`, `displayEnding`, `getEnding`) | same priority-list approach |
| `scenes_config.py` | `content.js` (`SCENES`) | lambdas → arrow functions |
| `endings_config.py` | `content.js` (`ENDINGS`, `ENDING_PRIORITY`) | full translation — all 10 endings are wired for condition-checking even though only 2 have content files so far |
| `content/*.txt` | `content/*.txt` | copied verbatim, same `{chapter}` / `[Press Enter...]` syntax |
| `main.py` | `main.js` | same chapter_start/play/record/reset shape |

## Adding more content

To port another scene from `scenes_config.py`:

1. Copy its `.txt` content files into `content/<scene>/`.
2. Add an entry to `SCENES` in `content.js` — same keys as the Python dict
   (`content_files`, `base_options`, `conditional_options`, `use_visit_count`).
3. Translate any `lambda:` conditions to arrow functions.
4. Nothing in `engine.js` needs to change — it reads whatever `SCENES` gives it.

To port another ending: add its `.txt` file under `content/endings/` — the
`ENDINGS` entries are already fully translated, so as soon as the scenes that
set its trigger flags exist, it becomes reachable automatically.

## Running locally

Content is loaded via `fetch()`, which most browsers block on `file://`
URLs. Serve the folder instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

Copy this whole folder into your portfolio repo (e.g. as `/the-fold/`) and
link to it — no build step, no dependencies beyond the two Google Fonts
loaded in `index.html`.
