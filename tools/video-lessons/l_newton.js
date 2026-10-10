{
  // A 5 kg crate pulled along a rough floor: F = 40 N, μk = 0,3, g = 9,8 m·s⁻².
  const ar = (x1, y1, x2, y2, col) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 14
    const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)]
    const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)]
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="4"/><polygon points="${x2},${y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}" fill="${col}"/>`
  }
  const fbd = `<svg width="430" height="380" viewBox="0 0 430 380" style="flex:none">
    <line x1="20" y1="250" x2="410" y2="250" stroke="#8499bd" stroke-width="3"/>
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${30 + i * 30}" y1="252" x2="${18 + i * 30}" y2="266" stroke="#8499bd" stroke-width="2"/>`).join('')}
    <rect x="160" y="170" width="110" height="80" rx="6" fill="#24406e" stroke="#c9d4e8" stroke-width="2"/>
    <text x="196" y="217" fill="#fff" font-size="22" font-weight="800">5 kg</text>
    <g data-at="1">${ar(270, 210, 390, 210, '#e6af38')}<text x="330" y="196" fill="#edc561" font-size="20" font-weight="800">F = 40 N</text></g>
    <g data-at="2">${ar(215, 250, 215, 360, '#f2a07b')}<text x="228" y="350" fill="#f2a07b" font-size="20" font-weight="800">w = 49 N</text>
      ${ar(215, 170, 215, 60, '#9be29b')}<text x="228" y="80" fill="#9be29b" font-size="20" font-weight="800">N = 49 N</text></g>
    <g data-at="3">${ar(160, 230, 50, 230, '#7fb3ff')}<text x="40" y="216" fill="#7fb3ff" font-size="20" font-weight="800">f = 14,7 N</text></g>
  </svg>`

  window.LESSON = {
    id: 'physics-newtons-laws',
    crumb: "Physical Sciences · Newton's Laws",
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Physical Sciences · Mechanics · Grades 11–12</div>
        <h1>Newton's laws and free-body diagrams</h1>
        <div class="sub">The three laws in plain words, how to draw a free-body diagram, and a worked example with friction.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ["Welcome to DONE WELL. In this lesson you will learn Newton's three laws, how to draw a free-body diagram, and how to use the second law to solve a problem with friction."] },
      { id: 'laws', html: `
        <div class="eyebrow">The three laws</div>
        <h2>What each law says, in plain words</h2>
        <ul class="pts">
          <li data-at="1"><span><b>First law (inertia):</b> an object stays at rest, or keeps moving at constant velocity, unless a <em class="k">net force</em> acts on it</span></li>
          <li data-at="2"><span><b>Second law:</b> a net force makes an object accelerate in the direction of the force: <em class="k">F<sub>net</sub> = ma</em></span></li>
          <li data-at="3"><span><b>Third law:</b> when A pushes on B, B pushes back on A with an equal force in the <em class="k">opposite direction</em></span></li>
        </ul>`,
        say: [
          "Here are Newton's three laws in plain words.",
          'The first law is about inertia. An object stays at rest, or keeps moving at a constant velocity, unless a net force acts on it.',
          'The second law says that a net force makes an object accelerate, in the direction of the net force. The net force equals mass times acceleration.',
          'The third law says that when object A pushes on object B, B pushes back on A with a force that is equal in size and opposite in direction.',
        ] },
      { id: 'fbd', html: `
        <div class="eyebrow">Worked example</div>
        <h2>A 5&nbsp;kg crate is pulled with 40&nbsp;N along a rough floor (μ<sub>k</sub>&nbsp;=&nbsp;0,3)</h2>
        <div style="display:flex;gap:36px;align-items:center;margin-top:8px">
          ${fbd}
          <div class="steps tight" style="flex:1;margin-top:0">
            <div class="step" data-at="1"><span class="lbl">Applied</span>F = 40 N to the right</div>
            <div class="step" data-at="2"><span class="lbl">Weight</span>w = mg = 5 × 9,8 = 49 N; N = 49 N</div>
            <div class="step" data-at="3"><span class="lbl">Friction</span>f = μ<sub>k</sub>N = 0,3 × 49 = 14,7 N</div>
          </div>
        </div>`,
        say: [
          'Here is a typical question. A five kilogram crate is pulled along a rough floor by a horizontal force of forty newtons. The coefficient of kinetic friction is zero comma three. First, draw a free-body diagram: the crate as a box, and an arrow for every force acting on it.',
          'The applied force is forty newtons, to the right.',
          'The weight is mass times g: five times nine comma eight, which is forty nine newtons, downwards. The floor pushes up with a normal force of forty nine newtons, because the crate does not move up or down.',
          'Friction acts against the motion. It is the coefficient times the normal force: zero comma three times forty nine, which is fourteen comma seven newtons, to the left.',
        ] },
      { id: 'second', html: `
        <div class="eyebrow">Newton's second law</div>
        <h2>Add the forces along the motion, then F<sub>net</sub> = ma</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Positive</span>take to the right as positive</div>
          <div class="step" data-at="2"><span class="lbl">F<sub>net</sub></span>40 + (−14,7) = 25,3 N to the right</div>
          <div class="step ans" data-at="3"><span class="lbl">a</span>25,3 = 5 × a &nbsp;→&nbsp; a = 5,06 m·s⁻² to the right</div>
        </div>`,
        say: [
          'Now use the second law along the direction of motion.',
          'Choose a positive direction. Take to the right as positive.',
          'The net force is forty newtons plus negative fourteen comma seven newtons, which is twenty five comma three newtons to the right. The weight and the normal force cancel, so they do not appear.',
          'Net force equals mass times acceleration: twenty five comma three equals five times a. So the acceleration is five comma zero six metres per second squared, to the right.',
        ] },
      { id: 'third', html: `
        <div class="eyebrow">Third-law pairs</div>
        <h2>Action and reaction act on different objects</h2>
        <ul class="pts">
          <li data-at="1"><span>The crate pushes down on the floor; the floor pushes up on the crate</span></li>
          <li data-at="2"><span>Weight and normal force are <b>not</b> a third-law pair: both act on the <em class="k">same</em> crate</span></li>
          <li data-at="3"><span>The weight's partner is the crate pulling the <b>Earth</b> upwards</span></li>
        </ul>`,
        say: [
          'A last word on the third law, because it is often confused.',
          'The crate pushes down on the floor, and the floor pushes up on the crate. That is a third-law pair.',
          'The weight and the normal force are not a third-law pair, even though they are equal and opposite here. They both act on the same object, the crate.',
          "The partner of the crate's weight is the crate pulling the Earth upwards with forty nine newtons.",
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Using the applied force instead of the <b>net</b> force in F = ma</span></li>
          <li data-at="2"><span>Confusing mass (kg) with weight (N): <b>w = mg</b></span></li>
          <li data-at="3"><span>Free-body diagrams with forces the object exerts, or with <b>missing labels</b></span></li>
          <li data-at="4"><span>Leaving out the <b>direction</b> of a force or an acceleration</span></li>
        </ul>`,
        say: [
          'Watch out for four common mistakes.',
          'Using the applied force instead of the net force in F equals m a.',
          'Confusing mass, in kilograms, with weight, in newtons. Weight is mass times g.',
          'Drawing forces that the object exerts on other things, or forgetting to label the arrows. A free-body diagram shows only the forces acting on the object.',
          'And leaving out the direction of a force or an acceleration. Both are vectors.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Newton's Laws.</em></h1>
        <div class="cta">Open Newton's Laws in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Newton's Laws in DONE WELL and practise free-body diagrams and the second law, with every mark explained."] },
    ],
  }
}
