/* Review: Stochastic & Population Optimization */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["opt-stochastic"] = {
  intro: "When the objective is a narrow ravine, a black box, or riddled with local minima, plain gradient descent struggles. This batch covers the escape routes: the first-order optimizer catalog that smooths and adapts the gradient step, the log-derivative trick that lets you differentiate <i>through a distribution</i>, and the derivative-free family — cross-entropy, evolution strategies, genetic/population, pattern search, and simulated annealing. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "The first-order optimizer catalog",
      tag: "algorithm",
      body: "<p>All first-order methods take the descent direction from the gradient $\\mathbf{g}$ — they differ in how they <i>shape</i> it. <b>Steepest descent</b> uses $\\mathbf{d}=-\\mathbf{g}/\\|\\mathbf{g}\\|$; with exact line search consecutive directions are orthogonal, so it <b>zig-zags</b> in narrow valleys. <b>Conjugate gradient</b> blends in the last direction, $\\mathbf{d}^{(k)}=-\\mathbf{g}^{(k)}+\\beta^{(k)}\\mathbf{d}^{(k-1)}$ (Fletcher–Reeves or Polak–Ribière $\\beta$), solving an $n$-dim quadratic in $n$ steps. <b>Hypergradient descent</b> even tunes the step factor itself by gradient descent: $\\alpha^{(k)}=\\alpha^{(k-1)}+\\mu\\,\\mathbf{g}^{(k)\\top}\\mathbf{g}^{(k-1)}$.</p>",
      example: "On a long narrow valley, normalized steepest descent with exact line search bounces wall-to-wall because each step lands where the new gradient is orthogonal to the last — the classic zig-zag that conjugate gradient and momentum are designed to cure.",
      takeaway: "When plain gradient descent crawls in ill-conditioned valleys, reaching for conjugate gradient or momentum is what turns hundreds of zig-zag steps into a handful."
    },
    {
      title: "Momentum & Nesterov",
      tag: "algorithm",
      body: "<p><b>Momentum</b> accumulates a velocity that damps oscillation across a ravine and accelerates along its floor: $\\mathbf{v}\\leftarrow\\beta\\mathbf{v}-\\alpha\\mathbf{g}$, then $\\mathbf{x}\\leftarrow\\mathbf{x}+\\mathbf{v}$. The decay $\\beta$ sets how much past motion carries forward. <b>Nesterov</b> sharpens this with a <i>look-ahead</i>: it evaluates the gradient at the projected point $\\mathbf{x}+\\beta\\mathbf{v}$ rather than at $\\mathbf{x}$, so it can 'see' a wall coming and correct sooner.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Narrow ravine: vanilla GD vs momentum</text>
        <ellipse cx="280" cy="125" rx="210" ry="70" fill="none" class="vx-grid" stroke-width="1"/>
        <ellipse cx="280" cy="125" rx="140" ry="40" fill="none" class="vx-grid" stroke-width="1"/>
        <ellipse cx="280" cy="125" rx="70" ry="18" fill="none" class="vx-grid" stroke-width="1"/>
        <circle cx="280" cy="125" r="4" style="fill:var(--accent)"/>
        <text x="288" y="121" font-size="10.5" style="fill:var(--accent)">optimum</text>
        <polyline points="70,70 110,178 150,78 192,172 232,90 270,160 300,108 280,125" fill="none" class="vx-bad" stroke-width="2"/>
        <path d="M70,180 C150,150 210,138 280,125" fill="none" class="vx-good" stroke-width="2.5"/>
        <circle cx="70" cy="70" r="3.5" style="fill:var(--bad)"/>
        <circle cx="70" cy="180" r="3.5" style="fill:var(--good)"/>
        <g font-size="11"><rect x="120" y="205" width="12" height="3" style="fill:var(--bad)"/><text x="138" y="209">vanilla GD (zig-zag)</text><rect x="300" y="205" width="12" height="3" style="fill:var(--good)"/><text x="318" y="209">momentum</text></g>
      </svg>`,
      caption: "Velocity cancels the across-ravine oscillation and reinforces the along-ravine direction — a smooth path instead of a zig-zag.",
      example: "In a ravine elongated along one axis, vanilla GD oscillates across the steep walls while creeping along the flat floor; momentum's velocity term cancels the cross-axis bounce and builds speed down the floor, reaching the optimum in far fewer steps.",
      takeaway: "Momentum is the cheapest fix for oscillating descent, and Nesterov's look-ahead is what keeps that accumulated speed from overshooting near the bottom."
    },
    {
      title: "Adaptive learning rates: AdaGrad → RMSProp → Adam",
      tag: "algorithm",
      body: "<p>Adaptive methods give each parameter its <i>own</i> effective rate from its gradient history. <b>AdaGrad</b> divides by $\\epsilon+\\sqrt{\\sum_j g_i^{(j)2}}$ — great for sparse gradients, but the denominator only grows, so the rate decays too far. <b>RMSProp</b> fixes this with a <i>decaying</i> average of squared gradients; <b>Adadelta</b> also removes the step-factor parameter. <b>Adam</b> combines momentum (first moment $\\mathbf{v}$) with an RMSProp second moment $\\mathbf{s}$, bias-corrects both, then steps $\\mathbf{x}\\leftarrow\\mathbf{x}-\\alpha\\hat{\\mathbf{v}}/(\\epsilon+\\sqrt{\\hat{\\mathbf{s}}})$. Defaults: $\\alpha=0.001$, $\\gamma_v=0.9$, $\\gamma_s=0.999$.</p>",
      example: "Adam's defaults $(0.001, 0.9, 0.999)$ mean the first moment averages over roughly the last ten gradients while the second moment averages over hundreds — a fast-moving direction estimate normalized by a slow-moving scale estimate.",
      takeaway: "Adam is the safe default for training neural nets because per-parameter scaling means one learning rate works across wildly different gradient magnitudes without hand-tuning."
    },
    {
      title: "The log-derivative (likelihood-ratio) trick",
      tag: "core",
      body: "<p>How do you take a gradient of an expectation when the objective $f$ is a black box? Push the derivative onto the <i>distribution</i>: $\\nabla_\\theta\\mathbb{E}_{\\mathbf{x}\\sim p(\\cdot\\mid\\theta)}[f(\\mathbf{x})]=\\mathbb{E}_{\\mathbf{x}\\sim p}[f(\\mathbf{x})\\,\\nabla_\\theta\\log p(\\mathbf{x}\\mid\\theta)]$, estimated by a sample mean. It needs only $\\nabla_\\theta\\log p$ — never $\\nabla f$. For a stochastic policy's trajectory the transition model cancels: $\\nabla_\\theta\\log p_\\theta(\\tau)=\\sum_k\\nabla_\\theta\\log\\pi_\\theta(a^{(k)}\\mid s^{(k)})$. The estimator is <b>unbiased but high variance</b> (reduce with baselines / reward-to-go).</p>",
      example: "To optimize a non-differentiable reward (say a simulator's score), sample actions from $\\pi_\\theta$, weight each sample's $\\nabla_\\theta\\log\\pi_\\theta$ by its reward, and average. You never differentiate the simulator — only the policy's log-probability. This is exactly the REINFORCE / NES gradient.",
      takeaway: "This trick is what makes policy-gradient RL and black-box objectives optimizable at all; without variance reduction (baselines, reward-to-go) the noisy estimate makes training painfully slow."
    },
    {
      title: "The cross-entropy method",
      tag: "algorithm",
      body: "<p>A derivative-free loop over a <b>proposal distribution</b> $p(\\cdot\\mid\\psi)$, often a multivariate normal. Each iteration: (1) sample $m$ points, (2) keep the $m_{\\text{elite}}$ best, (3) <b>refit $\\psi$ to the elites by MLE</b> — equivalent to minimizing cross-entropy / KL to the elite set. For an MVN that is just $\\mu\\leftarrow$ mean of elites, $\\Sigma\\leftarrow$ their covariance. The proposal contracts onto the optima. Pitfalls: too few elites → <b>premature convergence</b>; a unimodal proposal can't capture a multimodal objective (use mixtures).</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Proposal contracting & shifting onto the optimum</text>
        <line x1="40" y1="185" x2="500" y2="185" class="vx-axis" stroke-width="1.5"/>
        <line x1="430" y1="185" x2="430" y2="55" stroke-dasharray="4 4" class="vx-grid" stroke-width="1"/>
        <text x="430" y="50" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">optimum</text>
        <path d="M55,185 C140,182 150,150 200,150 C250,150 260,182 345,185" fill="none" class="vx-grid" stroke-width="2"/>
        <text x="200" y="142" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">iter 1</text>
        <path d="M250,185 C320,182 330,120 370,120 C410,120 420,182 470,185" fill="none" class="vx-accent" stroke-width="2"/>
        <text x="370" y="112" text-anchor="middle" font-size="10" style="fill:var(--accent)">iter 2</text>
        <path d="M385,185 C415,184 423,72 430,72 C437,72 445,184 475,185" fill="none" class="vx-good" stroke-width="2.5"/>
        <text x="430" y="66" text-anchor="middle" font-size="10" style="fill:var(--good)">iter 3</text>
        <text x="40" y="212" font-size="10.5" style="fill:var(--text-dim)">Each refit on the elites narrows σ and shifts μ toward the best samples.</text>
      </svg>`,
      caption: "Sample → keep elites → refit by MLE: the Gaussian both narrows (σ shrinks) and shifts (μ moves) onto the optimum over a few iterations.",
      example: "With $m=100$ samples and $m_{\\text{elite}}=10$, you fit the next Gaussian to the top 10 points. Drop to $m_{\\text{elite}}=2$ and the covariance collapses almost immediately — premature convergence to whatever those two points found.",
      takeaway: "Cross-entropy is a dead-simple derivative-free baseline worth trying first, but your elite count is the dial between thorough exploration and collapsing onto the first decent basin you find."
    },
    {
      title: "Evolution strategies, NES & CMA-ES",
      tag: "algorithm",
      body: "<p>Like the cross-entropy method, but the proposal $\\psi$ is updated by a <b>gradient step</b> (via the log-derivative trick) instead of refitting to elites. <b>NES</b> with an isotropic $\\sigma^2\\mathbf{I}$ uses $\\frac1\\sigma\\mathbb{E}_{\\epsilon\\sim\\mathcal{N}(0,I)}[U(\\psi+\\sigma\\epsilon)\\,\\epsilon]$; <b>rank shaping</b> replaces raw utilities with rank-based weights to blunt outliers, and <b>mirrored sampling</b> (evaluate $\\pm\\epsilon$ in pairs) halves variance. <b>CMA-ES</b> adapts a mean $\\mu$, covariance $\\Sigma$, and a separate step size $\\sigma$ (sampling $\\mathcal{N}(\\mu,\\sigma^2\\Sigma)$); $\\sigma$ is steered by a cumulation path and $\\Sigma$ by rank-one + rank-$m_{\\text{elite}}$ updates. It's one of the strongest black-box optimizers.</p>",
      example: "Mirrored sampling: instead of drawing $\\epsilon_1,\\dots,\\epsilon_m$ independently, draw $\\epsilon$ and use both $+\\epsilon$ and $-\\epsilon$. The antithetic pair cancels the linear part of the noise in the gradient estimate, cutting its variance for free.",
      takeaway: "CMA-ES is the go-to when you have no gradient and up to a few hundred well-behaved continuous parameters; its self-adapting covariance is what handles ill-conditioned, correlated objectives."
    },
    {
      title: "Genetic, population & local (derivative-free) search",
      tag: "algorithm",
      body: "<p><b>Population methods</b> evolve $m$ individuals per generation — the spread avoids local minima and parallelizes naturally. A <b>genetic algorithm</b> = <i>selection</i> (truncation / tournament / roulette) + <i>crossover</i> (single / two-point / uniform / interpolation) + <i>mutation</i> (rate $\\approx 1/m$, e.g. add Gaussian noise) + <i>elitism</i>. Cousins: differential evolution ($\\mathbf{z}=\\mathbf{a}+w(\\mathbf{b}-\\mathbf{c})$), particle swarm, firefly, cuckoo (Lévy flights); <b>memetic/hybrid</b> = population + local search. <b>Pattern / local search</b> (derivative-free) covers Hooke-Jeeves ($\\pm\\alpha$ per coordinate, shrink $\\alpha$ when stuck), generalized pattern search (any <i>positive spanning set</i> guarantees a descent direction), and the Nelder-Mead simplex (reflect / expand / contract / shrink).</p>",
      example: "A genetic algorithm on a string genome: select parents by tournament, cross them at a random point, flip each bit with probability $\\approx 1/m$, and copy the single best individual unchanged (elitism) so the best fitness can never regress between generations.",
      takeaway: "Population methods shine on discrete, combinatorial, or rugged spaces where gradients don't exist, and elitism is the cheap insurance that your best solution never degrades across generations."
    },
    {
      title: "Simulated annealing",
      tag: "algorithm",
      body: "<p>A single-point method that can move <i>uphill</i> to escape local minima. A temperature $t$ controls stochasticity — high $t$ explores freely, cooling makes it converge. From a transition distribution propose a candidate $\\mathbf{x}'$; accept it under the <b>Metropolis rule</b>: probability $1$ if $\\Delta y\\le0$ (downhill always taken), else $e^{-\\Delta y/t}$. So uphill moves are accepted often when hot and rarely when cold. Cooling <b>schedules</b>: <i>logarithmic</i> (carries a global-optimum guarantee but is very slow), <i>exponential</i> $t\\leftarrow\\gamma t$, and <i>fast</i> $t^{(1)}/k$.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Uphill move escapes a local minimum</text>
        <path d="M30,70 C90,70 110,140 150,140 C190,140 210,95 250,95 C300,95 320,200 400,200 C450,200 470,150 500,150" fill="none" class="vx-axis" stroke-width="2"/>
        <text x="150" y="160" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">local min</text>
        <text x="400" y="220" text-anchor="middle" font-size="10" style="fill:var(--good)">global min</text>
        <circle cx="150" cy="140" r="6" style="fill:var(--warn)"/>
        <path d="M158,135 C185,118 205,100 243,97" fill="none" class="vx-warn" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#ar)"/>
        <text x="200" y="80" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">uphill: accept w.p. e^(−Δy/t)</text>
        <circle cx="250" cy="95" r="5" style="fill:var(--bg-elev2)" class="vx-warn"/>
        <path d="M258,100 C300,130 330,195 392,199" fill="none" class="vx-good" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arg)"/>
        <text x="345" y="135" text-anchor="middle" font-size="10.5" style="fill:var(--good)">then downhill to the global min</text>
        <defs>
          <marker id="ar" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--warn)"/></marker>
          <marker id="arg" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--good)"/></marker>
        </defs>
      </svg>`,
      caption: "Trapped in a shallow local minimum, the ball takes an uphill step (accepted with probability e^(−Δy/t)), clears the barrier, then rolls down to the global minimum.",
      example: "With $\\Delta y=2$ and a hot $t=10$, an uphill move is accepted with probability $e^{-2/10}\\approx0.82$ — easy to escape a shallow trap. Cool to $t=0.5$ and the same move is accepted with probability $e^{-4}\\approx0.018$, so the search settles into the basin it has found.",
      takeaway: "Simulated annealing's uphill moves are how you escape local minima a greedy method gets stuck in, and the cooling schedule is the explore-then-exploit dial you must tune per problem."
    },
    {
      title: "Stochastic-method specifics: noisy descent, MADS, MeZO",
      tag: "algorithm",
      body: "<p><b>Noisy descent</b> adds decaying Gaussian noise to each gradient step so the iterate can jiggle out of a local optimum — SGD-style, with a schedule satisfying $\\sum\\alpha=\\infty,\\ \\sum\\alpha^2<\\infty$ (large enough to keep moving, shrinking fast enough to settle). <b>Mesh adaptive direct search (MADS)</b> generalizes generalized pattern search: instead of a fixed positive-spanning set it polls along <i>random</i> positive-spanning directions on a mesh whose mesh/step sizes are a power of $4$ (the mesh refines faster than the poll step, giving dense direction coverage). <b>Memory-efficient zeroth-order (MeZO)</b> applies an SPSA-style two-point estimate $\\frac{f(\\mathbf{x}+\\epsilon\\mathbf{z})-f(\\mathbf{x}-\\epsilon\\mathbf{z})}{2\\epsilon}\\mathbf{z}$ <i>in place</i>: it never stores the perturbation vector $\\mathbf{z}$, instead reusing the saved RNG seed to regenerate $\\mathbf{z}$ on the fly during the update (≈$12\\times$ memory reduction — used to fine-tune LLMs without ever materializing a gradient).</p>",
      example: "Fine-tuning a large language model with MeZO: a normal backprop step must hold a full gradient the size of the model in memory. MeZO instead does two forward passes with $\\pm\\epsilon\\mathbf{z}$, then walks the weights in-place by regenerating $\\mathbf{z}$ from the stored seed — so peak memory is roughly just the model itself, about $12\\times$ less than gradient-based fine-tuning.",
      takeaway: "MeZO is what lets you fine-tune a model that wouldn't otherwise fit in GPU memory, trading many more iterations for roughly a $12\\times$ smaller memory footprint."
    }
  ]
};
