(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["stage0"] = {
  intro: "Before the math: a decision is a choice you make now whose payoff depends on things you don't fully control. Decision intelligence is the discipline of doing that well — and the same few moves underlie every batch that follows. This is the lens, not a test; there's no quiz.",
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
      title: "Objectives, actions & outcomes",
      tag: "framing",
      body: "<p>A well-posed decision keeps three things separate:</p>" +
        "<ul>" +
        "<li><b>Actions</b> $a \\in A$ — what you control.</li>" +
        "<li><b>Outcomes / states</b> — what you don't, usually uncertain.</li>" +
        "<li><b>Objective</b> — a single number to maximize (profit, accuracy, lives saved), sometimes trading off several goals at once.</li>" +
        "</ul>" +
        "<p>Choosing the wrong objective is the costliest mistake in decision-making: the optimizer will give you exactly what you asked for.</p>",
      example: "“Reduce churn” isn't an objective until you say <i>by what action, at what cost</i> — e.g. maximize expected retained revenue minus discount spend.",
      takeaway: "Half of decision quality is in the framing. An optimizer can only answer the question you actually pose."
    },
    {
      title: "Utility & expected utility",
      tag: "utility",
      body: "<p>To compare uncertain outcomes, map each to a <b>utility</b> $U(\\cdot)$, then choose the action with the highest <b>expected utility</b> $\\mathbb{E}[U]=\\sum_o p(o)\\,U(o)$.</p>" +
        "<p>Utility need not be linear in money. A <b>concave</b> $U$ encodes <b>risk aversion</b> — losing \\$1{,}000 hurts more than gaining \\$1{,}000 helps — which is why people buy insurance that has negative expected cash value.</p>",
      example: "A sure \\$50 versus a 50/50 shot at \\$0 or \\$110. The gamble wins on expected <i>money</i> (\\$55), yet a risk-averse (concave-utility) decision-maker may still prefer the certain \\$50.",
      takeaway: "“Rational” means maximizing expected <i>utility</i>, not expected dollars. Your risk attitude lives in the curvature of $U$."
    },
    {
      title: "Value of information",
      tag: "information",
      body: "<p>Information is only worth gathering if it could <i>change</i> what you'd do. The <b>value of information</b> (VoI) is</p>" +
        "<p>$\\text{VoI}=\\mathbb{E}[\\text{value} \\mid \\text{act after seeing it}]-\\mathbb{E}[\\text{value} \\mid \\text{act now}].$</p>" +
        "<p>It's never negative (you can always ignore the info) and is exactly zero when the info wouldn't flip any choice. Pay for a test, survey, or experiment only up to its VoI.</p>",
      example: "A medical test has high VoI only if a positive vs negative result would lead to <i>different</i> treatment. If you'd treat the same either way, the test is worth \\$0 — however accurate it is.",
      takeaway: "Before collecting more data, ask whether it could change the action. If not, the information — and the delay to get it — is wasted."
    }
  ]
};
