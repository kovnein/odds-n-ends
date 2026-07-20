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
    demo: "https://kovnein.github.io/odds-n-ends/projects/times_table_bingo_builder.html",
    tags: ["single-file", "jsPDF"]
  },

  {
    title: "Wordle Emoji Transformer",
    description: "Takes you wordle share and replaces the squares with the emoji of your choice.",
    lang: "html",
    status: "live",
    repo: "",
    demo: "https://kovnein.github.io/odds-n-ends/projects/wordle-emoji-swap.html",
    tags: ["single-file", "jsPDF"]
  }

  {
    title: "EXAMPLE — Python project, no web front-end yet",
    description: "Delete this card, or use it as your template: a Python project that's finished and on GitHub, but doesn't have a page to click into yet.",
    lang: "python",
    status: "standby",
    repo: "https://github.com/kovnein/",
    demo: "",
    tags: ["example", "delete-me"]
  }

];
