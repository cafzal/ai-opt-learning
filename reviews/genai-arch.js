/* Review: Generative-AI Architecture & Efficiency (modern-LLM study guide) */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["genai-arch"] = {
  intro: "How a modern language model is actually built and served: text becomes subword tokens, tokens become vectors, and a stack of identical transformer blocks turns them into next-token probabilities. Each block does two jobs — <i>attention</i> mixes information across tokens, the <i>feed-forward network</i> thinks per token. That design is powerful but quadratic in context length, so the second half of the story is efficiency: the KV cache, IO-aware attention, head-sharing, leaner norms, sparse experts, and the scaling laws that say how big to make all of it. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "Tokenization & Byte-Pair Encoding",
      tag: "core",
      body: "<p>A model never sees characters or words — it sees integer <b>token IDs</b> drawn from a fixed <b>vocabulary</b> (commonly on the order of $10^4$–$10^5$ entries). The mapping from raw text to those IDs is the <b>tokenizer</b>, and the dominant recipe is <b>Byte-Pair Encoding (BPE)</b>.</p><p>BPE learns <b>subword</b> units. It starts from raw bytes and repeatedly merges the most frequent adjacent pair into a new symbol, growing common chunks (whole words, frequent stems, suffixes) while rare strings stay split into smaller pieces:</p><ul><li><b>Frequent words</b> become a single token — cheap to represent.</li><li><b>Rare or novel words</b> decompose into known subwords, so there is <b>no out-of-vocabulary (OOV) problem</b> — falling back to bytes, any string is representable.</li><li>Vocabulary size is a <i>tradeoff</i>: bigger vocab = fewer tokens per sentence (shorter sequences) but a larger embedding table and softmax.</li></ul>",
      example: "The string <i>\"tokenization\"</i> might split into <code>token</code> + <code>ization</code> — two reusable pieces — while a typo like <i>\"tokenizaton\"</i> still encodes fine as <code>token</code> + <code>iza</code> + <code>ton</code>. A model with a 50,000-token vocabulary maps every possible input to IDs in $\\{0,\\dots,49999\\}$, and never hits an unknown word.",
      takeaway: "Token count, not word count, is what you pay for and what fills the context window — so prompt budgeting and per-token pricing hinge on how the tokenizer splits your text."
    },
    {
      title: "The transformer stack & the block recipe",
      tag: "core",
      body: "<p>A transformer language model is three things in sequence:</p><ul><li><b>Embeddings + position</b> — turn each token ID into a vector and add positional information so order is encoded.</li><li><b>N identical blocks</b> — same architecture, different learned weights, stacked deep.</li><li><b>Final norm + linear head</b> — a last normalization then a linear projection to vocabulary-sized <b>logits</b> → softmax → next-token probabilities.</li></ul><p>Every block runs the <b>same internal recipe</b> with two sub-layers, each wrapped in a normalization and a residual add:</p><p style=\"text-align:center\"><b>x → LN → Attention → ⊕ residual → LN → FFN → ⊕ residual</b></p><ul><li><b>Attention</b> <i>mixes tokens together</i> — every position can read from every other position.</li><li><b>Feed-forward network (FFN)</b> <i>thinks per token</i> — two linear layers that <b>expand then contract</b> (typically $4\\times$ the model width in the middle), applied independently to each position with no token mixing.</li><li><b>Norm + residuals</b> are the plumbing: the residual \"highway\" lets gradients flow straight through, which is what makes very deep stacks trainable.</li></ul>",
      visual: `<svg viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">One transformer block</text>
        <!-- main spine x positions -->
        <line x1="150" y1="34" x2="150" y2="250" class="vx-grid" stroke-width="1.5"/>
        <!-- input -->
        <text x="150" y="46" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">x (input)</text>
        <!-- LN1 -->
        <rect x="100" y="56" width="100" height="26" rx="5" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="150" y="73" text-anchor="middle" font-size="11" style="fill:var(--text)">LayerNorm</text>
        <!-- Attention -->
        <rect x="92" y="92" width="116" height="30" rx="5" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="150" y="108" text-anchor="middle" font-size="11" style="fill:var(--accent)" font-weight="700">Attention</text>
        <text x="150" y="119" text-anchor="middle" font-size="8.5" style="fill:var(--text-faint)">mix across tokens</text>
        <!-- residual add 1 -->
        <circle cx="150" cy="140" r="11" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="150" y="144" text-anchor="middle" font-size="13" style="fill:var(--good)">⊕</text>
        <!-- LN2 -->
        <rect x="100" y="162" width="100" height="26" rx="5" class="vx-axis" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="150" y="179" text-anchor="middle" font-size="11" style="fill:var(--text)">LayerNorm</text>
        <!-- FFN -->
        <rect x="92" y="198" width="116" height="30" rx="5" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="150" y="214" text-anchor="middle" font-size="11" style="fill:var(--accent)" font-weight="700">FFN (4× wide)</text>
        <text x="150" y="225" text-anchor="middle" font-size="8.5" style="fill:var(--text-faint)">think per token</text>
        <!-- residual add 2 -->
        <circle cx="150" cy="246" r="11" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="150" y="250" text-anchor="middle" font-size="13" style="fill:var(--good)">⊕</text>
        <text x="150" y="274" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">→ next block</text>
        <!-- residual skip arrows on the right -->
        <path d="M150,50 C235,50 235,140 161,140" fill="none" class="vx-good" stroke-width="2" stroke-dasharray="5 4"/>
        <path d="M150,150 C235,156 235,246 161,246" fill="none" class="vx-good" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="245" y="98" font-size="10" style="fill:var(--good)">residual</text>
        <text x="245" y="204" font-size="10" style="fill:var(--good)">residual</text>
        <!-- right-side legend / scale -->
        <g font-size="10.5" style="fill:var(--text-dim)">
          <text x="330" y="60" font-weight="700" style="fill:var(--text)">Reference scale</text>
          <text x="330" y="80">N blocks ≈ 12 (small)</text>
          <text x="330" y="98">→ tens (frontier)</text>
          <text x="330" y="122">width ≈ 768 (small)</text>
          <text x="330" y="140">heads ≈ width / 64</text>
          <text x="330" y="164">FFN hidden = 4 × width</text>
          <text x="330" y="188" style="fill:var(--text-faint)">depth is the main knob;</text>
          <text x="330" y="204" style="fill:var(--text-faint)">the rest scales with it</text>
        </g>
      </svg>`,
      caption: "Two sub-layers — attention then FFN — each preceded by a norm and closed by a residual add (dashed). The same block repeats N times.",
      example: "A canonical small configuration: 12 blocks, 12 attention heads, width 768, context length 1024 — about 124 million parameters. The frontier uses the <i>same recipe</i> at much larger depth and width; with width $\\approx 768$ and head dimension $64$, you get $768/64 = 12$ heads.",
      takeaway: "Because every model is the same block stacked, knowing one block lets you reason about any model's size, cost, and memory just from depth and width — no new architecture to learn per release."
    },
    {
      title: "Why attention is quadratic: O(n²)",
      tag: "core",
      body: "<p>Inside each block, attention lets every token weigh every other token. Each token emits three vectors:</p><ul><li><b>Query (Q)</b> — what I am looking for.</li><li><b>Key (K)</b> — what I offer.</li><li><b>Value (V)</b> — what I contribute.</li></ul><p>For sequence length $n$ and head dimension $d$, the computation is three steps:</p><p style=\"text-align:center\">$S = QK^{\\top} \\;\\to\\; P = \\mathrm{softmax}(S) \\;\\to\\; O = PV$</p><p>The load-bearing fact: the score matrix $S$ and the attention weights $P$ are $n\\times n$ — one entry for every <i>pair</i> of tokens. So both compute and memory for attention scale as $O(n^2)$ in context length. <b>Double the context, quadruple the attention cost.</b> The rest of the network (embeddings, the per-token FFN) grows only <i>linearly</i> in $n$, so at long context attention dominates — this quadratic wall is the central efficiency problem of long-context transformers, and the target of FlashAttention.</p>",
      example: "Going from a 1,000-token prompt to a 4,000-token prompt is a $4\\times$ longer sequence but about $4^2 = 16\\times$ more attention work, because the score matrix grows from $1000^2$ to $4000^2$ entries.",
      takeaway: "This quadratic wall is why long context is expensive and why doubling your prompt can quadruple latency and cost — it's the constraint every long-context trick exists to dodge."
    },
    {
      title: "The KV cache",
      tag: "efficiency",
      body: "<p>Generation is <b>autoregressive</b>: predict a token, append it, feed the whole sequence back in, repeat. Naively, producing token $t$ re-runs attention over all prior tokens, recomputing their Keys and Values every single step — pure waste, since those are identical each time.</p><p>The fix is the <b>KV cache</b>: during decoding, store the $K$ and $V$ vectors for every token as you go. At step $t$ you compute Q, K, V for <i>only the new token</i>, append its K and V to the cache, and attend against the cached $K,V$ for tokens $1..t-1$.</p><p>Two important nuances:</p><ul><li>The cache removes redundant <i>compute</i> but <b>not the serial chain</b> — token $t$ still cannot start until token $t-1$ exists.</li><li>It introduces a new bottleneck: <b>cache memory grows</b> with $\\text{context} \\times \\text{layers} \\times \\text{batch}$. Long-context, high-concurrency serving becomes <i>memory-bandwidth</i> bound — the soft underbelly of autoregressive inference.</li></ul>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">Decoding step t: reuse cached K,V</text>
        <!-- token row -->
        <g font-size="10.5">
          <text x="10" y="62" style="fill:var(--text-dim)">tokens</text>
        </g>
        <!-- cached tokens 1..t-1 -->
        <g>
          <rect x="70"  y="48" width="50" height="26" rx="4" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
          <rect x="126" y="48" width="50" height="26" rx="4" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
          <rect x="182" y="48" width="50" height="26" rx="4" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
          <rect x="238" y="48" width="50" height="26" rx="4" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
          <text x="95"  y="65" text-anchor="middle" font-size="11" style="fill:var(--good)">K,V₁</text>
          <text x="151" y="65" text-anchor="middle" font-size="11" style="fill:var(--good)">K,V₂</text>
          <text x="207" y="65" text-anchor="middle" font-size="11" style="fill:var(--good)">K,V₃</text>
          <text x="263" y="65" text-anchor="middle" font-size="11" style="fill:var(--good)">K,Vₜ₋₁</text>
        </g>
        <!-- new token t -->
        <rect x="300" y="48" width="56" height="26" rx="4" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="328" y="65" text-anchor="middle" font-size="11" style="fill:var(--accent)" font-weight="700">token t</text>
        <text x="180" y="98" text-anchor="middle" font-size="10.5" style="fill:var(--good)">cached — reused, not recomputed</text>
        <text x="328" y="98" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">only this is computed now</text>
        <!-- arrows: new token attends back over cache -->
        <path d="M315,80 C260,118 150,118 95,80" fill="none" class="vx-accent" stroke-width="1.5"/>
        <path d="M318,80 C300,112 215,112 207,80" fill="none" class="vx-accent" stroke-width="1.5"/>
        <path d="M322,80 C312,108 270,108 263,80" fill="none" class="vx-accent" stroke-width="1.5"/>
        <text x="200" y="138" text-anchor="middle" font-size="10" style="fill:var(--text-dim)">Q of token t attends over cached K,V for 1..t−1</text>
        <!-- contrast box -->
        <line x1="55" y1="158" x2="495" y2="158" class="vx-grid" stroke-width="1"/>
        <g font-size="10.5">
          <text x="70" y="178" style="fill:var(--bad)" font-weight="700">Without cache:</text>
          <text x="172" y="178" style="fill:var(--text-dim)">recompute K,V for all 1..t every step → wasted O(t) work</text>
          <text x="70" y="200" style="fill:var(--good)" font-weight="700">With cache:</text>
          <text x="172" y="200" style="fill:var(--text-dim)">compute 1 new token; but cache memory ∝ context × layers × batch</text>
        </g>
        <text x="70" y="222" font-size="10" style="fill:var(--text-faint)">Caveat: the serial chain remains — token t still waits for token t−1.</text>
      </svg>`,
      caption: "At each decoding step only the new token's K,V are computed; all earlier K,V are read from the cache. Memory, not compute, becomes the limit.",
      example: "Generating the 1,001st token of a response: instead of recomputing Keys and Values for the previous 1,000 tokens, the model computes them for just the new token and attends against 1,000 cached $K,V$ pairs. The win in compute is offset by a cache that keeps growing one slot per token, per layer.",
      takeaway: "The KV cache is why token 1,000 isn't 1,000$\\times$ slower than token 1 — and why long context plus many concurrent users is what actually exhausts your serving GPU's memory."
    },
    {
      title: "FlashAttention: IO-aware exact attention",
      tag: "efficiency",
      body: "<p>Standard attention is slow not because of arithmetic but because of <b>memory traffic</b>. It materializes the full $n\\times n$ score matrix in slow high-bandwidth memory, writes it, reads it back for the softmax, writes again, reads again for the $PV$ multiply. On modern accelerators that shuttling — not the FLOPs — dominates wall-clock time.</p><p><b>FlashAttention</b> is an <b>IO-aware</b> reformulation that computes the <i>exact</i> same result while <b>never materializing the $n\\times n$ matrix</b>. The tricks:</p><ul><li><b>Tiling</b> — load small blocks of Q, K, V into fast on-chip memory and compute attention block by block.</li><li><b>Online softmax</b> — accumulate the softmax-weighted output incrementally across blocks using running max/sum statistics, so the full row of scores never has to exist at once.</li><li><b>Recomputation</b> — in the backward pass, recompute attention blocks on the fly rather than storing the big matrix, trading cheap FLOPs for scarce memory.</li></ul><p>Net effect: same numbers, far less memory traffic and a much smaller memory footprint — and it helps <i>any</i> transformer, autoregressive or otherwise, since it just optimizes the shared attention primitive.</p>",
      example: "For an $n = 8{,}000$ sequence, the naive score matrix has $8000^2 = 64$ million entries per head to write to and read from slow memory. FlashAttention streams Q/K/V in tiles through fast on-chip memory and produces the identical output without ever storing those 64 million numbers — the speedup comes from <i>moving less data</i>, not from any approximation.",
      takeaway: "It's a free speedup with identical outputs, so just use a FlashAttention kernel — it's the difference between fitting a long-context model on your GPU or hitting out-of-memory."
    },
    {
      title: "Head-sharing (MHA / MQA / GQA) & positional schemes",
      tag: "efficiency",
      body: "<p>The KV cache is dominated by how many <b>Key/Value heads</b> you keep. Attention-head sharing trades a little quality for a much smaller cache:</p><ul><li><b>Multi-Head Attention (MHA)</b> — every query head has its own K and V head. Maximum expressiveness, largest cache.</li><li><b>Multi-Query Attention (MQA)</b> — all query heads share a <i>single</i> K/V head. Smallest cache (and fastest decoding), but a noticeable quality hit.</li><li><b>Grouped-Query Attention (GQA)</b> — the middle ground: query heads are split into a few <b>groups</b>, each group sharing one K/V head. A handful of K/V heads recovers most of MHA's quality at a fraction of the cache.</li></ul><p>Separately, <b>position</b> must be injected since attention itself is order-blind. Two evergreen schemes:</p><ul><li><b>RoPE (rotary)</b> — rotates Q and K by an angle that depends on position, so attention scores naturally depend on <i>relative</i> distance; extends reasonably beyond the training length.</li><li><b>ALiBi</b> — adds a distance-proportional penalty (bias) to attention scores, gently down-weighting far-apart tokens; simple and length-extrapolates well.</li></ul>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">Query heads sharing Key/Value heads</text>
        <!-- three columns -->
        <!-- MHA -->
        <text x="90" y="44" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--text)">MHA</text>
        <g>
          <rect x="40" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="68" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="96" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="124" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <!-- one KV per Q -->
          <rect x="40" y="100" width="20" height="16" rx="3" style="fill:var(--good)"/>
          <rect x="68" y="100" width="20" height="16" rx="3" style="fill:var(--good)"/>
          <rect x="96" y="100" width="20" height="16" rx="3" style="fill:var(--good)"/>
          <rect x="124" y="100" width="20" height="16" rx="3" style="fill:var(--good)"/>
          <line x1="50" y1="70" x2="50" y2="100" class="vx-grid"/><line x1="78" y1="70" x2="78" y2="100" class="vx-grid"/><line x1="106" y1="70" x2="106" y2="100" class="vx-grid"/><line x1="134" y1="70" x2="134" y2="100" class="vx-grid"/>
          <text x="92" y="132" text-anchor="middle" font-size="9.5" style="fill:var(--text-dim)">4 Q : 4 KV</text>
          <text x="92" y="146" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">big cache</text>
        </g>
        <!-- GQA -->
        <text x="260" y="44" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--text)">GQA</text>
        <g>
          <rect x="210" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="238" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="266" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="294" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <!-- two KV, each shared by a pair -->
          <rect x="224" y="100" width="20" height="16" rx="3" style="fill:var(--good)"/>
          <rect x="280" y="100" width="20" height="16" rx="3" style="fill:var(--good)"/>
          <line x1="220" y1="70" x2="234" y2="100" class="vx-grid"/><line x1="248" y1="70" x2="234" y2="100" class="vx-grid"/>
          <line x1="276" y1="70" x2="290" y2="100" class="vx-grid"/><line x1="304" y1="70" x2="290" y2="100" class="vx-grid"/>
          <text x="262" y="132" text-anchor="middle" font-size="9.5" style="fill:var(--text-dim)">4 Q : 2 KV</text>
          <text x="262" y="146" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">balanced</text>
        </g>
        <!-- MQA -->
        <text x="430" y="44" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--text)">MQA</text>
        <g>
          <rect x="380" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="408" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="436" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <rect x="464" y="54" width="20" height="16" rx="3" style="fill:var(--accent)"/>
          <!-- one shared KV -->
          <rect x="422" y="100" width="20" height="16" rx="3" style="fill:var(--good)"/>
          <line x1="390" y1="70" x2="432" y2="100" class="vx-grid"/><line x1="418" y1="70" x2="432" y2="100" class="vx-grid"/>
          <line x1="446" y1="70" x2="432" y2="100" class="vx-grid"/><line x1="474" y1="70" x2="432" y2="100" class="vx-grid"/>
          <text x="432" y="132" text-anchor="middle" font-size="9.5" style="fill:var(--text-dim)">4 Q : 1 KV</text>
          <text x="432" y="146" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">tiny cache</text>
        </g>
        <!-- legend -->
        <g font-size="10.5">
          <rect x="120" y="180" width="13" height="13" rx="2" style="fill:var(--accent)"/><text x="139" y="191">query head</text>
          <rect x="240" y="180" width="13" height="13" rx="2" style="fill:var(--good)"/><text x="259" y="191">key/value head</text>
        </g>
        <text x="260" y="216" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">Fewer KV heads → smaller KV cache, lower quality. GQA tunes the dial.</text>
      </svg>`,
      caption: "Same four query heads; the number of shared K/V heads shrinks left to right, trading cache size against quality.",
      example: "With 32 query heads, MHA keeps 32 K/V heads, MQA keeps 1, and GQA might keep 8 — one per group of 4 query heads. GQA cuts the KV cache by $32/8 = 4\\times$ versus MHA while staying far closer to its quality than MQA does.",
      takeaway: "GQA is the cheap trick that shrinks the KV cache so you can serve longer contexts or more users per GPU, which is why nearly every recent open model ships with it."
    },
    {
      title: "Normalization & activations: RMSNorm, pre-norm, SwiGLU",
      tag: "core",
      body: "<p>The norms and activations inside a block look like details but strongly affect trainability and speed.</p><p><b>LayerNorm vs RMSNorm.</b> LayerNorm re-centers (subtract the mean) and re-scales (divide by standard deviation) each activation vector. <b>RMSNorm</b> drops the mean-subtraction and just divides by the root-mean-square: $\\bar{x} = \\dfrac{x}{\\sqrt{\\frac{1}{d}\\sum_i x_i^2}}\\,\\gamma$. It is cheaper and, in practice, works about as well — so modern stacks favor it.</p><p><b>Pre-norm vs post-norm.</b> Putting the norm <i>before</i> each sub-layer (<b>pre-norm</b>, as in the block recipe $x \\to \\text{LN} \\to \\dots$) keeps a clean residual path from input to output, which makes deep stacks far more stable to train than the original post-norm placement.</p><p><b>Gated FFNs (SwiGLU).</b> Instead of a plain expand-activate-contract FFN, a <b>gated</b> variant computes two projections and multiplies one by an activation of the other: $\\text{SwiGLU}(x) = \\big(\\text{Swish}(xW_1)\\big) \\odot (xW_2)$, then projects back down. The multiplicative <i>gate</i> gives the network a cheap, expressive nonlinearity and tends to improve quality at equal parameter budget.</p>",
      example: "Swapping LayerNorm for RMSNorm removes the mean-centering step from every norm in the network — with tens of norms across the stack, that is a real throughput win for no measurable quality loss. Pairing pre-norm placement with a SwiGLU FFN is a common modern default: $\\sqrt{\\frac{1}{d}\\sum_i x_i^2}$ is all RMSNorm needs to compute per vector.",
      takeaway: "Pre-norm is what lets you train a very deep stack without the loss diverging; RMSNorm and SwiGLU are the free defaults that buy throughput and quality at no real cost."
    },
    {
      title: "Mixture-of-Experts & scaling laws",
      tag: "efficiency",
      body: "<p><b>Mixture-of-Experts (MoE)</b> breaks the link between <i>total</i> parameters and <i>compute per token</i>. Replace one big FFN with $N$ parallel expert FFNs plus a small <b>router</b>. For each token the router picks the <b>top-$k$</b> experts (often $k=1$ or $2$); only those run, the rest stay idle.</p><ul><li><b>Total params $\\gg$ active params/FLOPs.</b> The model holds the capacity of all $N$ experts but each token only pays for $k$ of them — more knowledge at roughly fixed per-token cost.</li><li>Training adds wrinkles: a <b>load-balancing</b> term keeps the router from collapsing onto a few favorite experts, and routing makes serving and memory layout more complex.</li></ul><p><b>Scaling laws (Chinchilla).</b> Given a fixed compute budget, how big should the model be and how much data should it see? The compute-optimal answer is to <b>scale parameters and training tokens together</b> — many earlier large models were <i>undertrained</i>, too big for the data they saw. The practical upshot: a somewhat smaller model trained on more tokens can beat a larger model trained on fewer, at the same compute.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">MoE: route each token to top-2 of N experts</text>
        <!-- token -->
        <rect x="30" y="92" width="58" height="28" rx="5" class="vx-accent" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="59" y="110" text-anchor="middle" font-size="11" style="fill:var(--accent)" font-weight="700">token</text>
        <!-- router -->
        <rect x="118" y="88" width="66" height="36" rx="6" class="vx-warn" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="151" y="104" text-anchor="middle" font-size="11" style="fill:var(--warn)" font-weight="700">router</text>
        <text x="151" y="117" text-anchor="middle" font-size="8.5" style="fill:var(--text-faint)">pick top-2</text>
        <line x1="88" y1="106" x2="118" y2="106" class="vx-accent" stroke-width="2"/>
        <!-- experts -->
        <!-- active expert 1 -->
        <rect x="250" y="34" width="120" height="26" rx="5" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="310" y="51" text-anchor="middle" font-size="10.5" style="fill:var(--good)" font-weight="700">expert 1 ✓ active</text>
        <!-- inactive -->
        <rect x="250" y="68" width="120" height="26" rx="5" class="vx-grid" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="310" y="85" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">expert 2 · idle</text>
        <!-- active expert 3 -->
        <rect x="250" y="102" width="120" height="26" rx="5" class="vx-good" style="fill:var(--bg-elev2)" stroke-width="2"/>
        <text x="310" y="119" text-anchor="middle" font-size="10.5" style="fill:var(--good)" font-weight="700">expert 3 ✓ active</text>
        <!-- inactive -->
        <rect x="250" y="136" width="120" height="26" rx="5" class="vx-grid" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="310" y="153" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">expert 4 · idle</text>
        <rect x="250" y="170" width="120" height="22" rx="5" class="vx-grid" style="fill:var(--bg-elev2)" stroke-width="1.5"/>
        <text x="310" y="186" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">… expert N · idle</text>
        <!-- routing lines -->
        <path d="M184,100 C215,70 225,50 250,47" fill="none" class="vx-good" stroke-width="2"/>
        <path d="M184,110 C215,114 225,115 250,115" fill="none" class="vx-good" stroke-width="2"/>
        <path d="M184,112 C210,118 220,150 250,150" fill="none" class="vx-grid" stroke-width="1" stroke-dasharray="3 3"/>
        <!-- summary -->
        <g font-size="10.5">
          <text x="400" y="60" style="fill:var(--text-dim)">total params:</text>
          <text x="400" y="76" style="fill:var(--text)" font-weight="700">all N experts</text>
          <text x="400" y="104" style="fill:var(--text-dim)">active per token:</text>
          <text x="400" y="120" style="fill:var(--good)" font-weight="700">only 2 experts</text>
          <text x="400" y="150" style="fill:var(--text-faint)">capacity ≫</text>
          <text x="400" y="165" style="fill:var(--text-faint)">FLOPs / token</text>
        </g>
      </svg>`,
      caption: "Each token is routed to a small top-k subset of experts; the rest stay idle, so capacity grows without growing per-token compute.",
      example: "An MoE layer with $N = 8$ experts and top-$k = 2$ holds roughly $8\\times$ the FFN parameters of a dense layer but each token only runs $2$ experts — about $2/8 = 1/4$ of the would-be FLOPs. On the data side, Chinchilla's lesson is concrete: if you double a model's parameters, you should also roughly double its training tokens to stay compute-optimal.",
      takeaway: "MoE buys you a smarter model at fixed inference cost but demands far more memory to hold every expert; Chinchilla tells you to spend a fixed training budget on data, not just size."
    }
  ]
};
