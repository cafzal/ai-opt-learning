/* Batch: Modern LLM Architecture & Efficiency  (Modern-LLMs study guide — the efficiency layer) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["genai-arch"] = [
  {
    id: "ga-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "A transformer language model is a stack of $N$ identical blocks. Reading from input to output, what is the correct top-level structure?",
    options: [
      "Token + position embeddings → $N$ identical blocks → final norm + linear head over the vocabulary",
      "Linear head → $N$ identical blocks → token embeddings → softmax",
      "Token embeddings → a single very wide block → final softmax, no residuals",
      "Positional encoding → convolutional stem → $N$ blocks → mean pooling"
    ],
    answer: 0,
    explanation: "The stack is: embed token IDs and add positions, run $N$ identical (but separately-weighted) blocks, then a final normalization and a linear head that produces logits over the vocabulary. The blocks share a recipe, not weights; the head is at the <i>end</i>, not the start; and residual connections are essential, not optional.",
    ref: "the transformer stack"
  },
  {
    id: "ga-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Why does <b>Byte-Pair Encoding (BPE)</b> tokenization essentially eliminate the out-of-vocabulary (OOV) problem that word-level vocabularies suffer from?",
    options: [
      "It assigns every possible word a unique ID up front, so nothing is ever unseen",
      "It builds subword units by merging frequent byte/character pairs, so any string decomposes into known pieces",
      "It uses a neural network to hallucinate IDs for unknown words",
      "It lowercases and stems every word so that variants collapse to one token"
    ],
    answer: 1,
    explanation: "BPE starts from bytes/characters and greedily merges the most frequent adjacent pairs into a vocabulary of reusable subword units (commonly on the order of tens of thousands of tokens). Because the base units are bytes, <i>any</i> string can be expressed as a sequence of known pieces — a rare or novel word just splits into more, smaller tokens. There is no fixed word list to fall off of, and BPE does not lowercase or stem.",
    ref: "tokenization & BPE"
  },
  {
    id: "ga-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "In a standard transformer feed-forward network (FFN), the inner (hidden) layer follows the <b>expand-then-contract</b> recipe with an expansion factor of 4. For a model dimension of $d_{model}=768$, what is the inner dimension $d_{ff}$?",
    answer: 3072, tolerance: 0, unit: "",
    hint: "Multiply the model dimension by the expansion factor.",
    explanation: "The FFN projects up to $d_{ff}=4\\,d_{model}=4\\times 768=3072$, applies a nonlinearity, then projects back down to $768$. This 'expand-then-contract' shape is where the per-token 'thinking' happens; attention mixes across tokens, the FFN processes each token independently.",
    ref: "FFN expand-then-contract"
  },
  {
    id: "ga-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "Self-attention forms an $n\\times n$ score matrix, so its cost scales as $O(n^2)$ in sequence length $n$. If you increase the context length from 1024 tokens to 4096 tokens, by what factor does the number of entries in that score matrix grow?",
    answer: 16, tolerance: 0, unit: "x",
    hint: "The growth factor is the square of the length ratio.",
    explanation: "Quadratic scaling means the factor is $(4096/1024)^2=4^2=16$. Quadrupling the context multiplies the attention score matrix (and the compute/memory to form it) by sixteen — this is exactly the quadratic wall that motivates IO-aware and sparse attention.",
    ref: "why attention is $O(n^2)$"
  },
  {
    id: "ga-5", type: "mc", framing: "applied", difficulty: 3,
    prompt: "During autoregressive decoding you cache the keys and values of past tokens in a <b>KV cache</b>. What does this cache buy you, and what new cost does it introduce?",
    options: [
      "It removes the redundant recomputation of past keys/values, but its memory grows with context length (× layers × batch)",
      "It breaks the serial token-by-token dependency, letting all tokens be generated in parallel",
      "It shrinks the model's parameter count, at the cost of lower quality",
      "It makes attention sub-quadratic in $n$, at the cost of a one-time precompute"
    ],
    answer: 0,
    explanation: "Without the cache, generating token $N$ would recompute the keys and values for all prior tokens every step. Caching them avoids that redundant work, but the cache itself must hold $K$ and $V$ for every past position in every layer (times the batch), so its memory grows with context and decoding becomes memory-bandwidth-bound. Crucially it does <i>not</i> remove the serial chain (token $N$ still waits for $N-1$) and does not change attention's asymptotic complexity or the parameter count.",
    ref: "the KV cache"
  },
  {
    id: "ga-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "<b>FlashAttention</b> computes <i>exact</i> attention but much faster than a naive implementation. Select every statement that correctly describes how and why.",
    options: [
      "It tiles the computation and never materializes the full $n\\times n$ attention matrix in slow memory",
      "It is an approximation that drops small attention weights to save time",
      "It is IO-aware, reducing reads/writes to high-bandwidth memory — it is bandwidth-bound, not compute-bound",
      "It recomputes attention intermediates in the backward pass instead of storing the whole matrix",
      "It lowers the asymptotic cost of attention from $O(n^2)$ to $O(n\\log n)$"
    ],
    answer: [0, 2, 3],
    explanation: "FlashAttention keeps the result exact: it tiles Q/K/V into blocks that fit in fast on-chip memory, computes a running softmax so the full $n\\times n$ matrix is never written to HBM, and recomputes intermediates during backprop to save memory. The win is fewer slow-memory reads/writes (IO-aware, bandwidth-bound). It is <i>not</i> an approximation, and it does <i>not</i> change the $O(n^2)$ asymptotic complexity — it changes the constant and the memory traffic.",
    ref: "FlashAttention"
  },
  {
    id: "ga-7", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "Which statement about modern transformer design choices is <b>FALSE</b>?",
    options: [
      "RMSNorm normalizes by the root-mean-square of activations and skips the mean-subtraction (re-centering) step that LayerNorm performs",
      "Placing the normalization <i>before</i> each sub-layer (pre-norm) helps gradients flow and makes very deep stacks easier to train",
      "Rotary position embeddings (RoPE) inject position by rotating query/key vectors, encoding relative position",
      "ALiBi encodes position by adding learned absolute position vectors to the token embeddings at the input"
    ],
    answer: 3,
    explanation: "ALiBi does the opposite of what the false option says: it adds a fixed, distance-proportional <i>bias to the attention scores</i> (penalizing far-apart tokens) and uses no input position embeddings at all — which is what helps it extrapolate to longer contexts. The other three are correct: RMSNorm drops mean-subtraction, pre-norm stabilizes deep training, and RoPE rotates Q/K to encode relative position.",
    ref: "normalization & positional schemes"
  },
  {
    id: "ga-8", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "Two attention variants are configured with the <b>same</b> number of query heads, the same model dimension, and the same context length. Compare the size of the KV cache each must store during decoding.",
    quantityA: "KV cache size of standard multi-head attention (MHA), one key/value head per query head",
    quantityB: "KV cache size of grouped-query attention (GQA), where several query heads share each key/value head",
    answer: 0,
    explanation: "The KV cache stores one key and one value per <i>key/value</i> head, not per query head. MHA has a distinct KV head for every query head, while GQA lets groups of query heads share a smaller set of KV heads (multi-query attention is the extreme: a single shared KV head). With query-head count, dimension, and context fixed, MHA always stores strictly more KV than GQA — that smaller cache is exactly the bandwidth win GQA/MQA buy, at some cost to quality.",
    ref: "MHA vs MQA vs GQA"
  },
  {
    id: "ga-9", type: "ms", framing: "applied", difficulty: 5,
    prompt: "A sparse <b>Mixture-of-Experts (MoE)</b> layer has $N$ expert FFNs but routes each token to only the top-$k$ of them. Select every statement that is true of this design.",
    options: [
      "It decouples total parameter count from the per-token compute (FLOPs)",
      "Only the $k$ routed experts run for a given token, so active parameters $\\ll$ total parameters",
      "A learned router (gating network) decides which experts each token is sent to",
      "Every expert processes every token, so it is just a wider dense FFN",
      "Because only $k$ of $N$ experts fire, the full model also fits in less memory at inference than a dense model with the same active FLOPs"
    ],
    answer: [0, 1, 2],
    explanation: "MoE's whole point is sparsity: a gating network routes each token to its top-$k$ experts, so per-token FLOPs depend on $k$, not on $N$ — total parameters and per-token compute are decoupled, and active params $\\ll$ total params. It is therefore <i>not</i> a dense FFN where every expert sees every token. The last option is false: all $N$ experts' weights must still reside in memory (any token might route to any of them), so an MoE has a far larger memory footprint than a dense model matched on active FLOPs — you trade memory for cheap compute.",
    ref: "Mixture-of-Experts"
  },
  {
    id: "ga-10", type: "mc", framing: "applied", difficulty: 5,
    prompt: "The <b>Chinchilla</b> compute-optimal scaling result says that, for a fixed training-compute budget, parameters and training tokens should be scaled together at roughly 20 tokens per parameter. A team trained a model far past that ratio — say 200 tokens per parameter — at a fixed compute budget. Per the Chinchilla framing, what does this most directly imply?",
    options: [
      "The budget was spent compute-optimally, since more data always means a better model for the same compute",
      "The model was under-parameterized for its data: at that fixed compute, a larger model trained on fewer tokens would have been compute-optimal",
      "The model violates scaling laws and cannot converge",
      "Inference will be slower, because token-to-parameter ratio sets decoding speed"
    ],
    answer: 1,
    explanation: "Chinchilla balances two scarce resources against a fixed compute budget: pushing the ratio far above ~20 tokens/param means too few parameters were paired with too much data — a larger model on fewer tokens would have used the <i>same</i> compute more optimally. (Training a small model on extra tokens can still be a deliberate choice to cut <i>inference</i> cost, but that is no longer compute-optimal <i>training</i>.) 'More data is always better' ignores the fixed budget, scaling laws don't forbid convergence, and the token/parameter ratio is a training-allocation rule, not a decoding-speed knob.",
    ref: "scaling laws / Chinchilla"
  }
];
