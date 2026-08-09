/* ============================================================
   PROJECT REGISTRY
   ============================================================
   To add a project: copy one object below, fill it in, add a
   comma. That's it — the page rebuilds itself from this list.
   You do NOT need to touch index.html, style.css, or render.js.

   Field reference:

   title        string   Project name as you want it shown.
   description  string   1–2 sentences. What it does, not how.
   lang         string   "html" | "python" | "js" | "other"
                         (controls the small language tag on the card —
                         add new values freely, they render automatically)
   status       string   "live"     -> project has a working web page,
                                        the "Open" button will use `demo`
                          "standby" -> code is done, no web interface yet,
                                        only the "Repo" button is shown
   repo         string   Full URL to the GitHub repository. Required.
   demo         string   Full URL to the live page. Only required if
                          status is "live" — leave as "" otherwise.
   tags         array    Optional. Short keywords, shown as small chips.
                          Leave as [] if you don't want any.
   ============================================================ */

const PROJECTS = [

  {
    title: "NZ Spelling Bee Prep",
    description: "Practice tool for competitive spelling, built for my daughter's NZ Spelling Bee run — includes Te Reo Māori phonetic handling.",
    lang: "html",
    status: "live",
    repo: "https://github.com/kovnein/miniature-system",
    demo: "https://kovnein.github.io/odds-n-ends/projects/spelling-bee-prep.html",
    tags: ["single-file", "TTS", "te reo"]
  },

  {
    title: "Times Tables Bingo Generator",
    description: "Generates printable times-tables bingo cards with a chalkboard theme. Exports straight to PDF.",
    lang: "html",
    status: "live",
    repo: "",
    demo: "https://kovnein.github.io/odds-n-ends/projects/times_tables_bingo_builder.html",
    tags: ["single-file", "jsPDF"]
  },

  {
    title: "Wordle Emoji Transformer",
    description: "Takes your wordle share and replaces the squares with the emoji of your choice.",
    lang: "html",
    status: "live",
    repo: "",
    demo: "https://kovnein.github.io/odds-n-ends/projects/wordle-emoji-swap.html",
    tags: ["single-file", "wordle"]
  },

  {
    title: "Passphrase Generator",
    description: "A passphrase generator with multilingual support and built in entropy calculation. Original project written in python.",
    lang: "html",
    status: "live",
    repo: "",
    demo: "https://kovnein.github.io/odds-n-ends/projects/passphrase-bench.html",
    tags: ["single-file", "password", "security", "port"]
  },

  {
    title: "Focus Bench",
    description: "A simple focus tool with task list and focus/break timer.",
    lang: "html",
    status: "live",
    repo: "",
    demo: "https://kovnein.github.io/odds-n-ends/projects/focus-bench.html",
    tags: ["single-file", "productivity"]
  },

  {
    title: "SPILL - Tile based word game",
    description: "A tile based word game inspired by Bananagrams.",
    lang: "html",
    status: "live",
    repo: "",
    demo: "https://kovnein.github.io/odds-n-ends/projects/spill.html",
    tags: ["single-file", "game", "in-development"]
  },

  {
    title: "Wordchain - Finish the word game",
    description: "A brain break word game where you chain words on the ends of other words.",
    lang: "html",
    status: "live",
    repo: "",
    demo: "https://kovnein.github.io/odds-n-ends/projects/wordchain.html",
    tags: ["single-file", "game"]
  },

  {
    title: "The Fold - Temporal Loop Horror",
    description: "A narrative text adventure. Original project was written in python.",
    lang: "python",
    status: "live",
    repo: "https://github.com/kovnein/unspace-journey-adventure",
    demo: "https://kovnein.github.io/odds-n-ends/projects/the-fold/index.html",
    tags: ["multi-file", "game", "port"]
  }

];
