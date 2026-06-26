/* Review: POMDPs & Multiagent Systems */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["dm-pomdp"] = {
  intro: "Acting under <i>state</i> uncertainty (POMDPs) and alongside <i>other</i> agents. When you cannot see the true world, track a <b>belief</b> with a filter and plan over it with alpha vectors or a controller; when others share your environment, single-agent optimality is the wrong target — solve for an <b>equilibrium</b> instead. The arc runs from one agent that can't observe, to many agents that can't observe each other. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Beliefs & filters: from the true state to a distribution",
      tag: "pomdp",
      body: "<p>A <b>POMDP</b> $(\\mathcal{S},\\mathcal{A},\\mathcal{O},T,R,O,\\gamma)$ adds <i>state</i> uncertainty: you never see the true state, only observations, so you maintain a <b>belief</b> $b$ (a distribution over states), updated by Bayes — start diffuse to avoid overconfidence. The <b>discrete Bayes filter (exact)</b> is $b'(s')\\propto O(o\\mid a,s')\\sum_s T(s'\\mid s,a)\\,b(s)$: a <i>predict</i> step (push the belief through the dynamics) then an <i>update</i> step (reweight by the observation).</p><p>For continuous states the filter family is named by how it handles nonlinearity:</p><ul><li><b>Kalman filter</b> — exact in closed form for linear-Gaussian models via the <b>Kalman gain</b> $K=\\Sigma_p O_s^\\top(O_s\\Sigma_p O_s^\\top+\\Sigma_o)^{-1}$ (predict $\\mu_p,\\Sigma_p$; update $\\mu_b=\\mu_p+K(o-O_s\\mu_p)$).</li><li><b>EKF</b> — linearizes with Jacobians (loses exactness and multimodality).</li><li><b>UKF</b> — derivative-free, propagating $2n+1$ <b>sigma points</b>.</li><li><b>Particle filter</b> — sample / weight / resample with $m$ particles; <i>multimodal</i>, but can suffer <b>particle deprivation</b> (fix with adaptive injection).</li></ul>",
      example: "A robot localizing in a hallway keeps a belief over its pose. With Gaussian motion and sensor noise a Kalman filter suffices; around sharp corners the EKF linearizes; with the 'kidnapped robot' (multiple plausible locations at once) only a particle filter's multimodal belief survives.",
      takeaway: "POMDPs are the right model whenever your agent can't directly observe true state (sensors, hidden intent); pick the filter by your nonlinearity and whether the belief must stay multimodal."
    },
    {
      title: "Belief-state planning: alpha vectors, PWLC & online search",
      tag: "pomdp",
      body: "<p>Planning treats the POMDP as a continuous-state <b>belief-MDP</b> (reward $R(b,a)=\\sum_s R(s,a)b(s)$, deterministic belief transition per $(a,o)$). A <b>conditional plan</b> is a policy <i>tree</i> — action per node, observation per edge. Each plan $\\pi$ has an <b>alpha vector</b> $\\boldsymbol\\alpha_\\pi$ (expected utility per state), so $U^\\pi(b)=\\boldsymbol\\alpha_\\pi^\\top\\mathbf{b}$ is a hyperplane over belief space, and the optimal value $U^*(\\mathbf{b})=\\max_\\pi\\boldsymbol\\alpha_\\pi^\\top\\mathbf{b}$ is <b>piecewise-linear and convex (PWLC)</b>. Act via the dominating alpha vector's action, or by <b>one-step lookahead</b> $\\pi^\\Gamma(b)=\\arg\\max_a[R(b,a)+\\gamma\\sum_o P(o\\mid b,a)U^\\Gamma(\\text{Update}(b,a,o))]$. <b>Pruning</b> drops alpha vectors best for no belief (a utility-gap LP); value iteration expands $(k{+}1)$-step plans then prunes.</p><p>Exact solving is PSPACE-complete, so we bound it. <b>Upper bounds:</b> <b>QMDP</b> (one alpha vector per action, assuming full observability after step 1 — poor at valuing information gathering) and the <b>fast informed bound</b> (never looser than QMDP). <b>Lower bound:</b> <b>point-based value iteration (PBVI)</b> backs up at selected belief points. Online, search the belief tree with <b>POMCP/DESPOT</b>, using the upper-lower <i>gap</i> to guide search (HSVI/SARSOP).</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Alpha-vector value over a 2-state belief</text>
        <line x1="60" y1="35" x2="60" y2="195" class="vx-axis" stroke-width="1.5"/>
        <line x1="60" y1="195" x2="490" y2="195" class="vx-axis" stroke-width="1.5"/>
        <text x="60" y="213" text-anchor="middle" font-size="10.5">b(s₀)=1</text>
        <text x="490" y="213" text-anchor="middle" font-size="10.5">b(s₁)=1</text>
        <text x="275" y="230" text-anchor="middle" font-size="11">belief  b  (simplex)</text>
        <text x="26" y="115" font-size="11" transform="rotate(-90 26 115)" text-anchor="middle">U(b)</text>
        <line x1="60" y1="98" x2="490" y2="167" class="vx-grid" stroke-width="1.3"/>
        <line x1="60" y1="120" x2="490" y2="120" class="vx-grid" stroke-width="1.3"/>
        <line x1="60" y1="172" x2="490" y2="103" class="vx-grid" stroke-width="1.3"/>
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
      example: "In the crying-baby POMDP, one alpha vector encodes 'feed', another 'ignore'. When the belief that the baby is hungry is high enough, the feed plan's hyperplane dominates; below that crossover, ignore dominates — the dominating alpha vector tells you both the value and the action. QMDP would call the feed/ignore decision without crediting the act of <i>listening</i> for more information.",
      takeaway: "Plan with alpha vectors when you can solve offline and need the value everywhere; switch to POMCP/DESPOT online when the belief space is too large to bound, and remember QMDP upper-bounds while PBVI lower-bounds."
    },
    {
      title: "Finite-state controllers: a policy with its own memory",
      tag: "pomdp",
      body: "<p>A <b>finite-state controller (FSC)</b> is a POMDP policy that carries its own internal memory instead of maintaining a belief. It is defined by a node set $X$, an <b>action distribution</b> $\\psi(a\\mid x)$ (what to do in each node), and a <b>successor distribution</b> $\\eta(x'\\mid x,a,o)$ (which node to move to after acting and observing).</p><p>It <b>generalizes the conditional plan</b> (a finite policy tree): because transitions can <b>loop</b> and be <b>stochastic</b>, a finite set of nodes can represent an <i>infinite-horizon</i> policy compactly, with <b>bounded memory</b> and <b>no belief maintenance</b> at runtime — you just track which node you're in. Each node $x$ still defines an <b>alpha vector</b> $\\alpha_x(s)=U(x,s)$ (expected utility per state), so you choose the <b>start node</b> by $\\arg\\max_x\\mathbf{b}^\\top\\boldsymbol\\alpha_x$, and the controller is evaluated on the product MDP over $X\\times\\mathcal{S}$.</p><p><b>Construction methods:</b> <b>policy iteration</b> (Hansen — grow/merge nodes); <b>nonlinear programming</b> when the node count is fixed (a quadratically-constrained program, QCLP, jointly optimizing $\\psi$ and $\\eta$ — the best controller for a memory budget); or <b>gradient ascent</b> on the controller parameters.</p>",
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
      example: "For the tiger problem, a compact FSC stays in a 'listen' node while the growls remain ambiguous (a self-loop), and only transitions to an 'open-door' node after enough consistent observations build confidence — capturing an infinite-horizon strategy in two nodes, with runtime memory being just 'which node am I in?' rather than a full belief over {tiger-left, tiger-right}.",
      takeaway: "Use an FSC to deploy a POMDP policy on memory-constrained hardware — you track one node instead of a full belief vector, with no Bayesian update at runtime."
    },
    {
      title: "Multiagent reasoning: normal-form games & equilibria",
      tag: "multiagent",
      body: "<p>Add <i>other</i> agents. A <b>simple (normal-form) game</b> has agents $\\mathcal{I}$, action sets $\\mathcal{A}^i$, and a joint reward $\\mathbf{R}(\\mathbf{a})$, with utility $U^i(\\boldsymbol\\pi)=\\sum_\\mathbf{a}R^i\\prod_j\\pi^j(a^j)$ over pure or mixed strategies.</p><p>Solution concepts:</p><ul><li><b>Dominant strategy</b> — a best response against <i>all</i> opponents (rare).</li><li><b>Nash equilibrium</b> — every agent best-responds (no unilateral incentive to deviate). It <b>always exists</b> for finite action spaces, may require <b>mixed</b> strategies, and computing it is <b>PPAD-complete</b>.</li><li><b>Correlated equilibrium</b> — a single coordinating signal; every Nash is correlated but not conversely, and it is computable by a <b>linear program</b> (the objective — utilitarian / egalitarian / etc. — selects among equilibria).</li></ul><p><b>Learning/behavioral</b> dynamics approach equilibria iteratively: <b>iterated best response</b> (converges for potential games), <b>hierarchical softmax</b> (depth-of-rationality levels), <b>fictitious play</b> (maximum-likelihood counts of others' actions, then best-respond), and <b>gradient ascent</b> with simplex projection.</p>",
      example: "In the prisoner's dilemma, mutual defection is the unique Nash (each player's best response to the other), even though mutual cooperation pays both more — illustrating why 'no incentive to deviate' is not the same as 'collectively best'. A correlated equilibrium with a trusted signal can do better when one exists.",
      takeaway: "Once other strategic agents share your environment, single-agent optimality is the wrong target — solve for equilibria, since a Nash-stable plan is what no rival will unilaterally undercut, and a correlated-equilibrium LP can coordinate to a better outcome."
    },
    {
      title: "Markov (stochastic) games: best response is an MDP",
      tag: "multiagent",
      body: "<p>A <b>Markov game</b> $(\\gamma,\\mathcal{I},\\mathcal{S},\\mathcal{A},T,R^i)$ is an MDP with multiple agents — the sequential extension of a normal-form game. The key lever: with the other agents' policies $\\boldsymbol\\pi^{-i}$ <b>fixed</b>, agent $i$ faces stationary dynamics and reward, so its <b>best response reduces to solving an ordinary MDP</b>. A <b>Nash equilibrium exists</b> (Fink) and can be found by a nonlinear program (stationary Markov-perfect equilibria).</p><p><b>Learning:</b> <b>fictitious play</b> with state-dependent counts; <b>gradient ascent</b> estimating $Q^i$ by Q-learning (with $\\alpha_t=\\epsilon_t=1/\\sqrt{t}$); and <b>Nash Q-learning</b>, which maintains a joint-action $\\mathbf{Q}(s,\\mathbf{a})$, builds a simple game at each transition, solves its Nash, and bootstraps off that equilibrium value — principled but expensive.</p>",
      example: "In a two-robot gridworld where each wants to reach a goal without collisions, fixing the other robot's policy turns your problem into a plain MDP you can value-iterate. Nash Q-learning instead solves a little equilibrium at every state-transition so neither robot's learned policy can be unilaterally improved.",
      takeaway: "In sequential multiagent problems, exploit that a fixed-opponent best response is just MDP solving; reach for Nash Q-learning when you need equilibrium guarantees and can afford solving a game per update."
    },
    {
      title: "State uncertainty among agents (POMGs)",
      tag: "multiagent",
      body: "<p>A <b>partially observable Markov game (POMG)</b> $(\\gamma,\\mathcal{I},\\mathcal{S},\\mathcal{A},\\mathcal{O},T,O,R^i)$ is the multi-agent POMDP — it generalizes every other model in this batch. Each agent acts on its own local observation $o^i$. Crucially, <b>no belief updates are possible</b> the way they are in a single-agent POMDP: optimal play requires <i>recursive reasoning</i> about what the other agents believe and will do (the I-POMDP regress), so agents instead use <b>conditional plans</b> or <b>finite-state controllers</b>.</p><p><b>Solving:</b> <b>Nash via game conversion</b> — enumerate $d$-step joint plans, build a simple game whose payoffs are plan utilities, and solve its Nash (doubly exponential); or <b>dynamic programming</b> — expand conditional plans and prune those dominated over the joint-belief simplex (a feasibility LP). <b>Communication</b> is modeled by augmenting the action space with observable communication actions.</p>",
      example: "Two scouts exploring a building each see only their own corridor and cannot observe each other. Neither can form a single belief over the world that accounts for the other's private observations, so each commits to a conditional plan; coordinating well may require explicitly adding 'radio' communication actions to the game.",
      takeaway: "When multiple agents each observe only part of the world, drop the idea of a shared belief — plan over conditional plans or controllers, and add explicit communication actions if coordination demands it."
    },
    {
      title: "Collaborative agents (Dec-POMDPs)",
      tag: "multiagent",
      body: "<p>A <b>Dec-POMDP</b> is a POMG with one <i>shared</i> reward — fully cooperative, with local observations only. The goal is to maximize a common objective (not to find an equilibrium), which permits more scalable approximations, but exact solving is <b>NEXP-complete</b> (like a Dec-MDP), strictly harder than a single-agent POMDP's PSPACE-complete.</p><p><b>Factored independence</b> dramatically lowers the bar: with <i>transition + observation + reward</i> independence it is <b>P-complete</b>; with transitions + observations only it is <b>NP-complete</b>; otherwise <b>NEXP-complete</b>. Special structures help too — <b>ND-POMDP</b> (a coordination-graph reward that scales with sparsity) and <b>MMDP/MPOMDP</b> (free communication collapses the agents into one collective belief, recovering ordinary algorithms).</p><p><b>Algorithms:</b> <b>dynamic programming</b> (POMG DP with shared reward → optimal joint policy); <b>iterated best response (JESP)</b> — best-respond one agent at a time; fast and convergent, but only to a single Nash; <b>heuristic search (MBDP)</b> (memory-bounded: keep a fixed number of joint policies, sampling future beliefs); and <b>nonlinear programming</b> for an optimal fixed-size joint controller. With all three independences a factored Dec-MDP decomposes into $|\\mathcal{I}|$ separate MDPs.",
      example: "A team of warehouse robots sharing one throughput reward but each seeing only its local aisle is a Dec-POMDP. Solving it exactly is NEXP-complete, so in practice JESP fixes all-but-one robot's policy, optimizes the remaining one, and rotates — quickly reaching a coordinated (if only locally optimal) joint plan.",
      takeaway: "Model cooperative teams with private observations as Dec-POMDPs, but expect NEXP hardness — lean on factored independence, free-communication collapses (MPOMDP), or JESP-style best-response to make them tractable."
    }
  ]
};
