window.LESSON = {
  id: 'physics-generators-ac',
  crumb: 'Physical Sciences · Electrodynamics',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Physical Sciences · Electricity · Grade 12</div>
      <h1>Generators, motors and alternating current</h1>
      <div class="sub">How a generator works, AC against DC, and the rms values used in every AC calculation.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how a generator works, how AC and DC generators differ, and how to use rms values in an AC calculation.'] },
    { id: 'generator', html: `
      <div class="eyebrow">The generator</div>
      <h2>A coil turning in a magnetic field: mechanical energy to electrical energy</h2>
      <ul class="pts">
        <li data-at="1"><span>As the coil rotates, the <b>magnetic flux</b> through it keeps changing</span></li>
        <li data-at="2"><span>By <b>Faraday's law</b>, a changing flux induces an emf in the coil</span></li>
        <li data-at="3"><span>A <b>motor</b> is the reverse: a current in a coil in a magnetic field makes it turn</span></li>
      </ul>`,
      say: [
        'A generator changes mechanical energy into electrical energy, with a coil turning in a magnetic field.',
        'As the coil rotates, the magnetic flux through it keeps changing.',
        "By Faraday's law of electromagnetic induction, a changing flux induces an emf, and a current flows in the circuit.",
        'A motor works the other way round: a current in a coil in a magnetic field experiences a force that makes it turn. It changes electrical energy into mechanical energy.',
      ] },
    { id: 'acdc', html: `
      <div class="eyebrow">AC or DC?</div>
      <h2>The difference is how the coil connects to the circuit</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>AC generator</h3><p><b>Slip rings</b>: each end of the coil stays connected to the same brush, so the current <b>reverses</b> every half turn.</p></div>
        <div class="col" data-at="2"><h3>DC generator</h3><p>A <b>split-ring commutator</b> swaps the connections every half turn, so the current in the circuit always flows <b>one way</b>.</p></div>
      </div>`,
      say: [
        'AC and DC generators differ in one part: how the coil connects to the outside circuit.',
        'An AC generator uses slip rings. Each end of the coil stays connected to the same brush, so the current reverses direction every half turn. That is alternating current.',
        'A DC generator uses a split-ring commutator. It swaps the connections every half turn, so the current in the outside circuit always flows in the same direction.',
      ] },
    { id: 'rms', html: `
      <div class="eyebrow">rms values</div>
      <h2>An AC value that gives the same power as that DC value</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl" style="text-transform:none;letter-spacing:0">V<sub>rms</sub></span>V<sub>rms</sub> = V<sub>max</sub> ÷ √2 &nbsp;&nbsp; I<sub>rms</sub> = I<sub>max</sub> ÷ √2</div>
        <div class="step" data-at="2"><span class="lbl">Power</span>P<sub>ave</sub> = V<sub>rms</sub> × I<sub>rms</sub></div>
        <div class="step ans" data-at="3"><span class="lbl">Mains</span>V<sub>max</sub> = 325 V &nbsp;→&nbsp; V<sub>rms</sub> = 325 ÷ √2 ≈ 230 V</div>
      </div>`,
      say: [
        'An AC voltage keeps changing, so we use its root mean square value: the DC value that would give the same power.',
        'The rms voltage is the maximum voltage divided by the square root of two. The same goes for current.',
        'The average power is the rms voltage times the rms current.',
        'South African mains electricity peaks at about three hundred and twenty five volts. Divided by the square root of two, that is about two hundred and thirty volts rms, the value printed on appliances.',
      ] },
    { id: 'example', html: `
      <div class="eyebrow">Worked example</div>
      <h2>A 2 000 W kettle runs on 230 V rms. Find I<sub>rms</sub> and I<sub>max</sub>.</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl" style="text-transform:none;letter-spacing:0">I<sub>rms</sub></span>P = V<sub>rms</sub>I<sub>rms</sub> &nbsp;→&nbsp; I<sub>rms</sub> = 2&nbsp;000 ÷ 230 = 8,70 A</div>
        <div class="step ans" data-at="2"><span class="lbl" style="text-transform:none;letter-spacing:0">I<sub>max</sub></span>I<sub>max</sub> = I<sub>rms</sub> × √2 = 8,70 × 1,414 = 12,30 A</div>
      </div>`,
      say: [
        'Here is a typical question. A two thousand watt kettle runs on two hundred and thirty volts rms. Find the rms current and the maximum current.',
        'Average power is V rms times I rms, so I rms is two thousand divided by two hundred and thirty: eight comma seven zero amperes.',
        'The maximum current is the rms current times the square root of two: twelve comma three zero amperes.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Using V<sub>max</sub> in P = VI: power uses <b>rms</b> values</span></li>
        <li data-at="2"><span>Multiplying by √2 when you should <b>divide</b>: rms is always smaller than the maximum</span></li>
        <li data-at="3"><span>Mixing up slip rings (<b>AC</b>) and the split-ring commutator (<b>DC</b>)</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Using the maximum voltage in P equals V I. Power calculations use rms values.',
        'Multiplying by the square root of two when you should divide. The rms value is always smaller than the maximum.',
        'And mixing up slip rings, which give AC, with the split-ring commutator, which gives DC.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Electrodynamics.</em></h1>
      <div class="cta">Open Electrodynamics in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Electrodynamics in DONE WELL and practise generators and AC, with every mark explained."] },
  ],
}
