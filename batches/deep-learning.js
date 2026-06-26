/* Batch: Deep Learning & Generative AI  (ML-Fundamentals.md §8) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["deep-learning"] = [
  {
    id: "dl-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "An <b>MLP</b> stacks layers $\\boldsymbol{h}^{(\\ell)}=\\sigma(\\mathbf{W}^{(\\ell)}\\boldsymbol{h}^{(\\ell-1)}+\\boldsymbol{b}^{(\\ell)})$. What happens if you remove the nonlinearity $\\sigma$ from every layer?",
    options: [
      "The whole stack collapses to a single linear map",
      "The network can still approximate any continuous function",
      "Gradients are guaranteed to vanish",
      "It becomes equivalent to a convolutional network"
    ],
    answer: 0,
    explanation: "Without the nonlinearity, composing affine maps yields another affine map, so the entire deep stack collapses to one linear transformation $\\mathbf{W}\\boldsymbol{x}+\\boldsymbol{b}$ — depth buys nothing. The nonlinearity is exactly what gives the network its expressive power.",
    ref: "§8 — Neural network basics"
  },
  {
    id: "dl-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Which normalization layer is the <b>default</b> for transformers because it operates per-example and is batch-size-independent?",
    options: [
      "BatchNorm",
      "LayerNorm",
      "Dropout",
      "Max pooling"
    ],
    answer: 1,
    explanation: "BatchNorm normalizes over the batch, making it batch-size-dependent. <b>LayerNorm</b> normalizes over the features of each example, so it is batch-independent and is the standard for transformers (pre-norm is more stable for deep models).",
    ref: "§8 — Layers & components"
  },
  {
    id: "dl-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "For a 1-D convolution stack, the <b>receptive field</b> grows with depth as $1+L(K-1)$. With $L=5$ stacked layers each using kernel size $K=3$ (stride 1, no dilation), how many input positions does one output unit see?",
    answer: 11, tolerance: 0, unit: "",
    hint: "Plug $L=5,\\ K=3$ into $1+L(K-1)$.",
    explanation: "$1+L(K-1)=1+5(3-1)=1+10=11$. Each layer adds $K-1=2$ to the field, so stacking small kernels deepens the receptive field linearly — one reason deep CNNs use many small filters instead of one large one.",
    ref: "§8 — Convolution"
  },
  {
    id: "dl-4", type: "mc", framing: "applied", difficulty: 2,
    prompt: "The <b>autoregressive framework</b> factorizes $p(\\boldsymbol{x})=p(x_1)\\prod_t p(x_t\\mid x_{<t})$. How is such a model trained and how does it generate?",
    options: [
      "Trained by per-token cross-entropy; generates by feeding samples back in (decoding)",
      "Trained by MSE on the whole sequence at once; generates in a single forward pass",
      "Trained contrastively across two encoders; generates by nearest-neighbor lookup",
      "Trained by maximizing a variational denoising bound; generates by reversing added noise"
    ],
    answer: 0,
    explanation: "The autoregressive framework trains by <b>per-token cross-entropy</b> (each token predicted from its predecessors) and generates by feeding sampled tokens back as input — this is the foundation of language models. The contrastive and variational-denoising options describe CLIP and diffusion respectively.",
    ref: "§8 — Losses"
  },
  {
    id: "dl-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "<b>Dropout</b> zeros each unit with probability $p$ at training time and scales the survivors by $1/(1-p)$ to keep expectations consistent. For a drop rate of $p=0.2$, what is the scale-up factor applied to the surviving activations?",
    answer: 1.25, tolerance: 0.01, unit: "",
    hint: "Compute $1/(1-p)$ with $p=0.2$.",
    explanation: "$\\frac{1}{1-p}=\\frac{1}{1-0.2}=\\frac{1}{0.8}=1.25$. Scaling survivors at train time (inverted dropout) keeps the expected activation unchanged, so dropout can simply be disabled at test time with no rescaling.",
    ref: "§8 — Dropout"
  },
  {
    id: "dl-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Select every technique the notes list as a mitigation for <b>vanishing/exploding gradients</b>.",
    options: [
      "ReLU activations",
      "Residual connections",
      "Gradient clipping",
      "Gating (LSTM/GRU)",
      "Increasing the minibatch size to reduce noise"
    ],
    answer: [0, 1, 2, 3],
    explanation: "Vanishing/exploding gradients arise from products of many Jacobians and are mitigated by ReLU, residual connections, normalization, careful init, gradient clipping, and gating (LSTM/GRU). Minibatch size controls SGD noise (implicit regularization), not the gradient-magnitude problem.",
    ref: "§8 — Training"
  },
  {
    id: "dl-7", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "In scaled dot-product attention $\\text{softmax}\\!\\big(\\tfrac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt d}\\big)\\mathbf{V}$, why is <b>positional encoding</b> added to the inputs?",
    options: [
      "Because attention is permutation-invariant and would otherwise ignore token order",
      "To reduce the $O(n^2 d)$ cost of self-attention",
      "To prevent the softmax from saturating for large $d$",
      "To let the decoder attend to future tokens"
    ],
    answer: 0,
    explanation: "Self-attention treats its inputs as an unordered set — it is <b>permutation-invariant</b> — so order must be injected explicitly via positional encoding (sinusoidal or learned; modern variants RoPE/ALiBi). The $\\sqrt d$ scaling, not positional encoding, controls softmax saturation.",
    ref: "§8 — Attention"
  },
  {
    id: "dl-8", type: "ms", framing: "applied", difficulty: 4,
    prompt: "Select every <b>true</b> statement about <b>self-attention</b> as described in the notes.",
    options: [
      "It gives $O(1)$ path length between any two tokens",
      "Its compute cost scales as $O(n^2 d)$ in sequence length",
      "Masked/causal attention is used for autoregressive decoders",
      "Cross-attention connects an encoder to a decoder",
      "Its path length between distant tokens is $O(n)$, like an RNN"
    ],
    answer: [0, 1, 2, 3],
    explanation: "Self-attention connects any two tokens with $O(1)$ path length (vs $O(n)$ for RNNs) at $O(n^2 d)$ cost. Masked/causal attention enforces the autoregressive constraint in decoders, and cross-attention links encoder to decoder. The $O(n)$ path-length claim describes RNNs, not self-attention.",
    ref: "§8 — Attention"
  },
  {
    id: "dl-9", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "Compare the <b>maximum path length</b> between two distant tokens in a sequence model, per the CNN/RNN/Transformer table.",
    quantityA: "Max path length in a Transformer (self-attention)",
    quantityB: "Max path length in an RNN",
    answer: 1,
    explanation: "The table gives the Transformer an $O(1)$ max path length and the RNN an $O(n)$ max path length. Since $O(1)<O(n)$ for long sequences, quantity B (the RNN's) is the larger — which is precisely why transformers handle long-range dependencies better.",
    ref: "§8 — CNN vs RNN vs Transformer"
  },
  {
    id: "dl-10", type: "mc", framing: "applied", difficulty: 5,
    prompt: "In <b>LoRA</b>, you freeze $\\mathbf{W}$ and learn a low-rank update so the layer computes $\\mathbf{X}(\\mathbf{W}+\\mathbf{B}\\mathbf{A})^\\top$ with rank $R\\ll\\min(C,D)$. Which statement is <b>FALSE</b>?",
    options: [
      "Because $R$ is small, LoRA must keep its adapters separate from $\\mathbf{W}$ and therefore adds latency at inference",
      "The rank $R$ is chosen far smaller than $\\min(C,D)$, training only a few percent of parameters",
      "It is usually applied to the attention projections $\\mathbf{W}_Q,\\mathbf{W}_V$",
      "QLoRA combines a 4-bit quantized base model with LoRA adapters"
    ],
    answer: 0,
    explanation: "LoRA <i>merges</i> the low-rank update $\\mathbf{B}\\mathbf{A}$ into $\\mathbf{W}$ at inference, giving zero added latency — the claim that it must stay separate and add latency is false. The other statements are correct: $R\\ll\\min(C,D)$ trains a few percent of params, it is typically applied to $\\mathbf{W}_Q,\\mathbf{W}_V$, and QLoRA = 4-bit base + LoRA adapters.",
    ref: "§8 — Parameter-efficient fine-tuning (LoRA)"
  }
];
