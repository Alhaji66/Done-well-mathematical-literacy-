(function () {
  const lim = '<span class="lim">lim<small>h→0</small></span>'
  const fr = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`
  // y = 0.18x² on screen; P at x = 1.5, Q at x = 1.5 + h.
  const W = 520, H = 420, X0 = 60, Y0 = 380, SX = 72, SY = 72
  const f = (x) => 0.27 * x * x
  const px = (x) => X0 + x * SX, py = (y) => Y0 - y * SY
  let curve = ''
  for (let i = 0; i <= 60; i++) { const x = -0.6 + (i / 60) * 5.6; curve += `${i ? 'L' : 'M'}${px(x).toFixed(1)},${py(f(x)).toFixed(1)}` }
  const svg = `<svg class="diagram" style="right:70px;top:150px" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <line x1="${X0 - 40}" y1="${Y0}" x2="${W - 10}" y2="${Y0}" stroke="#8499bd" stroke-width="1.5"/>
    <line x1="${X0}" y1="${Y0 + 20}" x2="${X0}" y2="10" stroke="#8499bd" stroke-width="1.5"/>
    <text x="${W - 22}" y="${Y0 + 22}" fill="#8499bd" font-size="16">x</text><text x="${X0 + 8}" y="22" fill="#8499bd" font-size="16">y</text>
    <path d="${curve}" fill="none" stroke="#7fb3ff" stroke-width="3.5"/>
    <line id="sec" stroke="#e6af38" stroke-width="3" stroke-linecap="round"/>
    <line id="dx" stroke="#adbbd3" stroke-width="2" stroke-dasharray="6 5"/><line id="dy" stroke="#adbbd3" stroke-width="2" stroke-dasharray="6 5"/>
    <text id="hl" fill="#d6dde9" font-size="18" font-weight="700">h</text>
    <circle id="P" r="7" fill="#fff"/><circle id="Q" r="7" fill="#e6af38"/>
    <text id="Pl" fill="#fff" font-size="20" font-weight="800">P</text><text id="Ql" fill="#e6af38" font-size="20" font-weight="800">Q</text>
  </svg>`
  const anim = (el, s, lines) => {
    const a = lines[3].start, b = lines[3].end + 0.6
    const k = Math.max(0, Math.min(1, (s - a) / (b - a)))
    const h = 2.0 * (1 - k) + 0.02 * k
    const x1 = 1.5, x2 = x1 + h, m = (f(x2) - f(x1)) / h
    const L = 2.6, xa = x1 - L, xb = x1 + L
    const set = (id, at) => { const n = el.querySelector('#' + id); for (const [k2, v] of Object.entries(at)) n.setAttribute(k2, v) }
    set('sec', { x1: px(xa), y1: py(f(x1) + m * (xa - x1)), x2: px(xb), y2: py(f(x1) + m * (xb - x1)) })
    set('P', { cx: px(x1), cy: py(f(x1)) }); set('Q', { cx: px(x2), cy: py(f(x2)) })
    set('Pl', { x: px(x1) - 26, y: py(f(x1)) - 10 }); set('Ql', { x: px(x2) + 10, y: py(f(x2)) - 10 })
    set('dx', { x1: px(x1), y1: py(f(x1)), x2: px(x2), y2: py(f(x1)), opacity: h > 0.3 ? 1 : 0 })
    set('dy', { x1: px(x2), y1: py(f(x1)), x2: px(x2), y2: py(f(x2)), opacity: h > 0.3 ? 1 : 0 })
    set('hl', { x: (px(x1) + px(x2)) / 2 - 5, y: py(f(x1)) + 24, opacity: h > 0.3 ? 1 : 0 })
    const show = Math.max(0, Math.min(1, (s - lines[1].start + 0.2) / 0.5))
    el.querySelector('svg').style.opacity = show
  }
  window.LESSON = {
    id: 'maths-first-principles',
    crumb: 'Mathematics · Differential Calculus',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Mathematics · Differential Calculus · Grade 12</div>
        <h1>The derivative from first principles</h1>
        <div class="sub">Where the definition comes from, and how to use it, line by line.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will see where the derivative comes from, and how to find it from first principles, line by line.'] },
      { id: 'idea', html: `
        <div class="eyebrow">The idea</div>
        <h2 style="max-width:620px">The derivative is the gradient of the tangent</h2>
        <ul class="pts" style="max-width:600px">
          <li data-at="1"><span>P is at <b>x</b>; Q is a small distance <b>h</b> further along</span></li>
          <li data-at="2"><span>Gradient of PQ = ${fr('f(x + h) − f(x)', 'h')}</span></li>
          <li data-at="3"><span>As <b>h → 0</b>, Q slides to P and PQ becomes the <em class="k">tangent</em></span></li>
        </ul>${svg}`,
        say: [
          'The derivative tells you the gradient of a curve at any point. That is the gradient of the tangent to the curve.',
          'Take two points on the curve. P is at x, and Q is a small distance h further along.',
          'The gradient of the line through P and Q is the change in y, which is f of x plus h, minus f of x, divided by the change in x, which is h.',
          'Now let h get smaller and smaller. Q slides towards P, and the line through P and Q becomes the tangent at P.',
        ], anim },
      { id: 'definition', html: `
        <div class="eyebrow">The definition</div>
        <h2>Differentiation from first principles</h2>
        <div class="box gold" data-at="0" style="font-size:40px;padding:26px 30px" ><span class="math">f′(x) = ${lim} ${fr('f(x + h) − f(x)', 'h')}</span></div>
        <div class="lead" data-at="1">“From first principles” means you must use this definition, not the shortcut rules.</div>`,
        say: [
          'That gives the definition. f prime of x is the limit, as h tends to zero, of f of x plus h, minus f of x, all over h.',
          'In an exam, from first principles means you must use this definition. The shortcut rules do not earn the marks.',
        ] },
      { id: 'expand', html: `
        <div class="eyebrow">Worked example</div>
        <h2>Find f′(x) from first principles if f(x) = 2x² − 3x</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Step 1</span>f(x + h) = 2(x + h)² − 3(x + h)</div>
          <div class="step" data-at="2"><span class="lbl">Expand</span>= 2x² + 4xh + 2h² − 3x − 3h</div>
          <div class="step" data-at="3"><span class="lbl">Subtract</span>f(x + h) − f(x) = 4xh + 2h² − 3h</div>
        </div>`,
        say: [
          'Here is an example. Determine f prime of x from first principles, if f of x equals two x squared, minus three x.',
          'First, find f of x plus h. Replace every x with x plus h.',
          'Expand the brackets fully. That gives two x squared, plus four x h, plus two h squared, minus three x, minus three h.',
          'Now subtract f of x. The two x squared and the minus three x cancel, leaving four x h, plus two h squared, minus three h.',
        ] },
      { id: 'limit', html: `
        <div class="eyebrow">Worked example, continued</div>
        <h2>Divide by h, then take the limit</h2>
        <div class="steps">
          <div class="step" data-at="0"><span class="lbl">Definition</span>f′(x) = ${lim} ${fr('4xh + 2h² − 3h', 'h')}</div>
          <div class="step" data-at="1"><span class="lbl">Factorise</span>= ${lim} ${fr('h(4x + 2h − 3)', 'h')} = ${lim} (4x + 2h − 3)</div>
          <div class="step" data-at="2"><span class="lbl">Let h → 0</span>= 4x + 2(0) − 3</div>
          <div class="step ans" data-at="3"><span class="lbl">Answer</span>f′(x) = 4x − 3</div>
        </div>`,
        say: [
          'Put this into the definition, over h.',
          'Every term on top contains an h, so take h out as a common factor, and cancel it with the h underneath.',
          'Only now let h tend to zero. Two h becomes zero.',
          'So f prime of x equals four x, minus three.',
        ] },
      { id: 'check', html: `
        <div class="eyebrow">Check your answer</div>
        <h2>The power rule gives the same result</h2>
        <div class="box" data-at="0" style="font-size:34px"><span class="math">d/dx (2x² − 3x) = 4x − 3 ✓</span></div>
        <div class="lead" data-at="1">Use the rule to check yourself. In a first-principles question, only the full method earns the marks.</div>`,
        say: [
          'You can check your answer with the power rule. The derivative of two x squared is four x, and of minus three x is minus three. It matches.',
          'Use the rule to check yourself, but in a first principles question, only the full method earns the marks.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Write <b>lim h→0</b> on every line, until you actually let h → 0</span></li>
          <li data-at="2"><span>(x + h)² = <b>x² + 2xh + h²</b>, not x² + h²</span></li>
          <li data-at="3"><span>Never put h = 0 while h is still in the denominator: <b>factorise and cancel first</b></span></li>
        </ul>`,
        say: [
          'Three mistakes to avoid.',
          'Keep writing the limit on every line, until you actually let h tend to zero.',
          'Expand x plus h, all squared, properly. It is x squared, plus two x h, plus h squared, not just x squared plus h squared.',
          'And never put h equal to zero while h is still in the denominator. Factorise and cancel first.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Differential Calculus.</em></h1>
        <div class="cta">Open Differential Calculus in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Differential Calculus in DONE WELL, and practise first principles questions with every step explained."] },
    ],
  }
})()
