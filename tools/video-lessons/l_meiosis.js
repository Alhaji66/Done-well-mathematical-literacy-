(function () {
  const R = '#ff8f8f', B = '#7fb3ff', CELL = 'rgba(127,179,255,.07)', EDGE = '#8499bd'
  const chromatid = (x, y, len, c, tip) => {
    const top = y - len / 2
    let s = `<rect x="${x - 4.5}" y="${top}" width="9" height="${len}" rx="4.5" fill="${c}"/>`
    if (tip) s += `<rect x="${x - 4.5}" y="${top}" width="9" height="${len * 0.36}" rx="4.5" fill="${tip}"/>`
    return s
  }
  // A chromosome of two chromatids, joined at the centromere.
  const chrom = (x, y, len, a, b) => chromatid(x - 5.5, y, len, a[0], a[1]) + chromatid(x + 5.5, y, len, b[0], b[1]) + `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`
  const single = (x, y, len, c, tip) => chromatid(x, y, len, c, tip) + `<circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`
  const cell = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${CELL}" stroke="${EDGE}" stroke-width="2"/>`
  const eq = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#e6af38" stroke-width="2" stroke-dasharray="5 5"/>`
  const label = (x, t, sub) => `<text x="${x}" y="262" text-anchor="middle" fill="#fff" font-size="19" font-weight="800">${t}</text><text x="${x}" y="286" text-anchor="middle" fill="#adbbd3" font-size="15">${sub}</text>`
  const panel = (i, at, body, t, sub, w = 270) => `<g transform="translate(${i * w},0)"><g data-at="${at}">${body}${label(w / 2 - 10, t, sub)}</g></g>`
  // Long pair crosses over: red's second chromatid gets a blue tip, blue's first a red tip.
  const longR = (x, y) => chrom(x, y, 64, [R], [R, B]), longB = (x, y) => chrom(x, y, 64, [B, R], [B])
  const shortR = (x, y) => chrom(x, y, 38, [R], [R]), shortB = (x, y) => chrom(x, y, 38, [B], [B])
  const m1 = `<svg width="1100" height="300" viewBox="0 0 1100 300" style="margin-top:18px">
    ${panel(0, 1, cell(125, 120, 104, 100) + longR(92, 105) + longB(112, 105) + shortR(150, 132) + shortB(170, 132), 'Prophase I', 'pairs form, crossing over')}
    ${panel(1, 2, cell(125, 120, 104, 100) + eq(125, 26, 214) + longR(108, 85) + longB(142, 85) + shortB(108, 160) + shortR(142, 160), 'Metaphase I', 'pairs on the equator')}
    ${panel(2, 3, cell(125, 120, 118, 92) + longR(42, 100) + shortB(66, 140) + longB(186, 100) + shortR(210, 140), 'Anaphase I', 'pairs separate: n halved')}
    ${panel(3, 4, cell(66, 120, 58, 74) + cell(186, 120, 58, 74) + longR(52, 108) + shortB(80, 130) + longB(172, 108) + shortR(200, 130), 'Telophase I', 'two haploid cells')}
  </svg>`
  const m2 = `<svg width="1100" height="300" viewBox="0 0 1100 300" style="margin-top:18px">
    ${panel(0, 1, cell(66, 120, 58, 80) + cell(196, 120, 58, 80) + eq(66, 52, 188) + eq(196, 52, 188) + longR(66, 96) + shortB(66, 158) + longB(196, 96) + shortR(196, 158), 'Metaphase II', 'single chromosomes on equator', 360)}
    ${panel(1, 2, cell(66, 120, 60, 86) + cell(196, 120, 60, 86) + single(34, 96, 64, R) + single(98, 96, 64, R, B) + single(34, 156, 38, B) + single(98, 156, 38, B) + single(164, 96, 64, B, R) + single(228, 96, 64, B) + single(164, 156, 38, R) + single(228, 156, 38, R), 'Anaphase II', 'chromatids separate', 360)}
    ${panel(2, 3, [[30, R, null, B], [92, R, B, B], [154, B, R, R], [216, B, null, R]].map(([x, c, tip, s]) => cell(x + 12, 120, 30, 50) + single(x + 4, 110, 54, c, tip) + single(x + 22, 130, 32, s)).join(''), 'Telophase II', 'four different haploid cells', 360)}
  </svg>`
  window.LESSON = {
    id: 'lifesci-meiosis',
    crumb: 'Life Sciences · Meiosis',
    scenes: [
      { id: 'title', cls: 'title', html: `
        <div class="subject">Life Sciences · Meiosis · Grade 12</div>
        <h1>Meiosis: making gametes, and making every one different</h1>
        <div class="sub">The two divisions, step by step, and the three sources of genetic variation.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Diagrams</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will follow meiosis step by step, and see how it makes every gamete genetically different.'] },
      { id: 'why', html: `
        <div class="eyebrow">Why meiosis</div>
        <h2>One diploid cell becomes four haploid cells</h2>
        <ul class="pts">
          <li data-at="1"><span><b>Diploid (2n):</b> two sets of chromosomes. <b>Haploid (n):</b> one set</span></li>
          <li data-at="2"><span>Human body cells: <b>2n = 46</b>. Gametes: <b>n = 23</b></span></li>
          <li data-at="3"><span>Fertilisation: 23 + 23 = <em class="k">46</em>, so the diploid number is restored</span></li>
        </ul>`,
        say: [
          'Meiosis is the cell division that makes gametes, the sex cells.',
          'It turns one diploid cell, with two sets of chromosomes, into four haploid cells, each with one set.',
          'In humans, body cells have forty six chromosomes, and gametes have twenty three.',
          'At fertilisation, two gametes join. Twenty three plus twenty three gives forty six again. Without meiosis, the number would double every generation.',
        ] },
      { id: 'meiosis1', html: `
        <div class="eyebrow">Meiosis I</div>
        <h2>Homologous pairs are separated</h2>${m1}`,
        say: [
          'Meiosis happens in two divisions. In meiosis one, the homologous chromosomes are separated. Here the red chromosomes came from one parent, and the blue from the other.',
          'In prophase one, homologous chromosomes pair up, and crossing over swaps pieces between non-sister chromatids.',
          'In metaphase one, the pairs line up at the equator. Which way each pair faces is random. This is random assortment.',
          'In anaphase one, whole chromosomes of each pair move to opposite poles. This is when the chromosome number is halved.',
          'In telophase one, two haploid cells form. Each chromosome still has two chromatids.',
        ] },
      { id: 'meiosis2', html: `
        <div class="eyebrow">Meiosis II</div>
        <h2>Sister chromatids are separated</h2>${m2}`,
        say: [
          'Meiosis two is like mitosis, but it starts with the two haploid cells.',
          'In metaphase two, the chromosomes line up singly at the equator.',
          'In anaphase two, the sister chromatids separate and move to opposite poles.',
          'In telophase two, four haploid cells form, and because of crossing over and random assortment, they are all genetically different.',
        ] },
      { id: 'variation', html: `
        <div class="eyebrow">Genetic variation</div>
        <h2>Three sources of variation</h2>
        <div class="cols">
          <div class="col" data-at="1"><h3>Crossing over</h3><p>Prophase I. New combinations of alleles on one chromosome.</p></div>
          <div class="col" data-at="2"><h3>Random assortment</h3><p>Metaphase I. Many combinations of whole chromosomes in the gametes.</p></div>
          <div class="col" data-at="3"><h3>Random fertilisation</h3><p>Any sperm can fertilise any egg, multiplying the variation.</p></div>
        </div>`,
        say: [
          'So where does the variation come from? There are three sources.',
          'Crossing over, in prophase one, makes new combinations of alleles on a single chromosome.',
          'Random assortment, in metaphase one, makes many different combinations of whole chromosomes.',
          'And random fertilisation means any sperm can fertilise any egg, which multiplies the variation even further.',
        ] },
      { id: 'compare', html: `
        <div class="eyebrow">Do not confuse them</div>
        <h2>Mitosis and meiosis</h2>
        <table class="t">
          <tr><th></th><th>Mitosis</th><th>Meiosis</th></tr>
          <tr data-at="1"><td>Divisions</td><td>One</td><td>Two</td></tr>
          <tr data-at="1"><td>Cells made</td><td>2, diploid (2n)</td><td>4, haploid (n)</td></tr>
          <tr data-at="1"><td>The new cells</td><td>Identical</td><td>All different</td></tr>
          <tr data-at="2"><td>Purpose</td><td>Growth and repair</td><td>Making gametes</td></tr>
        </table>`,
        say: [
          'Do not confuse meiosis with mitosis.',
          'Mitosis has one division, and makes two identical diploid cells. Meiosis has two divisions, and makes four different haploid cells.',
          'Mitosis is for growth and repair. Meiosis is for making gametes.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>The number is halved in <b>anaphase I</b>, when whole chromosomes separate, not in anaphase II</span></li>
          <li data-at="2"><span>Metaphase I: <b>in pairs</b>. Metaphase II: <b>singly</b></span></li>
          <li data-at="3"><span><b>Non-disjunction</b>: chromosomes fail to separate, so a gamete has one too many or too few (for example, Down syndrome)</span></li>
        </ul>`,
        say: [
          'Three mistakes to avoid.',
          'The chromosome number is halved in anaphase one, when whole chromosomes separate, not in anaphase two.',
          'In metaphase one, chromosomes line up in pairs. In metaphase two, they line up singly.',
          'And know non-disjunction. If chromosomes fail to separate, a gamete gets one too many or one too few. Down syndrome is an example.',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Meiosis.</em></h1>
        <div class="cta">Open Meiosis in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Meiosis in DONE WELL, and practise exam questions with diagrams and every mark explained."] },
    ],
  }
})()
