/* Batch: Optimization under Uncertainty, Discrete & MDO */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["opt-uncertainty"] = [
  {
    id: "ouc-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In optimization under uncertainty, how do <i>aleatory</i> and <i>epistemic</i> uncertainty differ?",
    options: [
      "Aleatory uncertainty is inherent and irreducible; epistemic uncertainty stems from limited knowledge and is reducible (e.g. with more data)",
      "Aleatory uncertainty is reducible with more data; epistemic uncertainty is inherent and irreducible",
      "Both are irreducible; they are two names for the same sampling noise",
      "Aleatory uncertainty applies only to constraints, epistemic only to objectives"
    ],
    answer: 0,
    explanation: "Aleatory uncertainty is inherent randomness in the system and cannot be reduced; epistemic uncertainty comes from limited knowledge and <i>can</i> be reduced, for example by gathering more data or refining a model. Keeping the two straight tells you whether more sampling will actually help.",
    ref: "Optimization under uncertainty"
  },
  {
    id: "ouc-2", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "Which statement correctly contrasts the <b>minimax</b> and <b>info-gap</b> set-based robustness formulations?",
    options: [
      "Minimax minimizes the worst-case $\\max_{\\mathbf{z}\\in\\mathcal{Z}}f$ (conservative); info-gap maximizes the uncertainty gap $\\epsilon$ tolerated while staying feasible",
      "Minimax maximizes the expected value; info-gap minimizes the variance of the objective",
      "Both optimize the $\\alpha$-quantile of the loss, differing only in the choice of $\\alpha$",
      "Minimax requires a probability distribution over $\\mathbf{z}$; info-gap requires the full covariance $\\Sigma$"
    ],
    answer: 0,
    explanation: "Minimax solves $\\min_\\mathbf{x}\\max_{\\mathbf{z}\\in\\mathcal{Z}}f$ — protect against the worst case in the set $\\mathcal{Z}$ (conservative). Info-gap instead seeks the design tolerating the largest uncertainty gap $\\epsilon$ while remaining feasible; adding a performance constraint avoids over-aversion. Neither requires a probability distribution — that is the probabilistic branch.",
    ref: "Optimization under uncertainty"
  },
  {
    id: "ouc-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "At confidence level $\\alpha=0.95$ a loss distribution has Value at Risk $\\text{VaR}=10$. The worst-5% tail beyond that quantile contains losses averaging $14$. What is the Conditional Value at Risk (CVaR), the expected loss in that worst $1-\\alpha$ tail?",
    answer: 14, tolerance: 0, unit: "",
    hint: "CVaR is the mean of the losses in the worst $1-\\alpha$ tail, i.e. the values at or beyond VaR.",
    explanation: "CVaR is the <i>expected</i> loss over the worst $1-\\alpha$ tail, so it equals the tail average $14$ here — necessarily $\\ge\\text{VaR}=10$ and strictly larger whenever the tail carries mass beyond the quantile. This ordering $\\text{CVaR}\\ge\\text{VaR}$ always holds, which is why CVaR captures extremes VaR ignores.",
    ref: "Optimization under uncertainty"
  },
  {
    id: "ouc-4", type: "mc", framing: "applied", difficulty: 2,
    prompt: "How does <b>branch and bound</b> for an integer program decide it can <i>prune</i> (discard) an entire subtree without exploring it?",
    options: [
      "Its LP-relaxation bound cannot beat the best integer solution (incumbent) found so far",
      "Its upper-confidence acquisition bound exceeds a SafeOpt threshold",
      "The constraint matrix in that subtree becomes totally unimodular",
      "A Gomory cut has removed all of its integer points"
    ],
    answer: 0,
    explanation: "Each node solves an LP relaxation, giving an optimistic bound on the best integer value reachable below it. If that bound is no better than the incumbent (best integer solution found so far), the whole subtree is pruned. Acquisition bounds belong to Bayesian optimization, not branch and bound.",
    ref: "Discrete optimization"
  },
  {
    id: "ouc-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "A robust objective uses the mean-variance form $\\alpha\\,\\mathbb{E}[y]+(1-\\alpha)\\sqrt{\\text{Var}[y]}$ with risk weight $\\alpha=0.75$. A candidate design gives $\\mathbb{E}[y]=8$ and $\\text{Var}[y]=16$. What is the value of the objective (lower is better)?",
    answer: 7, tolerance: 0.001, unit: "",
    hint: "Use $\\sqrt{\\text{Var}[y]}=\\sqrt{16}=4$, then compute $0.75(8)+0.25(4)$.",
    explanation: "$\\sqrt{\\text{Var}[y]}=\\sqrt{16}=4$, so the objective is $0.75(8)+0.25(4)=6+1=7$. The weight $\\alpha$ trades mean against spread: $\\alpha=1$ ignores risk entirely, while smaller $\\alpha$ penalizes the standard deviation more heavily, pushing toward robust (low-variance) designs.",
    ref: "Optimization under uncertainty"
  },
  {
    id: "ouc-6", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "A <b>six-sigma</b> / statistical-feasibility formulation treats the probability of satisfying the constraints, $P(\\mathbf{x}\\in\\mathcal{F})$, as an objective. How is it used?",
    options: [
      "<b>Maximize</b> $P(\\mathbf{x}\\in\\mathcal{F})$ so the design stays feasible despite input variation",
      "Minimize $P(\\mathbf{x}\\in\\mathcal{F})$ to push the design toward the constraint boundary",
      "Set $P(\\mathbf{x}\\in\\mathcal{F})=0$ to guarantee an interior solution",
      "Maximize the variance of the constraint residuals"
    ],
    answer: 0,
    explanation: "Statistical feasibility is <i>maximized</i>: you want a high probability that the realized design stays inside the feasible set $\\mathcal{F}$ once inputs jitter. The six-sigma idea is to keep many standard deviations of slack between the nominal design and each constraint boundary, so random variation rarely violates a constraint.",
    ref: "Optimization under uncertainty"
  },
  {
    id: "ouc-7", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that is <b>true</b> about discrete (integer) optimization.",
    options: [
      "If the constraint matrix $\\mathbf{A}$ is totally unimodular, the LP relaxation already returns an integer solution, so the integer program can be solved as a plain LP",
      "Cutting planes (Gomory) add a constraint that excludes the fractional vertex while keeping every integer point feasible",
      "Dynamic programming exploits optimal substructure plus overlapping subproblems, e.g. the 0-1 knapsack recurrence",
      "Ant colony optimization lays pheromone trails on a graph, $A(i\\to j)=\\tau^\\alpha\\eta^\\beta$, for routing/TSP",
      "Simply rounding the LP-relaxation solution is a reliable, general way to solve integer programs"
    ],
    answer: [0, 1, 2, 3],
    explanation: "Totally unimodular $\\mathbf{A}$ (every subdeterminant in $\\{0,\\pm1\\}$) makes the LP relaxation integral; Gomory cutting planes remove the fractional vertex but keep all integer points; dynamic programming uses optimal substructure and overlapping subproblems (0-1 knapsack); ant colony optimization uses pheromone $\\tau^\\alpha\\eta^\\beta$ with evaporation. Only naive rounding is unreliable on its own.",
    ref: "Discrete optimization"
  },
  {
    id: "ouc-8", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "A risk measure is evaluated on a loss distribution with a heavy tail. Compare the two quantities at the same confidence level $\\alpha$.",
    quantityA: "Value at Risk (VaR), the $\\alpha$-quantile of the loss",
    quantityB: "Conditional Value at Risk (CVaR), the expected loss in the worst $1-\\alpha$ tail",
    answer: 1,
    explanation: "CVaR is the <i>expected</i> loss over the worst $1-\\alpha$ tail — it averages outcomes at or beyond the VaR quantile — so it is at least as large as VaR and strictly larger whenever the tail carries mass beyond the quantile. CVaR is coherent, less estimation-sensitive, and accounts for the extreme losses VaR ignores.",
    ref: "Optimization under uncertainty"
  },
  {
    id: "ouc-9", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "In optimization under uncertainty, why can the <b>robust</b> optimum differ from the noise-free optimum?",
    options: [
      "A deep but narrow minimum can give a great noise-free value yet vary wildly under input perturbation, so a wider, shallower basin is often more robust",
      "A deep, narrow minimum is always the robust choice because it has the lowest nominal value",
      "The robust and noise-free optima always coincide once the objective is continuous",
      "A flat, wide minimum is the riskiest design under perturbation"
    ],
    answer: 0,
    explanation: "A deep but narrow basin can give a great noise-free value yet large variation once inputs jitter, so the robust optimum need not be the noise-free one — a wider, flatter minimum trades a little nominal performance for stability. This is the central warning of robust optimization.",
    ref: "Optimization under uncertainty"
  },
  {
    id: "ouc-10", type: "ms", framing: "applied", difficulty: 5,
    prompt: "Select every statement that is <b>true</b> across uncertainty propagation, multidisciplinary analysis (MDA), and MDO architectures.",
    options: [
      "Polynomial chaos with bases orthogonal under $p$ ($b_1=1$) makes the moments collapse to $\\hat\\mu=\\theta_1$, and uses Hermite polynomials for a Gaussian input",
      "In MDA, a cyclic coupling can be resolved by Gauss-Seidel iteration, whereas an acyclic coupling admits a topological (serial) order",
      "IDF (individual discipline feasible) introduces coupling-variable aliases tied by equality constraints, letting the analyses run in parallel and becoming consistent only at convergence",
      "MDF (multidisciplinary feasible) runs a full MDA inside every evaluation, so it is cheap but only compatible at the very end",
      "A second-order Taylor approximation of output moments needs no derivatives of $f$"
    ],
    answer: [0, 1, 2],
    explanation: "Polynomial chaos with $p$-orthogonal bases collapses moments to $\\hat\\mu=\\theta_1$ (Hermite for Gaussian inputs); MDA uses Gauss-Seidel for cyclic couplings and topological ordering for acyclic ones; IDF aliases coupling variables with equality constraints for parallel analyses, consistent only at convergence. MDF is the opposite of cheap — it runs a full MDA per evaluation (always compatible, expensive) — and the Taylor approximation needs second derivatives.",
    ref: "Uncertainty propagation & MDO"
  }
];
