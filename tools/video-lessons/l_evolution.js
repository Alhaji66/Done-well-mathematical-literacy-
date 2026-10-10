window.LESSON = {
  id: 'lifesci-natural-selection',
  crumb: 'Life Sciences · Evolution',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Life Sciences · Evolution · Grade 12</div>
      <h1>Evolution by natural selection</h1>
      <div class="sub">Darwin's theory step by step, a South African example, Lamarck compared, and how new species form.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Exam-style example</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how evolution happens by natural selection, how to explain it step by step in an exam, and how new species form.'] },
    { id: 'steps', html: `
      <div class="eyebrow">Natural selection</div>
      <h2>Darwin's theory, in the order the memo marks it</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">1</span>There is <b>variation</b> in a population, much of it inherited</div>
        <div class="step" data-at="2"><span class="lbl">2</span>More offspring are produced than survive: <b>competition</b></div>
        <div class="step" data-at="3"><span class="lbl">3</span>Those with favourable characteristics <b>survive</b> and reproduce</div>
        <div class="step" data-at="4"><span class="lbl">4</span>They pass the favourable <b>alleles</b> to their offspring</div>
        <div class="step ans" data-at="5"><span class="lbl">5</span>Over generations, the favourable characteristic becomes <b>common</b></div>
      </div>`,
      say: [
        "Darwin's theory of natural selection has five steps, and the memo marks them in this order.",
        'One. There is variation among the individuals of a population, and much of it is inherited.',
        'Two. More offspring are produced than can survive, so there is competition for food, space and mates.',
        'Three. Individuals with favourable characteristics are more likely to survive and reproduce. Those without them are more likely to die.',
        'Four. The survivors pass the alleles for the favourable characteristic to their offspring.',
        'Five. Over many generations, the favourable characteristic becomes more common in the population.',
      ] },
    { id: 'tb', html: `
      <div class="eyebrow">Example</div>
      <h2>Drug-resistant TB: natural selection we can watch</h2>
      <ul class="pts">
        <li data-at="1"><span>A few TB bacteria carry a mutation that makes them <b>resistant</b> to an antibiotic</span></li>
        <li data-at="2"><span>A patient who stops treatment early kills only the <em class="k">non-resistant</em> bacteria</span></li>
        <li data-at="3"><span>The resistant bacteria survive, reproduce and pass on the <b>resistance allele</b></span></li>
        <li data-at="4"><span>The population becomes mostly resistant: <b>drug-resistant TB</b></span></li>
      </ul>`,
      say: [
        'South Africa has a clear example: drug-resistant tuberculosis.',
        'In a population of TB bacteria, a few carry a mutation that makes them resistant to an antibiotic. That is the variation.',
        'When a patient stops taking the treatment too early, the antibiotic has killed only the bacteria that are not resistant.',
        'The resistant bacteria survive, reproduce, and pass the resistance allele on.',
        'Soon most of the population is resistant, and the disease no longer responds to that drug. This is why patients must finish their treatment.',
      ] },
    { id: 'lamarck', html: `
      <div class="eyebrow">Compare</div>
      <h2>Lamarck against Darwin: the long neck of the giraffe</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>Lamarck</h3><p>Giraffes <b>stretched</b> their necks to reach leaves, the necks grew longer through <b>use</b>, and the longer neck was <b>passed on</b>.</p></div>
        <div class="col" data-at="2"><h3>Darwin</h3><p>Giraffes already <b>varied</b> in neck length. Those with longer necks reached more food, <b>survived</b> and passed on the alleles for long necks.</p></div>
      </div>
      <div class="box" data-at="3"><span class="lead" style="margin:0">Lamarck was wrong because characteristics <b class="hl">acquired during a lifetime</b> are not inherited: they do not change the DNA in the gametes.</span></div>`,
      say: [
        'Exams often ask you to compare Lamarck and Darwin, using the giraffe.',
        'Lamarck said giraffes stretched their necks to reach leaves, the necks grew longer through use, and the longer neck was passed on to the offspring.',
        'Darwin said giraffes already varied in neck length. Those with longer necks reached more food, survived, and passed on the alleles for long necks.',
        'Lamarck was wrong, because characteristics acquired during a lifetime are not inherited. Stretching a neck does not change the DNA in the gametes.',
      ] },
    { id: 'speciation', html: `
      <div class="eyebrow">How new species form</div>
      <h2>Speciation through geographic isolation</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Split</span>A barrier (a river, a mountain, the sea) divides one population into two</div>
        <div class="step" data-at="2"><span class="lbl">No gene flow</span>The two groups can no longer interbreed</div>
        <div class="step" data-at="3"><span class="lbl">Change</span>Each group undergoes natural selection in its own environment</div>
        <div class="step ans" data-at="4"><span class="lbl">New species</span>If they meet again, they can no longer interbreed to produce fertile offspring</div>
      </div>`,
      say: [
        'New species form in a similar way, through geographic isolation.',
        'A barrier, such as a river, a mountain range or the sea, divides one population into two.',
        'The two groups can no longer interbreed, so there is no gene flow between them.',
        'Each group undergoes natural selection in its own environment, and over many generations they become more and more different.',
        'If they meet again and can no longer interbreed to produce fertile offspring, they have become two separate species.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>"The bacteria <b>became</b> resistant because they needed to": that is Lamarck. The resistance was <b>already there</b></span></li>
        <li data-at="2"><span><b>Populations</b> evolve, not individuals: one organism does not change its genes</span></li>
        <li data-at="3"><span>Leave out a step, and you lose its mark: <b>variation, competition, survival, inheritance, over generations</b></span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Writing that the bacteria became resistant because they needed to. That is Lamarck. The resistance was already present in a few bacteria before the antibiotic was used.',
        'Writing that an individual evolves. Populations evolve. One organism cannot change its genes.',
        'And leaving out a step. Variation, competition, survival, inheritance, over many generations: each step earns a mark.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Evolution.</em></h1>
      <div class="cta">Open Evolution in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Evolution in DONE WELL and practise natural selection and speciation questions, with every mark explained."] },
  ],
}
