# AI & Optimization — Self-Quiz

**▶ Live: https://cafzal.github.io/ai-opt-learning/**

A free, no-signup web app for the **AI/ML + optimization fundamentals behind better decisions** —
from probability and prediction through optimization, sequential decision-making, and the
LLM / generative-AI frontier. Tell it what you want to learn and where you're starting, and it
builds you a **tailored path**; or browse the full catalog by source. **229 questions** across
**22 topic batches**, each preceded by a visual concept **review**.

## Two ways to use it

- **Path** (default) — a guided, goal-tailored route through a **6-stage decision-intelligence arc**:
  Foundations → Prediction → Reasoning & decision theory → Optimization → Sequential decisions →
  Building decision products. A two-tap **onboarding** (your goal + your level) tailors which stages
  are core / skim / optional, and a persistent **tailor bar** re-tunes the path live — tailoring only
  highlights, so nothing is ever hidden. A short **Stage 0 primer** ("think like a decision scientist")
  frontloads the mental models — the problem typologies and recurring objects — you'll meet everywhere.
- **Library** — the same 22 batches grouped by source (AI & ML Fundamentals; Optimization &
  Decision-Making), for direct lookup.

Toggle between the two anytime. A **light (default) / dark** theme switch lives in the header.

## Each batch

- **Review first** — collapsible key-concept toggles, each with a worked **example**, a practical
  **"why it matters"** takeaway, and — where it helps — an **SVG diagram** (100+ in all): bias–variance
  curves, SVM margins, Pareto frontiers, Bellman backups, attention flow, and so on. **208 concepts** total.
- **Then test** — **10 questions** ordered **easy → advanced**, in four GRE-style formats (multiple
  choice, select-all, numeric entry, quantitative comparison), tagged **conceptual** or **applied**.
  Every answer gets a worked **explanation** and the **topic** it tests.
- **Progress** — best score per batch plus **gold / silver / bronze** mastery badges persist in your
  browser (`localStorage`); "reset progress" clears them.
- Keyboard: number keys pick an option, **Enter** submits / advances.

## Open it

Just open **`index.html`** in any browser — no build step, no server.
*(Math rendering uses MathJax from a CDN, so an internet connection is needed for formulas to display.)*

If you prefer a local server:

```bash
cd ai-opt-learning
python3 -m http.server 4178
# then open http://localhost:4178
```

## Structure

```
index.html         — shell + MathJax config; loads everything below
styles.css         — all styling (warm light default + dark via :root[data-theme="dark"])
app.js             — engine: onboarding, the tailored Path + by-source Library views,
                     review pages, quiz rendering, grading, scoring, results, theme toggle
questions.js       — registry: per-batch titles/blurbs, the by-source TRACKS, and the
                     decision-intelligence STAGES / GOALS / LEVELS overlay; stitches in batches + reviews
batches/<id>.js    — the quiz questions for each batch         (window.QUIZ_BATCHES)
reviews/<id>.js    — the review concepts + diagrams per batch   (window.QUIZ_REVIEWS)
                     reviews/stage0.js is the review-only Stage 0 primer
```

`localStorage` keys: `mlq_scores_v1` (best scores), `mlq_prefs_v1` (onboarding goal/level/view),
`mlq_theme` (light/dark).

## Adding or editing questions

Edit any file in `batches/`. Each question is an object:

```js
{
  id: "prob-3", type: "mc",             // "mc" | "ms" | "numeric" | "qc"
  framing: "applied", difficulty: 3,     // framing: "conceptual"|"applied"; difficulty 1–5
  prompt: "…",                           // HTML + inline LaTeX ($...$) allowed
  options: ["…", "…"], answer: 1,        // mc: index;  ms: array of indices
  // numeric:  answer: 0.794, tolerance: 0.01, unit: ""
  // qc:       quantityA: "…", quantityB: "…", answer: 0|1|2|3  (A>B / B>A / equal / can't tell)
  explanation: "why…",
  ref: "Bayes' rule & base rates"        // plain topic label, shown as "Topic: …"
}
```

