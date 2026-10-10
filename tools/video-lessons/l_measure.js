window.LESSON = {
  id: 'matlit-measurement',
  crumb: 'Mathematical Literacy · Measurement',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Mathematical Literacy · Measurement · Grades 10–12</div>
      <h1>Area, volume and converting units</h1>
      <div class="sub">Perimeter, area and volume, how units convert, and two worked examples: a water tank and a wall to paint.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Worked examples</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn the difference between perimeter, area and volume, how to convert their units, and how to answer two typical exam questions.'] },
    { id: 'three', html: `
      <div class="eyebrow">Three different questions</div>
      <h2>How far around, how much surface, how much space inside</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>Perimeter</h3><div class="big">m</div><p>The distance <b>around</b> a shape: fencing, skirting, a border.</p></div>
        <div class="col" data-at="2"><h3>Area</h3><div class="big">m²</div><p>The <b>surface</b> covered: paint, tiles, carpet, grass.</p></div>
        <div class="col" data-at="3"><h3>Volume</h3><div class="big">m³</div><p>The <b>space inside</b>: water in a tank, concrete, sand.</p></div>
      </div>`,
      say: [
        'Measurement questions ask one of three different things.',
        'Perimeter is the distance around a shape, in metres. You need it for fencing, or a border.',
        'Area is the surface a shape covers, in square metres. You need it for paint, tiles or carpet.',
        'Volume is the space inside a solid, in cubic metres. You need it for water in a tank, or concrete. The exam gives you the formulas, so your job is to choose the right one and use the right units.',
      ] },
    { id: 'convert', html: `
      <div class="eyebrow">Converting units</div>
      <h2>Area squares the conversion. Volume cubes it.</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Length</span>1 m = 100 cm &nbsp;&nbsp; 1 cm = 10 mm &nbsp;&nbsp; 1 km = 1&nbsp;000 m</div>
        <div class="step" data-at="2"><span class="lbl">Area</span>1 m² = 100 cm × 100 cm = 10&nbsp;000 cm²</div>
        <div class="step" data-at="3"><span class="lbl">Volume</span>1 m³ = 100 × 100 × 100 = 1&nbsp;000&nbsp;000 cm³</div>
        <div class="step ans" data-at="4"><span class="lbl">Capacity</span>1 m³ = 1&nbsp;000 ℓ &nbsp;&nbsp; 1 cm³ = 1 mℓ</div>
      </div>`,
      say: [
        'Converting units is where most marks are lost.',
        'For length you multiply or divide by ten, one hundred or one thousand. One metre is one hundred centimetres.',
        'But a square metre is one hundred centimetres by one hundred centimetres, so one square metre is ten thousand square centimetres, not one hundred.',
        'And a cubic metre is one hundred times one hundred times one hundred, which is one million cubic centimetres.',
        'For capacity, remember: one cubic metre holds one thousand litres, and one cubic centimetre is one millilitre.',
      ] },
    { id: 'tank', html: `
      <div class="eyebrow">Worked example 1</div>
      <h2>How many litres does this tank hold?</h2>
      <div class="box gold problem" data-at="0">A cylindrical water tank has a radius of <b class="hl">0,6 m</b> and a height of <b class="hl">1,5 m</b>. Volume of a cylinder = π × r² × h, with π = 3,142.</div>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Volume</span>3,142 × 0,6² × 1,5 = 3,142 × 0,36 × 1,5</div>
        <div class="step" data-at="2"><span class="lbl"></span>= 1,697 m³ (rounded)</div>
        <div class="step ans" data-at="3"><span class="lbl">Litres</span>1,69668 × 1&nbsp;000 = 1&nbsp;696,68 ℓ ≈ 1&nbsp;697 ℓ</div>
      </div>`,
      say: [
        'Here is a typical question. A cylindrical water tank has a radius of zero comma six metres and a height of one comma five metres. How many litres does it hold?',
        'Substitute into the formula. Three comma one four two, times zero comma six squared, times one comma five. Square the radius first: zero comma three six.',
        'That gives one comma six nine seven cubic metres, rounded.',
        'Then convert. Each cubic metre holds one thousand litres, so the tank holds about one thousand six hundred and ninety seven litres. Convert using the unrounded value, and round only at the end.',
      ] },
    { id: 'paint', html: `
      <div class="eyebrow">Worked example 2</div>
      <h2>How many 1 ℓ tins of paint must be bought?</h2>
      <div class="box gold problem" data-at="0">A wall is <b class="hl">4,5 m</b> long and <b class="hl">2,7 m</b> high, with a door of 0,9 m by 2,1 m. It needs <b class="hl">two coats</b>, and 1 ℓ of paint covers 8 m².</div>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Wall</span>4,5 × 2,7 = 12,15 m² &nbsp; door: 0,9 × 2,1 = 1,89 m²</div>
        <div class="step" data-at="2"><span class="lbl">To paint</span>12,15 − 1,89 = 10,26 m² × 2 coats = 20,52 m²</div>
        <div class="step" data-at="3"><span class="lbl">Paint</span>20,52 ÷ 8 = 2,565 ℓ</div>
        <div class="step ans" data-at="4"><span class="lbl">Buy</span>3 tins (round UP: 2 tins are not enough)</div>
      </div>`,
      say: [
        'Now an area question. A wall is four comma five metres long and two comma seven metres high, with a door of zero comma nine by two comma one metres. It needs two coats, and one litre of paint covers eight square metres.',
        'The wall is four comma five times two comma seven, which is twelve comma one five square metres. The door is one comma eight nine square metres.',
        'Subtract the door, because it is not painted: ten comma two six square metres. Two coats doubles it, to twenty comma five two square metres.',
        'Divide by eight square metres per litre: two comma five six five litres.',
        'You cannot buy part of a tin, and two tins would run out, so you must round up. The answer is three tins.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Converting m² to cm² by multiplying by 100 instead of <b>10&nbsp;000</b></span></li>
        <li data-at="2"><span>Mixing units: change every length to the <b>same unit</b> before you calculate</span></li>
        <li data-at="3"><span>Rounding down when you must <b>buy whole items</b>: tins, bags, tiles round up</span></li>
        <li data-at="4"><span>Forgetting to <b>subtract</b> doors and windows, or to multiply by the number of coats</span></li>
      </ul>`,
      say: [
        'Watch out for four common mistakes.',
        'Converting square metres to square centimetres by multiplying by one hundred. It is ten thousand.',
        'Mixing units. Change every length to the same unit before you calculate.',
        'Rounding down when you have to buy whole items. Tins, bags and tiles always round up.',
        'And forgetting to subtract doors and windows, or to multiply by the number of coats.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Measurement.</em></h1>
      <div class="cta">Open Measurement in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Measurement in DONE WELL and practise area, volume and conversion questions, with every mark explained."] },
  ],
}
