/* Review: Approximate Inference & Graphical/Sequential Models */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["inference-graphical"] = {
  intro: "Exact Bayesian posteriors $p(\\boldsymbol\\theta\\mid\\mathcal{D})$ need the intractable normalizer $p(\\mathcal{D})$, so most of the work is <i>approximating</i> it — Laplace, Monte Carlo, MCMC, variational — each trading accuracy for speed. The second half turns to <b>structure</b>: graphical models that encode conditional independence, and the sequential models (Markov chains, HMMs, Kalman filters, CRFs) built on them. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Why approximate inference? The intractable normalizer",
      tag: "core",
      body: "<p>Bayes' rule gives the posterior $p(\\boldsymbol\\theta\\mid\\mathcal{D})=\\dfrac{p(\\mathcal{D}\\mid\\boldsymbol\\theta)\\,p(\\boldsymbol\\theta)}{p(\\mathcal{D})}$, but the denominator — the <b>marginal likelihood</b> / <b>evidence</b> — is an integral over <i>all</i> parameter settings:</p><p style=\"text-align:center\">$p(\\mathcal{D})=\\int p(\\mathcal{D}\\mid\\boldsymbol\\theta)\\,p(\\boldsymbol\\theta)\\,d\\boldsymbol\\theta$</p><p>This is closed-form only under <b>conjugacy</b>. Otherwise the integral is intractable, so we never compute the true posterior — we <i>approximate</i> it. The numerator $\\tilde p(\\boldsymbol\\theta)=p(\\mathcal{D}\\mid\\boldsymbol\\theta)p(\\boldsymbol\\theta)$ (the <b>unnormalized</b> posterior) is cheap; the whole game is dealing with the missing $Z=p(\\mathcal{D})$.</p>",
      example: "For a Gaussian likelihood with a Gaussian prior on the mean, conjugacy makes the posterior Gaussian and $p(\\mathcal{D})$ analytic. Swap in a logistic likelihood and the integral has no closed form — you must approximate.",
      takeaway: "This single integral is why Bayesian ML needs a whole toolbox: the moment you leave conjugate models, you pick an approximation or you get nothing."
    },
    {
      title: "The methods spectrum: exact → Laplace → MC → MCMC → VI",
      tag: "core",
      body: "<p>The approximation toolbox trades accuracy against speed and scale:</p><ul><li><b>Exact</b> (conjugacy / message passing) — exact, but rarely available.</li><li><b>Laplace</b> — a Gaussian at the MAP; cheap but unimodal.</li><li><b>Monte Carlo</b> — i.i.d. samples; asymptotically exact, hard in high dimension.</li><li><b>MCMC</b> — correlated samples from a Markov chain; general and asymptotically exact, but slow.</li><li><b>Variational</b> — optimize a tractable $q\\approx p$; fast, but biased by the chosen family.</li></ul><p>The broad split: <b>sampling</b> methods (MC/MCMC) are accurate-but-slow; <b>optimization</b> methods (Laplace/VI) are fast-but-biased.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">accuracy ↔ speed trade-off</text>
        <line x1="55" y1="170" x2="495" y2="170" class="vx-axis" stroke-width="1.5"/>
        <text x="60" y="190" font-size="10.5" style="fill:var(--text-faint)">slower, more exact</text>
        <text x="490" y="190" font-size="10.5" text-anchor="end" style="fill:var(--text-faint)">faster, more biased</text>
        <g font-size="11" text-anchor="middle">
          <circle cx="90" cy="120" r="6" style="fill:var(--good)"/><text x="90" y="105">Exact</text>
          <circle cx="190" cy="120" r="6" style="fill:var(--good)"/><text x="190" y="105">MCMC</text>
          <circle cx="290" cy="120" r="6" style="fill:var(--accent)"/><text x="290" y="105">Monte Carlo</text>
          <circle cx="390" cy="120" r="6" style="fill:var(--warn)"/><text x="390" y="105">Laplace</text>
          <circle cx="470" cy="120" r="6" style="fill:var(--warn)"/><text x="470" y="148">VI</text>
        </g>
        <text x="125" y="50" font-size="11" style="fill:var(--good)">sampling: accurate</text>
        <text x="510" y="50" font-size="11" text-anchor="end" style="fill:var(--warn)">optimization: fast</text>
        <line x1="55" y1="58" x2="290" y2="58" class="vx-good" stroke-width="2"/>
        <line x1="300" y1="58" x2="495" y2="58" class="vx-warn" stroke-width="2"/>
      </svg>`,
      caption: "Left = sampling (slow, asymptotically exact); right = optimization (fast, biased by approximation).",
      example: "Need calibrated uncertainty on a moderate-dimensional model and have compute to spare? Reach for MCMC. Fitting a deep latent model on millions of points? Variational inference is the only thing that scales.",
      takeaway: "Knowing this spectrum turns method choice into a deliberate accuracy-vs-budget decision instead of defaulting to whatever your library happens to expose."
    },
    {
      title: "Laplace approximation: a Gaussian at the MAP",
      tag: "method",
      body: "<p>Write the posterior as $\\propto e^{-E(\\boldsymbol\\theta)}$ with <b>energy</b> $E=-\\log p(\\mathcal{D}\\mid\\boldsymbol\\theta)-\\log p(\\boldsymbol\\theta)$. Take a second-order Taylor expansion at the MAP $\\boldsymbol\\theta^*$ (where $\\nabla E=0$). The result is a Gaussian whose covariance is the inverse Hessian of the energy:</p><p style=\"text-align:center\">$p(\\boldsymbol\\theta\\mid\\mathcal{D})\\approx\\mathcal{N}(\\boldsymbol\\theta^*,\\mathbf{H}^{-1}),\\quad \\mathbf{H}=\\nabla^2 E|_{\\boldsymbol\\theta^*}$</p><p>It also yields an evidence estimate; with a flat prior and $N$ i.i.d. points this recovers <b>BIC</b>: $\\log p(\\mathcal{D})\\approx\\log p(\\mathcal{D}\\mid\\hat\\theta)-\\tfrac{D}{2}\\log N$. Justified because posteriors Gaussian-ize as $N$ grows (<b>Bernstein–von Mises</b>), but poor for skewed or multimodal posteriors.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="40" y1="170" x2="495" y2="170" class="vx-axis" stroke-width="1.5"/>
        <text x="490" y="190" font-size="11" text-anchor="end">θ →</text>
        <path d="M50,170 C140,168 175,40 210,40 C230,40 235,150 270,160 C300,168 330,70 360,70 C390,70 410,168 485,168" fill="none" class="vx-grid" stroke-width="2"/>
        <path d="M120,170 C175,170 185,45 210,45 C235,45 245,170 300,170" fill="none" class="vx-accent" stroke-width="2.5"/>
        <line x1="210" y1="170" x2="210" y2="40" stroke-dasharray="4 4" class="vx-grid"/>
        <circle cx="210" cy="40" r="4" style="fill:var(--accent)"/>
        <text x="216" y="36" font-size="11" style="fill:var(--accent)">MAP θ*</text>
        <text x="120" y="30" font-size="11" style="fill:var(--text-dim)">true posterior (grey)</text>
        <text x="305" y="120" font-size="11" style="fill:var(--accent)">Gaussian fit at peak</text>
        <text x="350" y="100" font-size="10.5" style="fill:var(--text-faint)">missed 2nd mode →</text>
      </svg>`,
      caption: "Laplace plants a single Gaussian on the dominant peak — it ignores any other mode.",
      example: "Laplace turns a logistic-regression posterior into $\\mathcal{N}(\\boldsymbol\\theta^*,\\mathbf{H}^{-1})$ cheaply, giving error bars 'for free' from curvature — but if the true posterior has two well-separated modes it captures only one.",
      takeaway: "Reach for Laplace when you already have a MAP fit and want quick uncertainty for almost no extra code; distrust it when the posterior is skewed or multimodal."
    },
    {
      title: "Monte Carlo: rejection vs importance sampling",
      tag: "method",
      body: "<p>Monte Carlo estimates expectations by averaging over samples: $\\mathbb{E}[f]\\approx\\frac1S\\sum_s f(\\boldsymbol{x}^{(s)})$. Two ways to generate them from a hard target:</p><ul><li><b>Rejection sampling:</b> draw $\\boldsymbol{x}\\sim q$ under an envelope $Mq\\ge\\tilde p$, accept with probability $\\tilde p(\\boldsymbol{x})/(Mq(\\boldsymbol{x}))$. Acceptance $\\propto M^{-1}$, which <b>collapses exponentially in dimension $D$</b> — almost everything gets rejected.</li><li><b>Importance sampling:</b> keep every sample but reweight $w_s=p/q$ (self-normalized when $p$ is unnormalized). No rejection, but in high $D$ <b>a few weights dominate</b> and the estimate has huge variance. Optimal proposal $q^*\\propto|f|\\,p$.</li></ul>",
      example: "To estimate $\\mathbb{E}[f]$ under a tricky $p$, you sample from an easy $q$ (say a Gaussian) and reweight by $p/q$. If $q$ is a poor match in high dimension, one lucky sample carries 99% of the weight and your average is effectively a single draw.",
      takeaway: "These methods are simple and unbiased but quietly fail in high dimensions, which is exactly why MCMC exists — watch the acceptance rate or weight concentration before trusting the estimate."
    },
    {
      title: "MCMC: detailed balance, Gibbs & Metropolis–Hastings",
      tag: "method",
      body: "<p>MCMC builds a Markov chain whose <b>stationary distribution</b> is the target $p^*$. The sufficient condition is <b>detailed balance</b> (reversibility) plus ergodicity:</p><p style=\"text-align:center\">$p^*(\\boldsymbol{x})\\,T(\\boldsymbol{x}'\\mid\\boldsymbol{x})=p^*(\\boldsymbol{x}')\\,T(\\boldsymbol{x}\\mid\\boldsymbol{x}')$</p><ul><li><b>Gibbs:</b> resample each variable from its <b>full conditional</b> $p(x_j\\mid\\boldsymbol{x}_{-j})$ (always accepted). Needs tractable conditionals; mixes slowly when variables are correlated → block / collapsed Gibbs.</li><li><b>Metropolis–Hastings:</b> propose $\\boldsymbol{x}'\\sim q(\\cdot\\mid\\boldsymbol{x})$ and accept with $\\min\\!\\big(1,\\frac{p^*(\\boldsymbol{x}')q(\\boldsymbol{x}\\mid\\boldsymbol{x}')}{p^*(\\boldsymbol{x})q(\\boldsymbol{x}'\\mid\\boldsymbol{x})}\\big)$ — only the <b>ratio</b> appears, so the unknown $Z$ <i>cancels</i>. Tune the proposal to ~<b>25–40%</b> acceptance (too small = stuck, too big = mostly rejected).</li><li><b>HMC / NUTS:</b> add momentum and follow gradient-driven (leapfrog) dynamics for distant, high-acceptance moves with low autocorrelation; needs $\\nabla\\log p$. NUTS auto-tunes (Stan, PyMC).</li></ul>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Metropolis–Hastings: the ratio cancels Z</text>
        <ellipse cx="180" cy="115" rx="120" ry="60" class="vx-grid" stroke-width="1.5" fill="none"/>
        <ellipse cx="180" cy="115" rx="75" ry="36" class="vx-grid" stroke-width="1" fill="none"/>
        <circle cx="180" cy="115" r="4" style="fill:var(--text-dim)"/>
        <polyline points="120,150 150,135 165,108 195,120 178,95 205,100 188,80" fill="none" class="vx-accent" stroke-width="2"/>
        <circle cx="120" cy="150" r="3.5" style="fill:var(--accent)"/>
        <circle cx="188" cy="80" r="3.5" style="fill:var(--accent)"/>
        <text x="60" y="55" font-size="11" style="fill:var(--text-dim)">target p*(x) (contours)</text>
        <text x="330" y="80" font-size="12" style="fill:var(--text)">accept ratio uses</text>
        <text x="330" y="100" font-size="12" style="fill:var(--accent)">p*(x′)/p*(x)</text>
        <text x="330" y="120" font-size="11" style="fill:var(--text-dim)">→ Z drops out</text>
        <text x="330" y="150" font-size="11" style="fill:var(--text-faint)">aim ~25–40% accept</text>
      </svg>`,
      caption: "Because only the density ratio enters the accept step, the intractable normalizer Z never has to be computed.",
      example: "Sampling a Bayesian posterior known only up to $Z$: MH proposes a step, computes $\\tilde p(\\boldsymbol{x}')/\\tilde p(\\boldsymbol{x})$ (the $Z$'s cancel), and accepts or stays. Over many steps the visited points are distributed as the posterior.",
      takeaway: "The ratio cancelling $Z$ is the trick that makes Bayesian inference tractable at all; reach for HMC/NUTS over vanilla MH whenever gradients exist, because it mixes far faster."
    },
    {
      title: "MCMC diagnostics: burn-in, ESS, R̂",
      tag: "practice",
      body: "<p>MCMC samples are <i>correlated</i> and start far from the target, so raw output needs checking:</p><ul><li><b>Burn-in:</b> discard the early samples before the chain reaches its stationary distribution.</li><li><b>Effective sample size (ESS):</b> the autocorrelation-adjusted count — 10,000 correlated draws may be worth only a few hundred independent ones.</li><li><b>$\\hat R$ (R-hat):</b> the ratio of between-chain to within-chain variance across several over-dispersed starts; $\\hat R\\approx 1$ signals convergence.</li><li><b>Trace plots:</b> chains from dispersed starts should overlap and look like 'fuzzy caterpillars'.</li></ul>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="50" y1="20" x2="50" y2="170" class="vx-axis" stroke-width="1.5"/>
        <line x1="50" y1="170" x2="495" y2="170" class="vx-axis" stroke-width="1.5"/>
        <text x="490" y="190" font-size="11" text-anchor="end">iteration →</text>
        <rect x="50" y="20" width="90" height="150" style="fill:var(--bg-elev2)" opacity="0.5"/>
        <text x="95" y="40" font-size="10.5" text-anchor="middle" style="fill:var(--text-dim)">burn-in</text>
        <polyline points="52,150 70,90 90,120 110,80 130,100 160,96 190,104 220,98 250,103 280,99 310,102 340,100 370,101 400,99 430,101 460,100 490,101" fill="none" class="vx-accent" stroke-width="1.6"/>
        <polyline points="52,40 72,110 92,70 112,108 132,95 160,103 190,97 220,102 250,98 280,102 310,99 340,101 370,100 400,100 430,100 460,100 490,100" fill="none" class="vx-good" stroke-width="1.6"/>
        <line x1="140" y1="20" x2="140" y2="170" stroke-dasharray="4 4" class="vx-grid"/>
        <text x="300" y="135" font-size="11" style="fill:var(--text-dim)">chains mix → R̂ ≈ 1</text>
      </svg>`,
      caption: "Two chains from different starts: drop the burn-in box; once they overlap and stabilize, R̂ ≈ 1.",
      example: "PyMC reports $\\hat R$ and ESS per parameter. An $\\hat R$ of 1.4 or an ESS of 30 from 4,000 draws is a red flag — the chain hasn't converged or is too autocorrelated to trust.",
      takeaway: "Without these checks you can ship confident conclusions from an unconverged chain; $\\hat R>1.01$ or tiny ESS means rerun or reparameterize before you report anything."
    },
    {
      title: "Variational inference: maximize the ELBO",
      tag: "method",
      body: "<p>VI recasts inference as <b>optimization</b>: pick a tractable $q$ to maximize the <b>ELBO</b> (evidence lower bound), which equals minimizing the <i>reverse</i> KL to the true posterior:</p><p style=\"text-align:center\">$\\mathcal{L}(q)=\\mathbb{E}_q[\\log p(\\boldsymbol{x},\\mathcal{D})]+\\mathbb{H}[q]=\\log p(\\mathcal{D})-D_{\\text{KL}}(q\\,\\|\\,p^*)\\le\\log p(\\mathcal{D})$</p><p>Since KL $\\ge 0$, the ELBO is a <b>lower bound on the log marginal likelihood</b> — useful for model selection. <b>Mean-field</b> takes $q=\\prod_j q_j$ and updates each factor by <b>CAVI</b>: $\\log q_j\\propto\\mathbb{E}_{q_{-j}}[\\log p(\\boldsymbol{x},\\mathcal{D})]$, monotonically raising the ELBO. Scalable variants: stochastic VI (minibatches), black-box VI (score-function gradients), and the <b>reparameterization trick</b> $\\boldsymbol{z}=\\boldsymbol\\mu_\\phi+\\boldsymbol\\sigma_\\phi\\odot\\boldsymbol\\epsilon$ that powers VAEs.</p>",
      example: "Variational Bayesian EM generalizes EM: the standard E-step assumes the posterior is exact, while VBEM replaces it with the best $q$ in a family. Maximizing the ELBO drives $q$ toward $p^*$ without ever touching $Z$.",
      takeaway: "Turning inference into optimization is what lets you ride GPUs and minibatches, making VI the default when datasets or models are too big for any sampler to finish."
    },
    {
      title: "Reverse KL is mode-seeking; MCMC vs VI",
      tag: "intuition",
      body: "<p>VI minimizes <i>reverse</i> KL $D_{\\text{KL}}(q\\,\\|\\,p^*)$, which is <b>mode-seeking</b>: $q$ locks onto one mode of a multimodal posterior and, even on a single mode, <b>underestimates the variance</b> — VI is famously overconfident. The headline comparison:</p><table><tr><td></td><td><b>MCMC</b></td><td><b>VI</b></td></tr><tr><td>Accuracy</td><td>asymptotically exact</td><td>biased by $q$ family</td></tr><tr><td>Speed/scale</td><td>slow; hard to minibatch</td><td>fast; minibatches (SVI)</td></tr><tr><td>Uncertainty</td><td>full, multimodal geometry</td><td>underestimates variance</td></tr><tr><td>Use when</td><td>correctness matters, moderate $D$</td><td>speed/scale matter, large $D$</td></tr></table>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700">MCMC samples the target</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700">VI q hugs one mode</text>
        <g>
          <ellipse cx="80" cy="120" rx="55" ry="45" class="vx-grid" stroke-width="1.5" fill="none"/>
          <ellipse cx="195" cy="120" rx="55" ry="45" class="vx-grid" stroke-width="1.5" fill="none"/>
          <g style="fill:var(--good)">
            <circle cx="70" cy="110" r="2.4"/><circle cx="92" cy="128" r="2.4"/><circle cx="60" cy="135" r="2.4"/><circle cx="98" cy="105" r="2.4"/><circle cx="80" cy="120" r="2.4"/><circle cx="75" cy="140" r="2.4"/>
            <circle cx="185" cy="112" r="2.4"/><circle cx="208" cy="130" r="2.4"/><circle cx="178" cy="132" r="2.4"/><circle cx="200" cy="108" r="2.4"/><circle cx="195" cy="122" r="2.4"/><circle cx="212" cy="118" r="2.4"/>
          </g>
          <text x="137" y="185" text-anchor="middle" font-size="10.5" style="fill:var(--good)">covers both modes</text>
        </g>
        <g transform="translate(260,0)">
          <ellipse cx="80" cy="120" rx="55" ry="45" class="vx-grid" stroke-width="1.5" fill="none"/>
          <ellipse cx="195" cy="120" rx="55" ry="45" class="vx-grid" stroke-width="1.5" fill="none"/>
          <ellipse cx="80" cy="120" rx="34" ry="28" class="vx-warn" stroke-width="2.5" fill="none"/>
          <text x="80" y="124" text-anchor="middle" font-size="11" style="fill:var(--warn)">q</text>
          <text x="137" y="185" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">one mode, too narrow</text>
        </g>
        <text x="260" y="205" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">grey = true bimodal posterior</text>
      </svg>`,
      caption: "MCMC scatters across the whole posterior; reverse-KL VI collapses onto a single, over-tight mode.",
      example: "On a bimodal posterior, MCMC eventually visits both peaks and reports honest spread, while mean-field VI converges to one peak with a confidence interval narrower than the truth.",
      takeaway: "If you act on VI's error bars for risk or decisions you will be overconfident; reach for VI when you need speed at scale, MCMC when you need honest uncertainty."
    },
    {
      title: "Directed graphical models & d-separation",
      tag: "graphical",
      body: "<p>A <b>Bayes net</b> factorizes a joint over a DAG: $p(x_{1:V})=\\prod_t p(x_t\\mid x_{\\text{pa}(t)})$ (with <b>plate notation</b> for replication). Read conditional independence off the graph with <b>d-separation</b> (the 'Bayes ball' rules):</p><ul><li><b>Chain</b> $A\\!\\to\\!B\\!\\to\\!C$ and <b>fork</b> $A\\!\\leftarrow\\!B\\!\\to\\!C$: $A\\perp C\\mid B$ (conditioning on $B$ blocks the path).</li><li><b>Collider</b> $A\\!\\to\\!B\\!\\leftarrow\\!C$: $A\\perp C$ marginally, but $A\\not\\perp C\\mid B$ — conditioning on a common <i>effect</i> <b>couples its causes</b>. This is <b>'explaining away'</b>.</li></ul><p>A node's <b>Markov blanket</b> (parents, children, co-parents) renders it independent of everything else.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="130" y="22" text-anchor="middle" font-size="12" font-weight="700">collider X → Y ← Z</text>
        <circle cx="70" cy="70" r="20" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="70" y="75" text-anchor="middle" font-size="13" style="fill:var(--text)">X</text>
        <circle cx="190" cy="70" r="20" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="190" y="75" text-anchor="middle" font-size="13" style="fill:var(--text)">Z</text>
        <circle cx="130" cy="160" r="20" class="vx-warn" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="130" y="165" text-anchor="middle" font-size="13" style="fill:var(--text)">Y</text>
        <line x1="83" y1="86" x2="117" y2="143" class="vx-axis" stroke-width="1.8" marker-end="url(#ar)"/>
        <line x1="177" y1="86" x2="143" y2="143" class="vx-axis" stroke-width="1.8" marker-end="url(#ar)"/>
        <defs><marker id="ar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" style="fill:var(--text-dim)"/></marker></defs>
        <text x="300" y="70" font-size="12" style="fill:var(--good)">X ⊥ Z   (marginally)</text>
        <text x="300" y="100" font-size="12" style="fill:var(--bad)">X ⊥̸ Z | Y</text>
        <text x="300" y="128" font-size="11" style="fill:var(--text-dim)">conditioning on the</text>
        <text x="300" y="146" font-size="11" style="fill:var(--text-dim)">common effect Y couples</text>
        <text x="300" y="164" font-size="11" style="fill:var(--warn)">the causes — "explaining away"</text>
      </svg>`,
      caption: "Collider: X and Z are independent until you observe Y, which then makes them dependent.",
      example: "Sprinkler → WetGrass ← Rain. Sprinkler and Rain are independent a priori. But if you observe wet grass and learn it rained, the sprinkler becomes less likely — the rain has 'explained away' the wetness.",
      takeaway: "d-separation tells you which variables you can drop or must condition on, and the explaining-away trap is why conditioning on a collider silently introduces spurious correlation."
    },
    {
      title: "Markov chains: the stationary distribution",
      tag: "graphical",
      body: "<p>A <b>Markov chain</b> obeys $p(X_t\\mid X_{1:t-1})=p(X_t\\mid X_{t-1})$ — the future depends only on the present. Dynamics live in a transition matrix $A_{ij}=p(X_t{=}j\\mid X_{t-1}{=}i)$, estimated by counts $\\hat A_{ij}=N_{ij}/\\sum_{j'}N_{ij'}$.</p><p>The <b>stationary distribution</b> $\\boldsymbol\\pi^*$ is unchanged by one step:</p><p style=\"text-align:center\">$\\boldsymbol\\pi^*=\\boldsymbol\\pi^*\\mathbf{A}$</p><p>i.e. $\\boldsymbol\\pi^*$ is the <b>left eigenvector</b> of $\\mathbf{A}$ with eigenvalue $\\lambda=1$. (Undirected <b>MRFs</b>, by contrast, factorize as $p(\\boldsymbol{x})=\\frac1Z\\prod_c\\psi_c(\\boldsymbol{x}_c)$ over cliques — symmetric, with no direction.)</p>",
      example: "<b>PageRank</b> is exactly this: model a random web surfer as a Markov chain over pages; the stationary distribution $\\boldsymbol\\pi^*$ — the left eigenvector with $\\lambda=1$ — is each page's long-run visit frequency, i.e. its rank.",
      takeaway: "Long-run behavior reduces to one eigenvector, so ranking, equilibrium, and steady-state questions become a single linear-algebra solve instead of a long simulation."
    },
    {
      title: "HMMs: filtering, smoothing & Viterbi",
      tag: "sequential",
      body: "<p>A <b>hidden Markov model</b> has discrete hidden states $z_t$, observations $\\boldsymbol{x}_t$, and parameters $(\\boldsymbol\\pi,\\mathbf{A},\\mathbf{B})$ (initial, transition, emission). Four inference tasks:</p><ul><li><b>Filtering</b> $p(z_t\\mid\\boldsymbol{x}_{1:t})$ — the <b>forward</b> pass, online.</li><li><b>Smoothing</b> $p(z_t\\mid\\boldsymbol{x}_{1:T})$ — <b>forward–backward</b>, using future evidence too.</li><li><b>MAP path</b> $\\arg\\max p(z_{1:T}\\mid\\boldsymbol{x}_{1:T})$ — <b>Viterbi</b> (max-product), the jointly most-likely path (<i>not</i> the sequence of marginal modes).</li><li><b>Evidence</b> $p(\\boldsymbol{x}_{1:T})$ — the forward sum.</li></ul><p>Recursions: forward $\\alpha_t\\propto\\boldsymbol\\psi_t\\odot(\\boldsymbol\\Psi^\\top\\alpha_{t-1})$, smoothed $\\gamma_t\\propto\\alpha_t\\odot\\beta_t$. Learning is <b>Baum–Welch</b> (= EM). All of these run in $O(K^2T)$.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">HMM trellis (K=3 states across time)</text>
        <g style="fill:var(--accent)">
          <circle cx="90" cy="60" r="8"/><circle cx="90" cy="110" r="8"/><circle cx="90" cy="160" r="8"/>
          <circle cx="230" cy="60" r="8"/><circle cx="230" cy="110" r="8"/><circle cx="230" cy="160" r="8"/>
          <circle cx="370" cy="60" r="8"/><circle cx="370" cy="110" r="8"/><circle cx="370" cy="160" r="8"/>
        </g>
        <g class="vx-grid" stroke-width="0.8" opacity="0.55">
          <line x1="98" y1="60" x2="222" y2="60"/><line x1="98" y1="60" x2="222" y2="110"/><line x1="98" y1="60" x2="222" y2="160"/>
          <line x1="98" y1="110" x2="222" y2="60"/><line x1="98" y1="110" x2="222" y2="110"/><line x1="98" y1="110" x2="222" y2="160"/>
          <line x1="98" y1="160" x2="222" y2="60"/><line x1="98" y1="160" x2="222" y2="110"/><line x1="98" y1="160" x2="222" y2="160"/>
          <line x1="238" y1="60" x2="362" y2="60"/><line x1="238" y1="110" x2="362" y2="110"/><line x1="238" y1="160" x2="362" y2="160"/>
          <line x1="238" y1="60" x2="362" y2="110"/><line x1="238" y1="110" x2="362" y2="160"/><line x1="238" y1="110" x2="362" y2="60"/><line x1="238" y1="160" x2="362" y2="110"/>
        </g>
        <polyline points="90,110 230,60 370,110" fill="none" class="vx-good" stroke-width="3"/>
        <text x="395" y="114" font-size="11" style="fill:var(--good)">Viterbi path</text>
        <g font-size="11" text-anchor="middle" style="fill:var(--text-dim)"><text x="90" y="190">t=1</text><text x="230" y="190">t=2</text><text x="370" y="190">t=3</text></g>
      </svg>`,
      caption: "Each column is the hidden state at one time; Viterbi traces the single highest-probability path through the trellis.",
      example: "Part-of-speech tagging: hidden $z_t$ = tag, observed $\\boldsymbol{x}_t$ = word. Filtering tags as words stream in; Viterbi returns the single best tag sequence for the whole sentence.",
      takeaway: "Choose the task to match the need: filtering for real-time streams, smoothing for offline analysis, and Viterbi when you need one coherent path rather than per-step guesses."
    },
    {
      title: "State-space models & the Kalman filter",
      tag: "sequential",
      body: "<p>A <b>linear-Gaussian SSM</b> (LDS) is an HMM with a <i>continuous</i> Gaussian state and linear-Gaussian dynamics: $\\boldsymbol{z}_t=\\mathbf{A}\\boldsymbol{z}_{t-1}+\\dots+\\boldsymbol\\epsilon_t$, $\\boldsymbol{y}_t=\\mathbf{C}\\boldsymbol{z}_t+\\boldsymbol\\delta_t$. The <b>Kalman filter</b> is exact Gaussian filtering — a <b>predict / update</b> cycle:</p><p style=\"text-align:center\">predict: $\\boldsymbol\\mu_{t|t-1}=\\mathbf{A}\\boldsymbol\\mu_{t-1}+\\dots,\\ \\ \\boldsymbol\\Sigma_{t|t-1}=\\mathbf{A}\\boldsymbol\\Sigma_{t-1}\\mathbf{A}^\\top+\\mathbf{Q}$</p><p style=\"text-align:center\">update: $\\boldsymbol\\mu_t=\\boldsymbol\\mu_{t|t-1}+\\mathbf{K}_t\\boldsymbol{r}_t$</p><p>with innovation $\\boldsymbol{r}_t=\\boldsymbol{y}_t-\\mathbf{C}\\boldsymbol\\mu_{t|t-1}$ and <b>Kalman gain</b> $\\mathbf{K}_t=\\boldsymbol\\Sigma_{t|t-1}\\mathbf{C}^\\top\\mathbf{S}_t^{-1}$. In words: <b>new mean = prediction + gain × error</b> — online Bayesian inference. Predict <i>grows</i> uncertainty (add $\\mathbf{Q}$); update <i>shrinks</i> it with the measurement. Nonlinear/non-Gaussian extensions: <b>EKF</b> (linearize), <b>UKF</b> (sigma points), <b>particle filter</b> (samples).</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs><marker id="ka" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" style="fill:var(--text-dim)"/></marker></defs>
        <rect x="40" y="80" width="150" height="60" rx="8" class="vx-warn" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="115" y="106" text-anchor="middle" font-size="13" style="fill:var(--text)">PREDICT</text>
        <text x="115" y="126" text-anchor="middle" font-size="10.5" style="fill:var(--warn)">Σ grows (+Q)</text>
        <rect x="330" y="80" width="150" height="60" rx="8" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="405" y="106" text-anchor="middle" font-size="13" style="fill:var(--text)">UPDATE</text>
        <text x="405" y="126" text-anchor="middle" font-size="10.5" style="fill:var(--good)">Σ shrinks (measurement)</text>
        <path d="M190,98 C255,80 270,80 330,98" fill="none" class="vx-axis" stroke-width="1.8" marker-end="url(#ka)"/>
        <path d="M330,122 C270,140 255,140 190,122" fill="none" class="vx-axis" stroke-width="1.8" marker-end="url(#ka)"/>
        <text x="260" y="74" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">prior belief</text>
        <text x="260" y="158" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">corrected belief</text>
        <text x="260" y="195" text-anchor="middle" font-size="11.5" style="fill:var(--accent)">new mean = prediction + Kₜ × innovation</text>
      </svg>`,
      caption: "The recursive loop: predict pushes the state forward and inflates uncertainty; the measurement update pulls it back and sharpens it.",
      example: "GPS tracking: predict where the car will be from its motion model (uncertainty grows), then fold in a noisy GPS fix (uncertainty shrinks). The Kalman gain decides how much to trust the new measurement vs the prediction.",
      takeaway: "The Kalman filter is why your GPS, drone, or sensor-fusion stack stays smooth under noisy measurements; reach for EKF/UKF/particle filters once dynamics turn nonlinear."
    },
    {
      title: "CRFs: discriminative, globally normalized",
      tag: "sequential",
      body: "<p>A <b>conditional random field</b> is the <i>discriminative</i> undirected model of a structured output — an MRF whose normalizer depends on the input $\\boldsymbol{x}$:</p><p style=\"text-align:center\">$p(\\boldsymbol{y}\\mid\\boldsymbol{x},\\boldsymbol{w})=\\dfrac{1}{Z(\\boldsymbol{x},\\boldsymbol{w})}\\prod_c\\exp\\!\\big(\\boldsymbol{w}_c^\\top\\boldsymbol\\phi(\\boldsymbol{x},\\boldsymbol{y}_c)\\big)$</p><p>Unlike a generative <b>HMM</b> (which models $p(\\boldsymbol{x},\\boldsymbol{y})$ with local features), a CRF models $p(\\boldsymbol{y}\\mid\\boldsymbol{x})$ directly, allows <b>arbitrary overlapping global features</b>, and is <b>globally normalized</b>. Global normalization <i>avoids the label-bias problem</i> of locally-normalized MEMMs (so future evidence can revise earlier labels). Trained by gradient ascent (gradient = empirical − model-expected feature counts). The max-margin analog is the <b>structural SVM</b>.</p>",
      example: "Named-entity recognition: a chain CRF can use features spanning the whole sentence (capitalization, neighboring words, gazetteers) and, being globally normalized, won't get trapped by an early wrong label the way a locally-normalized MEMM can.",
      takeaway: "Reach for a CRF over an HMM when you only need $p(\\boldsymbol{y}\\mid\\boldsymbol{x})$ and want rich overlapping features, and global normalization is what spares you the label-bias trap."
    }
  ]
};
