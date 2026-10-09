(function () {
  // A carbon chain drawn left to right: numbers above, branches below, an
  // optional double bond after a given carbon and an optional group on a carbon.
  const chain = ({ n, branches = {}, groups = {}, double = 0 }) => {
    const gap = 150
    const left = 40
    const X = (i) => left + i * gap
    const W = 2 * left + (n - 1) * gap
    let s = `<svg style="margin-top:26px" width="${W}" height="200" viewBox="0 0 ${W} 200">`
    for (let i = 0; i < n - 1; i++) {
      s += `<line x1="${X(i) + 34}" y1="60" x2="${X(i + 1) - 34}" y2="60" stroke="#fff" stroke-width="4"/>`
      if (double === i + 1) s += `<line x1="${X(i) + 34}" y1="74" x2="${X(i + 1) - 34}" y2="74" stroke="#fff" stroke-width="4"/>`
    }
    for (let i = 0; i < n; i++) {
      s += `<text x="${X(i)}" y="72" fill="#fff" font-size="36" font-weight="800" text-anchor="middle">C</text>`
      s += `<g data-at="1"><text x="${X(i)}" y="18" fill="#e6af38" font-size="22" font-weight="800" text-anchor="middle">${i + 1}</text></g>`
      const b = branches[i + 1]
      if (b) s += `<g data-at="2"><line x1="${X(i)}" y1="84" x2="${X(i)}" y2="140" stroke="#7fb3ff" stroke-width="4"/><text x="${X(i)}" y="180" fill="#7fb3ff" font-size="30" font-weight="800" text-anchor="middle">${b}</text></g>`
      const g = groups[i + 1]
      if (g) s += `<g data-at="2"><line x1="${X(i)}" y1="84" x2="${X(i)}" y2="140" stroke="#5fd0a0" stroke-width="4"/><text x="${X(i)}" y="180" fill="#5fd0a0" font-size="30" font-weight="800" text-anchor="middle">${g}</text></g>`
    }
    return s + '</svg>'
  }
  window.LESSON = {
    id: 'chem-organic-naming',
    crumb: 'Physical Sciences · Organic Chemistry',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Physical Sciences · Chemistry · Grade 12</div>
        <h1>Naming organic molecules</h1>
        <div class="sub">The IUPAC rules, step by step: the chain, the numbering, the branches and the punctuation.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn how to give an organic molecule its IUPAC name, step by step, and how to avoid the mistakes that cost marks.'] },
      { id: 'parts', html: `
        <div class="eyebrow">A name has three parts</div>
        <h2>branches + chain length + functional group</h2>
        <div class="cols">
          <div class="col" data-at="1"><h3>Chain length (stem)</h3><p>1 meth · 2 eth · 3 prop · 4 but · 5 pent · 6 hex · 7 hept · 8 oct</p></div>
          <div class="col" data-at="2"><h3>Functional group (ending)</h3><p>alkane <b>-ane</b> · alkene <b>-ene</b> · alkyne <b>-yne</b> · alcohol <b>-ol</b> · aldehyde <b>-al</b> · ketone <b>-one</b> · carboxylic acid <b>-oic acid</b></p></div>
          <div class="col" data-at="3"><h3>Branches (prefix)</h3><p>methyl <b>–CH₃</b> · ethyl <b>–CH₂CH₃</b> · halogens: fluoro, chloro, bromo, iodo</p></div>
        </div>`,
        say: [
          'Every IUPAC name is built from three parts.',
          'The stem tells you how many carbons are in the longest chain. Meth is one, eth is two, prop is three, but is four, pent is five, hex is six, hept is seven, and oct is eight.',
          'The ending tells you the functional group. An alkane ends in A N E, an alkene in E N E, an alcohol in O L, an aldehyde in A L, a ketone in O N E, and a carboxylic acid in O I C acid.',
          'And the prefix names any branches, such as methyl or ethyl, and halogen atoms, such as chloro or bromo.',
        ] },
      { id: 'steps', html: `
        <div class="eyebrow">The method</div>
        <h2>Four steps, every time</h2>
        <ul class="pts">
          <li data-at="1"><span>Find the <b>longest chain</b> that contains the functional group</span></li>
          <li data-at="2"><span>Number it from the end that gives the <b>functional group</b> (or the first branch) the <b>lowest number</b></span></li>
          <li data-at="3"><span>Name and number the <b>branches</b>, in <b>alphabetical order</b></span></li>
          <li data-at="4"><span><b>Commas</b> between numbers, <b>hyphens</b> between numbers and words</span></li>
        </ul>`,
        say: [
          'Use the same four steps every time.',
          'First, find the longest continuous chain of carbon atoms that contains the functional group. It does not have to be drawn in a straight line.',
          'Second, number the chain from the end that gives the functional group the lowest possible number. If there is no functional group, start from the end nearest the first branch.',
          'Third, name each branch, with the number of the carbon it is on, and list the branches in alphabetical order.',
          'Fourth, punctuation. Put commas between numbers, and hyphens between numbers and words.',
        ] },
      { id: 'ex1', html: `
        <div class="eyebrow">Example 1</div>
        <h2>CH₃–CH(CH₃)–CH₂–CH₃</h2>
        <div style="display:flex;align-items:center;gap:70px">${chain({ n: 4, branches: { 2: 'CH₃' } })}
        <div class="box gold" data-at="3" style="font-size:38px;font-weight:800;margin-top:0">2-methylbutane</div></div>`,
        say: [
          'Example one. The longest chain has four carbons, and all the bonds are single, so the name ends in butane.',
          'Number the chain from the end nearest the branch.',
          'Then the branch, a methyl group, is on carbon two. Numbering from the other end would put it on carbon three, which is higher.',
          'So the name is two methyl butane, written as one word, with a hyphen after the two.',
        ] },
      { id: 'ex2', html: `
        <div class="eyebrow">Example 2</div>
        <h2>CH₃–CH₂–CH(OH)–CH₃</h2>
        <div style="display:flex;align-items:center;gap:70px">${chain({ n: 4, groups: { 3: 'OH' } }).replace(/<text x="(\d+)" y="18"[^>]*>(\d)<\/text>/g, (m, x, d) => m.replace(`>${d}<`, `>${5 - +d}<`))}
        <div class="box gold" data-at="3" style="font-size:38px;font-weight:800;margin-top:0">butan-2-ol</div></div>`,
        say: [
          'Example two contains an O H group, so it is an alcohol, and the name ends in O L.',
          'Number from the end nearest the O H group. From the right, the O H is on carbon two.',
          'The chain has four carbons, so the stem is butan.',
          'The name is butan two ol, with the number between the stem and the ending.',
        ] },
      { id: 'ex3', html: `
        <div class="eyebrow">Example 3</div>
        <h2>CH₂=CH–CH(CH₃)–CH₃</h2>
        <div style="display:flex;align-items:center;gap:70px">${chain({ n: 4, branches: { 3: 'CH₃' }, double: 1 })}
        <div class="box gold" data-at="3" style="font-size:38px;font-weight:800;margin-top:0">3-methylbut-1-ene</div></div>`,
        say: [
          'Example three has a double bond, so it is an alkene, ending in E N E.',
          'The double bond must get the lowest number, so number from the left. The double bond starts at carbon one.',
          'Now the methyl branch is on carbon three. The double bond decides the numbering, not the branch.',
          'The name is three methyl but one ene.',
        ] },
      { id: 'punct', html: `
        <div class="eyebrow">Two or more branches</div>
        <h2>CH₃–CH(CH₃)–CH(CH₃)–CH₂–CH₃</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Chain</span>5 carbons, single bonds → pentane</div>
          <div class="step" data-at="2"><span class="lbl">Branches</span>methyl on C2 and C3 → 2,3-dimethyl</div>
          <div class="step ans" data-at="3"><span class="lbl">Name</span>2,3-dimethylpentane</div>
        </div>`,
        say: [
          'When the same branch appears more than once, use di for two, tri for three, and tetra for four.',
          'This chain has five carbons, so it is pentane.',
          'There are methyl groups on carbons two and three. That is two comma three dimethyl.',
          'The name is two comma three dimethyl pentane: a comma between the numbers, and a hyphen before the word.',
        ] },
      { id: 'ester', html: `
        <div class="eyebrow">Esters</div>
        <h2>Alcohol part first (-yl), acid part second (-oate)</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Reactants</span>ethanol + propanoic acid</div>
          <div class="step" data-at="2"><span class="lbl">Ester</span>CH₃CH₂COOCH₂CH₃</div>
          <div class="step ans" data-at="3"><span class="lbl">Name</span>ethyl propanoate</div>
        </div>`,
        say: [
          'Esters are named in two words.',
          'An ester forms when an alcohol reacts with a carboxylic acid. For example, ethanol and propanoic acid.',
          'The alcohol gives the first word, ending in Y L. The acid gives the second word, ending in O A T E.',
          'So this ester is ethyl propanoate.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Choosing a chain that is <b>not the longest</b>: check bent chains</span></li>
          <li data-at="2"><span>Numbering from the wrong end: the <b>functional group</b> comes first</span></li>
          <li data-at="3"><span>Punctuation: <b>2,3-dimethylpentane</b>, not 2-3-dimethyl pentane</span></li>
        </ul>`,
        say: [
          'Three mistakes to avoid.',
          'Choosing a chain that is not the longest. A chain can bend, so check every path.',
          'Numbering from the wrong end. The functional group gets the lowest number first, and only then the branches.',
          'And punctuation. Commas between numbers, hyphens between numbers and letters, and no spaces in the name.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Organic Chemistry.</em></h1>
        <div class="cta">Open Organic Chemistry in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Organic Chemistry in DONE WELL, and practise naming molecules, with every mark explained."] },
    ],
  }
})()
