# AI & Optimization — Self-Quiz

**▶ Live: https://cafzal.github.io/ai-opt-learning/**

A self-contained web app to learn and self-test across **machine learning**,
**optimization & decision-making**, and **LLM / generative-AI** fundamentals. Each of
**20 batches** opens to a **review section** (collapsible key-concept toggles with worked
examples, diagrams, and a practical "why it matters" takeaway), followed by **10 quiz
questions** (200 total) that ramp from recall to synthesis in a GRE-style mix of formats.

## Open it

Just double-click **`index.html`** (or open it in any browser). No build step, no server.
*Math rendering uses MathJax from a CDN, so an internet connection is needed for formulas to display.*

If you prefer a local server:

```bash
cd ai-opt-learning
python3 -m http.server 4178
# then open http://localhost:4178
```

## What's inside

- **3 tracks** → 20 batches (ML Fundamentals · Optimization & Decision-Making · Generative AI & LLMs).
  Open a batch to **review first, then test**.
- **Review:** ~6–13 collapsible concept toggles per batch, each with a worked **example**, a practical
  **"why it matters"** takeaway, and — where it helps — an **SVG diagram** (100+ in all: bias–variance
  curves, SVM margins, Pareto frontiers, Bellman backups, attention flow, and so on).
- **Quiz:** 10 questions ordered **easy → advanced**, in four formats — multiple choice,
  select-all, numeric entry, and quantitative comparison (A vs B) — tagged **conceptual** or **applied**.
- Immediate feedback with a **worked explanation** and the **topic** it tests, for every answer.
- **Best scores per batch** persist in your browser (`localStorage`); "reset progress" clears them.
- Keyboard: number keys pick an option, **Enter** submits / advances.

## Structure

```
index.html         — shell + MathJax config; loads everything below
styles.css         — all styling
app.js             — engine (review page, quiz rendering, grading, scoring, results)
questions.js       — registry: tracks + per-batch titles/blurbs; stitches in batches + reviews
batches/<id>.js    — the 10 quiz questions for each batch  (window.QUIZ_BATCHES)
reviews/<id>.js    — the review concepts + diagrams for each batch  (window.QUIZ_REVIEWS)
```

## Adding or editing questions

Edit any file in `batches/`. Each question is an object:

```js
{
  id: "prob-3", type: "mc",            // "mc" | "ms" | "numeric" | "qc"
  framing: "applied", difficulty: 3,    // framing: "conceptual"|"applied"; difficulty 1–5
  prompt: "…",                          // HTML + inline LaTeX ($...$) allowed
  options: ["…", "…"], answer: 1,       // mc: index;  ms: array of indices
  // numeric:  answer: 0.794, tolerance: 0.01, unit: ""
  // qc:       quantityA: "…", quantityB: "…", answer: 0|1|2|3  (A>B / B>A / equal / can't tell)
  explanation: "why…",
  ref: "§2 — Bayes' rule"
}
```

> **LaTeX gotcha:** these are `.js` files, so backslashes must be **doubled** — write
> `"$\\boldsymbol{x}$"`, not `"$\boldsymbol{x}$"`. Options/MC answers are shuffled at runtime,
> so refer to choices by content, not position.

To register a brand-new batch, add its metadata to `questions.js` and matching
`<script src="batches/<id>.js">` and `<script src="reviews/<id>.js">` lines in `index.html`.

## Editing the review sections

Each file in `reviews/` is `window.QUIZ_REVIEWS["<id>"] = { intro, concepts: [...] }`. A concept is:

```js
{
  title: "Bias–variance tradeoff",
  tag: "core",                 // short chip label
  body: "<p>HTML + inline $...$ …</p>",
  visual: `<svg viewBox="0 0 520 250">…</svg>`,   // optional diagram (see below)
  caption: "one-line caption under the diagram",  // optional
  example: "a concrete worked example …"          // shown in the blue callout
}
```

> **Two string rules that bite:**
> 1. In `body`/`example`/`caption` (double-quoted), **double every LaTeX backslash** — `"$\\sigma$"`.
> 2. The `visual` is a **template literal** (backticks): put **no backslashes and no `${…}`** inside
>    it. Use Unicode for math in SVG labels (σ, μ, √, ², ≤, →). Color via the theme: stroke with
>    classes `vx-axis / vx-grid / vx-accent / vx-good / vx-bad / vx-warn`, fill with inline
>    `style="fill:var(--accent)"`. Remember the SVG y-axis points **down** (y=0 is the top).

## Attribution

This is original educational practice material covering standard, widely-taught concepts in
machine learning, optimization, and decision-making. The questions, explanations, and diagrams
are the author's own and **do not reproduce text from any source work**. The concepts follow
common treatments in the field, including:

- Kevin P. Murphy, *Machine Learning: A Probabilistic Perspective* / *Probabilistic Machine Learning* (MIT Press)
- François Fleuret, *The Little Book of Deep Learning*
- Richard S. Sutton & Andrew G. Barto, *Reinforcement Learning: An Introduction*
- Mykel J. Kochenderfer et al., *Algorithms for Optimization* and *Algorithms for Decision Making* (MIT Press)

These texts are credited for the underlying concepts only. This project is not affiliated with,
sponsored by, or endorsed by their authors or publishers. Trademarks and book titles belong to
their respective owners.
