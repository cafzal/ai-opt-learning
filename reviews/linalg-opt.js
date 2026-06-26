/* Review: Linear Algebra & Optimization */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["linalg-opt"] = {
  intro: "The computational engine of ML: how we measure vectors and matrices (norms), factor them (EVD/SVD), and then <i>minimize</i> things over them. Convexity tells us when a local solution is the answer; gradient, second-order, stochastic, and adaptive methods tell us how to get there; KKT and proximal methods handle constraints and sparsity; EM reframes hard likelihoods as a bound we push up. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Vector & matrix norms (and why ℓ1 induces sparsity)",
      tag: "core",
      body: "<p>A <b>norm</b> measures size. The defaults: $\\ell_2=\\sqrt{\\boldsymbol{x}^\\top\\boldsymbol{x}}$ (Euclidean), $\\ell_1=\\sum_i|x_i|$ (<b>sparsity-inducing</b>), $\\ell_\\infty=\\max_i|x_i|$. For matrices, <b>Frobenius</b> $\\|\\mathbf{A}\\|_F=\\sqrt{\\sum_{ij}A_{ij}^2}=\\sqrt{\\text{tr}(\\mathbf{A}^\\top\\mathbf{A})}$ treats the matrix as one long vector, and the <b>nuclear</b> norm $\\sum_i\\sigma_i$ (sum of singular values) is the convex surrogate for <i>rank</i>.</p><p>Why does $\\ell_1$ produce zeros? Its unit ball is a diamond with corners <i>on the axes</i>; a shrinking objective level set first touches the constraint at a corner, where some coordinates are exactly $0$. The round $\\ell_2$ ball has no corners, so it shrinks weights toward — but rarely onto — zero.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700">ℓ1 ball (diamond)</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700">ℓ2 ball (circle)</text>
        <!-- left: L1 -->
        <g transform="translate(135,120)">
          <line x1="-100" y1="0" x2="100" y2="0" class="vx-axis" stroke-width="1"/>
          <line x1="0" y1="-90" x2="0" y2="90" class="vx-axis" stroke-width="1"/>
          <polygon points="0,-62 62,0 0,62 -62,0" fill="none" class="vx-accent" stroke-width="2.5"/>
          <ellipse cx="46" cy="-46" rx="64" ry="30" transform="rotate(-32 46 -46)" fill="none" class="vx-warn" stroke-width="2"/>
          <ellipse cx="46" cy="-46" rx="40" ry="17" transform="rotate(-32 46 -46)" fill="none" class="vx-warn" stroke-width="1.4" stroke-dasharray="3 3"/>
          <circle cx="0" cy="-62" r="4.5" style="fill:var(--good)"/>
          <text x="8" y="-66" font-size="10.5" style="fill:var(--good)">hits axis: x₁=0</text>
        </g>
        <!-- right: L2 -->
        <g transform="translate(390,120)">
          <line x1="-100" y1="0" x2="100" y2="0" class="vx-axis" stroke-width="1"/>
          <line x1="0" y1="-90" x2="0" y2="90" class="vx-axis" stroke-width="1"/>
          <circle cx="0" cy="0" r="58" fill="none" class="vx-accent" stroke-width="2.5"/>
          <ellipse cx="44" cy="-44" rx="64" ry="30" transform="rotate(-32 44 -44)" fill="none" class="vx-warn" stroke-width="2"/>
          <circle cx="41" cy="-41" r="4.5" style="fill:var(--bad)"/>
          <text x="6" y="-50" font-size="10.5" style="fill:var(--bad)">touches off-axis</text>
        </g>
        <text x="260" y="222" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">orange = objective level set shrinking onto the constraint ball</text>
      </svg>`,
      caption: "The diamond's corners sit on the axes, so the optimum lands where a coordinate is exactly zero — the geometric reason ℓ1 (Lasso) gives sparse solutions.",
      example: "Lasso adds an $\\ell_1$ penalty and drives many coefficients to exactly $0$ (built-in feature selection); ridge adds $\\ell_2$ and merely shrinks them. The nuclear norm does the same trick for matrices — minimizing $\\sum_i\\sigma_i$ favors <i>low-rank</i> solutions, as in matrix completion."
,
      takeaway: "Reach for $\\ell_1$ when you want a sparse, interpretable model that drops irrelevant features automatically; use $\\ell_2$ when you just need to tame large weights without zeroing them."
    },
    {
      title: "Eigendecomposition, SVD & low-rank approximation",
      tag: "core",
      body: "<p><b>Eigendecomposition:</b> $\\mathbf{A}\\boldsymbol{v}=\\lambda\\boldsymbol{v}$. For a <b>symmetric</b> matrix the spectral theorem gives $\\mathbf{A}=\\mathbf{U}\\boldsymbol\\Lambda\\mathbf{U}^\\top=\\sum_i\\lambda_i\\boldsymbol{u}_i\\boldsymbol{u}_i^\\top$ with $\\mathbf{U}$ orthogonal; the level sets of $\\boldsymbol{x}^\\top\\mathbf{A}\\boldsymbol{x}$ are ellipsoids whose axes are the eigenvectors. <b>Whitening</b> $\\mathbf{W}=\\boldsymbol\\Lambda^{-1/2}\\mathbf{U}^\\top$ maps data to identity covariance.</p><p><b>SVD</b> generalizes to any $m\\times n$ matrix: $\\mathbf{A}=\\mathbf{U}\\boldsymbol\\Sigma\\mathbf{V}^\\top$, where the right singular vectors are the eigenvectors of $\\mathbf{A}^\\top\\mathbf{A}$ with $\\sigma_i^2=\\lambda_i$. The <b>pseudo-inverse</b> $\\mathbf{A}^+=\\mathbf{V}\\boldsymbol\\Sigma^+\\mathbf{U}^\\top$ (invert each $\\sigma_i$) gives the least-squares solution $\\hat{\\boldsymbol{x}}=\\mathbf{A}^+\\boldsymbol{b}$. <b>Eckart–Young:</b> keeping the top $K$ singular triples is the best rank-$K$ approximation, with squared error $\\sum_{k>K}\\sigma_k^2$ — this powers PCA, LSA, recommenders, and compression.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">Eckart–Young: keep the largest singular values</text>
        <line x1="55" y1="160" x2="500" y2="160" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="160" x2="55" y2="40" class="vx-axis" stroke-width="1.5"/>
        <text x="22" y="105" font-size="11" transform="rotate(-90 22 105)" text-anchor="middle">σ value</text>
        <g>
          <rect x="80"  y="48"  width="34" height="112" rx="2" style="fill:var(--good)"/>
          <rect x="134" y="78"  width="34" height="82"  rx="2" style="fill:var(--good)"/>
          <rect x="188" y="104" width="34" height="56"  rx="2" style="fill:var(--good)"/>
          <rect x="242" y="130" width="34" height="30"  rx="2" style="fill:var(--bg-elev2)"/>
          <rect x="296" y="143" width="34" height="17"  rx="2" style="fill:var(--bg-elev2)"/>
          <rect x="350" y="150" width="34" height="10"  rx="2" style="fill:var(--bg-elev2)"/>
          <rect x="404" y="154" width="34" height="6"   rx="2" style="fill:var(--bg-elev2)"/>
          <rect x="458" y="156" width="34" height="4"   rx="2" style="fill:var(--bg-elev2)"/>
        </g>
        <line x1="230" y1="40" x2="230" y2="168" class="vx-grid" stroke-width="1.2" stroke-dasharray="4 4"/>
        <text x="120" y="182" font-size="10.5" style="fill:var(--good)" text-anchor="middle">kept (rank K=3)</text>
        <text x="370" y="182" font-size="10.5" style="fill:var(--text-faint)" text-anchor="middle">discarded → error Σ σ²</text>
      </svg>`,
      caption: "Singular values fall fast; truncating to the top K captures most of the matrix, and the dropped tail (Σ σ² for k>K) is exactly the approximation error.",
      example: "PCA <i>is</i> the SVD of centered data: the top-$K$ right singular vectors are the principal directions. A $1000\\times1000$ image kept at rank $K=50$ stores $\\approx 10\\%$ of the numbers yet looks nearly identical — the small singular values held little signal."
,
      takeaway: "The singular-value spectrum tells you the intrinsic dimensionality of your data, so you can compress, denoise, or pick a PCA component count by reading where the values fall off."
    },
    {
      title: "Condition number κ and why it slows gradient descent",
      tag: "geometry",
      body: "<p>The <b>condition number</b> $\\kappa=\\sigma_{\\max}/\\sigma_{\\min}\\ge1$ measures how stretched a problem is. When $\\kappa\\approx1$ the loss bowl is round; when $\\kappa$ is large the bowl is a long, thin <b>ravine</b> (ill-conditioned).</p><p>Gradient descent always steps along $-\\boldsymbol{g}$, which points across the ravine rather than down it, so the path <b>zig-zags</b>. For a quadratic the per-step error contraction is $\\mu=\\big(\\frac{\\kappa-1}{\\kappa+1}\\big)^2$ — as $\\kappa\\to\\infty$ this $\\to1$, meaning each step barely makes progress. This is the headline cost of bad conditioning, and the motivation for preconditioning, momentum, and second-order methods.</p>",
      visual: `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">GD zig-zags across ill-conditioned (κ ≫ 1) contours</text>
        <!-- elliptical contours centered at minimum (380,150) -->
        <g fill="none" class="vx-grid" stroke-width="1.2">
          <ellipse cx="380" cy="150" rx="300" ry="44"/>
          <ellipse cx="380" cy="150" rx="220" ry="32"/>
          <ellipse cx="380" cy="150" rx="140" ry="20"/>
          <ellipse cx="380" cy="150" rx="64"  ry="9"/>
        </g>
        <!-- minimum -->
        <circle cx="380" cy="150" r="4.5" style="fill:var(--good)"/>
        <text x="380" y="138" text-anchor="middle" font-size="10.5" style="fill:var(--good)">minimum</text>
        <!-- zig-zag descent path from far left -->
        <polyline points="92,96 150,196 214,118 268,178 312,132 344,166 364,140 374,158 380,150"
          fill="none" class="vx-bad" stroke-width="2.5"/>
        <circle cx="92" cy="96" r="4" style="fill:var(--bad)"/>
        <text x="92" y="86" text-anchor="middle" font-size="10.5" style="fill:var(--bad)">start</text>
        <text x="40" y="248" font-size="10.5" style="fill:var(--text-dim)">Long thin valley: −∇f points across the valley, not toward the minimum → slow, bouncing path.</text>
      </svg>`,
      caption: "On stretched contours the negative gradient is nearly perpendicular to the valley floor, so descent oscillates side to side and creeps toward the minimum.",
      example: "If features live on wildly different scales (one in $[0,1]$, another in $[0,10^6]$), the loss is ill-conditioned and plain GD crawls. Standardizing features, or whitening, lowers $\\kappa$ toward $1$ and straightens the path."
,
      takeaway: "When training loss crawls despite a reasonable learning rate, suspect a high $\\kappa$ and fix it by standardizing inputs or preconditioning before reaching for fancier optimizers."
    },
    {
      title: "Convexity, the Hessian & Jensen's inequality",
      tag: "core",
      body: "<p>$f$ is <b>convex</b> if $f(\\lambda\\boldsymbol{x}+(1-\\lambda)\\boldsymbol{y})\\le\\lambda f(\\boldsymbol{x})+(1-\\lambda)f(\\boldsymbol{y})$ — the chord lies above the graph — equivalently the <b>Hessian</b> $\\mathbf{H}=\\nabla^2 f\\succeq0$ (PSD everywhere). <b>Why it matters:</b> for a convex problem <i>every local minimum is global</i>, so any descent method that stops has found the answer. (PD $\\mathbf{H}$ at a point $\\Leftrightarrow$ that point is a local minimum.)</p><p><b>Jensen's inequality</b> is the same fact applied to expectations: $f(\\mathbb{E}[x])\\le\\mathbb{E}[f(x)]$ for convex $f$. It is the workhorse behind two cornerstones — it proves $D_{\\text{KL}}\\ge0$ and it derives the <b>ELBO</b> used by variational inference and EM.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">Convex: chord sits above the curve (Jensen)</text>
        <line x1="55" y1="200" x2="500" y2="200" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="200" x2="55" y2="36" class="vx-axis" stroke-width="1.5"/>
        <!-- convex curve f -->
        <path d="M70,70 C160,196 300,196 470,72" fill="none" class="vx-accent" stroke-width="2.5"/>
        <!-- two points on curve x and y -->
        <circle cx="120" cy="138" r="4" style="fill:var(--accent)"/>
        <circle cx="420" cy="140" r="4" style="fill:var(--accent)"/>
        <!-- chord above -->
        <line x1="120" y1="138" x2="420" y2="140" class="vx-warn" stroke-width="2"/>
        <!-- midpoint comparison -->
        <line x1="270" y1="139" x2="270" y2="190" class="vx-grid" stroke-width="1.2" stroke-dasharray="3 3"/>
        <circle cx="270" cy="139" r="4" style="fill:var(--warn)"/>
        <circle cx="270" cy="186" r="4" style="fill:var(--good)"/>
        <text x="100" y="128" font-size="11" style="fill:var(--accent)">f(x)</text>
        <text x="426" y="132" font-size="11" style="fill:var(--accent)">f(y)</text>
        <text x="278" y="134" font-size="10.5" style="fill:var(--warn)">E[f(x)] (chord)</text>
        <text x="278" y="200" font-size="10.5" style="fill:var(--good)">f(E[x]) (curve)</text>
        <text x="62" y="224" font-size="10.5" style="fill:var(--text-dim)">For convex f: f(E[x]) ≤ E[f(x)]. Strict gap ⇒ KL ≥ 0, with equality only when p = q.</text>
      </svg>`,
      caption: "The curve always dips below its own chords; reading the gap at the midpoint is Jensen's inequality, f(E[x]) ≤ E[f(x)].",
      example: "$f(x)=x^2$ is convex: $\\mathbb{E}[x^2]\\ge(\\mathbb{E}[x])^2$, which is just $\\text{Var}(x)\\ge0$. The same inequality applied to $-\\log$ turns into $D_{\\text{KL}}(p\\|q)\\ge0$, with equality only when $p=q$."
,
      takeaway: "If you can prove your objective is convex, any solver that converges has found the global optimum — so you can stop tuning random restarts and trust the result."
    },
    {
      title: "Gradient descent: step size, momentum, Nesterov",
      tag: "algorithm",
      body: "<p>The general first-order update is $\\boldsymbol\\theta_{t+1}=\\boldsymbol\\theta_t+\\eta_t\\boldsymbol{d}_t$ with a descent direction ($\\boldsymbol{d}^\\top\\boldsymbol{g}<0$); plain <b>gradient descent</b> takes $\\boldsymbol{d}=-\\boldsymbol{g}$. The <b>step size</b> $\\eta$ must be small enough to converge: a constant step is safe when $\\eta<2/L$ ($L$ = Lipschitz constant of $\\nabla\\mathcal{L}$); alternatives are line search or Armijo backtracking. Too large $\\to$ divergence, too small $\\to$ crawl.</p><p><b>Momentum</b> averages past gradients, $\\boldsymbol{m}_t=\\beta\\boldsymbol{m}_{t-1}+\\boldsymbol{g}_{t-1}$ then $\\boldsymbol\\theta_t=\\boldsymbol\\theta_{t-1}-\\eta\\boldsymbol{m}_t$; on a steady slope the effective gradient is amplified by $1/(1-\\beta)$ while oscillation across a ravine cancels. <b>Nesterov</b> evaluates the gradient at a <i>look-ahead</i> point, achieving the optimal $O(1/t^2)$ rate.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">Step size: too small · just right · too large</text>
        <!-- three mini bowls -->
        <g>
          <path d="M30,55 Q90,215 150,55" fill="none" class="vx-grid" stroke-width="2"/>
          <polyline points="48,96 60,115 70,126 78,132 84,134" fill="none" class="vx-warn" stroke-width="2"/>
          <circle cx="84" cy="134" r="3.5" style="fill:var(--warn)"/>
          <text x="90" y="186" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">too small: crawls</text>
        </g>
        <g>
          <path d="M200,55 Q260,215 320,55" fill="none" class="vx-grid" stroke-width="2"/>
          <polyline points="222,103 242,128 260,135" fill="none" class="vx-good" stroke-width="2"/>
          <circle cx="260" cy="135" r="3.5" style="fill:var(--good)"/>
          <text x="260" y="186" text-anchor="middle" font-size="10.5" style="fill:var(--good)">η &lt; 2/L: converges</text>
        </g>
        <g>
          <path d="M370,55 Q430,215 490,55" fill="none" class="vx-grid" stroke-width="2"/>
          <polyline points="430,135 470,99 392,103 478,84 386,92" fill="none" class="vx-bad" stroke-width="2"/>
          <circle cx="386" cy="92" r="3.5" style="fill:var(--bad)"/>
          <text x="430" y="186" text-anchor="middle" font-size="10.5" style="fill:var(--bad)">too large: diverges</text>
        </g>
      </svg>`,
      caption: "Below 2/L the iterates settle into the bowl; above it they overshoot and climb the far wall, spiraling outward.",
      example: "With momentum $\\beta=0.9$, steady-direction gradients are effectively scaled by $1/(1-0.9)=10\\times$, so the optimizer builds speed down a long ravine while the side-to-side bounces cancel out."
,
      takeaway: "Momentum is the cheapest fix for slow, oscillating descent on ravine-shaped losses, which is why nearly every practical optimizer adds it on top of plain gradient steps."
    },
    {
      title: "Second-order methods: Newton, BFGS, trust region",
      tag: "algorithm",
      body: "<p>Second-order methods use curvature. <b>Newton's method</b> $\\boldsymbol\\theta_{t+1}=\\boldsymbol\\theta_t-\\eta_t\\mathbf{H}_t^{-1}\\boldsymbol{g}_t$ pre-multiplies the gradient by $\\mathbf{H}^{-1}$, which <i>undoes the curvature skew</i> — it rescales the stretched ellipse back to a circle and points straight at the minimum. On a quadratic (e.g. linear regression) it converges in <b>one step</b>. The catch: inverting $\\mathbf{H}$ costs $O(D^3)$.</p><p><b>BFGS / L-BFGS</b> avoid that by building an approximation to $\\mathbf{H}^{-1}$ from gradient history; L-BFGS stores only $\\sim5\\text{–}20$ vector pairs and is the default for logistic regression. <b>Trust region</b> $\\boldsymbol\\delta^*=-(\\mathbf{H}+\\lambda\\mathbf{I})^{-1}\\boldsymbol{g}$ (Tikhonov damping) handles an indefinite $\\mathbf{H}$ by limiting the step to a region where the quadratic model is trusted.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700">Gradient: zig-zag</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700">Newton: curvature-corrected</text>
        <!-- left: gradient zig-zag on ellipse -->
        <g transform="translate(0,30)">
          <g fill="none" class="vx-grid" stroke-width="1.1">
            <ellipse cx="150" cy="100" rx="120" ry="34"/>
            <ellipse cx="150" cy="100" rx="78"  ry="22"/>
            <ellipse cx="150" cy="100" rx="38"  ry="11"/>
          </g>
          <circle cx="150" cy="100" r="4" style="fill:var(--good)"/>
          <polyline points="40,66 92,134 134,80 168,124 150,100" fill="none" class="vx-bad" stroke-width="2.5"/>
          <circle cx="40" cy="66" r="3.5" style="fill:var(--bad)"/>
          <text x="40" y="58" text-anchor="middle" font-size="10" style="fill:var(--bad)">start</text>
        </g>
        <!-- right: newton straight shot -->
        <g transform="translate(255,30)">
          <g fill="none" class="vx-grid" stroke-width="1.1">
            <ellipse cx="150" cy="100" rx="120" ry="34"/>
            <ellipse cx="150" cy="100" rx="78"  ry="22"/>
            <ellipse cx="150" cy="100" rx="38"  ry="11"/>
          </g>
          <circle cx="150" cy="100" r="4" style="fill:var(--good)"/>
          <line x1="40" y1="66" x2="150" y2="100" class="vx-accent" stroke-width="2.5"/>
          <circle cx="40" cy="66" r="3.5" style="fill:var(--accent)"/>
          <text x="40" y="58" text-anchor="middle" font-size="10" style="fill:var(--accent)">start</text>
          <text x="96" y="78" font-size="10" style="fill:var(--accent)">one step</text>
        </g>
      </svg>`,
      caption: "H⁻¹ reshapes the elongated bowl into a round one, so Newton aims directly at the minimum where the gradient merely bounces across.",
      example: "For ordinary least squares the Hessian is $\\mathbf{A}^\\top\\mathbf{A}$ (constant), so a single Newton step $-\\mathbf{H}^{-1}\\boldsymbol{g}$ lands exactly on the normal-equations solution $\\hat{\\boldsymbol{x}}=(\\mathbf{A}^\\top\\mathbf{A})^{-1}\\mathbf{A}^\\top\\boldsymbol{b}$ — no iteration needed."
,
      takeaway: "Use L-BFGS for medium-dimensional convex problems like logistic regression where it converges in far fewer steps than SGD; skip true Newton once $D$ is large because the $O(D^3)$ inverse is unaffordable."
    },
    {
      title: "SGD: Robbins–Monro, schedules, Polyak averaging",
      tag: "algorithm",
      body: "<p>For a finite-sum objective, <b>SGD</b> replaces the full gradient with a minibatch estimate $\\boldsymbol\\theta_{t+1}=\\boldsymbol\\theta_t-\\eta_t\\frac{1}{|\\mathcal{B}_t|}\\sum_{n\\in\\mathcal{B}_t}\\nabla\\mathcal{L}_n(\\boldsymbol\\theta_t)$ — cheap per step, noisy per estimate. To converge, the learning rate must satisfy the <b>Robbins–Monro</b> conditions: $\\sum_t\\eta_t=\\infty$ (steps can still reach anywhere) and $\\sum_t\\eta_t^2<\\infty$ (noise eventually dies out).</p><p>Common <b>schedules</b>: step decay, exponential, $\\eta_0/\\sqrt{t}$, or warmup-then-cosine. <b>Polyak averaging</b> $\\bar{\\boldsymbol\\theta}_t=\\frac1t\\sum_i\\boldsymbol\\theta_i$ averages the trajectory and recovers second-order convergence rates; <b>SWA</b> averages weights to find flatter minima, and SVRG/SAGA reduce gradient variance for linear rates on strongly-convex problems.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">Learning-rate schedules (Robbins–Monro)</text>
        <line x1="55" y1="170" x2="500" y2="170" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="170" x2="55" y2="40" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="200" text-anchor="middle" font-size="11">step t →</text>
        <text x="22" y="105" font-size="11" transform="rotate(-90 22 105)" text-anchor="middle">η_t</text>
        <!-- 1/sqrt(t) decay -->
        <path d="M65,52 C140,110 260,148 495,162" fill="none" class="vx-accent" stroke-width="2.5"/>
        <text x="300" y="140" font-size="10.5" style="fill:var(--accent)">η₀/√t</text>
        <!-- exponential decay -->
        <path d="M65,60 C150,150 240,164 495,168" fill="none" class="vx-warn" stroke-width="2" stroke-dasharray="4 3"/>
        <text x="170" y="158" font-size="10.5" style="fill:var(--warn)">exponential</text>
        <!-- warmup then cosine -->
        <path d="M65,150 C90,70 110,58 150,58 C260,58 330,150 495,164" fill="none" class="vx-good" stroke-width="2.5"/>
        <text x="120" y="50" font-size="10.5" style="fill:var(--good)">warmup→cosine</text>
        <text x="62" y="216" font-size="10.5" style="fill:var(--text-dim)">Σ η_t = ∞ keeps moving; Σ η_t² &lt; ∞ kills the minibatch noise.</text>
      </svg>`,
      caption: "All three decay so the noise term vanishes, but their early shape differs — warmup ramps up first, then cosine anneals down.",
      example: "A constant learning rate violates $\\sum\\eta_t^2<\\infty$, so SGD never settles — it bounces around the optimum forever. Decaying as $\\eta_0/\\sqrt{t}$ satisfies both Robbins–Monro conditions, and Polyak-averaging the late iterates further smooths the estimate."
,
      takeaway: "If your loss plateaus while still noisy, decay the learning rate (or average late weights) instead of just training longer — a flat schedule keeps SGD rattling around the optimum forever."
    },
    {
      title: "Adaptive optimizers: AdaGrad, RMSProp, Adam",
      tag: "algorithm",
      body: "<p>Adaptive methods give each parameter its <i>own</i> effective step by dividing by a running measure of its past gradient magnitude — a cheap per-dimension preconditioner. <b>AdaGrad</b> scales by $1/\\sqrt{\\sum_{i\\le t}g_{i,d}^2}$: great for sparse features, but the denominator only grows, so the learning rate decays toward $0$ and stalls. <b>RMSProp</b> fixes this by using an exponential moving average of $g_d^2$ instead of a sum, so the scale tracks recent curvature.</p><p><b>Adam</b> combines both: a momentum term $\\boldsymbol{m}_t$ (the gradient EMA) divided by $\\sqrt{\\boldsymbol{s}_t}$ (the squared-gradient EMA), both bias-corrected, with defaults $\\beta_1=0.9,\\ \\beta_2=0.999$. It is the de-facto default for deep nets.</p>",
      visual: `<svg viewBox="0 0 520 215" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">Per-dimension scaling: building up to Adam</text>
        <g font-size="11">
          <rect x="20" y="44" width="150" height="48" rx="6" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <text x="95" y="64" text-anchor="middle" font-weight="700" style="fill:var(--text)">AdaGrad</text>
          <text x="95" y="82" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">÷ √(Σ g²) · decays to 0</text>
        </g>
        <g font-size="11">
          <rect x="186" y="44" width="150" height="48" rx="6" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <text x="261" y="64" text-anchor="middle" font-weight="700" style="fill:var(--text)">RMSProp</text>
          <text x="261" y="82" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">÷ √(EMA g²) · no decay</text>
        </g>
        <g font-size="11">
          <rect x="352" y="44" width="150" height="48" rx="6" style="fill:var(--accent)"/>
          <text x="427" y="64" text-anchor="middle" font-weight="700" style="fill:#04101f">Adam</text>
          <text x="427" y="82" text-anchor="middle" font-size="10" style="fill:#04101f">momentum ÷ √(EMA g²)</text>
        </g>
        <line x1="170" y1="68" x2="186" y2="68" class="vx-accent" stroke-width="2" marker-end="url(#ar)"/>
        <line x1="336" y1="68" x2="352" y2="68" class="vx-accent" stroke-width="2" marker-end="url(#ar)"/>
        <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--accent)"/></marker></defs>
        <text x="261" y="138" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">Adam = RMSProp's adaptive scale + momentum + bias correction</text>
        <text x="261" y="166" text-anchor="middle" font-size="11" style="fill:var(--text)">defaults: β₁ = 0.9 · β₂ = 0.999</text>
        <text x="261" y="190" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">bias correction matters most in the first few steps</text>
      </svg>`,
      caption: "Each method adds one idea to the last; Adam is RMSProp's recency-weighted scaling plus a momentum numerator, both bias-corrected.",
      example: "AdaGrad shines on a bag-of-words model where rare words get few updates but large effective steps; on a deep net its denominator grows without bound and training stalls, so RMSProp's EMA — and ultimately Adam with $\\beta_2=0.999$ — is preferred."
,
      takeaway: "Reach for Adam as the no-tuning default to get deep nets training fast, but try well-tuned SGD-with-momentum when you need the last bit of generalization, since Adam can settle into sharper minima."
    },
    {
      title: "Constrained optimization: Lagrangian, KKT, proximal",
      tag: "core",
      body: "<p>To optimize under constraints, form the <b>Lagrangian</b> $L(\\boldsymbol\\theta,\\boldsymbol\\lambda)=\\mathcal{L}+\\sum_j\\lambda_j h_j$. The <b>KKT conditions</b> are necessary at any optimum (and sufficient when the problem is convex):</p><ol><li><b>Stationarity:</b> $\\nabla\\mathcal{L}+\\sum_i\\mu_i\\nabla g_i+\\sum_j\\lambda_j\\nabla h_j=0$</li><li><b>Primal feasibility:</b> $g_i\\le0,\\ h_j=0$</li><li><b>Dual feasibility:</b> $\\mu_i\\ge0$</li><li><b>Complementary slackness:</b> $\\mu_i g_i=0$ (a constraint is either tight or its multiplier is $0$)</li></ol><p>Special cases: <b>LP</b> (linear objective + constraints) has its optimum at a polytope vertex (simplex / interior-point); a convex <b>QP</b> $\\frac12\\boldsymbol\\theta^\\top\\mathbf{H}\\boldsymbol\\theta+\\boldsymbol{c}^\\top\\boldsymbol\\theta$ underlies the SVM dual, Lasso, and ridge. For $\\mathcal{L}=\\mathcal{L}_{\\text{smooth}}+\\mathcal{L}_{\\text{nonsmooth}}$, <b>proximal / projected gradient</b> takes a gradient step then applies a prox/projection; the <b>L1 prox is soft-thresholding</b> $\\text{sign}(\\theta)(|\\theta|-\\lambda)_+$ — the engine inside Lasso.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">L1 prox = soft-thresholding</text>
        <line x1="55" y1="110" x2="495" y2="110" class="vx-axis" stroke-width="1.5"/>
        <line x1="275" y1="30" x2="275" y2="185" class="vx-axis" stroke-width="1.5"/>
        <text x="486" y="126" font-size="10.5" style="fill:var(--text-dim)">θ in</text>
        <text x="282" y="42" font-size="10.5" style="fill:var(--text-dim)">θ out</text>
        <!-- identity (faint) -->
        <line x1="95" y1="190" x2="455" y2="30" class="vx-grid" stroke-width="1.2" stroke-dasharray="4 4"/>
        <!-- soft-threshold curve: flat dead zone then shifted slope -->
        <polyline points="95,163 215,110 335,110 455,57" fill="none" class="vx-accent" stroke-width="2.5"/>
        <!-- dead zone markers -->
        <line x1="215" y1="110" x2="215" y2="118" class="vx-warn" stroke-width="2"/>
        <line x1="335" y1="102" x2="335" y2="110" class="vx-warn" stroke-width="2"/>
        <text x="275" y="134" text-anchor="middle" font-size="10" style="fill:var(--warn)">|θ| ≤ λ → 0</text>
        <text x="200" y="98" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">−λ</text>
        <text x="350" y="128" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">+λ</text>
        <text x="430" y="60" font-size="10" style="fill:var(--accent)">slope 1, shrunk by λ</text>
      </svg>`,
      caption: "Soft-thresholding zeros out any input within ±λ (the dead zone) and shrinks the rest toward zero by λ — exactly how proximal Lasso creates sparsity each step.",
      example: "An equality-constrained least squares fit is solved by KKT stationarity + feasibility (a linear system in $\\boldsymbol\\theta$ and $\\boldsymbol\\lambda$). Complementary slackness explains SVM support vectors: only points <i>on</i> the margin ($g_i=0$) get nonzero multipliers $\\mu_i$; all others have $\\mu_i=0$ and do not affect the solution."
,
      takeaway: "KKT is your checklist for verifying a constrained optimum by hand, and complementary slackness tells you which constraints are actually binding — the ones worth relaxing if you want a better objective."
    },
    {
      title: "EM as bound optimization (the ELBO)",
      tag: "intuition",
      body: "<p>When data has latent variables, the log-likelihood $\\ell(\\boldsymbol\\theta)=\\sum_n\\log\\sum_{\\boldsymbol{z}_n}p(\\boldsymbol{y}_n,\\boldsymbol{z}_n\\mid\\boldsymbol\\theta)$ has a log-of-sum that is hard to optimize directly. <b>EM</b> introduces a variational distribution $q_n$ and applies Jensen to get a tractable lower bound, the <b>ELBO</b>:</p><p>$$\\ell(\\boldsymbol\\theta)\\ge\\sum_n\\mathbb{E}_{q_n}[\\log p(\\boldsymbol{y}_n,\\boldsymbol{z}_n\\mid\\boldsymbol\\theta)]+\\mathbb{H}(q_n)$$</p><p>Then it alternates: the <b>E-step</b> sets $q_n^*=p(\\boldsymbol{z}_n\\mid\\boldsymbol{y}_n,\\boldsymbol\\theta)$, which makes the bound <i>touch</i> the curve at the current $\\boldsymbol\\theta$; the <b>M-step</b> maximizes the expected complete-data log-likelihood over $\\boldsymbol\\theta$, pushing the bound (and thus $\\ell$) up. Because each step never lowers $\\ell$, EM <b>guarantees monotone improvement</b> $\\ell(\\boldsymbol\\theta^{t+1})\\ge\\ell(\\boldsymbol\\theta^t)$ and converges to a local maximum.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">EM: E-step tightens, M-step climbs</text>
        <line x1="55" y1="200" x2="500" y2="200" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="200" x2="55" y2="36" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="228" text-anchor="middle" font-size="11">θ →</text>
        <text x="22" y="118" font-size="11" transform="rotate(-90 22 118)" text-anchor="middle">log-likelihood</text>
        <!-- true likelihood curve -->
        <path d="M70,170 C170,70 290,52 410,70 C450,76 475,86 490,96" fill="none" class="vx-accent" stroke-width="2.5"/>
        <!-- first ELBO bound, tight at theta_t -->
        <path d="M105,192 C150,118 182,86 200,86 C218,86 250,150 300,194" fill="none" class="vx-good" stroke-width="2"/>
        <circle cx="200" cy="86" r="4.5" style="fill:var(--good)"/>
        <line x1="200" y1="86" x2="200" y2="200" class="vx-grid" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="200" y="214" text-anchor="middle" font-size="10" style="fill:var(--good)">θᵗ</text>
        <text x="92" y="150" font-size="10" style="fill:var(--good)">ELBO (E-step: touches)</text>
        <!-- M-step moves to new theta, higher on curve -->
        <circle cx="300" cy="65" r="4.5" style="fill:var(--warn)"/>
        <line x1="300" y1="65" x2="300" y2="200" class="vx-grid" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="300" y="214" text-anchor="middle" font-size="10" style="fill:var(--warn)">θᵗ⁺¹</text>
        <path d="M204,84 C240,76 275,68 298,66" fill="none" class="vx-warn" stroke-width="1.6" marker-end="url(#em)"/>
        <defs><marker id="em" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--warn)"/></marker></defs>
        <text x="318" y="58" font-size="10" style="fill:var(--warn)">M-step: maximize bound</text>
      </svg>`,
      caption: "The E-step builds a lower bound (green) that kisses the true likelihood (blue) at θᵗ; the M-step jumps to that bound's peak θᵗ⁺¹, which can only sit higher on the curve — hence monotone progress.",
      example: "Fitting a Gaussian mixture: the E-step computes soft cluster responsibilities $q_n=p(z_n\\mid y_n,\\boldsymbol\\theta)$, and the M-step re-estimates each component's mean, covariance, and weight from those responsibilities. Likelihood rises every iteration until it plateaus at a local optimum."
,
      takeaway: "EM's monotone-improvement guarantee makes it a safe, debuggable default for latent-variable models, but its local-optimum trap means you should still run several random initializations and keep the best."
    }
  ]
};
