window.LESSON = {
  id: 'matlit-budget-inflation',
  crumb: 'Mathematical Literacy · Finance',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematical Literacy · Finance · Grades 10–12</div>
      <h1>Household budgets and inflation</h1>
      <div class="sub">Income against expenses, a surplus or a deficit, and what inflation does to next year's prices.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how to read a household budget, find a surplus or a deficit, and work out what inflation does to prices next year.'] },
    { id: 'budget', html: `
      <div class="eyebrow">A monthly budget</div>
      <h2>The Mokoena family's month</h2>
      <table class="t">
        <tr><th>Income</th><th>R</th><th>Expenses</th><th>R</th></tr>
        <tr data-at="1"><td>Salary (net)</td><td class="num">12&nbsp;600</td><td>Rent</td><td class="num">4&nbsp;500</td></tr>
        <tr data-at="1"><td>Child support grants</td><td class="num">1&nbsp;120</td><td>Groceries</td><td class="num">4&nbsp;250</td></tr>
        <tr data-at="2"><td></td><td></td><td>Transport</td><td class="num">1&nbsp;960</td></tr>
        <tr data-at="2"><td></td><td></td><td>Electricity and water</td><td class="num">1&nbsp;380</td></tr>
        <tr data-at="2"><td></td><td></td><td>School and clothing</td><td class="num">850</td></tr>
        <tr class="tot" data-at="3"><td>Total</td><td class="num">13&nbsp;720</td><td>Total</td><td class="num">12&nbsp;940</td></tr>
      </table>`,
      say: [
        "Here is the Mokoena family's budget for one month.",
        'Their income is a net salary of twelve thousand six hundred rand, and child support grants of one thousand one hundred and twenty rand.',
        'Their expenses are rent, groceries, transport, electricity and water, and school and clothing.',
        'The total income is thirteen thousand seven hundred and twenty rand, and the total expenses are twelve thousand nine hundred and forty rand.',
      ] },
    { id: 'surplus', html: `
      <div class="eyebrow">Surplus or deficit?</div>
      <h2>Income minus expenses</h2>
      <div class="steps">
        <div class="step" data-at="1"><span class="lbl">Difference</span>13&nbsp;720 − 12&nbsp;940 = R780</div>
        <div class="step ans" data-at="2"><span class="lbl">Surplus</span>positive, so a surplus of R780 to save</div>
        <div class="step" data-at="3"><span class="lbl">Groceries</span>4&nbsp;250 ÷ 13&nbsp;720 × 100 = 31,0% of income</div>
      </div>`,
      say: [
        'Subtract the expenses from the income.',
        'Thirteen thousand seven hundred and twenty minus twelve thousand nine hundred and forty is seven hundred and eighty rand.',
        'It is positive, so the family has a surplus of seven hundred and eighty rand, which they can save. If it were negative, it would be a deficit.',
        'Exams also ask for a percentage: groceries are four thousand two hundred and fifty out of thirteen thousand seven hundred and twenty, which is thirty one percent of the income.',
      ] },
    { id: 'inflation', html: `
      <div class="eyebrow">Inflation</div>
      <h2>If inflation is 5,5%, what will this month's groceries cost next year?</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Increase</span>5,5% × R4&nbsp;250 = R233,75</div>
        <div class="step" data-at="2"><span class="lbl">Next year</span>R4&nbsp;250 + R233,75 = R4&nbsp;483,75</div>
        <div class="step" data-at="3"><span class="lbl">Shortcut</span>R4&nbsp;250 × 1,055 = R4&nbsp;483,75</div>
        <div class="step ans" data-at="4"><span class="lbl">Two years</span>R4&nbsp;483,75 × 1,055 = R4&nbsp;730,36</div>
      </div>`,
      say: [
        'Inflation is the rise in prices over time. If inflation is five comma five percent, what will the same groceries cost next year?',
        'The increase is five comma five percent of four thousand two hundred and fifty rand: two hundred and thirty three rand, seventy five cents.',
        'So next year they cost four thousand four hundred and eighty three rand, seventy five.',
        'The shortcut is to multiply by one comma zero five five.',
        'For a second year, the inflation is worked on the new price, not the old one: four thousand four hundred and eighty three, seventy five, times one comma zero five five, which is four thousand seven hundred and thirty rand, thirty six cents.',
      ] },
    { id: 'meaning', html: `
      <div class="eyebrow">What it means</div>
      <h2>If the salary does not rise with inflation, the surplus shrinks</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Groceries up</span>R4&nbsp;483,75 − R4&nbsp;250 = R233,75 more each month</div>
        <div class="step ans" data-at="2"><span class="lbl">New surplus</span>R780 − R233,75 = R546,25, from groceries alone</div>
      </div>`,
      say: [
        'What does that mean for the family?',
        'If only the groceries rise, they cost two hundred and thirty three rand, seventy five more each month.',
        'If the salary stays the same, the surplus drops from seven hundred and eighty rand to five hundred and forty six rand, twenty five, from groceries alone. That is why salary increases are compared with inflation.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Using <b>gross</b> salary when the budget is built on <b>net</b> (take-home) pay</span></li>
        <li data-at="2"><span>Working inflation for year 2 on the <b>original</b> price: use the new one</span></li>
        <li data-at="3"><span>Calling a negative difference a surplus: negative is a <b>deficit</b></span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Using the gross salary when the budget is built on net, take-home pay.',
        'Working the second year of inflation on the original price. Use the new price.',
        'And calling a negative difference a surplus. Negative is a deficit.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Finance.</em></h1>
      <div class="cta">Open Finance in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Finance in DONE WELL and practise budget and inflation questions, with every mark explained."] },
  ],
}
