/* Review: Constrained Optimization */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["constrained-opt"] = {
  intro: "Real designs come with limits: budgets, physical laws, safety bounds. This batch covers how to <i>handle</i> constraints (transform them away, add slack, penalize, or stay strictly feasible), the <b>Lagrangian</b> and the four <b>KKT</b> conditions that pin down a constrained optimum, the <b>duality</b> that turns a $\\min$-$\\max$ into a $\\max$-$\\min$ and hands you an optimality certificate, and the algorithm families that exploit all this — dual ascent, primal-dual interior point, and ADMM — ending with the three flagship convex problem classes: <b>LP</b>, <b>QP</b>, and the <b>DCP</b> grammar that lets software verify and solve them for you.",
  concepts: [
    {
      title: "Constraint handling: turning constrained into unconstrained",
      tag: "core",
      body: "<p>The unifying move of Ch 10 is to convert $\\min f(\\mathbf{x})$ s.t. $\\mathbf{g}\\le\\mathbf{0},\\,\\mathbf{h}=\\mathbf{0}$ into something an unconstrained method can chew on. The lighter tools first: <b>transformations</b> re-parameterize so constraints hold automatically — an interval $[a,b]$ via $x=\\tfrac{b+a}{2}+\\tfrac{b-a}{2}\\tfrac{2\\hat x}{1+\\hat x^2}$, or solve an equality out directly; <b>removing affine equalities</b> by an LQ decomposition leaves $n-m$ free variables; <b>slack variables</b> rewrite $g(\\mathbf{x})\\le 0$ as $g(\\mathbf{x})+s=0,\\;s\\ge 0$, trading an inequality for an equality plus a bound.</p><p>When clean transformations aren't available, three heavier methods bake the constraints into the objective:</p><ul><li><b>Penalty methods</b> add a cost for violation — a <i>count</i> penalty, a smooth <b>quadratic</b> $\\rho\\big(\\sum_i\\max(g_i,0)^2+\\sum_j h_j^2\\big)$, or a mix — then drive the weight $\\rho\\to\\infty$. Simple, but ill-conditioned as $\\rho$ grows and only feasible in the limit.</li><li><b>Augmented Lagrangian / method of multipliers</b> adds an <i>explicit</i> multiplier term so a moderate $\\rho$ suffices: iterate the quadratic-penalized objective and update $\\boldsymbol\\lambda\\leftarrow\\boldsymbol\\lambda+\\rho\\,\\mathbf{h}$.</li><li><b>Interior-point / barrier</b> adds a log or inverse barrier that blows up at the boundary, keeping every iterate <b>strictly feasible</b> and approaching the boundary from inside as the barrier weight relaxes.</li></ul>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Barrier vs quadratic penalty at a bound (feasible x &lt; b)</text>
        <line x1="55" y1="180" x2="500" y2="180" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="180" x2="55" y2="36" class="vx-axis" stroke-width="1.5"/>
        <line x1="430" y1="36" x2="430" y2="188" class="vx-bad" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="430" y="200" text-anchor="middle" font-size="11" style="fill:var(--bad)">boundary b</text>
        <text x="120" y="200" text-anchor="middle" font-size="11" style="fill:var(--good)">strictly feasible region</text>
        <path d="M70,178 C150,176 300,170 380,150 C410,140 424,90 429,40" fill="none" class="vx-accent" stroke-width="2.5"/>
        <text x="300" y="120" font-size="11" style="fill:var(--accent)">log barrier → ∞ inside</text>
        <path d="M70,180 L430,180 C470,140 480,90 492,44" fill="none" class="vx-warn" stroke-width="2.5"/>
        <text x="452" y="78" font-size="11" style="fill:var(--warn)" text-anchor="end">quadratic penalty (0 until violated)</text>
        <text x="22" y="110" font-size="12" transform="rotate(-90 22 110)" text-anchor="middle" style="fill:var(--text-dim)">added cost</text>
      </svg>`,
      caption: "The barrier rises before you reach b, so iterates stay inside; a penalty is zero until the constraint is broken, then grows outside.",
      example: "To enforce $x\\ge 0$ cheaply, optimize over $\\hat x$ with $x=\\hat x^2$ (a transform). For a harder $g(\\mathbf{x})\\le 0$, an inverse barrier adds $-\\tfrac{1}{\\rho}\\,\\tfrac{1}{g(\\mathbf{x})}$; as $\\rho$ increases the barrier thins and the minimizer slides toward the true boundary optimum while never leaving the feasible interior.",
      takeaway: "Pick the lightest tool that fits: a transform if one exists, augmented Lagrangian when plain penalties stall on conditioning, and a barrier when every iterate must stay feasible (e.g. physical limits you can't even momentarily violate)."
    },
    {
      title: "The Lagrangian & the four KKT conditions",
      tag: "core",
      body: "<p>Fold the constraints into one function — the <b>Lagrangian</b> $\\mathcal{L}(\\mathbf{x},\\boldsymbol\\mu,\\boldsymbol\\lambda)=f(\\mathbf{x})+\\boldsymbol\\mu^\\top\\mathbf{g}(\\mathbf{x})+\\boldsymbol\\lambda^\\top\\mathbf{h}(\\mathbf{x})$ for $\\min f$ s.t. $\\mathbf{g}\\le\\mathbf{0},\\,\\mathbf{h}=\\mathbf{0}$. The <b>KKT conditions</b> are the first-order <i>necessary</i> conditions for an optimum:</p><ol><li><b>Primal feasibility:</b> $\\mathbf{g}\\le\\mathbf{0},\\ \\mathbf{h}=\\mathbf{0}$.</li><li><b>Dual feasibility:</b> $\\boldsymbol\\mu\\ge\\mathbf{0}$ (inequality multipliers nonnegative).</li><li><b>Complementary slackness:</b> $\\boldsymbol\\mu\\odot\\mathbf{g}=\\mathbf{0}$ — an active constraint ($g=0$) may carry a multiplier; an inactive one ($g<0$) forces its multiplier to $0$.</li><li><b>Stationarity:</b> $\\nabla f+\\sum_i\\mu_i\\nabla g_i+\\sum_j\\lambda_j\\nabla h_j=\\mathbf{0}$ (the $\\lambda_j$ are sign-free).</li></ol><p>With equality constraints only this collapses to $\\nabla f=\\sum_i\\lambda_i\\nabla h_i$. When the problem is <b>convex</b>, KKT is not just necessary but <i>sufficient</i> — a KKT point is a global optimum.</p>",
      example: "Minimizing $f$ subject to $g_1\\le 0$ (tight at the solution) and $g_2\\le 0$ (slack): complementary slackness sets $\\mu_2=0$, so stationarity reads $\\nabla f+\\mu_1\\nabla g_1=\\mathbf{0}$ with $\\mu_1\\ge 0$ — only the active constraint enters.",
      takeaway: "KKT is the checklist a constrained optimum must satisfy and the system solvers actually solve; checking it on a candidate tells you whether you're done or which condition is being violated."
    },
    {
      title: "Complementary-slackness geometry at a constrained optimum",
      tag: "geometry",
      body: "<p>Stationarity has a clean picture: at the optimum the objective's descent direction is exactly blocked by the active constraints. Rearranging stationarity, $-\\nabla f=\\sum_i\\mu_i\\nabla g_i$ with $\\boldsymbol\\mu\\ge\\mathbf{0}$ — the <i>negative</i> objective gradient is a <b>nonnegative combination of the active constraint gradients</b>. You can't decrease $f$ without pushing into an active constraint.</p><p>Complementary slackness is what makes this work: <b>inactive</b> constraints (the iterate sits strictly inside them) have multiplier $0$ and drop out of the sum, so only the constraints you're actually pressed against shape the optimum.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">−∇f as a nonnegative blend of ACTIVE constraint gradients</text>
        <path d="M70,210 L70,70 L300,70" fill="none" class="vx-good" stroke-width="2"/>
        <text x="80" y="62" font-size="11" style="fill:var(--good)">g₁ = 0 (active)</text>
        <line x1="70" y1="70" x2="320" y2="180" class="vx-good" stroke-width="2"/>
        <text x="250" y="150" font-size="11" style="fill:var(--good)">g₂ = 0 (active)</text>
        <circle cx="70" cy="70" r="5" style="fill:var(--accent)"/>
        <text x="40" y="60" font-size="11" style="fill:var(--accent)">x*</text>
        <defs><marker id="cs-ar" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto"><path d="M0,0 L7,3.2 L0,6.4 z" style="fill:var(--accent)"/></marker>
        <marker id="cs-arg" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto"><path d="M0,0 L7,3.2 L0,6.4 z" style="fill:var(--good)"/></marker>
        <marker id="cs-arw" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto"><path d="M0,0 L7,3.2 L0,6.4 z" style="fill:var(--warn)"/></marker></defs>
        <line x1="70" y1="70" x2="150" y2="20" class="vx-accent" stroke-width="2.5" marker-end="url(#cs-ar)"/>
        <text x="155" y="20" font-size="12" style="fill:var(--accent)">−∇f</text>
        <line x1="70" y1="70" x2="70" y2="18" class="vx-good" stroke-width="2" marker-end="url(#cs-arg)"/>
        <text x="58" y="16" font-size="11" style="fill:var(--good)">∇g₁</text>
        <line x1="70" y1="70" x2="128" y2="44" class="vx-good" stroke-width="2" marker-end="url(#cs-arg)"/>
        <text x="132" y="44" font-size="11" style="fill:var(--good)">∇g₂</text>
        <line x1="380" y1="150" x2="450" y2="120" class="vx-warn" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#cs-arw)"/>
        <text x="350" y="170" font-size="11" style="fill:var(--warn)">g₃ &lt; 0 inactive</text>
        <text x="350" y="185" font-size="11" style="fill:var(--warn)">⇒ μ₃ = 0</text>
        <text x="160" y="120" font-size="11" style="fill:var(--text-dim)">−∇f = μ₁∇g₁ + μ₂∇g₂,  μ ≥ 0</text>
      </svg>`,
      caption: "At x* the negative objective gradient lies in the cone spanned by the active gradients; the inactive constraint contributes nothing (μ = 0).",
      example: "On a tight corner where $g_1$ and $g_2$ both hold with equality, $-\\nabla f$ points <i>into</i> the wedge between $\\nabla g_1$ and $\\nabla g_2$; if $-\\nabla f$ fell outside that cone you could still descend along the boundary, so it wouldn't be optimal.",
      takeaway: "This geometry tells you which constraints actually bind, so you can ignore inactive ones and read each active multiplier as the price of tightening that limit."
    },
    {
      title: "Duality: primal min-max vs dual max-min",
      tag: "duality",
      body: "<p>Two views of the same Lagrangian. The <b>primal</b> is $\\min_{\\mathbf{x}}\\max_{\\boldsymbol\\mu\\ge\\mathbf{0},\\boldsymbol\\lambda}\\mathcal{L}$ (the inner $\\max$ punishes any infeasibility to $+\\infty$, recovering the original problem). Swap the order to get the <b>dual</b> $\\max_{\\boldsymbol\\mu\\ge\\mathbf{0},\\boldsymbol\\lambda}\\min_{\\mathbf{x}}\\mathcal{L}$. The inner minimization defines the <b>dual function</b> $\\mathcal{D}(\\boldsymbol\\mu,\\boldsymbol\\lambda)=\\min_{\\mathbf{x}}\\mathcal{L}$, which is <b>concave</b> regardless of whether $f$ or the constraints are convex (it is a pointwise min of affine functions).</p><p><b>Weak duality</b> always holds: $d^*\\le p^*$, so any dual-feasible value is a lower bound on the primal optimum, and the <b>duality gap</b> is $p^*-d^*\\ge 0$. <b>Strong duality</b> — gap $=0$ — holds when the problem is <b>convex</b> and <b>Slater's condition</b> (a strictly feasible point exists) is met. Then a primal/dual feasible pair with <i>equal</i> objective is an optimality <b>certificate</b>.</p><p><b>Duality is sensitivity.</b> The optimal multiplier isn't just bookkeeping — it is the <i>derivative of the optimal value</i> with respect to the constraint. Perturb a constraint's right-hand side, $\\mathbf{h}(\\mathbf{x})=\\mathbf{b}$, and the optimal value $p^\\star(b)$ moves at rate $\\lambda^\\star=\\partial p^\\star/\\partial b$ (the <b>envelope theorem</b>: at the optimum the indirect effect through $\\mathbf{x}^\\star$ vanishes, leaving only the direct effect through the constraint). This $\\partial p^\\star/\\partial b$ is the constraint's <b>shadow price</b> — what you'd pay to relax it by one unit. So duals <i>are</i> the gradients/sensitivities of the optimum: a large $\\lambda^\\star$ flags a constraint that is expensive to bind, a zero $\\lambda^\\star$ a slack one you can ignore (complementary slackness again).</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Weak duality: dual bounds below, primal above</text>
        <line x1="55" y1="180" x2="500" y2="180" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="180" x2="55" y2="36" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="208" text-anchor="middle" font-size="12" style="fill:var(--text-dim)">iterations →</text>
        <path d="M70,60 C170,82 280,104 470,120" fill="none" class="vx-bad" stroke-width="2.5"/>
        <text x="150" y="56" font-size="11" style="fill:var(--bad)">primal value p (decreasing)</text>
        <path d="M70,170 C170,154 280,138 470,124" fill="none" class="vx-good" stroke-width="2.5"/>
        <text x="150" y="172" font-size="11" style="fill:var(--good)">dual value d (increasing)</text>
        <line x1="470" y1="120" x2="470" y2="124" class="vx-grid" stroke-width="1.2"/>
        <text x="486" y="118" font-size="11" style="fill:var(--accent)" text-anchor="end">gap → 0</text>
        <line x1="320" y1="113" x2="320" y2="143" class="vx-warn" stroke-width="2"/>
        <text x="328" y="108" font-size="10.5" style="fill:var(--warn)">gap = p − d</text>
        <text x="60" y="34" font-size="11" style="fill:var(--text-faint)">objective</text>
      </svg>`,
      caption: "The dual is always a lower bound (d* ≤ p*); under convexity + Slater the two bounds meet and the gap closes.",
      example: "If a feasible design gives primal objective $12.0$ and a dual-feasible $(\\boldsymbol\\mu,\\boldsymbol\\lambda)$ gives $\\mathcal{D}=12.0$, the gap is $0$ — you have <i>proof</i> the design is optimal without searching further, even on a problem you can't solve in closed form. And if that constraint's multiplier is $\\lambda^\\star=3$, loosening its budget by one unit lowers the optimal cost by about $3$ — read straight off the dual, no re-solve.",
      takeaway: "Weak duality gives you a free lower bound to certify how close a solution is to optimal; strong duality goes further and hands you each multiplier as a shadow price $\\partial p^\\star/\\partial b$ — the exact marginal value of relaxing that constraint."
    },
    {
      title: "Duality algorithms: dual ascent, primal-dual, ADMM",
      tag: "algorithm",
      body: "<p>Ch 11 turns duality into solvers:</p><ul><li><b>Dual ascent</b> alternates a primal minimization $\\mathbf{x}=\\arg\\min_{\\mathbf{x}}\\mathcal{L}$ with gradient ascent on the duals, $\\boldsymbol\\mu\\leftarrow\\max(\\boldsymbol\\mu+\\alpha\\,\\mathbf{g},\\mathbf{0})$ and $\\boldsymbol\\lambda\\leftarrow\\boldsymbol\\lambda+\\alpha\\,\\mathbf{h}$. It tolerates infeasible iterates but can fail when the objective is linear (the inner min is unbounded or flat).</li><li><b>Primal-dual interior point</b> updates primals and duals together and drives a residual $\\mathbf{r}=\\mathbf{0}$ by Newton; with $m$ inequalities the log-barrier yields a clean <b>duality gap $=m/\\rho$</b>, so you know exactly how far from optimal you are.</li><li><b>ADMM</b> splits a separable objective $\\min f_1(\\mathbf{x}_1)+f_2(\\mathbf{x}_2)$ s.t. $\\mathbf{A}_1\\mathbf{x}_1+\\mathbf{A}_2\\mathbf{x}_2=\\mathbf{b}$: minimize the augmented Lagrangian over $\\mathbf{x}_1$, then $\\mathbf{x}_2$, then update $\\boldsymbol\\lambda$ (scaled form $\\mathbf{u}=\\boldsymbol\\lambda/\\rho$). It scales to large/distributed/consensus problems since only summaries cross between machines.</li></ul>",
      caption: "",
      example: "ADMM with soft-thresholding $S_\\kappa$ powers sparse-recovery workhorses — <b>lasso</b> and <b>basis pursuit</b> — and least-absolute-deviation / Huber fits; the primal-dual interior gap $m/\\rho$ gives a live optimality bound during the solve.",
      takeaway: "Match the solver to the structure: ADMM when the problem splits across machines or has a separable regularizer, primal-dual interior point when you want a reliable, tight gap on a single box."
    },
    {
      title: "Linear programming: optimum at a vertex, and its dual",
      tag: "geometry",
      body: "<p>An <b>LP</b> has a linear objective and linear constraints, so the feasible set is a <b>convex polytope</b>. Because the objective's level sets are parallel hyperplanes, the optimum is always attained at a <b>vertex</b> of the polytope. Forms: general / standard ($\\le$ with $\\mathbf{x}\\ge\\mathbf{0}$) / equality ($\\mathbf{A}\\mathbf{x}=\\mathbf{b},\\,\\mathbf{x}\\ge\\mathbf{0}$ via slack). A vertex is a <b>partition</b> $(\\mathcal{B},\\mathcal{V})$ with $\\mathbf{x}_{\\mathcal{V}}=\\mathbf{0}$ and $\\mathbf{x}_{\\mathcal{B}}=\\mathbf{A}_{\\mathcal{B}}^{-1}\\mathbf{b}$.</p><p>The <b>simplex</b> algorithm walks vertices along edges to the optimum: each step swaps one index (entering chosen by Dantzig's most-negative $\\mu$, or Bland's first-negative rule to break cycles; leaving chosen by the <b>minimum ratio test</b>), stopping when all $\\boldsymbol\\mu_{\\mathcal{V}}\\ge\\mathbf{0}$. The <b>dual LP</b> is $\\max_{\\boldsymbol\\lambda}\\mathbf{b}^\\top\\boldsymbol\\lambda$ s.t. $\\mathbf{A}^\\top\\boldsymbol\\lambda\\le\\mathbf{c}$; a primal-feasible + dual-feasible pair with equal objective certifies optimality (zero gap).</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">LP: parallel objective lines push to a vertex</text>
        <polygon points="120,210 90,120 170,55 300,60 360,150 280,215" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="2"/>
        <text x="200" y="150" text-anchor="middle" font-size="12" style="fill:var(--text-dim)">feasible polytope</text>
        <line x1="176" y1="76" x2="264" y2="180" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 4"/>
        <line x1="216" y1="42" x2="304" y2="146" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 4"/>
        <line x1="256" y1="8" x2="344" y2="112" class="vx-grid" stroke-width="1.1" stroke-dasharray="4 4"/>
        <text x="70" y="232" font-size="10.5" style="fill:var(--text-faint)">objective level lines (cᵀx = const)</text>
        <defs><marker id="lp-ar" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" style="fill:var(--good)"/></marker></defs>
        <line x1="150" y1="200" x2="280" y2="90" class="vx-good" stroke-width="2.5" marker-end="url(#lp-ar)"/>
        <text x="200" y="100" font-size="11" style="fill:var(--good)">decrease cᵀx →</text>
        <circle cx="300" cy="60" r="6" style="fill:var(--good)"/>
        <text x="312" y="56" font-size="12" style="fill:var(--good)">optimum (a vertex)</text>
        <circle cx="170" cy="55" r="3.5" style="fill:var(--text-faint)"/>
        <circle cx="90" cy="120" r="3.5" style="fill:var(--text-faint)"/>
        <circle cx="120" cy="210" r="3.5" style="fill:var(--text-faint)"/>
      </svg>`,
      caption: "Level lines of the linear objective are parallel; sliding them in the descent direction, the last feasible contact is a corner — so simplex only needs to inspect vertices.",
      example: "For a 2-variable LP, the feasible region is a polygon; simplex starts at one corner and hops along edges, lowering $\\mathbf{c}^\\top\\mathbf{x}$ each step, until no neighboring vertex improves — guaranteed optimal because no interior point can beat the best corner.",
      takeaway: "Knowing the optimum is always a vertex is why LP search is finite and tractable, and the dual LP hands you shadow prices that say how much each constraint is worth relaxing."
    },
    {
      title: "Degeneracy & cycling in the simplex method",
      tag: "algorithm",
      body: "<p>The simplex method walks vertices, lowering $\\mathbf{c}^\\top\\mathbf{x}$ each pivot — but one pathology can stall it. A basic feasible solution is <b>degenerate</b> when a basic variable equals zero, which happens geometrically when <b>more than $n$ constraints are active</b> at the same vertex (an over-determined corner). The algebraic symptom is a <b>tie in the minimum-ratio test</b> that picks the leaving variable.</p><p>At a degenerate vertex a pivot can swap the basis while the vertex — and the objective — <b>don't move</b> (a zero-length step). If a sequence of such no-progress pivots returns to a basis it already visited, the method <b>cycles</b>: it loops through bases forever without improving and never terminates.</p><p>Anti-cycling rules guarantee termination. <b>Bland's rule</b> — always choose the lowest-index eligible entering and leaving variable — provably prevents cycling. The <b>lexicographic (perturbation) rule</b> breaks ratio ties by treating each row as lexicographically ordered, equivalent to nudging $\\mathbf{b}$ to make every vertex non-degenerate. Either one ensures simplex finishes in finitely many steps.</p>",
      example: "On a problem where three constraint lines meet at one corner in a 2-variable LP ($>n=2$ active), the minimum-ratio test ties; Dantzig's most-negative pivot rule could cycle among the degenerate bases. Switching the entering/leaving choice to Bland's first-index rule escapes the loop and reaches the optimum.",
      takeaway: "A tie in the ratio test signals a degenerate vertex where simplex can cycle; switch the pivot rule to Bland's (or lexicographic) to guarantee the method terminates."
    },
    {
      title: "Quadratic programming & the transformation chain",
      tag: "algorithm",
      body: "<p>A <b>QP</b> minimizes a quadratic objective subject to linear constraints — equivalently a Newton step <i>subject to</i> linear constraints. If the Hessian $\\mathbf{Q}$ is <b>positive definite</b> the problem is <b>convex</b> (a unique global minimum). The slick result is a chain of equivalences that reduces a QP to a direct linear-algebra solve:</p><p>$\\text{QP}\\;\\to\\;\\text{Least Squares}\\;\\to\\;\\text{Least Distance Problem}\\;\\to\\;\\text{Nonnegative Least Squares}$.</p><p>The <b>Least Distance Problem</b> ($\\min\\|\\mathbf{x}\\|$ s.t. $\\mathbf{G}\\mathbf{x}\\ge\\mathbf{h}$) has a unique solution; <b>NNLS</b> ($\\min\\|\\mathbf{E}\\mathbf{x}-\\mathbf{f}\\|$ s.t. $\\mathbf{x}\\ge\\mathbf{0}$) is always solvable via an active-set method much like simplex. LDP is solved as an NNLS with $\\mathbf{E}=[\\mathbf{G}^\\top;\\mathbf{h}^\\top]$, $\\mathbf{f}=[\\mathbf{0};1]$. The payoff over interior-point: a <b>finite</b> number of constraint relaxations gives hard <b>timing guarantees</b> (useful for real-time control).</p>",
      visual: `<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="22" style="fill:var(--text)" font-size="13" font-weight="700">QP transformation chain → direct solve</text>
        <defs><marker id="qp-ar" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto"><path d="M0,0 L7,3.2 L0,6.4 z" style="fill:var(--accent)"/></marker></defs>
        <rect x="14" y="48" width="108" height="52" rx="6" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.5"/>
        <text x="68" y="72" text-anchor="middle" font-size="12" style="fill:var(--text)">QP</text>
        <text x="68" y="90" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">PD Q ⇒ convex</text>
        <rect x="146" y="48" width="108" height="52" rx="6" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1.2"/>
        <text x="200" y="72" text-anchor="middle" font-size="12" style="fill:var(--text)">Least</text>
        <text x="200" y="88" text-anchor="middle" font-size="12" style="fill:var(--text)">Squares</text>
        <rect x="278" y="48" width="108" height="52" rx="6" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1.2"/>
        <text x="332" y="72" text-anchor="middle" font-size="12" style="fill:var(--text)">Least</text>
        <text x="332" y="88" text-anchor="middle" font-size="12" style="fill:var(--text)">Distance</text>
        <rect x="410" y="48" width="100" height="52" rx="6" style="fill:var(--bg-elev2)" class="vx-good" stroke-width="1.5"/>
        <text x="460" y="72" text-anchor="middle" font-size="12" style="fill:var(--good)">NNLS</text>
        <text x="460" y="88" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">x ≥ 0</text>
        <line x1="122" y1="74" x2="146" y2="74" class="vx-accent" stroke-width="2" marker-end="url(#qp-ar)"/>
        <line x1="254" y1="74" x2="278" y2="74" class="vx-accent" stroke-width="2" marker-end="url(#qp-ar)"/>
        <line x1="386" y1="74" x2="410" y2="74" class="vx-accent" stroke-width="2" marker-end="url(#qp-ar)"/>
        <text x="262" y="142" text-anchor="middle" font-size="11" style="fill:var(--good)">finite constraint relaxations ⇒ timing guarantees</text>
        <text x="262" y="160" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">active-set, simplex-like — vs interior-point iteration counts</text>
      </svg>`,
      caption: "Each arrow is an exact reformulation; the final NNLS is always solvable by an active-set method, giving a bounded, predictable runtime.",
      example: "A model-predictive controller solving the same QP every control cycle uses the NNLS route so each solve finishes within a fixed number of active-set pivots — a worst-case time bound an interior-point method cannot promise.",
      takeaway: "Reducing a QP to NNLS buys a finite, predictable pivot count, which is exactly the hard worst-case timing guarantee real-time control and embedded solvers need."
    },
    {
      title: "Disciplined convex programming: verify, then transcribe",
      tag: "core",
      body: "<p><b>DCP</b> is a discipline for writing a convex program so software can <i>verify</i> it's convex and <i>automatically transcribe</i> it to a solver — you never hand-derive KKT or pick an algorithm.</p><ul><li><b>Verification grammar:</b> each <i>atom</i> in a library carries a curvature (affine / convex / concave), a monotonicity, and a range (extended-real-valued to encode its domain). Curvature propagates by <i>product-free</i>, <i>sign</i>, and <b>composition</b> rules: $f(g(x))$ is convex if [$f$ convex nondecreasing, $g$ convex] or [$f$ convex nonincreasing, $g$ concave] — and the check can come back <i>inconclusive</i>, which is informative.</li><li><b>Canonicalization:</b> <i>linearization</i> (replace a sub-expression with a fresh variable plus an inequality) and <b>graph expansion</b> (epigraph/hypograph tricks, e.g. $|x|\\to\\min y$ s.t. $y\\ge\\pm x$) reshape the program into a <b>partitioned canonical form</b> with a <b>block-diagonal Hessian</b>, so interior-point steps are cheap (an $\\mathbf{L}\\mathbf{D}\\mathbf{L}^\\top$ on the augmented system).</li></ul>",
      caption: "",
      example: "In <i>cvxpy</i> or <i>Convex.jl</i> you declare <code>minimize(norm(A*x - b) + lambda*norm(x,1))</code>; DCP checks each atom's curvature composes to convex, expands the norms via their epigraph forms, and ships the canonical problem to a backend like SCS, ECOS, or OSQP.",
      takeaway: "DCP lets you state a problem and trust software to prove convexity and pick the solver, so a rejected model flags a real modeling bug before you waste time debugging a non-convex solve."
    }
  ]
};
