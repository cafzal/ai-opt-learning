/* Review: Kernels, SVMs, Trees & Ensembles (ML-Fundamentals.md §6) */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["kernels-trees"] = {
  intro: "Two threads run through this section. First, <b>kernels</b>: a single trick — replacing inner products $\\boldsymbol{x}^\\top\\boldsymbol{x}'$ with a Mercer kernel $\\kappa$ — turns linear methods nonlinear and underpins KNN's cousins, kernel ridge regression, SVMs, and Gaussian processes (which add calibrated uncertainty). Second, <b>trees</b>: a single interpretable-but-unstable learner (CART) that becomes a tabular workhorse once you wrap it in an ensemble — bagging / random forests to cut variance, boosting to cut bias. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Instance-based learning & KNN",
      tag: "lazy",
      body: "<p><b>Lazy learning</b>: store the data, defer all work to query time. <b>KNN</b> classifies by majority vote of the $K$ nearest points and regresses by their average. Distance is Euclidean or <b>Mahalanobis</b> $d_{\\mathbf{M}}=\\sqrt{(\\boldsymbol{x}-\\boldsymbol{x}')^\\top\\mathbf{M}(\\boldsymbol{x}-\\boldsymbol{x}')}$; <b>deep metric learning</b> learns $\\mathbf{M}$ or an embedding via contrastive / triplet losses.</p><p>$K{=}1$ overfits — the prediction is a patchwork of <b>Voronoi cells</b>, one per training point. Tune $K$ by cross-validation. Cost is $O(N)$ per query (use kd-trees / LSH / FAISS), and it <b>fails in high dimensions</b> (curse of dimensionality: neighbors stop being near).</p>",
      example: "On a 2-D scatter, $K{=}1$ draws a jagged boundary that perfectly fences off every single training point (high variance); raising $K$ to 15 smooths the boundary and tolerates label noise (more bias). No model is fit until you ask for a prediction."
    },
    {
      title: "Mercer kernels & the kernel trick",
      tag: "core",
      body: "<p>A kernel $\\kappa$ is <b>Mercer / positive-definite</b> iff every Gram matrix $\\mathbf{K}$ (with $K_{ij}=\\kappa(\\boldsymbol{x}_i,\\boldsymbol{x}_j)$) is PSD. Equivalently $\\kappa(\\boldsymbol{x},\\boldsymbol{x}')=\\boldsymbol\\phi(\\boldsymbol{x})^\\top\\boldsymbol\\phi(\\boldsymbol{x}')$ for some — possibly infinite-dimensional — feature map $\\boldsymbol\\phi$. The <b>kernel trick</b>: compute inner products in that feature space <i>without ever forming</i> $\\boldsymbol\\phi$.</p><p>Common kernels: <b>RBF/Gaussian</b> $\\exp(-\\|\\boldsymbol{x}-\\boldsymbol{x}'\\|^2/2\\ell^2)$ (universal, infinitely smooth), <b>ARD</b> (per-dimension length scales → feature relevance), <b>polynomial</b> $(\\boldsymbol{x}^\\top\\boldsymbol{x}'+c)^d$ (finite feature map), <b>Matérn</b> (parameter $\\nu$ sets smoothness; $\\nu{\\to}\\infty$ recovers RBF), and string kernels for structured inputs. Sums, products, and positive scalings of PD kernels stay PD — so you can compose them.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">The kernel trick: lift 1-D → 2-D, then a line separates</text>
        <!-- left: 1-D non-separable -->
        <text x="20" y="56" font-size="11" style="fill:var(--text-dim)">1-D input x (not linearly separable)</text>
        <line x1="30" y1="90" x2="250" y2="90" class="vx-axis" stroke-width="1.5"/>
        <circle cx="50" cy="90" r="5" style="fill:var(--bad)"/>
        <circle cx="78" cy="90" r="5" style="fill:var(--bad)"/>
        <circle cx="120" cy="90" r="5" style="fill:var(--accent)"/>
        <circle cx="150" cy="90" r="5" style="fill:var(--accent)"/>
        <circle cx="180" cy="90" r="5" style="fill:var(--accent)"/>
        <circle cx="222" cy="90" r="5" style="fill:var(--bad)"/>
        <circle cx="248" cy="90" r="5" style="fill:var(--bad)"/>
        <text x="140" y="118" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">blue inside, red outside — no single cut works</text>
        <!-- arrow -->
        <text x="290" y="86" font-size="12" style="fill:var(--text-dim)">φ(x) = (x, x²)</text>
        <path d="M285,95 L330,95" class="vx-accent" stroke-width="2" marker-end="url(#ar)"/>
        <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--accent)"/></marker></defs>
        <!-- right: 2-D separable parabola -->
        <line x1="360" y1="40" x2="360" y2="210" class="vx-axis" stroke-width="1.5"/>
        <line x1="360" y1="210" x2="505" y2="210" class="vx-axis" stroke-width="1.5"/>
        <text x="432" y="234" text-anchor="middle" font-size="10.5">x</text>
        <text x="350" y="125" font-size="10.5" transform="rotate(-90 350 125)" text-anchor="middle">x²</text>
        <!-- separating line (roughly constant x²: blues below, reds above) -->
        <line x1="365" y1="152" x2="505" y2="148" stroke-dasharray="5 4" class="vx-good" stroke-width="2"/>
        <!-- points lifted onto parabola: inner (blue) low x² = valley bottom, outer (red) high x² = both ends up -->
        <circle cx="372" cy="76" r="4.5" style="fill:var(--bad)"/>
        <circle cx="388" cy="118" r="4.5" style="fill:var(--bad)"/>
        <circle cx="412" cy="177" r="4.5" style="fill:var(--accent)"/>
        <circle cx="432" cy="190" r="4.5" style="fill:var(--accent)"/>
        <circle cx="452" cy="177" r="4.5" style="fill:var(--accent)"/>
        <circle cx="476" cy="120" r="4.5" style="fill:var(--bad)"/>
        <circle cx="494" cy="70" r="4.5" style="fill:var(--bad)"/>
        <text x="432" y="60" text-anchor="middle" font-size="10.5" style="fill:var(--good)">linearly separable now</text>
      </svg>`,
      caption: "Points unseparable on the line become separable once mapped to (x, x²) — the kernel computes that separation's inner products implicitly.",
      example: "RBF corresponds to an infinite-dimensional $\\boldsymbol\\phi$, so you could never store it — yet $\\kappa(\\boldsymbol{x},\\boldsymbol{x}')=\\exp(-\\|\\boldsymbol{x}-\\boldsymbol{x}'\\|^2/2\\ell^2)$ is a one-line computation. That is the whole point of the trick."
    },
    {
      title: "Kernel ridge regression & the representer theorem",
      tag: "kernels",
      body: "<p>The <b>representer theorem</b> says the solution to a kernelized ridge problem is a weighted sum of kernels centered on the training points: $\\hat f(\\boldsymbol{x})=\\sum_i\\alpha_i\\,\\kappa(\\boldsymbol{x}_i,\\boldsymbol{x})$, with the dual weights $\\boldsymbol\\alpha=(\\mathbf{K}+\\lambda\\mathbf{I})^{-1}\\boldsymbol{y}$.</p><p>Two routes to the same fit: the <b>primal</b> costs $O(D^3)$ (in the feature dimension), the <b>dual</b> costs $O(N^3)$ (in the sample count). Use the dual when $D>N$ or when $D=\\infty$ (e.g. RBF). Unlike the SVM, the solution is <b>dense</b> — every $\\alpha_i$ is generally nonzero. <b>Kernel PCA</b> reuses the same machinery for nonlinear dimensionality reduction, via eigenvectors of the centered Gram matrix.</p>",
      example: "Fitting a wiggly 1-D curve with an RBF kernel: every training point contributes a bump $\\alpha_i\\kappa(\\boldsymbol{x}_i,\\cdot)$, and their sum interpolates the data. With $D=\\infty$ the primal is impossible, so the $O(N^3)$ dual is the only way."
    },
    {
      title: "Support vector machines (SVMs)",
      tag: "core",
      body: "<p>An SVM finds the separating hyperplane with the <b>widest margin</b>, $2/\\|\\boldsymbol{w}\\|$. The <b>soft-margin</b> primal adds slacks $\\xi_n$ and a penalty $C$: minimize $\\tfrac12\\|\\boldsymbol{w}\\|^2+C\\sum_n\\xi_n$ subject to $\\tilde y_n(\\boldsymbol{w}^\\top\\boldsymbol{x}_n+w_0)\\ge 1-\\xi_n$. The <b>dual</b> is a QP in $\\boldsymbol\\alpha$; KKT forces each point to either be ignored ($\\alpha_n=0$) or be a <b>support vector</b> on/inside the margin — and prediction uses only those.</p><p>An equivalent regularized <b>hinge-loss</b> form is $\\sum_n\\max(0,1-\\tilde y_n f_n)+\\lambda\\|\\boldsymbol{w}\\|^2$ with $\\lambda=1/2C$. Swap $\\boldsymbol{x}_i^\\top\\boldsymbol{x}_j$ for $\\kappa$ to get a <b>kernel SVM</b>; <b>SVR</b> uses the $\\epsilon$-insensitive loss. Probabilities come only via <b>Platt scaling</b> $\\sigma(af+b)$ (poorly calibrated). Key knob: <b>larger $C$ = narrower margin</b>, fewer violations. Hinge loss is exactly 0 once $\\tilde y\\eta>1$ (sparse SVs); log loss is always positive (dense, calibrated).</p>",
      visual: `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Maximum-margin classifier</text>
        <!-- margin lines (dashed) and decision boundary (solid) -->
        <line x1="120" y1="40" x2="380" y2="240" stroke-dasharray="5 4" class="vx-grid" stroke-width="1.2"/>
        <line x1="200" y1="40" x2="460" y2="240" stroke-dasharray="5 4" class="vx-grid" stroke-width="1.2"/>
        <line x1="160" y1="40" x2="420" y2="240" class="vx-accent" stroke-width="2.5"/>
        <!-- margin width arrow (perpendicular, spanning the two dashed margins) -->
        <line x1="223" y1="119" x2="253" y2="81" class="vx-good" stroke-width="1.5" marker-start="url(#a2)" marker-end="url(#a2)"/>
        <defs><marker id="a2" markerWidth="8" markerHeight="8" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--good)"/></marker></defs>
        <text x="300" y="66" font-size="11" style="fill:var(--good)">margin = 2/‖w‖</text>
        <!-- class A (blue, upper-left) -->
        <circle cx="95" cy="70" r="6" style="fill:var(--accent)"/>
        <circle cx="130" cy="110" r="6" style="fill:var(--accent)"/>
        <circle cx="80" cy="135" r="6" style="fill:var(--accent)"/>
        <circle cx="160" cy="180" r="6" style="fill:var(--accent)"/>
        <!-- support vector for class A: on the lower-left dashed line, circled -->
        <circle cx="250" cy="140" r="6" style="fill:var(--accent)"/>
        <circle cx="250" cy="140" r="11" class="vx-warn" fill="none" stroke-width="2"/>
        <!-- class B (red, lower-right) -->
        <circle cx="420" cy="95" r="6" style="fill:var(--bad)"/>
        <circle cx="450" cy="140" r="6" style="fill:var(--bad)"/>
        <circle cx="400" cy="175" r="6" style="fill:var(--bad)"/>
        <circle cx="370" cy="150" r="6" style="fill:var(--bad)"/>
        <!-- support vector for class B: on the upper-right dashed line, circled -->
        <circle cx="304" cy="120" r="6" style="fill:var(--bad)"/>
        <circle cx="304" cy="120" r="11" class="vx-warn" fill="none" stroke-width="2"/>
        <text x="350" y="250" font-size="10.5" style="fill:var(--warn)">circled = support vectors (define the margin)</text>
      </svg>`,
      caption: "Solid line is the decision boundary; the two dashed lines are the ±margin. Only the circled support vectors touch the margin and determine the fit.",
      example: "Increase $C$ and the optimizer tolerates fewer margin violations, so the boundary contorts to fit outliers and the margin narrows; small $C$ allows more slack and a wider, smoother margin. Because only support vectors matter, deleting any interior point changes nothing."
    },
    {
      title: "Gaussian processes (GPs)",
      tag: "core",
      body: "<p>A GP is a <b>distribution over functions</b>: any finite set of function values is jointly Gaussian, $f\\sim\\mathcal{GP}(m,\\kappa)$. For noisy regression with $\\mathbf{K}_\\sigma=\\mathbf{K}_{XX}+\\sigma_y^2\\mathbf{I}$, the posterior mean is $\\boldsymbol\\mu_*=\\mathbf{K}_{*X}\\mathbf{K}_\\sigma^{-1}\\boldsymbol{y}$ and covariance $\\boldsymbol\\Sigma_*=\\mathbf{K}_{**}-\\mathbf{K}_{*X}\\mathbf{K}_\\sigma^{-1}\\mathbf{K}_{X*}$.</p><p>The <b>mean equals kernel ridge regression</b> with $\\lambda=\\sigma_y^2$ — but the GP additionally returns a <b>predictive variance</b> (epistemic uncertainty that <i>grows away from the data</i>). Fit hyperparameters by maximizing the <b>log marginal likelihood</b> (data-fit − complexity), which costs an $O(N^3)$ Cholesky and is non-convex (use multi-restart). Scale via sparse/inducing-point GPs or random Fourier features. Versus an SVM (convex, sparse, no probabilities) or an RVM (non-convex, even sparser, probabilistic), the GP is non-sparse but gives <b>calibrated</b> uncertainty.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">GP posterior: mean ± 1.96σ, widening away from data</text>
        <line x1="40" y1="30" x2="40" y2="205" class="vx-axis" stroke-width="1.5"/>
        <line x1="40" y1="205" x2="500" y2="205" class="vx-axis" stroke-width="1.5"/>
        <text x="270" y="234" text-anchor="middle" font-size="11">x</text>
        <text x="22" y="118" font-size="11" transform="rotate(-90 22 118)" text-anchor="middle">f(x)</text>
        <!-- confidence band: pinches at each data point, bulges in the gaps and flares at the extrapolating ends -->
        <path d="M40,55 C90,95 110,124 150,130 C175,116 225,116 250,126 C285,114 325,114 360,125 C420,120 460,95 500,40
                 L500,150 C460,200 420,180 360,141 C325,152 285,152 250,142 C225,154 175,154 150,146 C110,160 90,185 40,200 Z"
              style="fill:var(--accent);opacity:0.16" stroke="none"/>
        <!-- mean curve -->
        <path d="M40,128 C90,148 110,135 150,138 C200,138 220,134 250,134 C300,134 330,133 360,133 C420,132 450,118 500,95"
              fill="none" class="vx-accent" stroke-width="2.5"/>
        <!-- data points (band pinches to them) -->
        <circle cx="150" cy="138" r="4.5" style="fill:var(--text)"/>
        <circle cx="250" cy="134" r="4.5" style="fill:var(--text)"/>
        <circle cx="360" cy="133" r="4.5" style="fill:var(--text)"/>
        <text x="150" y="186" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">data</text>
        <text x="470" y="64" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">band flares</text>
        <text x="470" y="78" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">(no data)</text>
      </svg>`,
      caption: "The shaded ±1.96σ band pinches tight at observed points and flares where there is no data — the GP's calibrated 'I don't know.'",
      example: "Take three noisy observations of an unknown curve. Between and around them the posterior mean tracks the data confidently (thin band); extrapolate past the last point and the band balloons, telling you the prediction is now a guess. The mean alone is identical to kernel ridge with $\\lambda=\\sigma_y^2$."
    },
    {
      title: "Decision trees (CART)",
      tag: "trees",
      body: "<p>CART makes recursive <b>axis-parallel</b> binary splits, predicting a constant per leaf: $f(\\boldsymbol{x})=\\sum_j w_j\\,\\mathbb{I}(\\boldsymbol{x}\\in R_j)$. Splits are chosen greedily by <b>MSE</b> (regression) or by impurity — <b>Gini</b> $1-\\sum_c\\hat\\pi_c^2$ or <b>entropy</b> (equivalently, maximum information gain) — for classification. <b>Prune</b> back (cost-complexity / 1-SE rule) to curb overfitting; surrogate splits cope with missing inputs.</p><p><b>Pros:</b> interpretable, handle mixed feature types, invariant to monotone transforms, do automatic feature selection, robust to outliers. <b>Cons:</b> mediocre accuracy alone, <b>high variance / unstable</b> (small data changes flip the tree), axis-parallel only, can't represent smooth functions.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Axis-parallel partition of a 2-D plane</text>
        <!-- plane -->
        <rect x="60" y="35" width="290" height="180" fill="none" class="vx-axis" stroke-width="1.5"/>
        <text x="205" y="232" text-anchor="middle" font-size="11">x₁</text>
        <text x="44" y="128" font-size="11" transform="rotate(-90 44 128)" text-anchor="middle">x₂</text>
        <!-- splits: vertical at x1=t1, then horizontal cuts -->
        <line x1="195" y1="35" x2="195" y2="215" class="vx-accent" stroke-width="2"/>
        <line x1="60" y1="120" x2="195" y2="120" class="vx-accent" stroke-width="2"/>
        <line x1="195" y1="155" x2="350" y2="155" class="vx-accent" stroke-width="2"/>
        <!-- region labels -->
        <text x="127" y="85" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">R₁</text>
        <text x="127" y="172" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">R₂</text>
        <text x="272" y="100" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">R₃</text>
        <text x="272" y="190" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">R₄</text>
        <text x="195" y="32" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">x₁ ≤ t₁</text>
        <!-- tree sketch on the right -->
        <g font-size="10">
          <circle cx="430" cy="55" r="13" style="fill:var(--bg-elev2)"/><text x="430" y="59" text-anchor="middle">x₁≤t</text>
          <line x1="421" y1="65" x2="400" y2="98" class="vx-grid" stroke-width="1.2"/>
          <line x1="439" y1="65" x2="460" y2="98" class="vx-grid" stroke-width="1.2"/>
          <circle cx="398" cy="110" r="13" style="fill:var(--bg-elev2)"/><text x="398" y="114" text-anchor="middle">x₂≤a</text>
          <circle cx="462" cy="110" r="13" style="fill:var(--bg-elev2)"/><text x="462" y="114" text-anchor="middle">x₂≤b</text>
          <line x1="392" y1="121" x2="380" y2="150" class="vx-grid" stroke-width="1.2"/>
          <line x1="404" y1="121" x2="416" y2="150" class="vx-grid" stroke-width="1.2"/>
          <line x1="456" y1="121" x2="444" y2="150" class="vx-grid" stroke-width="1.2"/>
          <line x1="468" y1="121" x2="480" y2="150" class="vx-grid" stroke-width="1.2"/>
          <text x="378" y="166" text-anchor="middle" style="fill:var(--text-dim)">R₁</text>
          <text x="418" y="166" text-anchor="middle" style="fill:var(--text-dim)">R₂</text>
          <text x="442" y="166" text-anchor="middle" style="fill:var(--text-dim)">R₃</text>
          <text x="482" y="166" text-anchor="middle" style="fill:var(--text-dim)">R₄</text>
        </g>
      </svg>`,
      caption: "Each split is a single-feature threshold, carving the plane into axis-aligned boxes — equivalently, a path down the tree to a constant-valued leaf.",
      example: "A tree on (age, income) might split 'age ≤ 30', then within each branch split on income — producing rectangular regions. It cannot draw a diagonal boundary, and shifting a few training points can rebuild the whole tree (high variance)."
    },
    {
      title: "Ensembles: bagging, random forests & boosting",
      tag: "ensembles",
      body: "<p><b>Bagging</b> trains $M$ models on bootstrap resamples and averages them. It <b>cuts variance</b> (bias unchanged) for <i>unstable</i> learners like trees; the ~37% of points left out of each bootstrap give a free <b>out-of-bag</b> error estimate. Ensemble variance $\\to\\rho\\sigma^2$ as $M{\\to}\\infty$, so <b>decorrelation</b> is what helps. <b>Random forests</b> add a random feature subset ($\\sim\\!\\sqrt{D}$) at each split to decorrelate further — a gold-standard tabular baseline.</p><p><b>Boosting</b> is sequential: an additive model $f=\\sum_m\\beta_m F_m$ where each weak learner targets the <i>current errors</i>, so it <b>cuts bias</b>. <b>AdaBoost</b> (exponential loss) up-weights misclassified points with $\\beta_m=\\tfrac12\\log\\tfrac{1-\\text{err}_m}{\\text{err}_m}$; <b>gradient boosting / MART</b> does functional gradient descent, fitting each tree to the negative-gradient <b>pseudo-residuals</b> (squared loss → residuals; log loss → calibrated LogitBoost). XGBoost / LightGBM / CatBoost add second-order info, tree regularization, and subsampling.</p>",
      example: "A single deep tree overfits. Bag 500 of them with $\\sqrt{D}$-feature splits → a random forest that is far steadier. Or gradient-boost shallow trees with shrinkage $\\nu\\approx0.05$, each fitting the running pseudo-residuals → usually the most accurate model on tabular data, at the cost of being sequential and tunable-into-overfitting."
    },
    {
      title: "Bagging vs boosting — when to reach for which",
      tag: "compare",
      body: "<p>Same building block (trees), opposite philosophies:</p><ul><li><b>Goal:</b> bagging lowers <b>variance</b>; boosting lowers <b>bias</b> (and some variance).</li><li><b>Training:</b> bagging is <b>parallel and independent</b>; boosting is <b>sequential and dependent</b>.</li><li><b>Combine:</b> bagging <b>averages / votes</b>; boosting takes a <b>weighted sum</b>.</li><li><b>Overfitting:</b> bagging rarely overfits; boosting <b>can</b>, especially with noisy labels.</li><li><b>Outliers:</b> bagging is robust; boosting (AdaBoost) is <b>sensitive</b>.</li><li><b>State of the art:</b> random forests (bagging) vs XGBoost / LightGBM (boosting).</li></ul><p>Practical defaults: RF — many trees, $\\sqrt{D}$ features, lean on OOB. Gradient boosting — small shrinkage $\\nu\\approx0.05$–$0.1$, shallow trees (depth 1–5), subsample; usually the most accurate on tabular data but less parallelizable.</p>",
      example: "Noisy labels and you want something that just works out of the box → random forest (robust, parallel, OOB diagnostics). Clean-ish data and you can afford to tune for maximum accuracy → gradient boosting with shrinkage and shallow trees."
    },
    {
      title: "Kernel density estimation & kernel regression",
      tag: "non-parametric",
      body: "<p><b>KDE</b> estimates a density by dropping a little kernel bump on every data point and summing: $p(\\boldsymbol{x})=\\frac1N\\sum_n\\mathcal{K}_h(\\boldsymbol{x}-\\boldsymbol{x}_n)$ (Gaussian, Epanechnikov, or box kernels). The <b>bandwidth</b> $h$ is the critical smoothing knob — too small and the estimate is spiky (one spike per point), too large and real structure washes out into a single blob. Rules of thumb like <b>Silverman's</b> $h=1.06\\,\\hat\\sigma N^{-1/5}$ give a starting point; otherwise pick $h$ by cross-validation.</p><p>The same kernel-weighting idea does regression. <b>Nadaraya–Watson</b> predicts a <b>kernel-weighted average</b> of the training outputs, $\\hat f(\\boldsymbol{x})=\\frac{\\sum_n\\mathcal{K}_h(\\boldsymbol{x}-\\boldsymbol{x}_n)\\,y_n}{\\sum_n\\mathcal{K}_h(\\boldsymbol{x}-\\boldsymbol{x}_n)}$ — a <i>linear smoother</i> (each prediction is linear in $\\boldsymbol{y}$). <b>LOWESS</b> instead fits a local polynomial per query point, which reduces <b>boundary bias</b>. These are <b>non-parametric</b> (the data <i>is</i> the model) and complement the parametric kernel methods above — kernel ridge, SVM, GP.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">KDE: sum a bump per data point → smooth density</text>
        <line x1="40" y1="195" x2="500" y2="195" class="vx-axis" stroke-width="1.5"/>
        <text x="270" y="222" text-anchor="middle" font-size="11">x</text>
        <text x="24" y="120" font-size="11" transform="rotate(-90 24 120)" text-anchor="middle">density</text>
        <!-- individual kernel bumps (dashed, faint), one per data tick -->
        <path d="M70,195 C100,195 100,150 130,150 C160,150 160,195 190,195" fill="none" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 3"/>
        <path d="M120,195 C150,195 150,150 180,150 C210,150 210,195 240,195" fill="none" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 3"/>
        <path d="M150,195 C180,195 180,150 210,150 C240,150 240,195 270,195" fill="none" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 3"/>
        <path d="M300,195 C330,195 330,150 360,150 C390,150 390,195 420,195" fill="none" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 3"/>
        <path d="M350,195 C380,195 380,150 410,150 C440,150 440,195 470,195" fill="none" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 3"/>
        <!-- summed density estimate (solid) -->
        <path d="M40,193 C90,188 110,120 150,108 C185,98 200,150 230,150 C255,150 270,178 300,170 C340,158 360,128 410,128 C450,128 470,180 500,190"
              fill="none" class="vx-accent" stroke-width="2.5"/>
        <!-- data ticks (rug) on the axis -->
        <g class="vx-good" stroke-width="2">
          <line x1="130" y1="195" x2="130" y2="207"/>
          <line x1="180" y1="195" x2="180" y2="207"/>
          <line x1="210" y1="195" x2="210" y2="207"/>
          <line x1="360" y1="195" x2="360" y2="207"/>
          <line x1="410" y1="195" x2="410" y2="207"/>
        </g>
        <text x="200" y="240" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">ticks = data; dashed = per-point kernels; solid = their sum</text>
      </svg>`,
      caption: "Each data tick contributes one bandwidth-$h$ bump (dashed); their normalized sum is the smooth density estimate (solid). Smaller $h$ → spikier; larger $h$ → flatter.",
      example: "Estimating the distribution of adult heights from 200 samples: a Gaussian KDE with Silverman's $h$ gives a smooth bimodal curve; halve $h$ and it fragments into 200 little spikes, double it and the two modes merge into one bump. For regression, Nadaraya–Watson predicts a new point's value as the kernel-weighted average of nearby observed outputs — nearer points count more."
    }
  ]
};
