window.LESSON = {
  id: 'lifesci-protein-synthesis',
  crumb: 'Life Sciences · DNA: Code of Life',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Life Sciences · DNA: Code of Life · Grade 12</div>
      <h1>Protein synthesis: transcription and translation</h1>
      <div class="sub">How the code in DNA becomes a protein, where each step happens, and a worked example from DNA to amino acids.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how the code in DNA is used to make a protein, in two stages, transcription and translation, and how to work out an amino acid sequence step by step.'] },
    { id: 'two', html: `
      <div class="eyebrow">Two stages</div>
      <h2>Transcription in the nucleus, translation at the ribosome</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>1. Transcription</h3><p>In the <b>nucleus</b>, DNA unwinds and one strand is the <b>template</b>. Free RNA nucleotides pair with it to form <b>mRNA</b>, which leaves through a nuclear pore.</p></div>
        <div class="col" data-at="2"><h3>2. Translation</h3><p>At a <b>ribosome</b>, each mRNA <b>codon</b> is matched by a tRNA <b>anticodon</b>. Each tRNA brings its <b>amino acid</b>, and peptide bonds join them.</p></div>
      </div>`,
      say: [
        'Protein synthesis happens in two stages.',
        'The first stage is transcription, in the nucleus. The DNA molecule unwinds, and one strand acts as a template. Free RNA nucleotides pair with it to form messenger RNA, which leaves the nucleus through a nuclear pore.',
        'The second stage is translation, at a ribosome in the cytoplasm. Each codon of three bases on the messenger RNA is matched by the anticodon of a transfer RNA. Each transfer RNA brings a particular amino acid, and the amino acids are joined by peptide bonds to form the protein.',
      ] },
    { id: 'pairs', html: `
      <div class="eyebrow">Base pairing</div>
      <h2>RNA has uracil (U) where DNA has thymine (T)</h2>
      <table class="t">
        <tr><th>DNA template base</th><th>mRNA base</th></tr>
        <tr data-at="1"><td>A (adenine)</td><td>U (uracil)</td></tr>
        <tr data-at="1"><td>T (thymine)</td><td>A (adenine)</td></tr>
        <tr data-at="2"><td>C (cytosine)</td><td>G (guanine)</td></tr>
        <tr data-at="2"><td>G (guanine)</td><td>C (cytosine)</td></tr>
      </table>`,
      say: [
        'The bases pair the same way as in DNA, with one difference: RNA has uracil instead of thymine.',
        'So adenine on the DNA template pairs with uracil on the messenger RNA, and thymine pairs with adenine.',
        'Cytosine pairs with guanine, and guanine with cytosine.',
      ] },
    { id: 'example', html: `
      <div class="eyebrow">Worked example</div>
      <h2>DNA template strand: TAC GGA CTT</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">mRNA</span>AUG CCU GAA &nbsp;(codons)</div>
        <div class="step" data-at="2"><span class="lbl">tRNA</span>UAC GGA CUU &nbsp;(anticodons)</div>
        <div class="step" data-at="3"><span class="lbl">Table</span>AUG = Met &nbsp; CCU = Pro &nbsp; GAA = Glu</div>
        <div class="step ans" data-at="4"><span class="lbl">Protein</span>Met – Pro – Glu</div>
      </div>`,
      say: [
        'Here is a typical question. The template strand of DNA reads T A C, G G A, C T T. Give the messenger RNA, the transfer RNA anticodons, and the amino acids.',
        'Transcription: pair each base, remembering U instead of T. The messenger RNA codons are A U G, C C U, G A A.',
        'The transfer RNA anticodons pair with the codons: U A C, G G A, C U U.',
        'Then read each codon, not the anticodon, from the codon table you are given: A U G is methionine, C C U is proline, and G A A is glutamic acid.',
        'So this part of the protein is methionine, proline, glutamic acid.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Writing <b>T</b> in mRNA or tRNA: RNA uses <b>U</b></span></li>
        <li data-at="2"><span>Reading the <b>anticodon</b> in the codon table: the table uses <b>mRNA codons</b></span></li>
        <li data-at="3"><span>Mixing up the places: transcription in the <b>nucleus</b>, translation at the <b>ribosome</b></span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Writing T in messenger RNA or transfer RNA. RNA uses U, uracil.',
        'Looking up the anticodon in the codon table. The table uses the messenger RNA codons.',
        'And mixing up where each stage happens. Transcription is in the nucleus, and translation is at the ribosome in the cytoplasm.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise DNA: Code of Life.</em></h1>
      <div class="cta">Open DNA: Code of Life in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open DNA: Code of Life in DONE WELL and practise protein synthesis, with every mark explained."] },
  ],
}
