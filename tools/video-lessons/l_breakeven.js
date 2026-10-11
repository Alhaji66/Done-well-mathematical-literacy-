{
  // Vetkoek stall: fixed R600 a month, R3,50 to make each, sold at R8.
  const fixed = 600, unit = 3.5, price = 8
  const be = fixed / (price - unit) // 133,33...
  const X = (n) => 70 + (n / 200) * 360, Y = (r) => 300 - (r / 1800) * 270
  const line = (f, col) => `<line x1="${X(0)}" y1="${Y(f(0))}" x2="${X(200)}" y2="${Y(f(200))}" stroke="${col}" stroke-width="4"/>`
  const graph = `<svg width="460" height="350" viewBox="0 0 460 350" style="flex:none">
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(200) + 10}" y2="${Y(0)}" stroke="#8499bd" stroke-width="2"/>
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(1800)}" stroke="#8499bd" stroke-width="2"/>
    ${[0, 50, 100, 150, 200].map((n) => `<text x="${X(n)}" y="${Y(0) + 22}" text-anchor="middle" fill="#adbbd3" font-size="15">${n}</text>`).join('')}
    ${[0, 600, 1200, 1800].map((r) => `<text x="${X(0) - 8}" y="${Y(r) + 5}" text-anchor="end" fill="#adbbd3" font-size="15">${r}</text>`).join('')}
    <text x="${X(100)}" y="${Y(0) + 44}" text-anchor="middle" fill="#adbbd3" font-size="15">number of vetkoek sold</text>
    <g data-at="1">${line((n) => fixed + unit * n, '#f2a07b')}<text x="${X(30)}" y="${Y(fixed + unit * 30) - 12}" fill="#f2a07b" font-size="17" font-weight="800">Cost</text></g>
    <g data-at="2">${line((n) => price * n, '#9be29b')}<text x="${X(200) - 80}" y="${Y(price * 200) - 8}" fill="#9be29b" font-size="17" font-weight="800">Income</text></g>
    <g data-at="3"><circle cx="${X(be)}" cy="${Y(price * be)}" r="7" fill="#e6af38"/>
      <line x1="${X(be)}" y1="${Y(price * be)}" x2="${X(be)}" y2="${Y(0)}" stroke="#e6af38" stroke-width="2" stroke-dasharray="5 5"/>
      <text x="${X(be) + 12}" y="${Y(price * be) + 34}" fill="#edc561" font-size="17" font-weight="800">break-even</text></g>
  </svg>`

  window.LESSON = {
    id: 'matlit-break-even',
    crumb: 'Mathematical Literacy · Finance',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Mathematical Literacy · Finance · Grades 10–12</div>
        <h1>Break-even analysis</h1>
        <div class="sub">Fixed and variable costs, the cost and income formulas, the break-even point from a calculation and a graph, and profit.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn how to find the break-even point of a small business, by calculation and from a graph, and how to work out its profit.'] },
      { id: 'costs', html: `
        <div class="eyebrow">The business</div>
        <h2>Sipho sells vetkoek from a stall</h2>
        <ul class="pts">
          <li data-at="1"><span><b>Fixed cost:</b> R600 a month for the stall, however many he sells</span></li>
          <li data-at="2"><span><b>Variable cost:</b> R3,50 to make <em class="k">each</em> vetkoek</span></li>
          <li data-at="3"><span><b>Selling price:</b> R8 per vetkoek</span></li>
        </ul>
        <div class="steps tight">
          <div class="step" data-at="4"><span class="lbl">Cost</span>Total cost = 600 + 3,50 × n</div>
          <div class="step" data-at="4"><span class="lbl">Income</span>Income = 8 × n</div>
        </div>`,
        say: [
          'Sipho sells vetkoek from a stall.',
          'He pays a fixed cost of six hundred rand a month for the stall. It stays the same however many he sells.',
          'Each vetkoek costs three rand fifty to make. That is a variable cost: it grows with every vetkoek.',
          'He sells them at eight rand each.',
          'So for n vetkoek, his total cost is six hundred plus three comma five zero times n, and his income is eight times n.',
        ] },
      { id: 'calc', html: `
        <div class="eyebrow">The break-even point</div>
        <h2>Where income exactly covers the costs</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Equal</span>8n = 600 + 3,50n</div>
          <div class="step" data-at="2"><span class="lbl">Solve</span>4,50n = 600 &nbsp;→&nbsp; n = 133,3</div>
          <div class="step ans" data-at="3"><span class="lbl">Answer</span>He must sell 134 vetkoek to break even</div>
        </div>`,
        say: [
          'The break-even point is where the income exactly covers the costs: no profit and no loss.',
          'Set income equal to cost: eight n equals six hundred plus three comma five zero n.',
          'Subtract three comma five zero n from both sides: four comma five zero n equals six hundred, so n is one hundred and thirty three comma three.',
          'He cannot sell part of a vetkoek, and one hundred and thirty three would leave a small loss, so he must sell one hundred and thirty four to break even.',
        ] },
      { id: 'graph', html: `
        <div class="eyebrow">On a graph</div>
        <h2>The break-even point is where the lines cross</h2>
        <div style="display:flex;gap:36px;align-items:center;margin-top:6px">
          ${graph}
          <ul class="pts" style="margin-top:0">
            <li data-at="4"><span>Left of it: cost above income, a <b>loss</b></span></li>
            <li data-at="4"><span>Right of it: income above cost, a <b>profit</b></span></li>
          </ul>
        </div>`,
        say: [
          'The same thing on a graph.',
          'The cost line starts at six hundred rand, the fixed cost, and rises by three rand fifty for each vetkoek.',
          'The income line starts at zero and rises more steeply, by eight rand for each one.',
          'The lines cross at the break-even point, about one hundred and thirty three vetkoek.',
          'To the left the cost line is higher, so he makes a loss. To the right the income line is higher, so he makes a profit.',
        ] },
      { id: 'profit', html: `
        <div class="eyebrow">Profit</div>
        <h2>What if he sells 200 vetkoek in a month?</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Income</span>8 × 200 = R1&nbsp;600</div>
          <div class="step" data-at="2"><span class="lbl">Cost</span>600 + 3,50 × 200 = R1&nbsp;300</div>
          <div class="step ans" data-at="3"><span class="lbl">Profit</span>R1&nbsp;600 − R1&nbsp;300 = R300</div>
        </div>`,
        say: [
          'Now the profit if he sells two hundred vetkoek in a month.',
          'Income: eight times two hundred is one thousand six hundred rand.',
          'Cost: six hundred plus three comma five zero times two hundred, which is one thousand three hundred rand.',
          'Profit is income minus cost: three hundred rand.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Forgetting the <b>fixed cost</b>: it is paid even if nothing is sold</span></li>
          <li data-at="2"><span>Rounding the break-even point <b>down</b>: round up to a whole item</span></li>
          <li data-at="3"><span>Calling the break-even point a profit: at break-even the profit is <b>R0</b></span></li>
        </ul>`,
        say: [
          'Watch out for three common mistakes.',
          'Forgetting the fixed cost. It has to be paid even if nothing is sold.',
          'Rounding the break-even point down. Round up to the next whole item, or there is still a small loss.',
          'And calling the break-even point a profit. At break-even, the profit is zero.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Finance.</em></h1>
        <div class="cta">Open Finance in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Finance in DONE WELL and practise break-even questions, with every mark explained."] },
    ],
  }
}
