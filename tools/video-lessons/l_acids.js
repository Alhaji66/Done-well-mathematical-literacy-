window.LESSON = {
  id: 'chem-acids-titration',
  crumb: 'Physical Sciences · Acids and Bases',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Physical Sciences · Chemical Change · Grade 12</div>
      <h1>Acids, bases, pH and titration</h1>
      <div class="sub">Definitions, strong against concentrated, pH from a concentration, and a titration calculation step by step.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn what acids and bases are, how to calculate pH, and how to work out a titration, step by step.'] },
    { id: 'defs', html: `
      <div class="eyebrow">Definitions</div>
      <h2>Lowry-Brønsted: acids donate protons, bases accept them</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>Acid</h3><p>A <b>proton (H⁺) donor</b>.<br>HCl + H₂O → H₃O⁺ + Cl⁻</p></div>
        <div class="col" data-at="2"><h3>Base</h3><p>A <b>proton (H⁺) acceptor</b>.<br>NH₃ + H₂O ⇌ NH₄⁺ + OH⁻</p></div>
      </div>
      <div class="box" data-at="3"><span class="lead" style="margin:0"><b class="hl">Strong</b> means it ionises completely. <b class="hl">Concentrated</b> means a lot of it is dissolved in a small volume. They are not the same.</span></div>`,
      say: [
        'In the Lowry-Brønsted theory, acids and bases are defined by protons.',
        'An acid is a proton donor. Hydrogen chloride gives its proton to water, forming hydronium ions.',
        'A base is a proton acceptor. Ammonia accepts a proton from water, forming hydroxide ions.',
        'Strong and concentrated are different things. A strong acid ionises completely in water. A concentrated acid has a lot of acid dissolved in a small volume. A weak acid can be concentrated, and a strong acid can be dilute.',
      ] },
    { id: 'ph', html: `
      <div class="eyebrow" style="text-transform:none">pH</div>
      <h2>pH = −log[H₃O⁺]</h2>
      <div class="box" data-at="0"><span class="lead" style="margin:0">At 25 °C: &nbsp;<b class="hl">[H₃O⁺][OH⁻] = 10⁻¹⁴</b></span></div>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl" style="text-transform:none;letter-spacing:0">0,01 M HCl</span>[H₃O⁺] = 0,01 &nbsp;→&nbsp; pH = −log(0,01) = 2</div>
        <div class="step" data-at="2"><span class="lbl" style="text-transform:none;letter-spacing:0">0,001 M NaOH</span>[OH⁻] = 0,001 &nbsp;→&nbsp; [H₃O⁺] = 10⁻¹⁴ ÷ 10⁻³ = 10⁻¹¹</div>
        <div class="step ans" data-at="3"><span class="lbl" style="text-transform:none;letter-spacing:0">pH</span>pH = −log(10⁻¹¹) = 11</div>
      </div>`,
      say: [
        'pH is the negative log of the hydronium ion concentration. And at twenty five degrees, the hydronium and hydroxide concentrations multiply to ten to the minus fourteen.',
        'Hydrochloric acid of zero comma zero one moles per cubic decimetre is a strong acid, so the hydronium concentration is zero comma zero one. Its pH is the negative log of zero comma zero one, which is two.',
        'Sodium hydroxide of zero comma zero zero one moles per cubic decimetre gives a hydroxide concentration of zero comma zero zero one. So the hydronium concentration is ten to the minus fourteen divided by ten to the minus three: ten to the minus eleven.',
        'Its pH is eleven.',
      ] },
    { id: 'titration', html: `
      <div class="eyebrow">Titration</div>
      <h2>25&nbsp;cm³ of NaOH is neutralised by 20&nbsp;cm³ of 0,1&nbsp;mol·dm⁻³ HCl. Find&nbsp;c(NaOH).</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Equation</span>HCl + NaOH → NaCl + H₂O &nbsp;(1 : 1)</div>
        <div class="step" data-at="2"><span class="lbl" style="text-transform:none;letter-spacing:0">n(HCl)</span>n = cV = 0,1 × 0,020 = 0,002 mol</div>
        <div class="step" data-at="3"><span class="lbl" style="text-transform:none;letter-spacing:0">n(NaOH)</span>1 : 1, so 0,002 mol</div>
        <div class="step ans" data-at="4"><span class="lbl" style="text-transform:none;letter-spacing:0">c(NaOH)</span>c = n ÷ V = 0,002 ÷ 0,025 = 0,08 mol·dm⁻³</div>
      </div>`,
      say: [
        'Now a titration. Twenty five cubic centimetres of sodium hydroxide is neutralised by twenty cubic centimetres of hydrochloric acid of zero comma one moles per cubic decimetre. Find the concentration of the sodium hydroxide.',
        'Write the balanced equation. Hydrochloric acid and sodium hydroxide react in a one to one ratio.',
        'Find the moles of acid: n equals c times V. Change the volume to cubic decimetres first: twenty cubic centimetres is zero comma zero two zero. So n is zero comma zero zero two moles.',
        'The ratio is one to one, so there are also zero comma zero zero two moles of sodium hydroxide.',
        'Its concentration is n divided by V: zero comma zero zero two divided by zero comma zero two five, which is zero comma zero eight moles per cubic decimetre.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Using cm³ in n = cV: divide by <b>1&nbsp;000</b> to get dm³</span></li>
        <li data-at="2"><span>Ignoring the <b>mole ratio</b>: H₂SO₄ + 2NaOH is 1 : 2, not 1 : 1</span></li>
        <li data-at="3"><span>Calling a dilute strong acid "weak": <b>strength</b> is about ionisation, not concentration</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Using cubic centimetres in n equals c V. Divide by one thousand to get cubic decimetres.',
        'Ignoring the mole ratio. Sulfuric acid reacts with sodium hydroxide in a one to two ratio, not one to one.',
        'And calling a dilute strong acid weak. Strength is about how completely it ionises, not how much is dissolved.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Acids and Bases.</em></h1>
      <div class="cta">Open Acids and Bases in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Acids and Bases in DONE WELL and practise pH and titration calculations, with every mark explained."] },
  ],
}
