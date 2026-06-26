(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["stage0"] = {
  intro: "Before the math: a decision is a choice you make now whose payoff depends on things you don't fully control. Decision intelligence is the discipline of doing that well. This primer is your orientation — the decision-making lens, the problem types you'll meet, and the handful of objects that recur across the whole path. It's the map, not a test; there's no quiz.",
  concepts: [
    {
      title: "The decision-intelligence loop",
      tag: "mindset",
      body: "<p>Almost every applied problem in this path is one step in a single loop:</p>" +
        "<ul>" +
        "<li><b>Frame</b> — name the objective, the actions you can take, and the outcomes you can't control.</li>" +
        "<li><b>Model</b> — describe the uncertainty (probabilities) and how actions lead to outcomes.</li>" +
        "<li><b>Optimize</b> — pick the action that maximizes expected value or utility.</li>" +
        "<li><b>Act &amp; learn</b> — take the action, observe what happens, update the model.</li>" +
        "</ul>" +
        "<p>Prediction (most of machine learning) feeds the <i>model</i> step; optimization powers the <i>optimize</i> step; reinforcement learning is the whole loop run online.</p>",
      example: "A bank deciding on a loan: <i>frame</i> (approve / deny; payoff = repaid or default), <i>model</i> (a default-probability model), <i>optimize</i> (approve when expected profit &gt; 0), <i>learn</i> (feed repayment outcomes back in).",
      takeaway: "Most of this curriculum is tooling for one of these four moves. Holding the loop in mind tells you <i>why</i> a technique matters, not just how it works."
    },
    {
      title: "Which problem am I in?",
      tag: "typologies",
      body: "<p>Before reaching for a method, locate your problem on a few axes — each one narrows the toolkit:</p>" +
        "<ul>" +
        "<li><b>Learning signal</b> — supervised (labels) · unsupervised (structure) · self-supervised (labels manufactured from the data itself) · reinforcement (reward from acting). <i>Stages 1, 2, 5.</i></li>" +
        "<li><b>Output space</b> — regression (a number) vs classification (a category); this choice fixes your loss. <i>Stage 2.</i></li>" +
        "<li><b>Generative vs discriminative</b> — model the joint $p(x,y)$ vs just the boundary $p(y\\mid x)$. <i>Stage 2.</i></li>" +
        "<li><b>Parametric vs nonparametric</b> — fixed capacity vs capacity that grows with the data. <i>Stages 1–2.</i></li>" +
        "<li><b>Discrete vs continuous</b> — combinatorial search vs smooth, gradient-friendly optimization. <i>Stage 4.</i></li>" +
        "<li><b>Deterministic vs stochastic</b> — a fixed objective/dynamics vs noise and randomness. <i>Stages 4–5.</i></li>" +
        "<li><b>Exact vs approximate</b> — a solution with guarantees vs a heuristic that scales. <i>Stages 3–4.</i></li>" +
        "<li><b>Online vs offline (batch)</b> — learn or decide as data streams in vs from a fixed dataset. <i>Stages 3, 5.</i></li>" +
        "</ul>",
      example: "“Predict 30-day churn” → supervised, classification (so log-loss), discriminative, continuous-parameter, offline. Five labels placed before you pick a single model.",
      takeaway: "Naming the regime narrows the method space before you touch the math — and tells you which later stage to focus on."
    },
    {
      title: "Objects you'll meet everywhere",
      tag: "recurring",
      body: "<p>A handful of objects reappear under many names. Spotting them turns scattered topics into one toolkit:</p>" +
        "<ul>" +
        "<li><b>Gradient &amp; curvature</b> — the slope (and the Hessian's bend) behind almost every optimizer. <i>Stages 1, 4.</i></li>" +
        "<li><b>Convexity</b> — the divide between “every local optimum is global” and “no such guarantee.” <i>Stages 1, 4.</i></li>" +
        "<li><b>The Lagrangian</b> — one object behind <i>duality</i> and KKT, and the equivalence <b>constraint = penalty = prior = capacity control</b>. <i>Stages 1, 4.</i></li>" +
        "<li><b>Temperature</b> — the same $e^{\\text{score}/\\tau}$ knob in simulated annealing, Boltzmann exploration, and LLM sampling: high = explore, low = commit. <i>Stages 4–6.</i></li>" +
        "<li><b>Softmax</b> = a smooth, differentiable relaxation of $\\arg\\max$ = the Boltzmann distribution. <i>Stages 2, 6.</i></li>" +
        "<li><b>The Bellman equation</b> — the optimal-substructure recursion behind every sequential decision. <i>Stages 3, 5.</i></li>" +
        "<li><b>Backprop</b> = reverse-mode autodiff = the chain rule = credit assignment. <i>Stage 2.</i></li>" +
        "<li><b>Spectral decomposition</b> — eigen/SVD = PCA = low-rank compression. <i>Stages 1–2.</i></li>" +
        "<li><b>Value of information</b> = the value of exploration = expected reduction in loss. <i>Stages 0, 3, 5.</i></li>" +
        "<li><b>Saddle points</b> = minimax / Nash equilibria = the real obstacle in high dimensions. <i>Stages 2, 4–5.</i></li>" +
        "</ul>",
      example: "The “temperature” you meet in Stage 4 (annealing), Stage 5 (Boltzmann exploration), and Stage 6 (LLM decoding) is one idea — a single knob trading exploration for sharpness.",
      takeaway: "When a “new” idea looks familiar, it usually is. These aliases are the shortcuts that make the whole path cohere — watch for them."
    },
    {
      title: "Objectives, actions & outcomes",
      tag: "framing",
      body: "<p>A well-posed decision keeps three things separate:</p>" +
        "<ul>" +
        "<li><b>Actions</b> $a \\in A$ — what you control.</li>" +
        "<li><b>Outcomes / states</b> — what you don't, usually uncertain.</li>" +
        "<li><b>Objective</b> — a single number to maximize (profit, accuracy, lives saved), sometimes trading off several goals at once.</li>" +
        "</ul>" +
        "<p>Choosing the wrong objective is the costliest mistake in decision-making: the optimizer will give you exactly what you asked for. Beware the <b>proxy gap</b> — <b>Goodhart's law</b>: when you optimize a measurable stand-in for what you truly want, the optimizer exploits the gap, and the metric stops measuring what it did. The same failure shows up later as <i>overfitting</i> to a metric and <i>reward hacking</i> in RL — one idea, three names.</p>",
      example: "“Reduce churn” isn't an objective until you say <i>by what action, at what cost</i> — e.g. maximize expected retained revenue minus discount spend. Optimize “engagement” instead and you may just get rage-clicks: a proxy gap.",
      takeaway: "Half of decision quality is in the framing. An optimizer can only answer the question you actually pose — so pose the real one, not a convenient proxy."
    },
    {
      title: "Utility & expected utility",
      tag: "utility",
      body: "<p>To compare uncertain outcomes, map each to a <b>utility</b> $U(\\cdot)$, then choose the action with the highest <b>expected utility</b> $\\mathbb{E}[U]=\\sum_o p(o)\\,U(o)$.</p>" +
        "<p>Preferences can be <b>ordinal</b> (only the ranking of outcomes matters) or <b>cardinal</b> (the magnitudes matter, so expectations make sense); expected-utility theory needs cardinal utilities, unique up to a positive affine transform. Utility need not be linear in money: a <b>concave</b> $U$ encodes <b>risk aversion</b> — losing \\$1{,}000 hurts more than gaining \\$1{,}000 helps — which is why people buy insurance with negative expected cash value.</p>",
      example: "A sure \\$50 versus a 50/50 shot at \\$0 or \\$110. The gamble wins on expected <i>money</i> (\\$55), yet a risk-averse (concave-utility) decision-maker may still prefer the certain \\$50.",
      takeaway: "“Rational” means maximizing expected <i>utility</i>, not expected dollars. Your risk attitude lives in the curvature of $U$."
    },
    {
      title: "Value of information",
      tag: "information",
      body: "<p>Information is only worth gathering if it could <i>change</i> what you'd do. The <b>value of information</b> (VoI) is</p>" +
        "<p>$\\text{VoI}=\\mathbb{E}[\\text{value} \\mid \\text{act after seeing it}]-\\mathbb{E}[\\text{value} \\mid \\text{act now}].$</p>" +
        "<p>It's never negative (you can always ignore the info) and is exactly zero when the info wouldn't flip any choice. Pay for a test, survey, or experiment only up to its VoI. This is the same quantity that makes <i>exploration</i> worthwhile in bandits and RL, and that <i>active learning</i> uses to choose what to label.</p>",
      example: "A medical test has high VoI only if a positive vs negative result would lead to <i>different</i> treatment. If you'd treat the same either way, the test is worth \\$0 — however accurate it is.",
      takeaway: "Before collecting more data, ask whether it could change the action. If not, the information — and the delay to get it — is wasted."
    }
  ]
};
