window.LESSON = {
  id: 'maths-optimisation',
  crumb: 'Mathematics · Differential Calculus',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematics · Differential Calculus · Grade 12</div>
      <h1>Optimisation: the largest box</h1>
      <div class="sub">Write the quantity in one variable, differentiate, set the derivative to zero, and check the answer makes sense.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how to use calculus to find a maximum or a minimum, with a classic exam problem: the largest box you can make from a sheet of card.'] },
    { id: 'method', html: `
      <div class="eyebrow">The method</div>
      <h2>Four steps for every optimisation question</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">1</span>Write the quantity to optimise in terms of <b>one</b> variable</div>
        <div class="step" data-at="2"><span class="lbl">2</span>Differentiate</div>
        <div class="step" data-at="3"><span class="lbl">3</span>Set the derivative equal to <b>zero</b> and solve</div>
        <div class="step ans" data-at="4"><span class="lbl">4</span>Choose the answer that makes sense, and answer the question</div>
      </div>`,
      say: [
        'Every optimisation question uses the same four steps.',
        'First, write the quantity you want to make as large or as small as possible in terms of one variable.',
        'Second, differentiate.',
        'Third, set the derivative equal to zero and solve. At a maximum or a minimum, the gradient is zero.',
        'Fourth, choose the answer that makes sense in the situation, and answer the question that was asked.',
      ] },
    { id: 'setup', html: `
      <div class="eyebrow">Worked example</div>
      <h2>A square of card 24 cm wide: cut a square of side x from each corner and fold up the sides</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Base</span>(24 − 2x) by (24 − 2x); height x</div>
        <div class="step" data-at="2"><span class="lbl">Volume</span>V = x(24 − 2x)²</div>
        <div class="step" data-at="3"><span class="lbl">Expand</span>V = 576x − 96x² + 4x³</div>
        <div class="step" data-at="4"><span class="lbl">Domain</span>0 &lt; x &lt; 12</div>
      </div>`,
      say: [
        'Here is the problem. A square piece of card is twenty four centimetres wide. A square of side x is cut from each corner, and the sides are folded up to make an open box. Find the value of x that gives the largest volume.',
        'Cutting x from both ends of each side leaves a base of twenty four minus two x by twenty four minus two x. The height of the box is x.',
        'So the volume is x times twenty four minus two x, squared.',
        'Expand it: five hundred and seventy six x, minus ninety six x squared, plus four x cubed.',
        'And x must be between zero and twelve, or there is no box.',
      ] },
    { id: 'solve', html: `
      <div class="eyebrow">Differentiate and solve</div>
      <h2>Set dV/dx = 0</h2>
      <div class="steps tight">
        <div class="step" data-at="0"><span class="lbl">Derive</span>dV/dx = 576 − 192x + 12x²</div>
        <div class="step" data-at="1"><span class="lbl">= 0</span>12(x² − 16x + 48) = 0 &nbsp;→&nbsp; 12(x − 4)(x − 12) = 0</div>
        <div class="step" data-at="2"><span class="lbl">Choose</span>x = 4 (x = 12 gives no box)</div>
        <div class="step ans" data-at="3"><span class="lbl">Volume</span>V = 4 × (24 − 8)² = 4 × 256 = 1&nbsp;024 cm³</div>
      </div>`,
      say: [
        'Differentiate: dV by dx is five hundred and seventy six, minus one hundred and ninety two x, plus twelve x squared.',
        'Set it equal to zero. Take out the common factor twelve, and factorise: twelve, times x minus four, times x minus twelve, equals zero.',
        'So x is four, or x is twelve. But x equals twelve cuts the whole card away and leaves no box, so x is four centimetres.',
        'The largest volume is four times sixteen squared, which is one thousand and twenty four cubic centimetres.',
      ] },
    { id: 'check', html: `
      <div class="eyebrow">Is it a maximum?</div>
      <h2>Check a value either side</h2>
      <table class="t">
        <tr><th>x (cm)</th><th>V = x(24 − 2x)²  (cm³)</th></tr>
        <tr data-at="1"><td>3</td><td class="num">3 × 18² = 972</td></tr>
        <tr data-at="1"><td>4</td><td class="num">4 × 16² = 1&nbsp;024</td></tr>
        <tr data-at="1"><td>5</td><td class="num">5 × 14² = 980</td></tr>
      </table>
      <div class="box" data-at="2"><span class="lead" style="margin:0">The volume is largest at <b class="hl">x = 4</b>, so it is a maximum.</span></div>`,
      say: [
        'How do you know it is a maximum and not a minimum? Check a value on either side.',
        'At three, the volume is nine hundred and seventy two. At four, it is one thousand and twenty four. At five, it is nine hundred and eighty.',
        'The volume is largest at four, so x equals four gives the maximum.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Differentiating before the quantity is in <b>one variable</b></span></li>
        <li data-at="2"><span>Keeping an answer that is <b>impossible</b> in the situation</span></li>
        <li data-at="3"><span>Stopping at x = 4 when the question asks for the <b>volume</b></span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Differentiating before the quantity is written in one variable. Use the information given to get rid of the others first.',
        'Keeping an answer that is impossible in the situation, like a box with no base.',
        'And stopping at x equals four when the question asks for the largest volume. Read the question again before you finish.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Calculus.</em></h1>
      <div class="cta">Open Differential Calculus in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Differential Calculus in DONE WELL and practise optimisation, with every mark explained."] },
  ],
}
