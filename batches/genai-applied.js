/* Batch: Applied GenAI — RAG, Agents, Evals & the Non-Autoregressive Frontier */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["genai-applied"] = [
  {
    id: "gp-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "What is the core purpose of <b>retrieval-augmented generation</b> (RAG)?",
    options: [
      "Retrieve relevant external chunks into the context so answers are grounded in up-to-date facts",
      "Permanently rewrite the model's weights with new information",
      "Compress the prompt so it fits in a smaller context window",
      "Replace the decoder so the model generates tokens in parallel"
    ],
    answer: 0,
    explanation: "RAG embeds a query, runs vector search over a corpus, and pulls the top-$k$ relevant chunks into the context window so the model can ground its answer in external, current facts — cutting hallucination without touching the weights. Changing the weights is fine-tuning; parallel decoding is a diffusion-LM property.",
    ref: "RAG"
  },
  {
    id: "gp-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "Why do language models <b>hallucinate</b> — produce fluent text that is confidently wrong?",
    options: [
      "They are trained to produce probable continuations, not to verify factual truth",
      "They always copy verbatim from their training set",
      "They run out of context tokens and emit random noise",
      "Hallucination only happens when the temperature is set to zero"
    ],
    answer: 0,
    explanation: "Next-token training optimizes for plausible, well-formed continuations, not grounded truth — so when the model lacks the fact it confabulates a fluent guess. The standard mitigations attack this gap: grounding via retrieval, requiring citations, and abstaining when unsupported.",
    ref: "hallucination"
  },
  {
    id: "gp-3", type: "mc", framing: "applied", difficulty: 2,
    prompt: "A model answering customer questions over your company's internal wiki keeps inventing plausible-but-wrong policy details. The facts change weekly. Which fix best addresses the <i>root cause</i>?",
    options: [
      "Retrieve the relevant wiki chunks into the context at query time (RAG)",
      "Fine-tune the model once on a snapshot of the wiki",
      "Raise the sampling temperature so answers are more varied",
      "Add 'do not hallucinate' to the system prompt and nothing else"
    ],
    answer: 0,
    explanation: "When knowledge is dynamic and must be cited, RAG is the right tool: it grounds each answer in the current source documents. Fine-tuning on a snapshot goes stale and bakes facts into weights you can't easily update; raising temperature worsens confabulation; a bare instruction does not supply the missing facts.",
    ref: "RAG vs fine-tune"
  },
  {
    id: "gp-4", type: "mc", framing: "conceptual", difficulty: 2,
    prompt: "In <b>tool use / function calling</b>, what does the model actually do, and why does it matter?",
    options: [
      "It emits a structured call (name + arguments) that the harness executes, letting it act beyond its frozen weights",
      "It silently rewrites its own weights to gain a new skill mid-conversation",
      "It executes arbitrary code directly inside the transformer's forward pass",
      "It guarantees the returned answer is factually correct"
    ],
    answer: 0,
    explanation: "The model does not run the tool itself — it produces a structured call that the surrounding harness executes, then feeds the result back. This lets a frozen model fetch live data, do exact arithmetic, or act on the world, but it carries no correctness guarantee on its own.",
    ref: "tool use"
  },
  {
    id: "gp-5", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "Autoregressive decoding needs one sequential forward pass per token, so a 1000-token answer costs 1000 serial passes. A diffusion LM instead refines the whole sequence over a fixed 20 denoising steps. By what factor does the diffusion LM cut the number of <b>sequential</b> generation steps?",
    answer: 50, tolerance: 0, unit: "x",
    hint: "Divide the serial passes ($1000$) by the denoising steps ($20$).",
    explanation: "Autoregression is a serial chain of length $n$: $O(n)$ latency, here $1000$ passes. Diffusion does a fixed number of parallel refine-everything steps ($20$), so $1000/20=50\\times$ fewer sequential steps. The win is structural — a different generation loop — not attention being computed faster.",
    ref: "diffusion LMs"
  },
  {
    id: "gp-6", type: "ms", framing: "conceptual", difficulty: 3,
    prompt: "An <b>agent</b> runs an observe&rarr;think&rarr;act loop with tools over many steps. Select every statement that is true of agentic systems.",
    options: [
      "Agentic depth means many sequential tool calls and steps per task",
      "Errors can compound over a long horizon, since later steps build on earlier mistakes",
      "Each added sequential tool call adds a round-trip, increasing latency",
      "Adding more steps always monotonically improves the final result",
      "When you 'evaluate the agent' you are evaluating the harness and the model together"
    ],
    answer: [0, 1, 2, 4],
    explanation: "Agentic depth = many sequential steps/tool calls, each a round-trip that adds latency, and errors cascade across the horizon. Crucially, an agent is the harness (scaffold orchestrating tools) plus the model — a failure can come from either. More steps do <i>not</i> guarantee improvement: extra steps can introduce new errors or drift.",
    ref: "agents"
  },
  {
    id: "gp-7", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "An agent succeeds on a customer task with probability $p=0.9$ on any single independent trial. For a customer-facing deployment you care about <b>$\\text{pass}^k$</b> — the probability that ALL $k=5$ trials succeed. Compute $\\text{pass}^5$.",
    answer: 0.590, tolerance: 0.005, unit: "",
    hint: "Independent trials: $\\text{pass}^k = p^k = 0.9^5$.",
    explanation: "$\\text{pass}^k$ requires every trial to succeed: $0.9^5\\approx0.590$. Even at 90% per-trial reliability, consistency erodes fast with $k$ — which is why customer-facing agents are judged on $\\text{pass}^k$ (falls with $k$), whereas $\\text{pass@}k$ (at least one success, rises with $k$) suits best-of-$n$ uses like code completion.",
    ref: "evaluation methodology"
  },
  {
    id: "gp-8", type: "ms", framing: "applied", difficulty: 4,
    prompt: "You are building an <b>agent eval</b> suite. Select every practice that reflects sound methodology.",
    options: [
      "Grade the final outcome/output, not a rigid fixed sequence of steps",
      "Calibrate any LLM-as-judge against human review and give it a 'Return Unknown' escape",
      "Isolate each trial in a fresh environment so leftover state can't correlate failures",
      "Trust a 0% pass@100 task as proof the agent is incapable, with no further inspection",
      "Run multiple trials per task because agent outputs vary between runs"
    ],
    answer: [0, 1, 2, 4],
    explanation: "Grade outcomes (path-checking penalizes valid creative solutions and invites grading loopholes); calibrate LLM judges against humans and let them abstain; isolate trials so infrastructure flakiness isn't read as agent weakness; and sample multiple trials given nondeterminism. A 0% pass@100 is more often a broken task — ambiguous spec or spec/grader mismatch — than an incapable agent, so you read transcripts before concluding.",
    ref: "agent evals"
  },
  {
    id: "gp-9", type: "mc", framing: "conceptual", difficulty: 4,
    prompt: "Which is a genuine pitfall of using <b>LLM-as-judge</b> for evaluation?",
    options: [
      "It is non-deterministic and carries biases, so it can misjudge valid outputs without calibration",
      "It is always cheaper and more reliable than deterministic string-matching graders",
      "It eliminates benchmark contamination by construction",
      "It removes the need to ever read transcripts"
    ],
    answer: 0,
    explanation: "Model-based grading is flexible and scales to freeform output, but it is non-deterministic, needs calibration against humans, and inherits judge biases — it can confidently misjudge a correct answer, especially in subjective domains. It does not fix contamination, and you still read transcripts: a failing score is as likely a grading bug as a real failure.",
    ref: "LLM-as-judge"
  },
  {
    id: "gp-10", type: "qc", framing: "conceptual", difficulty: 5,
    prompt: "DDPM, score-based models, and Flow Matching each train a network against a forward Gaussian noising process of the form $x_t=\\alpha_t x_0+\\sigma_t\\varepsilon$. Compare the two quantities for a fixed schedule $(\\alpha_t,\\sigma_t)$.",
    quantityA: "The forward noising process implied by the DDPM (noise-prediction) view",
    quantityB: "The forward noising process implied by the Flow-Matching (velocity-prediction) view",
    answer: 2,
    explanation: "They are equal. DDPM, score-based, and Flow-Matching share the identical forward process $x_t=\\alpha_t x_0+\\sigma_t\\varepsilon$; what differs is only the noise schedule and the network's <i>prediction target</i> — the added noise $\\varepsilon$, the score $\\nabla_x\\log p_t(x)$, or the velocity $v_t$ — which are interconvertible parameterizations of the same density evolution. For a fixed schedule the underlying process is the same.",
    ref: "diffusion LMs (unifying view)"
  }
];
