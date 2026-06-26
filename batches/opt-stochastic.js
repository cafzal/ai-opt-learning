/* Batch: Stochastic, Population & Derivative-Free Optimization  (Optimization Fundamentals §S9–§S13, Opt Ch 5/8/9) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["opt-stochastic"] = [
  {
    id: "os-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In <b>simulated annealing</b>, what role does the temperature $t$ play?",
    options: [
      "It controls the stochasticity: high $t$ explores, and cooling it makes the search converge",
      "It is the fixed step size used for every candidate move",
      "It is the gradient magnitude used to pick the descent direction",
      "It is the number of individuals carried in the population each generation"
    ],
    answer: 0,
    explanation: "Temperature $t$ controls the stochasticity of the search: high temperature explores widely, and the schedule cools $t$ so the method converges. Simulated annealing is a derivative-free method, so there is no gradient direction, and it tracks a single candidate rather than a population.",
    ref: "§S13 — Simulated annealing"
  },
  {
    id: "os-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "The <b>cross-entropy method</b> maintains a proposal distribution $p(\\cdot\\mid\\psi)$ (often an MVN). Each iteration, after sampling $m$ points, how is $\\psi$ updated?",
    options: [
      "Keep the $m_{\\text{elite}}$ best samples and refit $\\psi$ to them by maximum likelihood",
      "Take a single gradient step on $\\psi$ using the log-derivative trick",
      "Average $\\psi$ with a random restart drawn from a Cauchy distribution",
      "Replace $\\psi$ with the single best sample found so far"
    ],
    answer: 0,
    explanation: "The cross-entropy method keeps the $m_{\\text{elite}}$ best samples and refits $\\psi$ to those elites by MLE, which is equivalent to minimizing the cross-entropy (KL) to the elite set. For an MVN, $\\mu\\leftarrow$ mean of elites and $\\Sigma\\leftarrow$ their covariance. Updating $\\psi$ by a gradient step instead is what evolution strategies (NES) do.",
    ref: "§S10 — Cross-entropy method"
  },
  {
    id: "os-3", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "The <b>momentum</b> update is $\\mathbf{v}\\leftarrow\\beta\\mathbf{v}-\\alpha\\mathbf{g}$ then $\\mathbf{x}\\leftarrow\\mathbf{x}+\\mathbf{v}$. How does <b>Nesterov</b> momentum differ?",
    options: [
      "It evaluates the gradient at the projected (look-ahead) point $\\mathbf{x}+\\beta\\mathbf{v}$",
      "It replaces the gradient with a per-component squared-gradient average",
      "It removes the step-factor parameter $\\alpha$ entirely",
      "It resets the velocity $\\mathbf{v}$ to zero on every iteration"
    ],
    answer: 0,
    explanation: "Nesterov momentum evaluates the gradient at the projected point $\\mathbf{x}+\\beta\\mathbf{v}$ — where momentum is about to carry the iterate — rather than at the current $\\mathbf{x}$. Using a squared-gradient average describes RMSProp, and removing the step-factor describes Adadelta.",
    ref: "Opt Ch 5 — First-Order Methods"
  },
  {
    id: "os-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "Simulated annealing's <b>Metropolis acceptance</b> rule accepts a candidate with probability $1$ if $\\Delta y\\le 0$, else $e^{-\\Delta y/t}$. A candidate is <i>downhill</i> with $\\Delta y=-3$ at temperature $t=2$. What is its acceptance probability?",
    answer: 1, tolerance: 0, unit: "",
    hint: "Check the sign of $\\Delta y$ before reaching for the exponential.",
    explanation: "Because $\\Delta y=-3\\le 0$ the move improves the objective, so it is accepted with probability exactly $1$ — the exponential branch $e^{-\\Delta y/t}$ only applies to uphill ($\\Delta y>0$) moves, which are accepted with some probability so the search can escape local minima.",
    ref: "§S13 — Simulated annealing"
  },
  {
    id: "os-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Using the same Metropolis rule, an <i>uphill</i> candidate has $\\Delta y=2$ at temperature $t=2$ (so $\\Delta y=t$). What is its acceptance probability $e^{-\\Delta y/t}$? Give a decimal.",
    answer: 0.368, tolerance: 0.01, unit: "",
    hint: "$\\Delta y=t$ makes the exponent $-1$.",
    explanation: "With $\\Delta y=t$ the exponent is $-\\Delta y/t=-1$, so the acceptance probability is $e^{-1}\\approx 0.368$. Allowing uphill moves with nonzero probability is exactly how simulated annealing escapes local minima; as $t$ is cooled this probability shrinks toward $0$.",
    ref: "§S13 — Simulated annealing"
  },
  {
    id: "os-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that correctly describes the <b>log-derivative (likelihood-ratio) trick</b>, $\\nabla_\\theta\\mathbb{E}_{\\mathbf{x}\\sim p}[f(\\mathbf{x})]=\\mathbb{E}_{\\mathbf{x}\\sim p}[f(\\mathbf{x})\\nabla_\\theta\\log p(\\mathbf{x}\\mid\\theta)]$.",
    options: [
      "It needs only $\\nabla_\\theta\\log p$, so the objective $f$ can be a black box",
      "The estimator is unbiased but tends to have high variance",
      "For a stochastic policy's trajectories, the transition model cancels in $\\nabla_\\theta\\log p_\\theta(\\tau)$",
      "It requires the objective $f(\\mathbf{x})$ to be differentiable in $\\mathbf{x}$",
      "It is the basis for evolution strategies / NES updates"
    ],
    answer: [0, 1, 2, 4],
    explanation: "The trick differentiates an expectation by differentiating only $\\log p$, so $f$ may be black-box (non-differentiable) — option 4 is therefore false. The estimator is unbiased but high-variance (reduced via baselines / reward-to-go), the transition model cancels for trajectory gradients, and NES updates its parameters with exactly this gradient.",
    ref: "§S9 — The log-derivative (likelihood-ratio) trick"
  },
  {
    id: "os-7", type: "ms", framing: "applied", difficulty: 4,
    prompt: "You are configuring a <b>genetic algorithm</b>. Select every choice that matches the catalog of standard components.",
    options: [
      "Selection by truncation, tournament, or roulette",
      "Crossover by single-point, two-point, uniform, or interpolation",
      "A per-individual mutation rate on the order of $1/m$ (e.g. adding Gaussian noise)",
      "Elitism to carry the best individuals into the next generation",
      "A Metropolis acceptance test applied to each crossover child"
    ],
    answer: [0, 1, 2, 3],
    explanation: "A genetic algorithm combines selection (truncation / tournament / roulette), crossover (single / two-point / uniform / interpolation), mutation (rate ~$1/m$, e.g. additive Gaussian), and elitism. The Metropolis acceptance test belongs to simulated annealing, not GA recombination.",
    ref: "§S12 — Genetic, population & local search"
  },
  {
    id: "os-8", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "<b>Adaptive learning-rate</b> methods. Which description is correct?",
    options: [
      "<b>Adam</b> combines a momentum-like first moment with an RMS second moment and applies bias correction",
      "<b>AdaGrad</b> increases its per-component step size as squared gradients accumulate",
      "<b>RMSProp</b> removes the step-factor parameter, the way Adadelta does",
      "<b>Adadelta</b> evaluates the gradient at a projected look-ahead point"
    ],
    answer: 0,
    explanation: "Adam tracks $\\mathbf{v}\\leftarrow\\gamma_v\\mathbf{v}+(1-\\gamma_v)\\mathbf{g}$ and $\\mathbf{s}\\leftarrow\\gamma_s\\mathbf{s}+(1-\\gamma_s)\\mathbf{g}\\odot\\mathbf{g}$, bias-corrects both, and steps with $\\hat{\\mathbf{v}}/(\\epsilon+\\sqrt{\\hat{\\mathbf{s}}})$. AdaGrad's per-component factor $\\alpha/(\\epsilon+\\sqrt{\\sum_j g_i^{(j)2}})$ only shrinks (it decays too far); removing the step-factor is Adadelta; the look-ahead point is Nesterov momentum.",
    ref: "Opt Ch 5 — First-Order Methods"
  },
  {
    id: "os-9", type: "numeric", framing: "applied", difficulty: 4,
    prompt: "Adam is typically run with its default hyperparameters $(\\alpha,\\gamma_v,\\gamma_s)$. What is the default <b>step factor</b> $\\alpha$?",
    answer: 0.001, tolerance: 0, unit: "",
    hint: "The defaults are written $(0.001,\\,0.9,\\,0.999)$.",
    explanation: "Adam's defaults are $\\alpha=0.001$, $\\gamma_v=0.9$ (first-moment / momentum decay), and $\\gamma_s=0.999$ (second-moment / squared-gradient decay). The slower decay on $\\mathbf{s}$ gives a longer-memory estimate of the gradient's magnitude.",
    ref: "Opt Ch 5 — First-Order Methods"
  },
  {
    id: "os-10", type: "qc", framing: "conceptual", difficulty: 5,
    prompt: "Compare two simulated-annealing <b>cooling schedules</b> for reaching the global optimum. The <i>logarithmic</i> schedule carries a theoretical global-optimum guarantee; the <i>exponential</i> schedule is $t\\leftarrow\\gamma t$.",
    quantityA: "Theoretical guarantee of converging to the global optimum, logarithmic schedule",
    quantityB: "Theoretical guarantee of converging to the global optimum, exponential schedule",
    answer: 0,
    explanation: "The logarithmic schedule is the one that carries the global-optimum guarantee (though it is very slow); the faster exponential schedule $t\\leftarrow\\gamma t$ trades that guarantee for speed. So Quantity A — the schedule with the guarantee — is greater.",
    ref: "§S13 — Simulated annealing"
  }
];
