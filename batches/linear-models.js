/* Batch: Linear & Sparse Models */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["linear-models"] = [
  {
    id: "lin-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In linear regression the model is $p(y\\mid\\boldsymbol{x},\\boldsymbol\\theta)=\\mathcal{N}(y\\mid w_0+\\boldsymbol{w}^\\top\\boldsymbol{x},\\sigma^2)$. Fitting it by <b>maximum likelihood</b> is equivalent to:",
    options: [
      "Least squares — minimizing the residual sum of squares $\\tfrac12\\|\\mathbf{X}\\boldsymbol{w}-\\boldsymbol{y}\\|^2$",
      "Minimizing the $\\ell_1$ norm of the residuals",
      "Maximizing $R^2$ subject to a sparsity constraint",
      "Minimizing the hinge loss"
    ],
    answer: 0,
    explanation: "Under a Gaussian likelihood the negative log-likelihood reduces to the residual sum of squares, so <b>MLE = least squares</b>: minimize RSS $=\\tfrac12\\|\\mathbf{X}\\boldsymbol{w}-\\boldsymbol{y}\\|^2$. The $\\ell_1$ residual penalty corresponds instead to a Laplace likelihood (robust regression).",
    ref: "Linear regression"
  },
  {
    id: "lin-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Which prior, used as a <b>MAP</b> estimate, yields <b>ridge</b> regression?",
    options: [
      "A Gaussian prior on $\\boldsymbol{w}$",
      "A Laplace prior on $\\boldsymbol{w}$",
      "A uniform (flat) prior on $\\boldsymbol{w}$",
      "A spike-and-slab prior on $\\boldsymbol{w}$"
    ],
    answer: 0,
    explanation: "Ridge = MAP with a <b>Gaussian</b> prior, giving $\\hat{\\boldsymbol{w}}_{\\text{ridge}}=(\\mathbf{X}^\\top\\mathbf{X}+\\lambda\\mathbf{I})^{-1}\\mathbf{X}^\\top\\boldsymbol{y}$. A Laplace prior gives the lasso; a flat prior gives ordinary MLE (no shrinkage).",
    ref: "Ridge (L2) and Lasso (L1)"
  },
  {
    id: "lin-3", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "In OLS, the fitted values $\\hat{\\boldsymbol{y}}=\\mathbf{X}\\hat{\\boldsymbol{w}}$ are the orthogonal projection of $\\boldsymbol{y}$ onto the column space of $\\mathbf{X}$. What does this projection geometry imply about the residual $\\boldsymbol{y}-\\hat{\\boldsymbol{y}}$?",
    options: [
      "It is orthogonal to every column of $\\mathbf{X}$",
      "It is parallel to the first column of $\\mathbf{X}$",
      "It has zero variance",
      "It equals the projection $\\hat{\\boldsymbol{y}}$"
    ],
    answer: 0,
    explanation: "Because $\\hat{\\boldsymbol{y}}$ is the orthogonal projection onto the column space, the residual is perpendicular to that space — i.e. the residual $\\perp$ every column of $\\mathbf{X}$. This orthogonality is exactly the content of the normal equations.",
    ref: "Linear regression"
  },
  {
    id: "lin-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "For an <b>orthonormal</b> design $\\mathbf{X}$, the lasso solution is the soft-threshold $\\text{sign}(\\hat w_d)\\,(|\\hat w_d|-\\lambda)_+$. If the OLS coefficient is $\\hat w_d=0.8$ and $\\lambda=0.3$, what is the lasso coefficient?",
    answer: 0.5, tolerance: 0.001, unit: "",
    hint: "Shrink the magnitude by $\\lambda$, keeping the sign; clamp at 0.",
    explanation: "Soft-thresholding: $\\text{sign}(0.8)\\,(|0.8|-0.3)_+ = 1\\cdot(0.5)_+ = 0.5$. The coefficient is pulled toward zero by exactly $\\lambda$; had $|\\hat w_d|\\le\\lambda$ it would have been set to exactly $0$ (sparsity).",
    ref: "Ridge (L2) and Lasso (L1)"
  },
  {
    id: "lin-5", type: "mc", framing: "applied", difficulty: 3,
    prompt: "You fit logistic regression on a dataset that turns out to be <b>linearly separable</b>. Training the unregularized MLE, you observe $\\|\\boldsymbol{w}\\|$ growing without bound. What is the standard fix?",
    options: [
      "Add an L2 penalty (MAP with a Gaussian prior)",
      "Switch from the sigmoid to a hard threshold",
      "Increase the learning rate",
      "Remove the bias term"
    ],
    answer: 0,
    explanation: "On linearly separable data the logistic MLE diverges ($\\|\\boldsymbol{w}\\|\\to\\infty$) as the model pushes probabilities to 0/1. Adding an L2 penalty (equivalently, a Gaussian prior / MAP estimate) keeps the weights finite and the problem well-posed.",
    ref: "Logistic regression (binary)"
  },
  {
    id: "lin-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that correctly contrasts <b>ridge (L2)</b> with <b>lasso (L1)</b> regression.",
    options: [
      "Lasso can drive coefficients to exactly zero, performing feature selection; ridge cannot",
      "Ridge has a closed-form solution; lasso does not (its penalty is non-smooth at 0)",
      "On correlated features ridge shrinks them together (stable), while lasso tends to pick one (unstable)",
      "Ridge uses a Laplace prior and lasso a Gaussian prior",
      "Ridge produces sparse solutions with exact zeros"
    ],
    answer: [0, 1, 2],
    explanation: "Lasso's $\\ell_1$ corners on the axes produce exact zeros (selection); ridge only shrinks. Ridge has the closed form $(\\mathbf{X}^\\top\\mathbf{X}+\\lambda\\mathbf{I})^{-1}\\mathbf{X}^\\top\\boldsymbol{y}$ while lasso is non-smooth at 0. On correlated features ridge shrinks together while lasso picks one. The priors are reversed in option 4 (ridge=Gaussian, lasso=Laplace), and it is <i>lasso</i>, not ridge, that gives exact zeros.",
    ref: "Ridge (L2) and Lasso (L1)"
  },
  {
    id: "lin-7", type: "qc", framing: "conceptual", difficulty: 3,
    prompt: "A regression problem has many <b>correlated</b> predictors. Compare the number of features assigned exactly-zero coefficients by each method (with comparable regularization strength).",
    quantityA: "Number of exact zeros under <b>lasso</b> (L1)",
    quantityB: "Number of exact zeros under <b>ridge</b> (L2)",
    answer: 0,
    explanation: "Ridge shrinks but never sets coefficients to exactly zero, so quantity B is $0$. Lasso's $\\ell_1$ geometry produces exact zeros and, among correlated features, tends to pick one and zero out the rest. Hence A $>$ B.",
    ref: "Ridge (L2) and Lasso (L1)"
  },
  {
    id: "lin-8", type: "numeric", framing: "applied", difficulty: 4,
    prompt: "Bayesian linear regression with a Gaussian prior recovers ridge with $\\lambda=\\sigma^2/\\tau^2$, where $\\sigma^2$ is the observation-noise variance and $\\tau^2$ the prior variance on each weight. If $\\sigma^2=4$ and $\\tau^2=16$, what is the equivalent ridge penalty $\\lambda$?",
    answer: 0.25, tolerance: 0.001, unit: "",
    hint: "$\\lambda=\\sigma^2/\\tau^2$.",
    explanation: "$\\lambda=\\sigma^2/\\tau^2 = 4/16 = 0.25$. A broader prior (larger $\\tau^2$) means weaker regularization (smaller $\\lambda$); a noisier likelihood (larger $\\sigma^2$) means stronger regularization.",
    ref: "Bayesian linear regression"
  },
  {
    id: "lin-9", type: "ms", framing: "applied", difficulty: 4,
    prompt: "Select every statement about <b>generative vs discriminative</b> classifiers that the §5 comparison supports.",
    options: [
      "Generative models (naive Bayes, GDA) can handle missing inputs by marginalizing them out",
      "Per Ng & Jordan, naive Bayes can beat logistic regression with little data, but logistic regression wins asymptotically",
      "Discriminative models tend to be more robust to model misspecification",
      "Generative models model $p(y\\mid\\boldsymbol{x})$ directly, while discriminative models model the joint $p(\\boldsymbol{x},y)$",
      "Discriminative models typically need less data than generative ones"
    ],
    answer: [0, 1, 2],
    explanation: "Generative models specify $p(\\boldsymbol{x},y)=p(\\boldsymbol{x}\\mid y)p(y)$, which lets them marginalize missing inputs and lean on priors when data is scarce (Ng & Jordan: NB beats logistic with little data). Discriminative models specify $p(y\\mid\\boldsymbol{x})$ directly, are more robust to misspecification, win asymptotically, and generally need <i>more</i> data — so options 4 (it reverses the two) and 5 are false.",
    ref: "Generative vs discriminative"
  },
  {
    id: "lin-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "Using the <b>canonical link</b>, every GLM has the same gradient form $\\sum_i(y_i-\\mu_i)\\boldsymbol{x}_i$ (\"error $\\times$ input\"). Which distribution–link pairing is the canonical one for <b>count</b> data (Poisson regression)?",
    options: [
      "Poisson with the log link, $\\mu=e^\\eta$",
      "Poisson with the logit link, $\\mu=\\sigma(\\eta)$",
      "Poisson with the identity link, $\\mu=\\eta$",
      "Poisson with the softmax link, $\\mu_k=\\mathcal{S}(\\boldsymbol\\eta)_k$"
    ],
    answer: 0,
    explanation: "For a Poisson response the canonical link is the <b>log</b>, giving mean $\\mu=e^\\eta$ — which keeps the predicted rate positive. The identity link is canonical for the Gaussian, logit for Bernoulli, and softmax for the multinomial; all share the gradient $\\sum_i(y_i-\\mu_i)\\boldsymbol{x}_i$ under the canonical link.",
    ref: "Generalized linear models (GLMs)"
  }
];
