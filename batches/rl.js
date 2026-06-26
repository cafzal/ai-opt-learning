/* Batch: Reinforcement Learning */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["rl"] = [
  {
    id: "rl-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "A reinforcement-learning agent receives only an <b>occasional scalar reward</b> rather than labeled targets. How is this learning signal best described, in contrast to supervised learning?",
    options: [
      "<i>Evaluative</i> feedback, not the <i>instructive</i> labels of supervised learning",
      "A full set of labeled input-output pairs available up front",
      "A reconstruction error from compressing the input",
      "A density estimate over unlabeled states"
    ],
    answer: 0,
    explanation: "In RL the agent takes action $a_t\\sim\\pi(a\\mid s)$, gets reward $r_{t+1}$, and transitions to $s_{t+1}$, learning by trial-and-error under delayed consequences and the exploration-exploitation dilemma. The feedback is <i>evaluative</i> (how good was that action) rather than the <i>instructive</i> labels of supervised learning.",
    ref: "Reinforcement Learning (intro)"
  },
  {
    id: "rl-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "An MDP is the tuple $(\\mathcal{S},\\mathcal{A},p,\\gamma)$ with dynamics $p(s',r\\mid s,a)$. What role does the discount factor $\\gamma\\in[0,1)$ play in the return $G_t=\\sum_{k\\ge0}\\gamma^k r_{t+k+1}$?",
    options: [
      "It discounts future rewards, weighting nearer rewards more heavily",
      "It is the probability of transitioning to the next state",
      "It is the learning rate of the value update",
      "It sets the exploration rate of the policy"
    ],
    answer: 0,
    explanation: "In the return $G_t=\\sum_{k\\ge0}\\gamma^k r_{t+k+1}$, the factor $\\gamma\\in[0,1)$ discounts the future: a reward $k$ steps away is scaled by $\\gamma^k$. The return also satisfies the recursion $G_t=r_{t+1}+\\gamma G_{t+1}$.",
    ref: "MDPs, returns & value functions"
  },
  {
    id: "rl-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "An agent receives a reward of $+1$ on every step forever, with discount $\\gamma=0.9$. Using $G_t=\\sum_{k\\ge0}\\gamma^k r_{t+k+1}$, what is the return $G_t$?",
    answer: 10, tolerance: 0.01, unit: "",
    hint: "A constant reward of 1 gives the geometric sum $\\sum_{k\\ge0}\\gamma^k=1/(1-\\gamma)$.",
    explanation: "With every reward equal to 1, $G_t=\\sum_{k\\ge0}\\gamma^k\\cdot1=\\frac{1}{1-\\gamma}=\\frac{1}{1-0.9}=10$. This infinite-horizon geometric sum converges precisely because $\\gamma\\in[0,1)$.",
    ref: "MDPs, returns & value functions"
  },
  {
    id: "rl-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "Compute the one-step <b>TD error</b> $\\delta_t=r_{t+1}+\\gamma V(s_{t+1})-V(s_t)$ for $r_{t+1}=2$, $\\gamma=0.5$, $V(s_{t+1})=8$, and $V(s_t)=6$.",
    answer: 0, tolerance: 0.001, unit: "",
    hint: "Substitute directly into $\\delta_t=r_{t+1}+\\gamma V(s_{t+1})-V(s_t)$.",
    explanation: "$\\delta_t=2+0.5\\cdot8-6=2+4-6=0$. A zero TD error means the current estimate $V(s_t)$ already matches the bootstrapped target $r_{t+1}+\\gamma V(s_{t+1})$, so no update is made. TD learning is the central idea: MC's sampling plus DP's bootstrapping, learning online from $\\delta_t$.",
    ref: "Tabular solution methods (TD error)"
  },
  {
    id: "rl-5", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "How does the <b>Bellman optimality</b> equation for $v_*$ differ from the <b>Bellman expectation</b> equation for $v_\\pi$?",
    options: [
      "A $\\max_a$ over actions replaces the policy-average $\\sum_a\\pi(a\\mid s)$",
      "It drops the discount factor $\\gamma$",
      "It replaces the reward $r$ with the return $G_t$",
      "It requires the environment dynamics $p$ to be unknown"
    ],
    answer: 0,
    explanation: "The expectation equation averages over the policy, $v_\\pi(s)=\\sum_a\\pi(a\\mid s)\\sum_{s',r}p(s',r\\mid s,a)[r+\\gamma v_\\pi(s')]$. The optimality equation instead takes a maximum: $v_*(s)=\\max_a\\sum_{s',r}p(s',r\\mid s,a)[r+\\gamma v_*(s')]$ — a $\\max$ replaces the policy-average. Given $q_*$, the optimal policy is greedy: $\\pi_*(s)=\\arg\\max_a q_*(s,a)$.",
    ref: "MDPs, returns & value functions"
  },
  {
    id: "rl-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "In the DP / MC / TD table, the methods differ on whether they need a <b>model</b> and whether they <b>bootstrap</b>. Select every statement that is correct per the source.",
    options: [
      "Dynamic programming requires a model and bootstraps",
      "Monte Carlo needs no model and does not bootstrap (it uses the full-episode return)",
      "Temporal-difference needs no model but does bootstrap (one-step, sampled)",
      "Monte Carlo bootstraps one step like TD",
      "Temporal-difference requires a model like dynamic programming"
    ],
    answer: [0, 1, 2],
    explanation: "DP: model = yes, bootstrap = yes, full/expected backups. MC: model = no, bootstrap = no, sample full-episode return. TD: model = no, bootstrap = yes, sample one-step. MC does <i>not</i> bootstrap, and TD needs <i>no</i> model — so the last two options are false. All are forms of generalized policy iteration (GPI).",
    ref: "Tabular solution methods"
  },
  {
    id: "rl-7", type: "mc", framing: "applied", difficulty: 3,
    prompt: "<b>Sarsa</b> and <b>Q-learning</b> are both TD control methods. Which contrast is correct?",
    options: [
      "Sarsa (on-policy) targets $r+\\gamma Q(s',a')$ using the action actually taken; Q-learning (off-policy) targets $r+\\gamma\\max_{a'}Q(s',a')$",
      "Sarsa uses a $\\max$ over actions; Q-learning uses the action actually taken",
      "Both are off-policy and both learn $q_*$ regardless of the behavior policy",
      "Sarsa needs a model of $p(s',r\\mid s,a)$; Q-learning does not"
    ],
    answer: 0,
    explanation: "Sarsa is on-policy with target $r+\\gamma Q(s',a')$ — the action actually taken — so it learns <i>safe</i> behavior. Q-learning is off-policy with target $r+\\gamma\\max_{a'}Q(s',a')$, learning $q_*$ regardless of the behavior policy. Expected Sarsa averages over $a'$.",
    ref: "Tabular solution methods (Sarsa vs Q-learning)"
  },
  {
    id: "rl-8", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "Across the TD-MC spectrum, the <b>n-step return</b> $G_{t:t+n}=r_{t+1}+\\cdots+\\gamma^{n-1}r_{t+n}+\\gamma^n V(s_{t+n})$ interpolates between two extremes. Which identification is correct?",
    options: [
      "$n{=}1$ is TD(0); $n{\\to}\\infty$ is Monte Carlo",
      "$n{=}1$ is Monte Carlo; $n{\\to}\\infty$ is TD(0)",
      "$n{=}1$ is dynamic programming; $n{\\to}\\infty$ is Sarsa",
      "Every finite $n$ gives the same estimate as $n{=}1$"
    ],
    answer: 0,
    explanation: "The n-step return bootstraps after $n$ real rewards: $n{=}1$ is TD(0), and $n{\\to}\\infty$ (no bootstrapping) is Monte Carlo; intermediate $n$ usually wins. Eligibility traces / TD($\\lambda$) achieve the same continuum online and cheaply via the $\\lambda$-return and a decaying trace.",
    ref: "The TD↔MC spectrum (n-step & eligibility traces)"
  },
  {
    id: "rl-9", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "The <b>deadly triad</b> names three ingredients whose combination can make value estimates diverge. Select the three ingredients.",
    options: [
      "Function approximation",
      "Bootstrapping",
      "Off-policy training",
      "On-policy Monte Carlo sampling",
      "Tabular representation"
    ],
    answer: [0, 1, 2],
    explanation: "The deadly triad is function approximation + bootstrapping + off-policy training; together they can diverge (Baird's counterexample sends weights to infinity even with linear features and exact expected updates), but any <i>two</i> of the three is safe. On-policy MC and tabular representation are not part of the triad — they are precisely what makes things safe.",
    ref: "Function approximation & the deadly triad"
  },
  {
    id: "rl-10", type: "qc", framing: "applied", difficulty: 5,
    prompt: "On the policy-gradient bias-variance ladder, compare two advantage estimators used in place of $q_\\pi$. <b>Quantity A:</b> the variance of plain <b>REINFORCE</b> (Monte Carlo return $G_t$). <b>Quantity B:</b> the variance of an <b>actor-critic</b> update using the bootstrapped TD error $\\delta_t$.",
    quantityA: "Variance of plain REINFORCE (uses $G_t$)",
    quantityB: "Variance of actor-critic (uses bootstrapped $\\delta_t$)",
    answer: 0,
    explanation: "REINFORCE plugs in the Monte Carlo return $G_t$ — unbiased but high variance. Actor-critic replaces $G_t$ with the bootstrapped TD error $\\delta_t=r+\\gamma\\hat v(s')-\\hat v(s)$ as the advantage — biased but low variance. So Quantity A (REINFORCE's variance) is the greater. The policy-gradient theorem itself needs no model and no derivative of the state distribution.",
    ref: "Policy-gradient methods (bias–variance ladder)"
  }
];
