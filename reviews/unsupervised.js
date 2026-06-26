/* Review: Unsupervised & Latent-Variable Models (ML-Fundamentals.md §7) */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["unsupervised"] = {
  intro: "No labels — just $\\boldsymbol{x}$. The task is to discover structure: cluster the data, model its density, or compress it to a few latent dimensions. The recurring idea is a <b>latent variable</b> $z$ behind each observation, fit by EM or by an eigen/SVD decomposition. We move from mixtures (GMM) and clustering (K-means) through PCA and its probabilistic cousins (FA, ICA) up to the VAE. Skim the toggles, then test yourself.",
  concepts: [
    {
      title: "Latent-variable models & finite mixtures",
      tag: "core",
      body: "<p>A <b>latent-variable model</b> explains each observed $\\boldsymbol{x}_i$ via an unobserved $z_i$: $p(\\boldsymbol{x}_i\\mid\\boldsymbol\\theta)=\\sum_k p(z{=}k)\\,p(\\boldsymbol{x}_i\\mid z{=}k)$. A <b>finite mixture</b> sums $K$ weighted components, $p(\\boldsymbol{x}_i)=\\sum_{k=1}^K \\pi_k\\,p_k(\\boldsymbol{x}_i\\mid\\boldsymbol\\theta_k)$, with mixing weights $\\pi_k\\ge0$, $\\sum_k\\pi_k=1$.</p><p>A <b>GMM</b> takes each $p_k=\\mathcal{N}(\\boldsymbol\\mu_k,\\boldsymbol\\Sigma_k)$ and can approximate any smooth density. The <b>responsibility</b> is the soft assignment of point $i$ to component $k$, $r_{ik}=p(z_i{=}k\\mid\\boldsymbol{x}_i)=\\dfrac{\\pi_k\\,\\mathcal{N}(\\boldsymbol{x}_i\\mid\\boldsymbol\\mu_k,\\boldsymbol\\Sigma_k)}{\\sum_{k'}\\pi_{k'}\\,\\mathcal{N}(\\boldsymbol{x}_i\\mid\\boldsymbol\\mu_{k'},\\boldsymbol\\Sigma_{k'})}$ — a posterior over which component generated the point. Mixtures of Bernoullis/multinoullis handle binary/categorical data.</p><p><b>Unidentifiability</b> is intrinsic: <i>label-switching</i> (relabel the components and the likelihood is unchanged) in mixtures, and rotation in FA/PCA.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">A mixture: one density from K weighted components</text>
        <line x1="40" y1="160" x2="500" y2="160" class="vx-axis" stroke-width="1.5"/>
        <!-- three component bumps -->
        <path d="M40,160 C90,160 100,118 130,118 C160,118 170,160 220,160" fill="none" class="vx-grid" stroke-width="1.5"/>
        <path d="M150,160 C200,160 210,95 245,95 C280,95 290,160 340,160" fill="none" class="vx-grid" stroke-width="1.5"/>
        <path d="M300,160 C355,160 365,128 400,128 C435,128 445,160 495,160" fill="none" class="vx-grid" stroke-width="1.5"/>
        <!-- mixture envelope -->
        <path d="M40,160 C90,160 100,112 130,110 C155,108 165,92 200,86 C235,80 252,86 268,90 C300,98 320,116 360,120 C400,124 440,138 495,158" fill="none" class="vx-accent" stroke-width="2.5"/>
        <g font-size="10.5" style="fill:var(--text-dim)">
          <text x="120" y="108">π₁</text><text x="236" y="86">π₂</text><text x="392" y="118">π₃</text>
        </g>
        <text x="40" y="186" font-size="10.5" style="fill:var(--accent)">blue = mixture p(x) = Σ πₖ 𝒩(μₖ, Σₖ)</text>
        <text x="320" y="186" font-size="10.5" style="fill:var(--text-faint)">grey = components</text>
      </svg>`,
      caption: "Each grey bump is a weighted Gaussian component; their sum (blue) is the mixture density.",
      example: "On a height histogram with a hidden male/female split, a 2-component GMM learns $\\pi\\approx(0.5,0.5)$ and two means. A person at the overlap gets $r_{i,\\text{male}}\\approx0.6$, $r_{i,\\text{female}}\\approx0.4$ — a soft, not hard, membership."
    },
    {
      title: "EM for mixtures",
      tag: "core",
      body: "<p>The log-likelihood $\\sum_i\\log\\sum_k\\pi_k p_k(\\boldsymbol{x}_i)$ has a sum inside the log, so we maximize it via the ELBO by alternating two steps. For a GMM:</p><ul><li><b>E-step:</b> with parameters fixed, compute the responsibilities $r_{ik}$ (the current soft assignments).</li><li><b>M-step:</b> with $r_{ik}$ fixed, set $r_k=\\sum_i r_{ik}$ and update $\\pi_k=\\dfrac{r_k}{N}$, $\\boldsymbol\\mu_k=\\dfrac{\\sum_i r_{ik}\\boldsymbol{x}_i}{r_k}$, $\\boldsymbol\\Sigma_k=\\dfrac{\\sum_i r_{ik}(\\boldsymbol{x}_i-\\boldsymbol\\mu_k)(\\boldsymbol{x}_i-\\boldsymbol\\mu_k)^\\top}{r_k}$ — responsibility-weighted versions of the usual MLE formulas.</li></ul><p>Each round never decreases the likelihood: <b>monotone convergence</b> to a local maximum (so multiple restarts help). Watch for <b>degeneracy</b>: a component can collapse onto a single point, $\\boldsymbol\\Sigma_k\\to0$ and likelihood $\\to\\infty$ — cure with a Wishart prior (MAP) or by restarting.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">EM: alternate, likelihood climbs monotonically</text>
        <!-- cycle -->
        <rect x="40" y="45" width="150" height="46" rx="6" class="vx-accent" fill="none" stroke-width="2"/>
        <text x="115" y="66" text-anchor="middle" font-size="12" style="fill:var(--text)" font-weight="700">E-step</text>
        <text x="115" y="82" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">compute rₖ (soft)</text>
        <rect x="330" y="45" width="150" height="46" rx="6" class="vx-good" fill="none" stroke-width="2"/>
        <text x="405" y="66" text-anchor="middle" font-size="12" style="fill:var(--text)" font-weight="700">M-step</text>
        <text x="405" y="82" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">update πₖ, μₖ, Σₖ</text>
        <path d="M192,58 L326,58" class="vx-accent" stroke-width="1.5" marker-end="url(#arrU)"/>
        <path d="M328,80 L194,80" class="vx-good" stroke-width="1.5" marker-end="url(#arrU2)"/>
        <defs>
          <marker id="arrU" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" style="fill:var(--accent)"/></marker>
          <marker id="arrU2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" style="fill:var(--good)"/></marker>
        </defs>
        <!-- monotone curve -->
        <line x1="55" y1="195" x2="500" y2="195" class="vx-axis" stroke-width="1.2"/>
        <line x1="55" y1="195" x2="55" y2="120" class="vx-axis" stroke-width="1.2"/>
        <text x="62" y="132" font-size="10.5" style="fill:var(--text-dim)">log-lik</text>
        <path d="M70,190 L130,168 L190,150 L260,140 L340,135 L430,133 L490,132" fill="none" class="vx-warn" stroke-width="2.5"/>
        <text x="270" y="208" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">iteration → (never decreases, plateaus at a local max)</text>
      </svg>`,
      caption: "E and M alternate; the log-likelihood increases every round and converges to a local optimum.",
      example: "Fit a 3-component GMM on 2-D data: E-step gives every point three responsibilities; M-step recomputes the three means as responsibility-weighted averages. After ~20 rounds the log-likelihood flattens. If one $\\boldsymbol\\Sigma_k$ shrinks toward zero around an outlier, restart with a different seed."
    },
    {
      title: "K-means & Lloyd's algorithm",
      tag: "core",
      body: "<p><b>K-means</b> minimizes the <b>distortion</b> $J=\\sum_n\\|\\boldsymbol{x}_n-\\boldsymbol\\mu_{z_n}\\|^2$ — total squared distance from each point to its assigned centroid. <b>Lloyd's algorithm</b> alternates: (1) assign each point to its nearest centroid (hard assignment), then (2) move each centroid to the mean of its assigned points. Both steps decrease $J$, so it converges.</p><p>It is exactly <b>hard EM</b> on an isotropic ($\\boldsymbol\\Sigma_k=\\sigma^2\\mathbf{I}$, equal $\\pi_k$) GMM: replace the soft $r_{ik}$ with a winner-take-all 0/1 assignment. <b>K-means++</b> seeds centers with probability $\\propto D(\\boldsymbol{x})^2$ (distance to the nearest chosen center), giving an $O(\\log K)$-better expected solution and far fewer bad restarts. <b>K-medoids</b> uses actual data points as centers (robust, works with non-Euclidean distances).</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Lloyd's algorithm: assign ↔ update</text>
        <!-- cluster A points -->
        <g style="fill:var(--accent)">
          <circle cx="110" cy="70" r="4"/><circle cx="135" cy="92" r="4"/><circle cx="92" cy="108" r="4"/><circle cx="128" cy="125" r="4"/><circle cx="150" cy="68" r="4"/>
        </g>
        <!-- cluster B points -->
        <g style="fill:var(--good)">
          <circle cx="330" cy="120" r="4"/><circle cx="360" cy="100" r="4"/><circle cx="385" cy="135" r="4"/><circle cx="345" cy="150" r="4"/><circle cx="400" cy="105" r="4"/>
        </g>
        <!-- centroids -->
        <path d="M118,86 l8,8 M126,86 l-8,8" class="vx-bad" stroke-width="2.5"/>
        <circle cx="122" cy="90" r="10" class="vx-bad" fill="none" stroke-width="2"/>
        <path d="M360,120 l8,8 M368,120 l-8,8" class="vx-bad" stroke-width="2.5"/>
        <circle cx="364" cy="124" r="10" class="vx-bad" fill="none" stroke-width="2"/>
        <!-- assignment spokes (faint) -->
        <g class="vx-grid" stroke-width="0.8" opacity="0.7">
          <line x1="122" y1="90" x2="110" y2="70"/><line x1="122" y1="90" x2="135" y2="92"/><line x1="122" y1="90" x2="92" y2="108"/><line x1="122" y1="90" x2="128" y2="125"/><line x1="122" y1="90" x2="150" y2="68"/>
          <line x1="364" y1="124" x2="330" y2="120"/><line x1="364" y1="124" x2="360" y2="100"/><line x1="364" y1="124" x2="385" y2="135"/><line x1="364" y1="124" x2="345" y2="150"/><line x1="364" y1="124" x2="400" y2="105"/>
        </g>
        <text x="100" y="160" font-size="10.5" style="fill:var(--bad)">✕ = centroid μₖ (mean of its points)</text>
        <text x="40" y="192" font-size="11" style="fill:var(--text-dim)">Minimize J = Σ ‖xₙ − μ(zₙ)‖²  (hard, spherical assignments)</text>
      </svg>`,
      caption: "Points snap to the nearest centroid (spokes); each centroid then jumps to its cluster's mean — repeat.",
      example: "Cluster 1,000 customers into $K=4$ groups by spend and frequency. Plain K-means may converge to a poor local optimum if two seeds land in the same dense blob; K-means++ spreads the initial centers and avoids that, usually needing fewer restarts."
    },
    {
      title: "K-means vs GMM",
      tag: "compare",
      body: "<p>Both alternate assign/update, but they differ on four axes. K-means makes a <b>hard</b> 0/1 assignment; a GMM keeps a <b>soft</b> responsibility $r_{ik}$. K-means clusters are <b>spherical</b> (isotropic distance); a GMM fits a full $\\boldsymbol\\Sigma_k$, so clusters can be <b>ellipsoidal</b> and tilted. K-means outputs a hard <b>partition</b>; a GMM is a full <b>density model</b> $p(\\boldsymbol{x})$ you can sample from and score. For model selection, K-means uses distortion $J$ (which is monotone decreasing in $K$, hence the elbow heuristic) while a GMM uses <b>BIC</b>. Per iteration, K-means costs $O(NKD)$ vs the GMM's $O(NKD^2)$ (the covariance).</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="130" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">K-means (hard, spherical)</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">GMM (soft, ellipsoidal)</text>
        <line x1="260" y1="35" x2="260" y2="205" class="vx-grid" stroke-width="1" stroke-dasharray="3 4"/>
        <!-- LEFT: kmeans, circular boundaries -->
        <g style="fill:var(--accent)">
          <circle cx="95" cy="80" r="3.5"/><circle cx="115" cy="95" r="3.5"/><circle cx="80" cy="100" r="3.5"/><circle cx="105" cy="72" r="3.5"/>
        </g>
        <g style="fill:var(--good)">
          <circle cx="170" cy="150" r="3.5"/><circle cx="150" cy="135" r="3.5"/><circle cx="185" cy="160" r="3.5"/><circle cx="160" cy="168" r="3.5"/>
        </g>
        <circle cx="99" cy="87" r="34" class="vx-accent" fill="none" stroke-width="2"/>
        <circle cx="166" cy="152" r="32" class="vx-good" fill="none" stroke-width="2"/>
        <path d="M95,83 l6,6 M101,83 l-6,6" class="vx-bad" stroke-width="2"/>
        <path d="M163,148 l6,6 M169,148 l-6,6" class="vx-bad" stroke-width="2"/>
        <!-- RIGHT: GMM, tilted ellipses -->
        <g style="fill:var(--accent)">
          <circle cx="330" cy="80" r="3.5"/><circle cx="355" cy="95" r="3.5"/><circle cx="345" cy="70" r="3.5"/><circle cx="370" cy="105" r="3.5"/>
        </g>
        <g style="fill:var(--good)">
          <circle cx="420" cy="150" r="3.5"/><circle cx="400" cy="140" r="3.5"/><circle cx="440" cy="160" r="3.5"/><circle cx="415" cy="168" r="3.5"/>
        </g>
        <ellipse cx="350" cy="88" rx="38" ry="20" transform="rotate(28 350 88)" class="vx-accent" fill="none" stroke-width="2"/>
        <ellipse cx="350" cy="88" rx="24" ry="12" transform="rotate(28 350 88)" class="vx-accent" fill="none" stroke-width="1" opacity="0.6"/>
        <ellipse cx="419" cy="154" rx="36" ry="18" transform="rotate(22 419 154)" class="vx-good" fill="none" stroke-width="2"/>
        <ellipse cx="419" cy="154" rx="22" ry="11" transform="rotate(22 419 154)" class="vx-good" fill="none" stroke-width="1" opacity="0.6"/>
        <text x="130" y="200" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">partition · J / elbow · O(NKD)</text>
        <text x="390" y="200" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">density · BIC · O(NKD²)</text>
      </svg>`,
      caption: "Left: circular hard regions around centroids. Right: tilted Gaussian contours give soft, ellipsoidal clusters.",
      example: "Two elongated, diagonally-oriented clusters that touch: K-means cuts them with a straight perpendicular bisector and mislabels the overlap, while a GMM with full $\\boldsymbol\\Sigma_k$ aligns ellipses to each cluster's shape and assigns the ambiguous points fractionally."
    },
    {
      title: "How many clusters? Choosing K",
      tag: "practice",
      body: "<p>$K$ isn't given, so you estimate it. The <b>elbow</b> method plots distortion $J(K)$ — it always falls as $K$ grows, so you look for the kink where extra clusters stop buying much. For a GMM, <b>BIC</b> trades log-likelihood against a parameter penalty and can be maximized directly. The <b>silhouette</b> score $s(i)=\\dfrac{b_i-a_i}{\\max(a_i,b_i)}\\in[-1,1]$ compares each point's mean distance to its own cluster ($a_i$) versus the nearest other cluster ($b_i$); pick the $K$ with the highest mean $s$. The <b>gap statistic</b> compares $J(K)$ to its value on uniform random data.</p><p>If you do have labels, evaluate with <b>purity</b>, the (adjusted) <b>Rand index</b>, or <b>normalized mutual information</b>.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Elbow: distortion J(K) vs K</text>
        <line x1="55" y1="30" x2="55" y2="180" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="180" x2="495" y2="180" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="208" text-anchor="middle" font-size="12">number of clusters K →</text>
        <text x="22" y="105" font-size="12" transform="rotate(-90 22 105)" text-anchor="middle">distortion J</text>
        <!-- descending elbow curve -->
        <path d="M85,50 L150,95 L215,135 L280,150 L345,158 L410,163 L475,166" fill="none" class="vx-accent" stroke-width="2.5"/>
        <g style="fill:var(--accent)">
          <circle cx="85" cy="50" r="4"/><circle cx="150" cy="95" r="4"/><circle cx="215" cy="135" r="4"/><circle cx="280" cy="150" r="4"/><circle cx="345" cy="158" r="4"/><circle cx="410" cy="163" r="4"/><circle cx="475" cy="166" r="4"/>
        </g>
        <!-- elbow marker at K=3 -->
        <line x1="215" y1="180" x2="215" y2="135" class="vx-grid" stroke-dasharray="4 4"/>
        <circle cx="215" cy="135" r="7" class="vx-good" fill="none" stroke-width="2.5"/>
        <text x="226" y="128" font-size="11" style="fill:var(--good)">elbow → K ≈ 3</text>
        <g font-size="10.5" style="fill:var(--text-faint)">
          <text x="85" y="196" text-anchor="middle">1</text><text x="150" y="196" text-anchor="middle">2</text><text x="215" y="196" text-anchor="middle">3</text><text x="280" y="196" text-anchor="middle">4</text><text x="345" y="196" text-anchor="middle">5</text><text x="410" y="196" text-anchor="middle">6</text><text x="475" y="196" text-anchor="middle">7</text>
        </g>
      </svg>`,
      caption: "J always decreases; the 'elbow' is where the marginal gain drops sharply — here around K = 3.",
      example: "Distortion drops steeply from $K{=}1$ to $3$ then nearly flattens — the elbow says $K{\\approx}3$. Cross-checking, BIC peaks at $K{=}3$ and mean silhouette is highest there too, so all three heuristics agree."
    },
    {
      title: "Principal components analysis (PCA)",
      tag: "core",
      body: "<p>PCA has two equivalent views. <b>Min reconstruction error:</b> find an orthonormal basis ($\\mathbf{W}^\\top\\mathbf{W}=\\mathbf{I}$) minimizing $\\tfrac1N\\|\\mathbf{X}-\\mathbf{Z}\\mathbf{W}^\\top\\|_F^2$. <b>Max variance:</b> the first direction $\\boldsymbol{w}_1=\\arg\\max_{\\|\\boldsymbol{w}\\|=1}\\boldsymbol{w}^\\top\\hat{\\boldsymbol\\Sigma}\\boldsymbol{w}$. Both give the same answer: the top-$L$ <b>eigenvectors</b> of the empirical covariance $\\hat{\\boldsymbol\\Sigma}$, equivalently the top-$L$ <b>right singular vectors</b> of centered $\\mathbf{X}$.</p><p>With the SVD $\\mathbf{X}=\\mathbf{U}\\mathbf{S}\\mathbf{V}^\\top$: scores $\\mathbf{Z}=\\mathbf{U}\\mathbf{S}$, loadings $\\mathbf{W}=\\mathbf{V}_L$, and eigenvalues $\\lambda_j=s_j^2/N$. The leftover reconstruction error is $\\sum_{j>L}\\lambda_j$; the <b>fraction of variance</b> kept is $F_L=\\dfrac{\\sum_{j\\le L}\\lambda_j}{\\sum_j\\lambda_j}$. Choose $L$ at the <b>scree</b> elbow. <b>Whitening</b>, $\\tilde{\\boldsymbol{z}}=\\boldsymbol\\Lambda^{-1/2}\\mathbf{V}^\\top\\boldsymbol{x}$, rescales the components to identity covariance (decorrelated, unit variance).</p>",
      visual: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Principal axes = directions of max variance</text>
        <!-- elongated point cloud along a diagonal -->
        <g style="fill:var(--text-dim)">
          <circle cx="150" cy="170" r="3"/><circle cx="180" cy="158" r="3"/><circle cx="205" cy="150" r="3"/><circle cx="230" cy="138" r="3"/><circle cx="258" cy="128" r="3"/><circle cx="285" cy="118" r="3"/><circle cx="312" cy="108" r="3"/><circle cx="340" cy="96" r="3"/><circle cx="368" cy="88" r="3"/>
          <circle cx="175" cy="172" r="3"/><circle cx="210" cy="162" r="3"/><circle cx="245" cy="150" r="3"/><circle cx="275" cy="138" r="3"/><circle cx="300" cy="132" r="3"/><circle cx="330" cy="116" r="3"/><circle cx="355" cy="106" r="3"/>
          <circle cx="195" cy="142" r="3"/><circle cx="232" cy="128" r="3"/><circle cx="268" cy="118" r="3"/><circle cx="300" cy="104" r="3"/><circle cx="335" cy="92" r="3"/>
        </g>
        <!-- mean -->
        <circle cx="258" cy="132" r="4" style="fill:var(--text)"/>
        <!-- PC1: long axis along the spread -->
        <line x1="150" y1="178" x2="372" y2="86" class="vx-accent" stroke-width="3" marker-end="url(#pcA)"/>
        <!-- PC2: short, orthogonal -->
        <line x1="258" y1="132" x2="222" y2="46" class="vx-good" stroke-width="2.5" marker-end="url(#pcB)"/>
        <defs>
          <marker id="pcA" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" style="fill:var(--accent)"/></marker>
          <marker id="pcB" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" style="fill:var(--good)"/></marker>
        </defs>
        <text x="378" y="88" font-size="12" style="fill:var(--accent)" font-weight="700">PC1</text>
        <text x="198" y="44" font-size="12" style="fill:var(--good)" font-weight="700">PC2</text>
        <text x="40" y="222" font-size="11" style="fill:var(--text-dim)">PC1 = longest axis (most variance); PC2 ⟂ PC1, the next-most.</text>
      </svg>`,
      caption: "PC1 points along the cloud's longest spread (largest λ); PC2 is orthogonal and shorter.",
      example: "On 64-dim handwritten-digit vectors, the first ~20 PCs capture $F_L\\approx90\\%$ of the variance. Projecting onto them compresses the data 3× while keeping the digits visually reconstructable; the discarded directions are mostly pixel noise."
    },
    {
      title: "Probabilistic PCA, factor analysis & the scree plot",
      tag: "core",
      body: "<p><b>Factor analysis (FA)</b> is the generative model behind PCA: a low-dim latent $p(\\boldsymbol{z})=\\mathcal{N}(\\mathbf{0},\\mathbf{I})$ generates the data via $p(\\boldsymbol{x}\\mid\\boldsymbol{z})=\\mathcal{N}(\\mathbf{W}\\boldsymbol{z}+\\boldsymbol\\mu,\\boldsymbol\\Psi)$ with <b>diagonal</b> $\\boldsymbol\\Psi$ (independent per-dimension noise). The marginal covariance is $\\mathbf{C}=\\mathbf{W}\\mathbf{W}^\\top+\\boldsymbol\\Psi$ — <b>low-rank plus diagonal</b>, so it needs $O(LD)$ parameters instead of $O(D^2)$. $\\mathbf{W}$ is identified only up to a <b>rotation</b>; fit by EM. A <b>mixture of FA</b> captures multiple local manifolds.</p><p><b>Probabilistic PCA (PPCA)</b> is FA with isotropic noise $\\boldsymbol\\Psi=\\sigma^2\\mathbf{I}$: $\\hat{\\mathbf{W}}=\\mathbf{V}_L(\\boldsymbol\\Lambda_L-\\sigma^2\\mathbf{I})^{1/2}\\mathbf{R}$ and $\\hat\\sigma^2=\\tfrac{1}{D-L}\\sum_{j>L}\\lambda_j$ — the leftover variance. It is a proper density (so it supports imputation and sampling) and recovers classical PCA as $\\sigma^2\\to0$. The <b>scree plot</b> of eigenvalues $\\lambda_j$ in descending order makes the elbow visible.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Scree plot: eigenvalues λⱼ, descending</text>
        <line x1="55" y1="30" x2="55" y2="175" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="175" x2="495" y2="175" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="205" text-anchor="middle" font-size="12">component index j →</text>
        <text x="22" y="103" font-size="12" transform="rotate(-90 22 103)" text-anchor="middle">eigenvalue λⱼ</text>
        <!-- bars: kept (accent) then noise (faint) -->
        <g>
          <rect x="78"  y="48"  width="32" height="127" rx="2" style="fill:var(--accent)"/>
          <rect x="128" y="86"  width="32" height="89"  rx="2" style="fill:var(--accent)"/>
          <rect x="178" y="120" width="32" height="55"  rx="2" style="fill:var(--accent)"/>
          <rect x="228" y="152" width="32" height="23"  rx="2" style="fill:var(--text-faint)"/>
          <rect x="278" y="160" width="32" height="15"  rx="2" style="fill:var(--text-faint)"/>
          <rect x="328" y="165" width="32" height="10"  rx="2" style="fill:var(--text-faint)"/>
          <rect x="378" y="168" width="32" height="7"   rx="2" style="fill:var(--text-faint)"/>
          <rect x="428" y="170" width="32" height="5"   rx="2" style="fill:var(--text-faint)"/>
        </g>
        <!-- elbow indicator after 3rd bar -->
        <path d="M210,118 C232,128 240,148 248,150" fill="none" class="vx-good" stroke-width="2" marker-end="url(#scA)"/>
        <defs><marker id="scA" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" style="fill:var(--good)"/></marker></defs>
        <text x="252" y="120" font-size="11" style="fill:var(--good)">elbow → keep L = 3</text>
        <text x="78" y="190" font-size="10" style="fill:var(--accent)">kept: signal</text>
        <text x="300" y="190" font-size="10" style="fill:var(--text-faint)">tail → σ² noise</text>
      </svg>`,
      caption: "Eigenvalues fall off a cliff after L = 3; the flat tail is the leftover variance PPCA absorbs as σ².",
      example: "Survey responses to 20 questions are driven by ~3 latent factors. FA's covariance $\\mathbf{W}\\mathbf{W}^\\top+\\boldsymbol\\Psi$ uses $20\\times3 + 20$ parameters instead of a full $20\\times20$ matrix, and the diagonal $\\boldsymbol\\Psi$ soaks up each question's idiosyncratic noise."
    },
    {
      title: "Independent components analysis (ICA)",
      tag: "advanced",
      body: "<p><b>ICA</b> solves blind source separation — the cocktail-party problem. The model is $\\boldsymbol{x}_t=\\mathbf{W}\\boldsymbol{z}_t+\\boldsymbol\\epsilon_t$ with <b>independent, non-Gaussian</b> sources $p(\\boldsymbol{z})=\\prod_j p_j(z_j)$. The crucial point: <b>non-Gaussianity is what makes the individual sources recoverable</b>. If the sources were Gaussian you could only recover their subspace (as PCA does), because a rotation of independent Gaussians is still independent Gaussians.</p><p>Algorithmically: <b>whiten</b> the data, then find the rotation that <b>maximizes non-Gaussianity</b> — equivalent to minimizing mutual information, to MLE, and to infomax. <b>FastICA</b> is the standard approximate-Newton solver. Only the <b>sign and permutation</b> of the recovered sources are unidentifiable.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Cocktail party: unmix observed signals → sources</text>
        <!-- mixed signals -->
        <text x="20" y="62" font-size="10.5" style="fill:var(--text-dim)">mic 1</text>
        <path d="M70,62 q12,-22 24,0 t24,8 t24,-16 t24,10 t24,-4 t24,6 t24,-12 t24,8" fill="none" class="vx-warn" stroke-width="1.6"/>
        <text x="20" y="112" font-size="10.5" style="fill:var(--text-dim)">mic 2</text>
        <path d="M70,112 q14,16 28,-6 t28,4 t28,12 t28,-18 t28,8 t28,-2 t28,10" fill="none" class="vx-warn" stroke-width="1.6"/>
        <!-- arrow box -->
        <rect x="315" y="56" width="60" height="62" rx="6" class="vx-accent" fill="none" stroke-width="2"/>
        <text x="345" y="84" text-anchor="middle" font-size="11" style="fill:var(--text)" font-weight="700">ICA</text>
        <text x="345" y="100" text-anchor="middle" font-size="9.5" style="fill:var(--text-dim)">FastICA</text>
        <path d="M300,87 L313,87" class="vx-axis" stroke-width="1.5" marker-end="url(#icA)"/>
        <path d="M377,87 L392,87" class="vx-axis" stroke-width="1.5" marker-end="url(#icA)"/>
        <defs><marker id="icA" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" style="fill:var(--text-dim)"/></marker></defs>
        <!-- recovered sources: clean -->
        <path d="M398,70 q15,-18 30,0 t30,0 t30,0 t30,0" fill="none" class="vx-good" stroke-width="1.8"/>
        <path d="M398,112 l10,-20 l10,20 l10,-20 l10,20 l10,-20 l10,20 l10,-20 l10,20 l10,-20" fill="none" class="vx-accent" stroke-width="1.8"/>
        <text x="430" y="142" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">independent sources</text>
        <text x="40" y="178" font-size="11" style="fill:var(--text-dim)">Non-Gaussianity ⇒ recover the sources, not just their subspace.</text>
      </svg>`,
      caption: "Two microphones record a mix of voices; ICA rotates the whitened data to separate the non-Gaussian sources.",
      example: "Two speakers recorded on two microphones produce two mixed waveforms. ICA recovers each voice up to sign and order — you can't tell which is 'source 1' or whether it was flipped, but the speech is cleanly separated."
    },
    {
      title: "VAE, autoencoders & t-SNE/UMAP",
      tag: "advanced",
      body: "<p>A <b>variational autoencoder (VAE)</b> is nonlinear FA: an NN <b>encoder</b> $q_\\phi(\\boldsymbol{z}\\mid\\boldsymbol{x})$ maps data to a latent distribution and an NN <b>decoder</b> $p_\\theta(\\boldsymbol{x}\\mid\\boldsymbol{z})$ maps it back. It is trained on the <b>ELBO</b> using the <b>reparameterization trick</b> $\\boldsymbol{z}=\\boldsymbol\\mu_\\phi+\\boldsymbol\\sigma_\\phi\\odot\\boldsymbol\\epsilon$, which pushes the randomness into $\\boldsymbol\\epsilon\\sim\\mathcal{N}(\\mathbf{0},\\mathbf{I})$ so gradients flow through the sampling step.</p><p>A plain (deterministic) <b>autoencoder</b> just minimizes reconstruction through a bottleneck — and a <i>linear</i> autoencoder recovers the PCA subspace. <b>t-SNE</b> and <b>UMAP</b> are nonlinear <b>visualization</b> methods that preserve <i>local</i> neighborhood structure for 2-D plots; global distances between far-apart clusters are not meaningful.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">VAE: encode → latent z → decode</text>
        <!-- input -->
        <rect x="40" y="70" width="34" height="60" rx="4" class="vx-axis" fill="none" stroke-width="1.5"/>
        <text x="57" y="150" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">x</text>
        <!-- encoder trapezoid -->
        <path d="M90,72 L150,92 L150,108 L90,128 Z" class="vx-accent" fill="none" stroke-width="2"/>
        <text x="118" y="104" text-anchor="middle" font-size="9.5" style="fill:var(--text)">enc q(z|x)</text>
        <!-- latent -->
        <circle cx="222" cy="100" r="22" class="vx-good" fill="none" stroke-width="2"/>
        <text x="222" y="96" text-anchor="middle" font-size="11" style="fill:var(--text)" font-weight="700">z</text>
        <text x="222" y="110" text-anchor="middle" font-size="8.5" style="fill:var(--text-dim)">μ + σ⊙ε</text>
        <!-- decoder trapezoid -->
        <path d="M294,92 L354,72 L354,128 L294,108 Z" class="vx-accent" fill="none" stroke-width="2"/>
        <text x="324" y="104" text-anchor="middle" font-size="9.5" style="fill:var(--text)">dec p(x|z)</text>
        <!-- output -->
        <rect x="372" y="70" width="34" height="60" rx="4" class="vx-axis" fill="none" stroke-width="1.5"/>
        <text x="389" y="150" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">x̂</text>
        <!-- arrows -->
        <g class="vx-axis" stroke-width="1.4">
          <line x1="74" y1="100" x2="88" y2="100" marker-end="url(#vA)"/>
          <line x1="152" y1="100" x2="198" y2="100" marker-end="url(#vA)"/>
          <line x1="246" y1="100" x2="292" y2="100" marker-end="url(#vA)"/>
          <line x1="356" y1="100" x2="370" y2="100" marker-end="url(#vA)"/>
        </g>
        <defs><marker id="vA" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" style="fill:var(--text-dim)"/></marker></defs>
        <text x="440" y="100" font-size="10.5" style="fill:var(--text-faint)">trained</text>
        <text x="440" y="114" font-size="10.5" style="fill:var(--text-faint)">on ELBO</text>
        <text x="40" y="180" font-size="11" style="fill:var(--text-dim)">Reparameterization moves randomness into ε so gradients flow.</text>
      </svg>`,
      caption: "Encoder maps x to a latent distribution; reparameterized sampling yields z; decoder reconstructs x̂ — all trained on the ELBO.",
      example: "Train a VAE on face images: the encoder maps each face to a point in a smooth latent space; decoding interpolations between two points morphs one face into another. A t-SNE plot of those latent codes then clusters similar faces locally — but the gaps between distant clusters carry no meaning."
    },
    {
      title: "Hierarchical agglomerative clustering (HAC)",
      tag: "clustering",
      body: "<p><b>HAC</b> is a <b>bottom-up</b> clustering scheme: start with every point as its own singleton cluster, then repeatedly <b>merge the two closest clusters</b> until one cluster remains. The full sequence of merges is recorded as a <b>dendrogram</b> — a binary tree whose join heights are the inter-cluster distances at each merge. Crucially it needs <b>no preset $K$</b>: you read off any number of clusters afterward by <b>cutting the tree at a chosen height</b> (a lower cut yields more, tighter clusters).</p><p>The behavior is set by the <b>linkage</b> — how cluster-to-cluster distance is defined from pairwise point distances:</p><ul><li><b>Single</b> (nearest pair, $\\min$): can follow thin bridges between groups → <i>chaining</i> into long straggly clusters.</li><li><b>Complete</b> (farthest pair, $\\max$): demands all members be close → tight, <b>compact</b> clusters.</li><li><b>Average</b> (mean pairwise distance, <b>UPGMA</b>): a middle ground that is <b>generally the best default</b>.</li></ul><p>Unlike <b>K-means</b> and <b>GMM</b>, which fix $K$ up front and return a single flat partition, HAC produces a whole <b>hierarchy</b> and defers the choice of $K$ to the cut. The price is cost: a naive implementation is $O(N^3)$ (or $O(N^2\\log N)$ with a heap) and $O(N^2)$ memory, so it suits modest $N$.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Dendrogram: merge closest clusters, bottom-up</text>
        <!-- axes: height grows upward; SVG y points DOWN so higher merge = smaller y -->
        <line x1="55" y1="40" x2="55" y2="185" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="185" x2="495" y2="185" class="vx-axis" stroke-width="1.5"/>
        <text x="22" y="112" font-size="11" transform="rotate(-90 22 112)" text-anchor="middle">merge height</text>
        <!-- leaves a b c d e at the baseline -->
        <g style="fill:var(--accent)">
          <circle cx="110" cy="185" r="4"/><circle cx="170" cy="185" r="4"/><circle cx="250" cy="185" r="4"/><circle cx="350" cy="185" r="4"/><circle cx="430" cy="185" r="4"/>
        </g>
        <g font-size="10.5" style="fill:var(--text-dim)" text-anchor="middle">
          <text x="110" y="202">a</text><text x="170" y="202">b</text><text x="250" y="202">c</text><text x="350" y="202">d</text><text x="430" y="202">e</text>
        </g>
        <!-- merge 1 (lowest, largest y): a+b at small height -->
        <path d="M110,185 L110,158 L170,158 L170,185" fill="none" class="vx-accent" stroke-width="2"/>
        <!-- merge 2: d+e a bit higher -->
        <path d="M350,185 L350,140 L430,140 L430,185" fill="none" class="vx-accent" stroke-width="2"/>
        <!-- merge 3: (ab)+c higher still -->
        <path d="M140,158 L140,108 L250,108 L250,185" fill="none" class="vx-accent" stroke-width="2"/>
        <!-- merge 4 (root, highest = smallest y): (abc)+(de) -->
        <path d="M195,108 L195,62 L390,62 L390,140" fill="none" class="vx-accent" stroke-width="2"/>
        <!-- cut line: dashed horizontal; below root, above merge 3 → yields 2 clusters -->
        <line x1="55" y1="85" x2="495" y2="85" class="vx-grid" stroke-width="1.5" stroke-dasharray="5 4"/>
        <text x="498" y="80" font-size="10.5" style="fill:var(--text-faint)" text-anchor="end">cut → 2 clusters: {a,b,c}, {d,e}</text>
        <text x="40" y="222" font-size="10.5" style="fill:var(--text-dim)">Lower cut → more, tighter clusters; no K fixed in advance.</text>
      </svg>`,
      caption: "Each ⊓ joins the two closest clusters at its height; a horizontal cut (dashed) selects the number of clusters — here 2.",
      example: "Cluster 30 animal species from a $30\\times30$ distance matrix of trait differences. HAC with average linkage builds a dendrogram; cutting it low gives many fine groups (e.g. separate big cats), while cutting near the root gives a few broad ones (mammals vs birds). Switching to single linkage instead chains a borderline species onto a neighboring group via one close pair, blurring the split."
    }
  ]
};
