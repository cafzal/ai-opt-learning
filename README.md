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

- **2 tracks** → 20 batches: **AI & ML Fundamentals** (classic ML through deep learning, RL, and the
  GenAI/LLM frontier) and **Optimization & Decision-Making**. Open a batch to **review first, then test**.
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
