/* Review: Generative AI, Applied — RAG, Agents, Evals & the Decoding Frontier */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["genai-applied"] = {
  intro: "A pretrained language model is a frozen, fluent next-token predictor — it knows what it read and nothing newer, and it will state a confident falsehood as readily as a fact. This batch is about the <i>system</i> wrapped around the model: feed it fresh context (<b>retrieval</b>), let it <b>act</b> in the world (tools / agents), and measure whether any of it actually works (<b>evals</b>). The last two toggles look past the autoregressive loop itself to the diffusion / non-autoregressive frontier. Skim the concepts, then test yourself.",
  concepts: [
    {
      title: "Retrieval-augmented generation (RAG)",
      tag: "core",
      body: "<p>A model's weights are a lossy, <i>frozen</i> snapshot of its training data — stale, generic, and unable to cite. <b>RAG</b> grafts an external memory onto generation at inference time:</p><ol><li><b>Embed</b> the query into a vector.</li><li><b>Retrieve</b> the top-$k$ most similar chunks from a vector index over your corpus (approximate nearest-neighbor search over embeddings).</li><li><b>Augment</b> the prompt — concatenate [retrieved chunks + query] into the context window.</li><li><b>Generate</b> an answer <i>grounded</i> in that supplied evidence.</li></ol><p>This injects fresh and proprietary knowledge <b>without retraining</b>, shrinks hallucination by giving the model something true to copy from, and yields citations for free. <b>RAG vs fine-tuning:</b> fine-tuning bakes in <i>behavior, format, and skill</i> (slow, baked once); RAG supplies <i>knowledge</i> (cheap, swappable, always current). They are complements, not rivals — fine-tune for <i>how</i> to answer, retrieve for <i>what</i> the facts are. Retrieval quality caps the whole system: if the right chunk never makes the top-$k$, no amount of model capability recovers it (garbage-in, fluent-garbage-out).</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">RAG pipeline: ground the answer in retrieved evidence</text>
        <g font-size="10.5">
          <rect x="8" y="44" width="74" height="34" rx="5" style="fill:var(--bg-elev2)"/>
          <text x="45" y="65" text-anchor="middle" style="fill:var(--text)">query</text>
          <rect x="104" y="44" width="74" height="34" rx="5" style="fill:var(--bg-elev2)"/>
          <text x="141" y="60" text-anchor="middle" style="fill:var(--text)">embed</text>
          <text x="141" y="73" text-anchor="middle" style="fill:var(--text-faint)">→ vector</text>
          <rect x="200" y="38" width="92" height="46" rx="5" style="fill:var(--accent-soft)"/>
          <text x="246" y="56" text-anchor="middle" style="fill:var(--accent)">vector store</text>
          <text x="246" y="71" text-anchor="middle" style="fill:var(--text-faint)">top-k chunks</text>
        </g>
        <line x1="82" y1="61" x2="102" y2="61" class="vx-axis" stroke-width="1.5" marker-end="url(#ar1)"/>
        <line x1="178" y1="61" x2="198" y2="61" class="vx-axis" stroke-width="1.5" marker-end="url(#ar1)"/>
        <g font-size="10.5">
          <rect x="150" y="118" width="142" height="40" rx="5" style="fill:var(--bg-elev2)"/>
          <text x="221" y="135" text-anchor="middle" style="fill:var(--text)">[chunks + query]</text>
          <text x="221" y="149" text-anchor="middle" style="fill:var(--text-faint)">augmented prompt</text>
          <rect x="318" y="118" width="74" height="40" rx="5" style="fill:var(--bg-elev2)"/>
          <text x="355" y="142" text-anchor="middle" style="fill:var(--text)">LLM</text>
          <rect x="412" y="118" width="100" height="40" rx="5" style="fill:var(--good-soft)"/>
          <text x="462" y="135" text-anchor="middle" style="fill:var(--good)">grounded</text>
          <text x="462" y="149" text-anchor="middle" style="fill:var(--good)">answer</text>
        </g>
        <line x1="246" y1="84" x2="221" y2="116" class="vx-accent" stroke-width="1.5" marker-end="url(#ar2)"/>
        <line x1="45" y1="78" x2="155" y2="116" class="vx-grid" stroke-width="1.2" stroke-dasharray="3 3" marker-end="url(#ar3)"/>
        <line x1="292" y1="138" x2="316" y2="138" class="vx-axis" stroke-width="1.5" marker-end="url(#ar1)"/>
        <line x1="392" y1="138" x2="410" y2="138" class="vx-axis" stroke-width="1.5" marker-end="url(#ar1)"/>
        <text x="60" y="103" font-size="9.5" style="fill:var(--text-faint)">original query carried through</text>
        <text x="10" y="200" font-size="10.5" style="fill:var(--text-dim)">Knowledge lives in the corpus, not the weights — swap the corpus, no retraining.</text>
        <defs>
          <marker id="ar1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--border-strong)"/></marker>
          <marker id="ar2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--accent)"/></marker>
          <marker id="ar3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--border)"/></marker>
        </defs>
      </svg>`,
      caption: "Embed → vector-search top-k → stuff chunks + query into context → generate. The model answers from supplied evidence, not memory.",
      example: "Ask a closed model \"what changed in our Q3 return policy?\" and it confabulates — the policy was never in its training data. Wrap it in RAG over your internal docs: the query retrieves the actual policy paragraph, the model summarizes <i>that</i>, and cites the source. Same model, now correct and current — and tomorrow's policy works the instant you re-index, with zero retraining.",
      takeaway: "RAG is how you ground an LLM in fresh or proprietary facts without retraining — and the cheapest, most direct lever against hallucination."
    },
    {
      title: "Hallucination",
      tag: "core",
      body: "<p>A <b>hallucination</b> is output that is fluent, confident, and plausible — but <i>unfounded</i>: invented citations, fake APIs, wrong dates, a person who never existed. The cause is structural, not a bug. The model is trained to maximize next-token likelihood — to produce <i>plausible-sounding</i> text — and nothing in that objective rewards being <i>truthful</i> or penalizes confident guessing over honest uncertainty. Fluency and factuality are simply different targets, and the model optimizes the first.</p><p>Mitigations all push the model toward <i>grounding its claims in something checkable</i> rather than free-associating from weights:</p><ul><li><b>Retrieval (RAG)</b> — supply true evidence in-context so the likely continuation <i>is</i> the correct one.</li><li><b>Citations / attribution</b> — force every claim to point at a source, making fabrication visible and verifiable.</li><li><b>Abstention</b> — train and prompt the model to say \"I don't know\" / refuse when evidence is absent, instead of guessing.</li><li><b>Verification</b> — a second pass (or LLM-as-judge / tool) checks the answer against the source before it ships.</li></ul><p>None eliminate it — they shift the failure from silent and confident to <i>visible and checkable</i>, which is the win.</p>",
      example: "A legal-research model asked for case citations returns three perfectly formatted, utterly fictitious cases — correct citation <i>style</i> (high likelihood) with invented <i>content</i> (never checked). Grounding the model in a real case database (retrieval) and requiring a verbatim quote per citation (attribution) collapses the failure mode: it can now only cite cases that actually exist, and a missing match triggers abstention instead of invention.",
      takeaway: "You can't eliminate hallucination, so design for it: make claims checkable (citations, verification) so failures surface loudly instead of shipping as confident lies."
    },
    {
      title: "Tool use / function calling",
      tag: "agents",
      body: "<p>A model's weights are inert: they cannot run code, query a database, hit an API, check today's date, or do exact arithmetic. <b>Tool use</b> (a.k.a. <b>function calling</b>) breaks that boundary. You describe available tools — name, purpose, and a typed argument schema — and instead of answering in prose, the model emits a <b>structured call</b> (e.g. JSON: <code>search(query=\"...\")</code>). The <i>harness</i> — not the model — executes it, and feeds the result back into the context for the model to continue.</p><p>This turns a text predictor into something that can <b>act</b>: it offloads what it's bad at (precise computation, fresh or private data, side effects) to systems built for it, and keeps what it's good at (deciding <i>which</i> tool and <i>which</i> arguments). The structured, schema-constrained output is the contract that makes the call machine-executable rather than a hopeful string. Tool use is the atomic action; agents (next) are the loop that chains many of them.</p>",
      example: "Asked \"what's 4,817 × 2,933, and is it prime?\", a model guessing token-by-token will fumble the arithmetic. With tool use it instead emits <code>calculator(expr=\"4817*2933\")</code>, gets the exact product back, then calls <code>is_prime(n=...)</code> — outsourcing precision to code while it orchestrates the steps.",
      takeaway: "Tool use is how a text predictor touches the real world — exact math, live data, side effects; without it the model can only describe actions, never take them."
    },
    {
      title: "Agents: the observe → think → act loop",
      tag: "agents",
      body: "<p>An <b>agent</b> is a model placed in a <b>loop</b> with an environment, rather than answering once. The cycle — the <b>harness</b> (or scaffold) drives it:</p><p style=\"text-align:center\"><b>observe</b> (read state / tool results) → <b>think</b> (reason, plan next step) → <b>act</b> (emit a tool call) → observe the outcome → repeat.</p><p>The loop runs until the task is done or a budget is hit. <b>Agentic depth</b> = how many of these sequential steps and tool calls a task requires — a one-shot lookup is shallow; researching, writing, and debugging a multi-file change is deep. Depth is exactly where it gets hard: <b>errors compound over long horizons.</b> If each step succeeds with probability $p$, then $n$ independent steps all succeed with probability $p^n$, which decays fast — $0.95^{20}\\approx 0.36$. So <b>per-step reliability</b> is the lever that matters: small gains in $p$ pay off geometrically as horizons lengthen, and a single un-recovered mistake early can derail everything after it. (This is also why models that can <i>self-correct</i> mid-trajectory are prized for long-horizon work.)</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">The agent loop — and why depth is punishing</text>
        <g font-size="10.5">
          <circle cx="92" cy="78" r="30" style="fill:var(--bg-elev2)"/>
          <text x="92" y="82" text-anchor="middle" style="fill:var(--text)">observe</text>
          <circle cx="200" cy="78" r="30" style="fill:var(--bg-elev2)"/>
          <text x="200" y="82" text-anchor="middle" style="fill:var(--text)">think</text>
          <circle cx="146" cy="168" r="30" style="fill:var(--accent-soft)"/>
          <text x="146" y="165" text-anchor="middle" style="fill:var(--accent)">act</text>
          <text x="146" y="178" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">tool call</text>
        </g>
        <path d="M120,72 A60 60 0 0 1 172,72" fill="none" class="vx-axis" stroke-width="1.6" marker-end="url(#lp)"/>
        <path d="M212,104 A60 60 0 0 1 168,148" fill="none" class="vx-accent" stroke-width="1.6" marker-end="url(#lpa)"/>
        <path d="M122,150 A60 60 0 0 1 86,108" fill="none" class="vx-good" stroke-width="1.6" marker-end="url(#lpg)"/>
        <text x="146" y="44" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">depth = repeat the cycle</text>
        <line x1="290" y1="40" x2="290" y2="210" class="vx-axis" stroke-width="1.5"/>
        <line x1="290" y1="210" x2="500" y2="210" class="vx-axis" stroke-width="1.5"/>
        <text x="395" y="234" text-anchor="middle" font-size="11">steps n →</text>
        <text x="278" y="48" text-anchor="end" font-size="9.5" style="fill:var(--text-faint)">1.0</text>
        <text x="278" y="210" text-anchor="end" font-size="9.5" style="fill:var(--text-faint)">0</text>
        <text x="305" y="56" font-size="10" style="fill:var(--text-dim)">P(all n steps succeed) = pⁿ</text>
        <path d="M290,48 C330,78 372,138 420,152 C455,162 482,172 500,178" fill="none" class="vx-good" stroke-width="2.4"/>
        <path d="M290,48 C322,108 378,178 420,191 C455,200 482,204 500,206" fill="none" class="vx-bad" stroke-width="2.4"/>
        <circle cx="420" cy="152" r="3.5" style="fill:var(--good)"/>
        <text x="412" y="146" font-size="9.5" text-anchor="end" style="fill:var(--good)">p=.95 → .36 at n=20</text>
        <circle cx="420" cy="191" r="3.5" style="fill:var(--bad)"/>
        <text x="425" y="195" font-size="9.5" style="fill:var(--bad)">p=.90 → .12</text>
        <text x="10" y="244" font-size="10" style="fill:var(--text-dim)">Per-step reliability compounds: small p gains pay off geometrically over long horizons.</text>
        <defs>
          <marker id="lp" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--border-strong)"/></marker>
          <marker id="lpa" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--accent)"/></marker>
          <marker id="lpg" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--good)"/></marker>
        </defs>
      </svg>`,
      caption: "Left: the observe→think→act cycle, repeated. Right: even 95%-reliable steps decay to ~36% success over 20 of them — depth is the enemy.",
      example: "A coding agent fixing a bug: <i>observe</i> the failing test, <i>think</i> \"the off-by-one is in the loop bound,\" <i>act</i> by editing the file and re-running tests, then observe the new result and loop. A 30-step refactor with 90%-reliable steps finishes clean only ~4% of the time ($0.9^{30}$) — which is why raising per-step reliability and adding self-checks matters far more than raw single-step IQ.",
      takeaway: "Agent reliability compounds: $0.95^{20}\\approx 0.36$, so per-step accuracy and mid-run self-correction matter far more than raw single-shot IQ for long tasks."
    },
    {
      title: "Evaluation methodology: why agents are hard to grade",
      tag: "eval",
      body: "<p>Evals are the highest-bandwidth channel between what you want and what the model optimizes — but grading gets steadily harder as systems get more agentic:</p><ul><li><b>Capability evals</b> ask \"what can it do?\" — start at a low pass rate, give a hill to climb. <b>Regression evals</b> ask \"does it still do what it used to?\" — should sit near 100%. Saturated capability evals graduate into the regression suite; you then build a harder hill.</li><li><b>Capability vs agent evals.</b> Scoring a single prompt→response is easy. Scoring an <i>agent</i> is hard: it spans <b>many turns</b> (errors propagate), there is often <b>no single right answer</b> (partial credit), and behavior is <b>nondeterministic</b> (the same task gives different runs).</li><li><b>LLM-as-judge</b> scales nuanced grading (rubrics, pairwise) but carries <b>biases</b> — position/verbosity/self-preference — and can hallucinate verdicts; calibrate it against humans and give it a \"Return Unknown\" escape.</li><li><b>Benchmark contamination</b> — test items leak into pretraining, so a high score measures memorization, not skill. Favor held-out, fresh, or private tasks.</li></ul><p>For stochastic agents, report the right metric: <b>pass@$k$</b> (≥1 success in $k$ tries — rises with $k$; use when one valid solution suffices) vs <b>pass^$k$</b> (all $k$ succeed — falls with $k$; use when consistency matters). And: <b>grade the outcome, not the path</b> — penalizing a fixed step sequence punishes creative-but-correct solutions; a heavy rule of thumb is that a task with 0% pass@100 is usually a <i>broken task</i>, not an incapable agent.</p>",
      example: "A model scores 92% on a public coding benchmark but 61% on a freshly written private set of the same difficulty — a textbook <b>contamination</b> gap: it had memorized the public answers. Separately, an LLM judge rates the <i>longer</i> of two equally-correct answers higher 70% of the time (verbosity bias) — caught only by spot-checking its verdicts against human raters.",
      takeaway: "Trust a benchmark only if it's held-out and you picked the metric on purpose: pass@$k$ when one success suffices, pass^$k$ when consistency is the product."
    },
    {
      title: "Prompting: in-context learning & chain-of-thought",
      tag: "core",
      body: "<p>Two prompting moves extract behavior from a <i>frozen</i> model — no weight updates, just context:</p><ul><li><b>Few-shot / in-context learning (ICL).</b> Put a handful of input→output <i>examples</i> in the prompt; the model infers the pattern and applies it to the new input. <b>Zero-shot</b> = instruction only; <b>few-shot</b> = instruction + demonstrations. The model isn't being trained — it's pattern-matching the demonstrations at inference, an emergent capability of scale. Use it to pin down format, label set, or style that prose instructions describe clumsily.</li><li><b>Chain-of-thought (CoT).</b> Prompt the model to produce intermediate reasoning steps (\"think step by step\") <i>before</i> the final answer. Because each generated token conditions the next, writing the steps out gives the model more serial computation to lean on and decomposes a hard problem into checkable sub-steps — sharply improving multi-step arithmetic, logic, and planning. The cost is real: more tokens means more latency and spend, the \"reasoning tax\" — quality bought with serial generation.</li></ul><p>Both exploit the same fact: the context window is a scratchpad, and what you put in it <i>is</i> the program.</p>",
      example: "Zero-shot, a model asked \"the cafeteria had 23 apples, used 20, bought 6 more — how many?\" may blurt a wrong number. Add \"Let's think step by step\": it writes \"23 − 20 = 3; 3 + 6 = 9,\" then answers <b>9</b> — the externalized steps catch the arithmetic. For a classification task, three labeled few-shot examples nail the exact label vocabulary far more reliably than a paragraph of instructions trying to describe it.",
      takeaway: "Reach for prompting before fine-tuning: few-shot pins down format and labels for free, and chain-of-thought buys multi-step accuracy at the cost of latency and tokens."
    },
    {
      title: "The frontier: diffusion / non-autoregressive decoding",
      tag: "frontier",
      body: "<p>Standard LLMs are <b>autoregressive (AR)</b>: they generate <i>strictly left-to-right</i>, one token at a time — token $n$ cannot begin until token $n-1$ exists. An $N$-token answer is $O(N)$ <i>sequential</i> forward passes, an irreducible serial chain regardless of how much compute you throw at it.</p><p><b>Diffusion / non-autoregressive</b> language models attack this directly. They start from a fully <i>masked or noised</i> sequence and <b>iteratively refine the whole thing in parallel</b> — a handful of denoising/unmasking steps, each pass re-touching <i>all positions at once</i>, instead of $N$ serial token-steps. Two structural consequences fall out:</p><ul><li><b>Parallel decoding</b> — a few whole-sequence steps instead of $N$ serial ones, decoupling latency from length (the basis for very high tokens/sec).</li><li><b>Bidirectional conditioning</b> — each position sees tokens on <i>both</i> sides, enabling native infill / edit / planning that left-to-right decoding cannot do, plus <b>self-correction</b>: an early mistake stays editable because every step revisits the whole output, rather than being committed forever.</li></ul><p><b>Block Diffusion</b> is the hybrid: generate <i>blocks</i> autoregressively but denoise <i>within</i> each block in parallel — interpolating between the two regimes to get long-form coherence and parallelism together. The attention primitive ($QK^\\top\\to$ softmax $\\to PV$) is <i>identical</i> in both; what differs is the generation loop wrapped around it.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="16" style="fill:var(--text)" font-size="13" font-weight="700">Autoregressive vs diffusion decoding</text>
        <text x="10" y="40" font-size="11" font-weight="600" style="fill:var(--accent)">Autoregressive — O(N) serial steps, left to right</text>
        <g font-size="11">
          <rect x="14" y="50" width="34" height="26" rx="4" style="fill:var(--accent-soft)"/><text x="31" y="68" text-anchor="middle" style="fill:var(--accent)">the</text>
          <rect x="56" y="50" width="34" height="26" rx="4" style="fill:var(--accent-soft)"/><text x="73" y="68" text-anchor="middle" style="fill:var(--accent)">cat</text>
          <rect x="98" y="50" width="34" height="26" rx="4" style="fill:var(--bg-elev2)"/><text x="115" y="68" text-anchor="middle" style="fill:var(--text-faint)">sat</text>
          <rect x="140" y="50" width="34" height="26" rx="4" style="fill:var(--bg-elev2)"/><text x="157" y="68" text-anchor="middle" style="fill:var(--text-faint)">?</text>
          <rect x="182" y="50" width="34" height="26" rx="4" style="fill:var(--bg-elev2)"/><text x="199" y="68" text-anchor="middle" style="fill:var(--text-faint)">?</text>
        </g>
        <line x1="48" y1="88" x2="216" y2="88" class="vx-axis" stroke-width="1.4" marker-end="url(#ard)"/>
        <text x="232" y="68" font-size="10" style="fill:var(--text-dim)">one token per step;</text>
        <text x="232" y="82" font-size="10" style="fill:var(--text-dim)">step n waits for n−1</text>
        <text x="10" y="124" font-size="11" font-weight="600" style="fill:var(--good)">Diffusion — a few parallel refine-all-positions steps</text>
        <g font-size="10">
          <text x="14" y="148" font-size="9.5" style="fill:var(--text-faint)">t=0</text>
          <rect x="44" y="138" width="30" height="24" rx="4" style="fill:var(--bg-elev2)"/><text x="59" y="155" text-anchor="middle" style="fill:var(--text-faint)">▒</text>
          <rect x="80" y="138" width="30" height="24" rx="4" style="fill:var(--bg-elev2)"/><text x="95" y="155" text-anchor="middle" style="fill:var(--text-faint)">▒</text>
          <rect x="116" y="138" width="30" height="24" rx="4" style="fill:var(--bg-elev2)"/><text x="131" y="155" text-anchor="middle" style="fill:var(--text-faint)">▒</text>
          <rect x="152" y="138" width="30" height="24" rx="4" style="fill:var(--bg-elev2)"/><text x="167" y="155" text-anchor="middle" style="fill:var(--text-faint)">▒</text>
          <rect x="188" y="138" width="30" height="24" rx="4" style="fill:var(--bg-elev2)"/><text x="203" y="155" text-anchor="middle" style="fill:var(--text-faint)">▒</text>
          <text x="244" y="155" style="fill:var(--text-faint)">all masked</text>
          <text x="14" y="190" font-size="9.5" style="fill:var(--text-faint)">t=1</text>
          <rect x="44" y="180" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="59" y="197" text-anchor="middle" style="fill:var(--good)">the</text>
          <rect x="80" y="180" width="30" height="24" rx="4" style="fill:var(--bg-elev2)"/><text x="95" y="197" text-anchor="middle" style="fill:var(--text-faint)">▒</text>
          <rect x="116" y="180" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="131" y="197" text-anchor="middle" style="fill:var(--good)">sat</text>
          <rect x="152" y="180" width="30" height="24" rx="4" style="fill:var(--bg-elev2)"/><text x="167" y="197" text-anchor="middle" style="fill:var(--text-faint)">▒</text>
          <rect x="188" y="180" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="203" y="197" text-anchor="middle" style="fill:var(--good)">mat</text>
          <text x="244" y="197" style="fill:var(--text-faint)">refine in parallel</text>
          <text x="14" y="232" font-size="9.5" style="fill:var(--text-faint)">t=2</text>
          <rect x="44" y="222" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="59" y="239" text-anchor="middle" style="fill:var(--good)">the</text>
          <rect x="80" y="222" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="95" y="239" text-anchor="middle" style="fill:var(--good)">cat</text>
          <rect x="116" y="222" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="131" y="239" text-anchor="middle" style="fill:var(--good)">sat</text>
          <rect x="152" y="222" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="167" y="239" text-anchor="middle" style="fill:var(--good)">on</text>
          <rect x="188" y="222" width="30" height="24" rx="4" style="fill:var(--good-soft)"/><text x="203" y="239" text-anchor="middle" style="fill:var(--good)">mat</text>
          <text x="244" y="239" style="fill:var(--good)">clean — few steps total</text>
        </g>
        <line x1="30" y1="134" x2="30" y2="246" class="vx-good" stroke-width="1.4" marker-end="url(#ardg)"/>
        <defs>
          <marker id="ard" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--border-strong)"/></marker>
          <marker id="ardg" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--good)"/></marker>
        </defs>
      </svg>`,
      caption: "Top: AR emits tokens one-by-one, N serial passes. Bottom: diffusion starts all-masked and refines every position together over a few parallel steps.",
      example: "Ask both to fill a blank: \"The ___ sat on the mat, purring.\" The AR model, having already committed \"The dog\" before reaching \"purring,\" is stuck with an inconsistency. A diffusion model conditions on the <i>whole</i> sentence at once — it sees \"purring\" while choosing the blank and fills \"cat,\" because every step can revise every position. That bidirectional view is exactly what enables native infill and self-correction.",
      takeaway: "Diffusion decoding decouples latency from output length and unlocks native infill and self-correction — the payoff when speed or whole-sequence editing is the product requirement."
    },
    {
      title: "AR vs diffusion: the tradeoff space & one forward process",
      tag: "frontier",
      body: "<p>Neither paradigm dominates — the choice is a <b>tradeoff space</b>. <b>Diffusion</b>'s structural wins are the ones from the previous toggle — latency / parallelism, bidirectional conditioning, self-correction — plus <b>controllability</b> (schema / constrained generation applied across the whole sequence). The other half of the ledger is what <b>autoregression</b> currently wins: <b>peak quality</b> on the hardest reasoning, a far more mature <b>alignment</b> toolkit (preference-tuning recipes, known pipelines), and a decade-deep <b>serving / ecosystem</b> moat (every tool assumes left-to-right). The honest reading: diffusion owns latency and structure; AR owns peak quality, alignment maturity, and inertia — and a hybrid like Block Diffusion deliberately straddles them.</p><p><b>The unifying view.</b> Diffusion isn't one trick. DDPM, score-based models, and flow matching are <i>three lenses on the same forward process</i> — a fixed, parameter-free corruption that interpolates a clean sample $x_0$ toward Gaussian noise $\\varepsilon$:</p><p style=\"text-align:center\">$x_t=\\alpha_t x_0+\\sigma_t\\varepsilon$</p><p>The schedule $(\\alpha_t,\\sigma_t)$ slides from all-signal ($t\\!\\to\\!0$) to all-noise ($t\\!\\to\\!T$). The forward (noising) direction is <i>free</i> — no model. The only thing learned is the <b>reverse</b>: the three views just differ in what the network predicts — the noise $\\varepsilon$ (DDPM), the score $\\nabla_x\\log p_t(x)$ (score-based), or the velocity (flow matching) — and these targets are interconvertible parameterizations of one density evolution. \"Creating noise from data is easy; creating data from noise is generative modeling.\"</p>",
      visual: `<svg viewBox="0 0 520 215" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="18" style="fill:var(--text)" font-size="13" font-weight="700">One forward process: xₜ = αₜ·x₀ + σₜ·ε</text>
        <g>
          <rect x="20" y="44" width="78" height="62" rx="6" style="fill:var(--good-soft)"/>
          <text x="59" y="36" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">t = 0</text>
          <text x="59" y="80" text-anchor="middle" font-size="11" style="fill:var(--good)">clean x₀</text>
          <rect x="148" y="44" width="78" height="62" rx="6" style="fill:var(--bg-elev2)"/>
          <text x="187" y="80" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">+ noise</text>
          <rect x="276" y="44" width="78" height="62" rx="6" style="fill:var(--bg-elev2)"/>
          <text x="315" y="80" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">noisier</text>
          <rect x="404" y="44" width="92" height="62" rx="6" style="fill:var(--accent-soft)"/>
          <text x="450" y="36" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">t = T</text>
          <text x="450" y="76" text-anchor="middle" font-size="11" style="fill:var(--accent)">Gaussian</text>
          <text x="450" y="92" text-anchor="middle" font-size="11" style="fill:var(--accent)">noise ε</text>
        </g>
        <line x1="98" y1="60" x2="146" y2="60" class="vx-axis" stroke-width="1.5" marker-end="url(#fp1)"/>
        <line x1="226" y1="60" x2="274" y2="60" class="vx-axis" stroke-width="1.5" marker-end="url(#fp1)"/>
        <line x1="354" y1="60" x2="402" y2="60" class="vx-axis" stroke-width="1.5" marker-end="url(#fp1)"/>
        <text x="258" y="36" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">forward: free, no model →</text>
        <path d="M450,118 C360,150 200,150 70,118" fill="none" class="vx-good" stroke-width="2" marker-end="url(#fp2)" stroke-dasharray="5 3"/>
        <text x="258" y="150" text-anchor="middle" font-size="10.5" style="fill:var(--good)">← reverse: the only thing learned (denoise)</text>
        <text x="10" y="184" font-size="10" style="fill:var(--text-dim)">DDPM predicts ε · score models predict ∇ₓ log pₜ(x) · flow matching predicts velocity</text>
        <text x="10" y="202" font-size="10" style="fill:var(--text-faint)">— three lenses, interconvertible, one density evolution.</text>
        <defs>
          <marker id="fp1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" style="fill:var(--border-strong)"/></marker>
          <marker id="fp2" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" style="fill:var(--good)"/></marker>
        </defs>
      </svg>`,
      caption: "The shared forward process noises x₀ into Gaussian ε for free; training learns only the reverse arrow. DDPM/score/flow-matching are three predictions of the same evolution.",
      example: "Picture a clear photo turned to TV static one step at a time — that's the forward process, trivial and untrained. The whole field is learning to run it backwards: sample free static and denoise it into a novel image. Choosing diffusion over AR is then a product call — a voice or code-edit feature buys diffusion's latency and bidirectional editing; a hardest-reasoning or alignment-critical feature still leans AR today.",
      takeaway: "AR-vs-diffusion is a product decision, not a winner: pick diffusion for latency, infill, and control; pick AR for peak reasoning, mature alignment, and tooling."
    }
  ]
};
