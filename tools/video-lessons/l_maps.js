window.LESSON = {
  id: 'matlit-map-scale',
  crumb: 'Mathematical Literacy · Maps and Plans',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematical Literacy · Maps and Plans · Grades 10–12</div>
      <h1>Using a scale on maps and plans</h1>
      <div class="sub">Number scales and bar scales, measured distance to real distance and back, and a floor plan.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how to use the scale on a map or a plan, how to change a measured distance into a real distance and back, and how to avoid the usual mistakes.'] },
    { id: 'scales', html: `
      <div class="eyebrow">Two kinds of scale</div>
      <h2>A number scale has no units. A bar scale is drawn on the map.</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>Number scale</h3><div class="big">1 : 50&nbsp;000</div><p>1 unit on the map is <b>50&nbsp;000 of the same unit</b> in real life: 1 cm is 50&nbsp;000 cm.</p></div>
        <div class="col" data-at="2"><h3>Bar scale</h3><div class="big">0 — 1 — 2 km</div><p>Measure the bar with a ruler, e.g. <b>2 cm = 1 km</b>. It stays right if the map is enlarged or reduced.</p></div>
      </div>`,
      say: [
        'Maps and plans use two kinds of scale.',
        'A number scale, such as one to fifty thousand, has no units. One unit on the map stands for fifty thousand of the same unit in real life. So one centimetre on the map is fifty thousand centimetres on the ground.',
        'A bar scale is a line drawn on the map. Measure it with your ruler, for example two centimetres equals one kilometre. A bar scale stays correct even if the map is enlarged or reduced, because the bar changes size with it.',
      ] },
    { id: 'map', html: `
      <div class="eyebrow">Worked example 1</div>
      <h2>The map scale is 1 : 50 000. Two towns are 6,4 cm apart on the map.</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Multiply</span>6,4 cm × 50&nbsp;000 = 320&nbsp;000 cm</div>
        <div class="step" data-at="2"><span class="lbl">To m</span>320&nbsp;000 ÷ 100 = 3&nbsp;200 m</div>
        <div class="step ans" data-at="3"><span class="lbl">To km</span>3&nbsp;200 ÷ 1&nbsp;000 = 3,2 km</div>
      </div>
      <div class="box" data-at="4"><span class="lead" style="margin:0">This is the <b class="hl">straight-line</b> distance. The road between the towns is usually longer.</span></div>`,
      say: [
        'Here is a typical question. On a map with a scale of one to fifty thousand, two towns are six comma four centimetres apart. How far apart are they in real life?',
        'Multiply by the scale: six comma four centimetres times fifty thousand is three hundred and twenty thousand centimetres.',
        'Change to metres by dividing by one hundred: three thousand two hundred metres.',
        'Change to kilometres by dividing by one thousand: three comma two kilometres.',
        'Remember, this is the distance in a straight line. A road that bends is longer.',
      ] },
    { id: 'back', html: `
      <div class="eyebrow">Worked example 2: the other way</div>
      <h2>A room is 4,5 m long. How long is it on a plan drawn at 1 : 50?</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Same unit</span>4,5 m = 450 cm</div>
        <div class="step" data-at="2"><span class="lbl">Divide</span>450 cm ÷ 50 = 9 cm on the plan</div>
        <div class="step ans" data-at="3"><span class="lbl">Check</span>9 cm × 50 = 450 cm = 4,5 m ✓</div>
      </div>`,
      say: [
        'Now the other way. A room is four comma five metres long. How long is it on a floor plan drawn at a scale of one to fifty?',
        'First change to the unit you will measure in on the plan: four comma five metres is four hundred and fifty centimetres.',
        'Real life to plan means divide by the scale: four hundred and fifty divided by fifty is nine centimetres.',
        'Check by going back: nine centimetres times fifty is four hundred and fifty centimetres, which is four comma five metres.',
      ] },
    { id: 'find', html: `
      <div class="eyebrow">Finding the scale</div>
      <h2>A 2,5 cm bar stands for 1 km. What is the number scale?</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Same unit</span>1 km = 100&nbsp;000 cm</div>
        <div class="step" data-at="2"><span class="lbl">Ratio</span>2,5 : 100&nbsp;000</div>
        <div class="step ans" data-at="3"><span class="lbl">Simplify</span>÷ 2,5 &nbsp;→&nbsp; 1 : 40&nbsp;000</div>
      </div>`,
      say: [
        'Exams also ask you to turn a bar scale into a number scale. Suppose two comma five centimetres on the bar stands for one kilometre.',
        'Write both in the same unit. One kilometre is one hundred thousand centimetres.',
        'So the ratio is two comma five to one hundred thousand.',
        'Divide both sides by two comma five, so the first number is one. The number scale is one to forty thousand.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Map to real life: <b>multiply</b> by the scale. Real life to map: <b>divide</b></span></li>
        <li data-at="2"><span>A number scale has <b>the same unit on both sides</b>: change km to cm before you write it</span></li>
        <li data-at="3"><span>Give the answer in a <b>sensible unit</b>: kilometres for towns, metres for a room</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Getting the direction wrong. From the map to real life you multiply by the scale. From real life to the map you divide.',
        'Mixing units in a number scale. Both sides must be in the same unit, so change kilometres to centimetres before you write it.',
        'And giving an answer in a silly unit. Use kilometres for the distance between towns, and metres for a room.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Maps and Plans.</em></h1>
      <div class="cta">Open Maps and Plans in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Maps and Plans in DONE WELL and practise scale questions, with every mark explained."] },
  ],
}
