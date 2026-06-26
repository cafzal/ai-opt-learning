/* ============================================================
   Registry: tracks + batch metadata.
   The actual question arrays live in batches/<id>.js, which each do:
       (window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["<id>"] = [ ... ];
   Those files load BEFORE this one (see index.html), so we stitch
   their arrays into the metadata here.
   ============================================================ */
(function () {
  const B = window.QUIZ_BATCHES || {};
  const R = window.QUIZ_REVIEWS || {};

  const META = {
    /* ---- ML Fundamentals track ---- */
    "ml-foundations": {
      title: "ML Foundations & Generalization",
      blurb: "Types of ML, parametric vs non-parametric, generalization, bias–variance, and the shared toolkit. (§0–§1)"
    },
    "probability": {
      title: "Probability & Distributions",
      blurb: "Bayes' rule & base rates, independence, moments, key distributions, the multivariate Gaussian, CLT & Monte Carlo. (§2)"
    },
    "statistics": {
      title: "Estimation, Bayes & Decision Theory",
      blurb: "MLE/MAP, conjugate priors, Bayesian vs frequentist, decision theory, and classification metrics. (§3)"
    },
    "linalg-opt": {
      title: "Linear Algebra & Optimization Core",
      blurb: "Norms, eigen/SVD, convexity, gradient descent, momentum/Adam, Newton, KKT, and EM. (§4)"
    },
    "linear-models": {
      title: "Linear & Sparse Models",
      blurb: "Linear & robust regression, ridge vs lasso, logistic/softmax, GDA, naive Bayes, GLMs, generative vs discriminative. (§5)"
    },
    "kernels-trees": {
      title: "Kernels, SVMs, Trees & Ensembles",
      blurb: "Kernel trick, SVMs, Gaussian processes, decision trees, bagging, random forests, and boosting. (§6)"
    },
    "unsupervised": {
      title: "Unsupervised & Latent-Variable Models",
      blurb: "Mixtures & EM, K-means, PCA, factor analysis, ICA, autoencoders & VAEs. (§7)"
    },
    "deep-learning": {
      title: "Deep Learning & Generative AI",
      blurb: "MLPs & backprop, normalization & residuals, attention & transformers, CNN/RNN, diffusion, LoRA & PEFT. (§8)"
    },
    "inference-graphical": {
      title: "Inference & Graphical / Sequential Models",
      blurb: "Laplace, MCMC & variational inference; Bayes nets, HMMs, Kalman filters, and CRFs. (§9–§10)"
    },
    "rl": {
      title: "Reinforcement Learning",
      blurb: "MDPs & Bellman, TD / Sarsa / Q-learning, function approximation & the deadly triad, policy gradients. (§11)"
    },
    "applied-ml": {
      title: "Applied ML & Specialized Models",
      blurb: "Learning with fewer labels, the ML lifecycle, leakage & imbalance, recommenders, and GNNs. (§12–§13)"
    },

    /* ---- Optimization & Decision-Making track ---- */
    "opt-foundations": {
      title: "Optimization Foundations & Derivatives",
      blurb: "Optimality conditions, derivatives & autodiff, bracketing/line search, descent, trust region, Newton & direct methods. (Opt Ch 1–7)"
    },
    "opt-stochastic": {
      title: "Descent, Stochastic & Population Methods",
      blurb: "First-order optimizers (CG, momentum, Adam), simulated annealing, cross-entropy, CMA-ES, and population methods. (Opt Ch 5, 8, 9)"
    },
    "constrained-opt": {
      title: "Constraints, Duality, LP, QP & Convex",
      blurb: "Constraint handling, Lagrangian duality & KKT, simplex/LP, quadratic programming, and disciplined convex programming. (Opt Ch 10–14)"
    },
    "opt-advanced": {
      title: "Multiobjective, Surrogates & Uncertainty",
      blurb: "Pareto & scalarization, sampling plans, GP surrogates & Bayesian optimization, robust optimization (VaR/CVaR), discrete & MDO. (Opt Ch 15–24)"
    },
    "dm-mdp": {
      title: "Probabilistic Reasoning & MDPs",
      blurb: "Bayesian networks & inference, utility theory & value of information, MDPs, value/policy iteration, LQR, and online planning. (DM Ch 1–9)"
    },
    "dm-rl-pomdp": {
      title: "RL, POMDPs & Multiagent Decisions",
      blurb: "Policy gradients & actor-critic, bandits & exploration, model-based/free RL, POMDP beliefs & alpha vectors, and multiagent equilibria. (DM Ch 10–27)"
    },

    /* ---- Generative AI & LLMs track ---- */
    "genai-arch": {
      title: "LLM Architecture & Efficiency",
      blurb: "Tokenization & BPE, the transformer stack, and the modern efficiency layer — FlashAttention, KV cache, RoPE, GQA, RMSNorm, SwiGLU, MoE — plus scaling laws."
    },
    "genai-align": {
      title: "Training, Alignment & Decoding",
      blurb: "The pretrain → SFT → RLHF/DPO lifecycle, reward models, decoding strategies, and inference efficiency (quantization, speculative decoding, throughput vs latency)."
    },
    "genai-applied": {
      title: "RAG, Agents & the Generative Frontier",
      blurb: "Retrieval-augmented generation, tool use & agents, LLM/agent evaluation and hallucination — and the non-autoregressive frontier (diffusion language models)."
    }
  };

  const TRACKS = [
    {
      id: "ml",
      title: "AI & Machine Learning Fundamentals",
      source: "ML · deep learning · RL",
      sub: "Foundations through frontier — original practice material on concepts from the standard graduate texts (Murphy; Fleuret; Sutton & Barto).",
      batches: [
        "ml-foundations", "probability", "statistics", "linalg-opt",
        "linear-models", "kernels-trees", "unsupervised", "deep-learning",
        "inference-graphical", "rl", "applied-ml"
      ]
    },
    {
      id: "opt",
      title: "Optimization & Decision-Making Fundamentals",
      source: "optimization · decision-making",
      sub: "Engineering optimization & decision-making under uncertainty — concepts after Kochenderfer et al. (MIT Press).",
      batches: [
        "opt-foundations", "opt-stochastic", "constrained-opt",
        "opt-advanced", "dm-mdp", "dm-rl-pomdp"
      ]
    },
    {
      id: "genai",
      title: "Generative AI & Large Language Models",
      source: "LLMs · GenAI",
      sub: "The modern LLM stack — architecture & efficiency, training & alignment, serving, RAG/agents, and the generative frontier.",
      batches: ["genai-arch", "genai-align", "genai-applied"]
    }
  ];

  // Build final structure, attaching question arrays. Batches with no
  // questions yet are dropped from the home view so nothing looks broken.
  const batches = {};
  Object.keys(META).forEach(id => {
    const qs = B[id] || [];
    if (qs.length) batches[id] = Object.assign({}, META[id], { questions: qs, review: R[id] || null });
  });

  const tracks = TRACKS.map(t => Object.assign({}, t, {
    batches: t.batches.filter(id => batches[id])
  })).filter(t => t.batches.length);

  window.QUIZ_DATA = { tracks, batches };
})();
