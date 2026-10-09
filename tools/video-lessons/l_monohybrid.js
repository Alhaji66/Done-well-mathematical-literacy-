(function () {
  const style = `<style>
    table.pun { margin-top: 10px; border-collapse: collapse; font-family: 'MonoV', monospace; font-size: 34px; }
    table.pun td, table.pun th { width: 130px; height: 82px; text-align: center; border: 2px solid var(--n600); }
    table.pun th { color: var(--g300); font-size: 30px; background: rgba(230,175,56,.08); }
    table.pun td.w { color: var(--blue); } table.pun td.p { color: #d9a6ff; }
    .cross { margin-top: 18px; display: grid; grid-template-columns: 190px 1fr; row-gap: 10px; font-size: 27px; max-width: 1050px; }
    .cross .k { font-family: 'InterV'; font-size: 17px; font-weight: 800; color: var(--g400); text-transform: uppercase; letter-spacing: .08em; padding-top: 7px; }
    .cross .v { font-family: 'MonoV', monospace; color: #fff; }
  </style>`
  window.LESSON = {
    id: 'lifesci-monohybrid',
    crumb: 'Life Sciences · Genetics and Inheritance',
    scenes: [
      { id: 'title', cls: 'title', html: `${style}
        <div class="subject">Life Sciences · Genetics · Grade 12</div>
        <h1>Monohybrid crosses</h1>
        <div class="sub">The key terms, a full genetic cross set out the way the memo marks it, and a Punnett square.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn the key terms of genetics, and how to set out a monohybrid cross, step by step, the way the examiners mark it.'] },
      { id: 'terms', html: `
        <div class="eyebrow">Key terms</div>
        <h2>Genes, alleles, genotype and phenotype</h2>
        <ul class="pts">
          <li data-at="0"><span><b>Alleles</b>: different forms of the same gene, such as purple and white flower colour</span></li>
          <li data-at="1"><span><b>Dominant</b> (capital, P) shows whenever it is present; <b>recessive</b> (small, p) shows only in pp</span></li>
          <li data-at="2"><span><b>Genotype</b>: the alleles, such as Pp · <b>Phenotype</b>: what you see, such as purple</span></li>
          <li data-at="3"><span><b>Homozygous</b>: two identical alleles (PP or pp) · <b>Heterozygous</b>: two different alleles (Pp)</span></li>
        </ul>`,
        say: [
          'Alleles are different forms of the same gene. In pea plants, the gene for flower colour has an allele for purple and an allele for white.',
          'A dominant allele shows its effect whenever it is present. We write it with a capital letter. A recessive allele only shows when there are two of them, and we write it with the small letter.',
          'The genotype is the pair of alleles an organism has, such as capital P small p. The phenotype is the characteristic you can see, such as purple flowers.',
          'Homozygous means the two alleles are the same, like capital P capital P, or small p small p. Heterozygous means they are different: capital P small p.',
        ] },
      { id: 'problem', html: `
        <div class="eyebrow">Worked example</div>
        <h2>Two purple plants are crossed</h2>
        <div class="box problem" data-at="0">In pea plants, purple flowers (P) are dominant over white flowers (p). Two plants that are <b class="hl">heterozygous</b> for flower colour are crossed.</div>
        <div class="box gold problem" data-at="1">Represent the cross to show the possible genotypes and phenotypes of the offspring.</div>`,
        say: [
          'Here is a typical question. In pea plants, purple flowers, capital P, are dominant over white flowers, small p. Two plants that are heterozygous for flower colour are crossed.',
          'Represent a genetic cross to show the possible genotypes and phenotypes of the offspring.',
          'Heterozygous means each parent is capital P small p, so both parents have purple flowers.',
        ] },
      { id: 'cross', html: `
        <div class="eyebrow">The genetic cross</div>
        <h2>Set it out like this</h2>
        <div class="cross">
          <div class="k" data-at="0">P₁ phenotype</div><div class="v" data-at="0">purple × purple</div>
          <div class="k" data-at="0">Genotype</div><div class="v" data-at="0">Pp × Pp</div>
          <div class="k" data-at="1">Meiosis</div><div class="v" data-at="1">&nbsp;</div>
          <div class="k" data-at="1">Gametes</div><div class="v" data-at="1">P, p × P, p</div>
          <div class="k" data-at="2">Fertilisation</div><div class="v" data-at="2">(Punnett square)</div>
          <div class="k" data-at="3">F₁ genotype</div><div class="v" data-at="3">PP, Pp, Pp, pp</div>
          <div class="k" data-at="4">F₁ phenotype</div><div class="v" data-at="4">3 purple : 1 white</div>
        </div>`,
        say: [
          'Start with the parents, labelled P one. Write their phenotypes, purple times purple, and their genotypes, capital P small p times capital P small p.',
          'Next write meiosis, and the gametes each parent makes. Each gamete gets only one allele, so each parent makes gametes with capital P and gametes with small p.',
          'Then write fertilisation: any gamete from one parent can join any gamete from the other.',
          'The offspring, labelled F one, have the genotypes capital P capital P, capital P small p, capital P small p, and small p small p.',
          'So the phenotypes are three purple to one white.',
        ] },
      { id: 'punnett', html: `
        <div class="eyebrow">Punnett square</div>
        <h2>Every gamete meets every gamete</h2>
        <div style="display:flex;gap:60px;align-items:center;margin-top:16px">
          <table class="pun" data-at="0"><tr><th>♂ / ♀</th><th>P</th><th>p</th></tr>
            <tr><th>P</th><td class="p">PP</td><td class="p">Pp</td></tr>
            <tr><th>p</th><td class="p">Pp</td><td class="w">pp</td></tr></table>
          <ul class="pts" style="margin-top:0;max-width:520px">
            <li data-at="1"><span>Genotypes <b>1 PP : 2 Pp : 1 pp</b></span></li>
            <li data-at="2"><span>Phenotypes <b>3 purple : 1 white</b></span></li>
            <li data-at="3"><span>P(white) = 1 in 4 = <em class="k">25%</em></span></li>
          </ul>
        </div>`,
        say: [
          'A Punnett square shows fertilisation clearly. Put one parent\'s gametes across the top, and the other parent\'s down the side, and fill in each box.',
          'The genotype ratio is one capital P capital P, to two capital P small p, to one small p small p.',
          'Three of the four boxes have at least one capital P, so the phenotype ratio is three purple to one white.',
          'So each offspring has a one in four chance, twenty five percent, of having white flowers.',
        ] },
      { id: 'test', html: `
        <div class="eyebrow">A test cross</div>
        <h2>Is a purple plant PP or Pp?</h2>
        <ul class="pts">
          <li data-at="1"><span>Cross it with a <b>white (pp)</b> plant</span></li>
          <li data-at="2"><span><b>All</b> offspring purple → the parent was most likely <b>PP</b></span></li>
          <li data-at="3"><span><b>Any</b> white offspring → the parent must be <b>Pp</b></span></li>
        </ul>`,
        say: [
          'A purple plant could be capital P capital P or capital P small p. You cannot tell by looking.',
          'So cross it with a white plant, small p small p, which can only give small p gametes.',
          'If all the offspring are purple, the purple parent was most likely homozygous, capital P capital P.',
          'If any offspring are white, the purple parent must have given a small p, so it is heterozygous, capital P small p.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Use <b>one letter</b>: P and p, never P for purple and W for white</span></li>
          <li data-at="2"><span>Label <b>P₁, meiosis, gametes, fertilisation, F₁</b>: each earns a mark</span></li>
          <li data-at="3"><span>3 : 1 is a <b>chance</b> for each offspring, not an exact count</span></li>
        </ul>`,
        say: [
          'Three mistakes to avoid.',
          'Use the same letter for both alleles of a gene: capital P and small p. Never P for purple and W for white.',
          'Label every line: P one, meiosis, gametes, fertilisation and F one. Each of these labels earns marks.',
          'And three to one is a probability for each offspring. Four seeds will not always give exactly three purple plants and one white.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Genetics.</em></h1>
        <div class="cta">Open Genetics &amp; Inheritance in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Genetics and Inheritance in DONE WELL, and practise genetic crosses, with every mark explained."] },
    ],
  }
})()
