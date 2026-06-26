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
      blurb: "Types of ML, parametric vs non-parametric, generalization, bias–variance, and the shared toolkit."
    },
    "probability": {
      title: "Probability & Distributions",
      blurb: "Bayes' rule & base rates, independence, moments, key distributions, the multivariate Gaussian, CLT & Monte Carlo."
    },
    "statistics": {
      title: "Estimation, Bayes & Decision Theory",
      blurb: "MLE/MAP, conjugate priors, Bayesian vs frequentist, decision theory, and classification metrics."
    },
    "linalg-opt": {
      title: "Linear Algebra & Optimization Core",
      blurb: "Norms, eigen/SVD, convexity, gradient descent, momentum/Adam, Newton, KKT, and EM."
    },
    "linear-models": {
      title: "Linear & Sparse Models",
      blurb: "Linear & robust regression, ridge vs lasso, logistic/softmax, GDA, naive Bayes, GLMs, generative vs discriminative."
    },
    "kernels-trees": {
      title: "Kernels, SVMs, Trees & Ensembles",
      blurb: "Kernel trick, SVMs, Gaussian processes, decision trees, bagging, random forests, and boosting."
    },
    "unsupervised": {
      title: "Unsupervised & Latent-Variable Models",
      blurb: "Mixtures & EM, K-means, PCA, factor analysis, ICA, autoencoders & VAEs."
    },
    "deep-learning": {
      title: "Deep Learning & Generative AI",
      blurb: "MLPs & backprop, normalization & residuals, attention & transformers, CNN/RNN, diffusion, LoRA & PEFT."
    },
    "inference-graphical": {
      title: "Inference & Graphical / Sequential Models",
      blurb: "Laplace, MCMC & variational inference; Bayes nets, HMMs, Kalman filters, and CRFs."
    },
    "rl": {
      title: "Reinforcement Learning",
      blurb: "MDPs & Bellman, TD / Sarsa / Q-learning, function approximation & the deadly triad, policy gradients."
    },
    "applied-ml": {
      title: "Applied ML & Specialized Models",
      blurb: "Learning with fewer labels, the ML lifecycle, leakage & imbalance, recommenders, and GNNs."
    },

    /* ---- Optimization & Decision-Making track ---- */
    "opt-foundations": {
      title: "Optimization Foundations & Derivatives",
      blurb: "Optimality conditions, derivatives & autodiff, bracketing/line search, descent, trust region, Newton & direct methods."
    },
    "opt-stochastic": {
      title: "Descent, Stochastic & Population Methods",
      blurb: "First-order optimizers (CG, momentum, Adam), simulated annealing, cross-entropy, CMA-ES, and population methods."
    },
    "constrained-opt": {
      title: "Constraints, Duality, LP, QP & Convex",
      blurb: "Constraint handling, Lagrangian duality & KKT, simplex/LP, quadratic programming, and disciplined convex programming."
    },
    "opt-surrogate": {
      title: "Multiobjective & Surrogate Optimization",
      blurb: "Pareto frontiers & scalarization, space-filling sampling plans, surrogate models, Gaussian processes, and Bayesian optimization via acquisition functions."
    },
    "opt-uncertainty": {
      title: "Optimization under Uncertainty, Discrete & MDO",
      blurb: "Robust optimization & risk measures (VaR/CVaR, Markowitz), uncertainty propagation, discrete/integer programming, expression optimization, and multidisciplinary optimization."
    },
    "dm-mdp": {
      title: "Probabilistic Reasoning & MDPs",
      blurb: "Bayesian networks & inference, utility theory & value of information, MDPs, value/policy iteration, LQR, and online planning."
    },
    "dm-rl": {
      title: "Reinforcement Learning & Policy Optimization",
      blurb: "Policy search & policy gradients, actor–critic, exploration & bandits, model-based and model-free RL, and imitation learning — acting under an unknown model."
    },
    "dm-pomdp": {
      title: "POMDPs & Multiagent Systems",
      blurb: "Beliefs & filters (Kalman/particle), belief-state planning with alpha vectors (QMDP, PBVI, POMCP), finite-state controllers, and multiagent games (Nash, Markov games, Dec-POMDPs)."
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
      source: "ML · deep learning · RL · LLMs",
      sub: "Foundations through the generative-AI frontier — original practice material on concepts from the standard graduate texts (Murphy; Fleuret; Sutton & Barto) and the modern LLM literature.",
      batches: [
        "ml-foundations", "probability", "statistics", "linalg-opt",
        "linear-models", "kernels-trees", "unsupervised", "deep-learning",
        "inference-graphical", "rl", "applied-ml",
        "genai-arch", "genai-align", "genai-applied"
      ]
    },
    {
      id: "opt",
      title: "Optimization & Decision-Making Fundamentals",
      source: "optimization · decision-making",
      sub: "Engineering optimization & decision-making under uncertainty — concepts after Kochenderfer et al. (MIT Press).",
      batches: [
        "opt-foundations", "opt-stochastic", "constrained-opt",
        "opt-surrogate", "opt-uncertainty", "dm-mdp", "dm-rl", "dm-pomdp"
      ]
    }
  ];

  /* ---- Decision-intelligence PATH: a 6-stage overlay on the very same batches.
     The path is the default, goal-tailored view; the TRACKS above remain as the
     by-source "Library" view. Stage order is the learning arc:
     frame → predict → reason → optimize → decide-over-time → build. ---- */
  const STAGES = [
    { id: "s1", n: 1, name: "Foundations", tagline: "Quantify what you know and don't",
      batches: ["ml-foundations", "probability", "statistics", "linalg-opt"] },
    { id: "s2", n: 2, name: "Prediction", tagline: "Turn data into forecasts",
      batches: ["linear-models", "kernels-trees", "unsupervised", "deep-learning"] },
    { id: "s3", n: 3, name: "Reasoning & decision theory", tagline: "Update beliefs; put a value on choices",
      batches: ["inference-graphical", "dm-mdp"] },
    { id: "s4", n: 4, name: "Optimization", tagline: "Choose the best feasible action",
      batches: ["opt-foundations", "opt-stochastic", "constrained-opt", "opt-surrogate", "opt-uncertainty"] },
    { id: "s5", n: 5, name: "Sequential decisions", tagline: "Act, learn, and adapt over time",
      batches: ["rl", "dm-rl", "dm-pomdp"] },
    { id: "s6", n: 6, name: "Building decision products", tagline: "Ship it — applied ML, LLMs & agents",
      batches: ["applied-ml", "genai-arch", "genai-align", "genai-applied"] }
  ];

  // Each goal tags every stage: "core" (your focus), "skim" (lighter), "off" (kept in Library).
  const GOALS = [
    { key: "decisions", label: "Make better decisions under uncertainty",
      sub: "The decision-intelligence toolkit — decision theory, optimization, and RL for choosing well when outcomes are unknown.",
      role: { s1: "skim", s2: "skim", s3: "core", s4: "core", s5: "core", s6: "off" } },
    { key: "ml", label: "Build predictive ML models",
      sub: "Classic machine learning end to end — from the math to models that generalize.",
      role: { s1: "core", s2: "core", s3: "skim", s4: "off", s5: "off", s6: "core" } },
    { key: "llm", label: "Build with LLMs & agents",
      sub: "How modern language models and agents work — architecture, training, alignment, RAG, and tool use.",
      role: { s1: "skim", s2: "off", s3: "skim", s4: "off", s5: "core", s6: "core" } },
    { key: "opt", label: "Tackle optimization & OR problems",
      sub: "Engineering optimization and operations research — descent, constraints, surrogates, and decisions under uncertainty.",
      role: { s1: "skim", s2: "off", s3: "skim", s4: "core", s5: "skim", s6: "off" } },
    { key: "explore", label: "Explore the fundamentals",
      sub: "Not sure yet? Walk the whole path, foundations first.",
      role: { s1: "core", s2: "core", s3: "core", s4: "core", s5: "core", s6: "core" } }
  ];

  // Level sets where the path starts; earlier stages collapse to "review if rusty".
  const LEVELS = [
    { key: "new", label: "New to the math", short: "from scratch", start: 1 },
    { key: "basics", label: "Comfortable with probability & linear algebra", short: "some background", start: 3 },
    { key: "adv", label: "Experienced — take me to the advanced parts", short: "experienced", start: 4 }
  ];

  const PRIMER = {
    title: "Think like a decision scientist",
    blurb: "A 5-minute primer on the decision-intelligence mindset — framing choices, utility, expected value, and the value of information. No quiz; just the lens the rest of the path builds on."
  };

  // Build final structure, attaching question arrays. Batches with no
  // questions yet are dropped from the home view so nothing looks broken.
  const batches = {};
  Object.keys(META).forEach(id => {
    const qs = B[id] || [];
    if (qs.length) batches[id] = Object.assign({}, META[id], { questions: qs, review: R[id] || null });
  });

  // Stage 0 primer: review-only (no questions), reachable from the path view.
  if (R["stage0"]) {
    batches["stage0"] = Object.assign({}, PRIMER, { questions: [], review: R["stage0"], primer: true });
  }

  const tracks = TRACKS.map(t => Object.assign({}, t, {
    batches: t.batches.filter(id => batches[id])
  })).filter(t => t.batches.length);

  // stages keep only batches that actually exist (built above)
  const stages = STAGES.map(s => Object.assign({}, s, {
    batches: s.batches.filter(id => batches[id])
  })).filter(s => s.batches.length);

  window.QUIZ_DATA = {
    tracks, batches, stages,
    goals: GOALS, levels: LEVELS,
    primer: batches["stage0"] || null
  };
})();
