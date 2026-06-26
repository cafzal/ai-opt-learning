/* Review: Applied ML — Fewer Labels & ML in Practice */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["applied-ml"] = {
  intro: "Labels are expensive and the real world is messy. This batch covers how to <i>learn with fewer labels</i> (augmentation, transfer, self-supervised, semi-/active/meta-learning, weak supervision) and the practical lifecycle that makes a model survive contact with production: preprocessing, missing data, class imbalance, the cardinal sin of <b>leakage</b>, honest evaluation, deployment drift, plus two specialized model families — recommenders and graph networks. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Seven ways to learn with fewer labels",
      tag: "core",
      body: "<p>Labels are the bottleneck, so each technique exploits some <i>extra signal</i> beyond plain regularization:</p><ul><li><b>Data augmentation</b> — known invariances; train on label-preserving perturbations (vicinal risk).</li><li><b>Transfer / fine-tuning</b> — a large source dataset; pretrain then adapt (freeze the backbone, or use LoRA/adapters).</li><li><b>Self-supervised</b> — unlabeled structure via pretext / contrastive tasks (SimCLR, CLIP).</li><li><b>Semi-supervised</b> — the marginal $p(\\boldsymbol{x})$ of unlabeled data: pseudo-labels, entropy-min, consistency/VAT, label propagation.</li><li><b>Active learning</b> — a labeling budget; query the most informative points (BALD).</li><li><b>Meta / few-shot</b> — a distribution of tasks; learn-to-adapt (MAML), metric learning (matching nets).</li><li><b>Weak supervision</b> — noisy / bag / distant labels, trained with a suitable loss.</li></ul>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Extra signal each method exploits</text>
        <g font-size="11">
          <text x="10" y="52">augmentation</text>
          <rect x="150" y="42" width="60" height="14" rx="3" style="fill:var(--good)"/>
          <text x="218" y="52" style="fill:var(--text-dim)">known invariances</text>
          <text x="10" y="80">transfer</text>
          <rect x="150" y="70" width="340" height="14" rx="3" style="fill:var(--accent)"/>
          <text x="10" y="108">self-supervised</text>
          <rect x="150" y="98" width="300" height="14" rx="3" style="fill:var(--accent)"/>
          <text x="10" y="136">semi-supervised</text>
          <rect x="150" y="126" width="240" height="14" rx="3" style="fill:var(--accent)"/>
          <text x="10" y="164">active learning</text>
          <rect x="150" y="154" width="90" height="14" rx="3" style="fill:var(--warn)"/>
          <text x="248" y="164" style="fill:var(--text-dim)">budget-limited</text>
          <text x="10" y="192">meta / few-shot</text>
          <rect x="150" y="182" width="160" height="14" rx="3" style="fill:var(--accent)"/>
          <text x="10" y="220">weak supervision</text>
          <rect x="150" y="210" width="120" height="14" rx="3" style="fill:var(--warn)"/>
          <text x="278" y="220" style="fill:var(--text-dim)">noisy labels</text>
        </g>
      </svg>`,
      caption: "Wide bars (transfer, self-supervised) tap huge unlabeled pools; narrow ones add targeted or imperfect signal.",
      example: "To classify medical images with only 200 labels: <b>augment</b> with rotations/flips, <b>transfer</b> from an ImageNet backbone, pretrain <b>self-supervised</b> on unlabeled scans, then use <b>active learning</b> to spend the radiologist's limited time on the most uncertain cases.",
      takeaway: "Matching the method to the signal you actually have — invariances, a big backbone, unlabeled data, or a budget — is what turns a few hundred labels into a usable model."
    },
    {
      title: "Contrastive self-supervision & few-shot meta-learning",
      tag: "model",
      body: "<p><b>Contrastive learning</b> needs no labels — it learns a representation by deciding what belongs together. <b>SimCLR</b> pulls together two augmented views of the same image and pushes apart all other images in a shared embedding space; <b>CLIP</b> does the same across modalities, pulling matching image–caption pairs together. The payoff is <b>zero-shot transfer</b>: classify by prompting with text (\"a photo of a cat\") and picking the nearest caption embedding.</p><p><b>Meta-learning</b> is <i>learning to learn</i> across a distribution of tasks. <b>MAML</b> learns an initialization from which a few gradient steps adapt to a new task. The <b>few-shot</b> protocol is $C$-way $N$-shot: $C$ new classes, $N$ labeled examples each.</p>",
      example: "CLIP, trained on 400M image–caption pairs, classifies photos into ImageNet categories it never explicitly trained on. MAML enables 5-way 1-shot learning: shown 5 never-seen classes with one image each, a couple gradient steps suffice to classify new queries.",
      takeaway: "A good pretrained representation lets you ship a classifier for new categories with zero or a handful of labels, instead of collecting and annotating a fresh dataset per task."
    },
    {
      title: "Semi-supervised assumptions & confirmation bias",
      tag: "pitfall",
      body: "<p>Why can unlabeled data help at all? Two <b>assumptions</b> must hold: the <b>cluster assumption</b> — decision boundaries lie in low-density regions (between clusters, not through them) — and the <b>manifold assumption</b> — labels vary smoothly along the data manifold.</p><p>Self-training (label unlabeled points with your own model, then retrain) is seductive but risks <b>confirmation bias</b>: the model reinforces its own confident mistakes in a feedback loop. Two guards: <b>threshold</b> pseudo-labels (keep only high-confidence ones), and <b>consistency / VAT</b> losses that penalize the prediction changing under (worst-case) perturbations.</p>",
      example: "Pseudo-labeling a tweet sentiment model: if you accept every self-prediction, early errors compound (confirmation bias). Keeping only predictions with $p>0.95$ and adding a consistency loss (label shouldn't flip under small word swaps) keeps self-training honest.",
      takeaway: "Before reaching for semi-supervised methods, check the cluster/manifold assumptions hold and gate pseudo-labels by confidence — otherwise self-training silently amplifies your model's own mistakes."
    },
    {
      title: "Preprocessing & missing data",
      tag: "practice",
      body: "<p>Preprocessing must be fit on the <b>training set only</b> (or you leak). The standard moves: <b>scale numeric</b> with z-score $\\frac{x-\\mu}{\\sigma}$ (scale-sensitive models) or min-max (bounded) — <b>trees are scale-invariant</b>; <b>encode categorical</b> via one-hot (nominal), ordinal (ordered), or embedding (high-cardinality); <b>vectorize text</b> with <b>TF-IDF</b> $\\log(\\text{TF}+1)\\cdot\\log\\frac{N}{1+\\text{DF}}$; <b>impute missing</b> by mean/median or model, <i>plus a \"was-missing\" indicator</i>.</p><p>Missingness mechanism matters: <b>MCAR</b> (random — ignorable), <b>MAR</b> (depends on observed features — ignorable for estimation), <b>MNAR</b> (depends on the unobserved value — informative, must be modeled). <b>Discriminative models can't take missing inputs</b>, so you must impute first.</p>",
      example: "A scale that fails on very high weights gives <b>MNAR</b> data — imputing the mean systematically underestimates. Adding 'income_was_missing' alongside a median fill preserves the signal that missingness itself can carry.",
      takeaway: "Fitting transforms on train-only and adding was-missing indicators prevents leakage and salvages signal; getting the missingness mechanism wrong quietly biases every downstream estimate."
    },
    {
      title: "Class imbalance & threshold tuning",
      tag: "pitfall",
      body: "<p>When one class is rare, <b>accuracy misleads</b>: 99% negatives means a do-nothing classifier scores 99% while catching zero positives. Better tools:</p><ul><li><b>PR curves / F1</b> instead of accuracy — they focus on the positive class.</li><li><b>Class weights</b> $\\propto 1/f_c$ — weight each class inversely to its frequency $f_c$ in the loss.</li><li><b>Resampling</b> — oversample the minority (<b>SMOTE</b> synthesizes interpolated minority points) or undersample the majority.</li><li><b>Threshold tuning</b> — the default 0.5 cutoff is arbitrary; pick the operating threshold on the <b>validation</b> set.</li></ul>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">99% negatives — accuracy is useless here</text>
        <line x1="55" y1="30" x2="55" y2="165" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="165" x2="495" y2="165" class="vx-axis" stroke-width="1.5"/>
        <rect x="90" y="45" width="120" height="120" rx="3" style="fill:var(--bg-elev2)"/>
        <text x="150" y="112" text-anchor="middle" font-size="12" style="fill:var(--text-dim)">negatives</text>
        <text x="150" y="132" text-anchor="middle" font-size="11" style="fill:var(--text-faint)">9900</text>
        <rect x="300" y="156" width="120" height="9" rx="2" style="fill:var(--bad)"/>
        <text x="360" y="150" text-anchor="middle" font-size="11" style="fill:var(--bad)">positives: 100</text>
        <line x1="255" y1="30" x2="255" y2="165" class="vx-warn" stroke-width="2.5" stroke-dasharray="6 4"/>
        <text x="262" y="44" font-size="10.5" style="fill:var(--warn)">tune this threshold</text>
        <text x="262" y="60" font-size="10.5" style="fill:var(--warn)">on validation, not 0.5</text>
        <text x="275" y="200" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">use PR / F1 and class weights ∝ 1/f, not raw accuracy</text>
      </svg>`,
      caption: "A tiny positive bar dwarfed by negatives; moving the decision threshold trades precision against recall.",
      example: "Fraud detection with 0.5% fraud: a 99.5%-accurate model can be the one that flags nothing. Weighting fraud ~200× in the loss, generating synthetic frauds with SMOTE, and lowering the threshold until recall is acceptable actually catches fraud.",
      takeaway: "On rare-event problems, reporting accuracy hides a useless model — track PR/F1 and tune the threshold to the precision/recall tradeoff your application actually cares about."
    },
    {
      title: "Data leakage — the cardinal sin",
      tag: "pitfall",
      body: "<p><b>Leakage</b> is when information from outside the training fold sneaks into the model, inflating offline scores that then collapse in production. Forms: <b>preprocessing leakage</b> (fitting a scaler/imputer/TF-IDF on <i>all</i> data before splitting); <b>target leakage</b> (a feature that's a proxy for the label); <b>temporal leakage</b> (using the future to predict the past); <b>group leakage</b> (the same entity in train and test).</p><p>The fix is a mindset: <b>the preprocessing pipeline is part of the model</b>. Fit it <i>inside each CV fold</i>; split time-series by time and groups by group.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">Leak-safe CV: fit preprocessing inside each fold</text>
        <text x="10" y="50" font-size="11" style="fill:var(--bad)">✗ WRONG</text>
        <text x="85" y="50" font-size="10.5" style="fill:var(--text-dim)">fit scaler on ALL data, then split</text>
        <rect x="85" y="58" width="405" height="16" rx="3" style="fill:var(--bad)"/>
        <text x="287" y="70" text-anchor="middle" font-size="10" style="fill:var(--text)">scaler sees validation rows — leak</text>
        <text x="10" y="112" font-size="11" style="fill:var(--good)">✓ RIGHT</text>
        <text x="85" y="112" font-size="10.5" style="fill:var(--text-dim)">split first, fit scaler on train part of each fold</text>
        <g transform="translate(85,122)">
          <rect x="0" y="0" width="100" height="16" rx="3" style="fill:var(--bg-elev2)"/><rect x="108" y="0" width="100" height="16" rx="3" style="fill:var(--bg-elev2)"/><rect x="216" y="0" width="100" height="16" rx="3" style="fill:var(--accent)"/>
          <text x="266" y="12" text-anchor="middle" font-size="9.5" style="fill:var(--text)">val</text>
          <rect x="0" y="24" width="100" height="16" rx="3" style="fill:var(--bg-elev2)"/><rect x="108" y="24" width="100" height="16" rx="3" style="fill:var(--accent)"/><rect x="216" y="24" width="100" height="16" rx="3" style="fill:var(--bg-elev2)"/>
          <text x="158" y="36" text-anchor="middle" font-size="9.5" style="fill:var(--text)">val</text>
          <rect x="0" y="48" width="100" height="16" rx="3" style="fill:var(--accent)"/><rect x="108" y="48" width="100" height="16" rx="3" style="fill:var(--bg-elev2)"/><rect x="216" y="48" width="100" height="16" rx="3" style="fill:var(--bg-elev2)"/>
          <text x="50" y="60" text-anchor="middle" font-size="9.5" style="fill:var(--text)">val</text>
        </g>
        <text x="85" y="210" font-size="10.5" style="fill:var(--text-faint)">grey = train (fit transform here), accent = held-out fold (transform only)</text>
      </svg>`,
      caption: "Refit the scaler/imputer on the training part of every fold; the held-out fold is only transformed, never fit.",
      example: "Standardizing features once on the full dataset before 5-fold CV leaks the validation rows' mean/variance into every fold — scores look great, then drop in production. Wrapping the scaler and model in a single pipeline that refits per fold fixes it.",
      takeaway: "Leakage is the #1 way a model looks great offline and collapses in production; treating the whole pipeline as the model and fitting inside each fold is the cheapest insurance you can buy."
    },
    {
      title: "Honest evaluation & deployment drift",
      tag: "practice",
      body: "<p>Keep the split strict and <b>touch the test set once</b>. To diagnose <i>why</i> a model underperforms, plot <b>learning curves</b> (error vs training-set size, for train and validation): <b>high bias</b> shows both curves high and converged (more data won't help); <b>high variance</b> shows a large persistent <b>gap</b> (more data or regularization helps). Compare against real baselines with paired tests and confidence intervals.</p><p>In production, version <b>data + code + model together</b> and watch for <b>train–serve skew</b> and shift: <b>data drift</b> $p(\\boldsymbol{x})$, <b>concept drift</b> $p(y\\mid\\boldsymbol{x})$, and <b>label shift</b> $p(y)$. Shadow-deploy with a rollback path.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="55" y1="20" x2="55" y2="200" class="vx-axis" stroke-width="1.5"/>
        <line x1="55" y1="200" x2="495" y2="200" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="232" text-anchor="middle" font-size="12">training-set size →</text>
        <text x="20" y="110" font-size="12" transform="rotate(-90 20 110)" text-anchor="middle">error</text>
        <path d="M70,185 C160,160 260,150 485,146" fill="none" class="vx-good" stroke-width="2.5"/>
        <path d="M70,55 C150,95 250,118 485,128" fill="none" class="vx-bad" stroke-width="2.5"/>
        <line x1="485" y1="128" x2="485" y2="146" class="vx-warn" stroke-width="2"/>
        <text x="478" y="142" font-size="10.5" text-anchor="end" style="fill:var(--warn)">gap</text>
        <text x="120" y="48" font-size="10.5" style="fill:var(--bad)">validation error (falls)</text>
        <text x="120" y="180" font-size="10.5" style="fill:var(--good)">training error (rises)</text>
        <g font-size="11"><rect x="320" y="205" width="12" height="3" style="fill:var(--good)"/><text x="338" y="212">train</text><rect x="395" y="205" width="12" height="3" style="fill:var(--bad)"/><text x="413" y="212">validation</text></g>
        <text x="95" y="100" font-size="10.5" style="fill:var(--text-dim)">large persistent gap = high variance</text>
      </svg>`,
      caption: "More data: train error rises, validation falls. A wide stubborn gap = variance; both high and converged = bias.",
      example: "Train error 2%, validation 18%, gap barely shrinking with more data → a <b>variance</b> problem (gather data / regularize). Both at 20% → <b>bias</b> (richer model). In production, a spam filter sees <b>data drift</b> when new users arrive but <b>concept drift</b> when spammers change tactics.",
      takeaway: "Learning curves tell you whether to spend on more data or a bigger model, and naming the drift type tells you whether to retrain or rebuild — so you fix the right problem instead of guessing."
    },
    {
      title: "Recommenders, factorization & graph networks",
      tag: "model",
      body: "<p><b>Recommenders</b> predict a sparse user–item matrix $\\mathbf{Y}$ (matrix completion). The workhorse, <b>matrix factorization</b>, approximates ratings with low-rank embeddings plus biases: $\\hat y_{ui}=\\mu+b_u+c_i+\\boldsymbol{u}_u^\\top\\boldsymbol{v}_i$, fit by regularized SGD or ALS. <b>Implicit feedback</b> (clicks) is positive-only → ranking losses; <b>BPR</b> maximizes $\\sigma(f_{ui}-f_{uj})$. <b>Factorization machines</b> add pairwise feature interactions, helping with <b>cold-start</b>.</p><p><b>Graphs</b> have no grid, so CNNs can't apply. <b>DeepWalk / node2vec</b> run skip-gram on random walks (transductive; can't embed unseen nodes). <b>GNNs</b> use <b>message passing</b>: aggregate neighbor features over $L$ layers = an <b>$L$-hop receptive field</b>. <b>GCN</b> normalizes the adjacency, <b>GraphSAGE</b> samples neighbors to scale, <b>GAT</b> weights them by attention.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700">Y ≈ U × Vᵀ  (low-rank completion)</text>
        <text x="60" y="48" font-size="11" style="fill:var(--text-dim)">sparse ratings Y (users × items)</text>
        <g transform="translate(60,56)" font-size="11" style="fill:var(--text)">
          <rect x="0" y="0" width="150" height="110" rx="4" fill="none" class="vx-grid" stroke-width="1.5"/>
          <text x="25" y="25">5</text><text x="75" y="25" style="fill:var(--text-faint)">·</text><text x="120" y="25">3</text>
          <text x="25" y="55" style="fill:var(--text-faint)">·</text><text x="75" y="55">4</text><text x="120" y="55" style="fill:var(--text-faint)">·</text>
          <text x="25" y="85">2</text><text x="75" y="85" style="fill:var(--text-faint)">·</text><text x="120" y="85" style="fill:var(--text-faint)">·</text>
          <text x="25" y="105" style="fill:var(--text-faint)">·</text><text x="75" y="105" style="fill:var(--text-faint)">·</text><text x="120" y="105">5</text>
        </g>
        <text x="238" y="115" font-size="20" style="fill:var(--text-dim)">≈</text>
        <g transform="translate(273,56)">
          <rect x="0" y="0" width="45" height="110" rx="4" style="fill:var(--accent)" opacity="0.85"/>
          <text x="22" y="135" text-anchor="middle" font-size="11" style="fill:var(--accent)">U</text>
          <text x="22" y="150" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">user vecs</text>
        </g>
        <text x="333" y="115" font-size="18" style="fill:var(--text-dim)">×</text>
        <g transform="translate(358,90)">
          <rect x="0" y="0" width="120" height="42" rx="4" style="fill:var(--good)" opacity="0.85"/>
          <text x="60" y="64" text-anchor="middle" font-size="11" style="fill:var(--good)">Vᵀ</text>
          <text x="60" y="79" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">item vecs</text>
        </g>
        <text x="260" y="205" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">"·" = unobserved entry to predict; rating ≈ user vec · item vec + biases</text>
      </svg>`,
      caption: "A mostly-empty ratings matrix factors into thin user and item embedding matrices that reconstruct the blanks.",
      example: "Netflix-style: user $u$'s 50-dim taste vector dotted with movie $i$'s vector (plus popularity bias $c_i$) predicts a rating for an unseen film; a brand-new movie has no $\\boldsymbol{v}_i$ — the cold-start problem. On a citation graph, a 2-layer GCN classifies a paper's topic from the papers it cites and the papers those cite (2 hops).",
      takeaway: "When your data is a sparse interaction matrix or a graph, these embedding methods fit where a generic classifier can't — but anticipate cold-start and pick the GNN variant by how big your graph is."
    }
  ]
};
