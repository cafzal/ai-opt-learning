/* Batch: Decision Making — RL, Policy Methods, POMDPs & Multiagent  (DM Book II Ch 10–27; §S17, §S19–§S22) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["dm-rl-pomdp"] = [
  {
    id: "drp-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What characterizes the <b>policy search</b> methods of Ch 10 (e.g., local search, cross-entropy, evolution strategies)?",
    options: [
      "They optimize the parameters of $\\pi_\\theta$ directly, using gradient-free search",
      "They require the transition model $T$ to be known in closed form",
      "They estimate $Q(s,a)$ via temporal-difference updates",
      "They maintain a belief over states and update it by Bayes' rule"
    ],
    answer: 0,
    explanation: "Policy search optimizes the parameters of a parametrized policy $\\pi_\\theta$ directly and gradient-free — local search/GA, the cross-entropy method, and evolution strategies are simply applied to the policy-return objective $U(\\pi)=\\mathbb{E}_\\tau[R(\\tau)]$. Estimating $Q$ via TD is model-free RL (Ch 17); maintaining a belief is the POMDP setting (Ch 19).",
    ref: "DM Ch 10 — Policy Search"
  },
  {
    id: "drp-2", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "What is the key difference between the <b>Q-learning</b> and <b>Sarsa</b> updates?",
    options: [
      "Q-learning bootstraps off $\\max_{a'}Q(s',a')$ (off-policy), while Sarsa uses $Q(s',a')$ for the action actually taken (on-policy)",
      "Q-learning requires a known model, while Sarsa is model-free",
      "Sarsa bootstraps off $\\max_{a'}Q(s',a')$, while Q-learning uses the actual next action",
      "Q-learning maintains a belief state, while Sarsa does not"
    ],
    answer: 0,
    explanation: "Q-learning is off-policy: $Q\\leftarrow Q+\\alpha(r+\\gamma\\max_{a'}Q(s',a')-Q)$, bootstrapping off the greedy next value. Sarsa is on-policy: it uses $r+\\gamma Q(s',a')$ for the action actually taken next. Both are model-free. The $\\max$ in Q-learning introduces optimism bias, which double Q-learning corrects.",
    ref: "DM Ch 17 — Model-Free Methods"
  },
  {
    id: "drp-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "In <b>PPO</b>'s clamped surrogate objective, the probability ratio $\\frac{\\pi_{\\theta'}}{\\pi_\\theta}$ is clamped to $[1-\\epsilon,\\,1+\\epsilon]$. With the standard $\\epsilon=0.2$, what is the <b>lower</b> bound of the clamp interval?",
    answer: 0.8, tolerance: 0, unit: "",
    hint: "Compute $1-\\epsilon$.",
    explanation: "PPO clamps the ratio to $[1-\\epsilon,1+\\epsilon]=[0.8,1.2]$ for $\\epsilon=0.2$, so the lower bound is $0.8$. This clamping removes the explicit trust-region constraint and line search of TRPO while still discouraging overly large policy updates, and it lets trajectories be reused.",
    ref: "DM Ch 12 — Policy Gradient Optimization"
  },
  {
    id: "drp-4", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "Which statement about <b>Nash</b> and <b>correlated</b> equilibria is correct?",
    options: [
      "Every Nash equilibrium is a correlated equilibrium, but not conversely; a correlated equilibrium is computable by a linear program",
      "Every correlated equilibrium is a Nash equilibrium, but not conversely; computing a Nash equilibrium is solvable by a linear program",
      "Nash equilibria require a dominant strategy for every agent",
      "Correlated equilibria never exist for finite action spaces"
    ],
    answer: 0,
    explanation: "Every Nash equilibrium is a correlated equilibrium, but not every correlated equilibrium is a Nash. A correlated equilibrium (a single coordinating joint policy) is computable by a linear program, whereas computing a Nash equilibrium is PPAD-complete. A Nash needs every agent to best-respond, not a dominant strategy (which is rare).",
    ref: "§S22 — Equilibrium concepts & solving"
  },
  {
    id: "drp-5", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every <b>true</b> statement about variance reduction in likelihood-ratio policy gradient estimation (Ch 11).",
    options: [
      "Reward-to-go credits a reward $r^{(k)}$ only to actions up to step $k$ and approximates $Q_\\theta$",
      "Subtracting a state baseline is unbiased because $\\mathbb{E}_a[\\nabla\\log\\pi_\\theta]=0$",
      "Likelihood-ratio gradient + reward-to-go + baseline together give REINFORCE",
      "The TD residual $r+\\gamma U(s')-U(s)$ is a biased estimate of the advantage",
      "Using the value $U(s)$ as the baseline yields the advantage $A=Q-U$"
    ],
    answer: [0, 1, 2, 4],
    explanation: "Reward-to-go credits each reward only to prior actions and approximates $Q_\\theta$; baseline subtraction is unbiased since $\\mathbb{E}_a[\\nabla\\log\\pi_\\theta]=0$; combining likelihood-ratio + reward-to-go + baseline is exactly REINFORCE; and using $U(s)$ as the baseline gives the advantage $A=Q-U$. The TD residual $r+\\gamma U(s')-U(s)$ is an <i>unbiased</i> advantage estimate, so the fourth option is false.",
    ref: "DM Ch 11 — Policy Gradient Estimation"
  },
  {
    id: "drp-6", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Apply one <b>Q-learning</b> update $Q\\leftarrow Q+\\alpha(r+\\gamma\\max_{a'}Q(s',a')-Q)$ with current $Q(s,a)=2$, learning rate $\\alpha=0.5$, reward $r=1$, discount $\\gamma=0.9$, and $\\max_{a'}Q(s',a')=10$. What is the updated value $Q(s,a)$?",
    answer: 6, tolerance: 0, unit: "",
    hint: "TD target $=r+\\gamma\\max_{a'}Q(s',a')$; then move halfway toward it.",
    explanation: "TD target $=1+0.9(10)=10$, so the TD error is $10-2=8$. Update: $Q\\leftarrow 2+0.5(8)=6$. The update nudges $Q$ from its old value toward the bootstrapped target by a fraction $\\alpha$.",
    ref: "DM Ch 17 — Model-Free Methods"
  },
  {
    id: "drp-7", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "In <b>generalized advantage estimation (GAE)</b>, exponentially-weighted $k$-step advantages are controlled by $\\lambda$. What does varying $\\lambda$ from $0$ to $1$ trade off?",
    options: [
      "$\\lambda=0$ gives the high-bias one-step TD residual; $\\lambda=1$ gives the unbiased but high-variance estimate",
      "$\\lambda=0$ gives an unbiased high-variance estimate; $\\lambda=1$ gives the high-bias TD residual",
      "$\\lambda$ sets the learning rate of the critic, not a bias–variance tradeoff",
      "$\\lambda$ selects between on-policy and off-policy updates"
    ],
    answer: 0,
    explanation: "GAE forms $\\hat A^{\\text{GAE}}=\\mathbb{E}[\\sum_k(\\gamma\\lambda)^{k-1}\\delta_k]$. At $\\lambda=0$ it collapses to the single-step TD residual — high bias, low variance; at $\\lambda=1$ it becomes the unbiased Monte-Carlo-style estimate — no bias but high variance. Intermediate $\\lambda$ interpolates the bias–variance tradeoff.",
    ref: "DM Ch 13 — Actor-Critic Methods"
  },
  {
    id: "drp-8", type: "ms", framing: "applied", difficulty: 4,
    prompt: "A POMDP requires maintaining a <b>belief</b> updated by Bayes' rule. Select every <b>correct</b> statement about the filters used to do this (Ch 19).",
    options: [
      "The Kalman filter is an exact belief update for linear-Gaussian dynamics and observations",
      "The extended Kalman filter (EKF) linearizes via Jacobians, losing exactness and multimodality",
      "The unscented Kalman filter (UKF) is derivative-free, propagating sigma points",
      "The particle filter is restricted to unimodal beliefs and never suffers particle deprivation",
      "The discrete (exact) filter computes $b'(s')\\propto O(o\\mid a,s')\\sum_s T(s'\\mid s,a)b(s)$"
    ],
    answer: [0, 1, 2, 4],
    explanation: "The Kalman filter is the exact linear-Gaussian belief update; the EKF linearizes with Jacobians (losing exactness/multimodality); the UKF is derivative-free using sigma points; and the discrete filter applies Bayes' rule as $b'(s')\\propto O(o\\mid a,s')\\sum_s T(s'\\mid s,a)b(s)$. The particle filter is in fact <i>multimodal</i> and is precisely the method that can suffer particle deprivation, so that option is false.",
    ref: "DM Ch 19 — Beliefs (Filters)"
  },
  {
    id: "drp-9", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "Compare the worst-case computational complexity of solving these two decision-making models exactly, as stated in the notes.",
    quantityA: "Complexity of solving an exact POMDP (single agent)",
    quantityB: "Complexity of solving a Dec-POMDP (shared-reward multiagent)",
    answer: 1,
    explanation: "Exact POMDPs are PSPACE-complete, while Dec-POMDPs are NEXP-complete. NEXP-complete is a strictly harder class than PSPACE-complete, so the Dec-POMDP (quantity B) is the more computationally demanding — B is greater.",
    ref: "DM Ch 21 / Ch 27 — Belief planning & Dec-POMDPs"
  },
  {
    id: "drp-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "In <b>offline belief-state planning</b> (Ch 21), which statement about the approximation bounds is correct?",
    options: [
      "QMDP is an upper bound that is poor at valuing information-gathering, and the fast informed bound is never looser than QMDP",
      "QMDP is a lower bound that overvalues information-gathering, and is always tighter than PBVI",
      "Point-based value iteration (PBVI) produces an upper bound that may violate convexity",
      "The blind lower bound assumes full observability after the first step"
    ],
    answer: 0,
    explanation: "QMDP is an upper bound (one alpha vector per action, assuming full observability after step 1) that is poor at valuing information-gathering; the fast informed bound partly accounts for observations and is never looser than QMDP. PBVI is a <i>lower</i>-bound method (backups at chosen belief points preserve the lower bound), and the blind lower bound commits to one action forever — it is QMDP, not blind, that assumes observability after step 1.",
    ref: "DM Ch 21 — Offline Belief-State Planning"
  }
];
