/* Batch: POMDPs & Multiagent Systems */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["dm-pomdp"] = [
  {
    id: "pom-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What does a <b>POMDP</b> add to an MDP, and how does an agent cope with it?",
    options: [
      "State uncertainty — the agent never sees the true state, only observations, so it maintains a <b>belief</b> (a distribution over states)",
      "Multiple reward functions — the agent maintains one value function per objective",
      "A second agent — the agent maintains a model of the opponent's policy",
      "Continuous actions — the agent maintains a Gaussian over the action space"
    ],
    answer: 0,
    explanation: "A POMDP $(\\mathcal{S},\\mathcal{A},\\mathcal{O},T,R,O,\\gamma)$ adds <i>partial observability</i>: the true state is hidden and only observations are seen, so the agent maintains a belief $b$ (a distribution over states), updated by Bayes' rule. Multiple rewards/agents/continuous actions are different extensions.",
    ref: "Beliefs & filters"
  },
  {
    id: "pom-2", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "Why is a POMDP often solved as a <b>belief-MDP</b>, and what makes its value function special?",
    options: [
      "The belief is a sufficient statistic, giving a continuous-state MDP whose optimal value $U^*(b)$ is piecewise-linear and convex (PWLC)",
      "The belief collapses to a single state, giving an ordinary discrete MDP solvable by value iteration",
      "The belief makes rewards stochastic, so the value function is concave and smooth",
      "The belief removes the discount factor, so the value function is linear everywhere"
    ],
    answer: 0,
    explanation: "Treating the belief as the state yields a continuous-state belief-MDP: reward $R(b,a)=\\sum_s R(s,a)b(s)$ and a deterministic belief transition per $(a,o)$. Because each conditional plan contributes an alpha-vector hyperplane $U^\\pi(b)=\\boldsymbol\\alpha_\\pi^\\top\\mathbf{b}$, the optimal value $U^*(b)=\\max_\\pi\\boldsymbol\\alpha_\\pi^\\top\\mathbf{b}$ is piecewise-linear and convex.",
    ref: "Belief-state planning"
  },
  {
    id: "pom-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "Two states $\\{s_0,s_1\\}$. Prior belief $b=(0.5,0.5)$. The action's dynamics are identity ($T(s'\\mid s)=1$ iff $s'=s$), so the predict step leaves the belief unchanged. You then observe $o$ with likelihoods $O(o\\mid s_0)=0.2$ and $O(o\\mid s_1)=0.8$. After the exact discrete update $b'(s')\\propto O(o\\mid s')\\sum_s T(s'\\mid s)b(s)$, what is $b'(s_1)$?",
    answer: 0.8, tolerance: 0.01, unit: "",
    hint: "Unnormalized: $s_0:0.2\\times0.5$, $s_1:0.8\\times0.5$. Normalize.",
    explanation: "Predict leaves $(0.5,0.5)$. Update: unnormalized $s_0=0.2\\cdot0.5=0.1$, $s_1=0.8\\cdot0.5=0.4$; normalizer $=0.5$. So $b'(s_1)=0.4/0.5=0.8$. The observation, four times more likely under $s_1$, pulls the belief toward $s_1$.",
    ref: "Beliefs & filters"
  },
  {
    id: "pom-4", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "Which statement about <b>Nash</b> and <b>correlated</b> equilibria is correct?",
    options: [
      "Every Nash equilibrium is a correlated equilibrium, but not conversely; a correlated equilibrium is computable by a linear program",
      "Every correlated equilibrium is a Nash equilibrium, but not conversely; computing a Nash equilibrium is solvable by a linear program",
      "Nash equilibria require a dominant strategy for every agent",
      "Correlated equilibria never exist for finite action spaces"
    ],
    answer: 0,
    explanation: "Every Nash equilibrium is a correlated equilibrium, but not every correlated equilibrium is a Nash. A correlated equilibrium (a single coordinating joint policy) is computable by a linear program, whereas computing a Nash equilibrium is PPAD-complete. A Nash needs every agent to best-respond, not a dominant strategy (which is rare).",
    ref: "Multiagent equilibria"
  },
  {
    id: "pom-5", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "In a <b>Markov (stochastic) game</b>, what is true of an agent's <b>best response</b> to fixed opponents, and of Nash equilibria?",
    options: [
      "With opponents' policies fixed, the best response reduces to solving an ordinary MDP; a Nash equilibrium is guaranteed to exist",
      "The best response requires solving a POMDP because opponents are unobserved; no Nash equilibrium exists in general",
      "The best response is always a dominant strategy, so no equilibrium computation is needed",
      "The best response requires a linear program per state, and Nash equilibria exist only for two-player zero-sum games"
    ],
    answer: 0,
    explanation: "A Markov game is an MDP with multiple agents. If you fix the other agents' policies $\\boldsymbol\\pi^{-i}$, agent $i$ faces stationary dynamics and reward, so its best response is exactly an MDP-solving problem. A Nash equilibrium is guaranteed to exist (Fink). Nash Q-learning exploits this by building and solving a per-transition simple game.",
    ref: "Markov games"
  },
  {
    id: "pom-6", type: "ms", framing: "applied", difficulty: 4,
    prompt: "A POMDP requires maintaining a <b>belief</b> updated by Bayes' rule. Select every <b>correct</b> statement about the filters used to do this.",
    options: [
      "The Kalman filter is an exact belief update for linear-Gaussian dynamics and observations",
      "The extended Kalman filter (EKF) linearizes via Jacobians, losing exactness and multimodality",
      "The unscented Kalman filter (UKF) is derivative-free, propagating sigma points",
      "The particle filter is restricted to unimodal beliefs and never suffers particle deprivation",
      "The discrete (exact) filter computes $b'(s')\\propto O(o\\mid a,s')\\sum_s T(s'\\mid s,a)b(s)$"
    ],
    answer: [0, 1, 2, 4],
    explanation: "The Kalman filter is the exact linear-Gaussian belief update; the EKF linearizes with Jacobians (losing exactness/multimodality); the UKF is derivative-free using sigma points; and the discrete filter applies Bayes' rule as $b'(s')\\propto O(o\\mid a,s')\\sum_s T(s'\\mid s,a)b(s)$. The particle filter is in fact <i>multimodal</i> and is precisely the method that can suffer particle deprivation, so that option is false.",
    ref: "Beliefs & filters"
  },
  {
    id: "pom-7", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "Select every <b>correct</b> statement about <b>finite-state controllers (FSCs)</b> as POMDP policies and about <b>online</b> belief-tree search.",
    options: [
      "An FSC carries internal memory ($\\psi(a\\mid x)$, $\\eta(x'\\mid x,a,o)$), so at runtime you track a node instead of maintaining a belief",
      "Because transitions can loop and be stochastic, a finite FSC can represent an infinite-horizon policy compactly",
      "Each FSC node $x$ defines an alpha vector $\\alpha_x(s)=U(x,s)$, so the start node is $\\arg\\max_x\\mathbf{b}^\\top\\boldsymbol\\alpha_x$",
      "POMCP and DESPOT plan offline by enumerating all conditional plans before acting",
      "Online solvers can use the gap between an upper and a lower bound to guide which branches to expand"
    ],
    answer: [0, 1, 2, 4],
    explanation: "An FSC generalizes a conditional plan: it carries its own memory via $\\psi$ (action per node) and $\\eta$ (successor per node/action/observation), so looping stochastic transitions encode an infinite-horizon policy with bounded runtime memory — just track the node. Each node yields an alpha vector and the start node maximizes $\\mathbf{b}^\\top\\boldsymbol\\alpha_x$. POMCP/DESPOT are <i>online</i> tree-search methods (planning from the current belief), not offline plan enumeration, so that option is false; gap-guided search (HSVI/SARSOP-style) is correct.",
    ref: "Finite-state controllers"
  },
  {
    id: "pom-8", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "Compare the worst-case computational complexity of solving these two decision-making models exactly, as stated in the notes.",
    quantityA: "Complexity of solving an exact POMDP (single agent)",
    quantityB: "Complexity of solving a Dec-POMDP (shared-reward multiagent)",
    answer: 1,
    explanation: "Exact POMDPs are PSPACE-complete, while Dec-POMDPs are NEXP-complete. NEXP-complete is a strictly harder class than PSPACE-complete, so the Dec-POMDP (quantity B) is the more computationally demanding — B is greater.",
    ref: "Collaborative agents"
  },
  {
    id: "pom-9", type: "numeric", framing: "conceptual", difficulty: 5,
    prompt: "A <b>Dec-POMDP</b> with full transition, observation, AND reward independence is <b>P-complete</b>; dropping to transition+observation independence only makes it <b>NP-complete</b>; the general case is <b>NEXP-complete</b>. Ordering these three complexity classes from easiest (1) to hardest (3), what rank does the <b>NP-complete</b> (transition+observation-independent) subclass receive?",
    answer: 2, tolerance: 0, unit: "",
    hint: "P $\\subseteq$ NP $\\subseteq$ NEXP; rank the middle one.",
    explanation: "The containment is P $\\subseteq$ NP $\\subseteq$ NEXP, so the ordering easiest→hardest is P-complete (1), NP-complete (2), NEXP-complete (3). The transition+observation-independent subclass is NP-complete, so it ranks 2 — exploiting factored independence collapses the general NEXP-complete Dec-POMDP to a far easier class.",
    ref: "Collaborative agents"
  },
  {
    id: "pom-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "In <b>offline belief-state planning</b>, which statement about the approximation bounds is correct?",
    options: [
      "QMDP is an upper bound that is poor at valuing information-gathering, and the fast informed bound is never looser than QMDP",
      "QMDP is a lower bound that overvalues information-gathering, and is always tighter than PBVI",
      "Point-based value iteration (PBVI) produces an upper bound that may violate convexity",
      "The blind lower bound assumes full observability after the first step"
    ],
    answer: 0,
    explanation: "QMDP is an upper bound (one alpha vector per action, assuming full observability after step 1) that is poor at valuing information-gathering; the fast informed bound partly accounts for observations and is never looser than QMDP. PBVI is a <i>lower</i>-bound method (backups at chosen belief points preserve the lower bound), and the blind lower bound commits to one action forever — it is QMDP, not blind, that assumes observability after step 1.",
    ref: "Offline belief-state planning"
  }
];
