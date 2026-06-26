/* Review: Decision Making — Policy Search, RL, POMDPs & Multiagent (optimization fundamentals.md, Book II Ch 10–27 + §S17/S19–S22) */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["dm-rl-pomdp"] = {
  intro: "From optimizing a policy's parameters directly, through model-based and model-free reinforcement learning, to acting under <i>state</i> uncertainty (POMDPs) and alongside <i>other</i> agents. The thread: when you can't enumerate or fully observe the world, estimate a gradient, a value, a belief, or an equilibrium instead. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Policy gradients: estimate it, then step safely",
      tag: "core",
      body: "<p><b>Policy search</b> optimizes the parameters of $\\pi_\\theta$ directly against the return $U(\\theta)=\\mathbb{E}_\\tau[R(\\tau)]$. The <b>likelihood-ratio (log-derivative) policy gradient</b> rewrites the gradient of an expectation as an expectation you can sample from rollouts:</p><p>$\\nabla U(\\theta)=\\mathbb{E}_\\tau[\\nabla_\\theta\\log p_\\theta(\\tau)\\,R(\\tau)]$, with $\\nabla_\\theta\\log p_\\theta(\\tau)=\\sum_k\\nabla_\\theta\\log\\pi_\\theta(a^{(k)}\\mid s^{(k)})$ — the transition model cancels, so it is <b>model-free</b> for stochastic policies.</p><p>The catch is <b>variance</b>. <b>Reward-to-go</b> credits each action only with reward that followed it (approximating $Q_\\theta$); a subtracted <b>baseline</b> stays unbiased because $\\mathbb{E}_a[\\nabla\\log\\pi_\\theta]=0$. Likelihood-ratio + reward-to-go + baseline = <b>REINFORCE</b>. Using $U(s)$ as baseline gives the <b>advantage</b> $A=Q-U$ (TD residual $r+\\gamma U(s')-U(s)$ is an unbiased advantage estimate).</p><p>Then, how big a step? The <b>natural gradient</b> constrains the change in the <i>trajectory distribution</i> via KL using the <b>Fisher information matrix</b> $\\mathbf{F}_\\theta=\\mathbb{E}_\\tau[\\nabla\\log p\\,\\nabla\\log p^\\top]$; the update $\\mathbf{u}=\\mathbf{F}_\\theta^{-1}\\nabla U$ is scale-invariant. <b>TRPO</b> takes that candidate plus a line search on an importance-sampled surrogate $\\frac{\\pi_{\\theta'}}{\\pi_\\theta}Q_\\theta$ under a <b>KL trust region</b> (no extra rollouts). <b>PPO</b> drops the constraint for a <b>clamped surrogate</b> $\\mathbb{E}[\\min(\\frac{\\pi_{\\theta'}}{\\pi_\\theta}A,\\ \\text{clamp}(\\frac{\\pi_{\\theta'}}{\\pi_\\theta},1-\\epsilon,1+\\epsilon)A)]$, typically $\\epsilon=0.2$, so trajectories reuse safely with plain gradient ascent.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">PPO clamped surrogate (advantage A &gt; 0)</text>
        <line x1="60" y1="40" x2="60" y2="180" class="vx-axis" stroke-width="1.5"/>
        <line x1="60" y1="150" x2="500" y2="150" class="vx-axis" stroke-width="1.5"/>
        <text x="280" y="210" text-anchor="middle" font-size="11">policy ratio  π_θ′ / π_θ</text>
        <text x="24" y="100" font-size="11" transform="rotate(-90 24 100)" text-anchor="middle">objective</text>
        <line x1="200" y1="40" x2="200" y2="155" stroke-dasharray="4 4" class="vx-grid"/>
        <line x1="360" y1="40" x2="360" y2="155" stroke-dasharray="4 4" class="vx-grid"/>
        <text x="200" y="168" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">1−ε</text>
        <text x="280" y="168" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">1.0</text>
        <text x="360" y="168" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">1+ε</text>
        <path d="M80,150 L360,55 L500,55" fill="none" class="vx-accent" stroke-width="2.5"/>
        <circle cx="360" cy="55" r="4" style="fill:var(--accent)"/>
        <text x="368" y="50" font-size="10.5" style="fill:var(--accent)">clamped flat past 1+ε</text>
        <text x="120" y="110" font-size="10.5" style="fill:var(--text-dim)">rises with the ratio…</text>
      </svg>`,
      caption: "With a positive advantage the objective grows as the new policy favors the action, but the clip flattens it past 1+ε so the step can't run away.",
      example: "PPO is the workhorse of modern deep RL precisely because of this clip: it gets most of TRPO's stability (no catastrophic policy jumps) with the simplicity of first-order gradient ascent on minibatches of reused trajectories."
    },
    {
      title: "Actor-critic: a critic supplies the advantage",
      tag: "core",
      body: "<p>Pure policy gradients use sampled returns; pure value methods learn $Q$. <b>Actor-critic</b> combines them: the <b>actor</b> $\\pi_\\theta$ chooses actions, and the <b>critic</b> (a value/advantage/Q estimate at parameters $\\phi$) tells the actor how good they were, supplying a low-variance gradient signal.</p><ul><li><b>Basic actor-critic:</b> actor follows the advantage $A_\\theta=\\mathbb{E}[r+\\gamma U_\\phi(s')-U_\\phi(s)]$; the critic minimizes $\\tfrac12\\mathbb{E}[(U_\\phi-U^{\\pi_\\theta})^2]$ toward a reward-to-go target. Update the policy more often than the value function.</li><li><b>Generalized advantage estimation (GAE):</b> an exponentially weighted blend of $k$-step advantages, $\\hat A^{\\text{GAE}}=\\mathbb{E}[\\sum_k(\\gamma\\lambda)^{k-1}\\delta_k]$ — $\\lambda=0$ is the high-bias one-step TD residual, $\\lambda=1$ is unbiased but high-variance.</li><li><b>Deterministic policy gradient (DPG):</b> a deterministic continuous-action actor plus critic $Q_\\phi$; $\\nabla U(\\theta)=\\mathbb{E}_s[\\nabla_\\theta\\pi_\\theta(s)\\,\\nabla_a Q_\\phi|_{a=\\pi_\\theta(s)}]$, with Gaussian exploration noise and experience replay.</li><li><b>AlphaZero</b> = actor-critic + <b>MCTS</b>: tree search guided by $\\pi_\\theta,U_\\phi$; train $\\pi_\\theta$ via cross-entropy toward $\\pi_{\\text{MCTS}}(a\\mid s)\\propto N(s,a)^\\eta$ and the value toward $\\max_a Q$.</li></ul>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <rect x="40" y="70" width="130" height="56" rx="8" class="vx-accent" fill="none" stroke-width="2"/>
        <text x="105" y="94" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--accent)">Actor</text>
        <text x="105" y="113" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">π_θ</text>
        <rect x="350" y="70" width="130" height="56" rx="8" class="vx-good" fill="none" stroke-width="2"/>
        <text x="415" y="94" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--good)">Critic</text>
        <text x="415" y="113" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">U_φ / Q_φ</text>
        <rect x="200" y="20" width="120" height="34" rx="6" class="vx-grid" fill="none" stroke-width="1.5"/>
        <text x="260" y="42" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">Environment</text>
        <line x1="170" y1="86" x2="346" y2="86" class="vx-axis" stroke-width="1.5" marker-end="url(#ac1)"/>
        <text x="258" y="78" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">action a</text>
        <path d="M350,110 C260,140 195,140 170,114" fill="none" class="vx-good" stroke-width="2" marker-end="url(#ac2)"/>
        <text x="258" y="150" text-anchor="middle" font-size="10.5" style="fill:var(--good)">advantage  A = r + γU(s′) − U(s)</text>
        <line x1="170" y1="40" x2="200" y2="40" class="vx-axis" stroke-width="1.2"/>
        <line x1="105" y1="70" x2="105" y2="40" class="vx-axis" stroke-width="1.2"/>
        <line x1="320" y1="40" x2="415" y2="40" class="vx-axis" stroke-width="1.2"/>
        <line x1="415" y1="40" x2="415" y2="70" class="vx-axis" stroke-width="1.2"/>
        <text x="150" y="36" font-size="10" style="fill:var(--text-faint)">s</text>
        <text x="360" y="36" font-size="10" style="fill:var(--text-faint)">r, s′</text>
        <defs>
          <marker id="ac1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--text-dim)"/></marker>
          <marker id="ac2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--good)"/></marker>
        </defs>
      </svg>`,
      caption: "The actor acts; the critic watches the reward and next state, then hands back an advantage that steers the actor's gradient.",
      example: "AlphaZero's actor proposes move probabilities and its critic predicts who wins; MCTS uses both to search, and the sharpened search statistics become the next training targets — an actor-critic loop wrapped around a tree search."
    },
    {
      title: "Exploration vs exploitation: bandits & UCB",
      tag: "exploration",
      body: "<p>The simplest setting is the <b>multi-armed bandit</b>: each arm $a$ pays 1 with unknown probability $\\theta_a$ — an $h$-step single-state MDP. The dilemma: exploit the arm that looks best, or explore to improve estimates? <b>Optimal</b> exploration solves an MDP over count-belief states by DP, but it is intractable ($O(h^{2n})$), motivating heuristics:</p><ul><li><b>ε-greedy:</b> act greedily, but with probability $\\epsilon$ pick at random (decay $\\epsilon$ over time).</li><li><b>Softmax / Boltzmann:</b> $\\pi(a)\\propto\\exp(\\lambda\\,Q(a))$; $\\lambda\\to0$ uniform, $\\lambda\\to\\infty$ greedy.</li><li><b>UCB1 (optimism under uncertainty):</b> $\\arg\\max_a Q(a)+c\\sqrt{\\tfrac{\\log N}{N(a)}}$ — the bonus is infinite when $N(a)=0$, so every arm is tried, and it shrinks as an arm is sampled.</li><li><b>Thompson (posterior) sampling:</b> draw $\\theta$ from each arm's posterior and act greedily on the sample — no tuning.</li><li><b>Gittins index:</b> an efficient optimal solution for the infinite-horizon discounted case.</li></ul>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">UCB1: pick the highest upper bound</text>
        <line x1="60" y1="35" x2="60" y2="190" class="vx-axis" stroke-width="1.5"/>
        <line x1="60" y1="190" x2="500" y2="190" class="vx-axis" stroke-width="1.5"/>
        <text x="22" y="115" font-size="11" transform="rotate(-90 22 115)" text-anchor="middle">value estimate</text>
        <!-- arm A: high mean, tight CI -->
        <line x1="130" y1="80" x2="130" y2="120" class="vx-axis" stroke-width="2"/>
        <line x1="120" y1="80" x2="140" y2="80" class="vx-axis" stroke-width="2"/>
        <line x1="120" y1="120" x2="140" y2="120" class="vx-axis" stroke-width="2"/>
        <circle cx="130" cy="100" r="4" style="fill:var(--text-dim)"/>
        <text x="130" y="208" text-anchor="middle" font-size="11">A</text>
        <!-- arm B: lower mean, wide CI -> highest upper bound -->
        <line x1="250" y1="55" x2="250" y2="150" class="vx-accent" stroke-width="2"/>
        <line x1="240" y1="55" x2="260" y2="55" class="vx-accent" stroke-width="2"/>
        <line x1="240" y1="150" x2="260" y2="150" class="vx-accent" stroke-width="2"/>
        <circle cx="250" cy="115" r="4" style="fill:var(--accent)"/>
        <text x="250" y="208" text-anchor="middle" font-size="11" style="fill:var(--accent)">B</text>
        <!-- arm C: low mean, tight CI -->
        <line x1="370" y1="125" x2="370" y2="160" class="vx-axis" stroke-width="2"/>
        <line x1="360" y1="125" x2="380" y2="125" class="vx-axis" stroke-width="2"/>
        <line x1="360" y1="160" x2="380" y2="160" class="vx-axis" stroke-width="2"/>
        <circle cx="370" cy="142" r="4" style="fill:var(--text-dim)"/>
        <text x="370" y="208" text-anchor="middle" font-size="11">C</text>
        <line x1="60" y1="55" x2="500" y2="55" stroke-dasharray="4 4" class="vx-grid"/>
        <text x="495" y="50" text-anchor="end" font-size="10.5" style="fill:var(--accent)">B's upper bound wins</text>
        <text x="130" y="135" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">known well</text>
        <text x="250" y="167" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">uncertain</text>
      </svg>`,
      caption: "B's mean is below A's, but its wide confidence interval gives it the highest upper bound — so optimism explores it next.",
      example: "Among three arms, A is well-sampled with a tight interval and B is barely tried with a wide one. Even though A's <i>mean</i> is higher, UCB1 picks B because its optimistic upper bound is highest — exploring the uncertain option rather than settling."
    },
    {
      title: "Model-based RL: learn T and R, then plan",
      tag: "core",
      body: "<p>Learn a model from interaction, then plan with it. <b>Maximum-likelihood models</b> estimate $T(s'\\mid s,a)\\approx N(s,a,s')/N(s,a)$ and $R\\approx\\rho/N$ from visit counts.</p><p><b>Update schemes</b> trade cost against freshness: a full re-solve is expensive; <b>Dyna</b> backs up at visited plus random states; <b>prioritized sweeping</b> keeps a priority queue ordered by predecessor impact ($T\\cdot|\\Delta U|$) so the most consequential updates happen first.</p><p><b>Exploration</b> can be ε-greedy, or <b>R-MAX</b> optimism: assign the maximal value $r_{\\max}/(1-\\gamma)$ to any under-explored $(s,a)$ with count below $m$, so a greedy planner is <i>driven</i> to explore them (PAC-style guarantees).</p><p><b>Bayesian RL</b> keeps a posterior (a Dirichlet per $(s,a)$). The <b>Bayes-adaptive MDP</b> lifts the state to $(s,b)$ where the model is known, with a generalized Bellman equation $U^*(s,b)=\\max_a\\big(R+\\gamma\\sum_{s'}P(s'\\mid s,b,a)\\,U^*(s',\\tau(s,b,a,s'))\\big)$; the continuous belief forces approximation. <b>Posterior sampling</b> instead draws one model, solves it, acts, and updates — no exploration parameters.</p>",
      example: "Prioritized sweeping shines in a sparse-reward maze: when the goal's value finally changes, the update propagates first to the states most likely to be affected (high $T\\cdot|\\Delta U|$ predecessors) rather than sweeping the whole grid uniformly, so credit reaches the start far faster."
    },
    {
      title: "Model-free RL: Q-learning, Sarsa & friends",
      tag: "core",
      body: "<p>Skip the model and learn $Q(s,a)$ directly via the <b>incremental mean</b> $\\hat x\\leftarrow\\hat x+\\alpha(x-\\hat x)$ (the bracket is the TD error); convergence needs $\\sum\\alpha=\\infty,\\ \\sum\\alpha^2<\\infty$.</p><ul><li><b>Q-learning (off-policy):</b> $Q\\leftarrow Q+\\alpha\\big(r+\\gamma\\max_{a'}Q(s',a')-Q\\big)$. The $\\max$ introduces an <b>optimism / overestimation bias</b>; <b>double Q-learning</b> corrects it by decoupling action selection from evaluation.</li><li><b>Sarsa (on-policy):</b> uses the action actually taken, $r+\\gamma Q(s',a')$ — it learns the value of the policy it follows, exploration included.</li><li><b>Eligibility traces</b> (Sarsa(λ)/Q(λ)) propagate reward backward with decay $\\lambda$ through a decaying visit count, speeding sparse-reward learning (off-policy + traces can be unstable).</li><li><b>Reward shaping</b> with potential $F$ is policy-invariant <i>iff</i> $F=\\gamma\\Phi(s')-\\Phi(s)$ — a potential difference adds guidance without changing the optimal policy.</li><li><b>Experience replay</b> samples uniform minibatches from a replay buffer, breaking correlation, easing catastrophic forgetting, and improving data efficiency.</li></ul>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12.5" font-weight="700" style="fill:var(--accent)">Q-learning (off-policy)</text>
        <text x="390" y="20" text-anchor="middle" font-size="12.5" font-weight="700" style="fill:var(--good)">Sarsa (on-policy)</text>
        <!-- left: max over next actions -->
        <circle cx="70" cy="60" r="6" style="fill:var(--text-dim)"/>
        <text x="70" y="48" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">s′</text>
        <line x1="74" y1="64" x2="120" y2="100" class="vx-grid" stroke-width="1.5"/>
        <line x1="74" y1="64" x2="120" y2="60" class="vx-accent" stroke-width="2.5"/>
        <line x1="74" y1="64" x2="120" y2="140" class="vx-grid" stroke-width="1.5"/>
        <circle cx="126" cy="60" r="5" style="fill:var(--accent)"/>
        <circle cx="126" cy="100" r="4" style="fill:var(--text-faint)"/>
        <circle cx="126" cy="140" r="4" style="fill:var(--text-faint)"/>
        <text x="200" y="64" font-size="10.5" style="fill:var(--accent)">max a′</text>
        <text x="160" y="160" font-size="10" style="fill:var(--text-dim)">target r + γ·max Q(s′,a′)</text>
        <!-- right: actual next action -->
        <circle cx="330" cy="60" r="6" style="fill:var(--text-dim)"/>
        <text x="330" y="48" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">s′</text>
        <line x1="334" y1="64" x2="380" y2="100" class="vx-grid" stroke-width="1.5"/>
        <line x1="334" y1="64" x2="380" y2="120" class="vx-good" stroke-width="2.5"/>
        <line x1="334" y1="64" x2="380" y2="60" class="vx-grid" stroke-width="1.5"/>
        <circle cx="386" cy="120" r="5" style="fill:var(--good)"/>
        <circle cx="386" cy="100" r="4" style="fill:var(--text-faint)"/>
        <circle cx="386" cy="60" r="4" style="fill:var(--text-faint)"/>
        <text x="430" y="124" font-size="10.5" style="fill:var(--good)">a′ ~ π</text>
        <text x="420" y="160" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">target r + γ·Q(s′,a′)</text>
      </svg>`,
      caption: "Q-learning bootstraps off the best next action (the max → optimism bias); Sarsa bootstraps off the action its policy actually takes.",
      example: "On a cliff-walking grid, Q-learning learns the optimal but risky edge path (it assumes greedy follow-through), while Sarsa — accounting for its own ε-random steps — learns a safer path away from the cliff. Same environment, different targets, different policies."
    },
    {
      title: "Imitation learning: clone, then fix the drift",
      tag: "core",
      body: "<p>When the reward is unknown but an <b>expert's demonstrations</b> are available, learn from them.</p><p><b>Behavioral cloning</b> is plain supervised learning of the expert's action given the state — simple, but it suffers <b>cascading errors</b>: a small mistake moves the agent to states the expert never visited, where its behavior is undefined, compounding the drift. <b>DAgger</b> fixes this by rolling out the <i>current</i> policy, querying the expert on the states actually visited, aggregating those labels, and retraining — so training data covers the agent's own state distribution. <b>SMILe</b> mixes newly trained component policies, decaying the expert's weight as $(1-\\beta)^k$.</p><p><b>Inverse RL</b> instead recovers a reward $R_\\phi=\\phi^\\top\\beta$:</p><ul><li><b>Maximum margin:</b> find a reward under which the expert beats alternatives by matching feature expectations via a QP (underspecified — many rewards fit).</li><li><b>Maximum entropy:</b> prefer the max-entropy trajectory distribution $P_\\phi(\\tau)\\propto\\exp R_\\phi(\\tau)$; do ML on $\\phi$ by gradient ascent with forward DP for visitation frequencies.</li><li><b>GAIL:</b> an adversarial discriminator $C_\\phi$ tries to tell agent from expert while the policy (trained by TRPO) fools it, using surrogate reward $-\\log C_\\phi$.</li></ul>",
      example: "A self-driving policy cloned from human demos drives fine until it drifts slightly toward the shoulder — a state no human demo covers — and has no idea how to recover, so the error snowballs. DAgger asks the expert 'what would you do <i>here</i>?' on exactly those drifted states and folds the answers back into training."
    },
    {
      title: "POMDPs: maintain a belief, then plan over it",
      tag: "pomdp",
      body: "<p>A <b>POMDP</b> $(\\mathcal{S},\\mathcal{A},\\mathcal{O},T,R,O,\\gamma)$ adds <i>state</i> uncertainty: you never see the true state, only observations, so you maintain a <b>belief</b> $b$ (a distribution over states), updated by Bayes — start diffuse to avoid overconfidence. The <b>discrete Bayes filter (exact)</b> is $b'(s')\\propto O(o\\mid a,s')\\sum_s T(s'\\mid s,a)\\,b(s)$: a predict step (push the belief through the dynamics) then an update step (reweight by the observation). The <b>Kalman filter</b> does this in closed form for linear-Gaussian models via the <b>Kalman gain</b> $K=\\Sigma_p O_s^\\top(O_s\\Sigma_p O_s^\\top+\\Sigma_o)^{-1}$; <b>EKF</b> (Jacobian linearization), <b>UKF</b> ($2n+1$ sigma points), and the <b>particle filter</b> (sample/weight/resample, multimodal) extend it.</p><p>Planning treats the POMDP as a continuous-state <b>belief-MDP</b> (reward $R(b,a)=\\sum_s R(s,a)b(s)$, deterministic belief transition per $(a,o)$). A <b>conditional plan</b> is a policy <i>tree</i> — action per node, observation per edge. Each plan $\\pi$ has an <b>alpha vector</b> $\\boldsymbol\\alpha_\\pi$ (expected utility per state), so $U^\\pi(b)=\\boldsymbol\\alpha_\\pi^\\top\\mathbf{b}$ is a hyperplane over belief space, and the optimal value $U^*(\\mathbf{b})=\\max_\\pi\\boldsymbol\\alpha_\\pi^\\top\\mathbf{b}$ is <b>piecewise-linear and convex (PWLC)</b>. <b>Pruning</b> drops alpha vectors best for no belief (a utility-gap LP); value iteration expands $(k{+}1)$-step plans then prunes.</p><p>Exact solving is PSPACE-complete, so we bound it. <b>Upper bounds:</b> <b>QMDP</b> (one alpha vector per action, assuming full observability after step 1 — poor at valuing information gathering) and the <b>fast informed bound</b> (never looser than QMDP). <b>Lower bound:</b> <b>point-based value iteration (PBVI)</b> backs up at selected belief points. Online, search the belief tree with <b>POMCP/DESPOT</b>, using the upper-lower <i>gap</i> to guide search (HSVI/SARSOP).</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Alpha-vector value over a 2-state belief</text>
        <line x1="60" y1="35" x2="60" y2="195" class="vx-axis" stroke-width="1.5"/>
        <line x1="60" y1="195" x2="490" y2="195" class="vx-axis" stroke-width="1.5"/>
        <text x="60" y="213" text-anchor="middle" font-size="10.5">b(s₀)=1</text>
        <text x="490" y="213" text-anchor="middle" font-size="10.5">b(s₁)=1</text>
        <text x="275" y="230" text-anchor="middle" font-size="11">belief  b  (simplex)</text>
        <text x="26" y="115" font-size="11" transform="rotate(-90 26 115)" text-anchor="middle">U(b)</text>
        <!-- three alpha-vector lines (thin); each dominant in one belief region -->
        <line x1="60" y1="98" x2="490" y2="167" class="vx-grid" stroke-width="1.3"/>
        <line x1="60" y1="120" x2="490" y2="120" class="vx-grid" stroke-width="1.3"/>
        <line x1="60" y1="172" x2="490" y2="103" class="vx-grid" stroke-width="1.3"/>
        <!-- upper envelope = max over lines = topmost (min-y) trace, PWLC convex -->
        <path d="M60,98 L196,120 L385,120 L490,103" fill="none" class="vx-accent" stroke-width="3"/>
        <circle cx="196" cy="120" r="3.5" style="fill:var(--accent)"/>
        <circle cx="385" cy="120" r="3.5" style="fill:var(--accent)"/>
        <text x="110" y="92" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">action A best</text>
        <text x="272" y="112" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">action B</text>
        <text x="438" y="95" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">action C</text>
        <text x="290" y="180" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">upper envelope = U*(b), PWLC convex</text>
        <text x="64" y="190" font-size="9.5" style="fill:var(--text-faint)">thin grey = α-vector per plan; bold = their max</text>
      </svg>`,
      caption: "Each conditional plan is a line over the belief simplex; the optimal value is their upper envelope (bold), and which line dominates names the action to take.",
      example: "In the crying-baby POMDP, one alpha vector encodes 'feed', another 'ignore'. When the belief that the baby is hungry is high enough, the feed plan's hyperplane dominates; below that crossover, ignore dominates — the dominating alpha vector tells you both the value and the action."
    },
    {
      title: "Multiagent: games, Nash & equilibria",
      tag: "multiagent",
      body: "<p>Add <i>other</i> agents. A <b>simple (normal-form) game</b> has agents $\\mathcal{I}$, action sets $\\mathcal{A}^i$, and a joint reward $\\mathbf{R}(\\mathbf{a})$, with utility $U^i(\\boldsymbol\\pi)=\\sum_\\mathbf{a}R^i\\prod_j\\pi^j(a^j)$ over pure or mixed strategies.</p><p>Solution concepts: a <b>dominant strategy</b> is a best response against <i>all</i> opponents (rare). A <b>Nash equilibrium</b> has every agent best-responding (no unilateral incentive to deviate) — it <b>always exists</b> for finite action spaces, may require <b>mixed</b> strategies, and computing it is <b>PPAD-complete</b>. A <b>correlated equilibrium</b> uses a single coordinating signal; every Nash is correlated but not conversely, and it is computable by a <b>linear program</b> (the objective — utilitarian / egalitarian / etc. — selects among equilibria).</p><p>Sequential extensions reduce to repeated game-solving. <b>Markov games</b> = MDPs with multiple agents (best response to fixed opponents is itself an MDP; Nash exists; Nash Q-learning bootstraps per-transition equilibria). <b>POMGs</b> add partial observability — <i>no</i> belief updates are possible (recursive reasoning about others), so agents use conditional plans / controllers. A <b>Dec-POMDP</b> is a POMG with one <i>shared</i> reward (fully cooperative); it is <b>NEXP-complete</b>, though factored independence (transition / observation / reward) can drop it to NP- or even P-complete.</p>",
      example: "In the prisoner's dilemma, mutual defection is the unique Nash (each player's best response to the other), even though mutual cooperation pays both more — illustrating why 'no incentive to deviate' is not the same as 'collectively best'. A correlated equilibrium with a trusted signal can do better when one exists."
    },
    {
      title: "Finite-state controllers: a policy with its own memory",
      tag: "pomdp",
      body: "<p>A <b>finite-state controller (FSC)</b> is a POMDP policy that carries its own internal memory instead of maintaining a belief. It is defined by a node set $X$, an <b>action distribution</b> $\\psi(a\\mid x)$ (what to do in each node), and a <b>successor distribution</b> $\\eta(x'\\mid x,a,o)$ (which node to move to after acting and observing).</p><p>It <b>generalizes the conditional plan</b> (a finite policy tree): because transitions can <b>loop</b> and be <b>stochastic</b>, a finite set of nodes can represent an <i>infinite-horizon</i> policy compactly, with <b>bounded memory</b> and <b>no belief maintenance</b> at runtime — you just track which node you're in. Each node $x$ still defines an <b>alpha vector</b> $\\alpha_x(s)=U(x,s)$ (expected utility per state), so you choose the <b>start node</b> by $\\arg\\max_x\\mathbf{b}^\\top\\boldsymbol\\alpha_x$, and the controller is evaluated on the product MDP over $X\\times\\mathcal{S}$.</p><p><b>Construction methods:</b> <b>policy iteration</b> (Hansen — grow/merge nodes); <b>nonlinear programming</b> when the node count is fixed (a quadratically-constrained program, QCLP, jointly optimizing $\\psi$ and $\\eta$); or <b>gradient ascent</b> on the controller parameters.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">A 2-node controller (listen → act)</text>
        <circle cx="150" cy="110" r="40" class="vx-accent" fill="none" stroke-width="2"/>
        <text x="150" y="106" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--accent)">x₀</text>
        <text x="150" y="123" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">listen</text>
        <circle cx="380" cy="110" r="40" class="vx-good" fill="none" stroke-width="2"/>
        <text x="380" y="106" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--good)">x₁</text>
        <text x="380" y="123" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">open door</text>
        <path d="M190,100 C250,80 310,80 345,98" fill="none" class="vx-axis" stroke-width="1.8" marker-end="url(#fsc1)"/>
        <text x="268" y="74" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">obs: confident</text>
        <path d="M112,124 C72,154 100,193 130,145" fill="none" class="vx-axis" stroke-width="1.8" marker-end="url(#fsc2)"/>
        <text x="100" y="185" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">obs: unsure → loop</text>
        <path d="M345,130 C300,165 230,165 175,138" fill="none" class="vx-grid" stroke-width="1.6" marker-end="url(#fsc3)"/>
        <text x="262" y="170" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">after acting → reset</text>
        <defs>
          <marker id="fsc1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--text-dim)"/></marker>
          <marker id="fsc2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--text-dim)"/></marker>
          <marker id="fsc3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--text-faint)"/></marker>
        </defs>
      </svg>`,
      caption: "Two nodes and looping transitions encode an unbounded-horizon policy: stay in 'listen' while observations are ambiguous, jump to 'act' once confident, then reset — no belief vector required at runtime.",
      example: "For the tiger problem, a compact FSC stays in a 'listen' node while the growls remain ambiguous (a self-loop), and only transitions to an 'open-door' node after enough consistent observations build confidence — capturing an infinite-horizon strategy in two nodes, with runtime memory being just 'which node am I in?' rather than a full belief over {tiger-left, tiger-right}."
    }
  ]
};
