window.LESSON = {
  id: 'matlit-income-tax',
  crumb: 'Mathematical Literacy · Finance',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematical Literacy · Finance · Grade 12</div>
      <h1>Income tax and the tax threshold</h1>
      <div class="sub">Reading the SARS tax table, subtracting rebates, and finding the threshold yourself.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">2026/2027 tax year</span><span class="pill">About 5 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how to calculate income tax from the SARS tax table, and how to find the tax threshold yourself, step by step.'] },
    { id: 'chain', html: `
      <div class="eyebrow">The method</div>
      <h2>Income tax is one chain of steps, always in this order</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">1</span>Gross income − pension or retirement contributions = <b>taxable income</b></div>
        <div class="step" data-at="2"><span class="lbl">2</span>Find the taxable income's row in the SARS table and calculate the tax</div>
        <div class="step" data-at="3"><span class="lbl">3</span>Subtract the <b>rebates</b> for the person's age</div>
        <div class="step ans" data-at="4"><span class="lbl">4</span>That is the tax for the year. ÷ 12 gives the monthly tax (PAYE)</div>
      </div>`,
      say: [
        'Income tax is one chain of steps, and you always do them in the same order.',
        'First, subtract pension or retirement contributions from the gross income. What is left is the taxable income.',
        'Second, find the row of the SARS tax table that the taxable income falls in, and calculate the tax.',
        "Third, subtract the rebates for the person's age.",
        'That gives the tax for the year. Divide by twelve for the tax each month, called PAYE.',
      ] },
    { id: 'table', html: `
      <div class="eyebrow">The SARS table, 2026/2027</div>
      <h2>Each row: a fixed amount, plus a percentage of the part above the row's start</h2>
      <table class="t">
        <tr><th>Taxable income (R)</th><th>Rates of tax (R)</th></tr>
        <tr data-at="1"><td>1 – 245&nbsp;100</td><td>18% of taxable income</td></tr>
        <tr data-at="2"><td>245&nbsp;101 – 383&nbsp;100</td><td>44&nbsp;118 + 26% of taxable income above 245&nbsp;100</td></tr>
        <tr data-at="3"><td>383&nbsp;101 – 530&nbsp;200</td><td>79&nbsp;998 + 31% of taxable income above 383&nbsp;100</td></tr>
      </table>
      <div class="box" data-at="4"><span class="lead" style="margin:0">Rebates: <b>primary R17&nbsp;820</b> · <b>secondary R9&nbsp;765</b> (65+) · <b>tertiary R3&nbsp;249</b> (75+)</span></div>`,
      say: [
        'Here are the first three rows of the SARS table for the twenty twenty six, twenty twenty seven tax year.',
        'In the first row, up to two hundred and forty five thousand one hundred rand, the tax is simply eighteen percent of the taxable income.',
        'In the second row, the tax is forty four thousand one hundred and eighteen rand, plus twenty six percent of the part above two hundred and forty five thousand one hundred rand.',
        'Every other row works the same way: a fixed amount, plus a percentage of only the part above where that row starts.',
        'Then the rebates. Everyone gets the primary rebate of seventeen thousand eight hundred and twenty rand. At sixty five or older, add the secondary rebate. At seventy five or older, add the tertiary rebate as well.',
      ] },
    { id: 'problem', html: `
      <div class="eyebrow">Worked example</div>
      <h2>Nomsa is 41 and earns R348&nbsp;000 a year</h2>
      <div class="box gold problem" data-at="1">She contributes <b class="hl">7,5%</b> of her gross income to a pension fund. Calculate her annual income tax and her monthly PAYE.</div>`,
      say: [
        "Let's work through an example. Nomsa is forty one years old and earns three hundred and forty eight thousand rand a year.",
        'She contributes seven comma five percent of her gross income to a pension fund. Calculate her income tax for the year, and her tax each month.',
      ] },
    { id: 'solve', html: `
      <div class="eyebrow">Step by step</div>
      <h2>Follow the chain</h2>
      <div class="steps tight">
        <div class="step" data-at="0"><span class="lbl">Pension</span>7,5% × R348&nbsp;000 = R26&nbsp;100</div>
        <div class="step" data-at="1"><span class="lbl">Taxable</span>R348&nbsp;000 − R26&nbsp;100 = R321&nbsp;900 → row 2</div>
        <div class="step" data-at="2"><span class="lbl">Above</span>R321&nbsp;900 − R245&nbsp;100 = R76&nbsp;800</div>
        <div class="step" data-at="3"><span class="lbl">Table</span>R44&nbsp;118 + 26% × R76&nbsp;800 = R44&nbsp;118 + R19&nbsp;968 = R64&nbsp;086</div>
        <div class="step" data-at="4"><span class="lbl">Rebate</span>R64&nbsp;086 − R17&nbsp;820 = R46&nbsp;266 per year</div>
        <div class="step ans" data-at="5"><span class="lbl">Monthly</span>R46&nbsp;266 ÷ 12 = R3&nbsp;855,50</div>
      </div>`,
      say: [
        'Seven comma five percent of three hundred and forty eight thousand rand is twenty six thousand one hundred rand.',
        'So her taxable income is three hundred and twenty one thousand nine hundred rand. That falls in the second row of the table.',
        'The tax is forty four thousand one hundred and eighteen rand, plus twenty six percent of the part above two hundred and forty five thousand one hundred. That part is seventy six thousand eight hundred rand.',
        'Twenty six percent of seventy six thousand eight hundred is nineteen thousand nine hundred and sixty eight rand, so the tax from the table is sixty four thousand and eighty six rand.',
        'Nomsa is under sixty five, so she gets only the primary rebate. Sixty four thousand and eighty six, minus seventeen thousand eight hundred and twenty, is forty six thousand two hundred and sixty six rand for the year.',
        'Divide by twelve: her tax is three thousand eight hundred and fifty five rand, fifty cents a month.',
      ] },
    { id: 'threshold', html: `
      <div class="eyebrow">The tax threshold</div>
      <h2>The income at which the tax from the table is exactly cancelled by the rebates</h2>
      <ul class="pts">
        <li data-at="1"><span>Below the threshold, the rebates are <b>bigger</b> than the tax, so <em class="k">no tax</em> is paid</span></li>
        <li data-at="2"><span>Above it, tax is paid, worked out with the table and the rebates as normal</span></li>
        <li data-at="3"><span>The threshold falls in the <b>first row</b>, so the tax there is just <b>18%</b> of the income</span></li>
      </ul>
      <div class="box gold" data-at="4"><span class="lead" style="margin:0"><b class="hl">18% × threshold = rebates</b> &nbsp;so&nbsp; <b class="hl">threshold = rebates ÷ 0,18</b></span></div>`,
      say: [
        'Now the tax threshold. Many learners think it is a separate rule to memorise. It is not.',
        'The threshold is the income at which the tax from the table is exactly cancelled by the rebates. Below it, the rebates are bigger than the tax, so no tax is paid at all.',
        'Above it, tax is paid, and you work it out with the table and the rebates as normal.',
        'Every threshold falls in the first row of the table, where the tax is just eighteen percent of the income.',
        'So eighteen percent of the threshold equals the rebates. That means the threshold is the rebates divided by zero comma one eight.',
      ] },
    { id: 'find', html: `
      <div class="eyebrow">Finding each threshold</div>
      <h2>Add the rebates for the age, then divide by 0,18</h2>
      <table class="t">
        <tr><th>Age</th><th>Rebates</th><th>Threshold</th></tr>
        <tr data-at="1"><td>Under 65</td><td class="num">R17&nbsp;820</td><td class="num">R17&nbsp;820 ÷ 0,18 = <b>R99&nbsp;000</b></td></tr>
        <tr data-at="3"><td>65 to 74</td><td class="num">R17&nbsp;820 + R9&nbsp;765 = R27&nbsp;585</td><td class="num">R27&nbsp;585 ÷ 0,18 = <b>R153&nbsp;250</b></td></tr>
        <tr data-at="4"><td>75 and older</td><td class="num">R27&nbsp;585 + R3&nbsp;249 = R30&nbsp;834</td><td class="num">R30&nbsp;834 ÷ 0,18 = <b>R171&nbsp;300</b></td></tr>
      </table>
      <div class="box" data-at="2"><span class="lead" style="margin:0">Check: 18% × R99&nbsp;000 = R17&nbsp;820, and R17&nbsp;820 − R17&nbsp;820 = <b class="hl">R0</b></span></div>`,
      say: [
        "Let's find all three thresholds.",
        'Under sixty five, there is only the primary rebate. Seventeen thousand eight hundred and twenty, divided by zero comma one eight, is ninety nine thousand rand.',
        'Check it. Eighteen percent of ninety nine thousand is seventeen thousand eight hundred and twenty, and taking off the rebate leaves exactly zero.',
        'From sixty five, add the secondary rebate: twenty seven thousand five hundred and eighty five rand. Divided by zero comma one eight, that is one hundred and fifty three thousand two hundred and fifty rand.',
        'From seventy five, add the tertiary rebate as well: thirty thousand eight hundred and thirty four rand. Divided by zero comma one eight, that is one hundred and seventy one thousand three hundred rand.',
      ] },
    { id: 'use', html: `
      <div class="eyebrow">Using the threshold</div>
      <h2>Mr Dlamini is 70, with a taxable income of R140&nbsp;000</h2>
      <div class="steps">
        <div class="step" data-at="1"><span class="lbl">Compare</span>R140&nbsp;000 is below his threshold of R153&nbsp;250</div>
        <div class="step" data-at="2"><span class="lbl">Check</span>18% × R140&nbsp;000 = R25&nbsp;200, less than R27&nbsp;585 in rebates</div>
        <div class="step ans" data-at="3"><span class="lbl">Answer</span>He pays no income tax</div>
      </div>`,
      say: [
        'Here is how a question uses it. Mr Dlamini is seventy, with a taxable income of one hundred and forty thousand rand. Does he pay tax?',
        'He is between sixty five and seventy four, so his threshold is one hundred and fifty three thousand two hundred and fifty rand. His income is below it.',
        'You can check: eighteen percent of one hundred and forty thousand is twenty five thousand two hundred rand, which is less than his rebates of twenty seven thousand five hundred and eighty five rand.',
        'So he pays no income tax. Never write a negative tax. The answer is zero.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Subtract pension contributions <b>before</b> using the table</span></li>
        <li data-at="2"><span>Apply the row's percentage only to the part <b>above</b> where the row starts, never the whole income</span></li>
        <li data-at="3"><span>Rebates <b>add up</b> with age: 65 and older gets primary + secondary</span></li>
        <li data-at="4"><span>The table gives tax <b>per year</b>: divide by 12 only when asked for a month</span></li>
      </ul>`,
      say: [
        'Watch out for four common mistakes.',
        'Subtract pension contributions before you use the table, not after.',
        "Apply the row's percentage only to the part above where the row starts. Never to the whole income.",
        'Rebates add up with age. Someone who is sixty five or older gets the primary and the secondary rebate together.',
        'And the table gives the tax for a year. Divide by twelve only when the question asks for a month.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Finance.</em></h1>
      <div class="cta">Open Finance in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Finance in DONE WELL and practise taxation questions, with every mark explained."] },
  ],
}
