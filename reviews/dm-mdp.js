/* Review: Decision Making — Bayesian Networks, Decisions & MDPs */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["dm-mdp"] = {
  intro: "Following Kochenderfer et al.'s <i>Algorithms for Decision Making</i>, an <b>agent</b> runs an observe&ndash;act loop under four kinds of uncertainty (outcome, model, state, interaction). This batch walks the first two parts: <b>probabilistic reasoning</b> &mdash; representing beliefs as Bayesian networks, doing inference, and learning their parameters and structure &mdash; then <b>simple decisions</b> (utility theory) and <b>sequential decisions</b> (MDPs), where the Bellman equations and value/policy iteration take over. Open each toggle, then test yourself below.",
  concepts: [
    {
      title: "Bayesian networks: DAG + chain rule",
      tag: "bayes-net",
      body: "<p>A full joint over $n$ binary variables costs $2^n-1$ parameters. A <b>Bayesian network</b> encodes the same distribution far more cheaply as a <b>directed acyclic graph</b> plus one conditional table per node, $P(X_i\\mid\\text{Pa}(X_i))$. The graph asserts a factorization &mdash; the <b>chain rule for BNs</b>:</p><p style=\"text-align:center\">$P(x_{1:n})=\\prod_i P(x_i\\mid\\text{pa}(x_i))$</p><p>Each node's table needs parameters only for <i>its own parents</i>, so sparse graphs turn an exponential joint into a sum of small tables &mdash; the central <b>parameter savings</b>.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs><marker id="bnar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" style="fill:var(--text-dim)"/></marker></defs>
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">A 4-node network</text>
        <circle cx="120" cy="55" r="22" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="120" y="60" text-anchor="middle" font-size="13" style="fill:var(--text)">B</text>
        <circle cx="260" cy="55" r="22" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="260" y="60" text-anchor="middle" font-size="13" style="fill:var(--text)">E</text>
        <circle cx="190" cy="130" r="22" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="190" y="135" text-anchor="middle" font-size="13" style="fill:var(--text)">A</text>
        <circle cx="190" cy="190" r="0" style="fill:none"/>
        <line x1="135" y1="73" x2="176" y2="113" class="vx-axis" stroke-width="1.8" marker-end="url(#bnar)"/>
        <line x1="245" y1="73" x2="204" y2="113" class="vx-axis" stroke-width="1.8" marker-end="url(#bnar)"/>
        <text x="335" y="60" font-size="11.5" style="fill:var(--text-dim)">P(B), P(E)  : 1 param each</text>
        <text x="335" y="132" font-size="11.5" style="fill:var(--text-dim)">P(A | B,E) : 4 params</text>
        <text x="335" y="168" font-size="11.5" style="fill:var(--text-faint)">6 total  vs  2&#8308;&minus;1 = 15</text>
        <text x="10" y="198" font-size="11" style="fill:var(--text-faint)">joint  =  P(B) &middot; P(E) &middot; P(A | B,E)</text>
      </svg>`,
      caption: "Each node stores only its own conditional table; a sparse DAG shrinks the joint from exponential to a handful of parameters.",
      example: "A burglary/earthquake alarm: B and E are root causes (1 parameter each), and the alarm A depends on both, $P(A\\mid B,E)$ (4 rows). Six numbers describe what the full joint would need 15 for.",
      takeaway: "The factorization is what makes probabilistic modeling tractable at all: without it you'd need exponentially many parameters and exponentially more data to estimate them."
    },
    {
      title: "Conditional independence & d-separation",
      tag: "bayes-net",
      body: "<p>The graph also tells you which variables are <b>conditionally independent</b>, $X\\perp Y\\mid Z$, by reading whether paths are <b>blocked</b> (d-separation). For a path through a middle node:</p><ul><li><b>Chain</b> $X\\to Z\\to Y$ and <b>fork</b> $X\\leftarrow Z\\to Y$ are blocked when $Z$ is observed (in the conditioning set $\\mathcal{C}$).</li><li><b>Collider / v-structure</b> $X\\to Z\\leftarrow Y$ is the opposite: blocked by default, but <i>opened</i> when $Z$ (or any descendant) is observed &mdash; this is <b>explaining away</b>.</li></ul><p>The <b>Markov blanket</b> of a node &mdash; its parents, children, and children's other parents &mdash; renders it independent of everything else.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs><marker id="dsar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" style="fill:var(--text-dim)"/></marker></defs>
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Collider (v-structure): X &rarr; Y &larr; Z</text>
        <circle cx="110" cy="70" r="24" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="110" y="75" text-anchor="middle" font-size="14" style="fill:var(--text)">X</text>
        <circle cx="410" cy="70" r="24" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="410" y="75" text-anchor="middle" font-size="14" style="fill:var(--text)">Z</text>
        <circle cx="260" cy="160" r="24" class="vx-warn" style="fill:var(--bg-elev2)" stroke-width="2.5"/><text x="260" y="165" text-anchor="middle" font-size="14" style="fill:var(--text)">Y</text>
        <line x1="128" y1="88" x2="240" y2="146" class="vx-axis" stroke-width="1.8" marker-end="url(#dsar)"/>
        <line x1="392" y1="88" x2="280" y2="146" class="vx-axis" stroke-width="1.8" marker-end="url(#dsar)"/>
        <text x="110" y="120" text-anchor="middle" font-size="11.5" style="fill:var(--text-dim)">cause</text>
        <text x="410" y="120" text-anchor="middle" font-size="11.5" style="fill:var(--text-dim)">cause</text>
        <text x="260" y="205" text-anchor="middle" font-size="11.5" style="fill:var(--warn)">observe Y &rArr; X and Z become dependent</text>
        <text x="10" y="225" font-size="10.5" style="fill:var(--text-faint)">unobserved Y: X &#8869; Z  &middot;  observed Y: path opens (explaining away)</text>
      </svg>`,
      caption: "At a collider the rule flips: an unobserved Y keeps the two causes independent; observing Y (or its descendant) makes them compete to explain it.",
      example: "Burglary and earthquake both trip the alarm but are independent &mdash; until the alarm sounds. Learning the alarm went off, then hearing an earthquake on the radio, <i>lowers</i> your belief in a burglary: the quake has <b>explained away</b> the alarm.",
      takeaway: "Knowing which variables are independent lets you drop irrelevant evidence and shrink inference; the Markov blanket tells you exactly the minimal set you must condition on."
    },
    {
      title: "Inference: exact vs approximate",
      tag: "bayes-net",
      body: "<p>Inference computes a posterior over query variables given evidence. <b>Exact</b> methods manipulate factors:</p><ul><li><b>Variable elimination</b> (sum-product): marginalize variables out early to keep intermediate factors small &mdash; linear for many nets, exponential worst case; the optimal elimination order is itself NP-hard.</li><li><b>Belief propagation</b>: exact on trees; junction-tree or loopy BP otherwise.</li></ul><p>General BN inference is <b>NP-hard</b> (reduction from 3SAT), so we fall back on <b>sampling</b>: <i>direct</i> (sample in topological order &mdash; wasteful when evidence is rare), <i>likelihood-weighted</i> (clamp the evidence and weight each sample by the observed nodes' probabilities), and <b>Gibbs sampling</b> (MCMC: resample each variable from its Markov-blanket conditional; samples are correlated but converge, with burn-in and thinning).</p>",
      example: "To get $P(\\text{Burglary}\\mid \\text{JohnCalls}=\\text{true})$ in a small alarm net, variable elimination sums out the unqueried nodes exactly. In a large, densely connected net you instead run likelihood-weighted or Gibbs sampling and read the posterior off the (weighted) sample frequencies.",
      takeaway: "Because exact inference is NP-hard, knowing when to switch to sampling is the difference between an answer in seconds and a query that never returns on a big network."
    },
    {
      title: "Parameter learning: counts, priors & EM",
      tag: "bayes-net",
      body: "<p>Given the structure, fit the conditional tables. <b>Maximum likelihood</b> is just normalized counts: for a BN, $\\hat\\theta_{ijk}=m_{ijk}/\\sum_{k'}m_{ijk'}$ (this configuration's count over its parent-instantiation total). MLE breaks on <b>sparse data</b>: a zero count declares an outcome <i>impossible</i>, and a parent configuration never seen gives $0/0$ (NaN).</p><p>The fix is a <b>Bayesian prior</b> &mdash; conjugate <b>Beta</b> (binary) or <b>Dirichlet</b> (categorical) <b>pseudocounts</b> added to the data, so posterior = prior family with counts added: $\\text{Beta}(\\alpha+n,\\beta+m-n)$. For <b>missing or latent</b> variables, <b>Expectation&ndash;Maximization</b> alternates an E-step (infer the completion distribution, weight the counts) and an M-step (ML/MAP on the weighted data); it handles latent structure like Gaussian mixtures but only reaches local optima, so use restarts.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Pseudocounts rescue sparse data</text>
        <text x="130" y="48" text-anchor="middle" font-size="12" style="fill:var(--bad)">MLE only</text>
        <text x="390" y="48" text-anchor="middle" font-size="12" style="fill:var(--good)">+ Dirichlet prior</text>
        <text x="20" y="90" font-size="11.5" style="fill:var(--text-dim)">counts (0, 0, 3)</text>
        <rect x="20" y="100" width="0" height="20" rx="3" style="fill:var(--bad)"/>
        <rect x="20" y="125" width="0" height="20" rx="3" style="fill:var(--bad)"/>
        <rect x="20" y="150" width="220" height="20" rx="3" style="fill:var(--bad)"/>
        <text x="20" y="140" font-size="11" style="fill:var(--bad)">0 / 0  &rarr;  NaN, "impossible"</text>
        <text x="290" y="90" font-size="11.5" style="fill:var(--text-dim)">+1 each &rarr; (1, 1, 4)</text>
        <rect x="290" y="100" width="35" height="20" rx="3" style="fill:var(--good)"/>
        <rect x="290" y="125" width="35" height="20" rx="3" style="fill:var(--good)"/>
        <rect x="290" y="150" width="140" height="20" rx="3" style="fill:var(--good)"/>
        <text x="335" y="115" font-size="10.5" style="fill:var(--text-faint)">0.17</text>
        <text x="335" y="140" font-size="10.5" style="fill:var(--text-faint)">0.17</text>
        <text x="440" y="165" font-size="10.5" style="fill:var(--text-faint)">0.67</text>
      </svg>`,
      caption: "Raw counts of (0,0,3) make two outcomes impossible; adding one pseudocount each yields well-defined, nonzero probabilities that wash out as data grows.",
      example: "If a die never landed on 1 or 2 in 3 rolls, MLE assigns them probability 0. A $\\text{Dir}(1,1,1,1,1,1)$ prior turns counts $(0,0,3,0,0,0)$ into a sane posterior; the prior's influence fades as more rolls arrive.",
      takeaway: "Pseudocounts are the cheap insurance that keeps an unseen event from being declared impossible &mdash; a single zero can otherwise zero out an entire downstream probability."
    },
    {
      title: "Structure learning: score, fit vs complexity",
      tag: "bayes-net",
      body: "<p>When the graph itself is unknown, <b>structure learning</b> searches for the DAG maximizing a <b>Bayesian score</b>. Integrating out the parameters $\\theta$ yields a sum of log-Gamma terms that <i>automatically</i> trades data fit against model complexity &mdash; simpler graphs win when data is scarce, so no separate regularizer is needed.</p><p>The catch: structure learning is <b>NP-hard</b> and the space of DAGs is super-exponential. So we use heuristic search &mdash; <b>K2</b> (given a variable ordering, greedily add the best-scoring parent for each node; polynomial), or <b>local / hill-climbing</b> search over add/remove/reverse-edge moves, escaping local optima with simulated annealing, restarts, GA, or tabu. Graphs with the same skeleton and same v-structures are <b>Markov-equivalent</b> (edge directions often unidentifiable).</p>",
      example: "K2 with the ordering [Cause, Effect] checks whether adding Cause as a parent of Effect raises the Bayesian score; if the data supports the dependency it keeps the edge, otherwise it leaves Effect parentless. It will never reverse to [Effect, Cause] within that fixed ordering.",
      takeaway: "The Bayesian score auto-penalizes complexity, so structure learning won't overfit spurious edges on small data &mdash; but Markov equivalence means you can't read causal direction off the learned graph alone."
    },
    {
      title: "Simple decisions: utility & MEU",
      tag: "decision",
      body: "<p>The <b>von Neumann&ndash;Morgenstern axioms</b> (completeness, transitivity, continuity, independence) prove that any rational preference over lotteries can be represented by a real-valued <b>utility</b> $U$, <i>unique up to a positive affine transform</i> ($aU+b$, $a>0$). The utility of a lottery is the expectation $\\sum_i p_i\\,U(S_i)$.</p><p>The organizing principle is <b>maximum expected utility</b>: $a^*=\\arg\\max_a\\sum_{s'}P(s'\\mid a,o)\\,U(s')$. Because money has <b>diminishing marginal utility</b>, $U$ over money is usually <b>concave</b> (risk-averse); linear $U$ is risk-neutral, convex is risk-seeking. <b>Decision networks</b> (influence diagrams) extend a BN with <b>decision</b> (square) and <b>utility</b> (diamond) nodes and are solved by iterating decisions, running inference, and summing utilities.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="55" y1="20" x2="55" y2="180" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="180" x2="495" y2="180" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="208" text-anchor="middle" font-size="12">money &rarr;</text>
        <text x="22" y="100" font-size="12" transform="rotate(-90 22 100)" text-anchor="middle">utility</text>
        <path d="M60,168 C160,80 300,52 490,40" fill="none" class="vx-good" stroke-width="2.5"/>
        <line x1="60" y1="172" x2="490" y2="48" class="vx-grid" stroke-width="1.6" stroke-dasharray="4 4"/>
        <path d="M60,176 C260,168 380,120 490,40" fill="none" class="vx-bad" stroke-width="2.5"/>
        <text x="430" y="36" font-size="11" style="fill:var(--good)">concave: risk-averse</text>
        <text x="300" y="120" font-size="11" style="fill:var(--text-dim)">linear: risk-neutral</text>
        <text x="120" y="150" font-size="11" style="fill:var(--bad)">convex: risk-seeking</text>
      </svg>`,
      caption: "Three risk attitudes are three curvatures of utility-of-money: concave prefers a sure thing, convex chases the gamble, linear is indifferent at equal expectation.",
      example: "A concave utility makes a guaranteed \\$50 preferable to a 50/50 shot at \\$0 or \\$100 even though both have expected value \\$50 &mdash; the textbook signature of risk aversion.",
      takeaway: "Optimizing expected value instead of expected utility quietly assumes risk-neutrality; encoding a concave utility is how you make an agent prefer safe outcomes when the stakes are real."
    },
    {
      title: "Value of information",
      tag: "decision",
      body: "<p>Before deciding, is it worth gathering more evidence? The <b>value of information</b> of observing $O'$ is the expected improvement in best-achievable utility:</p><p style=\"text-align:center\">$VOI(O'\\mid o)=\\Big(\\sum_{o'}P(o'\\mid o)\\,EU^*(o,o')\\Big)-EU^*(o)$</p><p>Two properties make it intuitive: <b>$VOI\\ge 0$ always</b> (information never hurts in expectation), and <b>$VOI=0$ exactly when the observation could never change the optimal action</b> &mdash; if you'd pick the same action regardless of what you'd learn, don't bother measuring. VOI <i>ignores the cost</i> of the observation (subtract it separately), and greedy one-at-a-time selection is only a heuristic.</p>",
      example: "A diagnostic test that would change your treatment for some results has positive VOI &mdash; run it (if cheap enough). A test whose every possible result still leaves the same best treatment has $VOI=0$: it's pure waste, no matter how accurate.",
      takeaway: "VOI tells you whether a test, sensor, or survey is worth its cost before you pay for it &mdash; and flags the data you're collecting that could never change your decision."
    },
    {
      title: "MDPs & the Bellman equations",
      tag: "mdp",
      body: "<p>A <b>Markov decision process</b> $(\\mathcal{S},\\mathcal{A},T,R,\\gamma)$ has the Markov property and a <b>discounted return</b> $\\sum_t\\gamma^{t-1}r_t$ (finite for $0\\le\\gamma<1$). Two Bellman equations anchor everything:</p><ul><li><b>Bellman expectation</b> (policy evaluation): $U^\\pi(s)=R(s,\\pi(s))+\\gamma\\sum_{s'}T(s'\\mid s,\\pi(s))\\,U^\\pi(s')$ &mdash; solvable exactly as $\\mathbf{U}^\\pi=(\\mathbf{I}-\\gamma\\mathbf{T}^\\pi)^{-1}\\mathbf{R}^\\pi$.</li><li><b>Bellman optimality</b>: $U^*(s)=\\max_a\\big(R(s,a)+\\gamma\\sum_{s'}T(s'\\mid s,a)\\,U^*(s')\\big)$.</li></ul><p>The <b>action value</b> is $Q(s,a)=R(s,a)+\\gamma\\sum_{s'}T\\,U(s')$, with $U=\\max_a Q$ and <b>advantage</b> $A(s,a)=Q(s,a)-U(s)$.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs><marker id="bkar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" style="fill:var(--text-dim)"/></marker></defs>
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Bellman backup at state s</text>
        <circle cx="70" cy="120" r="24" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="70" y="125" text-anchor="middle" font-size="14" style="fill:var(--text)">s</text>
        <text x="70" y="165" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">max over a</text>
        <line x1="94" y1="110" x2="166" y2="78" class="vx-axis" stroke-width="1.8" marker-end="url(#bkar)"/>
        <line x1="94" y1="130" x2="166" y2="170" class="vx-grid" stroke-width="1.5" marker-end="url(#bkar)"/>
        <text x="125" y="78" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">a&#8321;</text>
        <text x="125" y="185" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">a&#8322;</text>
        <rect x="172" y="62" width="14" height="14" rx="2" style="fill:var(--accent)"/>
        <text x="200" y="74" font-size="11" style="fill:var(--text-dim)">chosen action a&#8321;</text>
        <line x1="186" y1="69" x2="300" y2="50" class="vx-axis" stroke-width="1.6" marker-end="url(#bkar)"/>
        <line x1="186" y1="69" x2="300" y2="120" class="vx-axis" stroke-width="1.6" marker-end="url(#bkar)"/>
        <text x="245" y="40" font-size="10" style="fill:var(--text-faint)">T(s' | s,a)</text>
        <circle cx="320" cy="50" r="20" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="320" y="55" text-anchor="middle" font-size="12" style="fill:var(--text)">s'&#8321;</text>
        <circle cx="320" cy="120" r="20" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="320" y="125" text-anchor="middle" font-size="12" style="fill:var(--text)">s'&#8322;</text>
        <text x="360" y="55" font-size="11" style="fill:var(--good)">r + &gamma;U(s'&#8321;)</text>
        <text x="360" y="125" font-size="11" style="fill:var(--good)">r + &gamma;U(s'&#8322;)</text>
        <text x="10" y="235" font-size="11" style="fill:var(--text-faint)">U(s) = max&#8336; [ R(s,a) + &gamma; &Sigma;&#8347;' T(s' | s,a) U(s') ]</text>
      </svg>`,
      caption: "One backup: pick the action that maximizes immediate reward plus the discounted, transition-weighted value of where you might land.",
      example: "In a grid world, the value of a cell is the best over moves of (reward + $\\gamma$ times the expected value of the next cell). A stochastic 'move north' that lands you north 80% of the time and sideways 20% averages those next-state values inside the backup.",
      takeaway: "Modeling a problem as an MDP is what lets you plan for delayed, stochastic consequences instead of greedily optimizing the next step; $\\gamma$ is the dial trading short- against long-term reward."
    },
    {
      title: "Value & policy iteration; contraction",
      tag: "mdp",
      body: "<p>Two exact dynamic-programming solvers:</p><ul><li><b>Value iteration</b> repeatedly applies the Bellman optimality backup. The backup is a <b>contraction mapping</b>, so by the Banach fixed-point theorem it converges to the unique $U^*$. Terminate on the <b>Bellman residual</b> $\\|U_{k+1}-U_k\\|_\\infty$: a residual $\\delta$ guarantees $\\|U^*-U_k\\|_\\infty\\le\\delta\\gamma/(1-\\gamma)$ &mdash; so $\\gamma$ near $1$ converges slowly.</li><li><b>Policy iteration</b> alternates exact policy evaluation with greedy improvement and converges in <i>finitely many</i> steps (finite policy space).</li></ul><p>There is also an <b>LP form</b>: $\\min_U\\sum_s U(s)$ subject to $U(s)\\ge R(s,a)+\\gamma\\sum_{s'}T\\,U(s')$ for all $s,a$. <b>Asynchronous</b> (Gauss&ndash;Seidel) VI updates states in place.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="55" y1="20" x2="55" y2="170" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="170" x2="495" y2="170" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="198" text-anchor="middle" font-size="12">iteration k &rarr;</text>
        <text x="22" y="95" font-size="12" transform="rotate(-90 22 95)" text-anchor="middle">residual</text>
        <line x1="55" y1="158" x2="495" y2="158" class="vx-grid" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="60" y="153" font-size="10" style="fill:var(--text-faint)">tolerance &delta;</text>
        <path d="M62,38 C120,90 180,128 250,148 C330,160 410,166 488,168" fill="none" class="vx-accent" stroke-width="2.5"/>
        <circle cx="300" cy="156" r="4" style="fill:var(--accent)"/>
        <text x="312" y="150" font-size="11" style="fill:var(--accent)">geometric decay (rate &gamma;)</text>
        <text x="120" y="120" font-size="10.5" style="fill:var(--text-dim)">contraction shrinks error each step</text>
        <text x="10" y="205" font-size="10.5" style="fill:var(--text-faint)">stop when residual &le; &delta;  &rArr;  &#8214;U* &minus; U&#8342;&#8214;&#8734; &le; &delta;&gamma; / (1 &minus; &gamma;)</text>
      </svg>`,
      caption: "Each backup multiplies the error by at most γ, so the Bellman residual decays geometrically toward zero — the contraction guarantee behind value iteration.",
      example: "With $\\gamma=0.9$ and a residual of $\\delta=0.01$, the value estimate is within $0.01\\cdot 0.9/0.1=0.09$ of optimal. Bumping $\\gamma$ to $0.99$ blows that bound up to $0.99$ for the same residual &mdash; far more iterations needed.",
      takeaway: "The contraction bound lets you stop iterating with a provable error guarantee instead of guessing; it also warns that a $\\gamma$ near 1 will cost you far more iterations to converge."
    },
    {
      title: "Exact LQR: the Riccati equation",
      tag: "mdp",
      body: "<p>One MDP family has a closed-form optimal policy: the <b>linear quadratic regulator</b>. With linear dynamics $\\mathbf{s}'=\\mathbf{T}_s\\mathbf{s}+\\mathbf{T}_a\\mathbf{a}+\\mathbf{w}$ and a quadratic reward, the value function stays quadratic and the optimal control is linear in the state:</p><p style=\"text-align:center\">$\\pi_h(\\mathbf{s})=-(\\mathbf{T}_a^\\top\\mathbf{V}_{h-1}\\mathbf{T}_a+\\mathbf{R}_a)^{-1}\\mathbf{T}_a^\\top\\mathbf{V}_{h-1}\\mathbf{T}_s\\,\\mathbf{s}$</p><p>The matrix $\\mathbf{V}$ is propagated backward by the <b>discrete-time Riccati equation</b>. Strikingly, the optimal gain is <b>independent of the disturbance</b> $\\mathbf{w}$: you can plan as if the system were deterministic and act optimally anyway &mdash; <b>certainty equivalence</b>.</p>",
      example: "A cruise controller modeled as LQR computes its feedback gains offline from the Riccati recursion. Because of certainty equivalence, the gains it would use on a perfectly smooth road are exactly the gains it uses on a bumpy one &mdash; the noise statistics don't enter the policy.",
      takeaway: "When your system is roughly linear-quadratic, LQR hands you the exact optimal controller in closed form &mdash; no iteration, no discretization &mdash; so it's the first thing to reach for in continuous control."
    },
    {
      title: "Online planning: receding-horizon search",
      tag: "mdp",
      body: "<p>Instead of solving the whole MDP, <b>online planning</b> reasons forward from the <i>current</i> state over the small reachable space, acts, and <b>replans</b> (receding horizon &mdash; replanning compensates for shallow depth). The tree-search family:</p><ul><li><b>Rollouts</b>: estimate values by simulating a rollout policy to depth $d$ with a generative model $s'\\sim T(s,a)$.</li><li><b>Forward search</b>: expand all transitions to depth $d$ &mdash; cost $O((|\\mathcal{S}||\\mathcal{A}|)^d)$.</li><li><b>Branch and bound</b>: prune with a lower bound $\\underline U$ and upper bound $\\overline Q$.</li><li><b>Sparse sampling</b>: sample $m$ successors per action &mdash; cost independent of $|\\mathcal{S}|$.</li><li><b>Monte Carlo tree search</b>: run $m$ simulations tracking $Q(s,a),N(s,a)$, selecting actions by <b>UCB</b> $\\;Q(a)+c\\sqrt{\\log N/N(a)}$ (optimism under uncertainty), estimating new nodes by rollout, backing up running means.</li></ul>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs><marker id="mcar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" style="fill:var(--text-dim)"/></marker></defs>
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">MCTS: select &rarr; expand &rarr; rollout &rarr; back up</text>
        <circle cx="260" cy="55" r="18" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="260" y="60" text-anchor="middle" font-size="12" style="fill:var(--text)">s</text>
        <line x1="248" y1="68" x2="175" y2="100" class="vx-accent" stroke-width="2" marker-end="url(#mcar)"/>
        <line x1="272" y1="68" x2="345" y2="100" class="vx-grid" stroke-width="1.5" marker-end="url(#mcar)"/>
        <text x="195" y="88" font-size="10" style="fill:var(--accent)">UCB pick</text>
        <circle cx="160" cy="118" r="16" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <circle cx="355" cy="118" r="16" class="vx-grid" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <line x1="150" y1="131" x2="110" y2="160" class="vx-accent" stroke-width="2" marker-end="url(#mcar)"/>
        <circle cx="100" cy="178" r="14" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/><text x="100" y="182" text-anchor="middle" font-size="10" style="fill:var(--text)">new</text>
        <path d="M100,192 C95,205 92,212 90,222" class="vx-warn" stroke-width="1.6" fill="none" stroke-dasharray="3 3" marker-end="url(#mcar)"/>
        <text x="118" y="208" font-size="10.5" style="fill:var(--warn)">rollout to depth d</text>
        <path d="M118,176 C200,150 200,80 248,62" class="vx-good" stroke-width="1.4" fill="none" stroke-dasharray="2 3" marker-end="url(#mcar)"/>
        <text x="210" y="135" font-size="10" style="fill:var(--good)">back up Q, N</text>
        <text x="10" y="234" font-size="10.5" style="fill:var(--text-faint)">UCB: argmax&#8336; Q(a) + c &radic;(log N / N(a))   &mdash;   infinite bonus when N(a)=0</text>
      </svg>`,
      caption: "Each simulation descends by UCB to a leaf, expands one new node, rolls out to estimate its value, and backs the result up the visited path — repeated m times, then act.",
      example: "A game-playing agent runs thousands of MCTS simulations from the current board: UCB steers them toward promising-but-undertried moves (the $\\sqrt{\\log N/N(a)}$ bonus is infinite for any unvisited move), and after the budget it plays the most-visited child, then repeats next turn.",
      takeaway: "Online planning lets you act in MDPs far too large to solve offline by reasoning only about states reachable from where you are now; replanning each step covers for the shallow search depth."
    },
    {
      title: "Approximate value functions",
      tag: "mdp",
      body: "<p>When the state space is too large for exact DP, replace the tabular $U$ with a parametric <b>$U_\\theta(s)$</b> and run <b>approximate value iteration</b>: apply Bellman backups at a finite set of states $S$, then <code>fit!</code> $U_\\theta$ to those backed-up values and repeat.</p><p><b>Local</b> approximation sets $\\theta$ to stored state values and predicts as a weighted average of neighbors (<i>weights sum to 1</i>): <b>nearest-neighbor</b> (piecewise constant, via kd-trees), <b>kernel smoothing</b> (Gaussian / inverse-distance), <b>linear/multilinear interpolation</b> ($2^d$ surrounding vertices &mdash; blows up with dimension), and <b>simplex interpolation</b> (Freudenthal&ndash;Kuhn: only $d+1$ points, so it scales to high $d$). <b>Global</b> approximation fits one model over all of $S$: <b>linear regression over basis functions</b> (cheap closed-form fit, but fixed bases struggle with complex value geometries), or a <b>neural network</b> (no closed form &mdash; train by gradient descent).</p>",
      example: "For a continuous-state cart-pole, you can't tabulate every state. Lay down a grid of representative states $S$, do a Bellman backup at each, and refit: with multilinear interpolation each query blends its $2^d$ grid corners, but in a 10-D problem $2^{10}=1024$ corners per lookup forces a switch to simplex interpolation (11 points) or a neural-net $U_\\theta$ trained by gradient descent.",
      takeaway: "Function approximation is what scales value iteration past toy problems to continuous, high-dimensional states; the catch is that the curse of dimensionality dictates which approximator stays affordable."
    }
  ]
};
