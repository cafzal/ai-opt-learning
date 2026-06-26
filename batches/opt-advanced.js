/* Batch: Advanced Optimization — Multiobjective, Surrogates & Uncertainty */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["opt-advanced"] = [
  {
    id: "oa-1", type: "mc", framing: "conceptual", difficulty: 1,
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
    id: "oa-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "A <b>full factorial</b> sampling plan places a grid of $m$ levels along each of $n$ dimensions. How does the number of sample points scale?",
    options: [
      "$m^n$ — exponential in the number of dimensions",
      "$m\\cdot n$ — linear in the number of dimensions",
      "$n^m$ — exponential in the number of levels",
      "$\\binom{m}{n}$ — combinatorial but sub-exponential"
    ],
    answer: 0,
    explanation: "A full factorial grid has $m^n$ points, exponential in $n$, which becomes infeasible in high dimensions. This motivates space-filling alternatives like uniform-projection (Latin hypercube) plans and low-discrepancy sequences.",
    ref: "Sampling Plans"
  },
  {
    id: "oa-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "A Gaussian-process surrogate predicts posterior mean $\\hat\\mu=4.0$ and posterior standard deviation $\\hat\\sigma=0.5$ at a query point. Using the GP 95% region $\\hat\\mu\\pm1.96\\hat\\sigma$, what is the <b>upper</b> bound of the 95% region?",
    answer: 4.98, tolerance: 0.01, unit: "",
    hint: "Compute $4.0+1.96\\times 0.5$.",
    explanation: "The 95% region is $\\hat\\mu\\pm1.96\\hat\\sigma=4.0\\pm1.96(0.5)=4.0\\pm0.98$, so the upper bound is $4.98$ (and the lower bound $3.02$). Because the GP covariance depends only on where you've sampled — not on the observed $\\mathbf{y}$ — this interval widens away from the data.",
    ref: "Gaussian processes"
  },
  {
    id: "oa-4", type: "ms", framing: "conceptual", difficulty: 2,
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
    ref: "Multiobjective Optimization"
  },
  {
    id: "oa-5", type: "mc", framing: "applied", difficulty: 3,
    prompt: "When selecting a surrogate model, why is the <b>training error</b> an unsuitable estimate of the generalization error $\\mathbb{E}_\\mathbf{x}[(f-\\hat f)^2]$?",
    options: [
      "Training error underestimates the generalization error",
      "Training error overestimates the generalization error",
      "Training error equals the generalization error once the model is unbiased",
      "Training error cannot be computed without a held-out set"
    ],
    answer: 0,
    explanation: "Generalization error is not directly computable, and training error <i>underestimates</i> it because the model is fit to the same data. Honest estimates come from holdout, $k$-fold cross-validation (leave-one-out is $k=m$), or the bootstrap — capturing the bias-variance tradeoff.",
    ref: "Surrogate Models"
  },
  {
    id: "oa-6", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Using the <b>0.632 bootstrap</b> estimate $\\epsilon_{0.632}=0.632\\,\\epsilon_{\\text{loob}}+0.368\\,\\epsilon_{\\text{boot}}$, suppose the leave-one-out bootstrap error is $\\epsilon_{\\text{loob}}=0.30$ and the bootstrap (resubstitution-style) error is $\\epsilon_{\\text{boot}}=0.10$. What is $\\epsilon_{0.632}$?",
    answer: 0.2264, tolerance: 0.001, unit: "",
    hint: "Compute $0.632(0.30)+0.368(0.10)$.",
    explanation: "$\\epsilon_{0.632}=0.632(0.30)+0.368(0.10)=0.1896+0.0368=0.2264$. The weights arise because a given index is absent from a bootstrap resample with probability $\\approx e^{-1}\\approx0.368$, so about $0.632$ of the data appears in each resample.",
    ref: "Surrogate Models"
  },
  {
    id: "oa-7", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "In surrogate optimization with a GP, which acquisition function uses the <b>magnitude</b> of potential improvement (not merely its probability) and is noted as usually the fastest?",
    options: [
      "Expected improvement",
      "Probability of improvement $\\Phi\\!\\left(\\frac{y_{\\min}-\\hat\\mu}{\\hat\\sigma}\\right)$",
      "Prediction-based exploitation $\\min\\hat\\mu$",
      "Error-based exploration $\\max\\hat\\sigma$"
    ],
    answer: 0,
    explanation: "Expected improvement weights how much the objective could improve, not just the chance it improves, and is usually the fastest acquisition strategy. Prediction-based $\\min\\hat\\mu$ can get stuck; error-based $\\max\\hat\\sigma$ is pure exploration; probability of improvement ignores improvement magnitude.",
    ref: "Surrogate Optimization"
  },
  {
    id: "oa-8", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "A risk measure is evaluated on a loss distribution with a heavy tail. Compare the two quantities at the same confidence level $\\alpha$.",
    quantityA: "Value at Risk (VaR), the $\\alpha$-quantile of the loss",
    quantityB: "Conditional Value at Risk (CVaR), the expected loss in the worst $1-\\alpha$ tail",
    answer: 1,
    explanation: "CVaR is the <i>expected</i> loss over the worst $1-\\alpha$ tail — it averages outcomes at or beyond the VaR quantile — so it is at least as large as VaR and strictly larger whenever the tail carries mass beyond the quantile. CVaR is coherent, less estimation-sensitive, and accounts for the extreme losses VaR ignores.",
    ref: "Optimization under Uncertainty"
  },
  {
    id: "oa-9", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "In optimization under uncertainty, why can the <b>robust</b> optimum differ from the noise-free optimum, and how do <i>aleatory</i> and <i>epistemic</i> uncertainty differ?",
    options: [
      "A deep, narrow minimum can be risky under perturbation; aleatory uncertainty is irreducible while epistemic uncertainty is reducible",
      "A deep, narrow minimum is always the robust choice; aleatory uncertainty is reducible while epistemic uncertainty is irreducible",
      "The two optima always coincide; aleatory and epistemic uncertainty are two names for the same noise",
      "A flat, wide minimum is risky; epistemic uncertainty is irreducible and aleatory uncertainty does not affect the optimum"
    ],
    answer: 0,
    explanation: "A deep but narrow basin can give a great noise-free value yet large variation under perturbation, so the robust optimum need not be the noise-free one. Aleatory uncertainty is inherent and irreducible; epistemic uncertainty stems from limited knowledge and is reducible (e.g. with more data).",
    ref: "Optimization under Uncertainty"
  },
  {
    id: "oa-10", type: "ms", framing: "applied", difficulty: 5,
    prompt: "Select every statement that is <b>true</b> across discrete optimization, uncertainty propagation, and multidisciplinary optimization (MDO).",
    options: [
      "If the constraint matrix $\\mathbf{A}$ is totally unimodular, the simplex method returns an integer solution, so the integer program can be solved as an LP",
      "Polynomial chaos with bases orthogonal under $p$ makes the moments collapse, e.g. $\\hat\\mu=\\theta_1$, and uses Hermite polynomials for a Gaussian input",
      "In multidisciplinary analysis (MDA), a cyclic coupling can be resolved by Gauss-Seidel iteration, whereas an acyclic coupling admits a topological (serial) order",
      "Simply rounding the solution of the LP relaxation is a reliable, general way to solve integer programs",
      "Branch and bound prunes using an upper-confidence acquisition bound rather than an LP-relaxation bound"
    ],
    answer: [0, 1, 2],
    explanation: "Totally unimodular $\\mathbf{A}$ lets simplex return integers (solve as an LP); polynomial chaos with orthogonal bases collapses the moments to $\\hat\\mu=\\theta_1$ with Hermite for Gaussian inputs; and MDA uses Gauss-Seidel for cyclic couplings and topological ordering for acyclic ones. Rounding the LP relaxation is unreliable alone, and branch and bound prunes by an LP-relaxation bound — not an acquisition function.",
    ref: "Discrete optimization, uncertainty propagation & MDO"
  }
];
