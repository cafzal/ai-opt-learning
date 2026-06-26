/* Batch: Linear Algebra & Optimization */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["linalg-opt"] = [
  {
    id: "lao-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Which vector norm is described as <b>sparsity-inducing</b>?",
    options: [
      "$\\ell_1$, $\\sum_i|x_i|$",
      "$\\ell_2$, $\\sqrt{\\boldsymbol{x}^\\top\\boldsymbol{x}}$",
      "$\\ell_\\infty$, $\\max_i|x_i|$",
      "Frobenius, $\\sqrt{\\sum_{ij}A_{ij}^2}$"
    ],
    answer: 0,
    explanation: "The $\\ell_1$ norm $\\sum_i|x_i|$ is the sparsity-inducing norm. The $\\ell_2$ norm is the default Euclidean norm, $\\ell_\\infty$ takes the max coordinate, and the Frobenius norm treats a matrix as a flattened vector.",
    ref: "Norms"
  },
  {
    id: "lao-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What property does an <b>orthogonal</b> matrix $\\mathbf{U}$ (with $\\mathbf{U}^\\top\\mathbf{U}=\\mathbf{I}$) have?",
    options: [
      "It preserves norms and angles",
      "All of its eigenvalues are strictly positive",
      "Its determinant equals the sum of its eigenvalues",
      "It is always singular"
    ],
    answer: 0,
    explanation: "An orthogonal matrix satisfies $\\mathbf{U}^\\top\\mathbf{U}=\\mathbf{I}$ and preserves norms and angles. Strictly positive eigenvalues characterize positive-definite matrices; the determinant is the <i>product</i> (not sum) of eigenvalues; orthogonal matrices are invertible, not singular.",
    ref: "Special matrices & scalars"
  },
  {
    id: "lao-3", type: "mc", framing: "applied", difficulty: 2,
    prompt: "The <b>condition number</b> is $\\kappa=\\sigma_{\\max}/\\sigma_{\\min}$. For a matrix with largest singular value $\\sigma_{\\max}=10$ and smallest singular value $\\sigma_{\\min}=2$, what is $\\kappa$, and what does it imply?",
    options: [
      "$\\kappa=5$ — moderately ill-conditioned, slowing gradient descent",
      "$\\kappa=0.2$ — well-conditioned, since $\\kappa<1$",
      "$\\kappa=8$ — the difference $\\sigma_{\\max}-\\sigma_{\\min}$",
      "$\\kappa=20$ — the product $\\sigma_{\\max}\\cdot\\sigma_{\\min}$"
    ],
    answer: 0,
    explanation: "$\\kappa=\\sigma_{\\max}/\\sigma_{\\min}=10/2=5$. A condition number $\\kappa\\ge1$ always; larger $\\kappa$ means a more ill-conditioned matrix and slower gradient-descent convergence.",
    ref: "Special matrices & scalars"
  },
  {
    id: "lao-4", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "For a matrix $\\mathbf{A}$, the <b>trace</b> and <b>determinant</b> relate to its eigenvalues $\\lambda_i$ how?",
    options: [
      "$\\text{tr}(\\mathbf{A})=\\sum_i\\lambda_i$ and $|\\mathbf{A}|=\\prod_i\\lambda_i$",
      "$\\text{tr}(\\mathbf{A})=\\prod_i\\lambda_i$ and $|\\mathbf{A}|=\\sum_i\\lambda_i$",
      "Both equal $\\sum_i\\lambda_i$",
      "Both equal $\\prod_i\\lambda_i$"
    ],
    answer: 0,
    explanation: "The trace is the sum of eigenvalues, $\\text{tr}(\\mathbf{A})=\\sum_i A_{ii}=\\sum_i\\lambda_i$, while the determinant is the product, $|\\mathbf{A}|=\\prod_i\\lambda_i$ (a volume scaling that is 0 iff the matrix is singular).",
    ref: "Special matrices & scalars"
  },
  {
    id: "lao-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "The <b>L1 proximal operator</b> (soft-thresholding) is $\\text{sign}(\\theta)(|\\theta|-\\lambda)_+$. With $\\theta=-0.8$ and threshold $\\lambda=0.3$, what value does it return?",
    answer: -0.5, tolerance: 0.001, unit: "",
    hint: "$(\\cdot)_+$ clips negatives to 0; keep the sign of $\\theta$.",
    explanation: "$\\text{sign}(-0.8)\\,(|{-0.8}|-0.3)_+=(-1)(0.8-0.3)_+=(-1)(0.5)=-0.5$. Soft-thresholding shrinks each coordinate toward 0 by $\\lambda$ (and zeros out anything with $|\\theta|\\le\\lambda$) — the mechanism behind Lasso.",
    ref: "Proximal / projected gradient"
  },
  {
    id: "lao-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that is true about <b>convex</b> functions as defined in the notes.",
    options: [
      "Convexity is equivalent to the Hessian being positive-semidefinite, $\\mathbf{H}\\succeq0$",
      "For a convex problem, every local minimum is a global minimum",
      "Convexity requires the function to be smooth (twice differentiable everywhere)",
      "Jensen's inequality $f(\\mathbb{E}[x])\\le\\mathbb{E}[f(x)]$ holds for convex $f$",
      "A function is convex iff $f(\\lambda\\boldsymbol{x}+(1-\\lambda)\\boldsymbol{y})\\ge\\lambda f(\\boldsymbol{x})+(1-\\lambda)f(\\boldsymbol{y})$"
    ],
    answer: [0, 1, 3],
    explanation: "Convexity $\\Leftrightarrow\\mathbf{H}\\succeq0$, guarantees every local min is global, and yields Jensen's inequality $f(\\mathbb{E}[x])\\le\\mathbb{E}[f(x)]$. Convex functions need not be smooth — non-smooth ones use subgradients (e.g. $\\partial|x|\\big|_0=[-1,1]$). The defining inequality has $\\le$, not $\\ge$.",
    ref: "Taxonomy & convexity"
  },
  {
    id: "lao-7", type: "mc", framing: "applied", difficulty: 3,
    prompt: "Using the matrix-calculus table, what is the gradient $\\nabla_{\\boldsymbol{x}}$ of the quadratic form $\\boldsymbol{x}^\\top\\mathbf{A}\\boldsymbol{x}$ for symmetric $\\mathbf{A}$?",
    options: [
      "$2\\mathbf{A}\\boldsymbol{x}$",
      "$\\mathbf{A}\\boldsymbol{x}$",
      "$2\\boldsymbol{x}$",
      "$\\mathbf{A}^{-\\top}$"
    ],
    answer: 0,
    explanation: "For symmetric $\\mathbf{A}$, $\\nabla_{\\boldsymbol{x}}(\\boldsymbol{x}^\\top\\mathbf{A}\\boldsymbol{x})=2\\mathbf{A}\\boldsymbol{x}$. By contrast $\\nabla\\|\\boldsymbol{x}\\|_2^2=2\\boldsymbol{x}$, $\\nabla(\\boldsymbol{a}^\\top\\boldsymbol{x})=\\boldsymbol{a}$, and $\\nabla\\log\\det\\mathbf{A}=\\mathbf{A}^{-\\top}$.",
    ref: "Least squares & matrix calculus"
  },
  {
    id: "lao-8", type: "numeric", framing: "applied", difficulty: 4,
    prompt: "For a quadratic, gradient descent's convergence rate is $\\mu=\\big(\\frac{\\kappa-1}{\\kappa+1}\\big)^2$. For condition number $\\kappa=3$, what is $\\mu$?",
    answer: 0.25, tolerance: 0.001, unit: "",
    hint: "Plug $\\kappa=3$ into $\\big(\\frac{\\kappa-1}{\\kappa+1}\\big)^2$.",
    explanation: "$\\mu=\\big(\\frac{3-1}{3+1}\\big)^2=\\big(\\frac{2}{4}\\big)^2=(0.5)^2=0.25$. As $\\kappa$ grows the ratio approaches 1, so $\\mu\\to1$ and convergence slows to a zig-zag crawl.",
    ref: "First-order methods"
  },
  {
    id: "lao-9", type: "ms", framing: "applied", difficulty: 4,
    prompt: "Select every statement that correctly describes a <b>second-order</b> or <b>adaptive</b> optimization method from the notes.",
    options: [
      "Newton's step $-\\eta_t\\mathbf{H}_t^{-1}\\boldsymbol{g}_t$ undoes curvature skew and costs $O(D^3)$ to invert",
      "Newton's method takes one step to solve linear regression",
      "AdaGrad scales each dimension by $1/\\sqrt{\\sum_{i\\le t} g_{i,d}^2}$, so its effective learning rate decays to 0",
      "L-BFGS stores the full $D\\times D$ inverse-Hessian explicitly",
      "Adam's default momentum parameters are $\\beta_1{=}0.99,\\ \\beta_2{=}0.99$"
    ],
    answer: [0, 1, 2],
    explanation: "Newton undoes curvature, costs $O(D^3)$ to invert $\\mathbf{H}$, and solves linear regression in one step; AdaGrad's accumulating denominator drives its learning rate to 0. L-BFGS stores only ~5-20 vector pairs (not the full inverse Hessian), and Adam's defaults are $\\beta_1{=}0.9,\\ \\beta_2{=}0.999$.",
    ref: "Second-order methods / Adaptive preconditioners"
  },
  {
    id: "lao-10", type: "qc", framing: "conceptual", difficulty: 5,
    prompt: "In the <b>EM algorithm</b>, after the E-step sets $q_n^*=p(\\boldsymbol{z}_n\\mid\\boldsymbol{y}_n,\\boldsymbol\\theta)$, two quantities are compared at the current $\\boldsymbol\\theta$.",
    quantityA: "The log-likelihood $\\ell(\\boldsymbol\\theta)$",
    quantityB: "The ELBO (variational lower bound) evaluated with $q_n^*$",
    answer: 2,
    explanation: "The ELBO is a lower bound, $\\ell(\\boldsymbol\\theta)\\ge\\text{ELBO}$, with equality exactly when $q_n=p(\\boldsymbol{z}_n\\mid\\boldsymbol{y}_n,\\boldsymbol\\theta)$. The E-step chooses precisely that $q_n^*$, making the bound <i>tight</i> — so the two quantities are equal at the current $\\boldsymbol\\theta$.",
    ref: "EM as bound optimization"
  }
];
