/* Review: Deep Learning & Generative AI */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["deep-learning"] = {
  intro: "From a single neuron to transformers, generative models, and the systems that make them run. The throughline: stacking <i>nonlinear</i> layers builds compositional feature hierarchies, depth and scale follow smooth power laws, and a handful of tricks — residuals, normalization, attention — keep gradients flowing and let path length collapse to $O(1)$. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "The MLP & why nonlinearity matters",
      tag: "core",
      body: "<p>A <b>neuron</b> computes $a=\\sigma(\\boldsymbol{w}^\\top\\boldsymbol{x}+b)$. An <b>MLP</b> stacks layers $\\boldsymbol{h}^{(\\ell)}=\\sigma\\!\\big(\\mathbf{W}^{(\\ell)}\\boldsymbol{h}^{(\\ell-1)}+\\boldsymbol{b}^{(\\ell)}\\big)$ with a linear read-out. The activation $\\sigma$ is load-bearing: <b>without it the whole stack collapses to one linear map</b> (a product of matrices is a single matrix).</p><p><b>Universal approximation:</b> one wide hidden layer can approximate any continuous function — but <b>depth is far more parameter-efficient</b> than width.</p><p><b>Compositionality is the deeper reason for depth.</b> Each layer composes the features below it into more abstract ones, building a <b>hierarchy</b>: edges → textures → object parts → objects, or characters → words → phrases → meaning. Real-world data is itself hierarchically structured, so a model whose architecture mirrors that structure needs exponentially fewer parameters than a shallow one and <b>generalizes far better</b> — the same simple parts get reused across many higher-level concepts.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">MLP: input → hidden (σ) → output</text>
        <g class="vx-grid" stroke-width="1" opacity="0.55">
          <line x1="95" y1="65" x2="240" y2="55"/><line x1="95" y1="65" x2="240" y2="110"/><line x1="95" y1="65" x2="240" y2="165"/>
          <line x1="95" y1="120" x2="240" y2="55"/><line x1="95" y1="120" x2="240" y2="110"/><line x1="95" y1="120" x2="240" y2="165"/>
          <line x1="95" y1="175" x2="240" y2="55"/><line x1="95" y1="175" x2="240" y2="110"/><line x1="95" y1="175" x2="240" y2="165"/>
        </g>
        <g class="vx-accent" stroke-width="1.2" opacity="0.7">
          <line x1="240" y1="55" x2="400" y2="90"/><line x1="240" y1="110" x2="400" y2="90"/><line x1="240" y1="165" x2="400" y2="90"/>
          <line x1="240" y1="55" x2="400" y2="135"/><line x1="240" y1="110" x2="400" y2="135"/><line x1="240" y1="165" x2="400" y2="135"/>
        </g>
        <g>
          <circle cx="95" cy="65" r="14" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
          <circle cx="95" cy="120" r="14" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
          <circle cx="95" cy="175" r="14" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
          <circle cx="240" cy="55" r="14" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.8"/>
          <circle cx="240" cy="110" r="14" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.8"/>
          <circle cx="240" cy="165" r="14" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.8"/>
          <circle cx="400" cy="90" r="14" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.8"/>
          <circle cx="400" cy="135" r="14" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.8"/>
        </g>
        <g font-size="11" text-anchor="middle" style="fill:var(--text-dim)">
          <text x="95" y="200">input x</text>
          <text x="240" y="200">hidden σ(Wx+b)</text>
          <text x="400" y="200">output ŷ</text>
        </g>
      </svg>`,
      caption: "Each edge is a weight; remove σ at the hidden nodes and the two matrix multiplies fuse into one.",
      example: "Two stacked linear layers $\\mathbf{W}_2(\\mathbf{W}_1\\boldsymbol{x})=(\\mathbf{W}_2\\mathbf{W}_1)\\boldsymbol{x}$ — exactly a single linear layer. Insert a ReLU between them and the network can suddenly carve nonlinear decision regions (e.g. learn XOR).",
      takeaway: "If your deep model underperforms a linear baseline, check the activation — a missing or misplaced $\\sigma$ silently collapses the whole stack to one linear map."
    },
    {
      title: "Training: SGD & backpropagation",
      tag: "core",
      body: "<p><b>SGD with minibatches</b> updates $\\boldsymbol\\theta_{t+1}=\\boldsymbol\\theta_t-\\eta\\,\\tfrac1B\\sum_{n\\in\\mathcal{B}}\\nabla\\ell_n$. The <b>minibatch noise is implicit regularization</b> — the gradient estimate jitters around the true gradient, discouraging sharp overfit minima.</p><p><b>Backpropagation = reverse-mode autodiff</b>: a <b>forward pass</b> caches activations, a <b>backward pass</b> propagates error signals $\\boldsymbol\\delta^{(\\ell)}=\\partial\\mathcal{L}/\\partial\\boldsymbol{h}^{(\\ell)}$ via the chain rule. For a linear layer $\\partial\\mathcal{L}/\\partial\\mathbf{W}=\\boldsymbol\\delta\\boldsymbol{x}^\\top$. RNNs use <b>backprop through time</b> (truncated for tractability).</p><p>Seen another way, <b>backprop is credit assignment</b>: reverse-mode autodiff = the chain rule = apportioning blame for the loss to each weight, telling it which way to move. <b>Backprop-through-time</b> is <b>temporal</b> credit assignment — distributing credit for an outcome across earlier steps — the very same problem reinforcement learning faces when a reward arrives long after the actions that earned it.</p>",
      example: "Train on the full dataset each step (batch GD) and the path to the minimum is smooth but you can settle into a brittle minimum; use minibatches of, say, 32 and the noisy steps act like a regularizer that biases toward flatter, better-generalizing minima.",
      takeaway: "Batch size is a regularization knob, not just a speed knob — shrinking it can improve generalization, while huge batches often need a tuned learning-rate warmup to match it."
    },
    {
      title: "Saddle points in high dimensions",
      tag: "core",
      body: "<p>The naive 2-D picture — training stalls in a <b>bad local minimum</b> — is misleading. In a high-dimensional non-convex loss, a critical point ($\\nabla_\\theta\\mathcal{L}=0$) is a minimum only if <b>every</b> Hessian eigenvalue is positive. With thousands of curvature directions that is exponentially unlikely; almost every critical point has a mix of signs and is a <b>saddle point</b>.</p><p>So the real obstacles are <b>saddles and the flat plateaus</b> around them, where the gradient nearly vanishes and progress crawls — not a wall of suboptimal minima. Most local minima sit close to the global value. <b>SGD noise</b> jitters the iterate off the saddle's unstable ridge, and <b>momentum</b> carries it across plateaus, so the two together are what keep training moving.</p>",
      example: "Picture a mountain pass: a saddle curves up across the ridge but down along the trail. In 2-D you'd just roll off, but at the saddle itself $\\nabla_\\theta\\mathcal{L}=0$, so plain gradient descent inches forward while the loss barely moves — exactly the long flat stretch you see before a deep net's loss finally drops.",
      takeaway: "When training plateaus, suspect a saddle, not a bad minimum — adding gradient noise or momentum (or nudging the learning rate) usually breaks the stall, whereas hunting for a 'better' minimum is chasing the wrong problem."
    },
    {
      title: "Vanishing / exploding gradients & fixes",
      tag: "core",
      body: "<p>Gradients in a deep net are <b>products of many Jacobians</b>. If their magnitudes are consistently $<1$ the signal <b>vanishes</b> toward early layers; if $>1$ it <b>explodes</b>. The standard mitigations:</p><ul><li><b>ReLU</b> — flat-region derivative of exactly 1, so it doesn't shrink the signal like saturating sigmoid/tanh.</li><li><b>Residual connections</b> — an identity term keeps gradients flowing (next toggle).</li><li><b>Normalization</b> — keeps activations well-scaled layer to layer.</li><li><b>Careful init</b> (Xavier/Glorot for tanh, He/Kaiming for ReLU) and <b>gradient clipping</b>.</li><li><b>Gating</b> (LSTM/GRU) — additive cell updates preserve long-range gradients; the forget gate is a learned gradient highway.</li></ul>",
      example: "A 50-layer plain network barely trains — gradients vanish before reaching layer 1. Swapping in ResNet's residual blocks (plus BatchNorm and ReLU) lets the same depth train cleanly, which is exactly how 50–152+ layer ResNets became feasible.",
      takeaway: "When a deep net's loss stalls early or NaNs out, this checklist (ReLU, residuals, normalization, He init, clipping) is your first diagnostic pass before touching architecture."
    },
    {
      title: "Normalization & residual connections",
      tag: "core",
      body: "<p>Two ways to keep deep nets trainable:</p><p><b>Normalization.</b> <b>BatchNorm</b> normalizes each feature <i>over the batch</i>, $\\hat x=\\tfrac{x-\\mu_\\mathcal{B}}{\\sqrt{\\sigma_\\mathcal{B}^2+\\epsilon}}$ — great for CNNs but <b>batch-size-dependent</b>. <b>LayerNorm</b> normalizes <i>per example, over features</i> — batch-independent, so it's the <b>transformer default</b> (pre-norm is more stable for deep models).</p><p><b>Residuals.</b> $\\boldsymbol{y}=F(\\boldsymbol{x})+\\boldsymbol{x}$ gives $\\partial\\mathcal{L}/\\partial\\boldsymbol{x}=\\partial\\mathcal{L}/\\partial\\boldsymbol{y}\\,(\\partial F/\\partial\\boldsymbol{x}+\\mathbf{I})$ — the <b>identity term $\\mathbf{I}$ keeps gradients flowing</b> straight through, a <b>gradient highway</b> that enables very deep nets.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Residual block: y = F(x) + x</text>
        <defs>
          <marker id="dl-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" style="fill:var(--text-dim)"/>
          </marker>
          <marker id="dl-arrow-good" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" style="fill:var(--good)"/>
          </marker>
        </defs>
        <text x="55" y="115" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--text)">x</text>
        <line x1="70" y1="110" x2="150" y2="110" class="vx-axis" stroke-width="1.6" marker-end="url(#dl-arrow)"/>
        <rect x="155" y="88" width="120" height="44" rx="6" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.8"/>
        <text x="215" y="115" text-anchor="middle" font-size="13" style="fill:var(--accent)">F(x)</text>
        <line x1="275" y1="110" x2="360" y2="110" class="vx-axis" stroke-width="1.6" marker-end="url(#dl-arrow)"/>
        <circle cx="378" cy="110" r="16" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.6"/>
        <text x="378" y="116" text-anchor="middle" font-size="16" style="fill:var(--text)">+</text>
        <line x1="394" y1="110" x2="470" y2="110" class="vx-axis" stroke-width="1.6" marker-end="url(#dl-arrow)"/>
        <text x="490" y="115" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--text)">y</text>
        <path d="M55,95 C55,45 378,45 378,92" fill="none" class="vx-good" stroke-width="2.4" stroke-dasharray="5 4" marker-end="url(#dl-arrow-good)"/>
        <text x="215" y="42" text-anchor="middle" font-size="12" style="fill:var(--good)">skip / identity (the gradient highway)</text>
        <text x="265" y="185" text-anchor="middle" font-size="11.5" style="fill:var(--text-dim)">∂L/∂x = ∂L/∂y · (∂F/∂x + I)  — the I term never vanishes</text>
      </svg>`,
      caption: "The skip path adds x straight back, so even if ∂F/∂x → 0 the identity keeps a gradient route open.",
      example: "In a ResNet block the conv layers learn a <i>residual</i> $F(\\boldsymbol{x})$ on top of the input; if the optimal map is near-identity, the block can simply push $F\\to 0$ and pass $\\boldsymbol{x}$ through — far easier than learning identity from scratch.",
      takeaway: "Residual connections are what let you train 100+ layers at all, and choosing LayerNorm over BatchNorm is what makes a transformer trainable without batch-size coupling."
    },
    {
      title: "Convolution: local filters & weight sharing",
      tag: "core",
      body: "<p>A conv layer applies <b>local filters with weight sharing</b>: the same small kernel slides across the input, making it <b>translation-equivariant</b> and using <b>far fewer params than a fully-connected layer</b>. Stride downsamples; dilation widens the field cheaply.</p><p>The <b>receptive field</b> — how much input one output unit sees — grows with depth as $1+L(K-1)$ for $L$ stacked kernels of size $K$. Pooling (max for the most-active feature / approximate invariance, or global average as a CNN→classifier bridge) downsamples further.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">1-D conv: a K=3 kernel slides; receptive field grows</text>
        <g font-size="0">
          <rect x="40"  y="40" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
          <rect x="80"  y="40" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
          <rect x="120" y="40" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
          <rect x="160" y="40" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
          <rect x="200" y="40" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
          <rect x="240" y="40" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
          <rect x="280" y="40" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
        </g>
        <text x="330" y="56" font-size="11" style="fill:var(--text-dim)">layer 0 (input)</text>
        <rect x="78" y="36" width="118" height="30" rx="4" fill="none" class="vx-accent" stroke-width="2.2"/>
        <text x="137" y="84" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">kernel (K=3)</text>
        <line x1="137" y1="92" x2="117" y2="118" class="vx-accent" stroke-width="1.4"/>
        <g>
          <rect x="100" y="120" width="34" height="22" rx="3" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.4"/>
          <rect x="140" y="120" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
          <rect x="180" y="120" width="34" height="22" rx="3" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.2"/>
        </g>
        <text x="330" y="136" font-size="11" style="fill:var(--text-dim)">layer 1 — each sees 3 inputs</text>
        <line x1="117" y1="144" x2="160" y2="170" class="vx-grid" stroke-width="1"/>
        <line x1="197" y1="144" x2="160" y2="170" class="vx-grid" stroke-width="1"/>
        <rect x="143" y="172" width="34" height="22" rx="3" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.6"/>
        <text x="330" y="188" font-size="11" style="fill:var(--text-dim)">layer 2 — receptive field = 1 + 2(3−1) = 5</text>
      </svg>`,
      caption: "Stacking two K=3 layers gives an output unit a receptive field of 5 inputs: 1 + L(K−1) with L=2.",
      example: "A 3×3 conv over a 256×256 RGB image uses just $3{\\times}3{\\times}3$ weights per output channel — reused at every position — versus the hundreds of thousands a fully-connected layer would need for the same input.",
      takeaway: "Weight sharing is why CNNs learn from limited data and generalize across position; if your task lacks translation structure, that built-in bias may instead hurt you."
    },
    {
      title: "Attention: scaled dot-product",
      tag: "core",
      body: "<p>Attention is content-based mixing: $\\text{Attn}(\\mathbf{Q},\\mathbf{K},\\mathbf{V})=\\text{softmax}\\!\\big(\\tfrac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt d}\\big)\\mathbf{V}$, where queries/keys/values are learned projections of the input (the $\\sqrt d$ keeps the dot products from saturating the softmax).</p><p><b>Softmax is a smooth, differentiable relaxation of $\\arg\\max$</b> (it is the Boltzmann/Gibbs distribution over scores): rather than hard-selecting the single highest-scoring token, it returns a peaked weighting we can backprop through. A temperature $\\tau$ tunes the sharpness, and as $\\tau\\to 0$ it recovers the hard $\\arg\\max$ — the same knob that turns LLM decoding greedy.</p><p><b>Self-attention</b> draws all three from one sequence, giving an <b>$O(1)$ path length</b> between any two tokens (vs $O(n)$ for RNNs) at $O(n^2 d)$ cost. <b>Multi-head</b> runs $h$ attentions in parallel to capture different relations; <b>masked/causal</b> attention is used for autoregressive decoders. Because attention is <b>permutation-invariant</b>, <b>positional encoding</b> (sinusoidal/learned; modern RoPE/ALiBi) injects order.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">softmax(QKᵀ / √d) · V</text>
        <defs>
          <marker id="dl-att-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" style="fill:var(--text-dim)"/>
          </marker>
        </defs>
        <rect x="20" y="55" width="58" height="34" rx="6" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.6"/>
        <text x="49" y="77" text-anchor="middle" font-size="13" style="fill:var(--accent)">Q</text>
        <rect x="20" y="115" width="58" height="34" rx="6" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.6"/>
        <text x="49" y="137" text-anchor="middle" font-size="13" style="fill:var(--accent)">K</text>
        <line x1="78" y1="72" x2="135" y2="92" class="vx-axis" stroke-width="1.5" marker-end="url(#dl-att-arrow)"/>
        <line x1="78" y1="132" x2="135" y2="112" class="vx-axis" stroke-width="1.5" marker-end="url(#dl-att-arrow)"/>
        <rect x="140" y="84" width="84" height="36" rx="6" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.4"/>
        <text x="182" y="100" text-anchor="middle" font-size="11" style="fill:var(--text)">QKᵀ / √d</text>
        <text x="182" y="114" text-anchor="middle" font-size="9.5" style="fill:var(--text-dim)">scores</text>
        <line x1="224" y1="102" x2="278" y2="102" class="vx-axis" stroke-width="1.5" marker-end="url(#dl-att-arrow)"/>
        <rect x="282" y="84" width="90" height="36" rx="6" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.6"/>
        <text x="327" y="106" text-anchor="middle" font-size="12" style="fill:var(--good)">softmax</text>
        <rect x="282" y="140" width="58" height="34" rx="6" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="1.6"/>
        <text x="311" y="162" text-anchor="middle" font-size="13" style="fill:var(--accent)">V</text>
        <line x1="372" y1="108" x2="420" y2="118" class="vx-axis" stroke-width="1.5" marker-end="url(#dl-att-arrow)"/>
        <line x1="340" y1="157" x2="420" y2="130" class="vx-axis" stroke-width="1.5" marker-end="url(#dl-att-arrow)"/>
        <circle cx="436" cy="124" r="16" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="436" y="130" text-anchor="middle" font-size="15" style="fill:var(--text)">×</text>
        <line x1="452" y1="124" x2="495" y2="124" class="vx-axis" stroke-width="1.5" marker-end="url(#dl-att-arrow)"/>
        <text x="505" y="129" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">out</text>
        <text x="265" y="197" text-anchor="middle" font-size="11" style="fill:var(--text-faint)">attention weights re-mix the value vectors</text>
      </svg>`,
      caption: "Q·Kᵀ scores every pair, √d rescales, softmax turns scores into weights, then those weights average the V vectors.",
      example: "In the sentence \"the animal didn't cross the street because <b>it</b> was tired,\" self-attention lets the token <i>it</i> attend strongly to <i>animal</i> in a single hop — an $O(1)$ path an RNN would have to traverse step by step.",
      takeaway: "Attention's $O(1)$ path length is why it replaced RNNs for long context, but the $O(n^2)$ cost is a real memory budget you must plan around when picking context length."
    },
    {
      title: "Architectures: CNN vs RNN vs Transformer",
      tag: "compare",
      body: "<p>Three backbones with different inductive biases:</p><ul><li><b>ConvNets</b> — alternating conv/activation/pool, then global pool + FC. Bias toward <b>locality</b>; e.g. <b>LeNet</b> (early digits), <b>ResNet</b> (residual blocks, 50–152+ layers).</li><li><b>RNNs</b> — hidden state $\\boldsymbol{h}_t=\\varphi(\\mathbf{W}_{xh}\\boldsymbol{x}_t+\\mathbf{W}_{hh}\\boldsymbol{h}_{t-1})$; bias toward <b>order</b>; $O(n)$ sequential ops and path length make long-range dependencies weak. LSTM/GRU gates help.</li><li><b>Transformer</b> — \"attention is all you need\"; <b>no built-in locality bias</b> (needs positional encoding) but $O(1)$ path length and <b>excellent long-range</b>. Most params live in the position-wise <b>FFN</b> (conjectured knowledge store). <b>GPT</b> = decoder-only causal self-attention, trained autoregressively, few-shot in-context learning at scale; <b>ViT</b> = image as a sequence of patch embeddings + [CLS] through a transformer encoder (data-hungry, but scales better than CNNs).</li></ul><p><b>Embeddings are the cross-modal unifier.</b> Notice the common first step: a ViT turns image patches into vectors, an LLM turns tokens into vectors, a GNN turns graph nodes into vectors, a recommender turns users and items into vectors. <b>Any modality maps into a shared vector space</b> where <b>geometry encodes similarity</b> — nearby vectors mean related things, and directions can carry meaning. This is what lets one transformer block process text, pixels, or graphs interchangeably, and what lets models like CLIP align images and captions by training their embeddings into a <i>single</i> space.</p>",
      example: "For a long document, an RNN must pass information through $n$ sequential steps (gradients weaken); a transformer connects the first and last token in one attention hop — but pays $O(n^2)$ compute, which is why context length is bounded.",
      takeaway: "Match the backbone to the data's inductive bias: CNNs when locality holds and data is scarce, transformers when long-range dependencies and abundant data dominate."
    },
    {
      title: "Generative & practical: LLM decoding, RLHF, diffusion, LoRA",
      tag: "applied",
      body: "<p><b>Autoregressive LLMs</b> sample $x_t\\sim p(x_t\\mid x_{<t})$. <b>Decoding</b>: greedy / beam search, or sampling with <b>temperature</b> (sharpen/flatten the distribution), <b>top-$k$</b> (restrict to the $k$ likeliest), or <b>nucleus / top-$p$</b> (smallest set with cumulative mass $p$). <b>RLHF</b>: train a reward model on human preferences, then fine-tune with <b>PPO</b> (InstructGPT/ChatGPT).</p><p><b>Diffusion models</b>: a fixed <b>forward process</b> adds Gaussian noise over $T$ steps until $x_T\\sim\\mathcal{N}(0,\\mathbf{I})$; a network learns to <b>denoise</b> the reverse process, maximizing a variational bound, sampling coarse→fine from noise.</p><p>Efficiency: <b>LoRA</b> freezes $\\mathbf{W}$ and adds a low-rank update $\\mathbf{B}\\mathbf{A}$ ($R\\ll\\min(C,D)$, init $\\mathbf{B}=0$) — trains a few percent of params, merges at inference for zero latency, usually on $\\mathbf{W}_Q,\\mathbf{W}_V$. <b>Quantization</b> lowers weight precision (FP16→INT4) to cut memory/bandwidth, speeding bandwidth-bound inference with little accuracy loss.</p>",
      example: "With <b>temperature</b> $\\to 0$ decoding becomes greedy (deterministic, repetitive); raising it diversifies output. <b>Nucleus</b> $p=0.9$ samples only from the smallest set of tokens whose probabilities sum to 0.9, cutting off the unlikely tail while staying adaptive. <b>QLoRA</b> combines a 4-bit quantized base model with trainable LoRA adapters to fine-tune large models on modest hardware.",
      takeaway: "These are your day-to-day control knobs: lower temperature for factual tasks, and reach for LoRA/quantization when you need to adapt or serve a big model on a tight hardware budget."
    },
    {
      title: "Scaling laws & emergent abilities",
      tag: "scale",
      body: "<p>Test loss falls as a <b>smooth power law</b> in model size and data: $\\mathcal{L}(N,D)\\approx (N_0/N)^{\\alpha_N}+(D_0/D)^{\\alpha_D}+\\mathcal{L}_\\infty$, where $N$ is parameters, $D$ is training tokens, and $\\mathcal{L}_\\infty$ is the irreducible floor. On a log-log plot this is a <b>straight line</b> — performance is strikingly predictable across orders of magnitude.</p><p><b>Chinchilla.</b> For a fixed compute budget, you should scale parameters and data <i>together</i> — many early large models were <b>under-trained on data</b> (too many params, too few tokens), leaving compute on the table. At sufficient scale, models unlock <b>emergent abilities</b> that smaller ones lack: <b>few-shot in-context learning</b> and <b>chain-of-thought</b> reasoning.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">Scaling law: loss ↓ as a power law (log–log line)</text>
        <line x1="60" y1="40" x2="60" y2="180" class="vx-axis" stroke-width="1.4"/>
        <line x1="60" y1="180" x2="480" y2="180" class="vx-axis" stroke-width="1.4"/>
        <text x="22" y="110" text-anchor="middle" font-size="11" style="fill:var(--text-dim)" transform="rotate(-90 22 110)">log test loss</text>
        <text x="270" y="208" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">log compute (params × data)</text>
        <line x1="60" y1="55" x2="430" y2="150" class="vx-accent" stroke-width="2.6"/>
        <line x1="60" y1="150" x2="480" y2="150" class="vx-grid" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="450" y="145" font-size="10.5" style="fill:var(--text-faint)">ℒ∞ floor</text>
        <circle cx="120" cy="70" r="4" style="fill:var(--accent)"/>
        <circle cx="230" cy="98" r="4" style="fill:var(--accent)"/>
        <circle cx="340" cy="127" r="4" style="fill:var(--accent)"/>
        <text x="150" y="62" font-size="10.5" style="fill:var(--text-dim)">slope = −α</text>
      </svg>`,
      caption: "Plot loss vs compute on log–log axes and it's a line of slope −α, falling toward the irreducible floor ℒ∞.",
      example: "<b>Chinchilla</b> (70B params, trained on ~1.4T tokens) <i>outperformed</i> the 4× larger Gopher (280B) by spending the same compute on far more data — concrete proof that the bigger model was under-trained. Separately, chain-of-thought prompting barely helps small models but sharply boosts accuracy once a model crosses a scale threshold: an emergent ability.",
      takeaway: "Scaling laws let you forecast the payoff of more compute before spending it, and Chinchilla tells you to budget parameters and tokens together rather than just buying a bigger model."
    },
    {
      title: "Double descent",
      tag: "scale",
      body: "<p>The classical <b>bias–variance U-curve</b> says test error falls then rises as capacity grows, so you stop near the bottom. For modern overparameterized nets that is <b>only the first half of the story</b>. As capacity increases, test error climbs to a sharp peak at the <b>interpolation threshold</b> — just enough parameters to fit the training set exactly (zero train error) — and then, counterintuitively, <b>descends again</b> as you keep adding capacity.</p><p>Hence <b>double descent</b>: a U, then a second downward slope. Past the threshold many solutions interpolate the data, and SGD's implicit bias selects a smooth, low-norm one that generalizes well. Today's large models live <b>deep in this second descent</b>, which is why 'just make it bigger' keeps working long after the classical curve predicts overfitting. The same shape appears in epochs (<b>epoch-wise double descent</b>) and data size.</p>",
      example: "Sweep a net's width on a fixed dataset: a narrow model underfits, a model with <i>just</i> enough parameters to memorize the training set spikes to its <b>worst</b> test error (it fits the noise rigidly), and a much wider model — same data — generalizes <b>better</b> than the peak, sometimes better than the classical sweet spot.",
      takeaway: "Don't read rising test error near the interpolation threshold as a hard capacity ceiling — for overparameterized models, growing past it can lower error again, so the classical 'stop at the U's bottom' rule can leave performance on the table."
    },
    {
      title: "Efficient computation: hardware, tensors, precision",
      tag: "systems",
      body: "<p><b>Why DL is feasible.</b> <b>GPUs</b> pack thousands of parallel cores; <b>TPUs</b> use systolic matrix-multiply arrays purpose-built for the dense linear algebra of neural nets. The practical bottleneck is usually <b>memory bandwidth</b> — moving weights and activations to and from the compute units — rather than raw FLOPs.</p><p><b>Tensors.</b> Inputs are batched into multi-dimensional <b>tensors</b> — images as $(N,C,H,W)$, sequences as $(N,T,D)$ — so a whole batch passes through a layer as <b>one big matrix multiply</b>, exactly the operation the hardware accelerates.</p><p><b>Mixed precision.</b> Compute in <b>FP16/BF16</b> while accumulating in <b>FP32</b> for numerical stability: roughly <b>halves memory and doubles throughput</b> with negligible accuracy loss (BF16's wider exponent range avoids FP16 overflow).</p>",
      example: "A batch of 64 RGB images at 224×224 is the tensor $(64,3,224,224)$; flattened per layer, the forward pass is a single large matmul a GPU/TPU chews through in parallel. Switching that training run from FP32 to BF16 mixed precision typically about halves memory use and nearly doubles step throughput — often the cheapest speedup available.",
      takeaway: "Because training and inference are usually bandwidth-bound, mixed precision buys more real speedup than chasing peak FLOPs — switch to BF16 before you reach for a bigger GPU."
    }
  ]
};
