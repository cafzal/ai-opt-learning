/* Batch: Multiobjective & Surrogate Optimization */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["opt-surrogate"] = [
  {
    id: "sur-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In multiobjective optimization with a vector objective $\\mathbf{f}$, design $\\mathbf{x}$ <b>dominates</b> $\\mathbf{x}'$ exactly when:",
    options: [
      "$f_i(\\mathbf{x})\\le f_i(\\mathbf{x}')$ for every objective $i$, and $f_i(\\mathbf{x})<f_i(\\mathbf{x}')$ for at least one $i$",
      "$f_i(\\mathbf{x})<f_i(\\mathbf{x}')$ for every objective $i$",
      "$f_i(\\mathbf{x})\\le f_i(\\mathbf{x}')$ for at least one objective $i$",
      "The weighted sum $\\mathbf{w}^\\top\\mathbf{f}(\\mathbf{x})$ is smaller than $\\mathbf{w}^\\top\\mathbf{f}(\\mathbf{x}')$"
    ],
    answer: 0,
    explanation: "Dominance means better in at least one objective and worse in none: $f_i(\\mathbf{x})\\le f_i(\\mathbf{x}')$ for all $i$ and strict $<$ for some $i$. Requiring strict improvement in <i>every</i> objective is too strong, and a single $\\le$ is too weak. The set of un-dominated points is the Pareto frontier.",
    ref: "Pareto optimality & dominance"
  },
  {
    id: "sur-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "A <b>full factorial</b> sampling plan places a grid of $m$ levels along each of $n$ dimensions. How does the number of sample points scale?",
    options: [
      "$m^n$ — exponential in the number of dimensions",
      "$m\\cdot n$ — linear in the number of dimensions",
      "$n^m$ — exponential in the number of levels",
      "$\\binom{m}{n}$ — combinatorial but sub-exponential"
    ],
    answer: 0,
    explanation: "A full factorial grid has $m^n$ points, exponential in $n$, which becomes infeasible in high dimensions. This motivates space-filling alternatives like uniform-projection (Latin hypercube) plans and low-discrepancy sequences.",
    ref: "Sampling plans"
  },
  {
    id: "sur-3", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "Which statement about multiobjective concepts is <b>FALSE</b>?",
    options: [
      "The <b>utopia point</b> (componentwise minimum of every objective) is generally an attainable Pareto-optimal design",
      "A design is <b>weakly Pareto-optimal</b> if no other point improves <i>all</i> objectives simultaneously",
      "<b>Nondomination ranking</b> (assigning fitness by Pareto-level) is the basis of NSGA-II",
      "<b>Niche</b> / fitness-sharing techniques are used to keep a population spread evenly along the frontier"
    ],
    answer: 0,
    explanation: "The utopia point takes the best value of each objective independently, so it is <i>generally unattainable</i> — if it were attainable, the objectives wouldn't conflict and the frontier would collapse to a point. Weak Pareto optimality, nondomination-rank fitness (NSGA-II), and niche/fitness-sharing for spread are all correct.",
    ref: "Pareto optimality & dominance"
  },
  {
    id: "sur-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "A Gaussian-process surrogate predicts posterior mean $\\hat\\mu=4.0$ and posterior standard deviation $\\hat\\sigma=0.5$ at a query point. Using the GP 95% region $\\hat\\mu\\pm1.96\\hat\\sigma$, what is the <b>upper</b> bound of the 95% region?",
    answer: 4.98, tolerance: 0.01, unit: "",
    hint: "Compute $4.0+1.96\\times 0.5$.",
    explanation: "The 95% region is $\\hat\\mu\\pm1.96\\hat\\sigma=4.0\\pm1.96(0.5)=4.0\\pm0.98$, so the upper bound is $4.98$ (and the lower bound $3.02$). Because the GP covariance depends only on where you've sampled — not on the observed $\\mathbf{y}$ — this interval widens away from the data.",
    ref: "Gaussian processes"
  },
  {
    id: "sur-5", type: "ms", framing: "conceptual", difficulty: 2,
    prompt: "Select every statement that is <b>true</b> about scalarization methods for multiobjective optimization.",
    options: [
      "The constraint method ($\\min f_1$ s.t. $f_i\\le c_i$) can reach nonconvex regions of the Pareto frontier",
      "The weighted-sum method $\\mathbf{w}^\\top\\mathbf{f}$ cannot reach nonconvex regions of the Pareto frontier",
      "Weighted min-max (Tchebycheff) can reach nonconvex regions of the frontier",
      "The weighted-sum method is the only scalarization guaranteed to cover the entire frontier",
      "Lexicographic scalarization is insensitive to the ordering of objectives"
    ],
    answer: [0, 1, 2],
    explanation: "The constraint method and weighted min-max (Tchebycheff) both reach nonconvex frontier regions; the weighted sum $\\mathbf{w}^\\top\\mathbf{f}$ cannot. So weighted-sum is <i>not</i> a full-coverage method, and lexicographic scalarization is explicitly ordering-sensitive.",
    ref: "Scalarization"
  },
  {
    id: "sur-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that is <b>true</b> about space-filling sampling plans and low-discrepancy sequences.",
    options: [
      "A uniform-projection (Latin hypercube) plan places exactly one sample per row and per column, so every 1-D marginal is uniform",
      "Quasi-Monte Carlo with a low-discrepancy sequence converges at $O(1/m)$, versus $O(1/\\sqrt{m})$ for plain Monte Carlo",
      "Halton sequences use coprime van der Corput bases, while Sobol sequences XOR direction numbers and fill space most uniformly",
      "Low-discrepancy (Sobol/Halton) sequences are pseudo-random draws that clump more than a uniform grid",
      "Space-filling quality can be scored by discrepancy or the Morris-Mitchell $\\Phi_q$ metric"
    ],
    answer: [0, 1, 2, 4],
    explanation: "Latin hypercube = one entry per row/column (uniform marginals); QMC error is $O(1/m)$ vs Monte Carlo's $O(1/\\sqrt{m})$; Halton uses coprime van der Corput bases and Sobol XORs direction numbers (fills most uniformly); quality is measured by discrepancy or Morris-Mitchell $\\Phi_q$. The false option inverts reality: low-discrepancy sequences spread <i>more evenly</i> than pseudo-random draws — that is the whole point.",
    ref: "Low-discrepancy sequences"
  },
  {
    id: "sur-7", type: "mc", framing: "applied", difficulty: 3,
    prompt: "When selecting a surrogate model, why is the <b>training error</b> an unsuitable estimate of the generalization error $\\mathbb{E}_\\mathbf{x}[(f-\\hat f)^2]$?",
    options: [
      "Training error underestimates the generalization error",
      "Training error overestimates the generalization error",
      "Training error equals the generalization error once the model is unbiased",
      "Training error cannot be computed without a held-out set"
    ],
    answer: 0,
    explanation: "Generalization error is not directly computable, and training error <i>underestimates</i> it because the model is fit to the same data. Honest estimates come from holdout, $k$-fold cross-validation (leave-one-out is $k=m$), or the bootstrap — capturing the bias-variance tradeoff.",
    ref: "Surrogate models"
  },
  {
    id: "sur-8", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Using the <b>0.632 bootstrap</b> estimate $\\epsilon_{0.632}=0.632\\,\\epsilon_{\\text{loob}}+0.368\\,\\epsilon_{\\text{boot}}$, suppose the leave-one-out bootstrap error is $\\epsilon_{\\text{loob}}=0.30$ and the bootstrap (resubstitution-style) error is $\\epsilon_{\\text{boot}}=0.10$. What is $\\epsilon_{0.632}$?",
    answer: 0.2264, tolerance: 0.001, unit: "",
    hint: "Compute $0.632(0.30)+0.368(0.10)$.",
    explanation: "$\\epsilon_{0.632}=0.632(0.30)+0.368(0.10)=0.1896+0.0368=0.2264$. The weights arise because a given index is absent from a bootstrap resample with probability $\\approx e^{-1}\\approx0.368$, so about $0.632$ of the data appears in each resample.",
    ref: "Surrogate models"
  },
  {
    id: "sur-9", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "In surrogate optimization with a GP, which acquisition function uses the <b>magnitude</b> of potential improvement (not merely its probability) and is noted as usually the fastest?",
    options: [
      "Expected improvement",
      "Probability of improvement $\\Phi\\!\\left(\\frac{y_{\\min}-\\hat\\mu}{\\hat\\sigma}\\right)$",
      "Prediction-based exploitation $\\min\\hat\\mu$",
      "Error-based exploration $\\max\\hat\\sigma$"
    ],
    answer: 0,
    explanation: "Expected improvement weights how much the objective could improve, not just the chance it improves, and is usually the fastest acquisition strategy. Prediction-based $\\min\\hat\\mu$ can get stuck; error-based $\\max\\hat\\sigma$ is pure exploration; probability of improvement ignores improvement magnitude.",
    ref: "Acquisition functions"
  },
  {
    id: "sur-10", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "A GP surrogate is being optimized. Compare how much each acquisition rule <b>explores</b>, rather than exploits, when choosing the next evaluation point.",
    quantityA: "Exploration by <b>prediction-based</b> selection, $\\min\\hat\\mu$",
    quantityB: "Exploration by <b>error-based</b> selection, $\\max\\hat\\sigma$",
    answer: 1,
    explanation: "Prediction-based $\\min\\hat\\mu$ ignores uncertainty entirely and exploits the surrogate's current best guess — it can get stuck in a local basin. Error-based $\\max\\hat\\sigma$ does the opposite: it queries wherever the GP is least certain, pure exploration. So B explores strictly more. Intermediate strategies — LCB $\\min(\\hat\\mu-\\alpha\\hat\\sigma)$, probability of improvement, expected improvement — sit between these two extremes.",
    ref: "Acquisition functions"
  }
];
