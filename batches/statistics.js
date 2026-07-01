/* Batch: Statistics, Estimation & Decision Theory */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["statistics"] = [
  {
    id: "stat-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What is the maximum likelihood estimate (MLE) of the Bernoulli parameter $\\theta$ from $N$ trials with $N_1$ successes?",
    options: [
      "$\\hat\\theta=N_1/N$",
      "$\\hat\\theta=(N_1+1)/(N+2)$",
      "$\\hat\\theta=N/N_1$",
      "$\\hat\\theta=N_1/(N-1)$"
    ],
    answer: 0,
    explanation: "The closed-form Bernoulli MLE is simply the empirical success frequency $\\hat\\theta=N_1/N$. $(N_1+1)/(N+2)$ is the Bayesian posterior mean under a Beta(1,1) prior (Laplace's rule of succession), not the MLE; the other two are not valid estimators.",
    ref: "Maximum likelihood estimation (closed forms)"
  },
  {
    id: "stat-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In <b>frequentist</b> statistics, which is treated as random?",
    options: [
      "The data (the parameter is fixed but unknown)",
      "The parameter (the data is fixed)",
      "Both the parameter and the data",
      "Neither — both are fixed constants"
    ],
    answer: 0,
    explanation: "Frequentism holds the parameter <i>fixed</i> and treats the <i>data</i> as random; the sampling distribution of $\\hat\\theta$ comes from repeatedly resampling datasets. The Bayesian view is the reverse: it conditions on the observed data and treats the parameter as random (giving it a prior).",
    ref: "Frequentist statistics"
  },
  {
    id: "stat-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "A binary classifier produces a confusion matrix with $TP=30$, $FP=10$, $FN=10$, $TN=50$. Compute its $F_1$ score.",
    answer: 0.75, tolerance: 0.01, unit: "",
    hint: "$F_1=\\frac{2PR}{P+R}$ with $P=TP/(TP+FP)$ and $R=TP/(TP+FN)$.",
    explanation: "Precision $P=30/(30+10)=0.75$ and recall $R=30/(30+10)=0.75$, so $F_1=\\frac{2(0.75)(0.75)}{0.75+0.75}=0.75$. Equivalently $F_1=\\frac{TP}{TP+\\frac12(FP+FN)}=\\frac{30}{30+10}=0.75$.",
    ref: "Classification metrics"
  },
  {
    id: "stat-11", type: "mc", framing: "applied", difficulty: 2,
    prompt: "A model outputs \"90% confident\" on 100 cases and exactly 70 of them turn out correct. According to the notes on <b>calibration</b>, what does this most directly indicate?",
    options: [
      "The model is over-confident (poorly calibrated): its stated probabilities exceed its true accuracy on those cases",
      "The model has only 70% accuracy overall and must be retrained from scratch",
      "The model is under-confident and its probabilities should be raised",
      "Nothing — accuracy and calibration are the same thing, so 70% confidence equals 70% accuracy"
    ],
    answer: 0,
    explanation: "Calibration asks whether, among predictions made at confidence $p$, about a fraction $p$ are correct. Here confidence is 90% but observed accuracy is 70%, a 20-point gap <i>below</i> the diagonal — classic <b>over-confidence</b>. It is a statement about the probabilities, not overall accuracy (70% may even be fine), and it is fixed cheaply post-hoc by temperature/Platt scaling, not retraining. Calibration is distinct from accuracy, so option 4 is wrong.",
    ref: "Calibration"
  },
  {
    id: "stat-4", type: "mc", framing: "applied", difficulty: 3,
    prompt: "Why is the 0–1 loss replaced by convex <b>surrogate losses</b> such as the log loss or hinge loss when training classifiers?",
    options: [
      "The 0–1 loss is non-smooth and optimizing it directly is NP-hard",
      "The 0–1 loss is unbounded and diverges during training",
      "Surrogate losses always share the exact same minimizer as the 0–1 loss",
      "The 0–1 loss requires a Bayesian prior, which surrogates remove"
    ],
    answer: 0,
    explanation: "The 0–1 loss is non-smooth and NP-hard to minimize, so we substitute convex surrogates — log loss $\\log(1+e^{-\\tilde y\\eta})$ (logistic) or hinge loss $\\max(0,1-\\tilde y\\eta)$ (SVM) — that are tractable. The 0–1 loss is bounded (not unbounded), surrogates do not generally share its exact minimizer, and neither requires a prior.",
    ref: "ERM & surrogate losses"
  },
  {
    id: "stat-5", type: "mc", framing: "applied", difficulty: 3,
    prompt: "L2 / ridge regularization, $\\arg\\min\\,\\text{NLL}+\\lambda\\|\\boldsymbol{w}\\|^2$, corresponds to MAP estimation under which prior on the weights?",
    options: [
      "A zero-mean Gaussian prior",
      "A uniform (flat) prior",
      "A Laplace prior",
      "A Jeffreys prior"
    ],
    answer: 0,
    explanation: "Adding a penalty $C(\\boldsymbol\\theta)=-\\log p(\\boldsymbol\\theta)$ turns NLL minimization into MAP; for L2/ridge that penalty is $\\lambda\\|\\boldsymbol{w}\\|^2$, which is exactly the negative log of a zero-mean Gaussian prior (biasing weights toward 0, lowering variance). A uniform prior recovers plain MLE; Jeffreys is the reparameterization-invariant prior, not the ridge penalty.",
    ref: "Regularization & MAP"
  },
  {
    id: "stat-6", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "In a cost-sensitive binary decision, a false negative costs $c=4$ times as much as a false positive. According to the decision rule in the notes, what is the smallest predicted positive-class probability $p_1$ at which you should predict <b>positive</b>?",
    answer: 0.2, tolerance: 0.005, unit: "",
    hint: "Predict positive iff $p_1\\ge 1/(1+c)$.",
    explanation: "The cost-sensitive rule is: predict positive iff $p_1\\ge 1/(1+c)=1/(1+4)=1/5=0.2$. Because missing a positive is 4× as costly as a false alarm, the threshold drops well below 0.5, making the classifier more willing to predict positive.",
    ref: "Classification metrics (cost-sensitive)"
  },
  {
    id: "stat-12", type: "mc", framing: "applied", difficulty: 3,
    prompt: "A growth team wants to claim \"the new onboarding flow <b>causes</b> higher retention.\" Which comparison licenses that causal claim, and why?",
    options: [
      "A randomized A/B test: assigning the flow by coin flip makes treatment independent of every user attribute — observed or not — so no confounder can produce the gap, and the arm difference estimates the effect of intervening, $p(y\\mid \\mathrm{do}(x))$",
      "Comparing users who chose the new flow with those who didn't, provided the retention difference is statistically significant",
      "The A/B test, because randomization guarantees the two arms are exactly identical on every attribute, so any observed difference must be causal",
      "Either comparison works, provided the sample size is fixed in advance and nobody peeks at the results early"
    ],
    answer: 0,
    explanation: "Randomization severs the link between who a user is and which flow they receive, cutting off self-selection and every other confounder — observed or unobserved — by design: the experiment estimates the $\\mathrm{do}$-distribution directly, which is what a causal claim needs. It balances the arms in <i>expectation</i>, not exactly, so sampling noise remains — that is what the significance machinery handles, and peeking / optional stopping breaks that machinery without touching confounding at all. An observational comparison of self-selected adopters can be arbitrarily significant and still reflect who chose the flow rather than what the flow did.",
    ref: "Randomized experiments (A/B tests)"
  },
  {
    id: "stat-7", type: "mc", framing: "applied", difficulty: 4,
    prompt: "Under a Gaussian likelihood (known $\\sigma^2$) with a Gaussian prior, the posterior mean is a <b>precision-weighted average</b> of the prior mean and the data mean, with posterior precision $V_N^{-1}=V_0^{-1}+N\\sigma^{-2}$. As the number of observations $N$ grows, the posterior mean:",
    options: [
      "Is increasingly dominated by the data mean (the prior's influence vanishes)",
      "Is increasingly dominated by the prior mean (the data's influence vanishes)",
      "Stays fixed at the prior mean regardless of $N$",
      "Oscillates between the prior mean and the data mean"
    ],
    answer: 0,
    explanation: "Because $V_N^{-1}=V_0^{-1}+N\\sigma^{-2}$, the data's contribution to the precision grows with $N$: the prior dominates for small $N$ and the data dominates for large $N$. The prior's pull therefore vanishes asymptotically rather than persisting or oscillating.",
    ref: "Conjugate priors (precision-weighted mean)"
  },
  {
    id: "stat-8", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "Two Bayes estimators are derived for the same posterior under different loss functions.",
    quantityA: "The Bayes estimator under squared $\\ell_2$ loss",
    quantityB: "The Bayes estimator under absolute $\\ell_1$ loss",
    answer: 3,
    explanation: "Squared loss yields the posterior <i>mean</i>; absolute loss yields the posterior <i>median</i>. For a symmetric posterior the mean and median coincide (equal), but for a skewed posterior they differ and either can be larger. Without knowing the posterior's shape, the comparison cannot be determined.",
    ref: "Bayesian decision theory (loss → estimator)"
  },
  {
    id: "stat-9", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "Select every statement that the notes present as <b>true</b> about a frequentist <i>confidence interval</i>.",
    options: [
      "It is a procedure that covers the true $\\theta^*$ in $1-\\alpha$ of repeated samples",
      "It equals $P(\\theta\\in I\\mid\\mathcal{D})$, the probability the parameter lies in the interval given the data",
      "A valid 95% CI can demonstrably exclude the true value on a given dataset",
      "The 'probability the parameter is in here' interpretation actually belongs to the Bayesian credible interval",
      "For the observed data, $\\theta$ is simply in or out of the interval"
    ],
    answer: [0, 2, 3, 4],
    explanation: "A confidence interval is a <i>coverage</i> procedure: across repeated samples it contains $\\theta^*$ a fraction $1-\\alpha$ of the time, and for any single observed dataset $\\theta$ is simply in or out — a valid 95% CI can even exclude the truth. The intuitive 'the parameter is in here with 95% probability' statement, $P(\\theta\\in I\\mid\\mathcal{D})$, is the <i>credible</i> interval, not the CI, so option 2 is false.",
    ref: "Frequentist statistics (confidence interval)"
  },
  {
    id: "stat-10", type: "ms", framing: "conceptual", difficulty: 5,
    prompt: "A colleague reports a p-value of $\\approx0.05$ and concludes the null hypothesis $H_0$ has been confirmed with about 95% certainty. Per the notes' 'p-values considered harmful' discussion, select every statement that is <b>true</b>.",
    options: [
      "A p-value is not $P(H_0\\mid\\mathcal{D})$; $p\\approx0.05$ can correspond to $P(H_0)\\ge30\\%$",
      "A p-value depends on the stopping rule and the experimental design",
      "A p-value can only reject $H_0$, never confirm it",
      "A p-value is immune to multiple-comparison inflation",
      "A Bayesian alternative computes $p(\\Delta>\\epsilon\\mid\\mathcal{D})$ over a region of practical equivalence (ROPE)"
    ],
    answer: [0, 1, 2, 4],
    explanation: "The notes stress that a p-value is <i>not</i> $P(H_0\\mid\\mathcal{D})$ (p≈0.05 can leave $P(H_0)\\ge30\\%$), that it depends on the stopping rule and design, suffers multiple-comparison inflation, and can only reject — never confirm — $H_0$ (so the colleague's 'confirmed' conclusion is invalid). Hence option 4, claiming immunity to multiple-comparison inflation, is false. The recommended Bayesian alternative is $p(\\Delta>\\epsilon\\mid\\mathcal{D})$ over a ROPE.",
    ref: "P-values considered harmful"
  }
];
