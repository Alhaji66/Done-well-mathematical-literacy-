window.LESSON = {
  id: 'matlit-interest',
  crumb: 'Mathematical Literacy · Finance',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematical Literacy · Finance · Grades 10–12</div>
      <h1>Simple and compound interest</h1>
      <div class="sub">What the difference is, and how to calculate each one, step by step.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn the difference between simple and compound interest, and how to calculate each one, step by step.'] },
    { id: 'idea', html: `
      <div class="eyebrow">The idea</div>
      <h2>Interest is extra money: paid when you borrow, earned when you save</h2>
      <ul class="pts">
        <li data-at="1"><span><b>Principal:</b> the amount you start with</span></li>
        <li data-at="2"><span><b>Interest rate:</b> a percentage, usually per year</span></li>
        <li data-at="3"><span><b>Simple interest:</b> worked out on the <em class="k">original amount</em>, every year</span></li>
        <li data-at="4"><span><b>Compound interest:</b> worked out on the <em class="k">new balance</em> each year, so you earn interest on interest</span></li>
      </ul>`,
      say: [
        'Interest is extra money. You pay it when you borrow, and you earn it when you save.',
        'The amount you start with is called the principal.',
        'The interest rate is a percentage, usually per year.',
        'With simple interest, the interest is worked out on the original amount, every single year.',
        "With compound interest, each year's interest is worked out on the new balance, so you also earn interest on the interest.",
      ] },
    { id: 'problem', html: `
      <div class="eyebrow">Worked example</div>
      <h2>Thabo invests R5 000 for 3 years at 8% per year</h2>
      <div class="box gold problem" data-at="1">How much will he have at the end of 3 years with <b class="hl">simple interest</b>, and how much with <b class="hl">compound interest</b>?</div>`,
      say: [
        "Let's work through an example. Thabo invests five thousand rand for three years, at eight percent per year.",
        'How much will he have at the end, with simple interest, and with compound interest?',
      ] },
    { id: 'simple', html: `
      <div class="eyebrow">Simple interest</div>
      <h2>The same interest every year</h2>
      <div class="steps">
        <div class="step" data-at="1"><span class="lbl">Each year</span>8% × R5 000 = 0,08 × R5 000 = R400</div>
        <div class="step" data-at="2"><span class="lbl">3 years</span>3 × R400 = R1 200</div>
        <div class="step ans" data-at="3"><span class="lbl">Final amount</span>R5 000 + R1 200 = R6 200,00</div>
      </div>`,
      say: [
        'Simple interest first.',
        'Eight percent of five thousand rand is four hundred rand. That is the interest every year.',
        'Over three years, three times four hundred rand is one thousand two hundred rand.',
        'So with simple interest, Thabo ends with six thousand two hundred rand.',
      ] },
    { id: 'compound', html: `
      <div class="eyebrow">Compound interest</div>
      <h2>Work it out year by year, on the new balance</h2>
      <table class="t">
        <tr><th>Year</th><th>Balance at start</th><th>Interest (8%)</th><th>Balance at end</th></tr>
        <tr data-at="1"><td>1</td><td class="num">R5 000,00</td><td class="num">R400,00</td><td class="num">R5 400,00</td></tr>
        <tr data-at="2"><td>2</td><td class="num">R5 400,00</td><td class="num">R432,00</td><td class="num">R5 832,00</td></tr>
        <tr data-at="3"><td>3</td><td class="num">R5 832,00</td><td class="num">R466,56</td><td class="num">R6 298,56</td></tr>
        <tr class="tot" data-at="4"><td colspan="3">Final amount</td><td class="num">R6 298,56</td></tr>
      </table>`,
      say: [
        'Now compound interest. Work it out year by year.',
        'In year one, eight percent of five thousand rand is four hundred rand, so the balance becomes five thousand four hundred rand.',
        'In year two, the interest is on five thousand four hundred rand. That is four hundred and thirty two rand, giving five thousand eight hundred and thirty two rand.',
        'In year three, eight percent of five thousand eight hundred and thirty two rand is four hundred and sixty six rand, fifty six cents.',
        'So the final balance is six thousand two hundred and ninety eight rand, fifty six cents.',
      ] },
    { id: 'compare', html: `
      <div class="eyebrow">Compare</div>
      <h2>Compound interest earns more, because interest earns interest</h2>
      <div class="cols">
        <div class="col" data-at="0"><h3>Simple</h3><div class="big">R6 200,00</div></div>
        <div class="col" data-at="0"><h3>Compound</h3><div class="big">R6 298,56</div></div>
        <div class="col" data-at="1"><h3>Difference</h3><div class="big">R98,56</div></div>
      </div>
      <div class="box" data-at="2"><span class="lead" style="margin:0">Calculator check: R5 000 × 1,08 × 1,08 × 1,08 = <b class="hl">R6 298,56</b></span></div>`,
      say: [
        'Compare the two answers.',
        'Compound interest gives ninety eight rand, fifty six cents more, because from the second year, interest is also earned on the interest.',
        'You can check it on your calculator: five thousand, times one comma zero eight, three times, gives the same six thousand two hundred and ninety eight rand, fifty six.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Simple interest is always on the <b>original</b> amount, never on a new balance</span></li>
        <li data-at="2"><span>Compound interest uses the <b>new balance</b> each year, not the original amount</span></li>
        <li data-at="3"><span>Round money to <b>two decimal places</b>, and only at the end</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Simple interest is always calculated on the original amount, never on a new balance.',
        'Compound interest uses the new balance every year, not the original amount.',
        'And write money to two decimal places, rounding only at the very end.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Finance.</em></h1>
      <div class="cta">Open Finance in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Finance in DONE WELL and practise interest questions, with every mark explained."] },
  ],
}
