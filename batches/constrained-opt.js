/* Batch: Constrained Optimization  (Optimization Fundamentals §S8; Book I Ch 10–14) */
(window.QUIZ_BATCHES = window.QUIZ_BATCHES || {})["constrained-opt"] = [
  {
    id: "co-1", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "For the problem $\\min f(\\mathbf{x})$ subject to $\\mathbf{g}(\\mathbf{x})\\le\\mathbf{0}$ and $\\mathbf{h}(\\mathbf{x})=\\mathbf{0}$, what is the <b>Lagrangian</b> $\\mathcal{L}(\\mathbf{x},\\boldsymbol\\mu,\\boldsymbol\\lambda)$?",
    options: [
      "$f(\\mathbf{x})+\\boldsymbol\\mu^\\top\\mathbf{g}(\\mathbf{x})+\\boldsymbol\\lambda^\\top\\mathbf{h}(\\mathbf{x})$",
      "$f(\\mathbf{x})-\\boldsymbol\\mu^\\top\\mathbf{g}(\\mathbf{x})-\\boldsymbol\\lambda^\\top\\mathbf{h}(\\mathbf{x})$",
      "$\\boldsymbol\\mu^\\top\\mathbf{g}(\\mathbf{x})+\\boldsymbol\\lambda^\\top\\mathbf{h}(\\mathbf{x})$",
      "$f(\\mathbf{x})+\\boldsymbol\\mu^\\top\\mathbf{g}(\\mathbf{x})\\,\\boldsymbol\\lambda^\\top\\mathbf{h}(\\mathbf{x})$"
    ],
    answer: 0,
    explanation: "The Lagrangian adds each constraint to the objective scaled by its multiplier: $\\mathcal{L}=f(\\mathbf{x})+\\boldsymbol\\mu^\\top\\mathbf{g}(\\mathbf{x})+\\boldsymbol\\lambda^\\top\\mathbf{h}(\\mathbf{x})$, where $\\boldsymbol\\mu$ multiplies the inequality constraints and $\\boldsymbol\\lambda$ the equality constraints.",
    ref: "§S8 — Lagrangian duality & KKT"
  },
  {
    id: "co-2", type: "mc", framing: "conceptual", difficulty: 1,
    prompt: "In <b>linear programming</b> the objective and constraints are linear. What is the shape of the feasible set, and where does the optimum lie?",
    options: [
      "A convex polytope; the optimum is attainable at a vertex",
      "A convex polytope; the optimum is always at its center",
      "A nonconvex region; the optimum is at an interior point",
      "An ellipsoid; the optimum is on its boundary"
    ],
    answer: 0,
    explanation: "Linear objective + linear constraints make the feasible set a convex polytope, and an optimum is attainable at a <i>vertex</i>. This is exactly why the simplex algorithm searches by walking from vertex to vertex.",
    ref: "Opt Ch 12 — Linear Programming"
  },
  {
    id: "co-3", type: "numeric", framing: "applied", difficulty: 2,
    prompt: "A <b>primal-dual interior-point</b> method is applied to a problem with $m=20$ inequality constraints, using barrier parameter $\\rho=500$. The log-barrier gives a duality gap of $m/\\rho$. What is the duality gap?",
    answer: 0.04, tolerance: 0.001, unit: "",
    hint: "Duality gap $=m/\\rho$.",
    explanation: "With $m$ inequality constraints, the log-barrier yields a duality gap of $m/\\rho=20/500=0.04$. Increasing $\\rho$ shrinks the gap, driving the iterates toward the true optimum.",
    ref: "Opt Ch 11 — Duality (primal-dual interior point)"
  },
  {
    id: "co-4", type: "mc", framing: "applied", difficulty: 2,
    prompt: "A common way to handle an inequality constraint $g(\\mathbf{x})\\le 0$ is to introduce a <b>slack variable</b> $s$. Which reformulation is used?",
    options: [
      "Replace $g\\le 0$ with $g+s=0$ and $s\\ge 0$",
      "Replace $g\\le 0$ with $g-s=0$ and $s\\le 0$",
      "Replace $g\\le 0$ with $g\\cdot s=0$ and $s$ free",
      "Replace $g\\le 0$ with $g+s\\le 0$ and $s$ free"
    ],
    answer: 0,
    explanation: "A slack variable converts the inequality $g\\le 0$ into an equality $g+s=0$ together with the nonnegativity constraint $s\\ge 0$. The nonnegative slack absorbs the difference, turning the inequality into an equality the solver can treat directly.",
    ref: "Opt Ch 10 — Constraints (slack variables)"
  },
  {
    id: "co-5", type: "mc", framing: "conceptual", difficulty: 3,
    prompt: "By <b>complementary slackness</b>, suppose an inequality constraint is <i>inactive</i> at the solution, i.e. $g_i(\\mathbf{x}^*)<0$. What must its multiplier $\\mu_i$ equal?",
    options: [
      "$\\mu_i=0$",
      "$\\mu_i>0$",
      "$\\mu_i=-g_i(\\mathbf{x}^*)$",
      "$\\mu_i$ is unconstrained in sign"
    ],
    answer: 0,
    explanation: "Complementary slackness requires $\\boldsymbol\\mu\\odot\\mathbf{g}=\\mathbf{0}$: for each $i$, either the constraint is active ($g_i=0$) or its multiplier is zero. Since $g_i(\\mathbf{x}^*)<0$ here, the constraint is inactive and so $\\mu_i=0$.",
    ref: "§S8 — Lagrangian duality & KKT"
  },
  {
    id: "co-6", type: "qc", framing: "conceptual", difficulty: 3,
    prompt: "For a constrained minimization problem with a <b>nonzero duality gap</b>, compare the optimal primal value $p^*$ and the optimal dual value $d^*$.",
    quantityA: "$p^*$ (optimal primal value)",
    quantityB: "$d^*$ (optimal dual value)",
    answer: 0,
    explanation: "Weak duality always holds: $d^*\\le p^*$ (the dual lower-bounds the primal). With a <i>nonzero</i> duality gap $p^*-d^*>0$ the inequality is strict, so the primal value (A) is strictly greater than the dual value (B). The gap closes to zero only under strong duality (a convex problem satisfying Slater's condition) — so without a gap the two could instead be equal.",
    ref: "§S8 — Lagrangian duality & KKT (weak duality)"
  },
  {
    id: "co-7", type: "ms", framing: "conceptual", difficulty: 4,
    prompt: "Select <b>every</b> condition that belongs to the <b>KKT first-order necessary conditions</b> for $\\min f$ s.t. $\\mathbf{g}\\le\\mathbf{0}$, $\\mathbf{h}=\\mathbf{0}$.",
    options: [
      "Primal feasibility: $\\mathbf{g}\\le\\mathbf{0}$ and $\\mathbf{h}=\\mathbf{0}$",
      "Dual feasibility: $\\boldsymbol\\mu\\ge\\mathbf{0}$",
      "Complementary slackness: $\\boldsymbol\\mu\\odot\\mathbf{g}=\\mathbf{0}$",
      "Stationarity: $\\nabla f+\\sum_i\\mu_i\\nabla g_i+\\sum_j\\lambda_j\\nabla h_j=\\mathbf{0}$",
      "Sign restriction $\\boldsymbol\\lambda\\ge\\mathbf{0}$ on the equality multipliers"
    ],
    answer: [0, 1, 2, 3],
    explanation: "The four KKT conditions are primal feasibility, dual feasibility ($\\boldsymbol\\mu\\ge\\mathbf{0}$), complementary slackness ($\\boldsymbol\\mu\\odot\\mathbf{g}=\\mathbf{0}$), and stationarity. The equality multipliers $\\boldsymbol\\lambda$ are <i>sign-free</i>, so requiring $\\boldsymbol\\lambda\\ge\\mathbf{0}$ is not a KKT condition.",
    ref: "§S8 — Lagrangian duality & KKT"
  },
  {
    id: "co-8", type: "numeric", framing: "applied", difficulty: 4,
    prompt: "Using a <b>quadratic penalty</b> $\\sum_i\\max(g_i(\\mathbf{x}),0)^2+\\sum_j h_j(\\mathbf{x})^2$, evaluate the penalty at a point with inequality values $\\mathbf{g}=(-3,\\,2)$ (constraints $g\\le 0$) and equality value $\\mathbf{h}=(4)$. What is the total penalty?",
    answer: 20, tolerance: 0, unit: "",
    hint: "Only positive (violated) $g_i$ contribute; every $h_j$ contributes its square.",
    explanation: "The quadratic penalty is $\\sum_i\\max(g_i,0)^2+\\sum_j h_j^2$. Here $\\max(-3,0)^2=0$ (satisfied), $\\max(2,0)^2=4$ (violated), and $h^2=4^2=16$. Total $=0+4+16=20$.",
    ref: "Opt Ch 10 — Constraints (penalty methods)"
  },
  {
    id: "co-9", type: "ms", framing: "conceptual", difficulty: 5,
    prompt: "Select <b>every</b> true statement about <b>duality-based algorithms</b> and the dual function.",
    options: [
      "The dual function $\\mathcal{D}=\\min_\\mathbf{x}\\mathcal{L}$ is concave",
      "Dual ascent alternates an $\\mathbf{x}$-minimization with dual gradient ascent and can fail for linear objectives",
      "ADMM splits $\\min f_1(\\mathbf{x}_1)+f_2(\\mathbf{x}_2)$ s.t. $\\mathbf{A}_1\\mathbf{x}_1+\\mathbf{A}_2\\mathbf{x}_2=\\mathbf{b}$ and scales to distributed/consensus problems",
      "A primal/dual feasible pair with equal objective is an optimality certificate",
      "Dual ascent requires every iterate to remain strictly feasible"
    ],
    answer: [0, 1, 2, 3],
    explanation: "The dual function $\\mathcal{D}=\\min_\\mathbf{x}\\mathcal{L}$ is always concave; dual ascent alternates $\\mathbf{x}$-minimization with dual gradient ascent and <i>tolerates infeasible iterates</i> (so option 5 is false), though it can fail for linear objectives. ADMM splits a separable objective under an affine coupling and scales to distributed/consensus settings. A primal/dual feasible pair with equal objective certifies optimality.",
    ref: "§S8 / Opt Ch 11 — Duality"
  },
  {
    id: "co-10", type: "mc", framing: "conceptual", difficulty: 5,
    prompt: "In <b>disciplined convex programming</b>, the composition $f(g(\\mathbf{x}))$ is certified <b>convex</b> under which pair of rules?",
    options: [
      "$f$ convex nondecreasing with $g$ convex, OR $f$ convex nonincreasing with $g$ concave",
      "$f$ convex nondecreasing with $g$ concave, OR $f$ convex nonincreasing with $g$ convex",
      "$f$ concave nondecreasing with $g$ convex, OR $f$ concave nonincreasing with $g$ concave",
      "$f$ affine with $g$ affine only"
    ],
    answer: 0,
    explanation: "DCP's composition rule certifies $f(g(\\mathbf{x}))$ convex if [$f$ convex nondecreasing and $g$ convex] or [$f$ convex nonincreasing and $g$ concave] (and can be inconclusive otherwise). The curvature is propagated by sign and composition rules over an atom library so software can verify convexity before transcribing to a solver.",
    ref: "Opt Ch 14 — Disciplined Convex Programming"
  }
];
