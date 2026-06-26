/* Review: Linear & Sparse Models */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["linear-models"] = {
  intro: "Models that are <i>linear in their parameters</i> — even after a nonlinear feature map $\\boldsymbol\\phi(\\boldsymbol{x})$. We start at ordinary least squares (with its clean projection geometry), make it robust to outliers, then add priors: ridge shrinks, lasso zeros — and richer priors carve out <i>structured</i> sparsity. Logistic and softmax regression carry the same linear core into classification (with the threshold-only perceptron as their ancestor); GDA and naive Bayes take the generative route; and GLMs unify the lot under one link-function recipe.",
  concepts: [
    {
      title: "Linear regression: MLE = least squares & projection geometry",
      tag: "core",
      body: "<p>Model the target as Gaussian about a linear mean: $p(y\\mid\\boldsymbol{x},\\boldsymbol\\theta)=\\mathcal{N}(y\\mid w_0+\\boldsymbol{w}^\\top\\boldsymbol{x},\\sigma^2)$. Absorb the bias by prepending a $1$ to $\\boldsymbol{x}$; go nonlinear by swapping $\\boldsymbol{x}$ for features $\\boldsymbol\\phi(\\boldsymbol{x})$ — the model stays <i>linear in the parameters</i>.</p><p>Maximizing the Gaussian likelihood equals minimizing RSS $=\\tfrac12\\|\\mathbf{X}\\boldsymbol{w}-\\boldsymbol{y}\\|^2$. Setting the gradient to zero gives the <b>normal equations</b> and OLS, $\\hat{\\boldsymbol{w}}=(\\mathbf{X}^\\top\\mathbf{X})^{-1}\\mathbf{X}^\\top\\boldsymbol{y}=\\mathbf{X}^\\dagger\\boldsymbol{y}$. The Hessian $\\mathbf{H}=\\mathbf{X}^\\top\\mathbf{X}$ is PSD (PD if full rank), so the optimum is a unique global min.</p><p><b>Geometry:</b> $\\hat{\\boldsymbol{y}}=\\mathbf{X}\\hat{\\boldsymbol{w}}$ is the orthogonal projection of $\\boldsymbol{y}$ onto the column space of $\\mathbf{X}$ — so the residual is perpendicular to every column ($\\mathbf{X}^\\top(\\boldsymbol{y}-\\mathbf{X}\\hat{\\boldsymbol{w}})=\\mathbf{0}$, which <i>is</i> the normal equations). Fit quality: $R^2=1-\\text{RSS}/\\text{TSS}$.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Residual ⟂ column space</text>
        <polygon points="60,200 360,200 460,140 160,140" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
        <text x="368" y="196" font-size="11" style="fill:var(--text-dim)">column space of X</text>
        <circle cx="250" cy="170" r="4" style="fill:var(--accent)"/>
        <text x="206" y="190" font-size="11" style="fill:var(--accent)">ŷ = Xŵ</text>
        <line x1="250" y1="170" x2="250" y2="60" class="vx-bad" stroke-width="2.5" stroke-dasharray="5 4"/>
        <circle cx="250" cy="60" r="4" style="fill:var(--text)"/>
        <text x="258" y="58" font-size="11" style="fill:var(--text)">y</text>
        <text x="186" y="115" font-size="11" style="fill:var(--bad)">residual r</text>
        <polyline points="250,156 250,170 264,170" fill="none" class="vx-bad" stroke-width="1.5"/>
        <text x="20" y="218" font-size="10.5" style="fill:var(--text-faint)">ŷ is the closest point in the subspace; r = y − ŷ is orthogonal to it.</text>
      </svg>`,
      caption: "OLS drops a perpendicular from y onto the span of the features; the residual is what's left over, at a right angle.",
      example: "Polynomial regression $y=w_0+w_1x+w_2x^2+\\dots$ is nonlinear in $x$ but linear in $\\boldsymbol{w}$, so the same closed-form $(\\mathbf{X}^\\top\\mathbf{X})^{-1}\\mathbf{X}^\\top\\boldsymbol{y}$ solves it; an $R^2=0.85$ means the fit explains 85% of the variance in $\\boldsymbol{y}$.",
      takeaway: "The closed form gives an exact fit in one step, but if features are collinear $\\mathbf{X}^\\top\\mathbf{X}$ is near-singular and you must regularize or use the pseudo-inverse."
    },
    {
      title: "Robust regression: Laplace, Student-t, Huber",
      tag: "core",
      body: "<p>The Gaussian likelihood penalizes residuals <i>quadratically</i>, so a single far outlier can dominate the fit. Swapping in a heavy-tailed likelihood downweights extremes:</p><ul><li><b>Laplace</b> $\\propto e^{-|r|/b}$: MLE minimizes the $\\ell_1$ loss; solvable via a linear program.</li><li><b>Student-$t$</b> $\\mathcal{T}(\\cdot,\\nu)$: heavy tails set by $\\nu$; fit by EM or SGD.</li><li><b>Huber</b>: $r^2/2$ when $|r|\\le\\delta$, else $\\delta|r|-\\delta^2/2$ — quadratic ($\\ell_2$) near zero, absolute ($\\ell_1$) in the tails, and differentiable everywhere (unlike pure $\\ell_1$).</li></ul>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="60" y1="20" x2="60" y2="200" class="vx-axis" stroke-width="1.5"/>
        <line x1="60" y1="200" x2="500" y2="200" class="vx-axis" stroke-width="1.5"/>
        <text x="280" y="232" text-anchor="middle" font-size="12">residual r →</text>
        <text x="22" y="110" font-size="12" transform="rotate(-90 22 110)" text-anchor="middle">loss</text>
        <line x1="280" y1="200" x2="280" y2="24" class="vx-grid" stroke-dasharray="3 4"/>
        <text x="284" y="34" font-size="10" style="fill:var(--text-faint)">r = 0</text>
        <path d="M120,30 Q200,180 280,200 Q360,180 440,30" fill="none" class="vx-bad" stroke-width="2.5"/>
        <path d="M92,40 L280,200 L468,40" fill="none" class="vx-warn" stroke-width="2.5"/>
        <path d="M120,92 Q230,178 280,200 Q330,178 440,92" fill="none" class="vx-good" stroke-width="2.5"/>
        <path d="M120,92 L92,72 M440,92 L468,72" fill="none" class="vx-good" stroke-width="2.5"/>
        <line x1="120" y1="200" x2="120" y2="148" class="vx-grid" stroke-dasharray="2 3"/>
        <line x1="440" y1="200" x2="440" y2="148" class="vx-grid" stroke-dasharray="2 3"/>
        <text x="106" y="214" font-size="9.5" style="fill:var(--text-faint)">−δ</text>
        <text x="432" y="214" font-size="9.5" style="fill:var(--text-faint)">+δ</text>
        <g font-size="11">
          <rect x="78" y="26" width="12" height="3" style="fill:var(--bad)"/><text x="94" y="30">squared (ℓ₂)</text>
          <rect x="78" y="44" width="12" height="3" style="fill:var(--warn)"/><text x="94" y="48">absolute (ℓ₁)</text>
          <rect x="78" y="62" width="12" height="3" style="fill:var(--good)"/><text x="94" y="66">Huber</text>
        </g>
      </svg>`,
      caption: "Squared loss explodes on big residuals; absolute and Huber grow only linearly in the tails — so outliers pull the fit far less.",
      example: "With one wildly mislabeled point, an $\\ell_2$ fit tilts the whole line toward it, while a Huber fit with small $\\delta$ treats that point like any other large residual and barely moves.",
      takeaway: "Reach for Huber or $\\ell_1$ loss whenever your data has outliers or fat-tailed noise you cannot clean — it keeps a few bad points from hijacking the whole fit."
    },
    {
      title: "Ridge vs lasso (vs elastic net)",
      tag: "compare",
      body: "<p><b>Ridge</b> = MAP with a Gaussian prior: $\\hat{\\boldsymbol{w}}_{\\text{ridge}}=(\\mathbf{X}^\\top\\mathbf{X}+\\lambda\\mathbf{I})^{-1}\\mathbf{X}^\\top\\boldsymbol{y}$. Via the SVD it <b>shrinks</b> each direction by $\\sigma_j^2/(\\sigma_j^2+\\lambda)$ (small singular values shrink most); effective dof $=\\sum_j\\sigma_j^2/(\\sigma_j^2+\\lambda)$. Smooth path, <b>no exact zeros</b>.</p><p><b>Lasso</b> = MAP with a Laplace prior, $\\arg\\min\\|\\mathbf{X}\\boldsymbol{w}-\\boldsymbol{y}\\|^2+\\lambda\\|\\boldsymbol{w}\\|_1$. The $\\ell_1$ ball's <b>corners on the axes</b> make the RSS contours touch where some $w_d=0$ → <b>sparsity</b> ($\\ell_1$ is the tightest convex relaxation of $\\ell_0$). For orthonormal $\\mathbf{X}$ the solution is <b>soft-thresholding</b> $\\text{sign}(\\hat w_d)(|\\hat w_d|-\\lambda)_+$; no closed form in general (non-smooth at $0$), solved by coordinate descent, ISTA/FISTA, or LARS.</p><p>Key contrast on <b>correlated features:</b> ridge shrinks them <i>together</i> (stable); lasso arbitrarily <i>picks one</i> (unstable). <b>Elastic net</b> $\\lambda_2\\|\\boldsymbol{w}\\|_2^2+\\lambda_1\\|\\boldsymbol{w}\\|_1$ combines both — sparsity plus grouping, and can select $>N$ features.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700">Lasso (ℓ₁ diamond)</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700">Ridge (ℓ₂ circle)</text>
        <g transform="translate(0,30)">
          <line x1="40" y1="110" x2="240" y2="110" class="vx-axis" stroke-width="1.2"/>
          <line x1="135" y1="20" x2="135" y2="195" class="vx-axis" stroke-width="1.2"/>
          <text x="232" y="124" font-size="10" style="fill:var(--text-faint)">w₁</text>
          <text x="140" y="30" font-size="10" style="fill:var(--text-faint)">w₂</text>
          <polygon points="135,55 190,110 135,165 80,110" fill="none" class="vx-accent" stroke-width="2.5"/>
          <ellipse cx="200" cy="62" rx="70" ry="42" transform="rotate(-25 200 62)" fill="none" class="vx-grid" stroke-width="1.3"/>
          <ellipse cx="200" cy="62" rx="46" ry="26" transform="rotate(-25 200 62)" fill="none" class="vx-grid" stroke-width="1.3"/>
          <circle cx="135" cy="55" r="4.5" style="fill:var(--good)"/>
          <text x="118" y="48" font-size="10.5" style="fill:var(--good)">w₁ = 0</text>
          <text x="40" y="216" font-size="10" style="fill:var(--text-dim)">corner on axis → exact zero (sparse)</text>
        </g>
        <g transform="translate(255,30)">
          <line x1="40" y1="110" x2="240" y2="110" class="vx-axis" stroke-width="1.2"/>
          <line x1="135" y1="20" x2="135" y2="195" class="vx-axis" stroke-width="1.2"/>
          <text x="232" y="124" font-size="10" style="fill:var(--text-faint)">w₁</text>
          <text x="140" y="30" font-size="10" style="fill:var(--text-faint)">w₂</text>
          <circle cx="135" cy="110" r="55" fill="none" class="vx-warn" stroke-width="2.5"/>
          <ellipse cx="200" cy="62" rx="70" ry="42" transform="rotate(-25 200 62)" fill="none" class="vx-grid" stroke-width="1.3"/>
          <ellipse cx="200" cy="62" rx="46" ry="26" transform="rotate(-25 200 62)" fill="none" class="vx-grid" stroke-width="1.3"/>
          <circle cx="176" cy="71" r="4.5" style="fill:var(--warn)"/>
          <text x="182" y="68" font-size="10.5" style="fill:var(--warn)">both ≠ 0</text>
          <text x="40" y="216" font-size="10" style="fill:var(--text-dim)">smooth boundary → shrinks, no zeros</text>
        </g>
      </svg>`,
      caption: "Same RSS contours, two constraint shapes: the diamond's corner lands on an axis (a zeroed weight); the circle is touched off-axis, so both weights stay nonzero.",
      example: "Among three near-duplicate sensors, lasso may keep one and zero the other two (and which one can flip with a tiny data change); ridge keeps all three with similar small weights; elastic net keeps the correlated group together while still zeroing truly irrelevant inputs.",
      takeaway: "Reach for lasso when you need automatic feature selection and a sparse, interpretable model; ridge when correlated predictors should shrink together; elastic net when you want both."
    },
    {
      title: "Logistic & softmax regression",
      tag: "core",
      body: "<p>Pass the linear score through the sigmoid: $p(y{=}1\\mid\\boldsymbol{x},\\boldsymbol{w})=\\sigma(\\boldsymbol{w}^\\top\\boldsymbol{x})$. The NLL is <b>binary cross-entropy</b> (no closed form), with gradient $\\boldsymbol{g}=\\mathbf{X}^\\top(\\boldsymbol\\mu-\\boldsymbol{y})$ and Hessian $\\mathbf{H}=\\mathbf{X}^\\top\\mathbf{S}\\mathbf{X}$, $\\mathbf{S}=\\text{diag}(\\mu_i(1-\\mu_i))$. Since $\\mathbf{H}\\succeq0$ the loss is <b>strictly convex</b> → a unique optimum.</p><p><b>Caveat:</b> on linearly separable data the MLE diverges ($\\|\\boldsymbol{w}\\|\\to\\infty$) — fix with an L2 penalty (MAP). Optimize by gradient descent, Newton, <b>IRLS</b> (Newton as repeated weighted least squares, working response $\\boldsymbol{z}_k=\\mathbf{X}\\boldsymbol{w}_k+\\mathbf{S}_k^{-1}(\\boldsymbol{y}-\\boldsymbol\\mu_k)$), or L-BFGS.</p><p><b>Softmax (multinomial)</b> generalizes it: $p(y{=}c\\mid\\boldsymbol{x},\\mathbf{W})=e^{\\boldsymbol{w}_c^\\top\\boldsymbol{x}}/\\sum_{c'}e^{\\boldsymbol{w}_{c'}^\\top\\boldsymbol{x}}$ (fix $\\boldsymbol{w}_C=\\mathbf{0}$ for identifiability), per-class gradient $\\sum_i(\\mu_{ic}-y_{ic})\\boldsymbol{x}_i$, Hessian PD. <b>Maxent view:</b> this Gibbs form $p(y\\mid\\boldsymbol{x})\\propto\\exp(\\sum_k w_k f_k(\\boldsymbol{x},y))$ is the max-entropy distribution under moment constraints.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">σ(z) = 1 / (1 + e⁻ᶻ)</text>
        <line x1="60" y1="30" x2="60" y2="185" class="vx-axis" stroke-width="1.5"/>
        <line x1="60" y1="185" x2="500" y2="185" class="vx-axis" stroke-width="1.5"/>
        <text x="494" y="178" font-size="11" style="fill:var(--text-dim)">z →</text>
        <line x1="56" y1="50" x2="500" y2="50" class="vx-grid" stroke-dasharray="3 4"/>
        <line x1="56" y1="117.5" x2="500" y2="117.5" class="vx-grid" stroke-dasharray="3 4"/>
        <text x="52" y="54" font-size="10" text-anchor="end" style="fill:var(--text-faint)">1.0</text>
        <text x="52" y="121" font-size="10" text-anchor="end" style="fill:var(--text-faint)">0.5</text>
        <text x="52" y="188" font-size="10" text-anchor="end" style="fill:var(--text-faint)">0</text>
        <line x1="280" y1="30" x2="280" y2="185" class="vx-grid" stroke-dasharray="2 4"/>
        <text x="284" y="42" font-size="10" style="fill:var(--text-faint)">z = 0</text>
        <path d="M60,183 C150,181 215,170 250,150 C272,137 288,98 310,85 C345,65 410,54 500,51" fill="none" class="vx-accent" stroke-width="2.8"/>
        <circle cx="280" cy="117.5" r="4" style="fill:var(--accent)"/>
        <text x="288" y="112" font-size="10.5" style="fill:var(--accent)">σ(0) = 0.5</text>
        <text x="70" y="210" font-size="10.5" style="fill:var(--text-faint)">squashes the real line into a probability in (0, 1)</text>
      </svg>`,
      caption: "The sigmoid maps any real score z to a probability in (0,1), crossing 0.5 at z = 0 — the decision boundary.",
      example: "Predicting click/no-click: $\\boldsymbol{w}^\\top\\boldsymbol{x}$ becomes a probability via $\\sigma$. If the classes are perfectly separable, unpenalized training keeps inflating $\\|\\boldsymbol{w}\\|$ to steepen $\\sigma$, so a small L2 penalty is needed to keep the fit finite.",
      takeaway: "Always add L2 regularization in production logistic regression: it stops weights diverging on (near-)separable data and keeps the probabilities calibrated rather than saturating at 0 or 1."
    },
    {
      title: "Generative classifiers: GDA, naive Bayes, vs discriminative",
      tag: "core",
      body: "<p><b>GDA</b> models each class as a Gaussian, $p(\\boldsymbol{x}\\mid y{=}c)=\\mathcal{N}(\\boldsymbol\\mu_c,\\boldsymbol\\Sigma_c)$, prior $\\pi_c$, then applies Bayes. <b>QDA</b> uses per-class $\\boldsymbol\\Sigma_c$ → <b>quadratic</b> boundaries ($O(CD^2)$ params, overfits if $N$ small); <b>LDA</b> ties $\\boldsymbol\\Sigma$ → <b>linear</b> boundaries with logistic-form posterior (regularize via $\\hat{\\boldsymbol\\Sigma}_c(\\alpha)=\\alpha\\hat{\\boldsymbol\\Sigma}_c+(1-\\alpha)\\hat{\\boldsymbol\\Sigma}$). <b>Fisher's LDA</b> maximizes $J(\\boldsymbol{w})=\\frac{\\boldsymbol{w}^\\top\\mathbf{S}_B\\boldsymbol{w}}{\\boldsymbol{w}^\\top\\mathbf{S}_W\\boldsymbol{w}}$, binary solution $\\boldsymbol{w}=\\mathbf{S}_W^{-1}(\\boldsymbol\\mu_2-\\boldsymbol\\mu_1)$.</p><p><b>Naive Bayes</b> assumes conditional independence given the class, $p(\\boldsymbol{x}\\mid y{=}c)=\\prod_d p(x_d\\mid\\theta_{dc})$ — fast and often effective. <b>Laplace smoothing</b> $\\hat\\theta_{dck}=\\frac{N_{dck}+\\alpha}{N_c+K\\alpha}$ (a Dirichlet prior) avoids zero probabilities; Gaussian NB is diagonal-covariance QDA.</p><p><b>Generative vs discriminative:</b> generative models $p(\\boldsymbol{x},y)$ (fast, needs less data, handles missing inputs by marginalizing, but sensitive to misspecification); discriminative models $p(y\\mid\\boldsymbol{x})$ (iterative, robust, higher large-$N$ accuracy). <i>Ng & Jordan:</i> naive Bayes can win with little data, logistic regression wins asymptotically.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700">LDA (tied Σ)</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700">QDA (per-class Σ)</text>
        <g transform="translate(0,28)">
          <rect x="30" y="10" width="210" height="180" rx="4" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <ellipse cx="95" cy="70" rx="40" ry="30" transform="rotate(20 95 70)" fill="none" class="vx-good" stroke-width="1.8"/>
          <ellipse cx="170" cy="135" rx="40" ry="30" transform="rotate(20 170 135)" fill="none" class="vx-bad" stroke-width="1.8"/>
          <circle cx="95" cy="70" r="3" style="fill:var(--good)"/>
          <circle cx="170" cy="135" r="3" style="fill:var(--bad)"/>
          <line x1="40" y1="170" x2="225" y2="55" class="vx-accent" stroke-width="2.5"/>
          <text x="44" y="184" font-size="10" style="fill:var(--accent)">linear boundary</text>
        </g>
        <g transform="translate(255,28)">
          <rect x="30" y="10" width="210" height="180" rx="4" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <ellipse cx="95" cy="75" rx="48" ry="22" transform="rotate(10 95 75)" fill="none" class="vx-good" stroke-width="1.8"/>
          <ellipse cx="165" cy="130" rx="26" ry="44" transform="rotate(-15 165 130)" fill="none" class="vx-bad" stroke-width="1.8"/>
          <circle cx="95" cy="75" r="3" style="fill:var(--good)"/>
          <circle cx="165" cy="130" r="3" style="fill:var(--bad)"/>
          <path d="M48,175 Q120,120 130,70 Q134,40 210,40" fill="none" class="vx-accent" stroke-width="2.5"/>
          <text x="44" y="184" font-size="10" style="fill:var(--accent)">quadratic boundary</text>
        </g>
      </svg>`,
      caption: "A shared covariance (LDA) yields a straight separating boundary; per-class covariances (QDA) bend it into a curve.",
      example: "With only a handful of labeled emails, naive Bayes (generative) often classifies better; with hundreds of thousands, logistic regression (discriminative) overtakes it — and the generative model copes when a feature is missing by integrating it out, where the discriminative one cannot.",
      takeaway: "Pick a generative model when labels are scarce, features go missing, or you must train fast; switch to discriminative once you have ample data and want top accuracy."
    },
    {
      title: "Generalized linear models (GLMs)",
      tag: "synthesis",
      body: "<p>GLMs unify the chapter. A linear predictor $\\eta=\\boldsymbol{w}^\\top\\boldsymbol{x}$ is mapped to the mean by a <b>link</b> $g$, $\\mu=g^{-1}(\\eta)$, with the response in the exponential family. Choosing the distribution fixes the canonical link:</p><ul><li><b>Gaussian</b> → identity link, $\\mu=\\eta$ (linear regression).</li><li><b>Bernoulli</b> → logit link, $\\mu=\\sigma(\\eta)$ (logistic regression).</li><li><b>Poisson</b> → log link, $\\mu=e^{\\eta}$ (count regression).</li><li><b>Multinomial</b> → softmax link, $\\mu_k=\\mathcal{S}(\\boldsymbol\\eta)_k$.</li></ul><p>With the canonical link <b>every GLM gradient has the same form</b> $\\sum_i(y_i-\\mu_i)\\boldsymbol{x}_i$ — error times input — and all are fit by IRLS / Fisher scoring.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">One recipe, four models</text>
        <rect x="20" y="95" width="120" height="40" rx="6" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.5"/>
        <text x="80" y="112" text-anchor="middle" font-size="12" style="fill:var(--text)">η = wᵀx</text>
        <text x="80" y="128" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">linear predictor</text>
        <line x1="140" y1="115" x2="200" y2="115" class="vx-accent" stroke-width="1.8"/>
        <polygon points="200,115 192,111 192,119" style="fill:var(--accent)"/>
        <text x="170" y="106" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">link g⁻¹</text>
        <g font-size="11">
          <rect x="210" y="40" width="290" height="26" rx="4" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <text x="222" y="57" style="fill:var(--good)">Gaussian · identity · μ = η</text>
          <rect x="210" y="74" width="290" height="26" rx="4" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <text x="222" y="91" style="fill:var(--good)">Bernoulli · logit · μ = σ(η)</text>
          <rect x="210" y="108" width="290" height="26" rx="4" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <text x="222" y="125" style="fill:var(--good)">Poisson · log · μ = e^η</text>
          <rect x="210" y="142" width="290" height="26" rx="4" style="fill:var(--bg-elev2)" class="vx-grid" stroke-width="1"/>
          <text x="222" y="159" style="fill:var(--good)">Multinomial · softmax · μₖ = S(η)ₖ</text>
        </g>
        <text x="20" y="200" font-size="11" style="fill:var(--text-dim)">Shared gradient: Σ (yᵢ − μᵢ) xᵢ   (error × input)</text>
        <text x="20" y="218" font-size="10.5" style="fill:var(--text-faint)">— so one IRLS / Fisher-scoring routine fits them all.</text>
      </svg>`,
      caption: "Pick a response distribution; its canonical link sets the mean function — but the gradient (error × input) and the fitting algorithm stay identical.",
      example: "Modeling website visit <i>counts</i>: choose Poisson with a log link, $\\mu=e^{\\boldsymbol{w}^\\top\\boldsymbol{x}}$. The fitting code is the same IRLS loop as logistic regression — only the mean $\\mu_i$ inside $\\sum_i(y_i-\\mu_i)\\boldsymbol{x}_i$ changes.",
      takeaway: "Match the link and distribution to your target's type — counts, rates, binary, positive-only — instead of forcing linear regression on data it cannot represent and getting nonsensical predictions."
    },
    {
      title: "The perceptron",
      tag: "compare",
      body: "<p>The ancestor of logistic regression: drop the sigmoid and just take the <b>hard threshold</b> of the linear score, $\\hat y=\\mathbb{I}(\\boldsymbol{w}^\\top\\boldsymbol{x}>0)$. There is no probability, no likelihood — only a $\\{0,1\\}$ (or $\\pm1$) decision.</p><p>Training is <b>mistake-driven</b>: cycle through points and update $\\boldsymbol{w}$ <i>only on errors</i>, $\\boldsymbol{w}\\leftarrow\\boldsymbol{w}+(2y_i-1)\\boldsymbol{x}_i$ (the factor $2y_i-1\\in\\{-1,+1\\}$ nudges the boundary toward the misclassified point). The <b>perceptron convergence theorem</b> guarantees this halts after finitely many updates <b>iff the data is linearly separable</b>; on non-separable data it never settles.</p><p>Logistic regression is <b>strictly more general</b>: it is probabilistic and <b>calibrated</b> (outputs usable confidences), extends to <b>multiclass</b> via softmax, optimizes a smooth convex loss by gradient methods, and — unlike the perceptron — still produces a sensible maximum-margin-ish fit when classes overlap. The perceptron is essentially logistic regression's degenerate, zero-temperature limit.</p>",
      example: "Separable case: two clouds of points with a gap — the perceptron sweeps through, correcting each misclassified point, and stops the instant it finds <i>any</i> separating line (not necessarily the best one). Non-separable case: a single overlapping point keeps flipping sign, so $\\boldsymbol{w}$ oscillates forever; logistic regression instead converges to a stable boundary that trades off the conflicting points probabilistically.",
      takeaway: "Default to logistic regression over the raw perceptron in practice: you get calibrated probabilities, convergence on overlapping classes, and a clean path to multiclass."
    },
    {
      title: "Sparse models beyond lasso",
      tag: "core",
      body: "<p>Plain lasso zeros <i>individual</i> coefficients. A family of richer sparsity priors targets structure, probabilities, or extreme compression:</p><ul><li><b>Group lasso</b> — penalize $\\sum_g\\|\\boldsymbol{w}_g\\|_2$ (the group $\\ell_2$ norm, <i>not</i> squared) so whole predefined groups switch on/off together; ideal for one-hot levels of a categorical or shared weights across multi-task models.</li><li><b>ARD / sparse Bayesian learning</b> — give each weight its own prior precision $\\alpha_j$ and maximize the marginal likelihood (empirical Bayes); irrelevant features get $\\alpha_j\\to\\infty$ and are <b>pruned</b> automatically (Bayesian Occam). With a kernel basis this is the <b>Relevance Vector Machine</b> — typically <i>sparser</i> than the SVM and <b>probabilistic</b>.</li><li><b>Spike-and-slab</b> — the gold-standard <i>discrete</i> prior $p(w_j\\mid\\gamma_j)=\\gamma_j\\mathcal{N}(0,\\sigma_w^2)+(1-\\gamma_j)\\delta_0$ (a point mass at zero plus a slab); the posterior yields honest <b>marginal inclusion probabilities</b> $p(\\gamma_j{=}1\\mid\\mathcal{D})$. Lasso is its tractable <i>continuous relaxation</i>; exact inference over $2^D$ models needs MCMC/VI.</li><li><b>Fused lasso</b> — also penalize $\\sum_j|w_{j+1}-w_j|$ so neighboring coefficients stay equal, giving <b>piecewise-constant</b> solutions (genomics, change-point detection).</li><li><b>Compressed sensing</b> — recover a $K$-sparse signal from only $M=O(K\\log\\tfrac{D}{K})\\ll D$ random linear measurements $\\boldsymbol{y}=\\mathbf{R}\\boldsymbol{x}$ by solving a lasso / basis-pursuit problem.</li></ul>",
      example: "Selecting from a categorical feature with 5 one-hot columns: lasso might keep 2 of the dummies and drop 3 — incoherent — whereas <b>group lasso</b> keeps or kills all 5 as a unit. For an MRI, <b>compressed sensing</b> exploits the image's sparsity in a wavelet basis to reconstruct it from far fewer measurements than pixels, cutting scan time; an <b>RVM</b> on the same regression task often matches an SVM with a fraction of the retained basis vectors and returns predictive error bars the SVM cannot.",
      takeaway: "Choose the sparsity prior that matches your structure — group lasso for one-hot or multi-task blocks, fused lasso for ordered signals, spike-and-slab when you need honest inclusion probabilities."
    }
  ]
};
