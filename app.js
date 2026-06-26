/* ============================================================
   ML & Optimization Self-Quiz — engine
   Pure vanilla JS. Data comes from window.QUIZ_DATA (questions.js).
   ============================================================ */
(function () {
  "use strict";

  const DATA = window.QUIZ_DATA;
  const app = document.getElementById("app");
  const LS_KEY = "mlq_scores_v1";
  const PREFS_KEY = "mlq_prefs_v1";
  const STATUS_LABEL = { core: "Core", skim: "Skim", review: "Review if rusty", off: "Optional" };

  const QC_OPTIONS = [
    "Quantity A is greater",
    "Quantity B is greater",
    "The two quantities are equal",
    "The relationship cannot be determined"
  ];

  /* ---------- persistence ---------- */
  function loadScores() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveScore(batchId, score, total) {
    const s = loadScores();
    const prev = s[batchId];
    if (!prev || score > prev.best) {
      s[batchId] = { best: score, total: total };
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    }
  }

  /* ---------- utilities ---------- */
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function typeset(node) {
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise(node ? [node] : undefined).catch(function () {});
    }
  }
  function diffDots(d) {
    const n = Math.max(1, Math.min(5, d || 1));
    return "●".repeat(n) + "○".repeat(5 - n);
  }
  const TYPE_LABEL = {
    mc: "Multiple choice",
    ms: "Select all that apply",
    numeric: "Numeric entry",
    qc: "Quantitative comparison"
  };

  /* ---------- normalize a question into a renderable, gradable shape ----------
     Returns { display: [...labels], correctSet: Set(displayIndices) } for choice types,
     plus passes through numeric/qc specifics. Handles option shuffling + answer remap. */
  function prep(q) {
    if (q.type === "numeric") {
      return { kind: "numeric", answer: q.answer, tolerance: q.tolerance || 0, unit: q.unit || "" };
    }
    if (q.type === "qc") {
      // qc options are fixed; answer is index 0..3
      return { kind: "choice", multi: false, display: QC_OPTIONS.slice(),
               correctSet: new Set([q.answer]), shuffled: false };
    }
    // mc or ms
    const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
    const idx = q.options.map((_, i) => i);
    const order = q.shuffle === false ? idx : shuffle(idx);
    const display = order.map(i => q.options[i]);
    const correctSet = new Set();
    order.forEach((origIdx, newIdx) => { if (ans.includes(origIdx)) correctSet.add(newIdx); });
    return { kind: "choice", multi: q.type === "ms", display, correctSet, shuffled: true };
  }

  /* ---------- state ---------- */
  let S = null; // { batchId, questions[], prepped[], i, selections[], graded[], correctCount }
  let tailorOpen = false; // persistent tailor bar expanded?

  /* ---------- preferences (onboarding / view) ---------- */
  function getPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || null; }
    catch (e) { return null; }
  }
  function savePrefs(p) { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

  function masteryTier(sc) {
    if (!sc || !sc.total) return null;
    const pct = sc.best / sc.total;
    if (pct >= 1) return { key: "gold", label: "Gold" };
    if (pct >= 0.8) return { key: "silver", label: "Silver" };
    if (pct >= 0.6) return { key: "bronze", label: "Bronze" };
    return { key: "started", label: "In progress" };
  }
  function scorePill(id, scores) {
    const sc = scores[id];
    if (!sc) return `<span class="bc-score">not started</span>`;
    const t = masteryTier(sc);
    return `<span class="bc-score has m-${t.key}" title="best ${sc.best} of ${sc.total}">${t.label} · ${sc.best}/${sc.total}</span>`;
  }

  // For a goal + level, tag every stage: core / skim (on-path) or review / off.
  function stageStatus(goalKey, levelKey) {
    const goal = (DATA.goals || []).find(g => g.key === goalKey) || (DATA.goals || [])[0];
    const level = (DATA.levels || []).find(l => l.key === levelKey) || (DATA.levels || [])[0];
    const start = level ? level.start : 1;
    return DATA.stages.map(s => ({
      stage: s,
      status: (s.n < start) ? "review" : ((goal && goal.role[s.id]) || "off")
    }));
  }

  function footerEl() {
    return el("div", "home-footer",
      "<b>About.</b> A non-commercial study tool. The questions, explanations, and diagrams are original and " +
      "<b>reproduce no text</b> from any source work — they cover standard concepts only (facts and methods, which " +
      "copyright doesn't cover). Those concepts follow widely-taught texts, credited under their stated terms — most " +
      "are Creative Commons <b>BY-NC-ND</b>: Murphy, <a href=\"https://probml.github.io/pml-book/\" target=\"_blank\" rel=\"noopener\"><i>Probabilistic Machine Learning</i></a> (MIT Press, 2022); " +
      "Sutton &amp; Barto, <a href=\"http://incompleteideas.net/book/the-book-2nd.html\" target=\"_blank\" rel=\"noopener\"><i>Reinforcement Learning: An Introduction</i></a> (MIT Press, 2018); Kochenderfer &amp; Wheeler, " +
      "<a href=\"https://algorithmsbook.com/optimization/\" target=\"_blank\" rel=\"noopener\"><i>Algorithms for Optimization</i></a> (MIT Press, 2025); Kochenderfer, Wheeler &amp; Wray, <a href=\"https://algorithmsbook.com/\" target=\"_blank\" rel=\"noopener\"><i>Algorithms for " +
      "Decision Making</i></a> (MIT Press, 2022); and Fleuret, <a href=\"https://fleuret.org/francois/lbdl.html\" target=\"_blank\" rel=\"noopener\"><i>The Little Book of Deep Learning</i></a>. " +
      "Not affiliated with, sponsored by, or endorsed by these authors or publishers. " +
      "This app is released under <a href=\"https://creativecommons.org/licenses/by-nc/4.0/\" target=\"_blank\" rel=\"noopener\">CC BY-NC 4.0</a>; " +
      "full sources &amp; links are in the <a href=\"https://github.com/cafzal/ai-opt-learning#attribution\" target=\"_blank\" rel=\"noopener\">project README</a>.");
  }

  /* ============================================================
     HOME — routes to the tailored Path or the by-source Library
     ============================================================ */
  function renderHome() {
    S = null;
    const p = getPrefs() || { onboarded: true, goal: "explore", level: "new", view: "path" };
    window.scrollTo(0, 0);
    app.innerHTML = "";
    app.appendChild(renderControls(p));
    if (p.view === "library" || !DATA.stages || !DATA.stages.length) renderLibrary();
    else renderPath(p);
    app.appendChild(footerEl());
    typeset(app);
  }

  function renderControls(p) {
    const c = el("div", "home-controls");
    const seg = el("div", "seg");
    const onPath = p.view !== "library";
    const pb = el("button", "seg-btn" + (onPath ? " on" : ""), "Path");
    const lb = el("button", "seg-btn" + (!onPath ? " on" : ""), "Library");
    pb.addEventListener("click", () => { if (!onPath) { savePrefs(Object.assign({}, p, { view: "path" })); renderHome(); } });
    lb.addEventListener("click", () => { if (onPath) { savePrefs(Object.assign({}, p, { view: "library" })); renderHome(); } });
    seg.appendChild(pb); seg.appendChild(lb);
    c.appendChild(seg);
    return c;
  }

  /* ---------- Library view (the full catalog, by source) ---------- */
  function renderLibrary() {
    const scores = loadScores();
    app.appendChild(el("div", "intro",
      "The full catalog, by source. Every batch pairs a <b>concept review</b> (with diagrams) " +
      "and a <b>10-question quiz</b> in mixed GRE-style formats."));
    DATA.tracks.forEach(track => {
      const t = el("div", "track");
      const head = el("div", "track-head");
      head.appendChild(el("h2", null, track.title));
      head.appendChild(el("span", "src", track.source));
      t.appendChild(head);
      if (track.sub) t.appendChild(el("p", "track-sub", track.sub));
      const grid = el("div", "batch-grid");
      track.batches.forEach((batchId, idx) => {
        const b = DATA.batches[batchId];
        if (!b) return;
        const card = el("button", "batch-card");
        const total = b.questions.length;
        const nConcepts = b.review && b.review.concepts ? b.review.concepts.length : 0;
        const meta = nConcepts ? `Review (${nConcepts}) + ${total} questions` : `${total} questions · easy → advanced`;
        card.innerHTML =
          `<div class="bc-top"><span class="bc-num">${idx + 1}</span>` +
          `<span class="bc-title">${b.title}</span></div>` +
          `<div class="bc-blurb">${b.blurb}</div>` +
          `<div class="bc-foot"><span class="bc-meta">${meta}</span>${scorePill(batchId, scores)}</div>`;
        card.addEventListener("click", () => renderBatch(batchId));
        grid.appendChild(card);
      });
      t.appendChild(grid);
      app.appendChild(t);
    });
  }

  /* ---------- Path view (the tailored 6-stage decision-intelligence arc) ---------- */
  function renderPath(p) {
    const scores = loadScores();
    const goal = (DATA.goals || []).find(g => g.key === p.goal) || (DATA.goals || [])[0];
    const level = (DATA.levels || []).find(l => l.key === p.level) || (DATA.levels || [])[0];
    const statuses = stageStatus(p.goal, p.level);

    const pathLessons = [];
    statuses.forEach(({ stage, status }) => {
      if (status === "core" || status === "skim") stage.batches.forEach(id => { if (DATA.batches[id]) pathLessons.push(id); });
    });
    const allLessons = [];
    DATA.stages.forEach(s => s.batches.forEach(id => { if (DATA.batches[id]) allLessons.push(id); }));
    const N = pathLessons.length;
    const off = allLessons.length - N;
    const masteredCount = pathLessons.filter(id => { const sc = scores[id]; return sc && sc.best / sc.total >= 0.8; }).length;
    const pct = N ? Math.round(masteredCount / N * 100) : 0;
    const firstStage = statuses.find(x => x.status === "core" || x.status === "skim");
    const nextId = pathLessons.find(id => { const sc = scores[id]; return !sc || sc.best < sc.total; }) || pathLessons[0];

    // persistent tailor bar — edit goal/level inline; retunes the path live
    const tb = el("div", "tailor" + (tailorOpen ? " open" : ""));
    const th = el("button", "tailor-head",
      `<span class="tl-label">Tailored for</span>` +
      `<span class="tl-current">${goal ? goal.label : ""}${level ? " · " + level.short : ""}</span>` +
      `<span class="tl-toggle">${tailorOpen ? "Done" : "Change"}</span>`);
    th.addEventListener("click", () => { tailorOpen = !tailorOpen; renderHome(); });
    tb.appendChild(th);
    const panel = el("div", "tailor-panel");
    panel.appendChild(el("div", "tl-q", "What do you want to be able to do?"));
    const gc = el("div", "tl-chips");
    DATA.goals.forEach(go => {
      const ch = el("button", "chip sm" + (p.goal === go.key ? " sel" : ""), `<span class="chip-label">${go.label}</span>`);
      ch.addEventListener("click", () => { savePrefs(Object.assign({}, p, { goal: go.key })); renderHome(); });
      gc.appendChild(ch);
    });
    panel.appendChild(gc);
    panel.appendChild(el("div", "tl-q", "Where are you starting?"));
    const lc = el("div", "tl-chips");
    DATA.levels.forEach(lv => {
      const ch = el("button", "chip sm" + (p.level === lv.key ? " sel" : ""), `<span class="chip-label">${lv.label}</span>`);
      ch.addEventListener("click", () => { savePrefs(Object.assign({}, p, { level: lv.key })); renderHome(); });
      lc.appendChild(ch);
    });
    panel.appendChild(lc);
    tb.appendChild(panel);
    app.appendChild(tb);

    const sum = el("div", "path-summary");
    const metaBits = [firstStage ? `starts at stage ${firstStage.stage.n}` : "",
      off ? `${off} more in Library` : ""].filter(Boolean);
    sum.innerHTML =
      `<div class="ps-row"><span class="ps-label">Your path</span><span class="ps-meta">${metaBits.join(" · ")}</span></div>` +
      `<div class="ps-big"><span class="ps-n">${N}</span> lessons on your path</div>` +
      `<div class="ps-bar"><div style="width:${pct}%"></div></div>` +
      `<div class="ps-mast">${masteredCount} of ${N} mastered · ${pct}%</div>`;
    if (nextId && DATA.batches[nextId]) {
      const nb = el("button", "btn nextup", `Next up: ${DATA.batches[nextId].title} →`);
      nb.addEventListener("click", () => renderBatch(nextId));
      sum.appendChild(nb);
    }
    app.appendChild(sum);

    if (DATA.primer) {
      const pr = el("button", "primer-card",
        `<span class="pr-badge">Stage 0</span>` +
        `<span class="pr-body"><span class="pr-title">${DATA.primer.title}</span>` +
        `<span class="pr-sub">A 5-min primer — the decision-intelligence mindset. No quiz.</span></span>` +
        `<span class="pr-arrow">→</span>`);
      pr.addEventListener("click", () => renderBatch("stage0"));
      app.appendChild(pr);
    }

    const wrap = el("div", "stage-list");
    statuses.forEach(({ stage, status }) => {
      const onpath = status === "core" || status === "skim";
      const stEl = el("div", "stage st-" + status + (onpath ? " open" : ""));
      const cnt = stage.batches.filter(id => DATA.batches[id]).length;
      const head = el("button", "stage-head",
        `<span class="st-chevron">▶</span>` +
        `<span class="st-num">${stage.n}</span>` +
        `<span class="st-main"><span class="st-name">${stage.name}</span>` +
        `<span class="st-tagline">${stage.tagline}</span></span>` +
        `<span class="st-count">${cnt} lesson${cnt > 1 ? "s" : ""}</span>` +
        `<span class="stage-tag ${status}">${STATUS_LABEL[status] || status}</span>`);
      head.addEventListener("click", () => stEl.classList.toggle("open"));
      stEl.appendChild(head);

      const ls = el("div", "stage-lessons");
      stage.batches.forEach(id => {
        const b = DATA.batches[id];
        if (!b) return;
        const isNext = id === nextId && onpath;
        const card = el("button", "batch-card lesson" + (onpath ? "" : " dim") + (isNext ? " isnext" : ""));
        const total = b.questions.length;
        const nConcepts = b.review && b.review.concepts ? b.review.concepts.length : 0;
        const meta = nConcepts ? `Review (${nConcepts}) + ${total} Q` : `${total} questions`;
        card.innerHTML =
          `<div class="bc-top">` + (isNext ? `<span class="bc-next">Next up</span>` : "") +
          `<span class="bc-title">${b.title}</span></div>` +
          `<div class="bc-blurb">${b.blurb}</div>` +
          `<div class="bc-foot"><span class="bc-meta">${meta}</span>${scorePill(id, scores)}</div>`;
        card.addEventListener("click", () => renderBatch(id));
        ls.appendChild(card);
      });
      stEl.appendChild(ls);
      wrap.appendChild(stEl);
    });
    app.appendChild(wrap);
  }

  /* ============================================================
     ONBOARDING — two chips that tailor the path
     ============================================================ */
  function renderOnboarding(opts) {
    opts = opts || {};
    S = null;
    window.scrollTo(0, 0);
    app.innerHTML = "";
    const cur = getPrefs() || { goal: "explore", level: "new", view: "path" };
    let goal = opts.edit ? cur.goal : null;
    let level = opts.edit ? cur.level : null;

    const box = el("div", "onb");
    box.appendChild(el("div", "onb-h", opts.edit ? "Update your path" : "Let’s tailor your path"));

    box.appendChild(el("div", "onb-q", "What do you want to be able to do?"));
    const g = el("div", "onb-chips");
    DATA.goals.forEach(go => {
      const ch = el("button", "chip" + (goal === go.key ? " sel" : ""),
        `<span class="chip-label">${go.label}</span><span class="chip-sub">${go.sub}</span>`);
      ch.addEventListener("click", () => {
        goal = go.key;
        g.querySelectorAll(".chip").forEach(x => x.classList.remove("sel"));
        ch.classList.add("sel"); upd();
      });
      g.appendChild(ch);
    });
    box.appendChild(g);

    box.appendChild(el("div", "onb-q", "Where are you starting?"));
    const l = el("div", "onb-chips lvl");
    DATA.levels.forEach(lv => {
      const ch = el("button", "chip" + (level === lv.key ? " sel" : ""),
        `<span class="chip-label">${lv.label}</span>`);
      ch.addEventListener("click", () => {
        level = lv.key;
        l.querySelectorAll(".chip").forEach(x => x.classList.remove("sel"));
        ch.classList.add("sel"); upd();
      });
      l.appendChild(ch);
    });
    box.appendChild(l);

    const bar = el("div", "onb-bar");
    const skip = el("button", "btn ghost", opts.edit ? "Cancel" : "Skip — explore everything");
    skip.addEventListener("click", () => {
      if (opts.edit) { renderHome(); }
      else { savePrefs({ onboarded: true, goal: "explore", level: "new", view: "path" }); renderHome(); }
    });
    const go = el("button", "btn", "See my path →");
    go.disabled = !(goal && level);
    go.addEventListener("click", () => {
      savePrefs(Object.assign({}, cur, { onboarded: true, goal: goal, level: level, view: "path" }));
      renderHome();
    });
    bar.appendChild(skip); bar.appendChild(go);
    box.appendChild(bar);
    app.appendChild(box);

    function upd() { go.disabled = !(goal && level); }
  }

  /* ============================================================
     BATCH / REVIEW PAGE  (study material, then a CTA into the quiz)
     ============================================================ */
  function renderBatch(batchId) {
    S = null;
    const b = DATA.batches[batchId];
    if (!b) { renderHome(); return; }
    window.scrollTo(0, 0);
    app.innerHTML = "";

    // top bar
    const top = el("div", "quiz-top");
    const back = el("button", "btn-back", "← Back");
    back.addEventListener("click", renderHome);
    top.appendChild(back);
    const tb = el("div", "quiz-titlebox");
    tb.appendChild(el("div", "qt-name", b.title));
    tb.appendChild(el("div", "qt-prog", b.primer ? "A quick primer — no quiz" : "Review, then test yourself"));
    top.appendChild(tb);
    app.appendChild(top);

    // intro card
    const intro = el("div", "batch-intro-card");
    intro.appendChild(el("div", "bi-title", b.title));
    intro.appendChild(el("div", "bi-blurb", b.blurb));
    app.appendChild(intro);

    // review accordion
    const rev = b.review;
    if (rev && rev.concepts && rev.concepts.length) {
      const head = el("div", "review-section-head");
      head.appendChild(el("h3", null, "Key concepts"));
      const toggleAll = el("button", "toggle-all", "Expand all");
      head.appendChild(toggleAll);
      app.appendChild(head);

      if (rev.intro) app.appendChild(el("div", "review-intro", rev.intro));

      const list = el("div", "concept-list");
      rev.concepts.forEach((c, ci) => {
        const card = el("div", "concept" + (ci === 0 ? " open" : ""));
        const hbtn = el("button", "concept-head");
        hbtn.innerHTML =
          `<span class="c-chevron">▶</span><span class="c-title">${c.title}</span>` +
          (c.tag ? `<span class="c-tag">${c.tag}</span>` : "");
        hbtn.addEventListener("click", () => card.classList.toggle("open"));
        card.appendChild(hbtn);

        const body = el("div", "concept-body");
        body.appendChild(el("div", "c-text", c.body || ""));
        if (c.visual) {
          const fig = el("div", "c-visual");
          fig.innerHTML = c.visual + (c.caption ? `<div class="c-caption">${c.caption}</div>` : "");
          body.appendChild(fig);
        }
        if (c.example) {
          const ex = el("div", "c-example");
          ex.innerHTML = `<span class="c-example-label">Example</span>${c.example}`;
          body.appendChild(ex);
        }
        if (c.takeaway) {
          const tk = el("div", "c-takeaway");
          tk.innerHTML = `<span class="c-takeaway-label">Why it matters</span>${c.takeaway}`;
          body.appendChild(tk);
        }
        card.appendChild(body);
        list.appendChild(card);
      });
      app.appendChild(list);

      toggleAll.addEventListener("click", () => {
        const cards = list.querySelectorAll(".concept");
        const anyClosed = Array.prototype.some.call(cards, c => !c.classList.contains("open"));
        cards.forEach(c => c.classList.toggle("open", anyClosed));
        toggleAll.textContent = anyClosed ? "Collapse all" : "Expand all";
      });
    }

    // quiz CTA — or, for the review-only primer, a path footer
    const total = b.questions ? b.questions.length : 0;
    if (b.primer || !total) {
      const cta = el("div", "quiz-cta");
      const ctaText = el("div", "qc-text");
      ctaText.innerHTML =
        `<div class="qc-h">That’s the lens.</div>` +
        `<div class="qc-sub">The rest of your path puts these four moves to work.</div>`;
      cta.appendChild(ctaText);
      const bk = el("button", "btn", "Back to your path →");
      bk.addEventListener("click", renderHome);
      cta.appendChild(bk);
      app.appendChild(cta);
    } else {
      const scores = loadScores();
      const sc = scores[batchId];
      const cta = el("div", "quiz-cta");
      const ctaText = el("div", "qc-text");
      ctaText.innerHTML =
        `<div class="qc-h">Test your comprehension</div>` +
        `<div class="qc-sub">${total} questions, easy → advanced, mixed formats with worked explanations.</div>` +
        (sc ? `<div class="qc-best">Best so far: ${sc.best}/${sc.total}</div>` : "");
      cta.appendChild(ctaText);
      const startBtn = el("button", "btn", "Start the " + total + " questions →");
      startBtn.addEventListener("click", () => startBatch(batchId));
      cta.appendChild(startBtn);
      app.appendChild(cta);
    }

    typeset(app);
  }

  /* ============================================================
     QUIZ
     ============================================================ */
  function startBatch(batchId) {
    const b = DATA.batches[batchId];
    const questions = b.questions.slice(); // keep given (difficulty) order
    S = {
      batchId,
      title: b.title,
      questions,
      prepped: questions.map(prep),
      i: 0,
      selections: questions.map(() => null),
      graded: questions.map(() => false),
      correct: questions.map(() => false),
      correctCount: 0
    };
    window.scrollTo(0, 0);
    renderQuestion();
  }

  function renderQuestion() {
    const q = S.questions[S.i];
    const p = S.prepped[S.i];
    const total = S.questions.length;
    app.innerHTML = "";

    // top bar
    const top = el("div", "quiz-top");
    const back = el("button", "btn-back", "← Review");
    back.addEventListener("click", () => { if (confirmLeave()) renderBatch(S.batchId); });
    top.appendChild(back);
    const tb = el("div", "quiz-titlebox");
    tb.appendChild(el("div", "qt-name", S.title));
    tb.appendChild(el("div", "qt-prog", `Question ${S.i + 1} of ${total} · score ${S.correctCount}`));
    top.appendChild(tb);
    app.appendChild(top);

    // progress
    const pb = el("div", "progress-bar");
    pb.appendChild(el("div")).style.width = ((S.i) / total * 100) + "%";
    app.appendChild(pb);

    // card
    const card = el("div", "qcard");

    const tags = el("div", "qtags");
    tags.appendChild(el("span", "tag type", TYPE_LABEL[q.type] || q.type));
    tags.appendChild(el("span", "tag " + (q.framing || "conceptual"), q.framing || "conceptual"));
    const diff = el("span", "tag diff");
    diff.innerHTML = `<span class="diff-dots">${diffDots(q.difficulty)}</span>`;
    tags.appendChild(diff);
    card.appendChild(tags);

    card.appendChild(el("div", "qprompt", q.prompt));

    if (q.type === "qc") {
      const qa = el("div", "qhint",
        `<b style="color:var(--text)">Quantity A:</b> ${q.quantityA} &nbsp;&nbsp;|&nbsp;&nbsp; ` +
        `<b style="color:var(--text)">Quantity B:</b> ${q.quantityB}`);
      qa.style.fontSize = "1rem"; qa.style.color = "var(--text-dim)";
      card.appendChild(qa);
    }
    if (q.type === "ms") {
      card.appendChild(el("div", "qhint", "Select all that apply, then submit."));
    }

    // answer area
    const ansArea = el("div", "ansarea");
    if (p.kind === "choice") renderChoices(ansArea, q, p);
    else renderNumeric(ansArea, q, p);
    card.appendChild(ansArea);

    // feedback (hidden until graded)
    const fb = el("div", "feedback");
    fb.id = "feedback";
    card.appendChild(fb);

    // action bar
    const bar = el("div", "actionbar");
    const hint = el("span", "kbd-hint");
    hint.innerHTML = p.kind === "choice"
      ? `<span class="kbd">1</span>–<span class="kbd">${p.display.length}</span> pick · <span class="kbd">Enter</span> submit`
      : `<span class="kbd">Enter</span> submit`;
    bar.appendChild(hint);
    const submitBtn = el("button", "btn", "Submit");
    submitBtn.id = "submitBtn";
    submitBtn.disabled = true;
    submitBtn.addEventListener("click", onSubmit);
    bar.appendChild(submitBtn);
    card.appendChild(bar);

    app.appendChild(card);

    // restore prior state if already graded (review when navigating back)
    if (S.graded[S.i]) applyGradedView();

    typeset(card);
  }

  function renderChoices(area, q, p) {
    const wrap = el("div", "options");
    p.display.forEach((label, idx) => {
      const o = el("button", "opt" + (p.multi ? " ms" : ""));
      o.dataset.idx = idx;
      const key = p.multi ? "▢" : String(idx + 1);
      o.innerHTML = `<span class="opt-key">${key}</span><span class="opt-body">${label}</span>`;
      o.addEventListener("click", () => onPick(idx));
      wrap.appendChild(o);
    });
    area.appendChild(wrap);
  }

  function renderNumeric(area, q, p) {
    const row = el("div", "numeric-row");
    row.id = "numRow";
    const inp = el("input");
    inp.type = "text";
    inp.id = "numInput";
    inp.setAttribute("inputmode", "decimal");
    inp.placeholder = "your answer";
    inp.autocomplete = "off";
    inp.addEventListener("input", () => {
      S.selections[S.i] = inp.value.trim();
      document.getElementById("submitBtn").disabled = inp.value.trim() === "" || S.graded[S.i];
    });
    row.appendChild(inp);
    if (p.unit) row.appendChild(el("span", "unit", p.unit));
    area.appendChild(row);
    if (q.hint) area.appendChild(el("div", "qhint", q.hint));
    setTimeout(() => inp.focus(), 30);
  }

  /* ---------- selection ---------- */
  function onPick(idx) {
    if (S.graded[S.i]) return;
    const q = S.questions[S.i];
    const opts = app.querySelectorAll(".opt");
    if (q.type === "ms") {
      let sel = S.selections[S.i] || [];
      sel = sel.includes(idx) ? sel.filter(x => x !== idx) : sel.concat(idx);
      S.selections[S.i] = sel;
      opts.forEach(o => {
        const i = +o.dataset.idx;
        o.classList.toggle("selected", sel.includes(i));
        o.querySelector(".opt-key").textContent = sel.includes(i) ? "✓" : "▢";
      });
      document.getElementById("submitBtn").disabled = sel.length === 0;
    } else {
      S.selections[S.i] = idx;
      opts.forEach(o => o.classList.toggle("selected", +o.dataset.idx === idx));
      document.getElementById("submitBtn").disabled = false;
    }
  }

  /* ---------- grading ---------- */
  function gradeCurrent() {
    const q = S.questions[S.i];
    const p = S.prepped[S.i];
    if (p.kind === "numeric") {
      const raw = (S.selections[S.i] || "").toString().replace(/,/g, "").trim();
      const val = parseFloat(raw);
      if (isNaN(val)) return false;
      return Math.abs(val - p.answer) <= (p.tolerance + 1e-9);
    }
    const sel = q.type === "ms" ? (S.selections[S.i] || []) : [S.selections[S.i]];
    const selSet = new Set(sel);
    if (selSet.size !== p.correctSet.size) return false;
    for (const c of p.correctSet) if (!selSet.has(c)) return false;
    return true;
  }

  function onSubmit() {
    if (!S.graded[S.i]) {
      const ok = gradeCurrent();
      S.graded[S.i] = true;
      S.correct[S.i] = ok;
      if (ok) S.correctCount++;
      applyGradedView();
      const sub = document.getElementById("submitBtn");
      sub.textContent = (S.i === S.questions.length - 1) ? "See results" : "Next →";
      sub.disabled = false;
      // update running score label
      const prog = app.querySelector(".qt-prog");
      if (prog) prog.textContent = `Question ${S.i + 1} of ${S.questions.length} · score ${S.correctCount}`;
    } else {
      next();
    }
  }

  function applyGradedView() {
    const q = S.questions[S.i];
    const p = S.prepped[S.i];
    const ok = S.correct[S.i];

    if (p.kind === "choice") {
      const sel = q.type === "ms" ? (S.selections[S.i] || []) : [S.selections[S.i]];
      const selSet = new Set(sel);
      app.querySelectorAll(".opt").forEach(o => {
        const i = +o.dataset.idx;
        o.classList.add("locked");
        const isCorrect = p.correctSet.has(i);
        const isSel = selSet.has(i);
        if (isCorrect) o.classList.add("correct");
        if (isSel && !isCorrect) o.classList.add("wrong");
        if (isCorrect && !o.querySelector(".mark")) o.appendChild(el("span", "mark", "✓"));
        else if (isSel && !isCorrect) o.appendChild(el("span", "mark", "✗"));
      });
    } else {
      const row = document.getElementById("numRow");
      const inp = document.getElementById("numInput");
      if (row) row.classList.add(ok ? "correct" : "wrong");
      if (inp) inp.disabled = true;
    }

    const fb = document.getElementById("feedback");
    fb.className = "feedback show " + (ok ? "ok" : "no");
    let answerLine = "";
    if (!ok) {
      if (p.kind === "numeric") {
        answerLine = `<div class="fb-expl" style="margin-bottom:8px"><b>Answer:</b> ${p.answer}${p.unit ? " " + p.unit : ""}` +
          (p.tolerance ? ` &nbsp;(±${p.tolerance})` : "") + `</div>`;
      }
    }
    fb.innerHTML =
      `<div class="fb-head">${ok ? "✓ Correct" : "✗ Not quite"}</div>` +
      answerLine +
      `<div class="fb-expl">${q.explanation}</div>` +
      (q.ref ? `<div class="fb-ref">Topic: ${q.ref}</div>` : "");
    typeset(fb);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function next() {
    if (S.i === S.questions.length - 1) { finish(); return; }
    S.i++;
    window.scrollTo(0, 0);
    renderQuestion();
  }

  function confirmLeave() {
    const anyGraded = S.graded.some(Boolean);
    const done = S.graded.every(Boolean);
    if (!anyGraded || done) return true;
    return window.confirm("Leave this batch? Progress on it won't be saved.");
  }

  /* ============================================================
     RESULTS
     ============================================================ */
  function finish() {
    const total = S.questions.length;
    const score = S.correctCount;
    saveScore(S.batchId, score, total);
    window.scrollTo(0, 0);
    app.innerHTML = "";

    const top = el("div", "quiz-top");
    const back = el("button", "btn-back", "← Batches");
    back.addEventListener("click", renderHome);
    top.appendChild(back);
    const tb = el("div", "quiz-titlebox");
    tb.appendChild(el("div", "qt-name", S.title));
    tb.appendChild(el("div", "qt-prog", "Results"));
    top.appendChild(tb);
    app.appendChild(top);

    const pct = Math.round(score / total * 100);
    const hero = el("div", "results-hero");
    const R = 60, C = 2 * Math.PI * R;
    const off = C * (1 - score / total);
    const color = pct >= 80 ? "var(--good)" : pct >= 50 ? "var(--warn)" : "var(--bad)";
    hero.innerHTML =
      `<div class="score-ring">
         <svg width="132" height="132" viewBox="0 0 132 132">
           <circle cx="66" cy="66" r="${R}" fill="none" stroke="var(--bg-elev2)" stroke-width="10"/>
           <circle cx="66" cy="66" r="${R}" fill="none" stroke="${color}" stroke-width="10"
             stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}"/>
         </svg>
         <div class="ring-num">${score}/${total}</div>
       </div>
       <h2>${verdict(pct)}</h2>
       <div class="verdict">${pct}% on this batch</div>`;
    app.appendChild(hero);

    // review
    const list = el("div", "review-list");
    S.questions.forEach((q, qi) => {
      const p = S.prepped[qi];
      const ok = S.correct[qi];
      const item = el("div", "review-item " + (ok ? "ok" : "no"));
      const yours = formatAnswer(q, p, S.selections[qi], "yours");
      const corr = formatAnswer(q, p, null, "correct");
      item.innerHTML =
        `<div class="ri-q"><span class="ri-n">Q${qi + 1}</span>${q.prompt}</div>` +
        (q.type === "qc" ? `<div class="ri-line"><span class="ri-label">A vs B:</span> A) ${q.quantityA} · B) ${q.quantityB}</div>` : "") +
        `<div class="ri-line"><span class="ri-label">Your answer:</span> <span class="ri-yours ${ok ? "" : "no"}">${yours}</span></div>` +
        (ok ? "" : `<div class="ri-line"><span class="ri-label">Correct:</span> <span class="ri-correct">${corr}</span></div>`) +
        `<div class="ri-expl">${q.explanation}${q.ref ? ` <span style="color:var(--text-faint)">(${q.ref})</span>` : ""}</div>`;
      list.appendChild(item);
    });
    app.appendChild(list);

    const bar = el("div", "actionbar");
    bar.style.marginTop = "28px";
    const batchId = S.batchId;
    const homeBtn = el("button", "btn ghost", "← All batches");
    homeBtn.addEventListener("click", renderHome);
    const reviewBtn = el("button", "btn ghost", "Review concepts");
    reviewBtn.addEventListener("click", () => renderBatch(batchId));
    const retry = el("button", "btn", "Retry quiz ↻");
    retry.addEventListener("click", () => startBatch(batchId));
    const leftGroup = el("div");
    leftGroup.style.display = "flex";
    leftGroup.style.gap = "10px";
    leftGroup.appendChild(homeBtn);
    leftGroup.appendChild(reviewBtn);
    bar.appendChild(leftGroup);
    bar.appendChild(retry);
    app.appendChild(bar);

    typeset(app);
  }

  function verdict(pct) {
    if (pct === 100) return "Flawless 🎯";
    if (pct >= 80) return "Strong command 💪";
    if (pct >= 60) return "Solid — a few gaps";
    if (pct >= 40) return "Worth another pass";
    return "Review the section, then retry";
  }

  function formatAnswer(q, p, selection, which) {
    if (p.kind === "numeric") {
      if (which === "correct") return `${p.answer}${p.unit ? " " + p.unit : ""}`;
      const v = (selection == null || selection === "") ? "—" : selection;
      return `${v}${p.unit && selection ? " " + p.unit : ""}`;
    }
    // choice
    const labels = p.display;
    if (which === "correct") {
      return [...p.correctSet].sort((a, b) => a - b).map(i => labels[i]).join("; ");
    }
    let sel = q.type === "ms" ? (selection || []) : (selection == null ? [] : [selection]);
    if (!sel.length) return "—";
    return sel.map(i => labels[i]).join("; ");
  }

  /* ============================================================
     keyboard
     ============================================================ */
  document.addEventListener("keydown", (e) => {
    if (!S) return;
    const tag = (e.target.tagName || "").toLowerCase();
    const inField = tag === "input" || tag === "textarea";
    const q = S.questions[S.i];
    const p = S.prepped[S.i];
    if (!q) return;

    if (e.key === "Enter") {
      const sub = document.getElementById("submitBtn");
      if (sub && !sub.disabled) { e.preventDefault(); onSubmit(); }
      return;
    }
    if (inField) return; // let typing through for numeric
    if (p.kind === "choice" && !S.graded[S.i]) {
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= p.display.length) {
        e.preventDefault();
        onPick(n - 1);
        if (q.type !== "ms") {
          // single-choice: number selects; Enter still needed to submit
        }
      }
    }
  });

  /* ---------- reset ---------- */
  document.getElementById("resetScores").addEventListener("click", () => {
    if (window.confirm("Clear all saved scores?")) {
      localStorage.removeItem(LS_KEY);
      renderHome();
    }
  });

  /* ---------- theme toggle (light default; dark persisted) ---------- */
  (function () {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
    const paint = () => { btn.textContent = isDark() ? "☀" : "☾"; };
    paint();
    btn.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      try { localStorage.setItem("mlq_theme", next); } catch (e) {}
      paint();
    });
  })();

  /* ---------- boot ---------- */
  if (!DATA || !DATA.tracks) {
    app.innerHTML = '<div class="intro">Could not load questions.js.</div>';
  } else {
    const p = getPrefs();
    if (!p || !p.onboarded) renderOnboarding();
    else renderHome();
  }
})();
