/* Review: ML Foundations & Generalization (ML-Fundamentals.md §0–§1) */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["ml-foundations"] = {
  intro: "The vocabulary the rest of the document is built on: what learning <i>is</i>, the three paradigms, how models generalize (or fail to), and the shared toolkit (losses, information theory, the exponential family). Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "The three paradigms of learning",
      tag: "core",
      body: "<p>Machine learning improves at a task <b>T</b> via experience <b>E</b> measured by <b>P</b> (Mitchell). The probabilistic view treats every unknown — predictions and parameters alike — as a random variable. Three paradigms differ in the <i>signal</i> they learn from:</p><ul><li><b>Supervised</b> — labeled pairs $(\\boldsymbol{x},y)$; learn $f:\\mathcal{X}\\to\\mathcal{Y}$ that <i>generalizes</i>.</li><li><b>Unsupervised</b> — unlabeled $\\boldsymbol{x}$ only; discover structure / density $p(\\boldsymbol{x})$.</li><li><b>Reinforcement</b> — occasional, often delayed reward; hard credit assignment.</li></ul><p>LeCun's <i>cake</i> analogy ranks them by information per sample.</p>",
      visual: `<svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="22" style="fill:var(--text)" font-size="13" font-weight="700">Information per sample (LeCun's cake)</text>
        <g font-size="12">
          <text x="10" y="58">Unsupervised</text>
          <rect x="120" y="46" width="380" height="18" rx="3" style="fill:var(--accent)"/>
          <text x="10" y="84" >Supervised</text>
          <rect x="120" y="72" width="150" height="18" rx="3" style="fill:var(--good)"/>
          <text x="10" y="110">RL</text>
          <rect x="120" y="98" width="36" height="18" rx="3" style="fill:var(--warn)"/>
        </g>
        <g font-size="10.5" style="fill:var(--text-faint)">
          <text x="505" y="60" text-anchor="end" style="fill:#04101f">millions of bits</text>
          <text x="275" y="86">10–10⁴ bits</text>
          <text x="162" y="112">a few bits</text>
        </g>
        <text x="10" y="150" style="fill:var(--text-dim)" font-size="11">"Cake" = unsupervised (the bulk), "icing" = supervised, "cherry" = RL.</text>
      </svg>`,
      caption: "More signal per sample on the left; RL gets the least, only occasionally.",
      example: "A spam filter trained on emails labeled spam/not-spam is <b>supervised</b>; grouping customers into segments with no labels is <b>unsupervised</b>; an agent learning to play a game from win/lose rewards is <b>reinforcement</b> learning."
    },
    {
      title: "Generalization & the bias–variance tradeoff",
      tag: "core",
      body: "<p>The goal is low <b>population risk</b> on unseen data, not low training error. As model capacity grows, training error falls monotonically but test error traces a <b>U</b>: high on the left (<b>underfitting</b> / high bias) and high on the right (<b>overfitting</b> / high variance, large generalization gap).</p><p>Formally MSE $=$ bias$^2$ + variance, so a biased model can win if it cuts variance enough.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="55" y1="20" x2="55" y2="200" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="200" x2="495" y2="200" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="232" text-anchor="middle" font-size="12">model complexity →</text>
        <text x="20" y="110" font-size="12" transform="rotate(-90 20 110)" text-anchor="middle">error</text>
        <path d="M70,80 C180,140 320,166 485,174" fill="none" class="vx-good" stroke-width="2.5"/>
        <path d="M70,72 C165,140 255,158 305,158 C380,158 435,112 485,58" fill="none" class="vx-bad" stroke-width="2.5"/>
        <line x1="305" y1="200" x2="305" y2="58" stroke-dasharray="4 4" class="vx-grid" stroke-width="1"/>
        <circle cx="305" cy="158" r="4" style="fill:var(--bad)"/>
        <text x="315" y="151" font-size="11" style="fill:var(--warn)">sweet spot</text>
        <text x="100" y="64" font-size="11" style="fill:var(--text-dim)">underfit</text>
        <text x="432" y="46" font-size="11" style="fill:var(--text-dim)">overfit</text>
        <g font-size="11"><rect x="330" y="205" width="12" height="3" style="fill:var(--good)"/><text x="348" y="212">train</text><rect x="400" y="205" width="12" height="3" style="fill:var(--bad)"/><text x="418" y="212">test</text></g>
      </svg>`,
      caption: "Training error falls forever; test error is U-shaped — the empirical signature of the tradeoff.",
      example: "Fitting polynomials to data: degree 1 underfits (high bias); degree 15 hits every training point but oscillates wildly on new points (high variance). A moderate degree minimizes test error."
    },
    {
      title: "Parametric vs non-parametric models",
      tag: "core",
      body: "<p><b>Parametric</b> models have a fixed parameter count independent of $N$ and a strong inductive bias (e.g. linear/logistic regression) — fast at test time, good against the curse of dimensionality. <b>Non-parametric</b> models effectively <i>are</i> the training set: complexity grows with $N$, weaker bias, slow for large $N$ (e.g. KNN, kernel density estimation).</p>",
      example: "K-nearest-neighbors stores all data and predicts from the $K$ closest points: $K=1$ gives a jagged Voronoi boundary (high variance); larger $K$ smooths it (more bias). It needs no training but is $O(N)$ per query."
    },
    {
      title: "Loss, empirical risk & maximum likelihood",
      tag: "core",
      body: "<p>A <b>loss</b> $\\ell(y,\\hat y)$ scores predictions (0–1, squared, cross-entropy, hinge). <b>Empirical-risk minimization</b> picks $\\hat{\\boldsymbol\\theta}=\\arg\\min\\frac1N\\sum_n\\ell(y_n,f(\\boldsymbol{x}_n;\\boldsymbol\\theta))$. <b>MLE</b> is just ERM with the negative-log-likelihood loss.</p><p>Key identity: under Gaussian noise, $\\text{NLL}=\\frac{1}{2\\sigma^2}\\text{MSE}+\\text{const}$, so <b>MLE = least squares</b>.</p>",
      example: "For $p(y\\mid \\boldsymbol{x})=\\mathcal{N}(f(\\boldsymbol{x}),\\sigma^2)$, maximizing likelihood is identical to minimizing mean-squared error — the probabilistic justification for ordinary least squares."
    },
    {
      title: "The curse of dimensionality",
      tag: "intuition",
      body: "<p>In high dimensions data becomes desperately sparse. To capture a fraction $f$ of the data in an axis-aligned hypercube of edge $e$ in $D$ dims, $e_D(f)=f^{1/D}$. Neighborhoods stop being local, which breaks distance-based methods and motivates parametric models with strong priors.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="55" y1="20" x2="55" y2="200" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="200" x2="495" y2="200" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="232" text-anchor="middle" font-size="12">dimension D →</text>
        <text x="22" y="110" font-size="12" transform="rotate(-90 22 110)" text-anchor="middle">edge length e</text>
        <text x="40" y="55" font-size="10" text-anchor="end">1.0</text>
        <text x="40" y="200" font-size="10" text-anchor="end">0</text>
        <path d="M70,196 C120,150 180,105 250,85 C330,66 420,57 485,52" fill="none" class="vx-accent" stroke-width="2.5"/>
        <line x1="250" y1="200" x2="250" y2="85" stroke-dasharray="4 4" class="vx-grid"/>
        <circle cx="250" cy="85" r="4" style="fill:var(--accent)"/>
        <text x="258" y="80" font-size="11" style="fill:var(--accent)">D=10 → e ≈ 0.8</text>
        <text x="70" y="190" font-size="10" style="fill:var(--text-faint)">D=1</text>
      </svg>`,
      caption: "Capturing 10% of the data (f = 0.1): the cube edge needed climbs toward the full range as D grows.",
      example: "For $D=10$, $f=0.10$: $e=0.1^{1/10}\\approx 0.80$ — you must span 80% of <i>every</i> axis to enclose just 10% of the points, so 'nearby' is no longer near."
    },
    {
      title: "Information theory: entropy, cross-entropy, KL",
      tag: "toolkit",
      body: "<p>Entropy $\\mathbb{H}(X)=-\\sum_k p_k\\log p_k$ (max at uniform). Cross-entropy $\\mathbb{H}_{ce}(p,q)$ is the classification loss. KL divergence $D_{\\text{KL}}(p\\|q)=\\mathbb{H}_{ce}(p,q)-\\mathbb{H}(p)\\ge 0$, so minimizing cross-entropy = minimizing forward KL = MLE.</p><p><b>Forward</b> KL $D_{\\text{KL}}(p\\|q)$ is mode-<i>covering</i>; <b>reverse</b> KL $D_{\\text{KL}}(q\\|p)$ (used in VI/VAEs) is mode-<i>seeking</i>.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700">Forward KL (p‖q)</text>
        <text x="385" y="20" text-anchor="middle" font-size="12" font-weight="700">Reverse KL (q‖p)</text>
        <g transform="translate(20,35)">
          <path d="M5,150 C45,150 55,40 90,40 C125,40 135,150 135,150 C175,150 185,55 220,55 C255,55 260,150 260,150" fill="none" class="vx-grid" stroke-width="2"/>
          <path d="M5,150 C70,150 90,75 132,75 C175,75 195,150 260,150" fill="none" class="vx-accent" stroke-width="2.5"/>
          <text x="130" y="178" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">q spreads to cover both modes</text>
        </g>
        <g transform="translate(260,35)">
          <path d="M5,150 C45,150 55,40 90,40 C125,40 135,150 135,150 C175,150 185,55 220,55 C255,55 260,150 260,150" fill="none" class="vx-grid" stroke-width="2"/>
          <path d="M40,150 C70,150 78,45 90,45 C103,45 112,150 150,150" fill="none" class="vx-accent" stroke-width="2.5"/>
          <text x="130" y="178" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">q locks onto one mode</text>
        </g>
        <text x="260" y="218" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">grey = true bimodal p, blue = fitted q</text>
      </svg>`,
      caption: "Same target p, two divergences: forward KL averages over modes; reverse KL picks one and ignores the rest.",
      example: "Perplexity $=2^{\\mathbb{H}}$ is the 'effective number of outcomes': a uniform model over a 4-token vocabulary has $\\mathbb{H}=2$ bits and perplexity $4$."
    },
    {
      title: "Model selection: train / validation / test & CV",
      tag: "practice",
      body: "<p>Fit parameters on <b>train</b>, choose family/hyperparameters on <b>validation</b>, estimate generalization once on <b>test</b>. Reusing the test set to pick the best of many models silently fits to it and inflates the score. When data is scarce, <b>k-fold cross-validation</b> rotates the validation fold and averages.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">5-fold cross-validation</text>
        <g font-size="10.5">
          <text x="10" y="50" >fold 1</text><text x="10" y="80">fold 2</text><text x="10" y="110">fold 3</text><text x="10" y="140">fold 4</text><text x="10" y="170">fold 5</text>
        </g>
        <g>
          <!-- row builder: validation block is accent, others muted -->
          <g transform="translate(60,38)">
            <rect x="0"   y="0" width="80" height="18" rx="3" style="fill:var(--accent)"/><rect x="88"  y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="176" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="264" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="352" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/>
          </g>
          <g transform="translate(60,68)">
            <rect x="0"   y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="88"  y="0" width="80" height="18" rx="3" style="fill:var(--accent)"/><rect x="176" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="264" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="352" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/>
          </g>
          <g transform="translate(60,98)">
            <rect x="0"   y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="88"  y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="176" y="0" width="80" height="18" rx="3" style="fill:var(--accent)"/><rect x="264" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="352" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/>
          </g>
          <g transform="translate(60,128)">
            <rect x="0"   y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="88"  y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="176" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="264" y="0" width="80" height="18" rx="3" style="fill:var(--accent)"/><rect x="352" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/>
          </g>
          <g transform="translate(60,158)">
            <rect x="0"   y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="88"  y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="176" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="264" y="0" width="80" height="18" rx="3" style="fill:var(--bg-elev2)"/><rect x="352" y="0" width="80" height="18" rx="3" style="fill:var(--accent)"/>
          </g>
        </g>
        <g font-size="10.5"><rect x="60" y="190" width="12" height="12" rx="2" style="fill:var(--accent)"/><text x="78" y="200">validation</text><rect x="160" y="190" width="12" height="12" rx="2" style="fill:var(--bg-elev2)"/><text x="178" y="200">train</text></g>
      </svg>`,
      caption: "Each fold takes a turn as validation; the error is averaged over all five.",
      example: "With 1,000 points and limited data, 5-fold CV trains on 800 and validates on 200, five times, averaging the validation error to choose, say, the ridge penalty $\\lambda$."
    }
  ]
};
