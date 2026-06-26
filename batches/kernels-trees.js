/* Batch: Kernels, SVMs, Trees & Ensembles */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["kernels-trees"] = [
  {
    id: "ker-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Why is <b>$K$-nearest-neighbors</b> called a <i>lazy</i> (instance-based) learner?",
    options: [
      "It stores the training data and defers all computation to prediction time",
      "It fits a small fixed set of parameters and then discards the data",
      "It updates its weights with a slow gradient-descent schedule",
      "It only ever uses a single neighbor, so training is trivial"
    ],
    answer: 0,
    explanation: "Instance-based learning stores the data and predicts from neighbors at query time, doing no real work during 'training' — hence lazy. For classification it takes a majority vote of the $K$ nearest; for regression, the average of the $K$ nearest.",
    ref: "Instance-based learning & KNN"
  },
  {
    id: "ker-2", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "An SVM is trained and the learned weight vector has norm $\\|\\boldsymbol{w}\\|=4$. The margin width an SVM maximizes is $2/\\|\\boldsymbol{w}\\|$. What is the resulting margin width?",
    answer: 0.5, tolerance: 0.001, unit: "",
    hint: "Plug into $2/\\|\\boldsymbol{w}\\|$.",
    explanation: "The (hard-margin) SVM maximizes the geometric margin $2/\\|\\boldsymbol{w}\\|$, so with $\\|\\boldsymbol{w}\\|=4$ the width is $2/4=0.5$. Maximizing the margin corresponds to minimizing $\\tfrac12\\|\\boldsymbol{w}\\|^2$.",
    ref: "Support vector machines"
  },
  {
    id: "ker-3", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "A kernel $\\kappa$ is called <b>Mercer / positive-definite</b> exactly when:",
    options: [
      "Every Gram matrix $\\mathbf{K}$ it produces is positive semi-definite",
      "It can be written as a single dot product in the raw input space",
      "Its bandwidth $h$ is chosen by the Silverman rule",
      "It assigns strictly positive weight to every training point"
    ],
    answer: 0,
    explanation: "A kernel is Mercer/PD iff every Gram matrix $\\mathbf{K}$ (with $K_{ij}=\\kappa(\\boldsymbol{x}_i,\\boldsymbol{x}_j)$) is PSD. That guarantees a feature map with $\\kappa(\\boldsymbol{x},\\boldsymbol{x}')=\\boldsymbol\\phi(\\boldsymbol{x})^\\top\\boldsymbol\\phi(\\boldsymbol{x}')$, possibly infinite-dimensional — the basis for the kernel trick.",
    ref: "Mercer kernels & the kernel trick"
  },
  {
    id: "ker-4", type: "mc", framing: "applied", difficulty: 2,
    prompt: "Kernel ridge regression solves $\\boldsymbol\\alpha=(\\mathbf{K}+\\lambda\\mathbf{I})^{-1}\\boldsymbol{y}$ in the dual ($O(N^3)$) or works in the primal ($O(D^3)$). When should you prefer the <b>dual</b> formulation?",
    options: [
      "When $D>N$, or when the feature dimension is effectively infinite",
      "When $N \\gg D$ and the data is low-dimensional",
      "Whenever you want a sparse solution with few active terms",
      "Only when the kernel is linear, so $\\boldsymbol\\phi$ is the identity"
    ],
    answer: 0,
    explanation: "Primal cost is $O(D^3)$ and dual cost is $O(N^3)$, so the dual wins when $D>N$ or $D=\\infty$ (e.g. the RBF kernel). Note the kernel-ridge solution is <i>dense</i> — every $\\alpha_i$ is generally nonzero — so it is not a sparsity tool.",
    ref: "Kernel ridge regression / representer theorem"
  },
  {
    id: "ker-5", type: "mc", framing: "applied", difficulty: 3,
    prompt: "A decision-tree node holds a binary class split of <b>90% / 10%</b>. Using Gini impurity $1-\\sum_c\\hat\\pi_c^2$, what is the node's impurity?",
    options: [
      "$0.18$",
      "$0.10$",
      "$0.50$",
      "$0.82$"
    ],
    answer: 0,
    explanation: "Gini $=1-(0.9^2+0.1^2)=1-(0.81+0.01)=1-0.82=0.18$. CART chooses splits greedily to minimize Gini (or entropy) for classification, and MSE for regression. A pure node would have Gini $0$; a 50/50 split gives the maximum $0.5$.",
    ref: "Decision trees (CART)"
  },
  {
    id: "ker-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that correctly describes <b>support vector machines</b> as presented.",
    options: [
      "Prediction depends only on the support vectors, not all training points",
      "Larger $C$ yields a narrower margin with fewer violations",
      "The soft-margin objective is equivalent to a regularized hinge-loss problem",
      "Class probabilities come out natively and are well calibrated",
      "The hinge loss is exactly 0 once $\\tilde y\\eta>1$, giving sparse support vectors"
    ],
    answer: [0, 1, 2, 4],
    explanation: "By the KKT conditions a point is either ignored ($\\alpha_n=0$) or a support vector, and prediction uses only the latter. Larger $C$ penalizes slack more, narrowing the margin. The soft-margin primal equals $\\sum_n\\max(0,1-\\tilde y_n f_n)+\\lambda\\|\\boldsymbol{w}\\|^2$, and the hinge is exactly 0 for $\\tilde y\\eta>1$ (hence sparse). SVMs do <i>not</i> give native probabilities — only Platt scaling $\\sigma(af+b)$, which is poorly calibrated.",
    ref: "Support vector machines"
  },
  {
    id: "ker-7", type: "qc", framing: "conceptual", difficulty: 3,
    prompt: "Compare the predictive output of <b>kernel ridge regression</b> with the <b>posterior mean of a Gaussian process</b> regressor that uses the same kernel, with the GP's observation noise set so that $\\sigma_y^2=\\lambda$.",
    quantityA: "Kernel ridge regression's prediction",
    quantityB: "The GP posterior mean prediction",
    answer: 2,
    explanation: "The GP posterior mean $\\boldsymbol\\mu_*=\\mathbf{K}_{*X}\\mathbf{K}_\\sigma^{-1}\\boldsymbol{y}$ equals kernel ridge regression exactly when $\\lambda=\\sigma_y^2$. The GP's extra value is the <i>predictive variance</i> (epistemic uncertainty growing away from data), not a different mean — so the point predictions are equal.",
    ref: "Gaussian processes (GPs)"
  },
  {
    id: "ker-8", type: "numeric", framing: "applied", difficulty: 4,
    prompt: "In <b>AdaBoost</b>, the weight of a weak learner is $\\beta_m=\\tfrac12\\log\\frac{1-\\text{err}_m}{\\text{err}_m}$ (natural log). A stump has weighted error $\\text{err}_m=0.25$. What is $\\beta_m$?",
    answer: 0.549, tolerance: 0.01, unit: "",
    hint: "Evaluate $\\tfrac12\\ln(0.75/0.25)=\\tfrac12\\ln 3$.",
    explanation: "$\\beta_m=\\tfrac12\\ln\\frac{1-0.25}{0.25}=\\tfrac12\\ln\\frac{0.75}{0.25}=\\tfrac12\\ln 3\\approx\\tfrac12(1.0986)=0.549$. A lower error gives a larger weight; an error of $0.5$ gives $\\beta_m=0$ (a useless learner). AdaBoost minimizes exponential loss and reweights misclassified points upward.",
    ref: "Ensembles: bagging, random forests, boosting"
  },
  {
    id: "ker-9", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "Select every statement that correctly contrasts <b>bagging</b> with <b>boosting</b> as described.",
    options: [
      "Bagging mainly reduces variance; boosting mainly reduces bias",
      "Bagging trains models in parallel and independently; boosting is sequential and dependent",
      "Random forests decorrelate bagged trees with per-node $\\sim\\!\\sqrt D$ feature subsets",
      "Boosting is more robust to noisy labels and outliers than bagging",
      "Bagging's out-of-bag samples (~37%) give a free error estimate"
    ],
    answer: [0, 1, 2, 4],
    explanation: "Bagging averages independently trained bootstrap models to cut variance (bias unchanged); boosting is a sequential forward-stagewise fit that cuts bias. Random forests add $\\sim\\!\\sqrt D$ random feature subsets per node to decorrelate, and OOB (~37%) gives a free error estimate. The robustness claim is backwards: boosting (especially AdaBoost) is <i>sensitive</i> to outliers and noisy labels, while bagging is robust.",
    ref: "Ensembles: bagging, random forests, boosting"
  },
  {
    id: "ker-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "Which statement about the methods in §6 is <b>FALSE</b>?",
    options: [
      "Gradient boosting / MART fits each new tree to the <i>positive</i> gradient (the residuals themselves)",
      "As $M\\to\\infty$ the variance of a bagged ensemble tends to $\\rho\\sigma^2$, so decorrelation matters",
      "GP hyperparameters are tuned by maximizing the log marginal likelihood, a non-convex $O(N^3)$ objective",
      "Sums, products, and positive scalings of PD kernels are themselves PD"
    ],
    answer: 0,
    explanation: "Gradient boosting / MART is functional gradient descent: each tree is fit to the <i>negative</i>-gradient pseudo-residuals (for squared loss these are the residuals). The other three are stated facts: ensemble variance $\\to\\rho\\sigma^2$, so decorrelation matters; GP hyperparameters come from the (non-convex, $O(N^3)$) log marginal likelihood; and PD kernels are closed under sums, products, and positive scalings.",
    ref: "Ensembles & kernels"
  }
];
