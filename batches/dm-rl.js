/* Batch: Reinforcement Learning & Policy Optimization */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["dm-rl"] = [
  {
    id: "drl-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What characterizes the <b>policy search</b> methods of Ch 10 (e.g., local search, cross-entropy, evolution strategies)?",
    options: [
      "They optimize the parameters of $\\pi_\\theta$ directly, using gradient-free search",
      "They require the transition model $T$ to be known in closed form",
      "They estimate $Q(s,a)$ via temporal-difference updates",
      "They maintain a belief over states and update it by Bayes' rule"
    ],
    answer: 0,
    explanation: "Policy search optimizes the parameters of a parametrized policy $\\pi_\\theta$ directly and gradient-free — local search/GA, the cross-entropy method, and evolution strategies are simply applied to the policy-return objective $U(\\pi)=\\mathbb{E}_\\tau[R(\\tau)]$, estimated from rollouts. Estimating $Q$ via TD is model-free RL; maintaining a belief is the POMDP setting.",
    ref: "Policy search"
  },
  {
    id: "drl-2", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "What is the key difference between the <b>Q-learning</b> and <b>Sarsa</b> updates?",
    options: [
      "Q-learning bootstraps off $\\max_{a'}Q(s',a')$ (off-policy), while Sarsa uses $Q(s',a')$ for the action actually taken (on-policy)",
      "Q-learning requires a known model, while Sarsa is model-free",
      "Sarsa bootstraps off $\\max_{a'}Q(s',a')$, while Q-learning uses the actual next action",
      "Q-learning maintains a belief state, while Sarsa does not"
    ],
    answer: 0,
    explanation: "Q-learning is off-policy: $Q\\leftarrow Q+\\alpha(r+\\gamma\\max_{a'}Q(s',a')-Q)$, bootstrapping off the greedy next value. Sarsa is on-policy: it uses $r+\\gamma Q(s',a')$ for the action actually taken next. Both are model-free. The $\\max$ in Q-learning introduces optimism bias, which double Q-learning corrects.",
    ref: "Model-free RL"
  },
  {
    id: "drl-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "In <b>PPO</b>'s clamped surrogate objective, the probability ratio $\\frac{\\pi_{\\theta'}}{\\pi_\\theta}$ is clamped to $[1-\\epsilon,\\,1+\\epsilon]$. With the standard $\\epsilon=0.2$, what is the <b>lower</b> bound of the clamp interval?",
    answer: 0.8, tolerance: 0, unit: "",
    hint: "Compute $1-\\epsilon$.",
    explanation: "PPO clamps the ratio to $[1-\\epsilon,1+\\epsilon]=[0.8,1.2]$ for $\\epsilon=0.2$, so the lower bound is $0.8$. This clamping removes the explicit trust-region constraint and line search of TRPO while still discouraging overly large policy updates, and it lets trajectories be reused.",
    ref: "Policy-gradient optimization"
  },
  {
    id: "drl-4", type: "ms", framing: "conceptual", difficulty: 3,
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
    ref: "Policy-gradient estimation"
  },
  {
    id: "drl-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Apply one <b>Q-learning</b> update $Q\\leftarrow Q+\\alpha(r+\\gamma\\max_{a'}Q(s',a')-Q)$ with current $Q(s,a)=2$, learning rate $\\alpha=0.5$, reward $r=1$, discount $\\gamma=0.9$, and $\\max_{a'}Q(s',a')=10$. What is the updated value $Q(s,a)$?",
    answer: 6, tolerance: 0, unit: "",
    hint: "TD target $=r+\\gamma\\max_{a'}Q(s',a')$; then move halfway toward it.",
    explanation: "TD target $=1+0.9(10)=10$, so the TD error is $10-2=8$. Update: $Q\\leftarrow 2+0.5(8)=6$. The update nudges $Q$ from its old value toward the bootstrapped target by a fraction $\\alpha$.",
    ref: "Model-free RL"
  },
  {
    id: "drl-6", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "<b>Policy validation</b> (Ch 14) checks a policy in simulation before deployment. Which technique is best suited to estimating the probability of a <b>rare failure</b> with acceptable precision?",
    options: [
      "Importance sampling biased toward failure-prone trajectories",
      "Plain Monte-Carlo rollouts from the nominal trajectory distribution",
      "Maximizing the policy-gradient surrogate objective",
      "Replacing the reward with a potential-based shaping term"
    ],
    answer: 0,
    explanation: "For rare events, naive Monte-Carlo needs enormous sample sizes to see enough failures, so the relative standard error stays large. Importance sampling reweights toward failure-prone trajectories, concentrating samples where they matter and giving a low-variance estimate of the small probability. Robustness (evaluation-model stress testing) and adversarial most-likely-failure search are the other Ch 14 tools, but the rare-event estimate specifically calls for importance sampling.",
    ref: "Policy validation"
  },
  {
    id: "drl-11", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "A two-armed bandit pays mean $\\mu^\\star=0.6$ (best) and $0.5$ (other). A greedy policy locks onto the worse arm and pulls it on <b>every</b> one of $T=10{,}000$ steps. What is its cumulative regret $\\text{Regret}(T)=T\\mu^\\star-\\sum_t\\mathbb{E}[\\mu_{a_t}]$?",
    answer: 1000, tolerance: 0, unit: "",
    hint: "Each pull of the worse arm adds the gap $\\mu^\\star-\\mu_a=0.1$; multiply by $T$.",
    explanation: "Every step pays the suboptimality gap $\\mu^\\star-0.5=0.1$, so regret $=0.1\\times10{,}000=1000$ and grows <i>linearly</i> in $T$ — the policy never stops losing. A sublinear-regret algorithm like UCB or Thompson sampling would pull the worse arm only $O(\\log T)$ times, so its total regret here is on the order of tens, and $\\text{Regret}(T)/T\\to0$ means its average reward approaches the optimal $0.6$.",
    ref: "Regret"
  },
  {
    id: "drl-7", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "In <b>generalized advantage estimation (GAE)</b>, exponentially-weighted $k$-step advantages are controlled by $\\lambda$. What does varying $\\lambda$ from $0$ to $1$ trade off?",
    options: [
      "$\\lambda=0$ gives the high-bias one-step TD residual; $\\lambda=1$ gives the unbiased but high-variance estimate",
      "$\\lambda=0$ gives an unbiased high-variance estimate; $\\lambda=1$ gives the high-bias TD residual",
      "$\\lambda$ sets the learning rate of the critic, not a bias–variance tradeoff",
      "$\\lambda$ selects between on-policy and off-policy updates"
    ],
    answer: 0,
    explanation: "GAE forms $\\hat A^{\\text{GAE}}=\\mathbb{E}[\\sum_k(\\gamma\\lambda)^{k-1}\\delta_k]$. At $\\lambda=0$ it collapses to the single-step TD residual — high bias, low variance; at $\\lambda=1$ it becomes the unbiased Monte-Carlo-style estimate — no bias but high variance. Intermediate $\\lambda$ interpolates the bias–variance tradeoff.",
    ref: "Actor-critic methods"
  },
  {
    id: "drl-8", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "Why does the <b>natural gradient</b> (and TRPO, which builds on it) constrain the change in the <i>trajectory distribution</i> via KL rather than just bounding the change in $\\theta$?",
    options: [
      "Because a fixed step in $\\theta$ can cause an arbitrarily large change in the policy's behavior; the Fisher matrix $\\mathbf{F}_\\theta$ rescales the step to be invariant to the parameterization",
      "Because the KL constraint makes the policy gradient unbiased, which it otherwise is not",
      "Because it removes the need to estimate the advantage function",
      "Because it converts the on-policy update into an off-policy one"
    ],
    answer: 0,
    explanation: "Equal-size steps in raw parameter space can produce wildly different changes in the policy distribution, making plain gradient ascent unstable and parameterization-dependent. The natural gradient takes a 2nd-order view using the Fisher information matrix $\\mathbf{F}_\\theta=\\mathbb{E}_\\tau[\\nabla\\log p\\,\\nabla\\log p^\\top]$, giving the scale-invariant update $\\mathbf{u}=\\mathbf{F}_\\theta^{-1}\\nabla U$. TRPO adds a line search on an importance-sampled surrogate inside a KL trust region. The gradient's (un)biasedness and on/off-policy character are unaffected.",
    ref: "Policy-gradient optimization"
  },
  {
    id: "drl-9", type: "ms", framing: "applied", difficulty: 4,
    prompt: "Select every <b>correct</b> statement about model-based RL update and exploration schemes (Ch 16) and the overestimation issue they interact with.",
    options: [
      "Maximum-likelihood model estimates are $T(s'\\mid s,a)\\approx N(s,a,s')/N(s,a)$ and $R\\approx\\rho/N$ from visit counts",
      "Prioritized sweeping orders updates by predecessor impact ($T\\cdot|\\Delta U|$) so the most consequential backups happen first",
      "R-MAX assigns the optimistic value $r_{\\max}/(1-\\gamma)$ to under-explored $(s,a)$ (count below $m$) so a greedy planner is driven to explore them",
      "Dyna re-solves the entire MDP exactly after every real transition, which is why it is the cheapest update scheme",
      "Double Q-learning addresses the optimism/overestimation bias that the $\\max$ operator introduces"
    ],
    answer: [0, 1, 2, 4],
    explanation: "Maximum-likelihood models use visit-count ratios; prioritized sweeping uses a priority queue keyed by $T\\cdot|\\Delta U|$; R-MAX uses optimism ($r_{\\max}/(1-\\gamma)$ for $(s,a)$ with count $<m$) to drive exploration with PAC-style guarantees; and double Q-learning decouples action selection from evaluation to correct the $\\max$-induced optimism. Dyna is <i>cheap precisely because it does not</i> fully re-solve — it backs up at visited plus a few random states — so that option is false.",
    ref: "Model-based RL"
  },
  {
    id: "drl-10", type: "qc", framing: "conceptual", difficulty: 5,
    prompt: "An expert's demonstrations are available but the reward is unknown. Compare these two imitation-learning approaches by how well the learned policy performs on the states it actually visits at deployment.",
    quantityA: "Plain behavioral cloning (supervised on expert demos only)",
    quantityB: "DAgger (roll out the current policy, query the expert on visited states, aggregate, retrain)",
    answer: 1,
    explanation: "Behavioral cloning trains only on the expert's state distribution, so a small mistake moves the agent to states the expert never visited, where behavior is undefined — cascading errors compound the drift. DAgger explicitly labels the states the agent's own policy reaches, closing the distribution mismatch, so its deployed performance is generally better. Hence B is greater.",
    ref: "Imitation learning"
  }
];
