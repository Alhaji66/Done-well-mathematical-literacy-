window.LESSON = {
  id: 'maths-trig-identities',
  crumb: 'Mathematics · Trigonometry',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematics · Trigonometry · Grades 11–12</div>
      <h1>Proving trigonometric identities</h1>
      <div class="sub">The two identities you use most, a method that always works, and two proofs set out the way the memo marks them.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how to prove trigonometric identities, with a method that works every time, and two proofs set out the way the memo marks them.'] },
    { id: 'tools', html: `
      <div class="eyebrow">The tools</div>
      <h2>Two identities do most of the work</h2>
      <div class="steps">
        <div class="step" data-at="1"><span class="lbl">Quotient</span>tan x = sin x ÷ cos x</div>
        <div class="step" data-at="2"><span class="lbl">Square</span>sin²x + cos²x = 1 &nbsp;so&nbsp; 1 − cos²x = sin²x, &nbsp;1 − sin²x = cos²x</div>
      </div>`,
      say: [
        'Two identities do most of the work.',
        'The quotient identity: tan x equals sin x divided by cos x.',
        'And the square identity: sin squared x plus cos squared x equals one. Rearranged, one minus cos squared x is sin squared x, and one minus sin squared x is cos squared x.',
      ] },
    { id: 'method', html: `
      <div class="eyebrow">The method</div>
      <h2>Work on ONE side until it becomes the other</h2>
      <ul class="pts">
        <li data-at="1"><span>Start with the <b>more complicated</b> side</span></li>
        <li data-at="2"><span>Change tan into <b>sin ÷ cos</b>, and look for <b>1 − cos²</b> or <b>1 − sin²</b></span></li>
        <li data-at="3"><span>Write it as <b>one fraction</b>, then simplify</span></li>
        <li data-at="4"><span>Finish with <em class="k">= RHS</em>; never move terms from one side to the other</span></li>
      </ul>`,
      say: [
        'Here is a method that always works.',
        'Start with the more complicated side.',
        'Change tan into sin over cos, and look for one minus cos squared, or one minus sin squared.',
        'Write everything as a single fraction, then simplify.',
        'Finish by showing it equals the right-hand side. Never move terms across the equals sign: an identity is proved one side at a time.',
      ] },
    { id: 'proof1', html: `
      <div class="eyebrow">Proof 1</div>
      <h2>Prove: (1 − cos²x) ÷ (sin x cos x) = tan x</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">LHS</span>= sin²x ÷ (sin x cos x)</div>
        <div class="step" data-at="2"><span class="lbl"></span>= sin x ÷ cos x</div>
        <div class="step ans" data-at="3"><span class="lbl"></span>= tan x = RHS</div>
      </div>`,
      say: [
        'Prove that one minus cos squared x, divided by sin x cos x, equals tan x.',
        'Start on the left. One minus cos squared x is sin squared x.',
        'Cancel one sin x from the top and the bottom, which leaves sin x over cos x.',
        'And sin x over cos x is tan x, which is the right-hand side.',
      ] },
    { id: 'proof2', html: `
      <div class="eyebrow">Proof 2</div>
      <h2>Prove: 1 ÷ cos x − cos x = sin x tan x</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">LHS</span>= (1 − cos²x) ÷ cos x</div>
        <div class="step" data-at="2"><span class="lbl"></span>= sin²x ÷ cos x</div>
        <div class="step" data-at="3"><span class="lbl"></span>= sin x × (sin x ÷ cos x)</div>
        <div class="step ans" data-at="4"><span class="lbl"></span>= sin x tan x = RHS</div>
      </div>`,
      say: [
        'A second one. Prove that one over cos x, minus cos x, equals sin x tan x.',
        'Start on the left and write it as one fraction, over cos x: one minus cos squared x, all over cos x.',
        'One minus cos squared x is sin squared x.',
        'Split sin squared x over cos x into sin x, times sin x over cos x.',
        'That is sin x tan x, the right-hand side.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Working on <b>both sides at once</b>, or cross-multiplying: that assumes what you must prove</span></li>
        <li data-at="2"><span>Writing sin²x as <b>sin x²</b>, or cancelling terms that are <b>added</b>, not multiplied</span></li>
        <li data-at="3"><span>Forgetting where it is <b>undefined</b>: here, wherever cos x = 0</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Working on both sides at once, or cross-multiplying. That assumes the identity is true before you have proved it.',
        'Writing sin squared x as sin of x squared, or cancelling terms that are added rather than multiplied.',
        'And forgetting where the identity is undefined. Here, it is undefined wherever cos x is zero, because you cannot divide by zero.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Trigonometry.</em></h1>
      <div class="cta">Open Trigonometry in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Trigonometry in DONE WELL and practise proving identities, with every step explained."] },
  ],
}
