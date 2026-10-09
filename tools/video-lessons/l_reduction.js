(function () {
  const fr = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`
  // CAST diagram: quadrants with the ratios that are positive in each.
  const cast = `<svg class="diagram" style="right:70px;top:150px" width="420" height="420" viewBox="0 0 420 420">
    <line x1="20" y1="210" x2="400" y2="210" stroke="#8499bd" stroke-width="2"/>
    <line x1="210" y1="20" x2="210" y2="400" stroke="#8499bd" stroke-width="2"/>
    <text x="404" y="200" fill="#adbbd3" font-size="16">0°</text><text x="216" y="30" fill="#adbbd3" font-size="16">90°</text>
    <text x="22" y="200" fill="#adbbd3" font-size="16">180°</text><text x="216" y="398" fill="#adbbd3" font-size="16">270°</text>
    <g data-at="1"><text x="300" y="120" fill="#5fd0a0" font-size="54" font-weight="800" text-anchor="middle">A</text><text x="300" y="150" fill="#adbbd3" font-size="16" text-anchor="middle">all positive</text></g>
    <g data-at="2"><text x="120" y="120" fill="#5fd0a0" font-size="54" font-weight="800" text-anchor="middle">S</text><text x="120" y="150" fill="#adbbd3" font-size="16" text-anchor="middle">sin positive</text></g>
    <g data-at="3"><text x="120" y="310" fill="#5fd0a0" font-size="54" font-weight="800" text-anchor="middle">T</text><text x="120" y="340" fill="#adbbd3" font-size="16" text-anchor="middle">tan positive</text></g>
    <g data-at="4"><text x="300" y="310" fill="#5fd0a0" font-size="54" font-weight="800" text-anchor="middle">C</text><text x="300" y="340" fill="#adbbd3" font-size="16" text-anchor="middle">cos positive</text></g>
  </svg>`
  window.LESSON = {
    id: 'maths-reduction-formulae',
    crumb: 'Mathematics · Trigonometry',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Mathematics · Trigonometry · Grades 11 and 12</div>
        <h1>Reduction formulae and the CAST diagram</h1>
        <div class="sub">How to reduce any angle to an acute one, get the sign right, and simplify without a calculator.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 4 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn the reduction formulae: how to change the trig ratio of any angle into a ratio of an acute angle, with the correct sign, and how to simplify expressions without a calculator.'] },
      { id: 'cast', html: `
        <div class="eyebrow">The signs</div>
        <h2 style="max-width:640px">CAST tells you which ratios are positive</h2>
        <ul class="pts" style="max-width:640px">
          <li data-at="1"><span>First quadrant: <b>all</b> ratios positive</span></li>
          <li data-at="2"><span>Second quadrant: only <b>sin</b></span></li>
          <li data-at="3"><span>Third quadrant: only <b>tan</b></span></li>
          <li data-at="4"><span>Fourth quadrant: only <b>cos</b></span></li>
        </ul>${cast}`,
        say: [
          'Angles are measured anticlockwise from the positive x axis, and the sign of each ratio depends on the quadrant the angle ends in.',
          'In the first quadrant, from zero to ninety degrees, all the ratios are positive.',
          'In the second quadrant, only sine is positive.',
          'In the third quadrant, only tangent is positive.',
          'And in the fourth quadrant, only cosine is positive. Read anticlockwise from the fourth quadrant, the letters spell C A S T.',
        ] },
      { id: 'rules', html: `
        <div class="eyebrow">The reduction formulae</div>
        <h2>Same ratio, acute angle, sign from CAST</h2>
        <table class="t">
          <tr><th>Angle</th><th>Quadrant</th><th>sin</th><th>cos</th><th>tan</th></tr>
          <tr data-at="1"><td class="math">180° − θ</td><td>2nd</td><td class="math">sin θ</td><td class="math">−cos θ</td><td class="math">−tan θ</td></tr>
          <tr data-at="2"><td class="math">180° + θ</td><td>3rd</td><td class="math">−sin θ</td><td class="math">−cos θ</td><td class="math">tan θ</td></tr>
          <tr data-at="3"><td class="math">360° − θ, −θ</td><td>4th</td><td class="math">−sin θ</td><td class="math">cos θ</td><td class="math">−tan θ</td></tr>
          <tr data-at="4"><td class="math">90° ± θ</td><td>1st / 2nd</td><td class="math">cos θ</td><td class="math">∓sin θ</td><td class="math">—</td></tr>
        </table>`,
        say: [
          'With one hundred and eighty or three hundred and sixty degrees, the ratio stays the same, and CAST gives the sign.',
          'One hundred and eighty minus theta is in the second quadrant, so sine stays positive, and cosine and tangent become negative.',
          'One hundred and eighty plus theta is in the third quadrant, so only tangent stays positive.',
          'Three hundred and sixty minus theta, and negative theta, are in the fourth quadrant, so only cosine stays positive.',
          'With ninety degrees, the ratio changes to its co-function: sine becomes cosine, and cosine becomes sine. Sine of ninety plus theta is cos theta, and cos of ninety plus theta is negative sine theta.',
        ] },
      { id: 'ex1', html: `
        <div class="eyebrow">Example 1</div>
        <h2>Without a calculator: <span class="math">${fr('sin 150° · cos 240°', 'tan 315°')}</span></h2>
        <div class="steps tight">
          <div class="step" data-at="1"><span class="lbl">sin 150°</span>sin(180° − 30°) = sin 30° = ½</div>
          <div class="step" data-at="2"><span class="lbl">cos 240°</span>cos(180° + 60°) = −cos 60° = −½</div>
          <div class="step" data-at="3"><span class="lbl">tan 315°</span>tan(360° − 45°) = −tan 45° = −1</div>
          <div class="step ans" data-at="4"><span class="lbl">Answer</span>${fr('(½)(−½)', '−1')} = ${fr('−¼', '−1')} = ¼</div>
        </div>`,
        say: [
          'Here is an example. Without a calculator, determine sin one hundred and fifty degrees, times cos two hundred and forty degrees, divided by tan three hundred and fifteen degrees.',
          'One hundred and fifty degrees is one hundred and eighty minus thirty. It is in the second quadrant, where sine is positive, so sin one hundred and fifty equals sin thirty, which is one half.',
          'Two hundred and forty degrees is one hundred and eighty plus sixty, in the third quadrant, where cosine is negative. So cos two hundred and forty is negative cos sixty, which is negative one half.',
          'Three hundred and fifteen degrees is three hundred and sixty minus forty five, in the fourth quadrant, where tangent is negative. So tan three hundred and fifteen is negative tan forty five, which is negative one.',
          'Substitute: one half times negative one half is negative one quarter. Divided by negative one, that gives positive one quarter.',
        ] },
      { id: 'ex2', html: `
        <div class="eyebrow">Example 2</div>
        <h2>Simplify: <span class="math">${fr('sin(180° − x) · cos(−x)', 'cos(90° + x) · cos(360° − x)')}</span></h2>
        <div class="steps tight">
          <div class="step" data-at="1"><span class="lbl">Top</span>sin(180° − x) · cos(−x) = sin x · cos x</div>
          <div class="step" data-at="2"><span class="lbl">Bottom</span>cos(90° + x) · cos(360° − x) = (−sin x) · cos x</div>
          <div class="step ans" data-at="3"><span class="lbl">Answer</span>${fr('sin x · cos x', '−sin x · cos x')} = −1</div>
        </div>`,
        say: [
          'Now simplify sin of one hundred and eighty minus x, times cos of negative x, all over cos of ninety plus x, times cos of three hundred and sixty minus x.',
          'Sin of one hundred and eighty minus x is sin x. Cos of negative x is cos x. So the top is sin x cos x.',
          'Cos of ninety plus x is negative sin x, a co-function, and cos of three hundred and sixty minus x is cos x. So the bottom is negative sin x cos x.',
          'Everything cancels, except the minus sign. The answer is negative one.',
        ] },
      { id: 'big', html: `
        <div class="eyebrow">Angles bigger than 360°</div>
        <h2>Subtract 360° first</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Reduce</span>cos 480° = cos(480° − 360°) = cos 120°</div>
          <div class="step ans" data-at="2"><span class="lbl">Then</span>cos(180° − 60°) = −cos 60° = −½</div>
        </div>`,
        say: [
          'For an angle bigger than three hundred and sixty degrees, first subtract three hundred and sixty, as many times as you need. The ratios repeat every full turn.',
          'Cos four hundred and eighty degrees equals cos of four hundred and eighty minus three hundred and sixty, which is cos one hundred and twenty.',
          'Then cos one hundred and twenty is cos of one hundred and eighty minus sixty, which is negative cos sixty, negative one half.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>The sign comes from the quadrant of the <b>original</b> angle, not of θ</span></li>
          <li data-at="2"><span>Only <b>90°</b> changes the ratio (sin ↔ cos); 180° and 360° never do</span></li>
          <li data-at="3"><span>Show every reduction step: the answer alone earns very few marks</span></li>
        </ul>`,
        say: [
          'Three mistakes to avoid.',
          'The sign comes from the quadrant of the original angle. Sin of two hundred and ten degrees is negative, because two hundred and ten is in the third quadrant.',
          'Only ninety degrees changes sine into cosine. One hundred and eighty and three hundred and sixty never change the ratio.',
          'And show every reduction step. In a "without a calculator" question, the answer alone earns very few marks.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Trigonometry.</em></h1>
        <div class="cta">Open Trigonometry in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Trigonometry in DONE WELL, and practise reduction formulae with every step explained."] },
    ],
  }
})()
