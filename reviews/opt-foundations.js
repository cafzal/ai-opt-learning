/* Review: Optimization Foundations */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["opt-foundations"] = {
  intro: "The grammar of continuous optimization: what a minimum <i>is</i>, how to certify one, how to get the derivatives that point the way, the descent template (direction then step), and the four families of methods that descend — bracketing line searches, first-order, second-order, and derivative-free — plus how to tame the step itself. These concepts follow the standard treatment in Kochenderfer &amp; Wheeler's <i>Algorithms for Optimization</i>, plus the shared stepping/Newton/trust-region cores. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Standard form & the minima you're hunting",
      tag: "core",
      body: "<p>Every problem reduces to one shape: $\\min_\\mathbf{x} f(\\mathbf{x})$ subject to $\\mathbf{x}\\in\\mathcal{X}$. Here $\\mathbf{x}$ is the <b>design point</b>, $f$ the <b>objective</b>, $\\mathcal{X}$ the <b>feasible set</b>, and $\\mathbf{x}^*$ the <b>minimizer</b>. (Watch strict-inequality feasible sets — they may have <i>no</i> solution, so include the boundary.)</p><p>Two structural axes shape <i>which</i> method even applies. First, <b>continuous vs. discrete</b>: when $\\mathcal{X}$ is a continuum and $f$ is smooth, gradients exist and point the way (the rest of this batch). When $\\mathcal{X}$ is a finite/combinatorial set — orderings, subsets, integer assignments — there is <i>no gradient</i>, so you fall back on systematic <b>search</b>, <b>relaxation</b> (solve a continuous version, then round), or <b>branch-and-bound</b> (recursively split and prune with bounds). Second, <b>deterministic vs. stochastic</b>: a fixed objective and dynamics let you trust each evaluation, whereas a <i>noisy</i> objective (mini-batch losses, noisy simulations) forces methods that average out the noise — SGD, stochastic/population search.</p><p>Three flavors of minimum: a <b>global</b> min is lowest anywhere (hard to prove); a <b>local</b> min satisfies $f(\\mathbf{x}^*)\\le f(\\mathbf{x})$ only in a neighborhood; a <b>strong</b> (strict) min is the unique lowest point in its neighborhood.</p>",
      example: "Maximizing profit becomes minimizing $-\\text{profit}$. If the feasible region is \"$x>0$\" (strict), the infimum at $x=0$ is never attained — rewrite it as \"$x\\ge 0$\" so a minimizer exists. Routing a truck through 30 cities is discrete and gradient-free — you branch-and-bound or heuristically search, not descend.",
      takeaway: "Before picking a method, classify the problem on two axes — continuous/smooth vs. discrete/combinatorial, and deterministic vs. noisy — because each rules a whole family of algorithms in or out."
    },
    {
      title: "The speed–optimality–generality trilemma",
      tag: "core",
      body: "<p>Why isn't there one master optimizer? Three properties pull against each other, and no method holds all three at once:</p><ul><li><b>Speed</b> — few evaluations / fast convergence.</li><li><b>Optimality</b> — a guaranteed global optimum (or a certified bound on how far off you are).</li><li><b>Generality</b> — works on any problem, with no assumptions about structure.</li></ul><p>Picking a method is really choosing <i>which one to sacrifice</i>. Newton's method is fast and (on convex problems) optimal, but <i>not</i> general — it needs smoothness and a Hessian. Exhaustive / branch-and-bound search is general and optimal, but <i>not</i> fast. A black-box metaheuristic (genetic algorithms, simulated annealing) is fast and general, but gives up the optimality guarantee — it returns a good point, not a certified best one.</p><p>This is the optimization face of the <b>No Free Lunch</b> theorem (covered in full under <i>Foundations</i>): superiority is never free — it is bought by assuming structure (convexity, Lipschitz continuity, differentiability) that narrows the problem class.</p>",
      example: "Need a certified-optimal integer schedule and can wait? Branch-and-bound (optimal + general, slow). Tuning a smooth 50-D loss fast? L-BFGS (fast + near-optimal, but assumes smoothness). Optimizing a noisy black-box simulator overnight? CMA-ES (fast + general, no guarantee). Each choice openly trades away one corner of the trilemma.",
      takeaway: "When someone promises an optimizer that is simultaneously fast, globally optimal, and assumption-free, No Free Lunch says they're wrong — so decide up front which of the three you can afford to give up."
    },
    {
      title: "Optimality conditions: reading the Hessian",
      tag: "core",
      body: "<p>How do you <i>certify</i> a point is a minimum without checking the whole space? Local conditions on the gradient and curvature:</p><ul><li><b>First-order necessary:</b> $\\nabla f(\\mathbf{x}^*)=\\mathbf{0}$ — a <b>stationary point</b> (flat tangent). Necessary, not sufficient.</li><li><b>Second-order necessary:</b> the Hessian $\\nabla^2 f(\\mathbf{x}^*)$ is <b>PSD</b> (positive semidefinite).</li><li><b>Second-order sufficient:</b> $\\nabla f=\\mathbf{0}$ <b>and</b> $\\nabla^2 f$ is <b>PD</b> (positive definite) $\\Rightarrow$ strong local min.</li></ul><p>So among zero-gradient points the Hessian's definiteness decides the type: <b>positive definite = bowl</b> (min), <b>negative definite = hill</b> (max), <b>indefinite = saddle</b>.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Three stationary points (∇f = 0)</text>
        <line x1="40" y1="170" x2="500" y2="170" class="vx-axis" stroke-width="1.2"/>
        <!-- bowl: f'' > 0 -->
        <path d="M55,80 C85,160 135,160 165,80" fill="none" class="vx-good" stroke-width="2.5"/>
        <circle cx="110" cy="148" r="4" style="fill:var(--good)"/>
        <line x1="92" y1="148" x2="128" y2="148" class="vx-grid" stroke-width="1.5"/>
        <text x="110" y="198" text-anchor="middle" font-size="11" style="fill:var(--good)">bowl · f″&gt;0</text>
        <text x="110" y="213" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">local min (PD)</text>
        <!-- hill: f'' < 0 -->
        <path d="M205,148 C235,68 285,68 315,148" fill="none" class="vx-bad" stroke-width="2.5"/>
        <circle cx="260" cy="80" r="4" style="fill:var(--bad)"/>
        <line x1="242" y1="80" x2="278" y2="80" class="vx-grid" stroke-width="1.5"/>
        <text x="260" y="198" text-anchor="middle" font-size="11" style="fill:var(--bad)">hill · f″&lt;0</text>
        <text x="260" y="213" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">local max (ND)</text>
        <!-- saddle / inflection: f'' = 0 -->
        <path d="M360,68 C390,68 400,148 430,148 C455,148 465,150 475,150" fill="none" class="vx-warn" stroke-width="2.5"/>
        <circle cx="412" cy="115" r="4" style="fill:var(--warn)"/>
        <line x1="394" y1="115" x2="430" y2="115" class="vx-grid" stroke-width="1.5"/>
        <text x="417" y="198" text-anchor="middle" font-size="11" style="fill:var(--warn)">inflection · f″=0</text>
        <text x="417" y="213" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">saddle (indefinite)</text>
      </svg>`,
      caption: "All three have a flat tangent (∇f = 0). Only the Hessian's sign tells them apart.",
      example: "For $f(x)=x^4$ at $x=0$: $f'=0$ and $f''=0$, so the second-order <i>sufficient</i> test is inconclusive — yet it is a strong min. For $f(x,y)=x^2-y^2$ the origin is stationary but the indefinite Hessian makes it a saddle.",
      takeaway: "These conditions are your local stopping test and your saddle-point detector — without the Hessian check you can't tell a converged minimum from a saddle that traps gradient methods."
    },
    {
      title: "Derivatives & five ways to get them",
      tag: "core",
      body: "<p>Methods need change information: the <b>gradient</b> $\\nabla f$ (steepest-ascent direction), the <b>Hessian</b> $\\nabla^2 f$ (curvature), and the <b>directional derivative</b> $\\nabla_\\mathbf{s}f=\\nabla f^\\top\\mathbf{s}$. Five ways to compute them:</p><ol><li><b>Forward differences</b> $\\frac{f(x+h)-f(x)}{h}$ — error $O(h)$.</li><li><b>Central differences</b> $\\frac{f(x+h)-f(x-h)}{2h}$ — error $O(h^2)$, more accurate. Both fight <b>subtractive cancellation</b>: too-small $h$ loses precision in the numerator (sweet spot near $\\sqrt{}$ / $\\sqrt[3]{}$ of machine precision).</li><li><b>Complex step</b> $f'(x)\\approx\\operatorname{Im}(f(x+ih))/h$ — no cancellation at all, accurate for tiny $h$; needs a complex-capable $f$.</li><li><b>Forward-mode AD</b> — dual numbers $a+b\\varepsilon$ ($\\varepsilon^2=0$) carry value and derivative together; $n$ passes for $n$ inputs.</li><li><b>Reverse-mode AD</b> — one forward + one backward pass yields the whole gradient (this <i>is</i> backpropagation); stores the graph; best for high-dimensional $f$.</li></ol>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Finite-difference error vs step size h</text>
        <line x1="55" y1="30" x2="55" y2="185" class="vx-axis" stroke-width="1.4"/>
        <line x1="55" y1="185" x2="495" y2="185" class="vx-axis" stroke-width="1.4"/>
        <text x="275" y="216" text-anchor="middle" font-size="12">smaller h  →</text>
        <text x="22" y="108" font-size="12" transform="rotate(-90 22 108)" text-anchor="middle">total error</text>
        <!-- truncation falls, then roundoff (cancellation) rises: a U -->
        <path d="M70,55 C150,130 200,168 235,168 C300,168 380,120 480,60" fill="none" class="vx-warn" stroke-width="2.5"/>
        <text x="120" y="80" font-size="10.5" style="fill:var(--text-dim)">truncation O(h)</text>
        <text x="360" y="92" font-size="10.5" style="fill:var(--text-dim)">cancellation</text>
        <line x1="235" y1="185" x2="235" y2="168" stroke-dasharray="4 4" class="vx-grid"/>
        <circle cx="235" cy="168" r="4" style="fill:var(--good)"/>
        <text x="235" y="158" text-anchor="middle" font-size="10.5" style="fill:var(--good)">sweet spot ≈ √(eps)</text>
        <text x="70" y="232" font-size="10" style="fill:var(--text-faint)">complex step &amp; AD avoid the right-hand wall entirely</text>
      </svg>`,
      caption: "Finite differences trade truncation (large h) against subtractive cancellation (tiny h) — a U-shaped total error. Complex-step and AD sidestep it.",
      example: "Approximating $f'$ for $f(x)=e^x$ at $x=1$: forward diff with $h=10^{-1}$ is off by truncation; with $h=10^{-14}$ it is wrecked by cancellation. The complex step $\\operatorname{Im}(f(1+ih))/h$ stays accurate even at $h=10^{-200}$.",
      takeaway: "Reverse-mode AD is why backprop trains billion-parameter models cheaply; reach for finite differences only to sanity-check a hand-coded gradient, never as your production derivative."
    },
    {
      title: "Bracketing: 1-D line searches",
      tag: "algorithm",
      body: "<p>The multivariate methods all lean on a <b>univariate</b> subroutine: minimize $f$ along one direction. First <b>bracket</b> the minimum — for a <b>unimodal</b> $f$, find $a<b<c$ with $f(a)>f(b)<f(c)$ (expand a step by a factor $k$ until bracketed). Then shrink:</p><ul><li><b>Fibonacci search</b> — provably optimal for a <i>fixed</i> query budget; the golden ratio $\\varphi\\approx1.618$ emerges as $F_n/F_{n-1}\\to\\varphi$.</li><li><b>Golden section</b> — constant shrink ratio $\\varphi^{-1}\\approx0.618$; budget need not be known in advance.</li><li><b>Quadratic fit</b> — fit a parabola to 3 points and jump to its analytic minimum; usually faster.</li><li><b>Brent–Dekker</b> — bisection + secant + inverse-quadratic interpolation; the reliable-and-fast default.</li></ul>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Golden-section bracket shrinking</text>
        <path d="M50,40 C150,40 180,150 260,150 C340,150 370,40 470,40" fill="none" class="vx-grid" stroke-width="2"/>
        <!-- outer bracket [a,c] -->
        <line x1="80" y1="55" x2="80" y2="170" class="vx-axis" stroke-width="1.4"/>
        <line x1="440" y1="55" x2="440" y2="170" class="vx-axis" stroke-width="1.4"/>
        <text x="80" y="188" text-anchor="middle" font-size="11">a</text>
        <text x="440" y="188" text-anchor="middle" font-size="11">c</text>
        <!-- two interior probes at golden ratios -->
        <line x1="217" y1="80" x2="217" y2="170" class="vx-accent" stroke-width="1.6"/>
        <line x1="303" y1="80" x2="303" y2="170" class="vx-accent" stroke-width="1.6"/>
        <circle cx="217" cy="147" r="3.5" style="fill:var(--accent)"/>
        <circle cx="303" cy="131" r="3.5" style="fill:var(--accent)"/>
        <text x="217" y="188" text-anchor="middle" font-size="11" style="fill:var(--accent)">x₁</text>
        <text x="303" y="188" text-anchor="middle" font-size="11" style="fill:var(--accent)">x₂</text>
        <!-- kept sub-interval -->
        <line x1="80" y1="64" x2="303" y2="64" class="vx-good" stroke-width="3"/>
        <text x="150" y="58" font-size="10.5" style="fill:var(--good)">f(x₁) &lt; f(x₂) → keep [a, x₂], drop the rest</text>
        <text x="412" y="146" font-size="10.5" style="fill:var(--text-dim)">ratio φ⁻¹ ≈ 0.618</text>
      </svg>`,
      caption: "Two interior probes at the golden ratio; whichever is lower keeps its side, shrinking the bracket by φ⁻¹ each step — and reusing one probe.",
      example: "On a unimodal cost over step length, golden section needs no budget up front and contracts the interval ~38% per iteration; if you know you have exactly 10 evaluations, Fibonacci search squeezes it slightly tighter.",
      takeaway: "Every multivariate optimizer calls a line search inside its loop, so a robust 1-D solver like Brent directly governs how fast and reliably the whole method converges."
    },
    {
      title: "Local descent: direction then step",
      tag: "algorithm",
      body: "<p>The master template for multivariate minimization: $\\mathbf{x}^{(k+1)}\\leftarrow\\mathbf{x}^{(k)}+\\alpha^{(k)}\\mathbf{d}^{(k)}$ — pick a <b>descent direction</b> $\\mathbf{d}$, then a <b>step size</b> $\\alpha$, repeat. The step is set by a <b>line search</b> $\\min_\\alpha f(\\mathbf{x}+\\alpha\\mathbf{d})$, or accepted once \"good enough\" by the <b>Wolfe conditions</b>: <i>sufficient decrease</i> (Armijo) $f(\\mathbf{x}+\\alpha\\mathbf{d})\\le f(\\mathbf{x})+\\beta\\alpha\\nabla_\\mathbf{d}f$ plus a <i>curvature</i> condition; <b>backtracking</b> shrinks $\\alpha$ until Armijo holds.</p><p>The key contrast is <b>line search vs. trust region</b>: line search picks a <i>direction first</i>, then a step along it; a <b>trust region</b> picks a <i>max step radius</i> $\\delta$ first, then the best point inside that region from a local model $\\hat f$. Termination: max iterations/time, small abs/rel improvement, or $\\|\\nabla f\\|<\\epsilon_g$. For many local optima, use <b>random restarts</b>.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" style="fill:var(--text)" font-size="12.5" font-weight="700">Line search</text>
        <text x="390" y="20" text-anchor="middle" style="fill:var(--text)" font-size="12.5" font-weight="700">Trust region</text>
        <!-- LEFT: direction then step -->
        <g>
          <circle cx="80" cy="120" r="4" style="fill:var(--text)"/>
          <text x="80" y="145" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">x</text>
          <line x1="80" y1="120" x2="230" y2="70" class="vx-accent" stroke-width="2.5" marker-end="url(#ah1)"/>
          <text x="150" y="78" font-size="10.5" style="fill:var(--accent)">1. fix direction d</text>
          <circle cx="175" cy="87" r="4.5" style="fill:var(--good)"/>
          <text x="178" y="108" font-size="10.5" style="fill:var(--good)">2. best α along d</text>
        </g>
        <line x1="262" y1="35" x2="262" y2="195" class="vx-grid" stroke-width="1"/>
        <!-- RIGHT: max radius then best point inside -->
        <g>
          <circle cx="390" cy="120" r="4" style="fill:var(--text)"/>
          <text x="390" y="145" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">x</text>
          <circle cx="390" cy="120" r="55" fill="none" class="vx-warn" stroke-width="2" stroke-dasharray="5 4"/>
          <line x1="390" y1="120" x2="433" y2="120" class="vx-warn" stroke-width="1.4"/>
          <text x="411" y="113" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">δ</text>
          <text x="390" y="62" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">1. fix max radius δ</text>
          <circle cx="358" cy="92" r="4.5" style="fill:var(--good)"/>
          <text x="345" y="183" text-anchor="middle" font-size="10.5" style="fill:var(--good)">2. best point inside</text>
        </g>
        <defs>
          <marker id="ah1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" style="fill:var(--accent)"/>
          </marker>
        </defs>
      </svg>`,
      caption: "Line search commits to a direction, then hunts the step. Trust region commits to a step radius δ, then hunts the direction inside it.",
      example: "Backtracking line search starts at $\\alpha=1$, halving until $f$ drops by the Armijo amount. A trust-region method instead solves a constrained subproblem $\\min\\hat f(\\mathbf{x}')$ s.t. $\\|\\mathbf{x}-\\mathbf{x}'\\|\\le\\delta$, then grows or shrinks $\\delta$ by how well $\\hat f$ predicted the real drop.",
      takeaway: "Prefer a trust region when the Hessian is indefinite or the local model is unreliable, since capping the step keeps a bad model from leaping catastrophically."
    },
    {
      title: "First-order methods: gradient & conjugate gradient",
      tag: "algorithm",
      body: "<p>Direction comes straight from the gradient. <b>Steepest descent</b> takes $\\mathbf{d}=-\\mathbf{g}/\\|\\mathbf{g}\\|$ — simple, but with an exact line search consecutive directions are <b>orthogonal</b>, so it <b>zig-zags</b> down narrow valleys (slow).</p><p><b>Conjugate gradient</b> fixes this by mixing in the last direction: $\\mathbf{d}^{(k)}=-\\mathbf{g}^{(k)}+\\beta^{(k)}\\mathbf{d}^{(k-1)}$, with $\\beta$ from <i>Fletcher–Reeves</i> or <i>Polak–Ribière</i>. Its conjugate directions solve an $n$-dimensional <b>quadratic in exactly $n$ steps</b> — no zig-zag.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Steepest descent zig-zags in a narrow valley</text>
        <!-- elongated elliptical contours -->
        <ellipse cx="350" cy="125" rx="150" ry="48" fill="none" class="vx-grid" stroke-width="1.2"/>
        <ellipse cx="350" cy="125" rx="100" ry="32" fill="none" class="vx-grid" stroke-width="1.2"/>
        <ellipse cx="350" cy="125" rx="52" ry="17" fill="none" class="vx-grid" stroke-width="1.2"/>
        <circle cx="350" cy="125" r="3.5" style="fill:var(--good)"/>
        <text x="350" y="118" text-anchor="middle" font-size="10.5" style="fill:var(--good)">x*</text>
        <!-- zig-zag path with 90-degree turns -->
        <polyline points="70,60 150,175 215,80 270,165 305,105 332,150 345,118" fill="none" class="vx-bad" stroke-width="2.2"/>
        <circle cx="70" cy="60" r="4" style="fill:var(--bad)"/>
        <text x="70" y="52" text-anchor="middle" font-size="10.5" style="fill:var(--bad)">start</text>
        <text x="160" y="205" font-size="10.5" style="fill:var(--text-dim)">each step ⟂ the last → slow staircase to the minimum</text>
      </svg>`,
      caption: "With exact line search, steepest-descent steps meet at right angles, producing the classic zig-zag in elongated valleys. Conjugate gradient straightens it.",
      example: "On the ill-conditioned quadratic $f(x,y)=x^2+100y^2$, steepest descent ping-pongs across the narrow valley for many iterations; conjugate gradient reaches the exact minimum in just 2 steps (it's 2-dimensional).",
      takeaway: "Conjugate gradient is the practical default for large sparse quadratics and linear systems where forming a Hessian is infeasible but plain steepest descent would crawl through ill-conditioned valleys."
    },
    {
      title: "Second-order methods: Newton & friends",
      tag: "algorithm",
      body: "<p>Use curvature for <i>both</i> direction and step. <b>Newton's method</b> fits a local quadratic and jumps to its vertex: $\\mathbf{x}^{(k+1)}=\\mathbf{x}^{(k)}-(\\mathbf{H}^{(k)})^{-1}\\mathbf{g}^{(k)}$. The direction $-\\mathbf{H}^{-1}\\mathbf{g}$ gives <b>quadratic convergence</b> near a positive-definite minimum — and solves a true quadratic in <b>one step</b>. But it's unstable near $f''=0$ and needs the Hessian.</p><p><b>Quasi-Newton</b> (BFGS, DFP) approximates the <i>inverse</i> Hessian from successive gradients via the secant equation $\\mathbf{H}\\boldsymbol\\delta=\\boldsymbol\\gamma$ — no Hessian to form or invert. <b>L-BFGS</b> keeps only the last $m$ pairs (two-loop recursion) for huge $n$. <b>Levenberg–Marquardt</b> damps Newton: $\\mathbf{x}'=\\mathbf{x}-(\\mathbf{H}+\\delta\\mathbf{I})^{-1}\\mathbf{g}$ — small $\\delta\\to$ Newton, large $\\delta\\to$ gradient descent.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Newton step: fit a quadratic, jump to its vertex</text>
        <line x1="40" y1="180" x2="500" y2="180" class="vx-axis" stroke-width="1.2"/>
        <!-- true objective (could be the same parabola for a quadratic) -->
        <path d="M70,55 C190,210 250,210 470,55" fill="none" class="vx-accent" stroke-width="2.5"/>
        <text x="430" y="78" font-size="10.5" style="fill:var(--accent)">f (≈ quadratic)</text>
        <!-- current point x_k -->
        <circle cx="120" cy="118" r="4.5" style="fill:var(--bad)"/>
        <line x1="120" y1="118" x2="120" y2="180" class="vx-grid" stroke-dasharray="3 3"/>
        <text x="120" y="197" text-anchor="middle" font-size="11" style="fill:var(--bad)">xₖ</text>
        <!-- vertex / minimum -->
        <circle cx="232" cy="171" r="4.5" style="fill:var(--good)"/>
        <text x="232" y="197" text-anchor="middle" font-size="11" style="fill:var(--good)">x* = xₖ − H⁻¹g</text>
        <!-- the one jump -->
        <path d="M132,108 Q188,82 224,162" fill="none" class="vx-good" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ah2)"/>
        <text x="180" y="74" text-anchor="middle" font-size="10.5" style="fill:var(--good)">one step</text>
        <defs>
          <marker id="ah2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" style="fill:var(--good)"/>
          </marker>
        </defs>
      </svg>`,
      caption: "Newton models f as a parabola through the current point and leaps straight to that parabola's vertex — exact in one step when f really is quadratic.",
      example: "For sum-of-squares fits ($f=\\sum_i f_i^2$), Levenberg–Marquardt blends Gauss–Newton with gradient descent via $\\delta$: far from the solution a large $\\delta$ takes safe gradient-like steps; near it, $\\delta\\to0$ recovers Newton's fast convergence. L-BFGS is the go-to when the Hessian is too big to store.",
      takeaway: "Quadratic convergence lets second-order methods hit high precision in a few iterations, so use L-BFGS for smooth large-scale problems with expensive evaluations."
    },
    {
      title: "Direct (derivative-free) methods",
      tag: "algorithm",
      body: "<p>When derivatives are unavailable, noisy, or expensive, optimize using <b>only evaluations of $f$</b> (black-box / pattern search):</p><ul><li><b>Hooke–Jeeves</b> — from the current point, probe $\\pm$ a step along each coordinate; move to any improvement, otherwise shrink the step.</li><li><b>Generalized pattern search</b> — generalizes this to a <b>positive spanning set</b> of directions (directions that can express any vector with non-negative weights), guaranteeing at least one is a descent direction; shrink the mesh on failure.</li><li><b>Nelder–Mead (simplex)</b> — maintain a simplex of $n+1$ points and <i>reflect / expand / contract / shrink</i> it to crawl downhill.</li></ul><p>No gradient, no Hessian — just structured sampling of the objective.</p>",
      example: "Tuning a few hyperparameters of a simulator with no usable gradient: Nelder–Mead reflects the worst vertex of its simplex through the centroid, expanding when that helps and contracting when it overshoots — steadily walking the simplex toward a minimum using function values alone.",
      takeaway: "Use a derivative-free method when the objective is a black box, noisy, or non-differentiable, but expect poor scaling past a few dozen dimensions."
    },
    {
      title: "Taming the step: gradient scaling, clipping & simplex projection",
      tag: "algorithm",
      body: "<p>Once a direction and a raw step are chosen, two safeguards keep the update well-behaved when gradients explode or the iterate must stay in a constraint set. Two ways to tame a huge or uneven gradient: <b>gradient scaling</b> caps the gradient's $L_2$ norm so the <i>direction is preserved</i> (the whole vector is shrunk uniformly), while <b>gradient clipping</b> clamps each component independently — so the <i>direction can change</i>. Both keep an exploding gradient from blowing up a step.</p><p>If a step must keep $\\mathbf{x}$ a valid probability distribution, <b>project onto the probability simplex</b>: $\\min_\\mathbf{b}\\tfrac12\\|\\mathbf{y}-\\mathbf{b}\\|_2^2$ s.t. $\\mathbf{b}\\ge0,\\ \\mathbf{1}^\\top\\mathbf{b}=1$ — the nearest valid distribution to the raw update $\\mathbf{y}$. (Sizing $\\alpha$ itself via the Wolfe/Armijo conditions, backtracking, and termination is covered under <i>Local descent</i> above.)</p>",
      example: "Training an RNN, gradients <b>explode</b> through the unrolled time steps and a single update sends the weights to NaN. Clipping the gradient to a max norm (e.g. 5) rescales that giant vector back down so each step stays sane — scaling preserves the descent direction, whereas per-component clipping may tilt it. Separately, after a softmax-policy update you renormalize by projecting onto the simplex so the action probabilities still sum to 1.",
      takeaway: "Gradient clipping keeps deep and recurrent training from diverging to NaN, and simplex projection enforces a valid probability distribution after each update."
    }
  ]
};
