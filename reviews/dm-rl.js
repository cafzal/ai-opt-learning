/* Review: Reinforcement Learning & Policy Optimization */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["dm-rl"] = {
  intro: "When the model is unknown, you learn to act from interaction. This batch runs the full arc: optimize a policy's parameters directly (gradient-free search, then the log-derivative policy gradient), step safely with natural-gradient/TRPO/PPO, lower the variance with a critic, balance exploration against exploitation, learn a model and plan or skip the model and learn $Q$ — and, when only an expert is available, imitate. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Policy search: optimize the policy's parameters directly",
      tag: "core",
      body: "<p>The most direct idea in RL: parameterize a policy $\\pi_\\theta$ and optimize its parameters against the expected return $U(\\theta)=\\mathbb{E}_\\tau[R(\\tau)]$, estimated from rollouts as $U(\\theta)\\approx\\frac1m\\sum_i R(\\tau^{(i)})$ (Monte-Carlo policy evaluation).</p><p><b>Gradient-free policy search</b> needs no derivative of the (often black-box) return — just the ability to roll out and score: <b>local search / genetic algorithms</b>, the <b>cross-entropy method</b> (fit a search distribution to the elite samples), and <b>evolution strategies / CMA-ES</b> (perturb $\\theta$ and follow a score-weighted average, justified by the log-derivative trick). These are simply general-purpose optimizers pointed at the policy-return objective, and they scale to neural-network policies (e.g., Atari).</p>",
      example: "To train a small neural-network controller for a game, the cross-entropy method samples many parameter vectors, keeps the top-scoring 'elite' rollouts, refits a Gaussian over $\\theta$ to them, and repeats — no gradient of the game's reward ever required.",
      takeaway: "When the return is a black box or non-differentiable, reach for gradient-free policy search first — it only needs rollouts, and CMA-ES is a strong default for modest parameter counts."
    },
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
      example: "PPO is the workhorse of modern deep RL precisely because of this clip: it gets most of TRPO's stability (no catastrophic policy jumps) with the simplicity of first-order gradient ascent on minibatches of reused trajectories.",
      takeaway: "Reach for PPO as your default policy-gradient algorithm — it is stable, sample-reusing, and needs little tuning, which is why it underpins RLHF."
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
      example: "AlphaZero's actor proposes move probabilities and its critic predicts who wins; MCTS uses both to search, and the sharpened search statistics become the next training targets — an actor-critic loop wrapped around a tree search.",
      takeaway: "Add a critic when high-variance returns stall learning; tune GAE's $\\lambda$ to dial the bias-variance tradeoff for your reward sparsity and horizon."
    },
    {
      title: "Policy validation: trust it before you deploy it",
      tag: "practice",
      body: "<p>Before a learned policy controls anything real, validate it in simulation. <b>Performance metrics</b> $f(\\pi)=\\mathbb{E}_\\tau[f_{\\text{traj}}(\\tau)]$ are estimated by sampling rollouts, reported with a standard error and 95% confidence interval — and for small failure probabilities the <i>relative</i> standard error is what matters.</p><ul><li><b>Rare-event simulation:</b> naive Monte-Carlo wastes samples when failures are rare, so use <b>importance sampling</b> biased toward failure-prone trajectories.</li><li><b>Robustness analysis:</b> stress-test on a higher-fidelity <i>evaluation model</i>; <b>robust dynamic programming</b> plans against the worst case, $U_{k+1}(s)=\\max_a\\min_i(R_i+\\gamma\\sum_{s'}T_i U_k)$.</li><li><b>Adversarial analysis:</b> an adversary picks next states to minimize return while maximizing trajectory likelihood (reward $-R+\\lambda\\log T$, a search problem), surfacing the <b>most-likely failure</b>. Then change the action space, reward, transition model, or solver — or decide not to deploy.</li></ul>",
      example: "For a collision-avoidance policy, importance sampling concentrates rollouts on near-miss geometries to pin down a tiny crash probability with a tight confidence interval, while adversarial search hunts the single most-likely failure trajectory so engineers can see exactly how the policy breaks.",
      takeaway: "Treat validation as a gate, not an afterthought — quantify rare-failure risk with importance sampling and find the worst case adversarially before a policy ever touches the real world."
    },
    {
      title: "Exploration vs exploitation: bandits & UCB",
      tag: "exploration",
      body: "<p>The simplest setting is the <b>multi-armed bandit</b>: each arm $a$ pays 1 with unknown probability $\\theta_a$ — an $h$-step single-state MDP. The dilemma: exploit the arm that looks best, or explore to improve estimates? <b>Optimal</b> exploration solves an MDP over count-belief states by DP, but it is intractable ($O(h^{2n})$), motivating heuristics:</p><ul><li><b>ε-greedy:</b> act greedily, but with probability $\\epsilon$ pick at random (decay $\\epsilon$ over time).</li><li><b>Softmax / Boltzmann:</b> $\\pi(a)\\propto\\exp(\\lambda\\,Q(a))$; $\\lambda\\to0$ uniform, $\\lambda\\to\\infty$ greedy. This exploration <b>temperature</b> ($t\\propto1/\\lambda$) is the <i>same knob</i> as simulated annealing's temperature (Stage 4) and an LLM's sampling temperature (Stage 6): high temperature = explore, low = greedy.</li><li><b>UCB1 (optimism under uncertainty):</b> $\\arg\\max_a Q(a)+c\\sqrt{\\tfrac{\\log N}{N(a)}}$ — the bonus is infinite when $N(a)=0$, so every arm is tried, and it shrinks as an arm is sampled.</li><li><b>Thompson (posterior) sampling:</b> draw $\\theta$ from each arm's posterior and act greedily on the sample — no tuning.</li><li><b>Gittins index:</b> an efficient optimal solution for the infinite-horizon discounted case.</li></ul><p>Exploration pays off precisely because it carries <b>value of information</b> (the Stage 0 / Stage 3 VoI idea): a pull reduces uncertainty that could change later decisions, and VoI is largest exactly where an arm is uncertain. That is <i>why</i> optimism/UCB (bonus on uncertainty) and Thompson sampling (act on the posterior) work — both spend pulls where they could most change the answer.</p>",
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
      example: "Among three arms, A is well-sampled with a tight interval and B is barely tried with a wide one. Even though A's <i>mean</i> is higher, UCB1 picks B because its optimistic upper bound is highest — exploring the uncertain option rather than settling.",
      takeaway: "Without principled exploration you converge prematurely on a falsely-best option; UCB or Thompson sampling beats $\\epsilon$-greedy and needs no schedule tuning."
    },
    {
      title: "Regret: the objective exploration minimizes",
      tag: "exploration",
      body: "<p>What are the exploration heuristics actually optimizing? <b>Cumulative regret</b> is the total reward lost over $T$ steps versus an oracle that always pulls the best arm: $\\text{Regret}(T)=T\\mu^\\star-\\sum_{t=1}^{T}\\mathbb{E}[\\mu_{a_t}]$, where $\\mu^\\star=\\max_a\\mu_a$. It is the <i>single number</i> a bandit algorithm aims to keep small — every pull of a sub-optimal arm adds its gap $\\mu^\\star-\\mu_a$ to the tally.</p><p>The dividing line is how regret <b>grows with $T$</b>:</p><ul><li><b>Linear regret</b> $\\Theta(T)$: a greedy or fixed policy that locks onto the wrong arm keeps paying the same gap forever — it never stops losing.</li><li><b>Sublinear regret</b> (for good algorithms, $O(\\log T)$): UCB and Thompson sampling explore just enough that the rate of new mistakes keeps falling.</li></ul><p>Sublinear regret has a clean consequence: $\\text{Regret}(T)/T\\to0$, so the <b>average reward per step $\\to\\mu^\\star$</b> — the policy becomes asymptotically optimal. Logarithmic is essentially the best achievable (a matching lower bound), which is why \"$O(\\log T)$ regret\" is the gold standard for bandit and exploration methods.</p>",
      example: "Two arms pay $0.6$ and $0.5$. A policy that gets stuck on the worse arm pays the $0.1$ gap every step: regret $\\approx 0.1T$ — at $T=10{,}000$ that is $\\sim1000$ lost reward, and rising. UCB instead pulls the worse arm only $\\sim O(\\log T)$ times, so by $T=10{,}000$ its total regret is on the order of tens, not thousands — and its average reward is already hugging $0.6$.",
      takeaway: "Regret is the yardstick: judge an exploration strategy by whether its regret is sublinear (mistakes thin out, average reward $\\to$ optimal) rather than linear (it loses at a constant rate forever)."
    },
    {
      title: "Model-based RL: learn T and R, then plan",
      tag: "core",
      body: "<p>Learn a model from interaction, then plan with it. <b>Maximum-likelihood models</b> estimate $T(s'\\mid s,a)\\approx N(s,a,s')/N(s,a)$ and $R\\approx\\rho/N$ from visit counts.</p><p><b>Update schemes</b> trade cost against freshness: a full re-solve is expensive; <b>Dyna</b> backs up at visited plus random states; <b>prioritized sweeping</b> keeps a priority queue ordered by predecessor impact ($T\\cdot|\\Delta U|$) so the most consequential updates happen first.</p><p><b>Exploration</b> can be ε-greedy, or <b>R-MAX</b> optimism: assign the maximal value $r_{\\max}/(1-\\gamma)$ to any under-explored $(s,a)$ with count below $m$, so a greedy planner is <i>driven</i> to explore them (PAC-style guarantees).</p><p><b>Bayesian RL</b> keeps a posterior (a Dirichlet per $(s,a)$). The <b>Bayes-adaptive MDP</b> lifts the state to $(s,b)$ where the model is known, with a generalized Bellman equation $U^*(s,b)=\\max_a\\big(R+\\gamma\\sum_{s'}P(s'\\mid s,b,a)\\,U^*(s',\\tau(s,b,a,s'))\\big)$; the continuous belief forces approximation. <b>Posterior sampling</b> instead draws one model, solves it, acts, and updates — no exploration parameters.</p>",
      example: "Prioritized sweeping shines in a sparse-reward maze: when the goal's value finally changes, the update propagates first to the states most likely to be affected (high $T\\cdot|\\Delta U|$ predecessors) rather than sweeping the whole grid uniformly, so credit reaches the start far faster.",
      takeaway: "Choose model-based RL when real interactions are scarce or costly — a learned model lets you plan on simulated experience and slash sample complexity."
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
      example: "On a cliff-walking grid, Q-learning learns the optimal but risky edge path (it assumes greedy follow-through), while Sarsa — accounting for its own ε-random steps — learns a safer path away from the cliff. Same environment, different targets, different policies.",
      takeaway: "Pick Sarsa when exploration mistakes are costly during learning (robots, live systems) and Q-learning when you only care about the final greedy policy."
    },
    {
      title: "Imitation learning: clone, then fix the drift",
      tag: "core",
      body: "<p>When the reward is unknown but an <b>expert's demonstrations</b> are available, learn from them.</p><p><b>Behavioral cloning</b> is plain supervised learning of the expert's action given the state — simple, but it suffers <b>cascading errors</b>: a small mistake moves the agent to states the expert never visited, where its behavior is undefined, compounding the drift. <b>DAgger</b> fixes this by rolling out the <i>current</i> policy, querying the expert on the states actually visited, aggregating those labels, and retraining — so training data covers the agent's own state distribution. <b>SMILe</b> mixes newly trained component policies, decaying the expert's weight as $(1-\\beta)^k$.</p><p><b>Inverse RL</b> instead recovers a reward $R_\\phi=\\phi^\\top\\beta$:</p><ul><li><b>Maximum margin:</b> find a reward under which the expert beats alternatives by matching feature expectations via a QP (underspecified — many rewards fit).</li><li><b>Maximum entropy:</b> prefer the max-entropy trajectory distribution $P_\\phi(\\tau)\\propto\\exp R_\\phi(\\tau)$; do ML on $\\phi$ by gradient ascent with forward DP for visitation frequencies.</li><li><b>GAIL:</b> an adversarial discriminator $C_\\phi$ tries to tell agent from expert while the policy (trained by TRPO) fools it, using surrogate reward $-\\log C_\\phi$.</li></ul>",
      example: "A self-driving policy cloned from human demos drives fine until it drifts slightly toward the shoulder — a state no human demo covers — and has no idea how to recover, so the error snowballs. DAgger asks the expert 'what would you do <i>here</i>?' on exactly those drifted states and folds the answers back into training.",
      takeaway: "Plain behavioral cloning silently fails at deployment via compounding drift; if you can query the expert online, DAgger fixes the distribution mismatch that breaks it."
    }
  ]
};
