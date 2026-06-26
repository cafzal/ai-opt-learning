/* Batch: Optimization Foundations  (Opt Ch 1–7; shared primitives §S5–§S7) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["opt-foundations"] = [
  {
    id: "of-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In the standard form $\\min_\\mathbf{x} f(\\mathbf{x})$ s.t. $\\mathbf{x}\\in\\mathcal{X}$, what is $\\mathcal{X}$?",
    options: [
      "The feasible set — the values $\\mathbf{x}$ is allowed to take",
      "The objective function being minimized",
      "The minimizer $\\mathbf{x}^*$",
      "The gradient of $f$ at the design point"
    ],
    answer: 0,
    explanation: "In the standard form, $\\mathbf{x}$ is the design point/variables, $f$ is the objective, $\\mathcal{X}$ is the feasible set, and $\\mathbf{x}^*$ is the minimizer. A caution from the text: strict-inequality feasible sets may have no solution, so one includes the constraint boundary.",
    ref: "Opt Ch 1 — Introduction"
  },
  {
    id: "of-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What does the <b>gradient</b> $\\nabla f$ point toward, and what does the <b>Hessian</b> $\\nabla^2 f$ measure?",
    options: [
      "Gradient = steepest ascent; Hessian = curvature",
      "Gradient = steepest descent; Hessian = the feasible set",
      "Gradient = curvature; Hessian = steepest ascent",
      "Gradient = directional derivative; Hessian = the step size"
    ],
    answer: 0,
    explanation: "The gradient $\\nabla f$ is the direction of steepest ascent, the Hessian $\\nabla^2 f$ captures curvature, and the directional derivative is $\\nabla_\\mathbf{s} f=\\nabla f^\\top\\mathbf{s}$. (Descent methods therefore step along $-\\nabla f$.)",
    ref: "Opt Ch 2 — Derivatives and Gradients"
  },
  {
    id: "of-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "<b>Newton's method</b> on a scalar function uses the step $x^{(k+1)}=x^{(k)}-f'(x)/f''(x)$. At $x^{(k)}=5$ with $f'(x)=4$ and $f''(x)=2$, what is the next iterate $x^{(k+1)}$?",
    answer: 3, tolerance: 0, unit: "",
    hint: "Subtract $f'(x)/f''(x)$ from the current point.",
    explanation: "The Newton step is $\\mathbf{x}^{(k+1)}=\\mathbf{x}^{(k)}-(\\mathbf{H}^{(k)})^{-1}\\mathbf{g}^{(k)}$; in one scalar dimension that is $x-f'(x)/f''(x)=5-4/2=5-2=3$. On a quadratic this reaches the minimum in a single step.",
    ref: "§S6 — Newton & quasi-Newton"
  },
  {
    id: "of-4", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "The <b>no free lunch</b> theorem (Wolpert & Macready) asserts that:",
    options: [
      "No optimization method beats another when averaged over all possible problems",
      "Gradient descent is always at least as good as a derivative-free method",
      "Newton's method converges fastest on every twice-differentiable function",
      "A global minimum can always be certified in finite time"
    ],
    answer: 0,
    explanation: "No free lunch says no method is superior to another averaged over all problems; any claimed superiority requires problem-class assumptions such as Lipschitz continuity or convexity. It does not single out any one algorithm as universally best.",
    ref: "Opt Ch 1 — Introduction"
  },
  {
    id: "of-5", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every condition that, taken together, forms the <b>second-order sufficient</b> condition for $\\mathbf{x}^*$ to be a <i>strong</i> local minimum.",
    options: [
      "$\\nabla f(\\mathbf{x}^*)=\\mathbf{0}$ (stationary)",
      "$\\nabla^2 f(\\mathbf{x}^*)$ is positive definite",
      "$\\nabla^2 f(\\mathbf{x}^*)$ is merely positive semidefinite",
      "$\\nabla^2 f(\\mathbf{x}^*)$ is negative definite",
      "$\\mathbf{x}^*$ lies on the boundary of $\\mathcal{X}$"
    ],
    answer: [0, 1],
    explanation: "The second-order sufficient condition is $\\nabla f=\\mathbf{0}$ <b>and</b> $\\nabla^2 f$ positive definite, which guarantees a strong local minimum (a bowl). A merely PSD Hessian is only the second-order <i>necessary</i> condition; a negative-definite Hessian gives a hill (local maximum).",
    ref: "Opt Ch 1 — Introduction"
  },
  {
    id: "of-6", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "A central finite-difference approximation of a derivative has error of order $O(h^p)$. What is the integer $p$?",
    answer: 2, tolerance: 0, unit: "",
    hint: "Forward differences are $O(h)$; central differences are one order more accurate.",
    explanation: "Forward differences are $O(h)$ and central differences are $O(h^2)$, so $p=2$. Shrinking $h$ reduces truncation error but eventually triggers subtractive cancellation, so usable steps sit near the square (forward) or cube (central) root of machine precision.",
    ref: "Opt Ch 2 — Derivatives and Gradients"
  },
  {
    id: "of-7", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "Which statement correctly contrasts <b>line search</b> with the <b>trust region</b> (restricted-step) approach?",
    options: [
      "Line search picks a direction then a step; trust region picks a max step then a direction",
      "Line search picks a max step then a direction; trust region picks a direction then a step",
      "Both pick the step before the direction",
      "Both pick the direction before the step"
    ],
    answer: 0,
    explanation: "Line search chooses a descent direction $\\mathbf{d}$ first and then solves $\\min_\\alpha f(\\mathbf{x}+\\alpha\\mathbf{d})$ for the step. A trust region instead fixes a maximum step size (radius $\\delta$) first, then minimizes the model $\\hat f$ within $\\|\\mathbf{x}-\\mathbf{x}'\\|\\le\\delta$ to get the direction.",
    ref: "§S7 — Trust region / restricted step"
  },
  {
    id: "of-8", type: "mc", framing: "applied", difficulty: 4,
    prompt: "<b>Reverse-mode</b> automatic differentiation (backpropagation) is preferred over forward mode in which situation?",
    options: [
      "Computing the gradient of a scalar output with respect to many inputs (high-dimensional)",
      "When $f$ has a single input and many outputs",
      "When no computation graph can be stored in memory",
      "When derivatives must avoid the chain rule entirely"
    ],
    answer: 0,
    explanation: "Reverse mode does one forward pass plus one backward pass to produce the full gradient regardless of input dimension, making it best for high-dimensional inputs (its cost is per-output). Forward mode (via dual numbers $a+b\\epsilon$, $\\epsilon^2=0$) needs $n$ passes for $n$ inputs. Reverse mode's cost is memory to store the graph.",
    ref: "Opt Ch 2 — Derivatives and Gradients"
  },
  {
    id: "of-9", type: "ms", framing: "applied", difficulty: 4,
    prompt: "Select every TRUE statement about <b>first-order</b> methods (steepest descent and conjugate gradient).",
    options: [
      "Steepest descent uses $\\mathbf{d}=-\\mathbf{g}/\\|\\mathbf{g}\\|$",
      "With exact line search, consecutive steepest-descent directions are orthogonal, causing zig-zag in narrow valleys",
      "Conjugate gradient can solve an $n$-dimensional quadratic in $n$ steps",
      "The Fletcher–Reeves and Polak–Ribière formulas give the step size $\\alpha$",
      "Conjugate gradient ignores the previous search direction entirely"
    ],
    answer: [0, 1, 2],
    explanation: "Steepest descent normalizes the negative gradient, $\\mathbf{d}=-\\mathbf{g}/\\|\\mathbf{g}\\|$, and its exact-line-search directions are orthogonal, producing zig-zag. Conjugate gradient uses $\\mathbf{d}^{(k)}=-\\mathbf{g}^{(k)}+\\beta^{(k)}\\mathbf{d}^{(k-1)}$ — it explicitly reuses the prior direction — and solves an $n$-dim quadratic in $n$ steps. Fletcher–Reeves and Polak–Ribière define $\\beta$ (the conjugacy weight), not the step size.",
    ref: "Opt Ch 5 — First-Order Methods"
  },
  {
    id: "of-10", type: "qc", framing: "conceptual", difficulty: 5,
    prompt: "<b>Levenberg–Marquardt</b> uses the damped-Newton step $\\mathbf{x}'=\\mathbf{x}-(\\mathbf{H}+\\delta\\mathbf{I})^{-1}\\mathbf{g}$. Compare the effective behavior in the two damping limits.",
    quantityA: "How much the step resembles plain gradient descent when $\\delta$ is very large",
    quantityB: "How much the step resembles plain gradient descent when $\\delta$ is very small",
    answer: 0,
    explanation: "As $\\delta\\to\\infty$, $\\mathbf{H}+\\delta\\mathbf{I}\\approx\\delta\\mathbf{I}$, so the step $\\to-\\tfrac{1}{\\delta}\\mathbf{g}$, a scaled gradient-descent step; as $\\delta\\to0$ it recovers the Newton step $-\\mathbf{H}^{-1}\\mathbf{g}$. So large $\\delta$ resembles gradient descent more (A is greater). This damping is the second-order-method link to the trust region.",
    ref: "§S7 — Trust region / restricted step"
  }
];
