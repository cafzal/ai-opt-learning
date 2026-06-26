/* Review: Probability (ML-Fundamentals.md §2) */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["probability"] = {
  intro: "Probability is the language ML uses to quantify uncertainty: what the rules are, how Bayes flips a likelihood into a belief, which distributions model which data, and why sums and averages keep turning out Gaussian. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Two interpretations & two kinds of uncertainty",
      tag: "core",
      body: "<p>The <b>frequentist</b> view says probability is the long-run frequency of a repeatable event; the <b>Bayesian</b> view says it is a degree of belief about <i>any</i> uncertain proposition. The axioms are identical — ML leans Bayesian because it must assign probabilities to parameters and one-off events ('is <i>this</i> email spam?'), which have no repeatable frequency.</p><p>Uncertainty splits two ways:</p><ul><li><b>Aleatoric</b> — irreducible randomness in the process (a fair coin). It lives in the <i>likelihood</i> and cannot be reduced with more data.</li><li><b>Epistemic</b> — reducible uncertainty from lack of data/knowledge. It is tracked by the <i>posterior</i> and shrinks as data arrives.</li></ul>",
      example: "Predicting a coin flip you cannot see has high <b>aleatoric</b> uncertainty even with infinite data — the flip is genuinely random. Not knowing whether a <i>bent</i> coin's bias $\\theta$ is 0.5 or 0.7 is <b>epistemic</b>: collect more flips and the posterior over $\\theta$ sharpens."
    },
    {
      title: "The fundamental rules: sum, product, chain",
      tag: "core",
      body: "<p>Three rules generate everything. The <b>sum rule</b> marginalizes a variable out, $p(A)=\\sum_b p(A,B{=}b)$. The <b>product rule</b> factors a joint, $p(A,B)=p(A\\mid B)\\,p(B)$, which rearranges to the definition of <b>conditional probability</b> $p(A\\mid B)=p(A,B)/p(B)$.</p><p>Applying the product rule repeatedly gives the <b>chain rule</b>, which factors any joint into a product of conditionals:</p><p>$$p(X_{1:D})=p(X_1)\\prod_{d=2}^{D} p(X_d\\mid X_{1:d-1}).$$</p><p>This factorization is exactly what autoregressive models (language models, PixelCNN) exploit.</p>",
      example: "For three variables: $p(X_1,X_2,X_3)=p(X_1)\\,p(X_2\\mid X_1)\\,p(X_3\\mid X_1,X_2)$. A language model predicts each token from all previous tokens — the chain rule written as a neural net."
    },
    {
      title: "Bayes' rule & the base-rate fallacy",
      tag: "core",
      body: "<p>Bayes' rule inverts a conditional, turning a <b>likelihood</b> into a <b>posterior</b>:</p><p>$$p(x\\mid y)=\\frac{\\overbrace{p(x)}^{\\text{prior}}\\,\\overbrace{p(y\\mid x)}^{\\text{likelihood}}}{\\underbrace{\\sum_{x'}p(x')\\,p(y\\mid x')}_{\\text{marginal }p(y)}}.$$</p><p>The denominator is just the sum rule applied to the numerator, so it normalizes the posterior to sum to 1. The <b>base-rate fallacy</b> is ignoring the prior $p(x)$: when a class is rare, even an accurate test is dominated by false positives.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">1000 women screened, prevalence 0.4%</text>
        <g>
          <rect x="10" y="30" width="500" height="150" rx="4" style="fill:var(--bg-elev2)"/>
          <rect x="10" y="30" width="2" height="150" style="fill:var(--bad)"/>
        </g>
        <g font-size="11">
          <circle cx="26" cy="56" r="4" style="fill:var(--bad)"/>
          <text x="40" y="60">4 truly have cancer</text>
          <text x="40" y="78" style="fill:var(--text-dim)">→ ~3 test positive (80% sensitivity)</text>
          <circle cx="26" cy="110" r="4" style="fill:var(--warn)"/>
          <text x="40" y="114">996 are healthy</text>
          <text x="40" y="132" style="fill:var(--text-dim)">→ ~100 test positive (10% false-positive)</text>
        </g>
        <g font-size="12">
          <text x="270" y="60" style="fill:var(--text)" font-weight="700">Of ~103 positives:</text>
          <rect x="270" y="74" width="14" height="14" rx="2" style="fill:var(--bad)"/>
          <text x="292" y="86">~3 true positives</text>
          <rect x="270" y="98" width="220" height="14" rx="2" style="fill:var(--warn)"/>
          <text x="270" y="130" style="fill:var(--text)">P(cancer | +) ≈ 3.2 / 102.8 ≈ 0.031</text>
        </g>
        <text x="10" y="206" style="fill:var(--text-dim)" font-size="11">A positive result raises belief from 0.4% only to ~3% — the prior dominates.</text>
        <text x="10" y="226" style="fill:var(--text-faint)" font-size="10.5">red = cancer, amber = false positives among the healthy</text>
      </svg>`,
      caption: "False positives from 996 healthy women swamp the 3 true positives, so the posterior is only ~3%.",
      example: "Mammogram with sensitivity $p(+\\mid\\text{cancer})=0.8$, false-positive rate $p(+\\mid\\text{no})=0.1$, prevalence $p(\\text{cancer})=0.004$: $$p(\\text{cancer}\\mid +)=\\frac{0.8\\cdot 0.004}{0.8\\cdot 0.004 + 0.1\\cdot 0.996}\\approx 0.031.$$ An 80%-sensitive test yields only ~3% posterior — the key calibration intuition: <b>a high-accuracy classifier on a rare class produces mostly false positives.</b>"
    },
    {
      title: "Independence & conditional independence",
      tag: "core",
      body: "<p>Two variables are <b>independent</b> when their joint factorizes:</p><p>$$X\\perp Y \\iff p(X,Y)=p(X)\\,p(Y).$$</p><p>They are <b>conditionally independent</b> given $Z$ when they factorize once $Z$ is known:</p><p>$$X\\perp Y\\mid Z \\iff p(X,Y\\mid Z)=p(X\\mid Z)\\,p(Y\\mid Z).$$</p><p>Conditional independence (CI) is the engine behind graphical models, naive Bayes, and Markov models: it factors an otherwise $O(K^D)$ joint into tractable pieces.</p>",
      example: "Shoe size and reading ability are correlated in children — but <b>conditionally independent given age</b>. Naive Bayes assumes features are CI given the class, turning $p(x_1,\\dots,x_D\\mid c)$ into $\\prod_d p(x_d\\mid c)$ so it needs only $O(D)$ parameters per class instead of $O(K^D)$."
    },
    {
      title: "Moments & three traps they hide",
      tag: "pitfall",
      body: "<p>The <b>expectation</b> $\\mathbb{E}[X]=\\sum_x x\\,p(x)$ is the mean and <b>variance</b> $\\mathbb{V}[X]=\\mathbb{E}[X^2]-\\mathbb{E}[X]^2$ the spread. For pairs, <b>covariance</b> $\\text{Cov}[X,Y]=\\mathbb{E}[XY]-\\mathbb{E}[X]\\mathbb{E}[Y]$ and <b>correlation</b> $\\text{corr}[X,Y]=\\frac{\\text{Cov}[X,Y]}{\\sqrt{\\mathbb{V}[X]\\,\\mathbb{V}[Y]}}\\in[-1,1]$ normalizes it; the vector version is the symmetric PSD matrix $\\boldsymbol\\Sigma=\\mathbb{E}[(\\boldsymbol{x}-\\boldsymbol\\mu)(\\boldsymbol{x}-\\boldsymbol\\mu)^\\top]$. Three traps follow:</p><ul><li><b>Uncorrelated ≠ independent.</b> Correlation sees only <i>linear</i> dependence. $X\\sim U(-1,1)$, $Y=X^2$ are dependent yet $\\text{corr}=0$. (Mutual information catches any dependence — §4.)</li><li><b>Correlation ≠ causation.</b> A hidden common cause fakes correlation: ice-cream sales and drowning both rise with hot weather.</li><li><b>Simpson's paradox.</b> A trend can reverse in every subgroup — COVID case-fatality was lower overall for Italy than China yet higher in <i>every</i> age band (Italy's older population). Condition on confounders before inferring causation.</li></ul>",
      example: "$X\\sim U(-1,1)$, $Y=X^2$: by symmetry $\\mathbb{E}[XY]=\\mathbb{E}[X^3]=0$ and $\\mathbb{E}[X]=0$, so $\\text{Cov}=0$ and correlation is exactly 0 — yet knowing $X$ pins down $Y$ completely. Zero correlation, total dependence."
    },
    {
      title: "The distribution zoo: what each one models",
      tag: "toolkit",
      body: "<p>Each distribution is a default model for a kind of data. Discrete:</p><ul><li><b>Bernoulli</b> $\\text{Ber}(x\\mid\\theta)=\\theta^x(1-\\theta)^{1-x}$ — one binary outcome (mean $\\theta$, var $\\theta(1-\\theta)$).</li><li><b>Binomial</b> $\\binom{N}{s}\\theta^s(1-\\theta)^{N-s}$ — successes in $N$ trials.</li><li><b>Categorical</b> — one of $C$ classes (multiclass output); <b>Multinomial</b> counts $C$ outcomes over $N$ trials (bag-of-words).</li><li><b>Poisson</b> $e^{-\\lambda}\\lambda^x/x!$ — rare-event counts, with mean = variance = $\\lambda$.</li></ul><p>Continuous:</p><ul><li><b>Gaussian</b> — default noise model (see next card).</li><li><b>Student-$t$</b> — heavy tails, robust to outliers; <b>Laplace</b> — extra mass at 0 → sparsity ($\\text{L1}$ = Laplace-prior MAP).</li><li><b>Beta</b> on $[0,1]$ — conjugate prior for Bernoulli/Binomial; <b>Gamma</b> on $(0,\\infty)$ — prior over rates/precision; <b>Dirichlet</b> on the simplex — conjugate prior for Categorical/Multinomial (topic models).</li></ul>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">Gaussian vs heavy-tailed (Student-t / Laplace)</text>
        <line x1="30" y1="180" x2="500" y2="180" class="vx-axis" stroke-width="1.5"/>
        <line x1="265" y1="40" x2="265" y2="180" class="vx-grid" stroke-dasharray="4 4"/>
        <path d="M30,179 C150,178 215,60 265,60 C315,60 380,178 500,179" fill="none" class="vx-accent" stroke-width="2.5"/>
        <path d="M30,172 C150,165 220,85 265,85 C310,85 380,165 500,172" fill="none" class="vx-good" stroke-width="2.5"/>
        <path d="M30,176 C170,176 255,52 265,52 C275,52 360,176 500,176" fill="none" class="vx-warn" stroke-width="2.5"/>
        <g font-size="11">
          <rect x="330" y="48" width="14" height="3" style="fill:var(--accent)"/><text x="350" y="52">Gaussian</text>
          <rect x="330" y="66" width="14" height="3" style="fill:var(--good)"/><text x="350" y="70">Student-t (heavy tails)</text>
          <rect x="330" y="84" width="14" height="3" style="fill:var(--warn)"/><text x="350" y="88">Laplace (peak at 0)</text>
        </g>
        <text x="40" y="172" font-size="10.5" style="fill:var(--good)">fatter tails →</text>
        <text x="470" y="172" font-size="10.5" style="fill:var(--good)" text-anchor="end">← fatter tails</text>
        <text x="10" y="214" style="fill:var(--text-dim)" font-size="11">Heavy tails put more mass on outliers, so they down-weight extreme points instead of chasing them.</text>
      </svg>`,
      caption: "Student-t spreads mass into the tails (robust); Laplace adds a sharp peak at 0 (sparsity); Gaussian sits in between.",
      example: "Counting customer arrivals per minute? Use <b>Poisson</b> (mean = variance = $\\lambda$). Modeling a probability you'll later update with Bernoulli data? Use a <b>Beta</b> prior — its $a,b$ act like prior success/failure pseudo-counts that conjugately combine with observed counts."
    },
    {
      title: "The multivariate Gaussian: Mahalanobis, marginals & conditionals",
      tag: "geometry",
      body: "<p>The MVN $\\mathcal{N}(\\boldsymbol{y}\\mid\\boldsymbol\\mu,\\boldsymbol\\Sigma)$ is everywhere because it is closed under linear maps, marginalization, and conditioning. The exponent is the <b>Mahalanobis distance</b> $\\Delta^2=(\\boldsymbol{y}-\\boldsymbol\\mu)^\\top\\boldsymbol\\Sigma^{-1}(\\boldsymbol{y}-\\boldsymbol\\mu)$: constant-probability contours are ellipsoids along the eigenvectors of $\\boldsymbol\\Sigma$, and $\\Delta$ becomes plain Euclidean distance after you rotate-and-scale by $\\boldsymbol\\Sigma^{-1/2}$.</p><p>Partition $\\boldsymbol{y}=(\\boldsymbol{y}_1,\\boldsymbol{y}_2)$. The <b>marginal</b> just reads off its block, $p(\\boldsymbol{y}_1)=\\mathcal{N}(\\boldsymbol\\mu_1,\\boldsymbol\\Sigma_{11})$. The <b>conditional</b> is also Gaussian:</p><p>$$\\boldsymbol\\mu_{1\\mid 2}=\\boldsymbol\\mu_1+\\boldsymbol\\Sigma_{12}\\boldsymbol\\Sigma_{22}^{-1}(\\boldsymbol{y}_2-\\boldsymbol\\mu_2),\\qquad \\boldsymbol\\Sigma_{1\\mid 2}=\\boldsymbol\\Sigma_{11}-\\boldsymbol\\Sigma_{12}\\boldsymbol\\Sigma_{22}^{-1}\\boldsymbol\\Sigma_{21}.$$</p><p>The conditional mean is <b>linear</b> in $\\boldsymbol{y}_2$ and the conditional covariance is <b>constant</b> (the Schur complement) — the backbone of GP regression, Kalman filtering, and missing-value imputation.</p>",
      example: "With $\\mu_1=\\mu_2=0$, unit variances, and correlation $\\rho$, observing $y_2=2$ gives conditional mean $\\mu_{1\\mid 2}=\\rho\\cdot 2$ and variance $1-\\rho^2$. Higher $\\rho$ pulls the prediction harder toward $y_2$ <i>and</i> shrinks the leftover uncertainty — observing a correlated variable both informs and sharpens."
    },
    {
      title: "Quantiles, the 95% band, CLT & Monte Carlo",
      tag: "intuition",
      body: "<p>A <b>quantile</b> inverts the CDF, $x_\\alpha=F^{-1}(\\alpha)$. For a Gaussian the central 95% lies in $\\mu\\pm 1.96\\sigma\\approx\\mu\\pm 2\\sigma$. The <b>Central Limit Theorem</b> explains why Gaussians are everywhere: $\\frac{\\bar X-\\mu}{\\sigma/\\sqrt{N}}\\xrightarrow{d}\\mathcal{N}(0,1)$, so sums and averages of many independent pieces go Gaussian regardless of the original distribution.</p><p><b>Monte Carlo</b> estimates an expectation by sampling, $\\mathbb{E}[f(X)]\\approx\\frac1S\\sum_s f(x_s)$, with standard error $\\propto 1/\\sqrt{S}$ — crucially <b>independent of dimension</b>. That dimension-independence is why minibatch SGD, dropout, MCMC, and variational inference all work in huge parameter spaces.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">Gaussian: central 95% in μ ± 1.96σ</text>
        <line x1="30" y1="180" x2="500" y2="180" class="vx-axis" stroke-width="1.5"/>
        <path d="M30,180 L98,180 C150,179 205,55 265,55 C325,55 380,179 432,180 L500,180 Z" style="fill:var(--bg-elev2)"/>
        <path d="M98,180 C150,179 205,55 265,55 C325,55 380,179 432,180 Z" style="fill:var(--accent);opacity:0.30"/>
        <path d="M30,180 C150,179 205,55 265,55 C325,55 380,179 500,180" fill="none" class="vx-accent" stroke-width="2.5"/>
        <line x1="265" y1="55" x2="265" y2="180" class="vx-grid" stroke-dasharray="4 4"/>
        <line x1="98" y1="180" x2="98" y2="150" class="vx-good" stroke-width="2"/>
        <line x1="432" y1="180" x2="432" y2="150" class="vx-good" stroke-width="2"/>
        <g font-size="11">
          <text x="265" y="200" text-anchor="middle">μ</text>
          <text x="98" y="200" text-anchor="middle" style="fill:var(--good)">μ − 1.96σ</text>
          <text x="432" y="200" text-anchor="middle" style="fill:var(--good)">μ + 1.96σ</text>
          <text x="265" y="120" text-anchor="middle" style="fill:var(--text)" font-weight="700">95%</text>
          <text x="70" y="150" text-anchor="middle" style="fill:var(--text-faint)">2.5%</text>
          <text x="460" y="150" text-anchor="middle" style="fill:var(--text-faint)">2.5%</text>
        </g>
        <text x="10" y="222" style="fill:var(--text-dim)" font-size="11">2.5% sits in each tail; the shaded centre holds 95% of the mass.</text>
      </svg>`,
      caption: "The ±1.96σ band captures 95% of a Gaussian, leaving 2.5% in each tail.",
      example: "To halve a Monte Carlo estimate's standard error you need $4\\times$ the samples (error $\\propto 1/\\sqrt{S}$). The same $1/\\sqrt{S}$ rate holds whether $X$ is 1-dimensional or 1-million-dimensional — the basis for estimating gradients from minibatches."
    },
    {
      title: "Change of variables & the Jacobian",
      tag: "transforms",
      body: "<p>Push a density through an <b>invertible</b> transform $\\boldsymbol{y}=f(\\boldsymbol{x})$ and it does <i>not</i> just relabel — it rescales. With $\\boldsymbol{g}=f^{-1}$, the new density is:</p><p>$$p_y(\\boldsymbol{y})=p_x(\\boldsymbol{g}(\\boldsymbol{y}))\\,|\\det\\mathbf{J}_g|,\\qquad (\\mathbf{J}_g)_{ij}=\\frac{\\partial g_i}{\\partial y_j}.$$</p><p>The <b>Jacobian determinant</b> $|\\det\\mathbf{J}|$ is the local volume factor: where $f$ stretches space the density thins out, where it compresses the density piles up, so total mass stays 1. Chaining many simple invertible maps and tracking each $\\log|\\det\\mathbf{J}|$ is exactly how <b>normalizing flows</b> turn a plain Gaussian into a rich learned density.</p><p>The <b>linear</b> special case $\\boldsymbol{y}=\\mathbf{A}\\boldsymbol{x}+\\boldsymbol{b}$ needs no densities to move the moments: $\\mathbb{E}[\\boldsymbol{y}]=\\mathbf{A}\\boldsymbol\\mu+\\boldsymbol{b}$ and $\\text{Cov}[\\boldsymbol{y}]=\\mathbf{A}\\boldsymbol\\Sigma\\mathbf{A}^\\top$ — the rule behind whitening, PCA, and the closure of Gaussians under linear maps (here $|\\det\\mathbf{J}|=|\\det\\mathbf{A}|$).</p>",
      example: "A 1-D scale change $y=ax$ has $g(y)=y/a$ and $|\\mathbf{J}_g|=1/|a|$, so $p_y(y)=\\frac{1}{|a|}p_x(y/a)$: stretch the axis by $a$ and the curve must shrink by $1/|a|$ to still integrate to 1. Matching moments, $\\mathbb{V}[y]=a^2\\,\\mathbb{V}[x]$ — the scalar form of $\\mathbf{A}\\boldsymbol\\Sigma\\mathbf{A}^\\top$."
    }
  ]
};
