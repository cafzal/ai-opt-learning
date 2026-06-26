/* Batch: Applied ML  (ML-Fundamentals.md §12–§13) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["applied-ml"] = [
  {
    id: "app-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In <b>data augmentation</b>, what kind of prior knowledge lets you generate extra training examples from the ones you already have?",
    options: [
      "Known <i>invariances</i> — label-preserving perturbations of the input",
      "The density $p(\\boldsymbol{x})$ estimated from a large unlabeled pool",
      "A distribution over related <i>tasks</i> to adapt across",
      "A labeling budget spent on the most informative points"
    ],
    answer: 0,
    explanation: "Data augmentation exploits <i>known invariances</i>: you apply label-preserving perturbations to each example so the model trains on the neighborhood of each point (vicinal risk). The other options are the extra signals behind semi-supervised learning ($p(\\boldsymbol{x})$), meta/few-shot (a distribution of tasks), and active learning (a labeling budget).",
    ref: "§12 — Learning with fewer labels (techniques table)"
  },
  {
    id: "app-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Why is plain <b>accuracy</b> a misleading metric on a heavily class-imbalanced dataset (say 99% negatives)?",
    options: [
      "A trivial classifier that always predicts the majority class already scores ~99%",
      "Accuracy is undefined whenever one class is rarer than another",
      "Accuracy secretly optimizes the ranking loss instead of the 0–1 loss",
      "Accuracy can only be computed after fitting class weights $\\propto 1/f_c$"
    ],
    answer: 0,
    explanation: "With 99% negatives, a model that always predicts 'negative' is right 99% of the time while being useless on the positive class. That is why the notes recommend PR curves / F1, class weights $\\propto 1/f_c$, resampling (SMOTE), and threshold tuning on validation instead.",
    ref: "§13 — Class imbalance"
  },
  {
    id: "app-3", type: "mc", framing: "applied", difficulty: 2,
    prompt: "You train gradient-boosted <b>decision trees</b> on features measured in wildly different units (dollars, counts, ratios). Which preprocessing step does the source say you can safely skip?",
    options: [
      "Numeric scaling (z-score or min-max) — trees are scale-invariant",
      "One-hot encoding of nominal categorical features",
      "Imputing missing values before fitting",
      "Adding a 'was-missing' indicator column"
    ],
    answer: 0,
    explanation: "The preprocessing table notes that trees are <i>scale-invariant</i>, so z-score / min-max scaling matters only for scale-sensitive models, not trees. Encoding categoricals and handling missing values (impute + 'was-missing' indicator) are still required regardless of model.",
    ref: "§13 — Preprocessing (scale numeric)"
  },
  {
    id: "app-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "Standardize a feature with <b>z-score</b> scaling, $\\frac{x-\\mu}{\\sigma}$. A training column has mean $\\mu=70$ and standard deviation $\\sigma=10$. What is the standardized value of the raw observation $x=85$?",
    answer: 1.5, tolerance: 0.01, unit: "",
    hint: "Compute $(85-70)/10$.",
    explanation: "$\\frac{x-\\mu}{\\sigma}=\\frac{85-70}{10}=1.5$ — the point sits 1.5 standard deviations above the mean. Crucially $\\mu$ and $\\sigma$ must be estimated on the <i>training set only</i>; fitting them on all data is leakage.",
    ref: "§13 — Preprocessing (z-score standardization)"
  },
  {
    id: "app-5", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "<b>Contrastive</b> self-supervised methods like SimCLR and CLIP shape an embedding space by doing what?",
    options: [
      "Pulling together augmented views (or image–caption pairs) and pushing apart negatives",
      "Reconstructing the input pixel-by-pixel from a bottleneck code",
      "Querying a human oracle for labels on the most uncertain examples",
      "Propagating a few given labels along edges of a similarity graph"
    ],
    answer: 0,
    explanation: "Contrastive learning pulls together positives — augmented views of the same image, or matched image–caption pairs — and pushes apart negatives in a shared embedding space. For CLIP this enables zero-shot transfer via text prompts. Label propagation and oracle queries are semi-supervised / active-learning ideas, not contrastive ones.",
    ref: "§12 — Contrastive (SimCLR/CLIP)"
  },
  {
    id: "app-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every statement that correctly describes the <b>assumptions and risks of semi-supervised learning</b> as presented in the notes.",
    options: [
      "Cluster assumption: decision boundaries should lie in low-density regions",
      "Manifold assumption: labels vary smoothly on the data manifold",
      "Self-training risks confirmation bias, so pseudo-labels should be thresholded",
      "Consistency / VAT reward the model for changing its prediction under perturbations",
      "Semi-supervised learning ignores the unlabeled inputs $p(\\boldsymbol{x})$ entirely"
    ],
    answer: [0, 1, 2],
    explanation: "The cluster assumption places boundaries in low-density regions; the manifold assumption says labels are smooth on the data manifold; and self-training can amplify its own mistakes (confirmation bias), so pseudo-labels are thresholded. Consistency / VAT <i>penalize</i> prediction <i>change</i> under (worst-case) perturbations — not reward it — and the whole point of semi-supervised learning is to <i>use</i> the unlabeled $p(\\boldsymbol{x})$.",
    ref: "§12 — Semi-supervised assumptions"
  },
  {
    id: "app-7", type: "mc", framing: "applied", difficulty: 3,
    prompt: "Data is <b>missing</b> in your feature matrix. According to the notes, which mechanism is <i>informative</i> and therefore cannot be ignored — you must model the missingness mechanism itself?",
    options: [
      "MNAR — missing not at random",
      "MCAR — missing completely at random",
      "MAR — missing at random (depends only on observed values)",
      "All three are ignorable for estimation"
    ],
    answer: 0,
    explanation: "MCAR is ignorable, and MAR (missingness depends only on observed values) is ignorable for estimation. MNAR is informative — the fact that a value is missing carries signal — so you must model the mechanism. Either way, discriminative models can't take missing inputs, so you impute first.",
    ref: "§13 — Missing data (MCAR/MAR/MNAR)"
  },
  {
    id: "app-8", type: "numeric", framing: "applied", difficulty: 4,
    prompt: "Compute a <b>TF-IDF</b> weight using $\\log(\\text{TF}{+}1)\\cdot\\log\\frac{N}{1+\\text{DF}}$ with base-10 logs. A term appears $\\text{TF}=9$ times in a document; the corpus has $N=1000$ documents and the term's document frequency is $\\text{DF}=9$. What is its TF-IDF weight?",
    answer: 2, tolerance: 0.01, unit: "",
    hint: "$\\log_{10}(9{+}1)\\cdot\\log_{10}\\!\\big(1000/(1{+}9)\\big)$.",
    explanation: "$\\log_{10}(9{+}1)=\\log_{10}10=1$ and $\\log_{10}\\frac{1000}{1+9}=\\log_{10}100=2$, so the weight is $1\\cdot 2=2$. The $\\log(\\text{TF}{+}1)$ term dampens raw counts while $\\log\\frac{N}{1+\\text{DF}}$ down-weights terms common across many documents.",
    ref: "§13 — Vectorize text (TF-IDF)"
  },
  {
    id: "app-9", type: "ms", framing: "applied", difficulty: 4,
    prompt: "<b>Data leakage</b> is called the cardinal sin of applied ML. Select every practice that correctly <i>prevents</i> leakage.",
    options: [
      "Treat the preprocessing pipeline as part of the model and fit it inside each CV fold",
      "Split time-series data by time, and grouped data by group",
      "Fit the scaler / imputer on the full dataset (train + test) before splitting, for stability",
      "Touch the test set only once, as a final generalization estimate",
      "Choose features by their correlation with the target computed over all the data"
    ],
    answer: [0, 1, 3],
    explanation: "Leakage is prevented by making preprocessing <i>part of the model</i> and fitting it inside each CV fold, by splitting time-series by time and groups by group, and by touching the test set only once. Fitting a scaler on train+test, or selecting features using target correlations computed over all data, both leak information from the held-out set into training.",
    ref: "§13 — Data leakage (the cardinal sin)"
  },
  {
    id: "app-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "Compare the two families of <b>graph representation</b> methods in the notes. Which statement is correct?",
    options: [
      "Shallow methods like DeepWalk/node2vec are transductive and can't embed unseen nodes, while GNN message passing is inductive",
      "DeepWalk/node2vec are inductive and generalize to new nodes; GNNs are transductive",
      "Both families use the node's own features but ignore graph structure",
      "Stacking $L$ GNN layers gives each node a 1-hop receptive field regardless of $L$"
    ],
    answer: 0,
    explanation: "Shallow methods (DeepWalk / node2vec = skip-gram on random walks) are transductive, ignore node features, and can't embed unseen nodes. GNNs do inductive message passing — aggregating transformed neighbor features — and stacking $L$ layers yields an $L$-hop receptive field, so they generalize to new nodes and use node features.",
    ref: "§13 — Graph embeddings & GNNs"
  }
];
