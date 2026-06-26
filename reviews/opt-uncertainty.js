/* Review: Optimization under Uncertainty, Discrete & MDO */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["opt-uncertainty"] = {
  intro: "When a problem's inputs are uncontrollable, its variables are integer-valued, or its disciplines are coupled, the deterministic toolkit isn't enough. This batch covers four threads: <b>optimization under uncertainty</b> (robustness, risk measures), <b>uncertainty propagation</b> (pushing input distributions through a model), and the structural cases — <b>discrete</b>, <b>multidisciplinary</b>, and <b>expression</b> (genetic-programming) optimization. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Robustness under uncertainty: minimax, info-gap & mean-variance",
      tag: "uncertainty",
      body: "<p>When $f(\\mathbf{x},\\mathbf{z})$ depends on uncontrollable $\\mathbf{z}$, we optimize <i>robustly</i>. Distinguish <b>aleatory</b> (inherent, irreducible) from <b>epistemic</b> (reducible with more data) uncertainty. A key warning: <b>the robust optimum is not the noise-free optimum</b> — a deep but narrow minimum is risky once inputs jitter, so a wider, flatter basin is often preferred.</p><p><b>Set-based</b> approaches need no distribution: <b>minimax</b> $\\min_\\mathbf{x}\\max_{\\mathbf{z}\\in\\mathcal{Z}}f$ protects against the worst case (conservative), while <b>info-gap</b> seeks the design tolerating the largest uncertainty gap $\\epsilon$ while staying feasible (add a performance constraint to avoid over-aversion).</p><p><b>Probabilistic</b> approaches use a distribution over $\\mathbf{z}$: minimize expected value, variance, or the <b>mean-variance</b> blend $\\alpha\\mathbb{E}[y]+(1-\\alpha)\\sqrt{\\text{Var}[y]}$ (the weight $\\alpha$ trades nominal performance against spread). <b>Statistical feasibility</b> $P(\\mathbf{x}\\in\\mathcal{F})$ is <i>maximized</i> — the <b>six-sigma</b> idea of keeping many standard deviations of slack to each constraint so random variation rarely violates one.</p>",
      example: "Two machine settings have the same average yield, but one sits on a steep ridge where small temperature drift tanks the result and the other sits on a broad plateau. The mean-variance objective with a moderate $\\alpha$ — or simply maximizing statistical feasibility — picks the plateau, accepting slightly lower nominal yield for far less variation.",
      takeaway: "Decide first whether you even have a distribution: no distribution pushes you to minimax/info-gap, a distribution unlocks mean-variance and statistical-feasibility — and either way the robust answer is a wide basin, never a deep narrow spike."
    },
    {
      title: "Risk measures: VaR, CVaR & the Markowitz portfolio",
      tag: "uncertainty",
      body: "<p>For <b>tail risk</b>, two quantities are compared at a confidence level $\\alpha$. <b>Value at Risk (VaR)</b> is the $\\alpha$-quantile of the loss — a single cutoff. <b>Conditional Value at Risk (CVaR)</b> is the <i>expected</i> loss in the worst $1-\\alpha$ tail, averaging everything at or beyond the VaR quantile. Hence <b>CVaR $\\ge$ VaR always</b>, strictly larger whenever the tail carries mass beyond the quantile. CVaR is <b>coherent</b>, less sensitive to estimation error, and accounts for the extreme losses VaR ignores; <b>distributionally robust optimization</b> hedges against the distribution itself being uncertain.</p><p>The <b>Markowitz portfolio</b> is the canonical mean-variance problem — trade expected return against return variance subject to a budget: $\\min\\,-w\\,\\mathbf{x}^\\top\\mu+(1-w)\\,\\mathbf{x}^\\top\\Sigma\\mathbf{x}$ s.t. $\\mathbf{x}^\\top\\mathbf{1}=b,\\ \\mathbf{x}\\ge\\mathbf{0}$.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="45" y1="18" x2="45" y2="195" class="vx-axis" stroke-width="1.5"/>
        <line x1="45" y1="195" x2="500" y2="195" class="vx-axis" stroke-width="1.5"/>
        <text x="272" y="225" text-anchor="middle" font-size="12">loss →</text>
        <!-- loss distribution curve -->
        <path d="M55,193 C130,193 160,60 230,55 C300,50 320,150 380,175 C420,190 450,193 490,193" fill="none" class="vx-axis" stroke-width="2"/>
        <!-- shaded worst tail: the area under the density to the RIGHT of VaR -->
        <path d="M350,193 L350,162 C380,176 420,190 490,193 Z" style="fill:var(--bad)" opacity="0.28"/>
        <!-- VaR quantile line -->
        <line x1="350" y1="195" x2="350" y2="60" class="vx-warn" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="350" y="50" text-anchor="middle" font-size="11" style="fill:var(--warn)">VaR (α-quantile)</text>
        <!-- CVaR arrow into the tail -->
        <line x1="430" y1="120" x2="430" y2="170" class="vx-bad" stroke-width="1.5"/>
        <text x="430" y="112" text-anchor="middle" font-size="11" style="fill:var(--bad)">CVaR = mean of</text>
        <text x="430" y="126" text-anchor="middle" font-size="11" style="fill:var(--bad)">worst tail</text>
        <text x="155" y="120" font-size="11" style="fill:var(--text-dim)">loss density</text>
      </svg>`,
      caption: "VaR is just the cutoff quantile (warn line); CVaR averages the entire shaded worst-case tail beyond it — so CVaR sees the extreme losses that VaR's single threshold ignores.",
      example: "Two portfolios share the same VaR at the 95% level, but one has a fat tail of catastrophic losses beyond that cutoff. VaR rates them equal; CVaR — the average loss in the worst 5% — flags the fat-tailed one as riskier, which is why CVaR is the coherent choice.",
      takeaway: "Optimize CVaR, not VaR, when the tail you're ignoring is the one that bankrupts you; the Markowitz portfolio is the same mean-variance bet written for returns."
    },
    {
      title: "Uncertainty propagation: Monte Carlo, Taylor & polynomial chaos",
      tag: "uncertainty",
      body: "<p>Computing any of the objectives above needs <b>uncertainty propagation</b>: pushing the input distribution $p(\\mathbf{z})$ through $f$ to get the output moments (mean, variance).</p><ul><li><b>Monte Carlo</b> — sample $\\mathbf{z}^{(i)}\\sim p$ and average, $\\hat\\mu=\\frac1m\\sum_i f(\\mathbf{z}^{(i)})$. Simple and assumption-free, but $\\text{Var}[\\hat\\mu]=\\nu/m$, so it converges only at $O(1/\\sqrt{m})$ — doubling samples halves the variance. Quasi-Monte Carlo (low-discrepancy sequences) improves this to $O(1/m)$.</li><li><b>Taylor approximation</b> — expand $f$ to second order about the mean $\\mu$: $\\hat\\mu=f(\\mu)+\\tfrac12\\sum_i\\frac{\\partial^2 f}{\\partial z_i^2}\\nu_i$ and $\\hat\\nu=\\sum_i(\\frac{\\partial f}{\\partial z_i})^2\\nu_i+\\cdots$. Fast but <b>needs derivatives</b>; whiten correlated inputs first.</li><li><b>Polynomial chaos</b> — build a surrogate from bases <b>orthogonal under $p$</b> (with $b_1=1$), so the moments collapse to $\\hat\\mu=\\theta_1$ and $\\hat\\nu=\\sum_{i\\ge2}\\theta_i^2\\int b_i^2 p$. The basis is matched to the input: <b>Uniform→Legendre, Gaussian→Hermite, Exponential→Laguerre</b>. Coefficients come from regression or orthogonality plus Gaussian quadrature; the multivariate version is a tensor product (exponential growth, assumes independence).</li></ul>",
      example: "Propagating a Gaussian input through a smooth response: Monte Carlo needs thousands of samples for a stable variance estimate, while a low-order polynomial-chaos surrogate with Hermite bases reads the mean straight off the first coefficient ($\\hat\\mu=\\theta_1$) and the variance off the rest — far cheaper and smoother.",
      takeaway: "Match the tool to the budget: Monte Carlo when you can only sample a black box, Taylor when you have cheap derivatives and small noise, and polynomial chaos when you want closed-form moments from few evaluations."
    },
    {
      title: "Discrete optimization",
      tag: "algorithm",
      body: "<p>When design variables are integer-valued, the continuous toolkit can mislead. <b>Rounding</b> a relaxed LP solution is unreliable on its own. A few structural facts and exact methods:</p><ul><li><b>Totally unimodular</b> constraint matrix $\\mathbf{A}$ (every subdeterminant in $\\{0,\\pm1\\}$) ⇒ the LP relaxation already returns an <b>integer</b> solution, so you can solve it as a plain LP.</li><li><b>Branch and bound</b> — solve the LP relaxation for a bound, branch on a fractional variable, prune any subtree whose bound can't beat the incumbent. <b>Cutting planes (Gomory)</b> add constraints that cut off the fractional vertex while keeping all integer points; <i>branch and cut</i> combines both.</li><li><b>Dynamic programming</b> — exploits optimal substructure plus overlapping subproblems (e.g. the 0-1 knapsack recurrence). <b>Ant colony optimization</b> lays pheromone $A(i\\to j)=\\tau^\\alpha\\eta^\\beta$ on graphs for routing/TSP.</li></ul>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="260" y="20" text-anchor="middle" font-size="12" font-weight="700">branch &amp; bound: prune by the LP bound</text>
        <!-- root -->
        <circle cx="260" cy="50" r="18" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="260" y="54" text-anchor="middle" font-size="10">LP</text>
        <!-- branch lines -->
        <line x1="245" y1="63" x2="150" y2="107" class="vx-axis" stroke-width="1.5"/>
        <line x1="275" y1="63" x2="370" y2="107" class="vx-axis" stroke-width="1.5"/>
        <text x="185" y="88" font-size="10" style="fill:var(--text-dim)">x≤2</text>
        <text x="325" y="88" font-size="10" style="fill:var(--text-dim)">x≥3</text>
        <!-- left child kept -->
        <circle cx="150" cy="125" r="18" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="150" y="129" text-anchor="middle" font-size="10">14</text>
        <!-- right child pruned -->
        <circle cx="370" cy="125" r="18" class="vx-bad" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="370" y="129" text-anchor="middle" font-size="10">19</text>
        <text x="370" y="162" text-anchor="middle" font-size="10" style="fill:var(--bad)">pruned</text>
        <text x="370" y="176" text-anchor="middle" font-size="10" style="fill:var(--bad)">bound &gt; best</text>
        <!-- left grandchildren -->
        <line x1="138" y1="139" x2="95" y2="178" class="vx-axis" stroke-width="1.5"/>
        <line x1="162" y1="139" x2="205" y2="178" class="vx-axis" stroke-width="1.5"/>
        <circle cx="90" cy="192" r="16" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="90" y="196" text-anchor="middle" font-size="9.5">15</text>
        <circle cx="210" cy="192" r="16" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="210" y="196" text-anchor="middle" font-size="9.5">int 15★</text>
        <text x="90" y="222" text-anchor="middle" font-size="10" style="fill:var(--good)">incumbent</text>
      </svg>`,
      caption: "Each node is an LP relaxation giving a bound; a subtree whose bound is worse than the best integer solution found (incumbent) is pruned without exploring it.",
      example: "A 0-1 knapsack: the LP relaxation allows fractional items, giving an optimistic value bound. Branch on a fractional item (take it / leave it); any branch whose LP bound is below the best full integer packing found so far is pruned. Dynamic programming solves the same knapsack via its value-by-capacity recurrence.",
      takeaway: "Never just round an LP solution for integer decisions — branch-and-bound gives provable optimality, and spotting total unimodularity lets you skip the integer machinery entirely."
    },
    {
      title: "Multidisciplinary optimization (MDO)",
      tag: "algorithm",
      body: "<p>MDO optimizes across coupled disciplines (e.g. aerodynamics ↔ structures, where each consumes the other's outputs). First comes <b>multidisciplinary analysis (MDA)</b>: find responses consistent across all analyses, $F_i(\\mathcal{A})=\\mathcal{A}$. If the coupling graph is acyclic, evaluate in topological (serial) order; if cyclic, iterate with <b>Gauss-Seidel</b> (ordering-sensitive).</p><p>Architectures trade compatibility against cost:</p><ul><li><b>MDF</b> (multidisciplinary feasible) — a full MDA inside every evaluation; always compatible but expensive; the system optimizer holds all variables.</li><li><b>Sequential</b> — optimize each discipline in turn; exploits locality but isn't optimal.</li><li><b>IDF</b> (individual discipline feasible) — coupling-variable aliases tied by equality constraints, letting analyses run in <b>parallel</b>; compatible only at convergence.</li><li><b>Collaborative</b> — distributed subproblems minimizing deviation from shared targets; great when well-segregated, poor under high coupling.</li><li><b>SAND</b> (simultaneous analysis and design) — the optimizer drives the analyses via cheap <b>residuals</b> $r_i=\\|F_i(\\mathcal{A})-\\mathcal{A}[\\mathbf{y}^{(i)}]\\|=0$; can traverse infeasible regions but has a huge variable count.</li></ul>",
      caption: null,
      example: "Designing a wing, the aero analysis needs the structural deformation and the structural analysis needs the aero loads — a cyclic coupling. MDF runs a Gauss-Seidel MDA to convergence for <i>every</i> candidate design (safe but slow); IDF instead adds aliased coupling variables with equality constraints so the two analyses run in parallel, only becoming consistent once the optimizer converges.",
      takeaway: "The MDO architecture you pick is a cost-vs-consistency bet: MDF guarantees feasible intermediates but is slow, while IDF buys parallel speed by only reconciling disciplines at convergence."
    },
    {
      title: "Expression optimization (genetic programming)",
      tag: "algorithm",
      body: "<p>Sometimes the design <i>is</i> a formula: optimize over <b>expressions</b> represented as <b>symbol trees</b> drawn from a grammar (leaves = variables/constants, internal nodes = operators/functions). <b>Genetic programming</b> applies population search (§S12's GA) to these trees: it is <b>strongly typed</b> (children must match a node's expected types), recombines via <b>tree crossover</b> (swap subtrees) and <b>tree mutation</b> (regrow a subtree), and must <b>encourage parsimony</b> — penalize size — to fight code <b>bloat</b>, the runaway growth of useless subtrees.</p><p>To stay inside the space of <i>valid</i> expressions, three grammar-based tools:</p><ul><li><b>Grammars</b> — context-free <b>production rules</b> that generate only syntactically valid expressions (invalid or equivalent forms handled via penalties).</li><li><b>Grammatical evolution</b> — the genotype is an <b>integer array</b> decoded into a tree: at each step pick the production by $\\text{rule} = v \\bmod n$ (value mod number of applicable rules), <b>wrapping around</b> the array if it runs out.</li><li><b>Probabilistic grammars / prototype trees</b> — learn <b>rule weights</b> (a categorical distribution per node, Dirichlet-initialized) from the counts in <b>elite</b> individuals, biasing future samples toward what worked.</li></ul>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="260" y="20" text-anchor="middle" font-size="12" font-weight="700">expression tree for  x × x + 2</text>
        <!-- edges -->
        <line x1="260" y1="58" x2="170" y2="108" class="vx-axis" stroke-width="1.5"/>
        <line x1="260" y1="58" x2="350" y2="108" class="vx-axis" stroke-width="1.5"/>
        <line x1="170" y1="126" x2="120" y2="166" class="vx-axis" stroke-width="1.5"/>
        <line x1="170" y1="126" x2="220" y2="166" class="vx-axis" stroke-width="1.5"/>
        <!-- root: + -->
        <circle cx="260" cy="45" r="18" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="260" y="50" text-anchor="middle" font-size="14" style="fill:var(--accent)">+</text>
        <!-- internal: × -->
        <circle cx="170" cy="116" r="18" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="170" y="121" text-anchor="middle" font-size="14" style="fill:var(--good)">×</text>
        <!-- leaf: constant 2 -->
        <circle cx="350" cy="116" r="16" class="vx-grid" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="350" y="121" text-anchor="middle" font-size="12">2</text>
        <!-- leaves: x, x -->
        <circle cx="120" cy="180" r="15" class="vx-grid" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="120" y="185" text-anchor="middle" font-size="12">x</text>
        <circle cx="220" cy="180" r="15" class="vx-grid" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="220" y="185" text-anchor="middle" font-size="12">x</text>
        <text x="408" y="120" font-size="10.5" style="fill:var(--text-dim)">leaves = vars/consts</text>
        <text x="408" y="50" font-size="10.5" style="fill:var(--text-dim)">nodes = operators</text>
      </svg>`,
      caption: "An expression is a typed symbol tree: operators at internal nodes, variables and constants at leaves. Crossover swaps subtrees between two such trees; mutation regrows one subtree.",
      example: "Symbolic regression: evolve a formula fitting data points. A population of trees is scored by fit minus a size penalty; crossover swaps the $x\\times x$ subtree of one parent into another, and over generations the population converges toward, say, $x^2 + 2$ rather than a bloated equivalent like $x\\times x + 1 + 1 + 0$.",
      takeaway: "Genetic programming searches the space of formulas themselves, yielding interpretable closed-form models — but without a parsimony penalty, bloat buries the answer in useless subtrees."
    }
  ]
};
