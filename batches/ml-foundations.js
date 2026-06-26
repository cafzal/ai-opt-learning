/* Batch: ML Foundations & Generalization */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["ml-foundations"] = [
  {
    id: "mlf-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Which best describes the learning signal that distinguishes <b>reinforcement learning</b> from supervised learning?",
    options: [
      "A full set of labeled input–output pairs $(\\boldsymbol{x}, y)$",
      "An occasional, often delayed scalar reward",
      "A density $p(\\boldsymbol{x})$ estimated from unlabeled inputs",
      "A reconstruction error from compressing the input"
    ],
    answer: 1,
    explanation: "In RL an agent follows a policy $\\boldsymbol{a}=\\pi(\\boldsymbol{x})$ and receives only occasional, possibly delayed reward, which makes credit assignment hard. Labeled pairs are supervised learning; density estimation and reconstruction are unsupervised. In LeCun's cake analogy, RL is the 'cherry' — a few bits, occasionally.",
    ref: "The three types of machine learning"
  },
  {
    id: "mlf-2", type: "ms", framing: "conceptual", difficulty: 2,
    prompt: "Select every statement that is true of <b>non-parametric</b> models (as contrasted with parametric ones).",
    options: [
      "The effective number of parameters grows with the dataset size $N$",
      "They impose a strong inductive bias that fights the curse of dimensionality",
      "Test-time prediction can be slow for large $N$",
      "$K$-nearest-neighbors is a canonical example",
      "They have a fixed parameter count independent of $N$"
    ],
    answer: [0, 2, 3],
    explanation: "Non-parametric models (KNN, kernel density estimation) effectively <i>are</i> the training set: their complexity grows with $N$, so prediction can be slow for large $N$. A strong inductive bias and a fixed parameter count are properties of <i>parametric</i> models, which bake in assumptions to combat the curse of dimensionality.",
    ref: "Parametric vs non-parametric models"
  },
  {
    id: "mlf-11", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "Estimating generalization — performance on unseen data — from a held-out test set relies on one core assumption. Which one, and what breaks it?",
    options: [
      "Train and test are drawn i.i.d. from the <i>same</i> distribution; it is broken by distribution shift",
      "The model is parametric; it is broken by adding more parameters",
      "The loss is convex; it is broken by non-convex losses",
      "The classes are balanced; it is broken by class imbalance"
    ],
    answer: 0,
    explanation: "The <b>i.i.d. assumption</b> — training and test data drawn independently from the same distribution $p^*$ — is the premise that makes generalization possible: it is the bridge that lets a number measured on one finite sample predict performance on another. When the test distribution differs (<b>distribution shift</b>), the held-out estimate no longer reflects deployment performance. Convexity, parameter count, and class balance are unrelated to this guarantee.",
    ref: "The i.i.d. assumption and generalization"
  },
  {
    id: "mlf-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "Curse of dimensionality: to capture a fraction $f$ of the data inside an axis-aligned hypercube of edge length $e$ in $D$ dimensions, $e_D(f)=f^{1/D}$. For $D=10$ and $f=0.10$ (each axis spans $[0,1]$), what edge length is required?",
    answer: 0.794, tolerance: 0.01, unit: "",
    hint: "Compute $0.1^{1/10}$.",
    explanation: "$e_{10}(0.1)=0.1^{1/10}=10^{-0.1}\\approx 0.794$ — capturing just 10% of the data needs ~79% of the range on <i>every</i> axis, so a 'neighborhood' is no longer local. This is why high-dimensional methods lean on parametric models with strong inductive biases.",
    ref: "The curse of dimensionality"
  },
  {
    id: "mlf-4", type: "mc", framing: "applied", difficulty: 3,
    prompt: "For regression with Gaussian residual noise, minimizing the negative log-likelihood is equivalent to:",
    options: [
      "Minimizing the mean squared error (ordinary least squares)",
      "Minimizing the 0–1 loss",
      "Maximizing the entropy of the residuals",
      "Minimizing the hinge loss"
    ],
    answer: 0,
    explanation: "With Gaussian noise, $\\text{NLL}=\\frac{1}{2\\sigma^2}\\,\\text{MSE}+\\text{const}$, so MLE is exactly least squares. More generally, MLE is empirical-risk minimization using the NLL loss.",
    ref: "Maximum likelihood"
  },
  {
    id: "mlf-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "A language model assigns a uniform predictive distribution over a vocabulary of 4 equally-likely next tokens, giving entropy $\\mathbb{H}=2$ bits. What is its <b>perplexity</b>?",
    answer: 4, tolerance: 0, unit: "",
    explanation: "Perplexity $=2^{\\mathbb{H}}=2^{2}=4$, the 'effective number of outcomes.' A uniform distribution over $k$ outcomes has entropy $\\log_2 k$ and perplexity exactly $k$.",
    ref: "Information-theoretic quantities"
  },
  {
    id: "mlf-6", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "In $K$-nearest-neighbors classification, what happens as $K$ increases from 1?",
    options: [
      "The decision boundary smooths — bias rises, variance falls",
      "The boundary becomes more jagged — variance rises",
      "Training time grows as $O(K^2)$",
      "The model becomes parametric"
    ],
    answer: 0,
    explanation: "$K=1$ gives a Voronoi tessellation: a jagged, high-variance boundary that overfits. Larger $K$ averages over more neighbors, smoothing the boundary — more bias, less variance. KNN stays non-parametric for any $K$.",
    ref: "K-nearest neighbors"
  },
  {
    id: "mlf-12", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "The <b>no-free-lunch theorem</b> says that averaged over all possible problems, no learner outperforms any other. What is the practical consequence?",
    options: [
      "Generalization requires <b>inductive bias</b> — assumptions, often baked into the architecture/representation — matched to the problem",
      "All models achieve identical accuracy on any given real dataset",
      "More training compute always substitutes for a better model class",
      "A sufficiently large model needs no assumptions about the data"
    ],
    answer: 0,
    explanation: "No-free-lunch means assumptions are <i>necessary</i>: to generalize beyond the data a learner must encode an <b>inductive bias</b>, and the architecture/representation IS that bias (a CNN assumes locality and translation-invariance, etc.). The bias is what lets a model do well on structured real data even though it must do poorly on others. This is distinct from <b>sample complexity</b> — how many samples are needed to reach a target error (the PAC/VC question) — which is a separate axis from raw compute or model size.",
    ref: "Inductive bias and no free lunch"
  },
  {
    id: "mlf-7", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "Minimizing the cross-entropy $\\mathbb{H}_{ce}(p,q)$ between the empirical data distribution $p$ and the model $q$ is equivalent to minimizing which quantity, and why?",
    options: [
      "The forward KL $D_{\\text{KL}}(p\\,\\|\\,q)$, because $\\mathbb{H}_{ce}(p,q)=D_{\\text{KL}}(p\\,\\|\\,q)+\\mathbb{H}(p)$ and $\\mathbb{H}(p)$ is fixed",
      "The reverse KL $D_{\\text{KL}}(q\\,\\|\\,p)$, the mode-seeking divergence",
      "The mutual information $\\mathbb{I}(p;q)$",
      "The entropy $\\mathbb{H}(q)$ of the model alone"
    ],
    answer: 0,
    explanation: "$D_{\\text{KL}}(p\\,\\|\\,q)=\\mathbb{H}_{ce}(p,q)-\\mathbb{H}(p)$. Because the data entropy $\\mathbb{H}(p)$ is independent of the parameters, minimizing cross-entropy = minimizing forward KL = MLE. Forward KL is mode-<i>covering</i>; reverse KL (used in variational inference and VAEs) is mode-<i>seeking</i>.",
    ref: "Information-theoretic quantities"
  },
  {
    id: "mlf-8", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "Two estimators of the same scalar parameter $\\theta^*$ are compared by mean squared error.",
    quantityA: "MSE of the unbiased MLE",
    quantityB: "MSE of a biased ridge/MAP estimator that shrinks toward 0",
    answer: 3,
    explanation: "MSE $=$ bias$^2$ + variance. A biased estimator can have <i>lower</i> MSE when it cuts variance by more than it adds bias² — the entire rationale for ridge/MAP shrinkage — but it need not. Without knowing the variances, the comparison cannot be resolved.",
    ref: "Bias–variance identity"
  },
  {
    id: "mlf-9", type: "ms", framing: "applied", difficulty: 4,
    prompt: "You are choosing among many model families. Select every statement that reflects <b>correct</b> train/validation/test methodology.",
    options: [
      "Hyperparameters and the model family should be chosen on the validation set, not the test set",
      "Cross-validation averages validation error over $K$ rotated folds, useful when data is scarce",
      "Evaluating many models on the test set and keeping the best gives an honest generalization estimate",
      "The test set should be touched only once, as a final generalization estimate",
      "Preprocessing (e.g., scaling) may be fit on the full dataset including test, for stability"
    ],
    answer: [0, 1, 3],
    explanation: "The test set is a one-shot, final estimate; using it to pick among models implicitly fits to it and inflates the estimate. Validation / cross-validation is the proper selection tool, and preprocessing must be fit on training data only (fitting on test data is leakage).",
    ref: "Model selection: train / validation / test"
  },
  {
    id: "mlf-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "Which statement about the exponential family $p(\\boldsymbol{x}\\mid\\boldsymbol\\theta)=h(\\boldsymbol{x})\\exp[\\boldsymbol\\theta^\\top\\boldsymbol\\phi(\\boldsymbol{x})-A(\\boldsymbol\\theta)]$ is <b>FALSE</b>?",
    options: [
      "It is the minimum-entropy distribution consistent with its moment constraints",
      "The log-partition $A(\\boldsymbol\\theta)$ is convex, with $\\nabla A=\\mathbb{E}[\\boldsymbol\\phi]$",
      "Maximum likelihood reduces to moment matching",
      "Conjugate priors exist if and only if the likelihood is in the exponential family"
    ],
    answer: 0,
    explanation: "The exponential family is the <i>maximum</i>-entropy distribution under its moment constraints, not the minimum. The other three are core facts: $A$ is convex with gradient $\\mathbb{E}[\\boldsymbol\\phi]$, MLE equals moment matching, and conjugacy holds iff the likelihood is exponential-family.",
    ref: "Exponential family (canonical form)"
  }
];
