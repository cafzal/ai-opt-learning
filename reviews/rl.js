/* Review: Reinforcement Learning */
(window.QUIZ_REVIEWS = window.QUIZ_REVIEWS || {})["rl"] = {
  intro: "Reinforcement learning is learning by trial-and-error from <i>evaluative</i> feedback under delayed consequences. The agent never sees the right action — only a scalar reward — so it must estimate <b>value functions</b> to guide behavior and balance <b>exploration vs exploitation</b>. These toggles build the spine: the MDP and the return, the Bellman equations, the DP / Monte&nbsp;Carlo / TD spectrum, the on- vs off-policy split, the deadly triad, policy gradients, and the dopamine link. Skim them, then test yourself below.",
  concepts: [
    {
      title: "The agent–environment loop & evaluative feedback",
      tag: "core",
      body: "<p>At each step the <b>agent</b> in state $s_t$ takes an action $a_t\\sim\\pi(a\\mid s)$; the <b>environment</b> returns a reward $r_{t+1}$ and a next state $s_{t+1}$. Learning is by <b>trial and error</b> under two pressures absent from supervised learning:</p><ul><li><b>Delayed consequences</b> — an action's payoff may arrive many steps later (hard <i>credit assignment</i>).</li><li><b>Exploration vs exploitation</b> — act to earn reward now, or to learn for later?</li></ul><p>Crucially the signal is <b>evaluative</b> (how good <i>was</i> the action you took) not <b>instructive</b> (what the right action <i>would have been</i>). The core problem is to efficiently estimate <b>value functions</b> that guide action.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <rect x="55" y="70" width="140" height="56" rx="8" class="vx-accent" fill="none" stroke-width="2"/>
        <text x="125" y="103" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--accent)">Agent</text>
        <text x="125" y="146" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">policy π(a | s)</text>
        <rect x="325" y="70" width="140" height="56" rx="8" class="vx-axis" fill="none" stroke-width="2"/>
        <text x="395" y="103" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--text)">Environment</text>
        <text x="395" y="146" text-anchor="middle" font-size="10.5" style="fill:var(--text-faint)">dynamics p(s', r | s, a)</text>
        <defs>
          <marker id="rlArr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" style="fill:var(--accent)"/></marker>
          <marker id="rlArr2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" style="fill:var(--good)"/></marker>
        </defs>
        <path d="M195,84 C250,60 270,60 325,84" fill="none" class="vx-accent" stroke-width="2" marker-end="url(#rlArr)"/>
        <text x="260" y="48" text-anchor="middle" font-size="12" style="fill:var(--accent)">action aₜ</text>
        <path d="M325,112 C270,138 250,138 195,112" fill="none" class="vx-good" stroke-width="2" marker-end="url(#rlArr2)"/>
        <text x="260" y="160" text-anchor="middle" font-size="12" style="fill:var(--good)">reward rₜ₊₁, state sₜ₊₁</text>
        <text x="260" y="22" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">The interaction loop</text>
      </svg>`,
      caption: "Action flows out; reward and next state flow back — a closed loop, not a fixed labeled dataset.",
      example: "An agent learning a game sees only win/lose (or score deltas), never the textbook move for each position. A losing move ten turns ago must be blamed from a single late reward — that is the credit-assignment problem evaluative feedback creates.",
      takeaway: "If your problem gives you correct labels per step, use supervised learning — reach for RL only when feedback is evaluative and consequences are delayed."
    },
    {
      title: "MDPs, the return & value functions",
      tag: "core",
      body: "<p>RL is formalized as a <b>Markov Decision Process</b> $(\\mathcal{S},\\mathcal{A},p,\\gamma)$ with dynamics $p(s',r\\mid s,a)$. The agent maximizes the expected <b>return</b> — the discounted sum of future rewards:</p><p>$$G_t=\\sum_{k\\ge0}\\gamma^k r_{t+k+1},\\qquad G_t=r_{t+1}+\\gamma G_{t+1}$$</p><p>The discount $\\gamma\\in[0,1)$ trades present against future: $\\gamma\\to0$ is myopic, $\\gamma\\to1$ is far-sighted (and keeps the infinite sum finite). <b>Value functions</b> are the expected return <i>under a policy</i> $\\pi$:</p><p>$$v_\\pi(s)=\\mathbb{E}_\\pi[G_t\\mid s],\\qquad q_\\pi(s,a)=\\mathbb{E}_\\pi[G_t\\mid s,a]$$</p><p>$v_\\pi$ scores a state; $q_\\pi$ scores a state–action pair (the <i>action-value</i>).</p>",
      visual: `<svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700" style="fill:var(--text)">Discounting future rewards: weight γᵏ on rₜ₊ₖ₊₁</text>
        <line x1="50" y1="150" x2="500" y2="150" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="180" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">steps into the future k →</text>
        <g font-size="10" style="fill:var(--text-faint)">
          <rect x="70"  y="60"  width="34" height="90" rx="2" style="fill:var(--accent)"/><text x="87" y="50" text-anchor="middle">1.0</text>
          <rect x="130" y="78"  width="34" height="72" rx="2" style="fill:var(--accent)"/><text x="147" y="68" text-anchor="middle">0.8</text>
          <rect x="190" y="93"  width="34" height="57" rx="2" style="fill:var(--accent)"/><text x="207" y="83" text-anchor="middle">0.64</text>
          <rect x="250" y="104" width="34" height="46" rx="2" style="fill:var(--accent)"/><text x="267" y="94" text-anchor="middle">0.51</text>
          <rect x="310" y="113" width="34" height="37" rx="2" style="fill:var(--accent)"/><text x="327" y="103" text-anchor="middle">0.41</text>
          <rect x="370" y="120" width="34" height="30" rx="2" style="fill:var(--accent)"/><text x="387" y="110" text-anchor="middle">0.33</text>
          <rect x="430" y="126" width="34" height="24" rx="2" style="fill:var(--accent)"/><text x="447" y="116" text-anchor="middle">0.26</text>
        </g>
        <text x="490" y="145" text-anchor="end" font-size="10.5" style="fill:var(--text-dim)">γ = 0.8</text>
      </svg>`,
      caption: "Each step further out is discounted by another factor of γ — distant rewards count for less and the sum stays finite.",
      example: "With $\\gamma=0.9$ and a single reward of $+10$ received four steps from now, its contribution to the return today is $0.9^3\\times10\\approx7.3$. Lower $\\gamma$ makes the agent grab nearer rewards even if larger ones lie further ahead.",
      takeaway: "$\\gamma$ is a planning-horizon knob you tune, not a given: set it too low and the agent gets myopic, too close to 1 and learning slows and credit smears across time."
    },
    {
      title: "Bellman expectation vs Bellman optimality",
      tag: "core",
      body: "<p>Value functions satisfy recursive consistency equations. The <b>Bellman expectation</b> equation averages over the policy's action choices:</p><p>$$v_\\pi(s)=\\sum_a\\pi(a\\mid s)\\sum_{s',r}p(s',r\\mid s,a)\\,[\\,r+\\gamma v_\\pi(s')\\,]$$</p><p>The <b>optimal</b> values obey the <b>Bellman optimality</b> equation — the policy-average is replaced by a $\\max$ over actions:</p><p>$$v_*(s)=\\max_a\\sum_{s',r}p(s',r\\mid s,a)\\,[\\,r+\\gamma v_*(s')\\,]$$</p><p>$$q_*(s,a)=\\sum_{s',r}p(s',r\\mid s,a)\\,[\\,r+\\gamma\\,\\textstyle\\max_{a'}q_*(s',a')\\,]$$</p><p>The payoff: given $q_*$ the optimal policy is <b>greedy and model-free</b>, $\\pi_*(s)=\\arg\\max_a q_*(s,a)$ — no need to know $p$ at decision time.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">Expectation: average over π</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--accent)">Optimality: max over a</text>
        <circle cx="135" cy="55" r="8" style="fill:var(--text)"/><text x="135" y="59" text-anchor="middle" font-size="9" style="fill:var(--bg-elev2)">s</text>
        <line x1="135" y1="63" x2="75" y2="115" class="vx-grid" stroke-width="1.5"/>
        <line x1="135" y1="63" x2="135" y2="115" class="vx-grid" stroke-width="1.5"/>
        <line x1="135" y1="63" x2="195" y2="115" class="vx-grid" stroke-width="1.5"/>
        <circle cx="75" cy="125" r="6" style="fill:var(--text-dim)"/><circle cx="135" cy="125" r="6" style="fill:var(--text-dim)"/><circle cx="195" cy="125" r="6" style="fill:var(--text-dim)"/>
        <text x="135" y="160" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">weight each by π(a | s)</text>
        <text x="135" y="178" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">then sum</text>
        <circle cx="390" cy="55" r="8" style="fill:var(--accent)"/><text x="390" y="59" text-anchor="middle" font-size="9" style="fill:var(--bg-elev2)">s</text>
        <line x1="390" y1="63" x2="330" y2="115" class="vx-grid" stroke-width="1.5"/>
        <line x1="390" y1="63" x2="390" y2="115" class="vx-accent" stroke-width="2.5"/>
        <line x1="390" y1="63" x2="450" y2="115" class="vx-grid" stroke-width="1.5"/>
        <circle cx="330" cy="125" r="6" style="fill:var(--text-faint)"/><circle cx="390" cy="125" r="6" style="fill:var(--accent)"/><circle cx="450" cy="125" r="6" style="fill:var(--text-faint)"/>
        <text x="390" y="160" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">keep the single best</text>
        <text x="390" y="178" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">action arc</text>
      </svg>`,
      caption: "Same backup tree; expectation averages the action branches by π, optimality keeps only the best (arg max).",
      example: "In a gridworld, $v_\\pi$ under a random walk averages the value of every direction. $v_*$ instead commits to the single direction with highest backed-up value — the $\\max$ is what turns evaluation into optimization.",
      takeaway: "Learn $q_*$ and you can act optimally by a cheap $\\arg\\max$ with no model of $p$ at decision time — that model-free greediness is why action-values dominate practical control."
    },
    {
      title: "Generalized policy iteration (GPI)",
      tag: "intuition",
      body: "<p>Almost every RL method is an instance of <b>generalized policy iteration</b>: two interacting processes run together until they agree.</p><ul><li><b>Policy evaluation</b> — make the value function $v$ consistent with the current policy $\\pi$.</li><li><b>Policy improvement</b> — make $\\pi$ greedy with respect to the current $v$.</li></ul><p>Each step partly undoes the other (a freshly improved policy makes $v$ stale; a freshly evaluated $v$ invites further improvement), yet together they converge to the joint fixed point $v_*,\\pi_*$ where the policy is greedy for its own value and the value is correct for that policy. DP, Monte&nbsp;Carlo, and TD all differ only in <i>how</i> they perform the evaluation step.</p>",
      visual: `<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="260" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">Two processes chasing a shared fixed point</text>
        <line x1="120" y1="170" x2="430" y2="60" class="vx-grid" stroke-width="1.5" stroke-dasharray="5 4"/>
        <text x="438" y="58" font-size="10.5" style="fill:var(--text-faint)">v greedy</text>
        <text x="438" y="70" font-size="10.5" style="fill:var(--text-faint)">w.r.t. π</text>
        <line x1="120" y1="170" x2="430" y2="170" class="vx-grid" stroke-width="1.5"/>
        <text x="120" y="190" font-size="10.5" style="fill:var(--text-faint)">v = vπ (evaluation line)</text>
        <polyline points="120,170 120,120 235,120 235,92 320,92 320,78 380,78 380,70 415,70" fill="none" class="vx-accent" stroke-width="2"/>
        <circle cx="120" cy="170" r="4" style="fill:var(--accent)"/>
        <circle cx="415" cy="70" r="5" style="fill:var(--good)"/>
        <text x="118" y="120" text-anchor="end" font-size="10.5" style="fill:var(--accent)">evaluate ↑</text>
        <text x="240" y="116" font-size="10.5" style="fill:var(--accent)">improve →</text>
        <text x="420" y="64" font-size="11" font-weight="700" style="fill:var(--good)">v*, π*</text>
        <text x="118" y="184" text-anchor="end" font-size="10.5" style="fill:var(--accent)">start</text>
      </svg>`,
      caption: "Evaluation pulls toward the v = vπ line, improvement toward the greedy line; the staircase meets at v*, π*.",
      example: "Policy iteration takes big steps (evaluate $\\pi$ to convergence, then improve); value iteration takes one sweep of each before switching. Both are GPI — only the granularity of the alternation differs.",
      takeaway: "GPI is the mental template for debugging any RL algorithm: ask whether evaluation and improvement are each making progress, since stalling one stalls convergence."
    },
    {
      title: "The DP / Monte Carlo / TD spectrum & the TD error",
      tag: "core",
      body: "<p>Tabular methods span two axes of <b>backup</b>: its <b>width</b> (sample one transition vs sweep all of them, full/expected) and its <b>depth</b> (bootstrap after one step vs wait for the full-episode return).</p><table><tr><th>Method</th><th>Model?</th><th>Bootstrap?</th><th>Backup</th></tr><tr><td><b>Dynamic programming</b></td><td>yes</td><td>yes</td><td>full / expected</td></tr><tr><td><b>Monte&nbsp;Carlo</b></td><td>no</td><td>no</td><td>sample, full return</td></tr><tr><td><b>Temporal-difference</b></td><td>no</td><td>yes</td><td>sample, one-step</td></tr></table><p><b>TD is the central idea</b> — it fuses Monte&nbsp;Carlo's <i>sampling</i> with DP's <i>bootstrapping</i>, learning online from the <b>TD error</b>:</p><p>$$\\delta_t=r_{t+1}+\\gamma V(s_{t+1})-V(s_t)$$</p><p>$\\delta_t$ is the surprise: realized one-step target minus current estimate. Update toward it: $V(s_t)\\mathrel{+}{=}\\alpha\\delta_t$.</p>",
      visual: `<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img">
        <line x1="70" y1="210" x2="500" y2="210" class="vx-axis" stroke-width="1.5"/>
        <line x1="70" y1="210" x2="70" y2="30" class="vx-axis" stroke-width="1.5"/>
        <text x="285" y="240" text-anchor="middle" font-size="12" style="fill:var(--text-dim)">backup WIDTH: sample ← → full / expected</text>
        <text x="24" y="120" font-size="12" transform="rotate(-90 24 120)" text-anchor="middle" style="fill:var(--text-dim)">DEPTH: full return ← → one-step</text>
        <circle cx="150" cy="70" r="9" style="fill:var(--good)"/>
        <text x="150" y="50" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--good)">TD</text>
        <text x="150" y="92" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">sample · 1-step</text>
        <circle cx="150" cy="180" r="9" style="fill:var(--accent)"/>
        <text x="150" y="200" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">sample · full</text>
        <text x="150" y="162" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--accent)">Monte Carlo</text>
        <circle cx="420" cy="70" r="9" style="fill:var(--warn)"/>
        <text x="420" y="50" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--warn)">DP</text>
        <text x="420" y="92" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">full · 1-step</text>
        <line x1="150" y1="90" x2="150" y2="160" class="vx-grid" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="305" y="186" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">(exhaustive search = full · full)</text>
        <circle cx="420" cy="180" r="5" class="vx-grid" fill="none" stroke-width="1.5"/>
      </svg>`,
      caption: "Two axes: TD samples and bootstraps one step; MC samples a full episode; DP does full-width one-step backups.",
      example: "After a transition $s\\to s'$ with reward $1$, $\\gamma=0.9$, $V(s)=5$, $V(s')=6$: $\\delta=1+0.9\\cdot6-5=1.4$. With $\\alpha=0.1$, $V(s)$ rises to $5.14$ — learned from one step, no episode end required.",
      takeaway: "TD lets you learn online from incomplete, non-terminating episodes — essential whenever waiting for an episode's end (or having a model) is impractical."
    },
    {
      title: "Sarsa vs Q-learning vs Double Q-learning",
      tag: "algorithm",
      body: "<p>The two canonical TD control methods differ only in the action that defines the <b>target</b>:</p><ul><li><b>Sarsa</b> (<i>on-policy</i>): target $r+\\gamma Q(s',a')$ uses the action $a'$ <i>actually taken</i> next — so it evaluates the policy it follows ($\\varepsilon$-greedy and all). It learns <b>safe</b> behavior that accounts for exploratory missteps.</li><li><b>Q-learning</b> (<i>off-policy</i>): target $r+\\gamma\\max_{a'}Q(s',a')$ uses the <i>greedy</i> next action — so it learns $q_*$ regardless of the (exploratory) behavior policy.</li></ul><p><b>Expected Sarsa</b> averages the target over $a'\\sim\\pi$ (lower variance). The $\\max$ in Q-learning is optimistic — it overestimates because the same values pick <i>and</i> evaluate the best action; <b>Double Q-learning</b> removes this bias by learning two value tables and using one to select, the other to evaluate.</p>",
      visual: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="135" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--good)">Sarsa (on-policy)</text>
        <text x="390" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--accent)">Q-learning (off-policy)</text>
        <circle cx="135" cy="50" r="7" style="fill:var(--good)"/><text x="135" y="54" text-anchor="middle" font-size="8.5" style="fill:var(--bg-elev2)">s'</text>
        <line x1="135" y1="57" x2="85" y2="110" class="vx-grid" stroke-width="1.5"/>
        <line x1="135" y1="57" x2="135" y2="110" class="vx-good" stroke-width="2.5"/>
        <line x1="135" y1="57" x2="185" y2="110" class="vx-grid" stroke-width="1.5"/>
        <circle cx="85" cy="120" r="5" style="fill:var(--text-faint)"/><circle cx="135" cy="120" r="6" style="fill:var(--good)"/><circle cx="185" cy="120" r="5" style="fill:var(--text-faint)"/>
        <text x="135" y="155" text-anchor="middle" font-size="10.5" style="fill:var(--good)">a' = action actually taken</text>
        <text x="135" y="172" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">target r + γ Q(s', a')</text>
        <circle cx="390" cy="50" r="7" style="fill:var(--accent)"/><text x="390" y="54" text-anchor="middle" font-size="8.5" style="fill:var(--bg-elev2)">s'</text>
        <line x1="390" y1="57" x2="340" y2="110" class="vx-grid" stroke-width="1.5"/>
        <line x1="390" y1="57" x2="390" y2="110" class="vx-grid" stroke-width="1.5"/>
        <line x1="390" y1="57" x2="440" y2="110" class="vx-accent" stroke-width="2.5"/>
        <circle cx="340" cy="120" r="5" style="fill:var(--text-faint)"/><circle cx="390" cy="120" r="5" style="fill:var(--text-faint)"/><circle cx="440" cy="120" r="6" style="fill:var(--accent)"/>
        <text x="390" y="155" text-anchor="middle" font-size="10.5" style="fill:var(--accent)">arg maxₐ' = greedy action</text>
        <text x="390" y="172" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">target r + γ maxₐ' Q(s', a')</text>
      </svg>`,
      caption: "Sarsa backs up the action its policy will really take; Q-learning backs up the greedy action regardless of behavior.",
      example: "On the cliff-walking task, Q-learning learns the optimal path right along the cliff edge but, while still exploring $\\varepsilon$-greedily, occasionally falls in. Sarsa learns a safer path a row back — it bakes the exploration risk into its values.",
      takeaway: "Choose Sarsa when exploration mistakes are costly during learning (real robots, live systems) and Q-learning when you only care about the final greedy policy; reach for Double-Q whenever overestimation stalls progress."
    },
    {
      title: "n-step returns & eligibility traces / TD(λ)",
      tag: "algorithm",
      body: "<p>TD(0) and Monte&nbsp;Carlo are the two ends of a depth continuum. The <b>n-step return</b> bootstraps after $n$ real rewards:</p><p>$$G_{t:t+n}=r_{t+1}+\\cdots+\\gamma^{n-1}r_{t+n}+\\gamma^n V(s_{t+n})$$</p><p>$n{=}1$ is TD(0); $n{\\to}\\infty$ is MC; an intermediate $n$ usually wins. <b>Eligibility traces / TD(λ)</b> get the same continuum <i>online and cheaply</i>. The <b>λ-return</b> $G_t^\\lambda=(1-\\lambda)\\sum_n\\lambda^{n-1}G_{t:t+n}$ (forward view) is realized by a decaying <b>trace</b> $\\mathbf{z}_t=\\gamma\\lambda\\mathbf{z}_{t-1}+\\nabla\\hat v$ with update $\\mathbf{w}\\mathrel{+}{=}\\alpha\\delta_t\\mathbf{z}_t$ (backward view) — each TD error is \"shouted\" back along the recently visited states. <b>True online TD(λ)</b> makes the two views exactly equal.</p>",
      visual: `<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="10" y="20" font-size="12" font-weight="700" style="fill:var(--text)">λ-return weights: (1−λ)λⁿ⁻¹ across n-step returns</text>
        <line x1="55" y1="135" x2="500" y2="135" class="vx-axis" stroke-width="1.5"/>
        <text x="275" y="165" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">n-step return used →</text>
        <g style="fill:var(--accent)">
          <rect x="80"  y="55"  width="30" height="80" rx="2"/>
          <rect x="135" y="79"  width="30" height="56" rx="2"/>
          <rect x="190" y="96"  width="30" height="39" rx="2"/>
          <rect x="245" y="107" width="30" height="28" rx="2"/>
          <rect x="300" y="115" width="30" height="20" rx="2"/>
          <rect x="355" y="121" width="30" height="14" rx="2"/>
        </g>
        <g font-size="9.5" style="fill:var(--text-faint)" text-anchor="middle">
          <text x="95" y="48">n=1</text><text x="150" y="72">2</text><text x="205" y="89">3</text><text x="260" y="100">4</text><text x="315" y="108">5</text><text x="370" y="114">6</text>
        </g>
        <text x="95" y="151" text-anchor="middle" font-size="9.5" style="fill:var(--good)">TD(0)</text>
        <text x="450" y="100" font-size="10.5" style="fill:var(--text-dim)">λ = 0.7</text>
        <text x="450" y="116" font-size="10.5" style="fill:var(--text-faint)">geometric decay</text>
      </svg>`,
      caption: "TD(λ) is a geometric (1−λ)λⁿ⁻¹ blend of every n-step return — one cheap trace, the whole depth spectrum.",
      example: "TD-Gammon learned world-class backgammon with TD(λ) and a neural net from self-play. With $\\lambda=0$ it is plain TD(0); $\\lambda=1$ recovers Monte&nbsp;Carlo; intermediate $\\lambda$ propagates credit several moves back per step.",
      takeaway: "Tuning $\\lambda$ (or $n$) buys faster credit propagation than one-step TD without Monte&nbsp;Carlo's variance — often the cheapest single lever for speeding up learning."
    },
    {
      title: "Function approximation & the deadly triad",
      tag: "pitfall",
      body: "<p>For large or continuous state spaces we approximate $\\hat v(s,\\mathbf{w})$ (tile coding, Fourier/RBF features, or neural nets) and update by <b>semi-gradient</b> methods $\\mathbf{w}\\mathrel{+}{=}\\alpha\\delta_t\\nabla\\hat v$ — the bootstrapped target is <i>not</i> differentiated, so it is not true SGD. <b>DQN</b> = Q-learning + CNN + experience replay + target network.</p><p>⚠️ <b>The deadly triad</b> — <b>function approximation + bootstrapping + off-policy</b> training together — can <b>diverge</b> (<b>Baird's counterexample</b>: weights $\\to\\infty$ even with linear features and exact expected updates). The reassuring half: <b>any two</b> of the three are safe. Semi-gradient TD converges to the <b>projected Bellman error</b> fixed point ($\\overline{PBE}{=}0$), not the minimum-$\\overline{VE}$ solution. Stable off-policy fixes: <b>gradient-TD</b> (true SGD on $\\overline{PBE}$) and <b>emphatic-TD</b> (reweight to restore an on-policy distribution).</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="260" y="22" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">All three corners → divergence; any two → safe</text>
        <polygon points="260,50 95,185 425,185" fill="none" class="vx-bad" stroke-width="2"/>
        <circle cx="260" cy="50" r="6" style="fill:var(--bad)"/>
        <circle cx="95" cy="185" r="6" style="fill:var(--bad)"/>
        <circle cx="425" cy="185" r="6" style="fill:var(--bad)"/>
        <text x="260" y="42" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--bad)">function approximation</text>
        <text x="80" y="205" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--bad)">bootstrapping</text>
        <text x="440" y="205" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--bad)">off-policy</text>
        <text x="260" y="135" text-anchor="middle" font-size="11" style="fill:var(--warn)">⚠ all three together</text>
        <text x="260" y="153" text-anchor="middle" font-size="11" style="fill:var(--warn)">can diverge (Baird)</text>
        <text x="178" y="112" text-anchor="middle" font-size="9.5" style="fill:var(--good)" transform="rotate(-39 178 112)">drop one → safe</text>
        <text x="343" y="112" text-anchor="middle" font-size="9.5" style="fill:var(--good)" transform="rotate(39 343 112)">drop one → safe</text>
        <text x="260" y="200" text-anchor="middle" font-size="9.5" style="fill:var(--good)">drop one → safe</text>
      </svg>`,
      caption: "The deadly triad: each edge (only two ingredients) is safe; the interior of all three risks divergence.",
      example: "Tabular Q-learning is off-policy and bootstraps but has <i>no</i> function approximation — perfectly stable. Add a function approximator and keep training off-policy and you enter the triad; DQN tames it pragmatically with a slow-moving target network and replay.",
      takeaway: "When deep RL training diverges, the triad tells you where to look: drop or stabilize one leg — target networks, on-policy data, or gradient-TD — before blaming hyperparameters."
    },
    {
      title: "Policy-gradient methods & the bias–variance ladder",
      tag: "algorithm",
      body: "<p>Instead of deriving a policy from values, <b>optimize a parameterized policy</b> $\\pi(a\\mid s,\\boldsymbol\\theta)$ directly — needed for continuous actions, able to learn <i>stochastic</i> optima, and smoother than $\\varepsilon$-greedy. The <b>policy-gradient theorem</b> gives a gradient with no model and <i>no derivative of the state distribution</i>:</p><p>$$\\nabla J(\\boldsymbol\\theta)\\propto\\mathbb{E}_\\pi\\big[\\,q_\\pi(s,a)\\,\\nabla_{\\boldsymbol\\theta}\\ln\\pi(a\\mid s,\\boldsymbol\\theta)\\,\\big]$$</p><p>The <b>bias–variance ladder</b> — what you plug in for the action's value:</p><ul><li><b>REINFORCE:</b> the Monte&nbsp;Carlo return $G_t$ — <i>unbiased, high variance</i>.</li><li><b>+ baseline / advantage:</b> subtract $\\hat v(s)$, use $A=G_t-\\hat v(s)$ — <i>unbiased, lower variance</i>.</li><li><b>Actor–critic:</b> replace $G_t$ with the bootstrapped $\\delta_t=r+\\gamma\\hat v(s')-\\hat v(s)$ — <i>biased, low variance</i> (actor = policy, critic = value).</li></ul><p>Modern deep variants: <b>A2C/A3C</b> and <b>TRPO/PPO</b> (trust-region / clipped updates) — PPO is the optimizer behind <b>RLHF</b> for LLMs.</p>",
      visual: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="260" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">Trading variance for bias along the ladder</text>
        <line x1="60" y1="180" x2="500" y2="180" class="vx-axis" stroke-width="1.5"/>
        <line x1="60" y1="180" x2="60" y2="45" class="vx-axis" stroke-width="1.5"/>
        <text x="280" y="208" text-anchor="middle" font-size="11" style="fill:var(--text-dim)">bias →</text>
        <text x="26" y="115" font-size="11" transform="rotate(-90 26 115)" text-anchor="middle" style="fill:var(--text-dim)">variance →</text>
        <path d="M95,70 C200,95 330,150 460,168" fill="none" class="vx-accent" stroke-width="2" stroke-dasharray="5 4"/>
        <circle cx="95" cy="70" r="7" style="fill:var(--bad)"/>
        <text x="105" y="62" font-size="11" font-weight="700" style="fill:var(--bad)">REINFORCE</text>
        <text x="105" y="78" font-size="9.5" style="fill:var(--text-faint)">MC return Gₜ · unbiased</text>
        <circle cx="255" cy="118" r="7" style="fill:var(--warn)"/>
        <text x="265" y="113" font-size="11" font-weight="700" style="fill:var(--warn)">+ baseline (advantage)</text>
        <text x="265" y="129" font-size="9.5" style="fill:var(--text-faint)">A = Gₜ − v̂(s) · still unbiased</text>
        <circle cx="445" cy="166" r="7" style="fill:var(--good)"/>
        <text x="440" y="158" text-anchor="end" font-size="11" font-weight="700" style="fill:var(--good)">actor–critic</text>
        <text x="440" y="143" text-anchor="end" font-size="9.5" style="fill:var(--text-faint)">δₜ bootstrap · biased, low var</text>
      </svg>`,
      caption: "Down the ladder: variance falls as you bootstrap more, at the cost of introducing bias (REINFORCE → baseline → actor–critic).",
      example: "REINFORCE's gradient estimate swings wildly because a whole episode's noisy return scales every step's update. Subtracting a learned baseline $\\hat v(s)$ centers the signal (only <i>better-than-expected</i> actions get reinforced) without changing the expected gradient — pure variance reduction.",
      takeaway: "Reach for policy gradients when actions are continuous or the optimal policy is stochastic; add a baseline and bootstrap up the ladder to tame the variance that otherwise makes them painfully sample-hungry."
    },
    {
      title: "RL & the brain: dopamine as the TD error",
      tag: "intuition",
      body: "<p>RL is the computational form of Thorndike's <b>Law of Effect</b>, and its links to neuroscience are striking. The landmark result is the <b>reward-prediction-error hypothesis of dopamine</b>: <b>phasic dopamine encodes the TD error</b> $\\delta_t$ — <i>not</i> reward itself. Schultz's monkey recordings match TD's signature exactly:</p><ul><li>Before learning, dopamine fires at the <b>reward</b>.</li><li>After learning, the burst <b>shifts to the predicting cue</b> (the cue now carries the surprise).</li><li>If an expected reward is <b>omitted</b>, dopamine <b>dips below baseline</b> — a negative $\\delta_t$.</li></ul><p>The basal ganglia plausibly implement a <b>neural actor–critic</b>: ventral striatum as critic (learning $v$), dorsal striatum as actor (the policy), with dopamine broadcasting $\\delta$ to both. <b>Habitual vs goal-directed</b> control maps onto <b>model-free vs model-based</b> RL.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="260" y="18" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">Dopamine response = TD error δₜ</text>
        <g>
          <text x="90" y="40" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">before learning</text>
          <line x1="35" y1="95" x2="150" y2="95" class="vx-grid" stroke-width="1"/>
          <path d="M35,95 L95,95 L100,55 L108,95 L150,95" fill="none" class="vx-good" stroke-width="2"/>
          <text x="100" y="110" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">reward</text>
          <text x="60" y="110" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">cue</text>
        </g>
        <g>
          <text x="260" y="40" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">after learning</text>
          <line x1="205" y1="95" x2="320" y2="95" class="vx-grid" stroke-width="1"/>
          <path d="M205,95 L228,95 L233,55 L241,95 L320,95" fill="none" class="vx-good" stroke-width="2"/>
          <text x="233" y="110" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">cue</text>
          <text x="290" y="110" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">reward (no burst)</text>
        </g>
        <g>
          <text x="430" y="40" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">reward omitted</text>
          <line x1="375" y1="95" x2="490" y2="95" class="vx-grid" stroke-width="1"/>
          <path d="M375,95 L398,95 L403,55 L411,95 L455,95 L455,128 L463,128 L463,95 L490,95" fill="none" class="vx-bad" stroke-width="2"/>
          <text x="403" y="110" text-anchor="middle" font-size="9" style="fill:var(--text-faint)">cue</text>
          <text x="459" y="145" text-anchor="middle" font-size="9" style="fill:var(--bad)">dip (−δ)</text>
        </g>
        <text x="260" y="180" text-anchor="middle" font-size="10.5" style="fill:var(--text-dim)">Burst migrates from reward → cue; an omitted reward drives δ below baseline.</text>
        <text x="260" y="205" text-anchor="middle" font-size="10" style="fill:var(--text-faint)">basal ganglia ≈ actor (dorsal striatum) + critic (ventral striatum), dopamine = δ broadcast</text>
      </svg>`,
      caption: "The three classic Schultz patterns are exactly what a TD learner's δₜ predicts — the cleanest bridge from RL to neuroscience.",
      example: "A cue reliably preceding juice: once learned, the dopamine burst appears at the <i>cue</i>, not the juice. Omit the juice and dopamine pauses at the expected reward time — a textbook negative prediction error $\\delta_t<0$.",
      takeaway: "This bridge gives RL real explanatory power over behavior and addiction, and it cuts both ways — neuroscience evidence is why TD-error learning is taken seriously as more than an engineering trick."
    },
    {
      title: "Exploration, planning & MCTS",
      tag: "exploration",
      body: "<p>Control needs to <b>explore</b>, and the toolkit comes from the one-state <b>bandit</b> special case that isolates exploration from credit assignment:</p><ul><li><b>$\\varepsilon$-greedy</b> — act greedily, but pick a random action with probability $\\varepsilon$.</li><li><b>Softmax</b> — sample actions in proportion to $e^{Q(a)/\\tau}$ (graded, not all-or-nothing).</li><li><b>Optimistic initialization</b> — start $Q$ high so every untried action looks attractive until tried.</li><li><b>UCB</b> — add an uncertainty bonus, $a=\\arg\\max_a\\,[\\,Q(a)+c\\sqrt{\\ln t/N(a)}\\,]$, favoring rarely-tried actions.</li></ul><p><b>Planning (Dyna)</b> learns a model from real experience, then blends <b>model-based simulated experience</b> with ordinary <b>model-free</b> updates — many cheap imagined backups per real step. <b>Monte Carlo Tree Search (MCTS)</b> focuses computation at the <i>current</i> state, repeating four phases: <b>select</b> (descend the tree by a tree policy such as UCB) → <b>expand</b> (add a leaf) → <b>rollout</b> (simulate to an outcome with a fast default policy) → <b>back up</b> (propagate the return up the path). MCTS is the search engine behind <b>AlphaGo</b>.</p>",
      visual: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="260" y="20" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--text)">MCTS: one iteration, four phases</text>
        <text x="80"  y="46" text-anchor="middle" font-size="10.5" font-weight="700" style="fill:var(--accent)">select</text>
        <text x="200" y="46" text-anchor="middle" font-size="10.5" font-weight="700" style="fill:var(--good)">expand</text>
        <text x="330" y="46" text-anchor="middle" font-size="10.5" font-weight="700" style="fill:var(--warn)">rollout</text>
        <text x="455" y="46" text-anchor="middle" font-size="10.5" font-weight="700" style="fill:var(--text)">back up</text>
        <circle cx="80" cy="70" r="7" style="fill:var(--accent)"/>
        <line x1="80" y1="77" x2="55" y2="110" class="vx-accent" stroke-width="2.5"/>
        <line x1="80" y1="77" x2="105" y2="110" class="vx-grid" stroke-width="1.5"/>
        <circle cx="55" cy="120" r="6" style="fill:var(--accent)"/>
        <circle cx="105" cy="120" r="5" style="fill:var(--text-faint)"/>
        <line x1="55" y1="126" x2="55" y2="160" class="vx-accent" stroke-width="2.5"/>
        <circle cx="55" cy="170" r="6" style="fill:var(--accent)"/>
        <text x="80" y="205" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">descend by UCB</text>
        <circle cx="200" cy="128" r="6" style="fill:var(--good)"/>
        <line x1="200" y1="134" x2="200" y2="163" class="vx-good" stroke-width="2" stroke-dasharray="4 3"/>
        <circle cx="200" cy="170" r="6" class="vx-good" fill="none" stroke-width="2"/>
        <text x="200" y="205" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">add a leaf</text>
        <circle cx="330" cy="128" r="6" style="fill:var(--warn)"/>
        <path d="M330,134 L322,150 L338,165 L324,180" fill="none" class="vx-warn" stroke-width="1.5" stroke-dasharray="3 3"/>
        <text x="324" y="196" text-anchor="middle" font-size="9.5" style="fill:var(--warn)">+1 / −1</text>
        <text x="330" y="210" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">simulate to outcome</text>
        <circle cx="455" cy="170" r="6" style="fill:var(--warn)"/>
        <line x1="455" y1="164" x2="455" y2="130" class="vx-axis" stroke-width="2" marker-end="url(#mctsUp)"/>
        <circle cx="455" cy="120" r="6" style="fill:var(--text)"/>
        <defs><marker id="mctsUp" markerWidth="9" markerHeight="9" refX="4" refY="1" orient="auto"><path d="M0,7 L4,0 L8,7 Z" style="fill:var(--text)"/></marker></defs>
        <text x="455" y="205" text-anchor="middle" font-size="9.5" style="fill:var(--text-faint)">propagate return up</text>
      </svg>`,
      caption: "MCTS grows an asymmetric tree from the current state: select by UCB, expand a leaf, roll out to an outcome, then back the result up the path.",
      example: "From the current Go position, AlphaGo runs thousands of MCTS iterations: each descends the tree by a UCB-style rule, adds a new node, plays a fast simulated game to a win/loss, and pushes that result back up so visited moves' statistics improve. The move actually played is the one with the most visits — search effort concentrated where it matters.",
      takeaway: "If you have a model (or can learn one), planning and MCTS turn compute into decision quality at the current state — far more sample-efficient than learning a global policy from scratch."
    },
    {
      title: "Average reward & continuing tasks",
      tag: "core",
      body: "<p>For <b>continuing</b> (non-episodic) tasks that never terminate, returns can be infinite, so the natural objective is the <b>average reward</b> per step:</p><p>$$r(\\pi)=\\lim_{h\\to\\infty}\\frac1h\\sum_{t=1}^{h}\\mathbb{E}_\\pi[R_t]$$</p><p>Value is then measured <i>relative</i> to that average — the <b>differential</b> value function sums how much each future reward beats the long-run rate:</p><p>$$v_\\pi(s)=\\sum_{k}\\mathbb{E}_\\pi[\\,R_{t+k}-r(\\pi)\\mid s\\,]$$</p><p>and the <b>differential TD error</b> replaces discounting with the estimated average $\\bar R$:</p><p>$$\\delta_t=r_{t+1}-\\bar R+\\hat v(s')-\\hat v(s)$$</p><p>Sutton &amp; Barto argue for <b>deprecating discounting</b> in this setting: under function approximation the discounted objective turns out merely <i>proportional</i> to $r(\\pi)$ (so $\\gamma$ does not change the ranking of policies), and the usual policy-improvement guarantee is lost. Average reward is the principled objective for never-ending tasks.</p>",
      caption: null,
      example: "A server-scheduling agent that runs forever cares about <i>throughput per second</i>, not a discounted sum that would arbitrarily privilege the near term. It tracks a running $\\bar R$ and updates values by $\\delta_t=r_{t+1}-\\bar R+\\hat v(s')-\\hat v(s)$ — a state is \"good\" exactly when it leads to better-than-average reward, with no $\\gamma$ to tune.",
      takeaway: "For never-ending tasks optimize average reward, not a discounted sum — under function approximation $\\gamma$ stops meaningfully ranking policies, so discounting is the wrong objective there."
    }
  ]
};
