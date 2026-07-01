/* Batch: Stage 0 — Think Like a Decision Scientist (primer check) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["stage0"] = [
  {
    id: "s0-1", type: "mc", framing: "applied", difficulty: 1,
    prompt: "A logistics startup has 300k historical shipments, each recorded with its route features and the <b>actual delivery time</b> that resulted. It wants a model that predicts delivery time for new shipments. On the <b>learning signal</b> axis, which regime is this?",
    options: [
      "Supervised — every input comes with a ground-truth label (the realized delivery time)",
      "Unsupervised — the model must discover structure in the shipments without any labels",
      "Reinforcement — the model acts and receives an occasional, delayed reward",
      "Self-supervised — labels must be manufactured from the raw data itself"
    ],
    answer: 0,
    explanation: "Recorded outcomes attached to each input are labels, so this is supervised learning — and because the label is a number, it's regression, which fixes the loss. Placing the problem on the typology axes before touching any math is the primer's first move: it narrows the method space and tells you which stage applies (here, Stages 1–2).",
    ref: "Problem typology (learning signal)"
  },
  {
    id: "s0-2", type: "mc", framing: "applied", difficulty: 1,
    prompt: "A news app must pick <b>one of 8 candidate headlines</b> for each arriving visitor, immediately observes whether they click, and keeps updating its strategy as traffic streams in. Classify this problem on two axes: online vs offline, and discrete vs continuous.",
    options: [
      "Online and discrete — it learns as data streams in, choosing among a finite set of options",
      "Offline and discrete — it learns from a fixed dataset, choosing among a finite set of options",
      "Online and continuous — it learns as data streams in, tuning a smooth numeric quantity",
      "Offline and continuous — it learns from a fixed dataset, tuning a smooth numeric quantity"
    ],
    answer: 0,
    explanation: "Decisions and feedback arrive one visitor at a time, so the problem is online; the action space is 8 distinct headlines, so it is discrete — a combinatorial pick, not a smooth knob for gradients. Naming the regime immediately points at the right toolkit: this is a bandit-style explore/exploit problem (Stages 3 and 5), not batch model fitting.",
    ref: "Problem typology (online/offline, discrete/continuous)"
  },
  {
    id: "s0-3", type: "mc", framing: "applied", difficulty: 2,
    prompt: "A support organization wants to \"get better at support\" and will point an optimizer at whichever metric it picks. Which candidate is the <b>real objective</b> rather than a gameable proxy?",
    options: [
      "Minimize average handle time per ticket",
      "Maximize expected customer revenue retained, net of support cost",
      "Maximize the number of tickets closed per agent per day",
      "Maximize the fraction of chats in which the customer says \"thanks\""
    ],
    answer: 1,
    explanation: "Handle time, close counts, and \"thanks\" rates are measurable stand-ins an optimizer will happily game — rush calls, close-and-reopen tickets, fish for pleasantries — while the outcomes you care about get worse. That is Goodhart's law: optimize a proxy and it stops measuring what it did. The real objective names the valued outcome (retained revenue) and what you'll pay for it (support cost) — pose that, not the convenient stand-in.",
    ref: "Objectives, actions & outcomes (Goodhart's law)"
  },
  {
    id: "s0-4", type: "ms", framing: "applied", difficulty: 2,
    prompt: "A subscription business is designing its churn-response playbook: it can offer discounts, and it wants to keep revenue. Select every statement that assigns an element of this decision to its <b>correct role</b>.",
    options: [
      "The size of the discount offered to a flagged customer is an <b>action</b> — it is under the business's control",
      "Whether a given customer actually cancels next month is an <b>outcome</b> — uncertain and not directly controlled",
      "\"Maximize expected retained revenue minus discount spend\" is a well-posed <b>objective</b> — one number that internalizes the trade-off",
      "The customer's cancellation is an <b>action</b>, since the business influences it with discounts",
      "\"Reduce churn\" is already a complete objective, with no need to name actions or costs"
    ],
    answer: [0, 1, 2],
    explanation: "A well-posed decision keeps the three roles separate: actions are what you control (the discount), outcomes are what you don't (the cancellation — influenced, never chosen), and the objective is a single number that prices the trade-off. Influence is not control, so the customer's choice stays an outcome; and \"reduce churn\" isn't an objective until you say by what action, at what cost. Get the framing right and the optimizer answers the question you actually care about.",
    ref: "Objectives, actions & outcomes"
  },
  {
    id: "s0-5", type: "mc", framing: "applied", difficulty: 2,
    prompt: "A bootstrapped founder describes herself as risk-averse — her utility for money is concave. She must choose between a sure \\$50k consulting contract and a moonshot deal paying \\$110k with probability 1/2 (and \\$0 otherwise). Which analysis is consistent with maximizing <b>expected utility</b>?",
    options: [
      "Taking the sure \\$50k can be the rational choice: a sufficiently concave $U$ ranks the certain payoff above the gamble even though the gamble has higher expected money (\\$55k)",
      "She must take the moonshot — rationality means maximizing expected dollars, and \\$55k &gt; \\$50k",
      "She must take the moonshot — risk attitude only applies to potential losses, and neither option loses money",
      "The options can't be ranked — expected utility is undefined when one outcome is \\$0"
    ],
    answer: 0,
    explanation: "Expected money favors the gamble (\\$55k vs \\$50k), but \"rational\" means maximizing expected <i>utility</i>: with a concave $U$, $U(\\text{sure }50\\text{k})$ can exceed $\\tfrac12 U(110\\text{k})+\\tfrac12 U(0)$, so preferring the certain contract is fully consistent with expected-utility maximization. Her risk attitude lives in the curvature of $U$ over outcomes — not in a special rule for losses — and that same curvature is why people buy insurance with negative expected cash value.",
    ref: "Utility & expected utility (risk attitude)"
  },
  {
    id: "s0-6", type: "mc", framing: "applied", difficulty: 2,
    prompt: "A product manager can commission a \\$15k market study before deciding whether to build a feature. Under which condition is the study worth exactly <b>\\$0</b> to the decision — no matter how accurate it is?",
    options: [
      "When no possible result would change the build / don't-build choice — the PM would act the same either way",
      "When the study has some chance of being wrong, since imperfect information carries no value",
      "When the decision is high-stakes, because that is where uncertainty is largest",
      "Never — more accurate information always has positive value"
    ],
    answer: 0,
    explanation: "Information is valuable only through the actions it changes: VoI is the expected value of acting after seeing it minus the expected value of acting now, which is exactly zero when no result would flip the choice. Accuracy is beside the point — a perfect study you'd ignore is worth \\$0, while a noisy one that could reverse the decision can be worth a lot. Before paying for data (or waiting on it), ask what you would do differently.",
    ref: "Value of information (when it's zero)"
  },
  {
    id: "s0-7", type: "numeric", framing: "applied", difficulty: 3,
    prompt: "A team must decide now whether to launch a product. If the market is <b>good</b> (probability $0.5$) a launch nets +\\$80k; if <b>bad</b> (probability $0.5$) it nets -\\$40k. Not launching nets \\$0. A consultant offers a <b>perfect</b> market forecast before the decision. In \\$k, what is the most that forecast is worth (its value of information)?",
    answer: 20, tolerance: 0, unit: "",
    hint: "$\\text{VoI}=\\mathbb{E}[\\text{value}\\mid\\text{act after seeing it}]-\\mathbb{E}[\\text{value}\\mid\\text{act now}]$.",
    explanation: "Acting now, launching is best: $0.5(80)+0.5(-40)=+20$ beats the \\$0 of not launching. With the perfect forecast you launch only on \"good\": $0.5(80)+0.5(0)=40$. So VoI $=40-20=20$ (\\$k) — the ceiling on the consultant's fee, and it is positive precisely because a \"bad\" forecast would flip the action from launch to skip.",
    ref: "Value of information (computation)"
  },
  {
    id: "s0-8", type: "qc", framing: "applied", difficulty: 3,
    prompt: "Before a treat / don't-treat decision, a clinic weighs two diagnostic tests. Test 1 is imperfect, but some of its results would flip the optimal action to one with strictly better expected outcome. Test 2 is more accurate, but the guideline dictates the same action whatever its result shows. Compare their value of information.",
    quantityA: "VoI of Test 1 (imperfect, but its result can change the action)",
    quantityB: "VoI of Test 2 (more accurate, but no result changes the action)",
    answer: 0,
    explanation: "VoI is the expected gain from acting after seeing the result. Test 2's VoI is exactly \\$0 — however accurate it is, it can never change what you do — while Test 1's is strictly positive, since some results switch the action to one with better expected outcome. Information is valued by the decisions it changes, not by how precisely it measures; A is greater.",
    ref: "Value of information (can it change the action?)"
  }
];
