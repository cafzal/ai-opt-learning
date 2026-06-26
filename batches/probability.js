/* Batch: Probability  (ML-Fundamentals.md §2) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["probability"] = [
  {
    id: "prob-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Which type of uncertainty is the <b>irreducible</b> randomness in a process — for example the outcome of a fair coin — and therefore lives in the likelihood?",
    options: [
      "Aleatoric uncertainty",
      "Epistemic uncertainty",
      "Frequentist uncertainty",
      "Posterior uncertainty"
    ],
    answer: 0,
    explanation: "Aleatoric uncertainty is the irreducible randomness in the process (a fair coin) and sits in the likelihood. Epistemic uncertainty is reducible — it comes from lack of data/knowledge and is tracked by the posterior.",
    ref: "§2 — Interpretations & types of uncertainty"
  },
  {
    id: "prob-2", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "In Bayes' rule, the denominator $\\sum_{x'}p(X{=}x')\\,p(Y{=}y\\mid X{=}x')$ is given which name?",
    options: [
      "The prior",
      "The likelihood",
      "The marginal likelihood",
      "The posterior"
    ],
    answer: 2,
    explanation: "The denominator $p(Y{=}y)$ is the marginal likelihood (a normalizing constant). The prior is $p(X{=}x)$, the likelihood is $p(Y{=}y\\mid X{=}x)$, and the posterior is the whole quotient $p(X{=}x\\mid Y{=}y)$.",
    ref: "§2 — Bayes' rule"
  },
  {
    id: "prob-3", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every distribution whose support is <b>continuous</b> (as opposed to discrete) per the source.",
    options: [
      "Gaussian",
      "Poisson",
      "Beta",
      "Bernoulli",
      "Gamma",
      "Pareto"
    ],
    answer: [0, 2, 4, 5],
    explanation: "Gaussian ($\\mathbb{R}$), Beta ($[0,1]$), Gamma ($(0,\\infty)$), and Pareto (power-law) are continuous distributions. Poisson (event counts $\\{0,1,\\dots\\}$) and Bernoulli ($\\{0,1\\}$) are discrete.",
    ref: "§2 — Common continuous vs discrete distributions"
  },
  {
    id: "prob-4", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Base-rate fallacy. A mammogram has sensitivity $p(+\\mid\\text{cancer})=0.8$, false-positive rate $p(+\\mid\\text{no})=0.1$, and the disease prevalence is $p(\\text{cancer})=0.004$. Using Bayes' rule, what is the posterior probability of cancer given a positive test, $p(\\text{cancer}\\mid +)$?",
    answer: 0.031, tolerance: 0.003, unit: "",
    hint: "Compute $\\frac{0.8\\cdot0.004}{0.8\\cdot0.004+0.1\\cdot0.996}$.",
    explanation: "$p(\\text{cancer}\\mid +)=\\frac{0.8\\cdot0.004}{0.8\\cdot0.004+0.1\\cdot0.996}=\\frac{0.0032}{0.1028}\\approx 0.031$. Even an 80%-sensitive test yields only ~3% posterior because the disease is rare — a high-accuracy classifier on a rare class produces mostly false positives.",
    ref: "§2 — Bayes' rule (base-rate fallacy)"
  },
  {
    id: "prob-5", type: "mc", framing: "applied", difficulty: 3,
    prompt: "For a $\\text{Poisson}(\\lambda)$ random variable modeling rare-event counts, how do its mean and variance compare?",
    options: [
      "Mean $=\\lambda$ and variance $=\\lambda$ (they are equal)",
      "Mean $=\\lambda$ and variance $=\\lambda(1-\\lambda)$",
      "Mean $=\\lambda^2$ and variance $=\\lambda$",
      "Mean $=N\\lambda$ and variance $=N\\lambda(1-\\lambda)$"
    ],
    answer: 0,
    explanation: "For the Poisson, mean $=$ var $=\\lambda$. The form $\\theta(1-\\theta)$ is the Bernoulli variance, and $N\\theta(1-\\theta)$ is the Binomial variance.",
    ref: "§2 — Common discrete distributions"
  },
  {
    id: "prob-6", type: "qc", framing: "applied", difficulty: 3,
    prompt: "A scalar is modeled as $X\\sim\\mathcal{N}(\\mu,\\sigma^2)$. Compare the two quantities below, using the <b>exact</b> $z=1.96$ factor for 95% (not the $\\pm2\\sigma$ rounding).",
    quantityA: "The width of the central 95% interval of $X$",
    quantityB: "$4\\sigma$",
    answer: 1,
    explanation: "The central 95% region for a Gaussian is $\\mu\\pm1.96\\sigma\\approx\\mu\\pm2\\sigma$, so its width is $\\approx 3.92\\sigma$ (about $4\\sigma$ only under the rounded rule of thumb). Using the stated $1.96$ factor, the exact width $3.92\\sigma$ is less than $4\\sigma$, so B is greater.",
    ref: "§2 — Random variables (quantiles)"
  },
  {
    id: "prob-7", type: "numeric", framing: "applied", difficulty: 4,
    prompt: "Let $X\\sim\\text{Binomial}(N{=}10,\\theta{=}0.3)$ count the number of successes in 10 trials. Using the source's formula for the variance of a Binomial, what is $\\mathbb{V}[X]$?",
    answer: 2.1, tolerance: 0.05, unit: "",
    hint: "Binomial variance is $N\\theta(1-\\theta)$.",
    explanation: "$\\mathbb{V}[X]=N\\theta(1-\\theta)=10\\cdot0.3\\cdot0.7=2.1$. The mean would be $N\\theta=3$; do not confuse the Bernoulli variance $\\theta(1-\\theta)=0.21$ (a single trial) with the Binomial.",
    ref: "§2 — Common discrete distributions"
  },
  {
    id: "prob-8", type: "ms", framing: "applied", difficulty: 4,
    prompt: "Partition a multivariate Gaussian vector as $\\boldsymbol{y}=(\\boldsymbol{y}_1,\\boldsymbol{y}_2)$. Select every statement that is <b>true</b> of its marginals and conditionals.",
    options: [
      "The marginal $p(\\boldsymbol{y}_1)$ is Gaussian with covariance $\\boldsymbol\\Sigma_{11}$",
      "The conditional mean $\\boldsymbol\\mu_{1|2}$ is linear in $\\boldsymbol{y}_2$",
      "The conditional covariance $\\boldsymbol\\Sigma_{1|2}$ depends on the observed value $\\boldsymbol{y}_2$",
      "The conditional covariance is the Schur complement $\\boldsymbol\\Sigma_{11}-\\boldsymbol\\Sigma_{12}\\boldsymbol\\Sigma_{22}^{-1}\\boldsymbol\\Sigma_{21}$",
      "Both the marginal and the conditional are again Gaussian"
    ],
    answer: [0, 1, 3, 4],
    explanation: "For an MVN, $p(\\boldsymbol{y}_1)=\\mathcal{N}(\\boldsymbol\\mu_1,\\boldsymbol\\Sigma_{11})$, the conditional mean is linear in $\\boldsymbol{y}_2$, and the conditional covariance is the constant Schur complement $\\boldsymbol\\Sigma_{11}-\\boldsymbol\\Sigma_{12}\\boldsymbol\\Sigma_{22}^{-1}\\boldsymbol\\Sigma_{21}$ — which does <i>not</i> depend on the observed $\\boldsymbol{y}_2$, so option 3 is false.",
    ref: "§2 — The multivariate Gaussian (marginals and conditionals)"
  },
  {
    id: "prob-9", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "With $X\\sim U(-1,1)$ and $Y=X^2$, the source notes $\\text{corr}[X,Y]=0$ even though $X$ and $Y$ are clearly dependent. Which statement does this illustrate?",
    options: [
      "Correlation captures only linear dependence, so uncorrelated does not imply independent",
      "Independence implies zero correlation, but never the reverse",
      "Covariance and correlation always have opposite signs",
      "Zero correlation guarantees the variables are independent"
    ],
    answer: 0,
    explanation: "Correlation measures only <i>linear</i> dependence, so variables can be uncorrelated yet dependent ($Y=X^2$): uncorrelated $\\ne$ independent. Mutual information (§4) captures any dependence. Option 4 states the exact fallacy being refuted.",
    ref: "§2 — Moments (uncorrelated vs independent)"
  },
  {
    id: "prob-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "Which statement about Monte Carlo estimation $\\mathbb{E}[f(X)]\\approx\\frac1S\\sum_s f(x_s)$ and the CLT, as presented in the source, is <b>FALSE</b>?",
    options: [
      "The standard error of the Monte Carlo estimate scales as $1/\\sqrt{S}$",
      "The Monte Carlo standard error grows with the dimension of $X$",
      "The CLT states $\\frac{\\bar X-\\mu}{\\sigma/\\sqrt N}\\xrightarrow{d}\\mathcal{N}(0,1)$",
      "Monte Carlo underlies SGD minibatches, dropout, MCMC, and VI"
    ],
    answer: 1,
    explanation: "The Monte Carlo standard error scales as $1/\\sqrt{S}$ <i>independent of dimension</i>, so the claim that it grows with dimension is false. The other three are stated directly: the $1/\\sqrt{S}$ rate, the CLT limit, and Monte Carlo as the basis of SGD minibatches, dropout, MCMC, and VI.",
    ref: "§2 — Transformations, CLT, Monte Carlo"
  }
];
