/* Review: Statistics, Estimation & Decision Theory */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["statistics"] = {
  intro: "How we turn data into parameters and parameters into decisions: maximum likelihood and its MAP/Bayesian generalizations, the Bayesian-vs-frequentist split, model selection and the p-value pitfalls, decision theory that turns a posterior into an action, the metrics that score classifiers, plus method-of-moments and online estimators and the shrinkage of hierarchical/empirical Bayes. Expand each toggle, then test yourself below.",
  concepts: [
    {
      title: "Maximum likelihood estimation (MLE)",
      tag: "frequentist",
      body: "<p>Pick the parameters that make the observed data most probable — equivalently, minimize the <b>negative log-likelihood</b>:</p><p>$\\hat{\\boldsymbol\\theta}_{\\text{mle}}=\\arg\\max_{\\boldsymbol\\theta}\\sum_n\\log p(y_n\\mid\\boldsymbol{x}_n,\\boldsymbol\\theta)=\\arg\\min_{\\boldsymbol\\theta}\\text{NLL}(\\boldsymbol\\theta)$.</p><p><b>KL justification:</b> minimizing NLL equals minimizing $D_{\\text{KL}}(p_{\\mathcal{D}}\\,\\|\\,q_{\\boldsymbol\\theta})$ between the empirical and model distributions — MLE finds the model closest (in forward KL) to the data. Many cases have <b>closed forms</b>: Bernoulli $\\hat\\theta=N_1/N$; Categorical $\\hat\\theta_k=N_k/N$; Gaussian $\\hat\\mu=\\bar y$, $\\hat\\sigma^2=\\frac1N\\sum(y_n-\\hat\\mu)^2$; linear regression $\\hat{\\boldsymbol{w}}=(\\mathbf{X}^\\top\\mathbf{X})^{-1}\\mathbf{X}^\\top\\boldsymbol{y}$ (OLS).</p>",
      example: "Flip a coin 10 times, see 7 heads. The Bernoulli MLE is just the empirical frequency $\\hat\\theta=N_1/N=7/10=0.7$ — the value of $\\theta$ under which '7 heads in 10' is most likely.",
      takeaway: "MLE is the default fitting principle behind logistic regression, GLMs, and neural-net cross-entropy training — minimizing NLL is what 'training' usually means."
    },
    {
      title: "MAP estimation & regularization",
      tag: "bayes",
      body: "<p>Add a penalty $C(\\boldsymbol\\theta)=-\\log p(\\boldsymbol\\theta)$ to the NLL and you are doing <b>MAP estimation</b> — the prior is the regularizer:</p><p>$\\hat{\\boldsymbol\\theta}_{\\text{map}}=\\arg\\max_{\\boldsymbol\\theta}\\,p(\\boldsymbol\\theta)\\,p(\\mathcal{D}\\mid\\boldsymbol\\theta)$.</p><p><b>L2 / ridge / weight decay</b> is exactly a zero-mean Gaussian prior on the weights: $\\arg\\min\\text{NLL}+\\lambda\\|\\boldsymbol{w}\\|^2$, biasing weights toward 0 to cut variance. <b>Choosing $\\lambda$:</b> a validation set or K-fold CV, $R^{\\text{cv}}_\\lambda=\\frac1K\\sum_k R_0(\\hat\\theta_\\lambda(\\mathcal{D}_{-k}),\\mathcal{D}_k)$ (LOOCV when $K{=}N$); the <b>one-standard-error rule</b> then prefers the simplest $\\lambda$ whose error is within 1 SE of the minimum. Early stopping (≈ L2 for some models) and simply <b>more data</b> (drives risk toward the Bayes-error floor) are also regularizers.</p>",
      example: "Ridge regression with a huge $\\lambda$ shrinks all weights toward 0 (underfit / high bias); with $\\lambda\\to 0$ it reverts to OLS (overfit / high variance). CV picks the middle, and the one-SE rule nudges toward a slightly stronger penalty for a simpler model.",
      takeaway: "When you have more features than clean data, a prior/penalty is what stops overfitting — it is the reason ridge often beats the unbiased OLS estimate on new data."
    },
    {
      title: "Bayesian statistics: posterior, predictive & conjugacy",
      tag: "bayes",
      body: "<p>Treat the parameter as random and update beliefs with Bayes' rule — <b>posterior $\\propto$ prior $\\times$ likelihood</b>:</p><p>$p(\\boldsymbol\\theta\\mid\\mathcal{D})=\\dfrac{p(\\boldsymbol\\theta)\\,p(\\mathcal{D}\\mid\\boldsymbol\\theta)}{p(\\mathcal{D})}$, with evidence $p(\\mathcal{D})=\\int p(\\mathcal{D}\\mid\\boldsymbol\\theta)p(\\boldsymbol\\theta)\\,d\\boldsymbol\\theta$.</p><p>The <b>posterior predictive</b> averages over parameter uncertainty instead of plugging in a point estimate: $p(y\\mid\\boldsymbol{x},\\mathcal{D})=\\int p(y\\mid\\boldsymbol{x},\\boldsymbol\\theta)\\,p(\\boldsymbol\\theta\\mid\\mathcal{D})\\,d\\boldsymbol\\theta$. A prior is <b>conjugate</b> when the posterior stays in the prior's family, giving closed-form updates where hyperparameters act as <b>pseudo-counts</b>: Beta$(\\alpha,\\beta)\\!\\to\\!$Beta$(\\alpha+N_1,\\beta+N_0)$; Dir$(\\boldsymbol\\alpha)\\!\\to\\!$Dir$(\\alpha_k+N_k)$. For a Gaussian with known $\\sigma^2$, the posterior mean is a <b>precision-weighted average</b> of prior and data means ($V_N^{-1}=V_0^{-1}+N\\sigma^{-2}$): the prior dominates for small $N$, the data for large $N$. A <b>credible interval</b> reports $P(\\ell\\le\\theta\\le u\\mid\\mathcal{D})=1-\\alpha$ — the intuitive \"95% probability the parameter is in here\"; the HPD region is the smallest-volume such set.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Posterior ∝ prior × likelihood</text>
        <line x1="45" y1="185" x2="500" y2="185" class="vx-axis" stroke-width="1.5"/>
        <text x="272" y="212" text-anchor="middle" font-size="12" style="fill:var(--text-dim)">θ →</text>
        <text x="40" y="60" text-anchor="end" font-size="10" style="fill:var(--text-faint)">density</text>
        <!-- prior: broad, centered left -->
        <path d="M50,183 C120,178 150,120 195,118 C240,120 270,178 340,183" fill="none" class="vx-grid" stroke-width="2.5"/>
        <!-- likelihood: narrow-ish, centered right -->
        <path d="M250,183 C330,180 350,70 388,68 C426,70 446,180 500,183" fill="none" class="vx-good" stroke-width="2.5"/>
        <!-- posterior: between, sharper -->
        <path d="M180,183 C275,182 300,45 322,43 C344,45 369,182 470,183" fill="none" class="vx-accent" stroke-width="3"/>
        <line x1="322" y1="183" x2="322" y2="43" stroke-dasharray="4 4" class="vx-grid" stroke-width="1"/>
        <g font-size="11">
          <rect x="60" y="38" width="12" height="3" style="fill:var(--text-dim)"/><text x="78" y="42" style="fill:var(--text-dim)">prior</text>
          <rect x="60" y="54" width="12" height="3" style="fill:var(--good)"/><text x="78" y="58" style="fill:var(--good)">likelihood</text>
          <rect x="60" y="70" width="12" height="3" style="fill:var(--accent)"/><text x="78" y="74" style="fill:var(--accent)">posterior</text>
        </g>
        <text x="328" y="120" font-size="10.5" style="fill:var(--accent)">sharper, pulled toward data</text>
      </svg>`,
      caption: "The posterior sits between prior and likelihood and is sharper than either — more data pulls it toward the likelihood.",
      example: "Start with a Beta(2,2) prior (a weak belief the coin is fair). Observe $N_1=7$ heads, $N_0=3$ tails. The posterior is Beta(2+7, 2+3) = Beta(9,5): the $(\\alpha,\\beta)$ act as pseudo-counts added to the real counts. Laplace's rule of succession (Beta(1,1)) gives $p(y{=}1\\mid\\mathcal{D})=\\frac{N_1+1}{N+2}$, avoiding zero probabilities.",
      takeaway: "Conjugate pseudo-counts give cheap, smoothed estimates for low-data buckets (click-through rates, rare categories) without ever returning a brittle 0% or 100%."
    },
    {
      title: "MAP vs posterior mean/median, & model selection",
      tag: "bayes",
      body: "<p>The <b>MAP</b> estimate (posterior mode) is the natural Bayesian analogue of MLE, but it has drawbacks: it carries no uncertainty, the mode is <i>atypical</i> in high dimensions (most posterior mass is away from the peak), and it is <b>not reparameterization-invariant</b>. Prefer the posterior <b>mean</b> (optimal under squared loss) or <b>median</b> (optimal under absolute loss).</p><p><b>Bayesian model selection</b> compares whole models by their marginal likelihoods via the <b>Bayes factor</b> $B_{1,0}=\\frac{p(\\mathcal{D}\\mid M_1)}{p(\\mathcal{D}\\mid M_0)}$. The marginal likelihood encodes <b>Bayesian Occam's razor</b>: because $\\sum_{\\mathcal{D}'}p(\\mathcal{D}'\\mid m)=1$, an over-complex model spreads probability thinly across many possible datasets, so the actual data is most probable under the model of <i>just-right</i> complexity — no separate test set needed. Cheaper proxies are <b>information criteria</b> $\\mathcal{L}(m)=-2\\log p(\\mathcal{D}\\mid\\hat\\theta)+C(m)$: <b>BIC</b> ($C=D_m\\log N$, a Laplace approximation of the marginal likelihood, ≈ MDL), <b>AIC</b> ($C=2D_m$, independent of $N$, favors more complex models than BIC), and <b>WAIC</b> (handles singular/non-identifiable models, generally preferred).</p>",
      example: "Comparing a linear vs cubic fit, BIC penalizes the cubic's extra parameters by $\\log N$ each while AIC penalizes only $2$ each — so with large $N$, BIC favors the simpler linear model more aggressively than AIC does.",
      takeaway: "Information criteria let you rank models by fit-minus-complexity from the training data alone — useful when a held-out set is too small or too expensive to carve off."
    },
    {
      title: "Frequentist statistics: sampling distribution, bootstrap, CIs",
      tag: "frequentist",
      body: "<p>Flip the Bayesian setup: the parameter is a <b>fixed</b> unknown and the <b>data is random</b>. Everything flows from the <b>sampling distribution</b> of $\\hat\\theta$ — its spread over hypothetically resampled datasets.</p><p>The <b>bootstrap</b> approximates that distribution by resampling $\\mathcal{D}$ with replacement (non-parametric) or sampling from $p(\\cdot\\mid\\hat\\theta)$ (parametric); the spread of $\\{\\hat\\theta^{(s)}\\}$ is \"a poor man's posterior.\" A <b>confidence interval</b> is a <i>procedure</i> that covers the true $\\theta^*$ in $1-\\alpha$ of repeated samples — it is <b>NOT</b> $P(\\theta\\in I\\mid\\mathcal{D})$ (that is the credible interval). For the data in hand, $\\theta$ is simply in or out; a CI can demonstrably exclude the truth and still be a valid 95% CI. Two more properties: <b>bias</b> $\\text{bias}(\\hat\\theta)=\\mathbb{E}[\\hat\\theta]-\\theta^*$ (the Gaussian-variance MLE is biased, $\\mathbb{E}[\\hat\\sigma^2_{\\text{mle}}]=\\frac{N-1}{N}\\sigma^2$, fixed by dividing by $N-1$) and <b>consistency</b> $\\hat\\theta\\to\\theta^*$ as $N\\to\\infty$. The <b>Cramér–Rao</b> bound $\\mathbb{V}[\\hat\\theta]\\ge\\frac{1}{N\\,I(\\theta^*)}$ sets the floor on variance; the MLE attains it asymptotically (asymptotically optimal).</p>",
      example: "To get error bars on a median with no formula, draw 1000 bootstrap resamples of your data, compute the median of each, and take the 2.5th–97.5th percentiles of those 1000 medians — a 95% bootstrap interval.",
      takeaway: "The bootstrap is your escape hatch for error bars on any statistic — medians, AUC, ratios — where no closed-form standard error exists and analytic derivation is hopeless."
    },
    {
      title: "Bayesian decision theory: loss → estimator",
      tag: "core",
      body: "<p>A posterior is not yet a decision. Pick the action that minimizes <b>posterior expected loss</b>:</p><p>$\\rho(a\\mid\\boldsymbol{x})=\\mathbb{E}_{p(h\\mid\\boldsymbol{x})}[\\ell(h,a)]$, $\\quad\\pi^*(\\boldsymbol{x})=\\arg\\min_a\\rho(a\\mid\\boldsymbol{x})$.</p><p>The loss you choose picks the summary of the posterior: <b>0–1 loss → mode (MAP)</b>, <b>squared $\\ell_2$ loss → mean</b>, <b>absolute $\\ell_1$ loss → median</b>. On a skewed posterior these three diverge, so the loss genuinely matters. Wald (1950): every admissible decision rule is a Bayes rule — <i>the best way to minimize frequentist risk is to be Bayesian.</i> Bayesian inference conditions on what is known (data) and averages over what is unknown (parameters); frequentism does the reverse.</p>",
      visual: `<svg viewBox="0 0 520 235" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">One skewed posterior, three estimators</text>
        <line x1="45" y1="185" x2="500" y2="185" class="vx-axis" stroke-width="1.5"/>
        <text x="272" y="212" text-anchor="middle" font-size="12" style="fill:var(--text-dim)">θ →</text>
        <!-- right-skewed density -->
        <path d="M50,185 C110,185 140,55 185,50 C230,46 270,120 320,150 C380,172 440,182 500,184 L500,185 L50,185 Z" style="fill:var(--bg-elev2)" stroke="none"/>
        <path d="M50,185 C110,185 140,55 185,50 C230,46 270,120 320,150 C380,172 440,182 500,184" fill="none" class="vx-accent" stroke-width="2.5"/>
        <!-- mode -->
        <line x1="185" y1="185" x2="185" y2="50" class="vx-good" stroke-width="2"/>
        <text x="185" y="42" text-anchor="middle" font-size="11" style="fill:var(--good)">mode</text>
        <text x="185" y="100" text-anchor="middle" font-size="9.5" style="fill:var(--good)">0–1</text>
        <!-- median -->
        <line x1="232" y1="185" x2="232" y2="80" class="vx-warn" stroke-width="2"/>
        <text x="232" y="72" text-anchor="middle" font-size="11" style="fill:var(--warn)">median</text>
        <text x="232" y="130" text-anchor="middle" font-size="9.5" style="fill:var(--warn)">|·|</text>
        <!-- mean -->
        <line x1="278" y1="185" x2="278" y2="118" class="vx-bad" stroke-width="2"/>
        <text x="292" y="108" text-anchor="middle" font-size="11" style="fill:var(--bad)">mean</text>
        <text x="278" y="160" text-anchor="middle" font-size="9.5" style="fill:var(--bad)">(·)²</text>
        <text x="500" y="205" text-anchor="end" font-size="10.5" style="fill:var(--text-faint)">skew pulls mean toward the long tail</text>
      </svg>`,
      caption: "On a right-skewed posterior, mode < median < mean — and which one is 'optimal' depends entirely on the loss.",
      example: "Predicting house prices (a right-skewed distribution): squared error rewards the <b>mean</b> (pulled up by mansions), absolute error rewards the <b>median</b> (robust to them). Choosing $\\ell_1$ vs $\\ell_2$ changes the prediction even with the identical posterior.",
      takeaway: "Asymmetric real-world costs (a missed fraud vs a false alarm) should set the loss, which then dictates the optimal point prediction — accuracy alone never encodes that."
    },
    {
      title: "P-values considered harmful",
      tag: "pitfall",
      body: "<p>A p-value is widely misread. It is <b>not</b> $P(H_0\\mid\\mathcal{D})$ — a result with $p\\approx 0.05$ can correspond to $P(H_0)\\ge 30\\%$. Worse, it depends on the <b>stopping rule</b> and experimental design (peeking at the data and stopping early inflates significance), it suffers <b>multiple-comparison</b> inflation (test enough hypotheses and some cross 0.05 by chance), and it can only ever <b>reject</b> $H_0$, never confirm it.</p><p>This is a sharp Bayesian–frequentist contrast: under the <b>likelihood principle</b> the stopping rule is irrelevant to a Bayesian, but it changes a frequentist's p-value. The Bayesian alternative reports $p(\\Delta>\\epsilon\\mid\\mathcal{D})$ over a <b>region of practical equivalence (ROPE)</b> — directly answering \"is the effect big enough to matter?\"</p>",
      example: "A team runs an A/B test, checks the p-value daily, and stops the moment it dips below 0.05. That optional-stopping habit makes a true null cross 0.05 far more than 5% of the time — the 'significant' result is an artifact of the stopping rule, not the effect.",
      takeaway: "This is why you report a credible interval or effect size with a ROPE, not a bare p-value, when stakeholders ask \"how sure are you, and is it big enough to act on?\""
    },
    {
      title: "Classification metrics: confusion matrix, ROC vs PR",
      tag: "metric",
      body: "<p>Thresholding a score at $\\tau$ yields a <b>confusion matrix</b> (TP, FP, FN, TN), from which all metrics follow: <b>TPR / recall</b> $=TP/(TP+FN)$ and <b>FPR</b> $=FP/(FP+TN)$ normalize within the <i>truth</i> classes; <b>precision</b> $=TP/(TP+FP)$ normalizes within <i>predictions</i>; <b>$F_1=\\frac{2PR}{P+R}=\\frac{TP}{TP+\\frac12(FP+FN)}$</b> is their harmonic mean.</p><p>Sweeping $\\tau$ traces two curves. The <b>ROC</b> plots TPR vs FPR and is summarized by <b>AUC</b>; because each rate is normalized within its own class, ROC/AUC is <b>invariant to class imbalance</b>. The <b>precision–recall</b> curve plots precision vs recall and <i>is</i> sensitive to imbalance (precision depends on the positive base rate) — so prefer PR for rare positives (information retrieval, medical screening). To act on costs: if a false negative costs $c\\times$ a false positive, predict positive iff $p_1\\ge 1/(1+c)$; with a <b>reject option</b>, abstain when the top probability $p^*<\\lambda^*$.</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <!-- LEFT: confusion matrix -->
        <text x="10" y="18" style="fill:var(--text)" font-size="12" font-weight="700">Confusion matrix</text>
        <text x="95" y="42" text-anchor="middle" font-size="9.5" style="fill:var(--text-dim)">pred +</text>
        <text x="165" y="42" text-anchor="middle" font-size="9.5" style="fill:var(--text-dim)">pred −</text>
        <text x="22" y="76" font-size="9.5" style="fill:var(--text-dim)">true +</text>
        <text x="22" y="126" font-size="9.5" style="fill:var(--text-dim)">true −</text>
        <rect x="60" y="52" width="70" height="44" rx="3" style="fill:var(--good)" opacity="0.85"/>
        <rect x="132" y="52" width="70" height="44" rx="3" style="fill:var(--bad)" opacity="0.85"/>
        <rect x="60" y="100" width="70" height="44" rx="3" style="fill:var(--bad)" opacity="0.85"/>
        <rect x="132" y="100" width="70" height="44" rx="3" style="fill:var(--good)" opacity="0.85"/>
        <g font-size="13" font-weight="700" text-anchor="middle" style="fill:var(--bg-elev2)">
          <text x="95" y="79">TP</text><text x="167" y="79">FN</text>
          <text x="95" y="127">FP</text><text x="167" y="127">TN</text>
        </g>
        <text x="60" y="166" font-size="9.5" style="fill:var(--text-faint)">recall = TP/(TP+FN)</text>
        <text x="60" y="180" font-size="9.5" style="fill:var(--text-faint)">precision = TP/(TP+FP)</text>
        <!-- RIGHT: ROC curve -->
        <text x="300" y="18" style="fill:var(--text)" font-size="12" font-weight="700">ROC curve</text>
        <line x1="320" y1="200" x2="320" y2="35" class="vx-axis" stroke-width="1.5"/>
        <line x1="320" y1="200" x2="495" y2="200" class="vx-axis" stroke-width="1.5"/>
        <text x="407" y="225" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">FPR →</text>
        <text x="306" y="118" font-size="10.5" transform="rotate(-90 306 118)" text-anchor="middle" style="fill:var(--text-dim)">TPR</text>
        <!-- diagonal (chance) -->
        <line x1="320" y1="200" x2="495" y2="35" stroke-dasharray="4 4" class="vx-grid" stroke-width="1"/>
        <text x="470" y="60" font-size="9" style="fill:var(--text-faint)" text-anchor="end">chance</text>
        <!-- AUC shaded region under curve -->
        <path d="M320,200 C335,90 380,55 410,48 C450,40 478,38 495,37 L495,200 Z" style="fill:var(--accent)" opacity="0.18"/>
        <!-- ROC curve -->
        <path d="M320,200 C335,90 380,55 410,48 C450,40 478,38 495,37" fill="none" class="vx-accent" stroke-width="2.5"/>
        <text x="430" y="120" font-size="11" style="fill:var(--accent)" text-anchor="middle">AUC</text>
      </svg>`,
      caption: "Recall normalizes within true positives, precision within predicted positives; AUC is the area under the TPR-vs-FPR curve, with the diagonal as random guessing.",
      example: "Fraud detection with 0.1% fraud: a model flagging everything as legit scores 99.9% accuracy yet 0% recall. ROC/AUC stays unmoved by the imbalance, but the PR curve exposes the near-zero precision-recall tradeoff — which is why PR is the right lens for rare positives.",
      takeaway: "Picking PR over ROC and tuning the threshold to your cost ratio is what separates a model that looks good on paper from one that's usable when positives are rare."
    },
    {
      title: "Calibration: do the probabilities mean what they say?",
      tag: "metric",
      body: "<p>A classifier can be <b>accurate</b> yet have <b>meaningless probabilities</b>. A model is <b>calibrated</b> if, among all predictions made with confidence $p$, about a fraction $p$ actually come true: of the cases it calls \"$90\\%$,\" roughly $90\\%$ should be correct. This is a property of the <i>probabilities</i>, not the decisions.</p><p>You check it with a <b>reliability diagram</b>: bin predictions by confidence, then plot observed accuracy against mean confidence per bin. Perfect calibration is the diagonal $y=x$; bars below it mean <b>over-confidence</b> (says $90\\%$, right $70\\%$), above it <b>under-confidence</b>. The gap is summarized by <b>expected calibration error (ECE)</b>, a weighted average of $|\\text{acc}-\\text{conf}|$ over bins.</p><p>Calibration is <b>distinct from accuracy and from sharpness</b>. <i>Accuracy</i> asks whether the top class is right; <i>sharpness</i> asks whether probabilities are confident (near 0/1) rather than timid (near the base rate). A model can be perfectly calibrated yet useless (always predict the base rate — calibrated but not sharp), or highly accurate yet badly miscalibrated (modern deep nets are notoriously over-confident). You want both: sharp <i>and</i> calibrated.</p><p><b>Post-hoc fixes</b> learn a monotone squashing of the scores on a held-out set, leaving the ranking — and thus accuracy and AUC — unchanged: <b>Platt scaling</b> fits a logistic on the logits; <b>temperature scaling</b> divides the logits by a single learned scalar $T>1$ to soften over-confident softmaxes (the same temperature knob from decoding, fit to calibrate); isotonic regression is the non-parametric version.</p>",
      example: "A model outputs \"$90\\%$ confident\" on 100 cases and only 70 turn out correct. That 20-point gap is <b>over-confidence</b>, not (necessarily) low accuracy — 70% right may even be good. The fix is not retraining but <b>temperature scaling</b>: divide the logits by a learned $T>1$ on a validation set to soften the softmax until \"$90\\%$\" really means $90\\%$. Accuracy and AUC are untouched because dividing every logit by the same $T$ preserves their order.",
      takeaway: "Calibration is what lets you trust a probability as a probability — essential when a downstream decision multiplies it by a cost (expected-loss thresholds, triage, abstention); fix it cheaply post-hoc with temperature/Platt scaling, no retraining."
    },
    {
      title: "Method of moments & online estimation",
      tag: "estimation",
      body: "<p><b>Method of moments</b> estimates parameters by matching theoretical moments to empirical ones (e.g. set the model mean and variance equal to the sample mean and variance, then solve). It is simpler than MLE and often gives quick closed forms, but it is generally <b>less statistically efficient</b> — higher variance for the same data.</p><p>For streaming data you can update an estimate in $O(1)$ without storing the past. The <b>recursive (running) mean</b> nudges the old estimate toward the new point by $1/t$:</p><p>$\\hat\\mu_t=\\hat\\mu_{t-1}+\\frac1t(y_t-\\hat\\mu_{t-1})$.</p><p>The <b>exponential moving average (EMA)</b> uses a fixed rate $\\beta$ instead of $1/t$, so it <b>downweights old data</b> geometrically and tracks a drifting signal:</p><p>$\\hat\\mu_t=\\beta\\hat\\mu_{t-1}+(1-\\beta)y_t$.</p><p>Starting from $\\hat\\mu_0=0$ biases early estimates toward zero; <b>bias-correct</b> by dividing by $(1-\\beta^t)$ — exactly the correction Adam applies to its moment estimates.</p>",
      example: "Track the average latency of a service with $\\beta=0.9$: each new sample contributes $10\\%$, the running estimate $90\\%$. After 1 reading of $y_1=100\\text{ms}$ the raw EMA reads $0.9\\cdot 0+0.1\\cdot 100=10\\text{ms}$ — wildly low. Bias-correcting by $(1-0.9^1)=0.1$ gives $10/0.1=100\\text{ms}$, the right value. By contrast the recursive mean with rate $1/t$ converges to the true long-run average and never needs correction.",
      takeaway: "EMAs power streaming dashboards and Adam's optimizer moments because they track a drifting signal in $O(1)$ memory — but skip bias correction and your early readings lie."
    },
    {
      title: "Hierarchical & empirical Bayes",
      tag: "bayes",
      body: "<p>Instead of fixing the prior's hyperparameters, put a prior on <i>them</i> too, building a chain $\\boldsymbol\\eta\\to\\boldsymbol\\theta\\to\\mathcal{D}$ (hyperparameters → group parameters → data). Inference then couples the groups, producing <b>partial pooling</b>: data-poor groups <b>borrow strength</b> from data-rich ones, with each group's estimate <b>shrunk toward the population mean</b> in proportion to how little data it has. This sits between <i>no pooling</i> (fit each group alone, noisy) and <i>complete pooling</i> (one estimate for all, ignores group structure).</p><p><b>Empirical Bayes</b> (a.k.a. <b>type-II MLE</b>) is a cheap approximation: rather than integrate over $\\boldsymbol\\eta$, point-estimate it by maximizing the marginal likelihood of the data:</p><p>$\\hat{\\boldsymbol\\eta}=\\arg\\max_{\\boldsymbol\\eta}\\int p(\\mathcal{D}\\mid\\boldsymbol\\theta)\\,p(\\boldsymbol\\theta\\mid\\boldsymbol\\eta)\\,d\\boldsymbol\\theta$.</p><p>It reuses the data to set the prior, then proceeds as ordinary Bayes — cheaper than full hierarchical Bayes (which marginalizes over $\\boldsymbol\\eta$) while capturing most of the shrinkage benefit.</p>",
      example: "Estimating batting averages for players with very different numbers of at-bats: a rookie with 3 hits in 5 at-bats (0.600) is implausible. A hierarchical model shrinks that estimate toward the league average (~0.260), heavily for the 5-at-bat rookie and barely for a veteran with 600 at-bats. Empirical Bayes sets the league-wide prior by fitting $\\hat{\\boldsymbol\\eta}$ to all players' data at once — the classic James–Stein-style win over estimating each player in isolation.",
      takeaway: "Partial pooling is what gives trustworthy per-segment estimates — new users, small regions, thin A/B cells — by borrowing strength instead of trusting tiny, noisy samples."
    }
  ]
};
