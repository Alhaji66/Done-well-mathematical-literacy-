window.LESSON = {
  id: 'chem-le-chatelier',
  crumb: 'Physical Sciences · Chemical Equilibrium',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Physical Sciences · Chemical Change · Grade 12</div>
      <h1>Le Chatelier's principle</h1>
      <div class="sub">How an equilibrium responds to changes in concentration, pressure and temperature, using the Haber process.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
      say: ["Welcome to DONE WELL. In this lesson you will learn Le Chatelier's principle, and how to predict what happens to an equilibrium when you change the concentration, the pressure or the temperature."] },
    { id: 'principle', html: `
      <div class="eyebrow">The principle</div>
      <h2>A system at equilibrium opposes any change made to it</h2>
      <div class="box gold problem" data-at="1">When the equilibrium in a closed system is disturbed, the system re-instates a new equilibrium by favouring the reaction that <b class="hl">opposes</b> the disturbance.</div>
      <div class="box" data-at="2"><span class="lead" style="margin:0">Haber process: &nbsp;<b class="hl">N₂(g) + 3H₂(g) ⇌ 2NH₃(g)</b> &nbsp; ΔH = −92 kJ·mol⁻¹ (forward reaction exothermic)</span></div>`,
      say: [
        "Le Chatelier's principle says that a system at equilibrium opposes any change made to it.",
        'In the words the memo wants: when the equilibrium in a closed system is disturbed, the system re-instates a new equilibrium by favouring the reaction that opposes the disturbance.',
        'We will use the Haber process: nitrogen plus three hydrogen forms two ammonia. The forward reaction is exothermic, with delta H negative ninety two kilojoules per mole.',
      ] },
    { id: 'changes', html: `
      <div class="eyebrow">Three changes</div>
      <h2>What happens, and why</h2>
      <table class="t">
        <tr><th>Change</th><th>Reaction favoured</th><th>Effect on NH₃</th></tr>
        <tr data-at="1"><td>Add N₂</td><td>forward: uses up N₂</td><td>increases</td></tr>
        <tr data-at="2"><td>Increase pressure</td><td>forward: 4 mol gas → 2 mol</td><td>increases</td></tr>
        <tr data-at="3"><td>Increase temperature</td><td>reverse: endothermic</td><td>decreases</td></tr>
        <tr data-at="4"><td>Add a catalyst</td><td>neither</td><td>no change (faster)</td></tr>
      </table>`,
      say: [
        'Here is what happens with each change.',
        'Add nitrogen: the system opposes it by using nitrogen up, so the forward reaction is favoured and more ammonia forms.',
        'Increase the pressure: the system opposes it by reducing the number of gas molecules. There are four moles of gas on the left and two on the right, so the forward reaction is favoured, and more ammonia forms.',
        'Increase the temperature: the system opposes it by absorbing heat, so the endothermic reaction is favoured. Here that is the reverse reaction, so less ammonia forms.',
        'Add a catalyst: both reactions speed up equally, so the equilibrium is reached faster, but the yield does not change.',
      ] },
    { id: 'kc', html: `
      <div class="eyebrow">And K<sub>c</sub>?</div>
      <h2>Only a change in temperature changes K<sub>c</sub></h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">K<sub>c</sub></span>K<sub>c</sub> = [NH₃]² ÷ ([N₂][H₂]³)</div>
        <div class="step" data-at="2"><span class="lbl">Conc., P</span>the position shifts, but K<sub>c</sub> stays the same</div>
        <div class="step ans" data-at="3"><span class="lbl">Temp ↑</span>reverse favoured: K<sub>c</sub> decreases</div>
      </div>`,
      say: [
        'What about the equilibrium constant?',
        'K c is the concentration of ammonia squared, divided by the concentration of nitrogen times the concentration of hydrogen cubed.',
        'Changing a concentration or the pressure shifts the position of the equilibrium, but K c stays the same.',
        'Only a change in temperature changes K c. Here, raising the temperature favours the reverse reaction, so K c decreases.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Saying a catalyst <b>increases the yield</b>: it only speeds up both reactions</span></li>
        <li data-at="2"><span>Counting moles of <b>all</b> substances for pressure: count only the <b>gases</b></span></li>
        <li data-at="3"><span>Explaining without naming the favoured reaction: say <b>forward</b> or <b>reverse</b>, and why</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Saying a catalyst increases the yield. It speeds up both reactions equally, so the yield stays the same.',
        'Counting the moles of every substance when the pressure changes. Count only the gases.',
        'And explaining without naming the favoured reaction. Always say forward or reverse, and why.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Chemical Equilibrium.</em></h1>
      <div class="cta">Open Chemical Equilibrium in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Chemical Equilibrium in DONE WELL and practise Le Chatelier's principle, with every mark explained."] },
  ],
}
