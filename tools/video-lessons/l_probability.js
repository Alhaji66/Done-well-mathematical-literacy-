window.LESSON = {
  id: 'matlit-probability',
  crumb: 'Mathematical Literacy · Data Handling',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematical Literacy · Probability · Grades 10–12</div>
      <h1>Probability: chance, outcomes and relative frequency</h1>
      <div class="sub">The probability scale, working out a probability, what an experiment tells you, and two dice at once.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how to work out a probability, how it compares with what happens in an experiment, and how to handle two events at once.'] },
    { id: 'scale', html: `
      <div class="eyebrow">The probability scale</div>
      <h2>Every probability is between 0 and 1</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>0</h3><p><b>Impossible</b>: rolling a 7 on one die.</p></div>
        <div class="col" data-at="2"><h3>0,5</h3><p><b>Even chance</b>: heads when you toss a coin.</p></div>
        <div class="col" data-at="3"><h3>1</h3><p><b>Certain</b>: the sun rising tomorrow.</p></div>
      </div>
      <div class="box" data-at="4"><span class="lead" style="margin:0">P(event) = <b class="hl">number of favourable outcomes ÷ total number of possible outcomes</b>, as a fraction, a decimal or a percentage.</span></div>`,
      say: [
        'Every probability lies between zero and one.',
        'Zero means impossible, like rolling a seven on an ordinary die.',
        'Zero comma five means an even chance, like getting heads when you toss a coin.',
        'And one means certain.',
        'The probability of an event is the number of favourable outcomes, divided by the total number of possible outcomes. You can give it as a fraction, a decimal or a percentage.',
      ] },
    { id: 'bag', html: `
      <div class="eyebrow">Worked example 1</div>
      <h2>A bag holds 5 red, 3 blue and 2 green sweets. One is taken without looking.</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Total</span>5 + 3 + 2 = 10 sweets</div>
        <div class="step" data-at="2"><span class="lbl">P(blue)</span>3 ÷ 10 = 0,3 = 30%</div>
        <div class="step ans" data-at="3"><span class="lbl">P(not red)</span>(3 + 2) ÷ 10 = 0,5 = 50%</div>
      </div>`,
      say: [
        'Here is a typical question. A bag holds five red, three blue and two green sweets. One sweet is taken out without looking.',
        'First find the total: five plus three plus two is ten sweets.',
        'The probability of blue is three out of ten: zero comma three, or thirty percent.',
        'The probability that it is not red is the blue and green together, five out of ten: zero comma five, or fifty percent.',
      ] },
    { id: 'experiment', html: `
      <div class="eyebrow">Theory against experiment</div>
      <h2>A spinner has 4 equal sections. It is spun 50 times and lands on red 12 times.</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Theory</span>P(red) = 1 ÷ 4 = 0,25</div>
        <div class="step" data-at="2"><span class="lbl">Experiment</span>relative frequency = 12 ÷ 50 = 0,24</div>
        <div class="step ans" data-at="3"><span class="lbl">Why close</span>the more spins, the closer the two usually get</div>
      </div>`,
      say: [
        'Now compare theory with an experiment. A spinner has four equal sections, one of them red. It is spun fifty times and lands on red twelve times.',
        'In theory, the probability of red is one out of four: zero comma two five.',
        'In the experiment, the relative frequency is twelve out of fifty: zero comma two four.',
        'They are close but not the same. The more times you spin, the closer the relative frequency usually gets to the theoretical probability.',
      ] },
    { id: 'dice', html: `
      <div class="eyebrow">Two events</div>
      <h2>Two dice are rolled. What is the probability that the total is 7?</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Outcomes</span>6 × 6 = 36 equally likely pairs</div>
        <div class="step" data-at="2"><span class="lbl">Total 7</span>(1;6) (2;5) (3;4) (4;3) (5;2) (6;1): 6 pairs</div>
        <div class="step ans" data-at="3"><span class="lbl">P(7)</span>6 ÷ 36 = 1/6 ≈ 0,17 ≈ 17%</div>
      </div>`,
      say: [
        'With two events, list or count every outcome. Two dice are rolled. What is the probability that the total is seven?',
        'Each die has six faces, so there are six times six, thirty six, equally likely pairs.',
        'Six of them add up to seven: one and six, two and five, three and four, and the same three the other way round.',
        'So the probability is six out of thirty six, which is one sixth, about seventeen percent.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>A probability <b>bigger than 1</b> or negative is always wrong: check it</span></li>
        <li data-at="2"><span>Dividing by the wrong <b>total</b>: count every possible outcome</span></li>
        <li data-at="3"><span>Mixing up <b>relative frequency</b> (what happened) and <b>probability</b> (what is expected)</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'A probability bigger than one, or negative, is always wrong. Check your answer.',
        'Dividing by the wrong total. Count every possible outcome, not just some of them.',
        'And mixing up relative frequency, which is what actually happened, with probability, which is what you expect.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Data Handling.</em></h1>
      <div class="cta">Open Data Handling in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Data Handling in DONE WELL and practise probability questions, with every mark explained."] },
  ],
}
