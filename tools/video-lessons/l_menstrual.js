window.LESSON = {
  id: 'lifesci-menstrual-cycle',
  crumb: 'Life Sciences · Human Reproduction',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Life Sciences · Human Reproduction · Grade 12</div>
      <h1>The menstrual cycle and its hormones</h1>
      <div class="sub">The ovarian and uterine cycles, the four hormones that control them, and the negative feedback that links them.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Exam-style summary</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how the menstrual cycle works, which hormones control it, and how negative feedback links them, the way exam questions ask it.'] },
    { id: 'hormones', html: `
      <div class="eyebrow">Four hormones</div>
      <h2>Two from the pituitary gland, two from the ovary</h2>
      <table class="t">
        <tr><th>Hormone</th><th>Made by</th><th>What it does</th></tr>
        <tr data-at="1"><td>FSH</td><td>pituitary</td><td>a follicle develops in the ovary; the follicle makes oestrogen</td></tr>
        <tr data-at="2"><td>Oestrogen</td><td>follicle</td><td>thickens the endometrium; inhibits FSH</td></tr>
        <tr data-at="3"><td>LH</td><td>pituitary</td><td>causes ovulation; the follicle becomes the corpus luteum</td></tr>
        <tr data-at="4"><td>Progesterone</td><td>corpus luteum</td><td>keeps the endometrium thick; inhibits FSH and LH</td></tr>
      </table>`,
      say: [
        'Four hormones control the cycle: two from the pituitary gland, and two from the ovary.',
        'F S H, follicle stimulating hormone, from the pituitary, makes a follicle develop in the ovary. The follicle produces oestrogen.',
        'Oestrogen makes the endometrium, the lining of the uterus, thicken. It also inhibits the production of F S H.',
        'L H, luteinising hormone, from the pituitary, causes ovulation. The empty follicle then becomes the corpus luteum.',
        'The corpus luteum produces progesterone, which keeps the endometrium thick and ready for an embryo. Progesterone inhibits F S H and L H.',
      ] },
    { id: 'timeline', html: `
      <div class="eyebrow">A 28-day cycle</div>
      <h2>What happens, day by day</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Days 1–5</span>menstruation: the endometrium is shed</div>
        <div class="step" data-at="2"><span class="lbl">Days 6–13</span>FSH: a follicle develops; oestrogen rises; the endometrium thickens</div>
        <div class="step" data-at="3"><span class="lbl">Day 14</span>an LH surge causes ovulation</div>
        <div class="step" data-at="4"><span class="lbl">Days 15–28</span>the corpus luteum makes progesterone; the endometrium stays thick</div>
        <div class="step ans" data-at="5"><span class="lbl">No embryo</span>the corpus luteum breaks down, progesterone falls, menstruation begins</div>
      </div>`,
      say: [
        'Here is a typical twenty eight day cycle.',
        'Days one to five: menstruation, when the endometrium is shed.',
        'Days six to thirteen: F S H makes a follicle develop. It produces oestrogen, and the endometrium thickens.',
        'Around day fourteen, a surge of L H causes ovulation: the ovum is released.',
        'Days fifteen to twenty eight: the corpus luteum produces progesterone, which keeps the endometrium thick.',
        'If there is no embryo, the corpus luteum breaks down, progesterone levels fall, and the endometrium is shed. The next cycle begins.',
      ] },
    { id: 'feedback', html: `
      <div class="eyebrow">Negative feedback</div>
      <h2>A high level of one hormone switches off another</h2>
      <ul class="pts">
        <li data-at="1"><span>High <b>progesterone</b> inhibits FSH, so <em class="k">no new follicle</em> develops while the endometrium is ready</span></li>
        <li data-at="2"><span>When progesterone <b>falls</b>, FSH is no longer inhibited, and a new cycle starts</span></li>
        <li data-at="3"><span>The contraceptive pill works this way: its hormones keep FSH and LH low, so there is <b>no ovulation</b></span></li>
      </ul>`,
      say: [
        'The hormones are linked by negative feedback: a high level of one hormone switches off the production of another.',
        'While the progesterone level is high, it inhibits F S H, so no new follicle develops while the endometrium is ready for an embryo.',
        'When the progesterone level falls, F S H is no longer inhibited, and a new follicle, and a new cycle, begins.',
        'The contraceptive pill works the same way. Its hormones keep F S H and L H low, so no ovulation takes place.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Saying the <b>pituitary</b> makes oestrogen or progesterone: the <b>ovary</b> does</span></li>
        <li data-at="2"><span>Mixing up the roles: <b>FSH</b> develops the follicle, <b>LH</b> causes ovulation</span></li>
        <li data-at="3"><span>Saying the corpus luteum makes oestrogen only: it makes <b>progesterone</b></span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Saying the pituitary gland makes oestrogen or progesterone. Those come from the ovary.',
        'Mixing up the roles of the pituitary hormones. F S H develops the follicle, and L H causes ovulation.',
        'And forgetting what the corpus luteum makes. Its job is to produce progesterone.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Human Reproduction.</em></h1>
      <div class="cta">Open Human Reproduction in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Human Reproduction in DONE WELL and practise the menstrual cycle, with every mark explained."] },
  ],
}
