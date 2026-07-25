# The Fold — Web Demo

A browser port of the CLI game, built as static HTML/CSS/JS so it can drop
straight into GitHub Pages with no build step.

## Current scope

**All ten endings are now reachable**, including both true endings.
Navigation by Nightmare — the last one — turned out not to need the Echo
Chamber at all: First Hour's "Navigate by impossibility" option (chapter
6+, 3+ endings already seen) routes straight to it. First Hour is now
fully built out: Investigate (→ The Presence), Use Memory (chapter 3+,
unlocks once you've seen at least one ending — offers a shortcut back into
Instruments/Instinct/Investigate plus two further conditional options of
its own), and the emergency-return-anyway option (unlocked after learning
returns are a trap, from a Regression ending).

Reaching Emergence Protocol for real requires chapter 5+ and 3+ endings
already seen — i.e. actually playing through several loops, since
`endingsSeen` and permanent flags persist across chapters in `gameState`
exactly like the Python version (only `currentSession` resets each loop).
This was verified both by scripting a preset multi-loop game state against
the real engine, and by a real headless-browser run seeding the same state
and clicking through to confirm the "(NEW)" conditional option actually
appears in the UI, the ending banner fires, and the post-choice sequence
renders with real fetched content — not just checked in the abstract.

Seven endings are reachable now: **Consumption, Fragmentation, Dissolution,
Regression, Compromise, Violent Emergence, and Emergence Protocol** (the
first of the two "true" endings). The only other ending — Navigation by
Nightmare — needs the Echo Chamber scene, still unported.

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

The Presence / The Reflection (reached from several branches above)
  → "ask what it wants" / "how is this possible" → The Understanding
        ├─ Accept → work together → Emergence Protocol (ch5+/3 endings)
        │                        → falls through to Violent Emergence otherwise
        ├─ Reject → Violent Emergence (default fallback)
        ├─ Transform → Violent Emergence (default fallback)
        └─ (NEW, ch5+/3 endings) Use this knowledge → Mastery
              → Navigate by enlightenment → Emergence Protocol
              → Access the temporal network → Echo Chamber (not yet ported)
```

**Small callback unlock:** after seeing the Consumption ending once, a
permanent flag (`knows_presence_real`) unlocks a new option — "Accept that
something is out there" — on Instrument Path in later loops, leading
straight into The Reflection via a short acceptance scene. This mirrors the
Python version's cross-loop knowledge persistence.

A note on the Understanding sub-scenes: Reject/Transform's own flags
(`forced_through_despite_knowledge`, `retreated_from_truth`,
`transformed_by_fold`) aren't in any ending's condition list in the source
`endings_config.py` either — they fall through to the same default
Violent Emergence fallback the Python version uses. That's not a gap
introduced in this port; it's ported faithfully from the original (noted
in the Python README's own "Known Issues": *"Some permanent flags set but
not yet utilized for callback content"*).

Still stubbed with the graceful fallback message: "Investigate the
discrepancy" from First Hour, and "Access the temporal network" from
Understanding Mastery (both lead to scenes — First Hour Investigate and
Echo Chamber — not yet ported).

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