> **LaTeX gotcha:** these are `.js` files, so backslashes must be **doubled** — write
> `"$\\boldsymbol{x}$"`, not `"$\boldsymbol{x}$"`. Options/MC answers are shuffled at runtime,
> so refer to choices by content, not position. Questions are shown in the order given, so keep
> each batch sorted **easy → advanced**.

To register a brand-new batch, add its metadata to `questions.js` (and, to place it on the Path,
add its id to the relevant `STAGES` entry) plus matching `<script src="batches/<id>.js">` and
`<script src="reviews/<id>.js">` lines in `index.html`.

## Editing the review sections

Each file in `reviews/` is `window.QUIZ_REVIEWS["<id>"] = { intro, concepts: [...] }`. A concept is:

```js
{
  title: "Bias–variance tradeoff",
  tag: "core",                 // short chip label
  body: "<p>HTML + inline $...$ …</p>",
  visual: `<svg viewBox="0 0 520 250">…</svg>`,   // optional diagram (see below)
  caption: "one-line caption under the diagram",  // optional
  example: "a concrete worked example …",         // shown in the blue callout
  takeaway: "the practical 'why it matters' line" // shown in the green callout
}
```

> **Two string rules that bite:**
> 1. In `body`/`example`/`takeaway`/`caption` (double-quoted), **double every LaTeX backslash** — `"$\\sigma$"`.
> 2. The `visual` is a **template literal** (backticks): put **no backslashes and no `${…}`** inside
>    it. Use Unicode for math in SVG labels (σ, μ, √, ², ≤, →). Color via the theme: stroke with
>    classes `vx-axis / vx-grid / vx-accent / vx-good / vx-bad / vx-warn`, fill with inline
>    `style="fill:var(--accent)"`. Remember the SVG y-axis points **down** (y=0 is the top).

## Attribution

This is original, **non-commercial** educational material. The questions, explanations, and
diagrams are the author's own and **reproduce no text** from any source work — they cover
standard, widely-taught concepts (facts and methods, which copyright does not cover). The
distilled study notes those concepts were learned from are **not** included in this repository.

Concepts follow these texts, credited under the terms each one states in its own front matter.
Most are Creative Commons **BY-NC-ND** — share with attribution, non-commercially, no
derivatives of the text — which this project respects (attribution below; non-commercial; no
text or abridgement redistributed, concepts only):

| Work | Author(s) | Terms | Source |
|---|---|---|---|
| *Probabilistic Machine Learning: An Introduction* (MIT Press, 2022) | Kevin P. Murphy | CC BY-NC-ND | [probml.github.io/pml-book](https://probml.github.io/pml-book/) |
| *Machine Learning: A Probabilistic Perspective* (MIT Press, 2012) | Kevin P. Murphy | © all rights reserved | publisher |
| *The Little Book of Deep Learning* (2023) | François Fleuret | Creative Commons, non-commercial | [fleuret.org/francois/lbdl.html](https://fleuret.org/francois/lbdl.html) |
| *Reinforcement Learning: An Introduction*, 2nd ed. (MIT Press, 2018) | Sutton & Barto | CC BY-NC-ND 2.0 | [incompleteideas.net/book](http://incompleteideas.net/book/the-book-2nd.html) |
| *Algorithms for Optimization*, 2nd ed. (MIT Press, 2025) | Kochenderfer & Wheeler | CC BY-NC-ND 4.0 | [algorithmsbook.com/optimization](https://algorithmsbook.com/optimization/) |
| *Algorithms for Decision Making* (MIT Press, 2022) | Kochenderfer, Wheeler & Wray | CC BY-NC-ND | [algorithmsbook.com](https://algorithmsbook.com/) |

This project is not affiliated with, sponsored by, or endorsed by these authors or publishers;
titles and trademarks belong to their respective owners.

## License

The app itself — its code, questions, explanations, and diagrams — is © 2026 Cameron Afzal,
released under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**;
see [`LICENSE`](LICENSE). NonCommercial is chosen deliberately to respect the non-commercial
terms of the source texts above. This license covers the original material in this repository
only; the cited works remain under their own licenses.
