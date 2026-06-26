/* Review: Multiobjective & Surrogate Optimization */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["opt-surrogate"] = {
  intro: "Two situations break the deterministic single-objective toolkit: <b>competing objectives</b> with no single best design, and <b>expensive black-box</b> evaluations where every sample costs real time or money. This batch covers both. For the first: Pareto frontiers, scalarization, and population methods. For the second: space-filling sampling plans, surrogate modeling and model selection, the Gaussian process as a probabilistic surrogate, and surrogate (Bayesian) optimization with acquisition functions. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Pareto optimality & dominance",
      tag: "geometry",
      body: "<p>With a vector objective $\\mathbf{f}$ there is no single best design. Design $\\mathbf{x}$ <b>dominates</b> $\\mathbf{x}'$ iff $f_i(\\mathbf{x})\\le f_i(\\mathbf{x}')$ for <i>all</i> $i$ and $<$ for <i>some</i> $i$ — better in at least one objective, worse in none. A design is <b>Pareto-optimal</b> when it is un-dominated; the set of all such designs is the <b>Pareto frontier</b>, lying on the boundary of criterion space $\\mathcal{Y}$.</p><p><b>Weakly Pareto-optimal</b> means no point improves <i>all</i> objectives simultaneously (a weaker condition). The <b>utopia point</b> is the componentwise minimum of every objective — generally unattainable. Regions where neither design dominates the other are zones of dominance ambiguity, resolved only by a scalarization or a stated preference.</p>",
      visual: `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="55" y1="20" x2="55" y2="215" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="215" x2="495" y2="215" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="248" text-anchor="middle" font-size="12">objective f₁  (minimize) →</text>
        <text x="20" y="118" font-size="12" transform="rotate(-90 20 118)" text-anchor="middle">f₂ (minimize) →</text>
        <!-- dominated cloud (upper-right of the frontier = worse in both objectives) -->
        <g style="fill:var(--text-faint)">
          <circle cx="185" cy="92" r="3.5"/><circle cx="250" cy="112" r="3.5"/><circle cx="300" cy="120" r="3.5"/>
          <circle cx="352" cy="142" r="3.5"/><circle cx="232" cy="82" r="3.5"/><circle cx="322" cy="96" r="3.5"/>
          <circle cx="402" cy="150" r="3.5"/><circle cx="285" cy="138" r="3.5"/><circle cx="372" cy="122" r="3.5"/>
          <circle cx="425" cy="172" r="3.5"/><circle cx="205" cy="120" r="3.5"/><circle cx="440" cy="138" r="3.5"/>
        </g>
        <!-- Pareto frontier: the lower-left boundary; for min-min it slopes DOWN (f1 up, f2 down) -->
        <path d="M95,62 C180,120 250,160 320,182 C375,198 420,203 455,205" fill="none" class="vx-good" stroke-width="2.5"/>
        <g style="fill:var(--good)">
          <circle cx="95" cy="62" r="4"/><circle cx="160" cy="108" r="4"/><circle cx="235" cy="152" r="4"/><circle cx="315" cy="181" r="4"/><circle cx="390" cy="200" r="4"/><circle cx="455" cy="205" r="4"/>
        </g>
        <text x="118" y="78" font-size="11" style="fill:var(--good)">Pareto frontier</text>
        <text x="348" y="108" font-size="11" style="fill:var(--text-dim)">dominated points</text>
        <!-- utopia point: componentwise minimum (min f1, min f2) = bottom-left, off the frontier -->
        <circle cx="70" cy="200" r="4.5" style="fill:var(--accent)"/>
        <text x="80" y="204" font-size="11" style="fill:var(--accent)">utopia point</text>
      </svg>`,
      caption: "Both objectives minimized: the green frontier is un-dominated; grey points are each dominated by some frontier point. The utopia point (componentwise best) sits off the frontier.",
      example: "Two cars: A costs more but is faster, B is cheaper but slower — neither dominates, so both are Pareto-optimal. A third car that is more expensive <i>and</i> slower than A is dominated by A and drops off the frontier.",
      takeaway: "Dominance lets you discard provably-worse designs before any preference is stated, shrinking the choice set to the frontier where real tradeoff decisions actually live."
    },
    {
      title: "Scalarization: weighted sum vs constraint & Tchebycheff",
      tag: "core",
      body: "<p>Scalarization collapses the vector objective into one scalar so a single-objective solver applies. The choice matters because of frontier shape:</p><ul><li><b>Weighted sum</b> $\\mathbf{w}^\\top\\mathbf{f}$ — simplest, but <b>cannot reach nonconvex regions</b> of the frontier (a sweeping hyperplane skips over any concave dent).</li><li><b>Constraint method</b> — $\\min f_1$ s.t. $f_i\\le c_i$; sweeping the bounds <i>does</i> reach nonconvex regions.</li><li><b>Weighted min-max (Tchebycheff)</b> $\\max_i w_i(f_i-y_i^{\\text{goal}})$ — also reaches nonconvex regions; augment with $\\rho\\,\\mathbf{f}^\\top\\mathbf{y}^{\\text{goal}}$ to drop weakly-optimal points.</li><li><b>Lexicographic</b> (ordered, sequential; ordering-sensitive); <b>goal programming</b> $\\min\\|\\mathbf{f}-\\mathbf{y}^{\\text{goal}}\\|_p$.</li></ul><p><b>Population methods</b> approximate the whole frontier at once: <b>nondomination ranking</b> (Level-$k$ → fitness proportional to rank) is the basis of <b>NSGA-II</b>; <b>niche techniques</b> (fitness sharing) keep the spread even.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="55" y1="20" x2="55" y2="205" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="205" x2="495" y2="205" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="236" text-anchor="middle" font-size="12">f₁ (minimize) →</text>
        <text x="20" y="112" font-size="12" transform="rotate(-90 20 112)" text-anchor="middle">f₂ (minimize) →</text>
        <!-- nonconvex frontier (decreasing for min-min) with a concave dent bulging toward upper-right -->
        <path d="M80,52 C120,76 145,100 165,100 C205,100 220,108 240,112 C280,120 300,150 320,150 C370,150 410,196 460,196" fill="none" class="vx-good" stroke-width="2.5"/>
        <!-- weighted-sum supporting line: bridges the dent, tangent only at the two flank points -->
        <line x1="90" y1="76" x2="430" y2="186" class="vx-bad" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="330" y="95" font-size="10.5" style="fill:var(--bad)">weighted-sum line</text>
        <!-- the unreachable dent interior (sits upper-right of the chord) -->
        <circle cx="240" cy="112" r="4.5" style="fill:var(--warn)"/>
        <line x1="240" y1="92" x2="240" y2="106" class="vx-warn" stroke-width="1"/>
        <text x="240" y="74" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">unreachable by</text>
        <text x="240" y="88" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">weighted sum</text>
        <!-- reachable flank points where the line is tangent -->
        <circle cx="165" cy="100" r="4" style="fill:var(--good)"/>
        <circle cx="320" cy="150" r="4" style="fill:var(--good)"/>
        <text x="370" y="178" font-size="11" style="fill:var(--good)">nonconvex frontier</text>
      </svg>`,
      caption: "A concave dent in the frontier: the weighted-sum hyperplane (red dashed) is tangent only at the two ends, so it never selects the orange interior points. Constraint and Tchebycheff methods can.",
      example: "Minimizing cost and weight with a concave tradeoff in the middle: no weights $\\mathbf{w}$ make $\\mathbf{w}^\\top\\mathbf{f}$ pick the balanced middle designs — sweeping the weights jumps from one extreme to the other. Switching to the $\\epsilon$-constraint method ($\\min$ cost s.t. weight $\\le c$) recovers them.",
      takeaway: "Default to $\\epsilon$-constraint or Tchebycheff over weighted sums: if your frontier has any concave region, weighted sums silently hide the balanced compromises you most want to see."
    },
    {
      title: "Sampling plans & low-discrepancy sequences",
      tag: "algorithm",
      body: "<p>When evaluations are expensive, the <i>initial</i> points should fill the space well. <b>Full factorial</b> (a grid) needs $m^n$ points — exponential in dimension $n$. A <b>uniform projection (Latin hypercube)</b> places one entry per row and column, so every 1-D marginal is uniform with far fewer points; <b>stratified</b> sampling draws a random point per cell.</p><p><b>Low-discrepancy (quasi-random) sequences</b> fill space more evenly than pseudo-random draws: <b>Halton</b> (coprime van der Corput bases; <i>leaped</i> for large primes) and <b>Sobol</b> (XOR with direction numbers; fills most uniformly). Quality is measured by <b>discrepancy</b> or the Morris-Mitchell metric $\\Phi_q$. The payoff is convergence: <b>quasi-Monte Carlo is $O(1/m)$</b> versus plain Monte Carlo's $O(1/\\sqrt{m})$.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="125" y="18" text-anchor="middle" font-size="12" font-weight="700">random (MC)</text>
        <text x="395" y="18" text-anchor="middle" font-size="12" font-weight="700">low-discrepancy (QMC)</text>
        <!-- left grid: clumpy random -->
        <rect x="35" y="28" width="180" height="150" rx="3" fill="none" class="vx-grid" stroke-width="1"/>
        <g style="fill:var(--bad)">
          <circle cx="55" cy="55" r="3"/><circle cx="62" cy="62" r="3"/><circle cx="70" cy="48" r="3"/>
          <circle cx="120" cy="150" r="3"/><circle cx="195" cy="40" r="3"/><circle cx="185" cy="55" r="3"/>
          <circle cx="95" cy="100" r="3"/><circle cx="160" cy="120" r="3"/><circle cx="140" cy="90" r="3"/>
          <circle cx="50" cy="160" r="3"/><circle cx="200" cy="160" r="3"/><circle cx="105" cy="60" r="3"/>
        </g>
        <text x="125" y="198" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">clumps & gaps</text>
        <!-- right grid: even quasi-random -->
        <rect x="305" y="28" width="180" height="150" rx="3" fill="none" class="vx-grid" stroke-width="1"/>
        <g style="fill:var(--good)">
          <circle cx="325" cy="50" r="3"/><circle cx="370" cy="40" r="3"/><circle cx="420" cy="55" r="3"/><circle cx="465" cy="45" r="3"/>
          <circle cx="340" cy="95" r="3"/><circle cx="385" cy="105" r="3"/><circle cx="430" cy="90" r="3"/><circle cx="460" cy="110" r="3"/>
          <circle cx="320" cy="150" r="3"/><circle cx="365" cy="160" r="3"/><circle cx="410" cy="148" r="3"/><circle cx="455" cy="160" r="3"/>
        </g>
        <text x="395" y="198" text-anchor="middle" font-size="10.5" style="fill:var(--good)">even coverage → O(1/m)</text>
      </svg>`,
      caption: "Pseudo-random points clump and leave gaps; Sobol/Halton sequences spread evenly, giving O(1/m) error versus O(1/√m) for plain Monte Carlo.",
      example: "Initializing a 5-D surrogate with a budget of 50 expensive runs: a full-factorial grid would need $m^5$ points (even $m=3$ is 243), so a Latin-hypercube or Sobol plan of 50 points is used instead to cover the space without clumping.",
      takeaway: "A Sobol or Latin-hypercube start spends your scarce evaluation budget on coverage, not on accidental clumps and gaps that leave whole regions of the design space unprobed."
    },
    {
      title: "Surrogate models & model selection",
      tag: "core",
      body: "<p>A <b>surrogate</b> fits a cheap, smooth $\\hat f_\\theta$ to an expensive $f$, then you optimize the surrogate instead of the real thing (linear, basis-function, ridge/lasso fits are the simplest forms). The central difficulty is estimating <b>generalization error</b> $\\mathbb{E}_\\mathbf{x}[(f-\\hat f)^2]$ — it is not directly computable, and <b>training error underestimates it</b> because the model is scored on the same data it was fit to (the bias-variance tradeoff again).</p><p>Honest estimators: <b>holdout</b>, <b>random subsampling</b>, <b>k-fold cross-validation</b> (leave-one-out is $k=m$), and the <b>bootstrap</b> (resample with replacement). The <b>0.632 bootstrap</b> blends two estimates as $\\epsilon_{0.632}=0.632\\,\\epsilon_{\\text{loob}}+0.368\\,\\epsilon_{\\text{boot}}$ — the weights come from a given index being absent from a resample with probability $\\approx e^{-1}\\approx0.368$, so $\\approx0.632$ of the data appears in each. Always <b>retrain on the full data</b> after selecting. <b>Multifidelity</b> models combine a cheap low-fidelity model with a few expensive high-fidelity runs, e.g. an affine fit $\\hat f_h=a_0+a_1\\hat f_\\ell$ plus a discrepancy correction $\\hat\\delta=f_h-\\hat f_\\ell$.</p>",
      example: "Choosing between a quadratic and a radial-basis surrogate from 30 expensive samples: fitting both and comparing <i>training</i> error would always favor the more flexible model (it interpolates the points). 5-fold cross-validation instead estimates error on held-out folds, exposing the flexible model's overfitting, and only then is the winner retrained on all 30 points.",
      takeaway: "Pick the surrogate by cross-validation or the bootstrap, never by training error — otherwise you select the model that best memorizes your scarce samples and then optimize a mirage."
    },
    {
      title: "Gaussian processes",
      tag: "uncertainty",
      body: "<p>The <b>Gaussian process (GP)</b> is the <i>probabilistic</i> surrogate: a distribution over functions specified by a mean function $m(\\mathbf{x})$ and a <b>kernel</b> $k(\\mathbf{x},\\mathbf{x}')$ that controls smoothness (e.g. squared-exponential $\\exp(-\\|\\mathbf{x}-\\mathbf{x}'\\|^2/2\\ell^2)$ with length scale $\\ell$; also Matérn, rational quadratic). Unlike an ordinary surrogate it returns a predictive <b>variance</b> as well as a mean, and it is <b>nonparametric</b> — its degrees of freedom grow with the data.</p><p>Posterior at a query $\\mathbf{x}$: mean $\\hat\\mu(\\mathbf{x})=m(\\mathbf{x})+\\mathbf{K}(\\mathbf{x},X)\\mathbf{K}(X,X)^{-1}(\\mathbf{y}-\\mathbf{m}(X))$ and variance $\\hat\\nu(\\mathbf{x})=\\mathbf{K}(\\mathbf{x},\\mathbf{x})-\\mathbf{K}(\\mathbf{x},X)\\mathbf{K}(X,X)^{-1}\\mathbf{K}(X,\\mathbf{x})$. Crucially the <b>covariance does not depend on the observed $\\mathbf{y}$</b> — only on <i>where</i> you sampled — so uncertainty grows away from the data and the 95% region is $\\hat\\mu\\pm1.96\\,\\hat\\sigma$. Cost is $O(m^3)$ from inverting $\\mathbf{K}(X,X)$. <b>Noisy</b> observations add $\\nu\\mathbf{I}$ to the observed block (also stabilizing the inverse); <b>gradient</b> observations shrink the intervals. <b>Fitting</b> the kernel hyperparameters maximizes the <b>log marginal likelihood</b> $-\\tfrac{n}{2}\\log2\\pi-\\tfrac12\\log|\\mathbf{K}+\\nu\\mathbf{I}|-\\tfrac12(\\mathbf{y}-\\mathbf{m})^\\top(\\mathbf{K}+\\nu\\mathbf{I})^{-1}(\\mathbf{y}-\\mathbf{m})$.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="45" y1="20" x2="45" y2="195" class="vx-axis" stroke-width="1.5"/>
        <line x1="45" y1="195" x2="500" y2="195" class="vx-axis" stroke-width="1.5"/>
        <text x="272" y="222" text-anchor="middle" font-size="12">x →</text>
        <!-- 95% confidence band: pinches at data, balloons between -->
        <path d="M55,110 C110,118 130,150 175,150 C200,150 215,118 250,113 C300,106 320,165 370,165 C405,165 425,98 480,80
                 L480,118 C425,140 405,178 370,178 C320,178 300,150 250,143 C215,138 200,170 175,170 C130,170 110,150 55,148 Z"
              style="fill:var(--accent)" opacity="0.18"/>
        <!-- posterior mean -->
        <path d="M55,128 C110,134 130,150 175,160 C215,172 215,128 250,128 C300,128 320,172 370,172 C405,172 425,108 480,98" fill="none" class="vx-accent" stroke-width="2.5"/>
        <!-- sampled data points (band pinches here) -->
        <g style="fill:var(--text)">
          <circle cx="55" cy="128" r="4"/><circle cx="175" cy="160" r="4"/><circle cx="250" cy="128" r="4"/><circle cx="370" cy="172" r="4"/>
        </g>
        <text x="115" y="48" font-size="11" style="fill:var(--accent)">mean μ̂</text>
        <text x="300" y="92" font-size="10.5" style="fill:var(--text-dim)">band = μ̂ ± 1.96 σ̂</text>
        <text x="408" y="70" font-size="10.5" style="fill:var(--text-dim)">widest far from data</text>
      </svg>`,
      caption: "GP posterior: the mean interpolates the sampled points (dots) while the ±1.96σ band pinches to zero at data and balloons in the gaps — uncertainty depends only on where you sampled.",
      example: "After 4 expensive evaluations, the GP is confident (narrow band) right at those 4 inputs and most uncertain in the wide gap between them — exactly the region an acquisition function will want to probe next. Fitting the length scale $\\ell$ by maximizing the log marginal likelihood balances how wiggly vs smooth the interpolation is.",
      takeaway: "A GP's per-point variance is what makes principled active sampling possible — it tells you not just a prediction but how much you can trust it, and where to look next."
    },
    {
      title: "Surrogate optimization & acquisition functions",
      tag: "algorithm",
      body: "<p>Surrogate (Bayesian) optimization uses the GP to choose the <i>next</i> point to evaluate, balancing exploration (high variance) against exploitation (low predicted mean) through an <b>acquisition function</b>:</p><ul><li><b>Prediction-based</b> $\\min\\hat\\mu$ — pure exploitation; can get stuck.</li><li><b>Error-based</b> $\\max\\hat\\sigma$ — pure exploration; needs a bounded region.</li><li><b>Lower confidence bound (LCB)</b> $\\min\\hat\\mu-\\alpha\\hat\\sigma$ — interpolates the two via $\\alpha$.</li><li><b>Probability of improvement</b> $\\Phi\\!\\big(\\frac{y_{\\min}-\\hat\\mu}{\\hat\\sigma}\\big)$ — chance of beating the incumbent.</li><li><b>Expected improvement</b> $(y_{\\min}-\\hat\\mu)P(y\\le y_{\\min})+\\hat\\sigma^2\\mathcal{N}(y_{\\min}\\mid\\hat\\mu,\\hat\\sigma^2)$ — weights probability by <i>magnitude</i> of improvement; <b>usually the fastest</b>.</li></ul><p><b>SafeOpt</b> minimizes $f$ while never exceeding a threshold $y_{\\max}$: it maintains a safe region $\\mathcal{S}=\\{P(f\\le y_{\\max})\\ge P_{\\text{safe}}\\}$ and queries the max-width point among potential minimizers and expanders. It needs an initial safe point and finds only the locally reachable safe optimum.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <!-- top: GP mean+band -->
        <line x1="45" y1="18" x2="45" y2="135" class="vx-axis" stroke-width="1.5"/>
        <line x1="45" y1="135" x2="500" y2="135" class="vx-axis" stroke-width="1.5"/>
        <path d="M55,75 C120,82 140,105 185,105 C225,105 240,72 285,68 C330,64 360,108 410,108 C440,108 460,55 485,48
                 L485,82 C460,95 440,128 410,128 C360,128 330,92 285,88 C240,84 225,118 185,118 C140,118 120,98 55,100 Z"
              style="fill:var(--accent)" opacity="0.16"/>
        <path d="M55,88 C120,94 140,105 185,112 C225,118 240,80 285,78 C330,76 360,118 410,118 C440,118 460,52 485,65" fill="none" class="vx-accent" stroke-width="2.2"/>
        <g style="fill:var(--text)"><circle cx="55" cy="88" r="3.5"/><circle cx="185" cy="112" r="3.5"/><circle cx="285" cy="78" r="3.5"/><circle cx="410" cy="118" r="3.5"/></g>
        <text x="55" y="32" font-size="11" style="fill:var(--accent)">GP surrogate</text>
        <!-- bottom: expected improvement curve, peak in the uncertain low-mean gap -->
        <line x1="45" y1="150" x2="45" y2="235" class="vx-axis" stroke-width="1.5"/>
        <line x1="45" y1="235" x2="500" y2="235" class="vx-axis" stroke-width="1.5"/>
        <path d="M55,233 C100,232 120,228 140,222 C170,205 200,165 230,165 C255,165 280,228 320,233 C370,234 430,233 485,232" fill="none" class="vx-good" stroke-width="2.2"/>
        <line x1="225" y1="235" x2="225" y2="160" stroke-dasharray="4 4" class="vx-grid" stroke-width="1"/>
        <circle cx="225" cy="165" r="4" style="fill:var(--good)"/>
        <text x="232" y="172" font-size="11" style="fill:var(--good)">EI peak → next eval</text>
        <text x="55" y="164" font-size="11" style="fill:var(--text-dim)">expected improvement</text>
      </svg>`,
      caption: "Expected improvement peaks where the predicted mean is low AND uncertainty is high — the dashed line marks the next point to evaluate, balancing exploit vs explore.",
      example: "Tuning a costly simulator, EI proposes a point in a wide unexplored gap where the mean dips below the current best $y_{\\min}$ — likely to improve, and informative if it doesn't. After evaluating there, the GP and EI are refit and the loop repeats.",
      takeaway: "Bayesian optimization with expected improvement is how you tune expensive black boxes — hyperparameters, simulators, lab experiments — in tens of evaluations instead of thousands."
    }
  ]
};
