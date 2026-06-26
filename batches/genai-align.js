/* Batch: Generative LLMs — Alignment, Decoding & Serving  (modern-LLM lifecycle) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["genai-align"] = [
  {
    id: "gl-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Across the modern LLM lifecycle (tokenize &rarr; pretrain &rarr; supervised fine-tuning &rarr; RL &rarr; serve), what stays the <b>same</b> at every training stage while the data curriculum changes?",
    options: [
      "The training objective is always next-token prediction",
      "The loss switches from cross-entropy to a reranking loss at each stage",
      "A fresh model is trained from scratch at every stage",
      "The vocabulary is re-learned at each stage"
    ],
    answer: 0,
    explanation: "The guiding slogan is that <i>the magic is the data curriculum, not the loss</i> &mdash; every stage is still next-token prediction. Pretraining sees raw web text, supervised fine-tuning sees chat-formatted demonstrations, and the RL stage optimizes against preference data, but the underlying objective never changes; what changes is which (increasingly curated) data the model predicts.",
    ref: "five stages"
  },
  {
    id: "gl-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What does the <b>pretraining</b> objective of a standard LLM optimize?",
    options: [
      "Self-supervised next-token cross-entropy on large unlabeled text corpora",
      "A human-preference reward collected from labelers",
      "A contrastive loss between paragraph embeddings",
      "Supervised classification on hand-labeled instruction pairs"
    ],
    answer: 0,
    explanation: "Pretraining is self-supervised: the &lsquo;label&rsquo; for each position is simply the next token in the raw text, so the model minimizes next-token cross-entropy over huge unlabeled corpora. This is where the model learns grammar, facts, and reasoning patterns &mdash; &lsquo;how language works.&rsquo; Human preferences and instruction demonstrations enter only at the later fine-tuning and RL stages.",
    ref: "pretraining objective"
  },
  {
    id: "gl-3", type: "mc", framing: "applied", difficulty: 2,
    prompt: "A team has a pretrained base model and wants it to reliably follow instructions and adopt an assistant turn format, using a curated set of high-quality prompt&ndash;response demonstrations. Which stage does this describe?",
    options: [
      "Supervised fine-tuning (SFT)",
      "Pretraining",
      "Reward-model training",
      "Nucleus (top-p) decoding"
    ],
    answer: 0,
    explanation: "Supervised fine-tuning continues next-token training, but on chat-formatted demonstrations of good assistant behavior, teaching the model &lsquo;what an assistant turn looks like&rsquo; &mdash; format and helpfulness. It precedes any preference-based RL. Reward-model training and decoding are different stages; pretraining uses raw, uncurated text.",
    ref: "supervised fine-tuning"
  },
  {
    id: "gl-4", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "<b>Nucleus (top-p) sampling</b> keeps the smallest set of highest-probability tokens whose cumulative probability is at least $p$. Given next-token probabilities $\\{0.6, 0.25, 0.10, 0.05\\}$ and $p=0.9$, how many tokens are in the nucleus?",
    answer: 3, tolerance: 0, unit: "",
    hint: "Add the sorted probabilities until the running total first reaches $0.9$.",
    explanation: "Accumulate from the top: $0.6$, then $0.6+0.25=0.85$ (still $<0.9$), then $0.85+0.10=0.95\\ge0.9$ &mdash; so 3 tokens are kept and the $0.05$ tail is truncated. Top-p adapts the candidate-set size to the shape of the distribution, unlike top-k which fixes the count.",
    ref: "top-p / nucleus sampling"
  },
  {
    id: "gl-5", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "Classic <b>RLHF</b> aligns a policy by collecting human preference pairs, fitting a reward model, then optimizing the policy with PPO. Select every statement that is true of this pipeline.",
    options: [
      "The reward model is fit from pairwise human preferences using a Bradley-Terry model",
      "A KL penalty to a frozen reference policy discourages drifting far from the SFT model",
      "Without the KL constraint the policy can reward-hack and degenerate",
      "It optimizes the policy directly on preference pairs with no separate reward model",
      "It requires only a single model and no sampling during training"
    ],
    answer: [0, 1, 2],
    explanation: "Classic RLHF fits a reward model from pairwise preferences via the Bradley-Terry model, then runs PPO on the policy under a KL penalty toward a frozen reference (the SFT model) to prevent reward hacking and distribution drift. It is a multi-model pipeline with sampling in the loop. Options 4&ndash;5 describe DPO, which removes the explicit reward model and RL loop.",
    ref: "RLHF"
  },
  {
    id: "gl-11", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "In RLHF, a policy optimized hard against the learned reward model starts emitting text that scores high on that reward yet is clearly worse to actual humans. Which framing best names what has gone wrong?",
    options: [
      "Goodhart's Law / reward hacking: optimizing a <i>proxy</i> (the reward model) eventually corrupts the true objective (human preference) it stands in for",
      "Vanishing gradients: the reward signal is too small to update the policy",
      "Catastrophic forgetting: the policy has overwritten its pretraining knowledge",
      "Mode collapse: the policy can only produce one output regardless of prompt"
    ],
    answer: 0,
    explanation: "The reward model is only a measurable <i>proxy</i> for true human preference, so pushing on it too hard makes the proxy and the goal diverge — \"when a measure becomes a target, it ceases to be a good measure.\" This is <b>Goodhart's Law</b>, and reward hacking and overfitting-to-the-metric are the same phenomenon under different names; it is the alignment-stage instance of the Stage 0 proxy gap. The KL leash to the reference policy is what bounds it. The other options are unrelated training pathologies.",
    ref: "reward hacking / Goodhart"
  },
  {
    id: "gl-6", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "<b>DPO</b> (Direct Preference Optimization) avoids training a separate reward model. What is the key reparameterization that makes this work?",
    options: [
      "Writing the reward in terms of $\\beta\\log\\frac{\\pi_\\theta}{\\pi_{\\text{ref}}}$ so the partition function $Z(x)$ cancels in the Bradley-Terry difference",
      "Replacing cross-entropy with mean squared error against the reward model's logits",
      "Freezing the policy and training only the reward model to convergence",
      "Sampling on-policy rollouts and bootstrapping a value function"
    ],
    answer: 0,
    explanation: "The KL-constrained RLHF optimum has a closed form in which the implied reward is $r(x,y)=\\beta\\log\\frac{\\pi_\\theta(y\\mid x)}{\\pi_{\\text{ref}}(y\\mid x)}+\\beta\\log Z(x)$. Because Bradley-Terry depends only on the <i>difference</i> of two rewards for the same prompt, the intractable normalizer $Z(x)$ cancels, leaving a simple classification-style loss on preference pairs. The policy becomes its own implicit reward model.",
    ref: "DPO"
  },
  {
    id: "gl-7", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Quantizing weights from FP16 (16 bits per weight) to INT4 (4 bits per weight) shrinks the stored weights by roughly what factor?",
    answer: 4, tolerance: 0, unit: "x",
    hint: "Compare bits per weight before and after.",
    explanation: "$16/4 = 4$, so INT4 weights occupy about one-quarter the memory of FP16 &mdash; a ~4&times; reduction (e.g., a model needing 16 GB in FP16 fits in ~4 GB). Post-training quantization methods such as GPTQ and AWQ exploit this to cut the memory-bandwidth cost that dominates autoregressive decoding, usually with modest quality loss.",
    ref: "quantization"
  },
  {
    id: "gl-8", type: "ms", framing: "applied", difficulty: 4,
    prompt: "Select every statement that correctly describes <b>inference-efficiency</b> techniques for autoregressive serving.",
    options: [
      "The KV cache stores past keys/values so each new token avoids recomputing attention over the whole prefix",
      "Speculative decoding uses a small draft model to propose several tokens that the large model verifies in one forward pass",
      "The KV cache removes the serial dependency, letting all output tokens be generated in parallel",
      "KV-cache memory grows with context length &times; layers &times; batch, becoming a memory-bandwidth bottleneck at long context and high concurrency",
      "Quantization to INT8/INT4 increases the bytes moved per weight, raising memory bandwidth"
    ],
    answer: [0, 1, 3],
    explanation: "The KV cache reuses past keys/values to cut redundant compute, but it does <i>not</i> break the serial chain &mdash; token $N$ still waits for token $N-1$ &mdash; and the cache itself grows with context &times; layers &times; batch, creating a memory-bandwidth bottleneck. Speculative decoding lets a cheap draft model propose tokens that one big-model pass verifies. Quantization <i>reduces</i> bytes per weight, easing bandwidth, so option 5 is false.",
    ref: "KV cache, speculative decoding"
  },
  {
    id: "gl-9", type: "qc", framing: "conceptual", difficulty: 4,
    prompt: "Compare classic RLHF (reward-model + PPO) with DPO for aligning a policy on the <i>same</i> preference dataset.",
    quantityA: "Number of distinct models that must be instantiated to run classic RLHF's PPO stage (policy, reference, reward, value/critic)",
    quantityB: "Number of distinct models DPO needs (policy + frozen reference)",
    answer: 0,
    explanation: "Classic RLHF's PPO stage juggles several models &mdash; the trainable policy, a frozen reference for the KL penalty, the separately-trained reward model, and typically a value/critic head &mdash; so quantity A is about 4. DPO collapses this to just the trainable policy plus a frozen reference (quantity B = 2), with no reward model and no RL loop. A is greater.",
    ref: "DPO vs RLHF"
  },
  {
    id: "gl-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "Consider temperature $T$ applied to logits before the softmax, $p_i \\propto \\exp(z_i/T)$. Which statement is <b>FALSE</b>?",
    options: [
      "As $T\\to 0^+$ the distribution approaches uniform over the vocabulary",
      "As $T\\to\\infty$ the distribution approaches uniform over the vocabulary",
      "As $T\\to 0^+$ sampling becomes equivalent to greedy (argmax) decoding",
      "Lowering $T$ sharpens the distribution, raising it flattens the distribution"
    ],
    answer: 0,
    explanation: "It is reversed: as $T\\to 0^+$ the softmax concentrates all mass on the largest logit &mdash; argmax / greedy decoding &mdash; not uniform. The uniform limit is $T\\to\\infty$, where $z_i/T\\to 0$ and every token becomes equally likely. So lower $T$ sharpens (less diverse, more deterministic) and higher $T$ flattens (more diverse). Option 1 swaps the two limits and is the false statement.",
    ref: "temperature & softmax"
  }
];
