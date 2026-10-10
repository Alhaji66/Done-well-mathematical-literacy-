{
  // 12 V battery; R1 = 4 Ω in series with (6 Ω ∥ 3 Ω) = 2 Ω. Total 6 Ω, I = 2 A.
  const res = (x, y, w, h, lab, step) =>
    `<g data-at="${step}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#24406e" stroke="#e6af38" stroke-width="2.5"/><text x="${x + w / 2}" y="${y - 10}" text-anchor="middle" fill="#edc561" font-size="19" font-weight="800">${lab}</text></g>`
  const wire = 'stroke="#c9d4e8" stroke-width="3" fill="none"'
  const circuit = `<svg width="460" height="360" viewBox="0 0 460 360" style="flex:none">
    <path d="M60 300 V60 H170" ${wire}/><path d="M230 60 H300" ${wire}/>
    <path d="M300 60 V40 H340 M380 40 H420 V60 M300 60 V140 H340 M380 140 H420 V60" ${wire}/>
    <path d="M420 60 V300 H120" ${wire}/>
    <line x1="120" y1="282" x2="120" y2="318" stroke="#fff" stroke-width="4"/><line x1="100" y1="290" x2="100" y2="310" stroke="#fff" stroke-width="6"/>
    <path d="M100 300 H60" ${wire}/>
    <text x="70" y="345" fill="#fff" font-size="19" font-weight="800">12 V</text>
    ${res(170, 48, 60, 24, 'R₁ = 4 Ω', 0)}
    ${res(340, 28, 40, 24, '6 Ω', 0)}${res(340, 128, 40, 24, '3 Ω', 0)}
  </svg>`

  window.LESSON = {
    id: 'physics-series-parallel',
    crumb: 'Physical Sciences · Electric Circuits',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Physical Sciences · Electricity · Grade 11</div>
        <h1>Series and parallel circuits</h1>
        <div class="sub">How current and voltage behave in series and in parallel, and a full circuit worked out with Ohm's law.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ["Welcome to DONE WELL. In this lesson you will learn how current and potential difference behave in series and parallel circuits, and how to work out every current and voltage in a circuit using Ohm's law."] },
      { id: 'rules', html: `
        <div class="eyebrow">The rules</div>
        <h2>Series shares the voltage. Parallel shares the current.</h2>
        <div class="cols">
          <div class="col" data-at="1"><h3>Series</h3><p>The <b>same current</b> flows through each resistor.<br>The voltages <b>add up</b>.<br>R<sub>s</sub> = R₁ + R₂ + …</p></div>
          <div class="col" data-at="2"><h3>Parallel</h3><p>Each branch has the <b>same voltage</b>.<br>The currents <b>add up</b>.<br>1/R<sub>p</sub> = 1/R₁ + 1/R₂ + …</p></div>
        </div>
        <div class="box" data-at="3"><span class="lead" style="margin:0">Ohm's law for every part: <b class="hl">V = IR</b></span></div>`,
        say: [
          'Here are the rules you need.',
          'In series, the same current flows through every resistor, and the voltages across them add up to the total. The resistances simply add.',
          'In parallel, every branch has the same voltage across it, and the currents in the branches add up to the total current. For the resistance, one over R parallel is one over R one plus one over R two.',
          "And Ohm's law, V equals I R, works for every part of the circuit.",
        ] },
      { id: 'circuit', html: `
        <div class="eyebrow">Worked example</div>
        <h2>Find the current from the battery, and the current in each branch</h2>
        <div style="display:flex;gap:40px;align-items:center;margin-top:6px">
          ${circuit}
          <div class="steps tight" style="flex:1;margin-top:0">
            <div class="step" data-at="1"><span class="lbl">Parallel</span>1/R<sub>p</sub> = 1/6 + 1/3 &nbsp;→&nbsp; R<sub>p</sub> = 2 Ω</div>
            <div class="step" data-at="2"><span class="lbl">Total</span>R = 4 + 2 = 6 Ω</div>
            <div class="step ans" data-at="3"><span class="lbl">Current</span>I = V ÷ R = 12 ÷ 6 = 2 A</div>
          </div>
        </div>`,
        say: [
          'Here is the circuit. A twelve volt battery, with a four ohm resistor in series with a six ohm and a three ohm resistor in parallel. Ignore the internal resistance of the battery.',
          'Start with the parallel part. One over R parallel is one sixth plus one third, which is one half. So R parallel is two ohms.',
          'That two ohms is in series with the four ohm resistor, so the total resistance is six ohms.',
          'The current from the battery is the voltage divided by the total resistance: twelve divided by six, which is two amperes.',
        ] },
      { id: 'split', html: `
        <div class="eyebrow">Now each part</div>
        <h2>Use V = IR on each part of the circuit</h2>
        <div class="steps tight">
          <div class="step" data-at="1"><span class="lbl">V across R₁</span>V = IR = 2 × 4 = 8 V</div>
          <div class="step" data-at="2"><span class="lbl">V parallel</span>12 − 8 = 4 V across both branches</div>
          <div class="step" data-at="3"><span class="lbl">6 Ω branch</span>I = 4 ÷ 6 = 0,67 A</div>
          <div class="step" data-at="4"><span class="lbl">3 Ω branch</span>I = 4 ÷ 3 = 1,33 A</div>
          <div class="step ans" data-at="5"><span class="lbl">Check</span>0,67 + 1,33 = 2 A ✓</div>
        </div>`,
        say: [
          'Now find each part.',
          'All two amperes pass through the four ohm resistor, so the voltage across it is two times four, which is eight volts.',
          'The voltages in series add up to twelve, so the parallel part has twelve minus eight, which is four volts, across both branches.',
          'The current in the six ohm branch is four divided by six: zero comma six seven amperes.',
          'The current in the three ohm branch is four divided by three: one comma three three amperes.',
          'Check: the branch currents add up to two amperes, the current from the battery. The smaller resistance takes the bigger current.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Forgetting to <b>invert</b>: 1/R<sub>p</sub> = ½ means R<sub>p</sub> = 2 Ω, not 0,5 Ω</span></li>
          <li data-at="2"><span>Using the <b>battery's</b> 12 V across a resistor that only has part of it</span></li>
          <li data-at="3"><span>Thinking parallel resistors add: R<sub>p</sub> is <b>smaller</b> than the smallest branch</span></li>
        </ul>`,
        say: [
          'Watch out for three common mistakes.',
          'Forgetting to invert at the end. If one over R parallel is a half, then R parallel is two ohms, not zero comma five.',
          'Using the full twelve volts across a resistor that only gets part of it. Use V equals I R on that resistor.',
          'And adding parallel resistors. A parallel combination is always smaller than the smallest resistor in it.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Electric Circuits.</em></h1>
        <div class="cta">Open Electric Circuits in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Electric Circuits in DONE WELL and practise series and parallel circuits, with every mark explained."] },
    ],
  }
}
