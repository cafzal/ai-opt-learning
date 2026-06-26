/* Batch: Approximate Inference & Graphical/Sequential Models */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["inference-graphical"] = [
  {
    id: "inf-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Why do we usually resort to <b>approximate</b> inference for the posterior $p(\\boldsymbol\\theta\\mid\\mathcal{D})$ instead of computing it exactly?",
    options: [
      "The likelihood $p(\\mathcal{D}\\mid\\boldsymbol\\theta)$ is undefined for continuous parameters",
      "The normalizer $p(\\mathcal{D})=\\int p(\\mathcal{D}\\mid\\boldsymbol\\theta)p(\\boldsymbol\\theta)\\,d\\boldsymbol\\theta$ is intractable except under conjugacy",
      "The prior $p(\\boldsymbol\\theta)$ cannot be chosen in closed form",
      "Bayes' rule does not hold when the data are i.i.d."
    ],
    answer: 1,
    explanation: "Bayes' rule gives $p(\\boldsymbol\\theta\\mid\\mathcal{D})\\propto p(\\mathcal{D}\\mid\\boldsymbol\\theta)p(\\boldsymbol\\theta)$, but the marginal likelihood (evidence) $p(\\mathcal{D})=\\int p(\\mathcal{D}\\mid\\boldsymbol\\theta)p(\\boldsymbol\\theta)\\,d\\boldsymbol\\theta$ is a high-dimensional integral that is closed-form only under conjugacy. Without it the posterior is unnormalized, so we approximate (Laplace, Monte Carlo, MCMC, variational).",
    ref: "Approximate inference (intractable normalizer)"
  },
  {
    id: "inf-2", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "The <b>Laplace approximation</b> represents the posterior as which distribution, centred where?",
    options: [
      "A uniform distribution over the support of the prior",
      "A Gaussian $\\mathcal{N}(\\boldsymbol\\theta^*,\\mathbf{H}^{-1})$ centred at the MAP estimate $\\boldsymbol\\theta^*$",
      "A mixture of Gaussians, one per data point",
      "An exponential-family density matched to the posterior moments"
    ],
    answer: 1,
    explanation: "Laplace does a second-order Taylor expansion of the energy $E=-\\log p(\\mathcal{D}\\mid\\boldsymbol\\theta)-\\log p(\\boldsymbol\\theta)$ at the MAP $\\boldsymbol\\theta^*$ (where $\\nabla E=0$), giving $p(\\boldsymbol\\theta\\mid\\mathcal{D})\\approx\\mathcal{N}(\\boldsymbol\\theta^*,\\mathbf{H}^{-1})$ with $\\mathbf{H}=\\nabla^2 E$. It is cheap and unimodal, justified as posteriors Gaussian-ize with $N$ (Bernstein–von Mises), but poor for skewed or multimodal posteriors.",
    ref: "Laplace (Gaussian) approximation"
  },
  {
    id: "inf-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "The forward, backward, Viterbi, and forward–backward algorithms for an HMM all run in $O(K^2T)$ time, for $K$ hidden states and a sequence of length $T$. For $K=5$ states and $T=200$ time steps, how many operations (in units of $K^2T$) does this scale as — i.e. compute $K^2T$?",
    answer: 5000, tolerance: 0, unit: "",
    hint: "Evaluate $K^2 T = 5^2 \\times 200$.",
    explanation: "All the standard HMM inference algorithms are $O(K^2T)$ because each of the $T$ steps updates $K$ states, each summing/maximizing over $K$ predecessors. Here $K^2T = 25 \\times 200 = 5000$. The quadratic-in-$K$ term comes from the dense transition matrix $\\mathbf{A}$.",
    ref: "Markov chains & HMMs (complexity)"
  },
  {
    id: "inf-4", type: "mc", framing: "applied", difficulty: 2,
    prompt: "In <b>Metropolis–Hastings</b>, why can we sample from a posterior even when we only know it up to an unknown normalizing constant $Z$?",
    options: [
      "Because the proposal $q$ is always chosen to be symmetric, which removes $Z$",
      "Because the acceptance test uses only the <i>ratio</i> $p^*(\\boldsymbol{x}')/p^*(\\boldsymbol{x})$, in which $Z$ cancels",
      "Because Gibbs steps are substituted whenever $Z$ is unknown",
      "Because burn-in samples are discarded, which normalizes the chain"
    ],
    answer: 1,
    explanation: "The acceptance probability is $\\min\\!\\big(1,\\tfrac{p^*(\\boldsymbol{x}')q(\\boldsymbol{x}\\mid\\boldsymbol{x}')}{p^*(\\boldsymbol{x})q(\\boldsymbol{x}'\\mid\\boldsymbol{x})}\\big)$. Because $p^*$ appears only as a ratio, the intractable normalizer cancels, so an unnormalized target suffices. Symmetric proposals further cancel the $q$ terms but are not what removes $Z$. One tunes the step size to ~25–40% acceptance.",
    ref: "MCMC (Metropolis–Hastings)"
  },
  {
    id: "inf-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "From the Laplace approximation with a flat prior and $N$ i.i.d. points, the log-evidence is approximated by <b>BIC</b>: $\\log p(\\mathcal{D})\\approx\\log p(\\mathcal{D}\\mid\\hat\\theta)-\\tfrac{D}{2}\\log N$. For a model with $D=6$ parameters fit on $N=1000$ points, what is the magnitude of the complexity penalty $\\tfrac{D}{2}\\log N$? Use natural log.",
    answer: 20.72, tolerance: 0.1, unit: "",
    hint: "Compute $\\tfrac{6}{2}\\,\\ln 1000 = 3\\ln 1000$.",
    explanation: "The BIC penalty is $\\tfrac{D}{2}\\log N = \\tfrac{6}{2}\\ln 1000 = 3 \\times 6.9078 \\approx 20.72$. This term, dropped out of the Laplace approximation to the marginal likelihood, penalizes parameter count scaled by $\\log N$, automatically embodying Occam's razor for model selection.",
    ref: "Laplace approximation (recovers BIC)"
  },
  {
    id: "inf-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that correctly describes <b>MCMC</b> methods as presented.",
    options: [
      "A valid chain has the target $p^*$ as its <i>stationary</i> distribution; detailed balance plus ergodicity suffice",
      "Gibbs sampling draws each variable from its full conditional $p(x_j\\mid\\boldsymbol{x}_{-j})$ and these moves are always accepted",
      "Hamiltonian Monte Carlo uses the gradient $\\nabla\\log p$ to make distant, high-acceptance moves with low autocorrelation",
      "MCMC produces i.i.d. samples, so no burn-in or autocorrelation correction is needed",
      "$\\hat R$ should be far from 1 at convergence"
    ],
    answer: [0, 1, 2],
    explanation: "MCMC builds a Markov chain whose stationary distribution is the target; detailed balance $p^*(\\boldsymbol{x})T(\\boldsymbol{x}'\\mid\\boldsymbol{x})=p^*(\\boldsymbol{x}')T(\\boldsymbol{x}\\mid\\boldsymbol{x}')$ plus ergodicity guarantee this. Gibbs samples full conditionals (always accepted); HMC/NUTS use gradients for low-autocorrelation moves. The samples are <i>correlated</i>, so we discard burn-in and report effective sample size; $\\hat R\\approx 1$ (not far from 1) signals convergence.",
    ref: "MCMC (stationarity, Gibbs, HMC, diagnostics)"
  },
  {
    id: "inf-7", type: "mc", framing: "applied", difficulty: 3,
    prompt: "In a Bayes net with a <b>collider</b> $A\\!\\to\\!B\\!\\leftarrow\\!C$, what conditional-independence relationship holds between $A$ and $C$?",
    options: [
      "$A\\perp C$ marginally, but conditioning on $B$ couples them ('explaining away')",
      "$A\\perp C\\mid B$, the same as for a chain or fork",
      "$A$ and $C$ are dependent both marginally and given $B$",
      "$A\\perp C$ both marginally and conditioned on $B$"
    ],
    answer: 0,
    explanation: "By d-separation, a collider behaves oppositely to chains and forks: $A\\to B\\to C$ and $A\\leftarrow B\\to C$ give $A\\perp C\\mid B$, but a collider $A\\to B\\leftarrow C$ gives $A\\perp C$ (marginal independence) while $A\\not\\perp C\\mid B$ — conditioning on the common effect $B$ couples its causes, the 'explaining away' effect.",
    ref: "Graphical models (d-separation, colliders)"
  },
  {
    id: "inf-8", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "Select every statement that correctly characterizes <b>variational inference (VI)</b> and how it compares to MCMC.",
    options: [
      "VI maximizes the ELBO, which equals minimizing the reverse KL $D_{\\text{KL}}(q\\,\\|\\,p^*)$",
      "The ELBO is a <i>lower bound</i> on the log marginal likelihood $\\log p(\\mathcal{D})$",
      "Reverse-KL optimization is mode-seeking and tends to underestimate posterior variance",
      "VI is asymptotically exact, whereas MCMC is biased by the choice of $q$ family",
      "Mean-field VI assumes a factorized $q=\\prod_j q_j$ and is optimized by CAVI updates"
    ],
    answer: [0, 1, 2, 4],
    explanation: "VI casts inference as optimization: maximize the ELBO $\\mathcal{L}(q)=\\log p(\\mathcal{D})-D_{\\text{KL}}(q\\,\\|\\,p^*)\\le\\log p(\\mathcal{D})$, equivalently minimizing reverse KL. Mean-field uses a factorized $q$ optimized by CAVI, which monotonically raises the ELBO. Reverse-KL is mode-seeking and underestimates variance. The accuracy claim is backwards: <i>MCMC</i> is asymptotically exact while <i>VI</i> is biased by the $q$ family.",
    ref: "Variational inference (ELBO, reverse KL, mean-field)"
  },
  {
    id: "inf-9", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "In a Kalman-filter <b>update</b> step, the new state estimate is $\\boldsymbol\\mu_t=\\boldsymbol\\mu_{t\\mid t-1}+\\mathbf{K}_t\\boldsymbol{r}_t$, with gain $\\mathbf{K}_t$ acting as the prior-to-total uncertainty ratio. Compare the influence of the two terms on the updated mean.",
    quantityA: "The weight effectively placed on the prediction $\\boldsymbol\\mu_{t\\mid t-1}$ when the measurement noise $\\mathbf{R}$ is very large (sensor nearly useless)",
    quantityB: "The weight effectively placed on the innovation/measurement term $\\mathbf{K}_t\\boldsymbol{r}_t$ in that same regime",
    answer: 0,
    explanation: "The new mean is prediction + gain × innovation, and the gain $\\mathbf{K}_t=\\boldsymbol\\Sigma_{t\\mid t-1}\\mathbf{C}^\\top\\mathbf{S}_t^{-1}$ is the prior-to-total uncertainty ratio. When measurement noise $\\mathbf{R}$ is huge, the total innovation covariance $\\mathbf{S}_t$ is dominated by $\\mathbf{R}$, so $\\mathbf{K}_t\\to 0$: the filter trusts its prediction and nearly ignores the measurement. Hence the prediction term dominates — quantity A is greater.",
    ref: "State-space models & the Kalman filter"
  },
  {
    id: "inf-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "A chain <b>CRF</b> is globally normalized — its partition function $Z(\\boldsymbol{x},\\boldsymbol{w})$ depends on the whole input $\\boldsymbol{x}$. What key advantage does this global normalization confer over locally-normalized models like MEMMs?",
    options: [
      "It makes the CRF a generative model of $p(\\boldsymbol{x},\\boldsymbol{y})$ rather than discriminative",
      "It avoids the <b>label-bias problem</b>, so future evidence can revise earlier label decisions",
      "It removes the need to compute $Z$ at all during training",
      "It restricts the features to be local and generative rather than overlapping"
    ],
    answer: 1,
    explanation: "A CRF is the <i>discriminative</i> undirected model $p(\\boldsymbol{y}\\mid\\boldsymbol{x},\\boldsymbol{w})$ whose normalizer spans the whole output sequence. This global normalization avoids the label-bias problem of locally-normalized MEMMs (where per-step normalization can lock in early labels); with global $Z$, later evidence can revise earlier label choices. CRFs also admit arbitrary, overlapping, global features — the opposite of option 4.",
    ref: "Conditional random fields (CRFs)"
  }
];
