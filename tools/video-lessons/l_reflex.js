window.LESSON = {
  id: 'lifesci-reflex-arc',
  crumb: 'Life Sciences · Human Responses',
  scenes: [
    { id: 'title', cls: 'title', html: `
      <div class="subject">Life Sciences · Responding to the Environment · Grade 12</div>
      <h1>The nervous system and the reflex arc</h1>
      <div class="sub">The parts of the nervous system, the three kinds of neuron, the reflex arc step by step, and the synapse.</div>
      <div class="meta"><span class="pill">CAPS-aligned</span><span class="pill">Exam-style example</span><span class="pill">About 3 minutes</span></div>`,
      say: ['Welcome to DONE WELL. In this lesson you will learn how the nervous system is organised, the three kinds of neuron, and how a reflex arc works, step by step.'] },
    { id: 'parts', html: `
      <div class="eyebrow">Organisation</div>
      <h2>Central and peripheral nervous systems</h2>
      <div class="cols">
        <div class="col" data-at="1"><h3>Central (CNS)</h3><p>The <b>brain</b> and the <b>spinal cord</b>: they process information and decide on a response.</p></div>
        <div class="col" data-at="2"><h3>Peripheral (PNS)</h3><p>The <b>nerves</b> that carry impulses between the CNS and the rest of the body.</p></div>
      </div>
      <div class="box" data-at="3"><span class="lead" style="margin:0"><b class="hl">Sensory</b> neurons carry impulses to the CNS; <b class="hl">interneurons</b> link inside the CNS; <b class="hl">motor</b> neurons carry impulses to effectors.</span></div>`,
      say: [
        'The nervous system has two parts.',
        'The central nervous system is the brain and the spinal cord. It processes information and decides on a response.',
        'The peripheral nervous system is made up of the nerves that carry impulses between the central nervous system and the rest of the body.',
        'There are three kinds of neuron. Sensory neurons carry impulses to the central nervous system. Interneurons connect neurons inside it. Motor neurons carry impulses to effectors, the muscles and glands.',
      ] },
    { id: 'arc', html: `
      <div class="eyebrow">The reflex arc</div>
      <h2>You touch a hot plate and pull your hand away</h2>
      <div class="steps tight">
        <div class="step" data-at="1"><span class="lbl">Receptor</span>heat receptors in the skin are stimulated</div>
        <div class="step" data-at="2"><span class="lbl">Sensory</span>a sensory neuron carries the impulse to the spinal cord</div>
        <div class="step" data-at="3"><span class="lbl">Interneuron</span>an interneuron in the spinal cord passes it on</div>
        <div class="step" data-at="4"><span class="lbl">Motor</span>a motor neuron carries it to the arm muscle</div>
        <div class="step ans" data-at="5"><span class="lbl">Effector</span>the muscle contracts: the hand is pulled away</div>
      </div>`,
      say: [
        'A reflex is a quick, automatic response. Suppose you touch a hot plate.',
        'Heat receptors in the skin are stimulated, and an impulse starts.',
        'A sensory neuron carries the impulse to the spinal cord.',
        'In the spinal cord, an interneuron passes the impulse on.',
        'A motor neuron carries the impulse to the effector, a muscle in the arm.',
        'The muscle contracts, and your hand is pulled away before the brain has even registered the pain.',
      ] },
    { id: 'why', html: `
      <div class="eyebrow">Why it is fast</div>
      <h2>The impulse goes through the spinal cord, not the brain</h2>
      <ul class="pts">
        <li data-at="1"><span>The pathway is <b>short</b>, with few synapses, so the response is very fast</span></li>
        <li data-at="2"><span>It protects the body from <b>damage</b> before you have time to think</span></li>
        <li data-at="3"><span>At each <b>synapse</b>, a neurotransmitter carries the impulse across, in <em class="k">one direction only</em></span></li>
      </ul>`,
      say: [
        'Why is a reflex so fast?',
        'The impulse travels a short pathway through the spinal cord, with only a few synapses, instead of going all the way to the brain and back.',
        'That protects the body from damage before you have time to think.',
        'At each synapse, the gap between two neurons, a chemical called a neurotransmitter carries the impulse across. It can only cross in one direction, so impulses always travel one way along the arc.',
      ] },
    { id: 'mistakes', html: `
      <div class="eyebrow">Avoid these mistakes</div>
      <h2>Where marks are lost</h2>
      <ul class="pts warn">
        <li data-at="1"><span>Saying the <b>brain</b> controls the reflex: it is the <b>spinal cord</b></span></li>
        <li data-at="2"><span>Mixing up sensory and motor: <b>sensory</b> to the CNS, <b>motor</b> away from it</span></li>
        <li data-at="3"><span>Leaving out a step: <b>receptor, sensory, interneuron, motor, effector</b></span></li>
      </ul>`,
      say: [
        'Watch out for three common mistakes.',
        'Saying the brain controls the reflex. The response is coordinated in the spinal cord.',
        'Mixing up sensory and motor neurons. Sensory neurons carry impulses to the central nervous system, and motor neurons carry them away from it.',
        'And leaving out a step of the arc. Receptor, sensory neuron, interneuron, motor neuron, effector: each one earns a mark.',
      ] },
    { id: 'outro', cls: 'outro', html: `
      <h1>Now it's your turn.<br><em>Practise Human Responses.</em></h1>
      <div class="cta">Open Responding to the Environment in DONE WELL</div>
      <div class="url">done-well-mathematical-literacy.pages.dev</div>`,
      say: ["Now it's your turn. Open Responding to the Environment in DONE WELL and practise the nervous system, with every mark explained."] },
  ],
}
