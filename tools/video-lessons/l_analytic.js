window.LESSON = {
  id: 'maths-analytical-geometry',
  crumb: 'Mathematics · Analytical Geometry',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematics · Analytical Geometry · Grades 10–11</div>
      <h1>Analytical geometry: two points, everything else</h1>
      <div class="sub">Distance, midpoint and gradient, the equation of the line, a perpendicular gradient and the angle of inclination.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked example</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how to get almost everything from just two points: the distance, the midpoint, the gradient, the equation of the line, and its angle of inclination.'] },
    { id: 'formulae', html: `
      <div class="eyebrow">The formulae</div>
      <h2>A(x₁; y₁) and B(x₂; y₂)</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Distance</span>AB = √[(x₂ − x₁)² + (y₂ − y₁)²]</div>
        <div class="step" data-at="2"><span class="lbl">Midpoint</span>M = ((x₁ + x₂) ÷ 2 ; (y₁ + y₂) ÷ 2)</div>
        <div class="step" data-at="3"><span class="lbl">Gradient</span>m = (y₂ − y₁) ÷ (x₂ − x₁)</div>
      </div>`,
      say: [
        'For two points, A and B, there are three formulae on the formula sheet.',
        'The distance between them: the square root of the difference in x squared, plus the difference in y squared.',
        'The midpoint: the average of the x values, and the average of the y values.',
        'And the gradient: the difference in y divided by the difference in x.',
      ] },
    { id: 'example', html: `
      <div class="eyebrow">Worked example</div>
      <h2>A(−2; 3) and B(4; −1)</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">AB</span>√[(4 + 2)² + (−1 − 3)²] = √(36 + 16) = √52 ≈ 7,21</div>
        <div class="step" data-at="2"><span class="lbl">M</span>((−2 + 4) ÷ 2 ; (3 − 1) ÷ 2) = (1; 1)</div>
        <div class="step ans" data-at="3"><span class="lbl" style="text-transform:none;letter-spacing:0">m(AB)</span>(−1 − 3) ÷ (4 + 2) = −4 ÷ 6 = −⅔</div>
      </div>`,
      say: [
        "Let's use the points A, negative two, three, and B, four, negative one.",
        'The distance: four minus negative two is six, and negative one minus three is negative four. Six squared plus negative four squared is fifty two, so A B is the square root of fifty two, about seven comma two one.',
        'The midpoint: negative two plus four, over two, is one. Three plus negative one, over two, is one. So M is one, one.',
        'The gradient: negative four over six, which is negative two thirds.',
      ] },
    { id: 'line', html: `
      <div class="eyebrow">The equation of the line (Gr 11)</div>
      <h2>y − y₁ = m(x − x₁), with m = −⅔ through A(−2; 3)</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Substitute</span>y − 3 = −⅔(x + 2)</div>
        <div class="step" data-at="2"><span class="lbl">Simplify</span>y = −⅔x − 4⁄3 + 3 = −⅔x + 5⁄3</div>
        <div class="step ans" data-at="3"><span class="lbl">Check B</span>x = 4: y = −8⁄3 + 5⁄3 = −1 ✓</div>
      </div>`,
      say: [
        'In Grade eleven, you find the equation of the line. Use y minus y one equals m, times x minus x one, with the gradient negative two thirds and the point A.',
        'Substitute: y minus three equals negative two thirds, times x plus two.',
        'Simplify: y equals negative two thirds x, plus five thirds.',
        'Check it with the other point. When x is four, y is negative eight thirds plus five thirds, which is negative one. That is point B, so the equation is right.',
      ] },
    { id: 'perp', html: `
      <div class="eyebrow">Perpendicular lines and inclination (Gr 11)</div>
      <h2>m₁ × m₂ = −1, and tan θ = m</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Perpendicular</span>m = 3⁄2, because −⅔ × 3⁄2 = −1</div>
        <div class="step" data-at="2"><span class="lbl" style="text-transform:none;letter-spacing:0">tan θ</span>tan θ = −⅔ &nbsp;→&nbsp; reference angle 33,69°</div>
        <div class="step ans" data-at="3"><span class="lbl" style="text-transform:none;letter-spacing:0">θ</span>gradient negative: θ = 180° − 33,69° = 146,31°</div>
      </div>`,
      say: [
        'Two more things you are often asked.',
        'A line perpendicular to A B has the negative reciprocal gradient: three over two, because negative two thirds times three halves is negative one.',
        'The angle of inclination, theta, satisfies tan theta equals the gradient. Tan theta is negative two thirds, and the calculator gives a reference angle of thirty three comma six nine degrees.',
        'The gradient is negative, so the line slopes down and theta is obtuse: one hundred and eighty minus thirty three comma six nine, which is one hundred and forty six comma three one degrees.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Sign errors with negatives: write <b>(4 − (−2))</b>, with brackets</span></li>
        <li data-at="2"><span>Mixing the order: take y₂ and x₂ from the <b>same</b> point</span></li>
        <li data-at="3"><span>Giving a negative angle of inclination: add <b>180°</b> when the gradient is negative</span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Sign errors with negative coordinates. Write four minus negative two, in brackets.',
        'Mixing the order. If y two comes from B, then x two must come from B too.',
        'And giving a negative angle of inclination. When the gradient is negative, add one hundred and eighty degrees to the calculator answer.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Analytical Geometry.</em></h1>
      <div class="cta">Open Analytical Geometry in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Analytical Geometry in DONE WELL and practise with every mark explained."] },
  ],
}
