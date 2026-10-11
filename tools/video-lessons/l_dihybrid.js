{
  // RrYy × RrYy: 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green.
  const g = ['RY', 'Ry', 'rY', 'ry']
  const geno = (a, b) => {
    const r = [a[0], b[0]].sort().join('')
    const y = [a[1], b[1]].sort().join('')
    return r + y
  }
  const pheno = (gt) => (gt.includes('R') ? 'round' : 'wrinkled') + ' ' + (gt.includes('Y') ? 'yellow' : 'green')
  const colour = { 'round yellow': 'rgba(230,175,56,.22)', 'round green': 'rgba(155,226,155,.18)', 'wrinkled yellow': 'rgba(242,160,123,.2)', 'wrinkled green': 'rgba(127,179,255,.18)' }
  const grid = `<table class="t" style="font-size:22px;min-width:0">
    <tr><th style="text-transform:none">♂ \\ ♀</th>${g.map((x) => `<th style="font-size:20px;text-transform:none;letter-spacing:0;color:#fff">${x}</th>`).join('')}</tr>
    ${g.map((a) => `<tr data-at="2"><th style="font-size:20px;text-transform:none;letter-spacing:0;color:#fff">${a}</th>${g.map((b) => { const gt = geno(a, b); return `<td style="background:${colour[pheno(gt)]};font-family:MonoV,monospace;padding:8px 16px">${gt}</td>` }).join('')}</tr>`).join('')}
  </table>`

  window.LESSON = {
    id: 'lifesci-dihybrid',
    crumb: 'Life Sciences · Genetics & Inheritance',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Life Sciences · Genetics · Grade 12</div>
        <h1>Dihybrid crosses</h1>
        <div class="sub">Two characteristics at once: the gametes, the Punnett square, the 9 : 3 : 3 : 1 ratio and the law behind it.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn how to do a dihybrid cross, following two characteristics at the same time, and why it gives the ratio nine, three, three, one.'] },
      { id: 'setup', html: `
        <div class="eyebrow">The cross</div>
        <h2>Pea seeds: round (R) is dominant to wrinkled (r); yellow (Y) is dominant to green (y)</h2>
        <div class="steps tight">
          <div class="step" data-at="1"><span class="lbl">P₁</span>RRYY (round yellow) × rryy (wrinkled green)</div>
          <div class="step" data-at="2"><span class="lbl">F₁</span>all RrYy: round and yellow</div>
          <div class="step" data-at="3"><span class="lbl">Cross</span>RrYy × RrYy</div>
        </div>`,
        say: [
          'In pea plants, round seeds are dominant to wrinkled, and yellow seeds are dominant to green.',
          'A pure-breeding round yellow plant, R R Y Y, is crossed with a wrinkled green plant, r r y y.',
          'Every offspring in the first generation is R r Y y, so all of them have round, yellow seeds.',
          'Now cross two of these F one plants: R r Y y times R r Y y.',
        ] },
      { id: 'gametes', html: `
        <div class="eyebrow">Step 1: the gametes</div>
        <h2>Each gamete gets ONE allele of each gene</h2>
        <div class="steps tight">
          <div class="step" data-at="0"><span class="lbl">RrYy</span>RY &nbsp;&nbsp; Ry &nbsp;&nbsp; rY &nbsp;&nbsp; ry</div>
          <div class="step ans" data-at="1"><span class="lbl">Why</span>the alleles of the two genes separate independently in meiosis</div>
        </div>`,
        say: [
          'First, the gametes. Each gamete gets one allele of each gene, so an R r Y y plant makes four kinds of gamete: R Y, R small y, small r Y, and small r small y.',
          'All four are possible because the alleles of the two genes separate independently of each other during meiosis. That is the law of independent assortment.',
        ] },
      { id: 'square', html: `
        <div class="eyebrow">Step 2: the Punnett square</div>
        <h2>Four gametes each way: 16 combinations</h2>
        <div style="display:flex;gap:40px;align-items:center;margin-top:6px">
          ${grid}
          <ul class="pts" style="margin-top:0">
            <li data-at="3"><span style="color:#edc561"><b>9</b> round yellow</span></li>
            <li data-at="3"><span style="color:#9be29b"><b>3</b> round green</span></li>
            <li data-at="3"><span style="color:#f2a07b"><b>3</b> wrinkled yellow</span></li>
            <li data-at="3"><span style="color:#7fb3ff"><b>1</b> wrinkled green</span></li>
          </ul>
        </div>`,
        say: [
          'Now the Punnett square. Write the four gametes of one parent along the top, and the four of the other down the side.',
          'Fill in each box by combining the gametes. That gives sixteen combinations.',
          'Sort them by phenotype. Any box with at least one capital R is round, and any box with at least one capital Y is yellow.',
          'There are nine round yellow, three round green, three wrinkled yellow, and one wrinkled green. The phenotypic ratio is nine to three to three to one.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Gametes with two alleles of the <b>same</b> gene, like RR: each gamete has one R-allele and one Y-allele</span></li>
          <li data-at="2"><span>Giving the <b>genotype</b> ratio when the question asks for the <b>phenotype</b> ratio</span></li>
          <li data-at="3"><span>Leaving out <b>P₁, F₁, meiosis, fertilisation</b> labels in a genetic cross</span></li>
        </ul>`,
        say: [
          'Watch out for three common mistakes.',
          'Writing gametes with two alleles of the same gene, like R R. Each gamete carries one allele for seed shape and one for seed colour.',
          'Giving the genotype ratio when the question asks for the phenotype ratio. Nine to three to three to one is the phenotype ratio.',
          'And leaving out the labels of a genetic cross: P one, F one, meiosis and fertilisation. Each one earns a mark.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Genetics.</em></h1>
        <div class="cta">Open Genetics &amp; Inheritance in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Genetics and Inheritance in DONE WELL and practise dihybrid crosses, with every mark explained."] },
    ],
  }
}
