/* Review: Generative AI — the LLM lifecycle, alignment & serving */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["genai-align"] = {
  intro: "How a raw next-token predictor becomes a helpful, aligned assistant — and how it's served fast. The throughline: <b>every training stage is still next-token prediction</b>; what changes is the <i>data curriculum</i> — from web-scale text, to curated demonstrations, to human preferences. Alignment is where it gets interesting: RLHF fits a reward model and optimizes with RL under a KL leash, while DPO shows the reward model can be made to <i>cancel</i>, collapsing the whole pipeline into one supervised loss. Then decoding and serving turn the trained $\\pi_\\theta$ into tokens on a screen. Skim the toggles, then test yourself below.",
  concepts: [
    {
      title: "The five-stage LLM lifecycle",
      tag: "core",
      body: "<p>A chat model is built in stages, and the deep point is that <b>every stage is the same objective — predict the next token</b>. What changes between them is the <i>data curriculum</i>, not the loss:</p><ul><li><b>Tokenize</b> — fit a sub-word vocabulary (e.g. byte-pair encoding) so text becomes a sequence of integer IDs.</li><li><b>Pretrain</b> — next-token prediction on web-scale text → learns grammar, facts, reasoning patterns (\"how language works\").</li><li><b>Supervised fine-tuning (SFT)</b> — next-token prediction on curated chat transcripts → learns the <i>format</i> of a helpful assistant turn.</li><li><b>RLHF / DPO</b> — optimize against human preference pairs → learns <i>taste</i> and safety (which answer people prefer).</li><li><b>Serve</b> — autoregressive decoding: sample a token, append, repeat.</li></ul><p>The \"magic\" is the curriculum, not the loss — which is exactly why DPO mattered: it kept the loss simple while fixing the alignment stage.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" style="fill:var(--text)" font-size="13" font-weight="700">One objective, five curricula: next-token all the way</text>
        <defs>
          <marker id="ga-arr" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" style="fill:var(--text-dim)"/>
          </marker>
        </defs>
        <g font-size="11" text-anchor="middle">
          <rect x="8"   y="46" width="92" height="40" rx="6" style="fill:var(--bg-elev2)" class="vx-axis" stroke-width="1.4"/>
          <text x="54" y="71" style="fill:var(--text)">Tokenize</text>
          <rect x="112" y="46" width="92" height="40" rx="6" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.6"/>
          <text x="158" y="71" style="fill:var(--text)">Pretrain</text>
          <rect x="216" y="46" width="92" height="40" rx="6" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.6"/>
          <text x="262" y="71" style="fill:var(--text)">SFT</text>
          <rect x="320" y="46" width="92" height="40" rx="6" style="fill:var(--bg-elev2)" class="vx-warn" stroke-width="1.6"/>
          <text x="366" y="71" style="fill:var(--text)">RLHF / DPO</text>
          <rect x="424" y="46" width="88" height="40" rx="6" style="fill:var(--bg-elev2)" class="vx-good" stroke-width="1.6"/>
          <text x="468" y="71" style="fill:var(--text)">Serve</text>
        </g>
        <g class="vx-axis" stroke-width="1.4">
          <line x1="100" y1="66" x2="110" y2="66" marker-end="url(#ga-arr)"/>
          <line x1="204" y1="66" x2="214" y2="66" marker-end="url(#ga-arr)"/>
          <line x1="308" y1="66" x2="318" y2="66" marker-end="url(#ga-arr)"/>
          <line x1="412" y1="66" x2="422" y2="66" marker-end="url(#ga-arr)"/>
        </g>
        <g font-size="9.5" text-anchor="middle" style="fill:var(--text-dim)">
          <text x="54"  y="108">vocab of IDs</text>
          <text x="158" y="108">raw web text</text>
          <text x="262" y="108">demonstrations</text>
          <text x="366" y="108">preferences</text>
          <text x="468" y="108">decode loop</text>
        </g>
        <text x="10" y="150" style="fill:var(--text-dim)" font-size="11">Loss = cross-entropy on the next token at every training stage (boxes 2–4).</text>
        <text x="10" y="170" style="fill:var(--text-faint)" font-size="10.5">Curriculum sharpens left→right: web-scale → curated → human-ranked.</text>
      </svg>`,
      caption: "The data gets more curated left to right; the next-token objective never changes.",
      example: "Ask a freshly-pretrained model \"What's the capital of France?\" and it might continue with more <i>questions</i> (that's what web text near a question looks like). After SFT on demonstrations it answers \"Paris.\" After preference tuning it answers helpfully and declines unsafe requests — same weights-shaped object, three curricula.",
      takeaway: "Knowing which stage owns a behavior tells you where to fix it: bad facts mean pretraining, wrong format means SFT, bad judgment means preference tuning."
    },
    {
      title: "Pretraining: self-supervised next-token prediction",
      tag: "core",
      body: "<p>Pretraining is <b>self-supervised</b>: the label is just the next token in the text, so any corpus is its own supervision — no human annotation needed. The model factorizes the sequence probability autoregressively, $p_\\theta(x_{1:T})=\\prod_t p_\\theta(x_t\\mid x_{<t})$, and minimizes the average <b>cross-entropy</b> (negative log-likelihood) of the true next token:</p><p style=\"text-align:center\">$\\mathcal{L}(\\theta)=-\\frac1T\\sum_{t=1}^{T}\\log p_\\theta(x_t\\mid x_{<t}).$</p><p>This is exactly maximum likelihood. The exponentiated loss is <b>perplexity</b>, $\\mathrm{PPL}=e^{\\mathcal{L}}$ — the \"effective branching factor,\" or how many tokens the model is effectively choosing between. Lower is better. Capability emerges smoothly with scale (the compute-optimal frontier balances model size against tokens), which is why pretraining is the expensive, commoditized base everything else builds on.</p>",
      example: "On the prefix \"The cat sat on the\", the target is \"mat\". If the model puts probability $0.25$ on \"mat\", that token contributes $-\\log 0.25\\approx 1.39$ nats to the loss. Average this over trillions of tokens and gradient-descend: the model is forced to internalize grammar, facts, and world structure just to predict well.",
      takeaway: "Perplexity is your cheapest progress metric during pretraining, and the compute-optimal frontier is what decides how to split a fixed budget between model size and tokens."
    },
    {
      title: "Supervised fine-tuning (SFT): demonstrations → instruction following",
      tag: "core",
      body: "<p>A pretrained model knows language but not the <i>job</i> of being an assistant — it will happily continue your prompt rather than answer it. <b>SFT</b> fixes the format. You collect a curated set of high-quality <b>(instruction, ideal response)</b> demonstrations and run the <i>same</i> next-token loss, but only on the response tokens (the prompt is context, not a target).</p><p>This is sometimes called <b>behavioral cloning</b>: the model imitates expert demonstrations. It's cheap and stable relative to what follows, and it teaches structure, tone, and instruction-following. Its ceiling is the demonstrators — SFT can only imitate, never <i>discover</i> that one answer is better than another. That gap is what the preference-tuning stage closes.</p>",
      caption: undefined,
      example: "A demonstration pair: prompt \"Summarize this email in one line: …\" paired with a crisp one-line summary written by a skilled human. Train on a few tens of thousands of such pairs and the model generalizes the <i>behavior</i> \"when asked to summarize, produce a concise summary\" — even on emails it never saw.",
      takeaway: "SFT is the cheap, stable first move to make a base model usable, but demonstration quality caps the ceiling — your model only gets as good as your best annotators."
    },
    {
      title: "RLHF: preferences → reward model → policy under a KL leash",
      tag: "core",
      body: "<p>To go beyond imitation you optimize for <i>what humans prefer</i>. Classic <b>RLHF</b> has three moving parts:</p><ol><li><b>Collect preferences.</b> Show annotators two responses $(y_w, y_l)$ to a prompt $x$; they pick the winner $y_w\\succ y_l$.</li><li><b>Fit a reward model.</b> Under the <b>Bradley-Terry</b> model, the probability a human prefers $y_w$ is $\\sigma\\!\\big(r_\\phi(x,y_w)-r_\\phi(x,y_l)\\big)$, so you train $r_\\phi$ by logistic regression on the pairs — it learns a scalar \"how good is this response.\"</li><li><b>Optimize the policy with RL (PPO).</b> Maximize expected reward <i>minus</i> a KL penalty to a frozen reference (the SFT model): $\\;\\max_\\theta\\,\\mathbb{E}\\big[r_\\phi(x,y)\\big]-\\beta\\,D_{\\text{KL}}\\!\\big(\\pi_\\theta\\,\\|\\,\\pi_{\\text{ref}}\\big).$</li></ol><p>The <b>KL term is the safety leash</b>: without it the policy drifts into degenerate text that scores high on the imperfect reward model — <b>reward hacking</b>. This is exactly <b>Goodhart's Law</b> (\"when a measure becomes a target, it ceases to be a good measure\"): the reward model is only a <i>proxy</i> for true human preference, so hard optimization against it eventually corrupts the real objective even as the proxy score climbs. The same phenomenon wears three names — <b>reward hacking = overfitting-to-the-metric = Goodhart</b> — and it is the alignment-stage instance of the Stage 0 \"<b>proxy gap</b>\": you can only ever optimize a measurable stand-in, never the true goal itself. The coefficient $\\beta$ trades reward against staying close to the trusted reference, bounding how far the policy can chase the proxy. The cost: three models in play (policy, reward, reference) plus on-policy sampling in the loop — powerful but finicky and unstable.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="18" text-anchor="middle" style="fill:var(--text)" font-size="12.5" font-weight="700">RLHF</text>
        <text x="390" y="18" text-anchor="middle" style="fill:var(--text)" font-size="12.5" font-weight="700">DPO</text>
        <line x1="262" y1="28" x2="262" y2="240" class="vx-grid" stroke-width="1" stroke-dasharray="4 4"/>
        <defs>
          <marker id="ga2-arr" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" style="fill:var(--text-dim)"/>
          </marker>
        </defs>
        <g font-size="10.5" text-anchor="middle">
          <rect x="40" y="40" width="190" height="34" rx="6" style="fill:var(--bg-elev2)" class="vx-axis" stroke-width="1.3"/>
          <text x="135" y="61" style="fill:var(--text)">preference pairs (yw ≻ yl)</text>
          <rect x="40" y="104" width="190" height="34" rx="6" style="fill:var(--bg-elev2)" class="vx-warn" stroke-width="1.5"/>
          <text x="135" y="125" style="fill:var(--text)">reward model rϕ (Bradley-Terry)</text>
          <rect x="40" y="168" width="190" height="34" rx="6" style="fill:var(--bg-elev2)" class="vx-warn" stroke-width="1.5"/>
          <text x="135" y="185" style="fill:var(--text)">PPO loop + KL leash</text>
          <text x="135" y="197" style="fill:var(--text-dim)" font-size="9">policy + reward + reference</text>
        </g>
        <g class="vx-axis" stroke-width="1.4">
          <line x1="135" y1="74" x2="135" y2="102" marker-end="url(#ga2-arr)"/>
          <line x1="135" y1="138" x2="135" y2="166" marker-end="url(#ga2-arr)"/>
        </g>
        <text x="135" y="226" text-anchor="middle" style="fill:var(--text-dim)" font-size="10">3 models, sampling in the loop</text>
        <g font-size="10.5" text-anchor="middle">
          <rect x="295" y="40" width="190" height="34" rx="6" style="fill:var(--bg-elev2)" class="vx-axis" stroke-width="1.3"/>
          <text x="390" y="61" style="fill:var(--text)">preference pairs (yw ≻ yl)</text>
          <rect x="295" y="104" width="190" height="34" rx="6" style="fill:var(--bg-elev2)" stroke-width="1.4" class="vx-bad" opacity="0.55"/>
          <text x="390" y="125" style="fill:var(--text-faint)">reward model</text>
          <line x1="300" y1="138" x2="480" y2="104" class="vx-bad" stroke-width="2"/>
          <line x1="480" y1="138" x2="300" y2="104" class="vx-bad" stroke-width="2"/>
          <rect x="295" y="168" width="190" height="34" rx="6" style="fill:var(--bg-elev2)" class="vx-good" stroke-width="1.6"/>
          <text x="390" y="185" style="fill:var(--text)">policy πθ — one loss</text>
          <text x="390" y="197" style="fill:var(--text-dim)" font-size="9">its own implicit reward</text>
        </g>
        <g class="vx-good" stroke-width="1.6">
          <line x1="390" y1="74" x2="390" y2="166" marker-end="url(#ga2-arr)"/>
        </g>
        <text x="390" y="226" text-anchor="middle" style="fill:var(--text-dim)" font-size="10">reward model cancels → direct</text>
      </svg>`,
      caption: "RLHF routes preferences through a reward model and a PPO loop; DPO crosses the reward model out and trains the policy directly.",
      example: "Without the KL penalty, a policy chasing a reward model that slightly over-rewards the word \"certainly\" learns to spam \"Certainly! Certainly!\" — high modeled reward, useless text. The $\\beta\\,D_{\\text{KL}}$ leash to $\\pi_{\\text{ref}}$ keeps it close to the sensible SFT model and prevents that drift.",
      takeaway: "RLHF can push past imitation toward genuine preference, but the three-model PPO loop is the costly, unstable part — tune $\\beta$ carefully or you get reward hacking or no movement."
    },
    {
      title: "DPO: the reward model cancels out",
      tag: "key insight",
      body: "<p><b>Direct Preference Optimization</b> asks: do we even need the reward model and the RL loop? The KL-constrained objective in the previous toggle has a known <b>closed-form optimum</b>, $\\pi^\\star(y\\mid x)\\propto\\pi_{\\text{ref}}(y\\mid x)\\,\\exp\\!\\big(\\tfrac1\\beta r(x,y)\\big)$. Invert it to express the reward in terms of the policy:</p><p style=\"text-align:center\">$r(x,y)=\\beta\\log\\dfrac{\\pi_\\theta(y\\mid x)}{\\pi_{\\text{ref}}(y\\mid x)}+\\beta\\log Z(x).$</p><p>Now substitute into Bradley-Terry, which depends only on the <b>difference</b> $r(x,y_w)-r(x,y_l)$ — so the intractable normalizer $\\log Z(x)$ <b>cancels</b>. What's left is a one-line classification-style loss on preference pairs:</p><p style=\"text-align:center\">$\\mathcal{L}_{\\text{DPO}}=-\\mathbb{E}\\Big[\\log\\sigma\\Big(\\beta\\log\\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)}-\\beta\\log\\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\Big)\\Big].$</p><p>The policy is <b>its own implicit reward model</b>. No separate reward network, no RL, no in-loop sampling — fewer moving parts and more stable, while still respecting the same $\\beta$-weighted KL leash to $\\pi_{\\text{ref}}$ baked into the formula. (One subtlety: the gradient carries a built-in weight that upweights pairs the model currently ranks <i>wrong</i> — drop it and training degenerates.)</p>",
      caption: undefined,
      example: "Given a pair where $y_w$ is the preferred answer, DPO simply pushes up $\\log\\pi_\\theta(y_w\\mid x)$ and pushes down $\\log\\pi_\\theta(y_l\\mid x)$, each measured <i>relative to</i> the frozen reference — a contrastive nudge. It's a supervised loss you can run like SFT, yet it provably optimizes the same preference objective RLHF targets with a full PPO pipeline.",
      takeaway: "DPO gets you most of RLHF's alignment with far less machinery and far more stability — the default first move for preference tuning now."
    },
    {
      title: "Decoding strategies: the quality–diversity knob",
      tag: "serving",
      body: "<p>At serve time the model outputs <b>logits</b> → a softmax distribution over the vocabulary each step. How you pick the next token is decoding:</p><ul><li><b>Greedy</b> — take the argmax every step. Deterministic, can be repetitive and get stuck in loops.</li><li><b>Beam search</b> — keep the $k$ highest-probability <i>sequences</i>. Better for closed-ended tasks (translation); tends to bland, generic text for open-ended generation.</li><li><b>Temperature</b> $T$ — rescale logits by $1/T$ before softmax. $T\\!\\to\\!0$ is peaky (→ greedy); $T\\!>\\!1$ flattens the distribution → more diverse, more surprising, more error-prone.</li><li><b>Top-$k$</b> — sample only from the $k$ most-likely tokens (truncate the tail).</li><li><b>Top-$p$ (nucleus)</b> — sample from the smallest set of tokens whose cumulative probability $\\ge p$. The cutoff <i>adapts</i> to how confident the model is: narrow when peaky, wide when uncertain.</li></ul><p>The core dial is <b>sampling vs argmax</b>: argmax-style decoding maximizes per-token likelihood (safe, repetitive); sampling buys diversity at the cost of coherence. Truncation (top-$k$/top-$p$) keeps sampling's variety while clipping the long, low-probability tail that produces nonsense.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="12.5" font-weight="700">Same logits, two temperatures</text>
        <text x="130" y="38" text-anchor="middle" style="fill:var(--text-dim)" font-size="11">low T — peaky (≈ greedy)</text>
        <text x="390" y="38" text-anchor="middle" style="fill:var(--text-dim)" font-size="11">high T — flat (diverse)</text>
        <line x1="40" y1="180" x2="250" y2="180" class="vx-axis" stroke-width="1.4"/>
        <line x1="40" y1="60"  x2="40"  y2="180" class="vx-axis" stroke-width="1.4"/>
        <g style="fill:var(--accent)">
          <rect x="56"  y="78"  width="26" height="102"/>
          <rect x="98"  y="150" width="26" height="30"/>
          <rect x="140" y="164" width="26" height="16"/>
          <rect x="182" y="172" width="26" height="8"/>
        </g>
        <g font-size="9.5" text-anchor="middle" style="fill:var(--text-faint)">
          <text x="69"  y="193">t1</text><text x="111" y="193">t2</text><text x="153" y="193">t3</text><text x="195" y="193">t4</text>
        </g>
        <line x1="300" y1="180" x2="510" y2="180" class="vx-axis" stroke-width="1.4"/>
        <line x1="300" y1="60"  x2="300" y2="180" class="vx-axis" stroke-width="1.4"/>
        <g style="fill:var(--warn)">
          <rect x="316" y="120" width="26" height="60"/>
          <rect x="358" y="134" width="26" height="46"/>
          <rect x="400" y="140" width="26" height="40"/>
          <rect x="442" y="150" width="26" height="30"/>
        </g>
        <g font-size="9.5" text-anchor="middle" style="fill:var(--text-faint)">
          <text x="329" y="193">t1</text><text x="371" y="193">t2</text><text x="413" y="193">t3</text><text x="455" y="193">t4</text>
        </g>
        <text x="275" y="218" text-anchor="middle" style="fill:var(--text-dim)" font-size="10.5">Top-p keeps the smallest set summing to ≥ p; the cutoff widens as the bars flatten.</text>
      </svg>`,
      caption: "Temperature reshapes the probabilities: low T concentrates mass on the top token; high T spreads it, so sampling explores more.",
      example: "Code generation usually wants low temperature or greedy (one right syntax). Creative brainstorming wants $T\\approx 0.9$ with top-$p=0.95$ — diverse phrasings while the nucleus still clips absurd tail tokens. Crank $T$ far above 1 with no truncation and the output dissolves into gibberish.",
      takeaway: "Temperature and top-$p$ are the knobs you actually turn at inference to trade determinism for creativity — no retraining, just match them to the task."
    },
    {
      title: "Inference efficiency: KV cache, quantization, speculative decoding",
      tag: "serving",
      body: "<p>Autoregression is <b>serial</b> — token $N$ waits for token $N\\!-\\!1$ — so serving is about squeezing that chain. Three levers:</p><ul><li><b>KV cache.</b> Each new token re-attends over all prior tokens; recomputing their keys/values every step is wasteful, so you <i>cache</i> them. This removes redundant compute but <b>not the serial chain</b>, and it adds a new cost: cache size grows with context × layers × batch, making long-context, high-concurrency serving a <b>memory-bandwidth</b> problem.</li><li><b>Quantization.</b> Store/compute weights at lower precision — FP16 → INT8 → INT4. Smaller, faster, less memory-bandwidth, with a modest accuracy hit; the dominant win is fitting more model (and KV cache) in memory.</li><li><b>Speculative decoding.</b> A small, cheap <b>draft</b> model proposes $k$ tokens; the big <b>target</b> model verifies them in a <i>single</i> parallel forward pass, accepting the longest correct prefix. Same output distribution as the target alone, but several tokens land per expensive pass.</li></ul><p>Two regimes to keep separate: <b>prefill</b> (process the whole prompt in parallel — compute-bound) vs <b>decode</b> (generate token-by-token — memory-bandwidth-bound). And the perennial tradeoff: <b>batching</b> many requests raises <i>throughput</i> (tokens/sec across users) but can raise per-request <i>latency</i>.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="12.5" font-weight="700">Speculative decoding: draft proposes, target verifies in one pass</text>
        <text x="10" y="52" style="fill:var(--text-dim)" font-size="11">draft model proposes k = 4</text>
        <g font-size="11" text-anchor="middle">
          <rect x="40"  y="62" width="46" height="30" rx="5" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.4"/><text x="63"  y="82" style="fill:var(--text)">the</text>
          <rect x="98"  y="62" width="46" height="30" rx="5" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.4"/><text x="121" y="82" style="fill:var(--text)">cat</text>
          <rect x="156" y="62" width="46" height="30" rx="5" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.4"/><text x="179" y="82" style="fill:var(--text)">sat</text>
          <rect x="214" y="62" width="46" height="30" rx="5" style="fill:var(--bg-elev2)" class="vx-accent" stroke-width="1.4"/><text x="237" y="82" style="fill:var(--text)">on</text>
        </g>
        <text x="10" y="132" style="fill:var(--text-dim)" font-size="11">target verifies all 4 at once →</text>
        <g font-size="13" text-anchor="middle">
          <text x="63"  y="120" class="vx-good" style="fill:var(--good)">✓</text>
          <text x="121" y="120" class="vx-good" style="fill:var(--good)">✓</text>
          <text x="179" y="120" class="vx-good" style="fill:var(--good)">✓</text>
          <text x="237" y="120" class="vx-bad"  style="fill:var(--bad)">✗</text>
        </g>
        <rect x="38" y="142" width="166" height="34" rx="6" style="fill:var(--bg-elev2)" class="vx-good" stroke-width="1.6"/>
        <text x="121" y="164" text-anchor="middle" style="fill:var(--text)" font-size="11">accept prefix "the cat sat"</text>
        <rect x="214" y="142" width="92" height="34" rx="6" style="fill:var(--bg-elev2)" class="vx-bad" stroke-width="1.5"/>
        <text x="260" y="164" text-anchor="middle" style="fill:var(--text)" font-size="11">resample 1</text>
        <text x="10" y="200" style="fill:var(--text-faint)" font-size="10.5">3 tokens accepted from ONE expensive target pass instead of 3 sequential passes.</text>
        <text x="10" y="214" style="fill:var(--text-faint)" font-size="10.5">Output distribution is identical to running the target alone.</text>
      </svg>`,
      caption: "The draft model gambles k tokens; the target checks them in a single pass and keeps the correct prefix — net win when the draft is usually right.",
      example: "With a draft that the target agrees with ~70% of the time and $k=4$, you might accept 3 tokens per expensive target pass — roughly a 3× decode speedup with <i>no</i> change to the output distribution, since any wrong guess is simply rejected and resampled from the target.",
      takeaway: "These three levers decide your serving cost and latency: KV cache and quantization free up the memory bandwidth that bottlenecks decode, while speculative decoding cuts latency for free."
    }
  ]
};
