function calculateTax() {
  const rawIncome = parseFloat(document.getElementById('taxIncome').value) || 0;
  const period = document.getElementById('incomePeriod').value;
  const age = document.getElementById('taxAge').value;
  const medMembers = parseInt(document.getElementById('medMembers').value) || 0;

  const annualIncome = (period === 'monthly') ? rawIncome * 12 : rawIncome;

  let grossTax = 0;
  let bracketName = "";
  let formulaText = "";

  if (annualIncome <= 0) {
    grossTax = 0; bracketName = "No Income"; formulaText = "R0.00";
  } else if (annualIncome <= 237100) {
    grossTax = annualIncome * 0.18; bracketName = "Bracket 1 (18%)";
    formulaText = `18% of R${formatMoney(annualIncome)}`;
  } else if (annualIncome <= 370500) {
    grossTax = 42678 + 0.26 * (annualIncome - 237100); bracketName = "Bracket 2 (26%)";
    formulaText = `R42 678 + 26% of (R${formatMoney(annualIncome)} - R237 100)`;
  } else if (annualIncome <= 512800) {
    grossTax = 77362 + 0.31 * (annualIncome - 370500); bracketName = "Bracket 3 (31%)";
    formulaText = `R77 362 + 31% of (R${formatMoney(annualIncome)} - R370 500)`;
  } else if (annualIncome <= 673000) {
    grossTax = 121475 + 0.36 * (annualIncome - 512800); bracketName = "Bracket 4 (36%)";
    formulaText = `R121 475 + 36% of (R${formatMoney(annualIncome)} - R512 800)`;
  } else if (annualIncome <= 857900) {
    grossTax = 179147 + 0.39 * (annualIncome - 673000); bracketName = "Bracket 5 (39%)";
    formulaText = `R179 147 + 39% of (R${formatMoney(annualIncome)} - R673 000)`;
  } else if (annualIncome <= 1817000) {
    grossTax = 251258 + 0.41 * (annualIncome - 857900); bracketName = "Bracket 6 (41%)";
    formulaText = `R251 258 + 41% of (R${formatMoney(annualIncome)} - R857 900)`;
  } else {
    grossTax = 644489 + 0.45 * (annualIncome - 1817000); bracketName = "Bracket 7 (45%)";
    formulaText = `R644 489 + 45% of (R${formatMoney(annualIncome)} - R1 817 000)`;
  }

  const primaryRebate = 17235;
  let secondaryRebate = (age === '65to74' || age === '75plus') ? 9444 : 0;
  let tertiaryRebate = (age === '75plus') ? 3145 : 0;
  const totalRebate = primaryRebate + secondaryRebate + tertiaryRebate;

  let monthlyMedCredit = 0;
  if (medMembers === 1) monthlyMedCredit = 364;
  else if (medMembers === 2) monthlyMedCredit = 728;
  else if (medMembers > 2) monthlyMedCredit = 728 + (medMembers - 2) * 246;
  const annualMedCredit = monthlyMedCredit * 12;

  const netTaxAnnual = Math.max(0, grossTax - totalRebate - annualMedCredit);
  const netTaxMonthly = netTaxAnnual / 12;
  const effectiveRate = (annualIncome > 0) ? (netTaxAnnual / annualIncome) * 100 : 0;

  document.getElementById('monthlyTaxVal').innerText = `R${formatMoney(netTaxMonthly)}`;
  document.getElementById('annualTaxVal').innerText = `R${formatMoney(netTaxAnnual)}`;
  document.getElementById('effectiveRateVal').innerText = `${effectiveRate.toFixed(1).replace('.', ',')}%`;
  document.getElementById('bracketBadge').innerText = bracketName;

  document.getElementById('breakdownSection').innerHTML = `
    <strong>Step 1: Gross Annual Income</strong><br>R${formatMoney(annualIncome)}<br><br>
    <strong>Step 2: Gross Tax Calculation (${bracketName})</strong><br>${formulaText} = <strong>R${formatMoney(grossTax)}</strong><br><br>
    <strong>Step 3: Deduct Primary/Secondary Rebates</strong><br>R${formatMoney(grossTax)} - R${formatMoney(totalRebate)} = <strong>R${formatMoney(Math.max(0, grossTax - totalRebate))}</strong><br><br>
    <strong>Step 4: Deduct Medical Aid Tax Credits</strong><br>Annual Credit (R${monthlyMedCredit}/mo × 12) = R${formatMoney(annualMedCredit)}<br>
    <strong>Final Annual Tax: R${formatMoney(netTaxAnnual)}</strong>
  `;
}

// Rand as a Mathematical Literacy paper writes it, and as the rest of the
// site does: a space between thousands and a decimal comma, R41 797,00.
// Not toLocaleString('en-ZA'): browsers disagree on that locale, and
// some print 41,797.00. The space does not break, so an amount never
// splits across two lines.
function formatMoney(amount) {
  const [whole, cents] = Math.abs(amount).toFixed(2).split('.');
  return (amount < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + ',' + cents;
}

function toggleBreakdown() {
  const section = document.getElementById('breakdownSection');
  section.style.display = (section.style.display === 'none') ? 'block' : 'none';
}

// Wired here rather than with oninput="..." attributes: the site's security
// policy (public/_headers) runs no script written inside the HTML.
document.addEventListener('DOMContentLoaded', () => {
  for (const id of ['taxIncome', 'incomePeriod', 'taxAge', 'medMembers']) {
    document.getElementById(id).addEventListener(id === 'taxIncome' ? 'input' : 'change', calculateTax);
  }
  document.getElementById('breakdownToggle').addEventListener('click', toggleBreakdown);
  calculateTax();
});
