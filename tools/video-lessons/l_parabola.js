{
  // y = −x² + 2x + 8: y-intercept 8, x-intercepts −2 and 4, turning point (1; 9).
  const f = (x) => -x * x + 2 * x + 8
  const W = 440, H = 360, ox = 150, oy = 280, sx = 48, sy = 26
  const X = (x) => ox + x * sx, Y = (y) => oy - y * sy
  const pts = Array.from({ length: 57 }, (_, i) => -2.4 + i * 0.12).map((x) => `${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`).join(' ')
  const dot = (x, y, lab, dx, dy, step, col = '#e6af38') =>
    `<g data-at="${step}"><circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="${col}"/><text x="${X(x) + dx}" y="${Y(y) + dy}" fill="${col}" font-size="19" font-weight="800">${lab}</text></g>`
  const graph = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="flex:none">
    <line x1="10" y1="${oy}" x2="${W - 10}" y2="${oy}" stroke="#8499bd" stroke-width="2"/><text x="${W - 22}" y="${oy - 8}" fill="#adbbd3" font-size="18">x</text>
    <line x1="${ox}" y1="${H - 10}" x2="${ox}" y2="10" stroke="#8499bd" stroke-width="2"/><text x="${ox + 8}" y="24" fill="#adbbd3" font-size="18">y</text>
    ${dot(0, 8, '(0; 8)', -66, 4, 1)}
    ${dot(-2, 0, '(−2; 0)', 14, -12, 2)}${dot(4, 0, '(4; 0)', -68, -12, 2)}
    ${dot(1, 9, '(1; 9)', 14, -4, 3)}
    <g data-at="4"><line x1="${X(1)}" y1="${Y(9)}" x2="${X(1)}" y2="${oy}" stroke="#7fb3ff" stroke-width="2" stroke-dasharray="6 6"/>
      <polyline points="${pts}" fill="none" stroke="#9be29b" stroke-width="4"/></g>
  </svg>`

  window.LESSON = {
    id: 'maths-sketch-parabola',
    crumb: 'Mathematics · Functions & Graphs',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Mathematics · Functions &amp; Graphs · Grades 10–12</div>
        <h1>Sketching a parabola</h1>
        <div class="sub">The shape, the intercepts and the turning point, step by step, then the sketch and its range.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn how to sketch a parabola step by step: the shape, the intercepts, the turning point, and then the sketch itself.'] },
      { id: 'plan', html: `
        <div class="eyebrow">The method</div>
        <h2>Sketch y = −x² + 2x + 8 in four steps</h2>
        <div class="steps tight">
          <div class="step" data-at="1"><span class="lbl">Shape</span>a = −1 &lt; 0, so the parabola opens downwards: a maximum</div>
          <div class="step" data-at="2"><span class="lbl">y-int</span>let x = 0: y = 8 &nbsp;→&nbsp; (0; 8)</div>
          <div class="step" data-at="3"><span class="lbl">x-ints</span>let y = 0: x² − 2x − 8 = 0 &nbsp;→&nbsp; (x − 4)(x + 2) = 0</div>
          <div class="step" data-at="4"><span class="lbl"></span>x = 4 or x = −2 &nbsp;→&nbsp; (4; 0) and (−2; 0)</div>
        </div>`,
        say: [
          "Let's sketch y equals negative x squared plus two x plus eight.",
          'Step one, the shape. The coefficient of x squared is negative one, which is less than zero, so the parabola opens downwards and has a maximum.',
          'Step two, the y intercept. Let x be zero: y is eight. So the graph cuts the y axis at zero, eight.',
          'Step three, the x intercepts. Let y be zero, and multiply through by negative one to get x squared minus two x minus eight equals zero. This factorises as x minus four, times x plus two.',
          'So x is four, or x is negative two. The graph cuts the x axis at four, zero and at negative two, zero.',
        ] },
      { id: 'tp', html: `
        <div class="eyebrow">Step 4: the turning point</div>
        <h2>x = −b ÷ 2a, then substitute to find y</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">x</span>x = −b ÷ 2a = −2 ÷ (2 × −1) = 1</div>
          <div class="step" data-at="2"><span class="lbl">y</span>y = −(1)² + 2(1) + 8 = 9</div>
          <div class="step ans" data-at="3"><span class="lbl">TP</span>turning point (1; 9), a maximum</div>
        </div>
        <div class="box" data-at="4"><span class="lead" style="margin:0">Check: the turning point lies halfway between the x-intercepts: (−2 + 4) ÷ 2 = <b class="hl">1</b> ✓</span></div>`,
        say: [
          'Step four, the turning point.',
          'The x value is negative b divided by two a. Here b is two and a is negative one, so x is negative two divided by negative two, which is one.',
          'Substitute x equals one into the equation: negative one, plus two, plus eight, which is nine.',
          'So the turning point is one, nine, and it is a maximum.',
          'Check it: the turning point always lies halfway between the x intercepts. Negative two plus four, divided by two, is one. It matches.',
        ] },
      { id: 'sketch', html: `
        <div class="eyebrow">The sketch</div>
        <h2>Plot the points, then draw one smooth curve</h2>
        <div style="display:flex;gap:40px;align-items:center;margin-top:6px">
          ${graph}
          <ul class="pts" style="margin-top:0">
            <li data-at="4"><span>Label every intercept and the turning point</span></li>
            <li data-at="5"><span><b>Range:</b> y ≤ 9 &nbsp; <b>Axis of symmetry:</b> x = 1</span></li>
          </ul>
        </div>`,
        say: [
          'Now plot what you found.',
          'The y intercept at zero, eight.',
          'The x intercepts at negative two and at four.',
          'And the turning point at one, nine.',
          'Draw one smooth curve through the points, symmetrical about the line x equals one, and label every point. The examiner marks the labels, not your artwork.',
          'The range is y less than or equal to nine, because nine is the highest point. The axis of symmetry is x equals one.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Drawing the wrong <b>shape</b>: check the sign of a first</span></li>
          <li data-at="2"><span>Sign errors in −b ÷ 2a when <b>a or b is negative</b>: use brackets</span></li>
          <li data-at="3"><span><b>Unlabelled</b> points, or a pointed tip instead of a smooth turn</span></li>
        </ul>`,
        say: [
          'Watch out for three common mistakes.',
          'Drawing the wrong shape. Always check the sign of a first. Negative a opens downwards.',
          'Sign errors in negative b over two a, when a or b is negative. Write the values in brackets.',
          'And unlabelled points, or a sharp point at the turning point instead of a smooth turn.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Functions.</em></h1>
        <div class="cta">Open Functions &amp; Graphs in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Functions and Graphs in DONE WELL and practise sketching parabolas, with every mark explained."] },
    ],
  }
}
