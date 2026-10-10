{
  // Circle centre O; A, B, C, D, E on it. Minor arc AC (through D) is 130°, so
  // ∠AOC = 130°, ∠ABC = ∠AEC = 65° and ∠ADC = 115°.
  const cx = 230, cy = 205, r = 150
  const at = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)]
  const P = { A: at(205), C: at(335), D: at(270), B: at(115), E: at(55) }
  const off = { A: [-26, 10], C: [12, 10], D: [-6, 30], B: [-24, -8], E: [8, -8] }
  const seg = (p, q, cls = '') => `<line x1="${P[p][0]}" y1="${P[p][1]}" x2="${P[q][0]}" y2="${P[q][1]}" stroke="${cls || '#c9d4e8'}" stroke-width="2.5"/>`
  const toO = (p, col) => `<line x1="${cx}" y1="${cy}" x2="${P[p][0]}" y2="${P[p][1]}" stroke="${col}" stroke-width="2.5"/>`
  const lab = (k) => `<text x="${P[k][0] + off[k][0]}" y="${P[k][1] + off[k][1]}" fill="#fff" font-size="24" font-weight="800">${k}</text>`
  const angle = (k, text, dx, dy, col, step) => `<text data-at="${step}" x="${P[k][0] + dx}" y="${P[k][1] + dy}" fill="${col}" font-size="20" font-weight="800">${text}</text>`
  const fig = `<svg width="470" height="400" viewBox="0 0 470 400" style="flex:none">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#8499bd" stroke-width="2.5"/>
    ${toO('A', '#e6af38')}${toO('C', '#e6af38')}
    <circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/><text x="${cx - 8}" y="${cy - 12}" fill="#fff" font-size="22" font-weight="800">O</text>
    <text x="${cx - 26}" y="${cy + 38}" fill="#edc561" font-size="20" font-weight="800">130°</text>
    <g data-at="1">${seg('B', 'A', '#7fb3ff')}${seg('B', 'C', '#7fb3ff')}</g>
    <g data-at="2">${seg('E', 'A', '#9be29b')}${seg('E', 'C', '#9be29b')}</g>
    <g data-at="3">${seg('D', 'A', '#f2a07b')}${seg('D', 'C', '#f2a07b')}</g>
    ${['A', 'B', 'C', 'D', 'E'].map(lab).join('')}
    ${angle('B', '65°', -8, 44, '#7fb3ff', 1)}${angle('E', '65°', -44, 40, '#9be29b', 2)}${angle('D', '115°', -22, -20, '#f2a07b', 3)}
  </svg>`

  window.LESSON = {
    id: 'maths-circle-geometry',
    crumb: 'Mathematics · Euclidean Geometry',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Mathematics · Euclidean Geometry · Grades 11–12</div>
        <h1>Circle geometry: the angle theorems</h1>
        <div class="sub">The theorems you use most, how to write a statement with its reason, and a worked example.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn the angle theorems of circle geometry, how to set out each step with its reason, and how to solve a typical exam question.'] },
      { id: 'theorems', html: `
        <div class="eyebrow">The theorems</div>
        <h2>Four angle theorems do most of the work</h2>
        <ul class="pts">
          <li data-at="1"><span>The angle at the <b>centre</b> is <em class="k">twice</em> the angle at the circumference, on the same arc</span></li>
          <li data-at="2"><span>Angles in the <b>same segment</b> are <em class="k">equal</em></span></li>
          <li data-at="3"><span>Opposite angles of a <b>cyclic quadrilateral</b> add up to <em class="k">180°</em></span></li>
          <li data-at="4"><span>The angle between a <b>tangent and a chord</b> equals the angle in the <em class="k">alternate segment</em></span></li>
        </ul>`,
        say: [
          'Four angle theorems do most of the work in circle geometry.',
          'First: the angle at the centre is twice the angle at the circumference, when both stand on the same arc.',
          'Second: angles in the same segment are equal. They stand on the same chord, on the same side.',
          'Third: the opposite angles of a cyclic quadrilateral add up to one hundred and eighty degrees. A cyclic quadrilateral has all four corners on the circle.',
          'Fourth: the angle between a tangent and a chord equals the angle in the alternate segment.',
        ] },
      { id: 'problem', html: `
        <div class="eyebrow">Worked example</div>
        <h2>O is the centre and ∠AOC&nbsp;=&nbsp;130°. Find ∠B, ∠E and ∠D.</h2>
        <div style="display:flex;gap:40px;align-items:center;margin-top:10px">
          ${fig}
          <div class="steps tight" style="flex:1;margin-top:0">
            <div class="step" data-at="1"><span class="lbl">∠ABC</span>= ½ × 130° = 65°</div>
            <div class="step" data-at="2"><span class="lbl">∠AEC</span>= ∠ABC = 65°</div>
            <div class="step ans" data-at="3"><span class="lbl">∠ADC</span>= 180° − 65° = 115°</div>
          </div>
        </div>`,
        say: [
          'Here is a typical question. O is the centre of the circle, and angle A O C is one hundred and thirty degrees. Find the angles at B, E and D.',
          'Angle A B C stands on the same arc as the angle at the centre, so it is half of one hundred and thirty degrees: sixty five degrees.',
          'Angle A E C is in the same segment as angle A B C, both standing on chord A C, so it is also sixty five degrees.',
          'A B C D is a cyclic quadrilateral, so angle A D C is one hundred and eighty minus sixty five: one hundred and fifteen degrees.',
        ] },
      { id: 'reasons', html: `
        <div class="eyebrow">Statement and reason</div>
        <h2>Every step needs its reason, or it earns only half the marks</h2>
        <table class="t">
          <tr><th>Statement</th><th>Reason</th></tr>
          <tr data-at="1"><td>∠ABC = 65°</td><td>∠ at centre = 2 × ∠ at circumference</td></tr>
          <tr data-at="2"><td>∠AEC = 65°</td><td>∠s in the same segment</td></tr>
          <tr data-at="3"><td>∠ADC = 115°</td><td>opp ∠s of cyclic quad ABCD</td></tr>
        </table>`,
        say: [
          'In the exam, write every step as a statement with its reason. A correct angle without a reason earns only half the marks.',
          'Angle A B C equals sixty five degrees. Reason: angle at centre equals twice the angle at the circumference.',
          'Angle A E C equals sixty five degrees. Reason: angles in the same segment.',
          'Angle A D C equals one hundred and fifteen degrees. Reason: opposite angles of cyclic quadrilateral A B C D. Name the quadrilateral, so the marker knows which one you mean.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Halving the wrong angle: the centre angle and the circumference angle must stand on the <b>same arc</b></span></li>
          <li data-at="2"><span>Calling a quadrilateral cyclic when one corner is <b>not on the circle</b> (O is never on it)</span></li>
          <li data-at="3"><span>Writing an angle with <b>no reason</b>, or a vague one like "circle theorem"</span></li>
        </ul>`,
        say: [
          'Watch out for three common mistakes.',
          'Halving the wrong angle. The angle at the centre and the angle at the circumference must stand on the same arc. Check which arc each one faces.',
          'Calling a quadrilateral cyclic when one of its corners is not on the circle. The centre O is never on the circle, so a quadrilateral that uses O is not cyclic.',
          'And writing an angle with no reason, or with a vague one like circle theorem. Give the exact theorem.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Euclidean Geometry.</em></h1>
        <div class="cta">Open Euclidean Geometry in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Euclidean Geometry in DONE WELL and practise circle geometry, with every statement and reason explained."] },
    ],
  }
}
