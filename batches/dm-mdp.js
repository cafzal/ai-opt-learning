/* Batch: Decision Making & MDPs */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["dm-mdp"] = [
  {
    id: "dm-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "A <b>Bayesian network</b> compactly represents a joint distribution as which two ingredients?",
    options: [
      "A directed acyclic graph plus a conditional distribution $P(X_i\\mid\\text{Pa}(X_i))$ at each node",
      "An undirected graph plus a global energy function",
      "A decision tree plus a utility table",
      "A Markov chain plus a stationary distribution"
    ],
    answer: 0,
    explanation: "A Bayesian network is a DAG together with a conditional $P(X_i\\mid\\text{Pa}(X_i))$ for each node. The <b>chain rule</b> $P(x_{1:n})=\\prod_i P(x_i\\mid\\text{pa}(x_i))$ then reconstructs the full joint, giving big parameter savings over the $2^n-1$ entries a flat joint over $n$ binaries would need.",
    ref: "Representation"
  },
  {
    id: "dm-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "An <b>MDP</b> is specified by the tuple $(\\mathcal{S},\\mathcal{A},T,R,\\gamma)$. What property must the dynamics satisfy, and what does $\\gamma$ govern?",
    options: [
      "The Markov property; $\\gamma\\in[0,1)$ discounts the return $\\sum_t\\gamma^{t-1}r_t$",
      "Full observability of rewards; $\\gamma$ is the learning rate",
      "Deterministic transitions; $\\gamma$ is the exploration bonus",
      "Stationary rewards; $\\gamma$ is the number of states"
    ],
    answer: 0,
    explanation: "An MDP $(\\mathcal{S},\\mathcal{A},T,R,\\gamma)$ has the <b>Markov property</b> (the next state depends only on the current state and action). The discount factor $\\gamma$ weights the <b>discounted return</b> $\\sum_t\\gamma^{t-1}r_t$, which is finite for $0\\le\\gamma<1$.",
    ref: "Bellman equations, value & policy iteration"
  },
  {
    id: "dm-3", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "By the <b>von Neumann–Morgenstern</b> axioms, rational preferences imply a utility function $U$. To what extent is $U$ determined, and how is the utility of a lottery computed?",
    options: [
      "Unique up to a positive affine transform; lottery utility is $\\sum_i p_i U(S_i)$",
      "Unique absolutely; lottery utility is $\\max_i U(S_i)$",
      "Unique up to any monotone transform; lottery utility is $\\prod_i U(S_i)$",
      "Determined only by the most likely outcome; lottery utility is $U(S_{\\arg\\max p})$"
    ],
    answer: 0,
    explanation: "The vNM axioms (completeness, transitivity, continuity, independence) yield a real-valued $U$ that is <b>unique up to a positive affine transform</b>. The utility of a lottery is the expectation $\\sum_i p_i U(S_i)$. Risk attitude shows up in the curvature of $U$: concave = risk-averse, linear = neutral, convex = risk-seeking.",
    ref: "Simple Decisions"
  },
  {
    id: "dm-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "A player has won $w=7$ and lost $\\ell=2$ games. Using the uniform-prior <b>win-probability</b> point estimate $\\rho=\\frac{w+1}{w+\\ell+2}$, what is $\\rho$?",
    answer: 0.7273, tolerance: 0.005, unit: "",
    hint: "Plug into $(w+1)/(w+\\ell+2)$.",
    explanation: "$\\rho=\\frac{7+1}{7+2+2}=\\frac{8}{11}\\approx 0.727$. This is the posterior mean of a $\\text{Beta}(\\alpha,\\beta)$ with a uniform prior ($\\alpha=\\beta=1$): the $+1$ and $+2$ are the pseudocounts, which avoid the zero-count degeneracy of plain MLE.",
    ref: "Conjugate Bayesian updates (Beta / Dirichlet)"
  },
  {
    id: "dm-5", type: "mc", framing: "applied", difficulty: 3,
    prompt: "You run <b>direct (forward) sampling</b> on a Bayesian network to estimate a posterior given <i>rare</i> evidence and find almost all samples are discarded. Which technique fixes this by <i>clamping</i> the evidence and weighting samples?",
    options: [
      "Likelihood-weighted sampling",
      "Gibbs sampling from the prior",
      "Variable elimination with a random ordering",
      "Adding more decision nodes"
    ],
    answer: 0,
    explanation: "Direct sampling draws in topological order and is wasteful with rare evidence (most samples disagree with it and are thrown away). <b>Likelihood-weighted sampling</b> clamps the evidence variables to their observed values and weights each sample by the probability of those observations — the special case of importance sampling whose proposal $P'$ clamps evidence.",
    ref: "Inference"
  },
  {
    id: "dm-6", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "One-step <b>Bellman backup</b> for action $a$ in state $s$: $Q(s,a)=R(s,a)+\\gamma\\sum_{s'}T(s'\\mid s,a)\\,U(s')$. Take $R(s,a)=2$, $\\gamma=0.9$, and two successors with $T=0.5,\\,U=10$ and $T=0.5,\\,U=4$. Compute $Q(s,a)$.",
    answer: 8.3, tolerance: 0.05, unit: "",
    hint: "First take the expected next-state value $\\sum_{s'}T\\cdot U$, then add $R$ after scaling by $\\gamma$.",
    explanation: "Expected next-state value $=0.5(10)+0.5(4)=7$. Then $Q=R+\\gamma\\cdot 7=2+0.9(7)=2+6.3=8.3$. This single backup is the atomic operation iterated by value iteration; $U=\\max_a Q$ at convergence.",
    ref: "action value $Q(s,a)$"
  },
  {
    id: "dm-7", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "Select every statement about <b>value of information</b> $VOI(O'\\mid o)$ that the text supports.",
    options: [
      "It is always $\\ge 0$",
      "It equals $0$ if observing $O'$ would never change the optimal action",
      "By itself it ignores the cost of the observation (subtract that separately)",
      "It can be negative when the observation is misleading",
      "It is $\\big(\\sum_{o'}P(o'\\mid o)\\,EU^*(o,o')\\big)-EU^*(o)$"
    ],
    answer: [0, 1, 2, 4],
    explanation: "VOI is the expected gain in utility from observing $O'$: $\\big(\\sum_{o'}P(o'\\mid o)EU^*(o,o')\\big)-EU^*(o)$. It is <b>always nonnegative</b> (more information can never hurt expected utility), and it is exactly $0$ when the observation never changes the optimal action. It ignores the observation's cost, which must be subtracted separately — so it is never negative.",
    ref: "Simple Decisions"
  },
  {
    id: "dm-8", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "Select every statement that correctly describes <b>policy iteration</b> and <b>value iteration</b> for MDPs.",
    options: [
      "Policy iteration alternates policy evaluation with greedy improvement and converges in finitely many steps",
      "Both rely on the Bellman backup being a contraction mapping (Banach fixed point)",
      "Exact policy evaluation can be solved as $\\mathbf{U}^\\pi=(\\mathbf{I}-\\gamma\\mathbf{T}^\\pi)^{-1}\\mathbf{R}^\\pi$",
      "Value iteration converges faster as $\\gamma\\to 1$",
      "Value iteration can use the Bellman residual $\\lVert U_{k+1}-U_k\\rVert_\\infty$ as a termination criterion"
    ],
    answer: [0, 1, 2, 4],
    explanation: "Policy iteration alternates evaluation and greedy improvement and converges in finitely many steps; both methods depend on the backup being a contraction (Banach fixed point). Exact evaluation is the linear solve $(\\mathbf{I}-\\gamma\\mathbf{T}^\\pi)^{-1}\\mathbf{R}^\\pi$, and the Bellman residual is a valid stopping rule. The false claim: $\\gamma$ near $1$ makes value iteration converge <i>slower</i>, not faster.",
    ref: "value & policy iteration, contraction"
  },
  {
    id: "dm-9", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "In <b>Monte Carlo tree search (MCTS)</b>, a new action is selected at a node using <b>UCB1</b>, $\\arg\\max_a Q(a)+c\\sqrt{\\tfrac{\\log N}{N(a)}}$. What does the bonus term accomplish when an action has $N(a)=0$?",
    options: [
      "It is infinite, forcing every untried action to be explored at least once",
      "It is zero, so untried actions are ignored until $Q$ is estimated",
      "It equals $Q(a)$, doubling the value estimate",
      "It decays to make the policy purely greedy immediately"
    ],
    answer: 0,
    explanation: "UCB1 embodies <i>optimism under uncertainty</i>: the exploration bonus $c\\sqrt{\\log N/N(a)}$ is <b>infinite when $N(a)=0$</b>, guaranteeing each action is tried at least once before exploitation dominates. As $N(a)$ grows the bonus shrinks and selection leans on the value estimate $Q(a)$.",
    ref: "Action selection & exploration (UCB1)"
  },
  {
    id: "dm-10", type: "qc", framing: "applied", difficulty: 5,
    prompt: "Value iteration on an MDP with discount $\\gamma=0.9$ terminates when the Bellman residual is $\\delta=0.5$, giving the bound $\\lVert U^*-U_k\\rVert_\\infty\\le\\frac{\\delta\\gamma}{1-\\gamma}$. Compare:",
    quantityA: "The guaranteed upper bound on $\\lVert U^*-U_k\\rVert_\\infty$",
    quantityB: "The Bellman residual $\\delta = 0.5$",
    answer: 0,
    explanation: "The bound is $\\frac{\\delta\\gamma}{1-\\gamma}=\\frac{0.5\\cdot 0.9}{0.1}=\\frac{0.45}{0.1}=4.5$, which is far larger than the residual $0.5$. Because $\\gamma=0.9$ is near $1$, the multiplier $\\gamma/(1-\\gamma)=9$ inflates the residual into a loose bound — the same reason value iteration converges slowly when $\\gamma\\to 1$. So Quantity A $>$ Quantity B.",
    ref: "error bound $\\delta\\gamma/(1-\\gamma)$"
  }
];
