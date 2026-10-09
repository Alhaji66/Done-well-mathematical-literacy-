(function () {
  const fr = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`
  const arrow = (x1, y, x2, color) => {
    const d = x2 > x1 ? 1 : -1
    return `<line x1="${x1}" y1="${y}" x2="${x2 - d * 12}" y2="${y}" stroke="${color}" stroke-width="5" stroke-linecap="round"/><path d="M${x2},${y} l${-d * 18},-10 v20 z" fill="${color}"/>`
  }
  const wall = `<svg class="diagram" style="right:70px;top:170px" width="470" height="330" viewBox="0 0 470 330">
    <rect x="400" y="20" width="34" height="290" fill="#24406e" stroke="#8499bd"/>
    ${Array.from({ length: 10 }, (_, i) => `<line x1="434" y1="${30 + i * 28}" x2="452" y2="${16 + i * 28}" stroke="#8499bd" stroke-width="2"/>`).join('')}
    <g data-at="0"><text x="20" y="40" fill="#adbbd3" font-size="17" font-weight="700">BEFORE</text>
      <circle cx="330" cy="95" r="26" fill="#e6af38"/>${arrow(140, 95, 290, '#e6af38')}
      <text x="150" y="80" fill="#fff" font-size="20" font-weight="700">20 m·s⁻¹</text></g>
    <g data-at="0"><text x="20" y="200" fill="#adbbd3" font-size="17" font-weight="700">AFTER</text>
      <circle cx="330" cy="255" r="26" fill="#e6af38"/>${arrow(280, 255, 140, '#7fb3ff')}
      <text x="150" y="240" fill="#fff" font-size="20" font-weight="700">15 m·s⁻¹</text></g>
    <g data-at="2"><rect x="18" y="290" width="220" height="34" rx="8" fill="rgba(230,175,56,.12)" stroke="#e6af38"/>
      <text x="30" y="313" fill="#edc561" font-size="17" font-weight="800">+ towards the wall →</text></g>
  </svg>`
  window.LESSON = {
    id: 'physics-momentum-impulse',
    crumb: 'Physical Sciences · Momentum and Impulse',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Physical Sciences · Mechanics · Grade 12</div>
        <h1>Momentum and impulse</h1>
        <div class="sub">What momentum and impulse are, how they connect, and a full worked example.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn what momentum and impulse are, how they are connected, and how to solve a typical exam question.'] },
      { id: 'momentum', html: `
        <div class="eyebrow">Momentum</div>
        <h2>Momentum = mass × velocity</h2>
        <div class="box gold" data-at="0" style="font-size:38px;padding:20px 28px;align-self:flex-start"><span class="math">p = mv</span></div>
        <ul class="pts">
          <li data-at="1"><span>A <b>vector</b>: it has a direction, so choose a positive direction</span></li>
          <li data-at="2"><span>Unit: <b>kg·m·s⁻¹</b></span></li>
          <li data-at="3"><span>1 500 kg × 12 m·s⁻¹ north = <b>18 000 kg·m·s⁻¹ north</b></span></li>
        </ul>`,
        say: [
          "Momentum is the product of an object's mass and its velocity. p equals m v.",
          'Momentum is a vector, so it always has a direction. You must choose a positive direction.',
          'It is measured in kilogram metres per second.',
          'For example, a one thousand five hundred kilogram car moving at twelve metres per second north has a momentum of eighteen thousand kilogram metres per second, north.',
        ] },
      { id: 'impulse', html: `
        <div class="eyebrow">Impulse</div>
        <h2>Impulse is the change in momentum</h2>
        <div class="box gold" data-at="1" style="font-size:34px;padding:20px 28px;align-self:flex-start"><span class="math">F<sub>net</sub>Δt = Δp = mv<sub>f</sub> − mv<sub>i</sub></span></div>
        <ul class="pts">
          <li data-at="2"><span>Unit: <b>N·s</b>, the same as kg·m·s⁻¹</span></li>
          <li data-at="3"><span>Newton's second law in momentum form: <span class="math" style="font-size:30px">F<sub>net</sub> = ${fr('Δp', 'Δt')}</span></span></li>
        </ul>`,
        say: [
          'Impulse is the product of the net force and the time for which it acts. And impulse equals the change in momentum.',
          'So F net times delta t equals m v final, minus m v initial.',
          'Impulse is measured in newton seconds, which is the same as kilogram metres per second.',
          "Rearranged, this is Newton's second law in terms of momentum: the net force equals the rate of change of momentum.",
        ] },
      { id: 'problem', html: `
        <div class="eyebrow">Worked example</div>
        <h2 style="max-width:640px">A ball bounces off a wall</h2>
        <div class="box problem" data-at="0" style="max-width:640px;font-size:25px">A 0,15 kg ball hits a wall at 20 m·s⁻¹ and bounces straight back at 15 m·s⁻¹. It is in contact with the wall for 0,05 s.</div>
        <div class="box gold problem" data-at="1" style="max-width:640px;font-size:25px">Calculate the change in momentum of the ball, and the average force the wall exerts on it.</div>${wall}`,
        say: [
          'Here is an example. A zero comma one five kilogram ball hits a wall at twenty metres per second, and bounces straight back at fifteen metres per second. It is in contact with the wall for zero comma zero five seconds.',
          'Calculate the change in momentum of the ball, and the average force that the wall exerts on it.',
          'First, choose a positive direction. Take towards the wall as positive, so the final velocity is negative fifteen metres per second.',
        ] },
      { id: 'solve', html: `
        <div class="eyebrow">Solution</div>
        <h2>Signs first, then substitute</h2>
        <div class="steps tight">
          <div class="step" data-at="0"><span class="lbl">Formula</span>Δp = mv<sub>f</sub> − mv<sub>i</sub></div>
          <div class="step" data-at="1"><span class="lbl">Substitute</span>= (0,15)(−15) − (0,15)(20)</div>
          <div class="step ans" data-at="2"><span class="lbl">Δp</span>= −5,25 kg·m·s⁻¹ (5,25 away from the wall)</div>
          <div class="step" data-at="3"><span class="lbl">Force</span>F<sub>net</sub> = ${fr('Δp', 'Δt')} = ${fr('−5,25', '0,05')} = −105 N</div>
          <div class="step ans" data-at="4"><span class="lbl">Answer</span>105 N away from the wall</div>
        </div>`,
        say: [
          'The change in momentum is m v final, minus m v initial.',
          'That is zero comma one five times negative fifteen, minus zero comma one five times twenty.',
          'Negative two comma two five, minus three, gives negative five comma two five kilogram metres per second. That is five comma two five, away from the wall.',
          'The average force is the change in momentum divided by the contact time. Negative five comma two five, divided by zero comma zero five, is negative one hundred and five newtons.',
          'So the wall exerts an average force of one hundred and five newtons on the ball, away from the wall.',
        ] },
      { id: 'safety', html: `
        <div class="eyebrow">Why it matters</div>
        <h2>Airbags and crumple zones: same Δp, longer Δt, smaller force</h2>
        <ul class="pts">
          <li data-at="1"><span>In a crash, the change in momentum is <b>fixed</b></span></li>
          <li data-at="1"><span>An airbag or crumple zone makes the collision <b>last longer</b></span></li>
          <li data-at="2"><span>F<sub>net</sub> = Δp ÷ Δt, so a longer time means a <em class="k">smaller force</em></span></li>
          <li data-at="3"><span>They do <b>not</b> reduce the change in momentum: they spread it over more time</span></li>
        </ul>`,
        say: [
          'This explains many safety features.',
          "In a crash, the change in the passenger's momentum is fixed. An airbag or a crumple zone makes the collision last longer.",
          'Since the net force equals the change in momentum divided by the time, a longer time means a smaller force on the passenger.',
          'Remember, they do not reduce the change in momentum. They spread it over a longer time.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Choose a positive direction: a <b>rebound velocity is negative</b></span></li>
          <li data-at="2"><span>Give a <b>direction</b> with every momentum, impulse and force answer</span></li>
          <li data-at="3"><span>Δp = <b>final − initial</b>, never initial − final</span></li>
        </ul>`,
        say: [
          'Three mistakes to avoid.',
          'Always choose a positive direction. A velocity after a rebound is negative.',
          'Give a direction with every momentum, impulse and force answer.',
          'And the change in momentum is final minus initial, never the other way round.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Momentum and Impulse.</em></h1>
        <div class="cta">Open Momentum and Impulse in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Momentum and Impulse in DONE WELL, and practise exam questions with every step explained."] },
    ],
  }
})()
