(function () {
  // Eleven test marks out of 20. Sorted: 7 9 11 12 14 15 15 15 16 18 20.
  // Sum 152, mean 13,8; median 15 (6th); mode 15; range 13; Q1 11, Q3 16, IQR 5.
  const raw = [12, 15, 9, 18, 15, 20, 7, 15, 11, 16, 14]
  const sorted = [...raw].sort((a, b) => a - b)
  const chip = (v, cls = '') => `<span class="chip ${cls}">${v}</span>`
  const row = (vals, mark) => `<div class="chips">${vals.map((v, i) => chip(v, mark ? mark(i) : '')).join('')}</div>`
  const style = `<style>
    .chips { display: flex; gap: 12px; margin-top: 18px; }
    .chip { font-family: 'MonoV', monospace; font-size: 34px; font-weight: 700; width: 74px; height: 74px; display: grid; place-items: center; border-radius: 12px; background: rgba(16,31,58,.85); border: 1px solid var(--n600); color: #fff; }
    .chip.mid { border-color: var(--g400); background: rgba(230,175,56,.18); color: var(--g300); }
    .chip.mode { border-color: var(--blue); color: var(--blue); }
    .chip.q { border-color: var(--ok); color: var(--ok); }
    .chip.end { border-color: var(--red); color: var(--red); }
  </style>`
  // Box-and-whisker on a 0–20 axis, 40 px per mark.
  const X = (v) => 60 + v * 44
  const box = `<svg style="margin-top:34px" width="1080" height="200" viewBox="0 0 1080 200">
    <line x1="${X(0)}" y1="150" x2="${X(20)}" y2="150" stroke="#8499bd" stroke-width="2"/>
    ${[0, 5, 10, 15, 20].map((v) => `<line x1="${X(v)}" y1="144" x2="${X(v)}" y2="156" stroke="#8499bd" stroke-width="2"/><text x="${X(v)}" y="182" fill="#adbbd3" font-size="18" text-anchor="middle">${v}</text>`).join('')}
    <g data-at="1"><line x1="${X(7)}" y1="70" x2="${X(11)}" y2="70" stroke="#fff" stroke-width="3"/><line x1="${X(7)}" y1="48" x2="${X(7)}" y2="92" stroke="#fff" stroke-width="3"/>
      <line x1="${X(16)}" y1="70" x2="${X(20)}" y2="70" stroke="#fff" stroke-width="3"/><line x1="${X(20)}" y1="48" x2="${X(20)}" y2="92" stroke="#fff" stroke-width="3"/>
      <rect x="${X(11)}" y="36" width="${X(16) - X(11)}" height="68" fill="rgba(230,175,56,.15)" stroke="#e6af38" stroke-width="3"/>
      <line x1="${X(15)}" y1="36" x2="${X(15)}" y2="104" stroke="#e6af38" stroke-width="4"/>
      ${[[7, 'min 7'], [11, 'Q1 11'], [15, 'median 15'], [16, 'Q3 16'], [20, 'max 20']].map(([v, l], i) => `<text x="${X(v) + (i === 2 ? -6 : i === 3 ? 8 : 0)}" y="24" fill="#edc561" font-size="17" font-weight="700" text-anchor="${i === 2 ? 'end' : i === 3 ? 'start' : 'middle'}">${l}</text>`).join('')}</g>
  </svg>`
  window.LESSON = {
    id: 'matlit-data-summary',
    crumb: 'Mathematical Literacy · Data Handling',
    scenes: [
      { id: 'title', cls: 'title', html: `${style}
        <div class="subject">Mathematical Literacy · Data Handling · Grades 10 to 12</div>
        <h1>Mean, median, mode, range and quartiles</h1>
        <div class="sub">How to summarise a data set, step by step, and how to find a missing value from the mean.</div>
        <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
        say: ['Welcome to DONE WELL. In this lesson you will learn how to summarise a set of data with the mean, the median, the mode, the range and the quartiles, and how to work backwards from the mean to find a missing value.'] },
      { id: 'data', html: `
        <div class="eyebrow">Step one</div>
        <h2>Always sort the data first</h2>
        <div data-at="0">${row(raw)}</div>
        <div data-at="2" style="margin-top:22px">${row(sorted)}</div>
        <div class="lead" data-at="3">11 values, so <b class="hl">n = 11</b></div>`,
        say: [
          'Here are the test marks of eleven learners, out of twenty.',
          'Before you calculate anything, write the data in order, from smallest to largest.',
          'Seven, nine, eleven, twelve, fourteen, fifteen, fifteen, fifteen, sixteen, eighteen, twenty.',
          'Count the values. There are eleven, so n equals eleven.',
        ] },
      { id: 'mean', html: `
        <div class="eyebrow">The mean</div>
        <h2>Mean = sum of the values ÷ number of values</h2>
        <div class="steps">
          <div class="step" data-at="1"><span class="lbl">Sum</span>7 + 9 + 11 + 12 + 14 + 15 + 15 + 15 + 16 + 18 + 20 = 152</div>
          <div class="step" data-at="2"><span class="lbl">Divide</span>152 ÷ 11 = 13,818…</div>
          <div class="step ans" data-at="3"><span class="lbl">Mean</span>≈ 13,8 marks</div>
        </div>`,
        say: [
          'The mean is the average. Add all the values, and divide by how many there are.',
          'The sum of the eleven marks is one hundred and fifty two.',
          'One hundred and fifty two divided by eleven is thirteen comma eight one eight.',
          'So the mean is about thirteen comma eight marks.',
        ] },
      { id: 'median', html: `
        <div class="eyebrow">Median and mode</div>
        <h2>The middle value, and the most common value</h2>
        <div data-at="0">${row(sorted, (i) => (i === 5 ? 'mid' : ''))}</div>
        <div class="lead" data-at="1">Position of the median = (n + 1) ÷ 2 = (11 + 1) ÷ 2 = <b class="hl">6th value = 15</b></div>
        <div data-at="3">${row(sorted, (i) => (i >= 5 && i <= 7 ? 'mode' : ''))}</div>
        <div class="lead" data-at="3">Mode = <b class="hl">15</b> (it appears three times)</div>`,
        say: [
          'The median is the middle value of the sorted data.',
          'Its position is n plus one, divided by two. Eleven plus one, divided by two, is six. So the median is the sixth value, which is fifteen.',
          'With an even number of values, there are two middle values, and the median is halfway between them.',
          'The mode is the value that appears most often. Fifteen appears three times, so the mode is fifteen.',
        ] },
      { id: 'spread', html: `
        <div class="eyebrow">Range and quartiles</div>
        <h2>How spread out is the data?</h2>
        <div data-at="0">${row(sorted, (i) => (i === 0 || i === 10 ? 'end' : i === 2 || i === 8 ? 'q' : i === 5 ? 'mid' : ''))}</div>
        <div class="lead" data-at="0">Range = 20 − 7 = <b class="hl">13</b></div>
        <div class="lead" data-at="2">Q1 = median of 7, 9, 11, 12, 14 = <b class="hl">11</b> &nbsp; Q3 = median of 15, 15, 16, 18, 20 = <b class="hl">16</b></div>
        <div class="lead" data-at="3">Interquartile range = Q3 − Q1 = 16 − 11 = <b class="hl">5</b></div>`,
        say: [
          'The range is the largest value minus the smallest value. Twenty minus seven is thirteen.',
          'In Grade twelve you also need the quartiles. The median splits the data into a lower half and an upper half.',
          'The lower quartile, Q one, is the median of the lower half: seven, nine, eleven, twelve, fourteen. That is eleven. The upper quartile, Q three, is the median of the upper half: fifteen, fifteen, sixteen, eighteen, twenty. That is sixteen.',
          'The interquartile range is Q three minus Q one. Sixteen minus eleven is five. It tells you how spread out the middle half of the data is.',
        ] },
      { id: 'box', html: `
        <div class="eyebrow">Box-and-whisker plot</div>
        <h2>The five-number summary, drawn</h2>
        <div class="lead" data-at="0">Minimum 7 · Q1 11 · Median 15 · Q3 16 · Maximum 20</div>${box}`,
        say: [
          'These five numbers are the five-number summary: the minimum, Q one, the median, Q three and the maximum.',
          'A box-and-whisker plot shows them on a number line. The box runs from Q one to Q three, with a line at the median, and the whiskers reach out to the minimum and the maximum.',
          'Here the median is close to Q three, so the top half of the middle marks is bunched together.',
        ] },
      { id: 'unknown', html: `
        <div class="eyebrow">Working backwards</div>
        <h2>A missing value from the mean</h2>
        <div class="box problem" data-at="0">The mean of five marks is 14. Four of the marks are 12, 15, 9 and 18. Determine the fifth mark.</div>
        <div class="steps tight">
          <div class="step" data-at="1"><span class="lbl">Total</span>5 × 14 = 70</div>
          <div class="step" data-at="2"><span class="lbl">Known</span>12 + 15 + 9 + 18 = 54</div>
          <div class="step ans" data-at="3"><span class="lbl">Missing</span>70 − 54 = 16</div>
        </div>`,
        say: [
          'Examiners often turn the question around. The mean of five marks is fourteen. Four of the marks are twelve, fifteen, nine and eighteen. Determine the fifth mark.',
          'If the mean of five marks is fourteen, then the five marks add up to five times fourteen, which is seventy.',
          'The four known marks add up to fifty four.',
          'So the missing mark is seventy minus fifty four, which is sixteen. Check: seventy divided by five is fourteen.',
        ] },
      { id: 'mistakes', html: `
        <div class="eyebrow">Avoid these mistakes</div>
        <h2>Where marks are lost</h2>
        <ul class="pts warn">
          <li data-at="1"><span>Finding the median <b>without sorting</b> the data first</span></li>
          <li data-at="2"><span>Giving the <b>position</b> (6th) instead of the <b>value</b> (15)</span></li>
          <li data-at="3"><span>Range is <b>one number</b>: 20 − 7 = 13, not "7 to 20"</span></li>
        </ul>`,
        say: [
          'Three mistakes to avoid.',
          'Never find the median before sorting the data.',
          'The median is a value, not a position. Say fifteen, not "the sixth".',
          'And the range is one number, the difference. Thirteen, not "seven to twenty".',
        ] },
      { id: 'outro', cls: 'outro', html: `
        <h1>Now it's your turn.<br><em>Practise Data Handling.</em></h1>
        <div class="cta">Open Data Handling in DONE WELL</div>
        <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
        say: ["Now it's your turn. Open Data Handling in DONE WELL, and practise these questions, with every mark explained."] },
    ],
  }
})()
