import type { ReactNode } from 'react'

/**
 * The structures Life Sciences keeps asking about, drawn.
 *
 * Life Sciences had no figures at all -- 2 194 questions and not one picture --
 * while 633 of them name a structure a learner is expected to have seen: the
 * nephron, the four chambers of the heart, a leaf in cross-section, the reflex
 * arc. Biology is taught from diagrams, and a paragraph describing the loop of
 * Henle is not a substitute for seeing where it sits.
 *
 * SCHEMATIC, NOT ANATOMICAL. These are revision diagrams, drawn the way a
 * textbook draws them for an exam: the parts a CAPS question can ask about,
 * named, in the right order and the right relative position. A nephron is not
 * really a neat loop and the heart is not symmetrical; drawing them
 * realistically would make the labels harder to follow and teach no more.
 * Where a proportion carries meaning it is kept -- the left ventricle wall is
 * drawn thicker than the right, because that difference is itself an exam
 * answer.
 *
 * Every figure carries a `<title>` and a `<desc>` that describes it in words,
 * so a learner using a screen reader gets the same content as one looking at
 * it, and so the diagram still says something when images fail to paint.
 */

const INK = '#1e3a5f'
const MUTED = '#64748b'
const ACCENT = '#b8860b'
const RED = '#c2410c'
const BLUE = '#1d4ed8'
const GREEN = '#15803d'
const FILL = '#f1f5f9'

function Frame({
  title,
  desc,
  viewBox,
  children,
}: {
  title: string
  desc: string
  viewBox: string
  children: ReactNode
}) {
  return (
    <figure className="mt-3 overflow-x-auto rounded-lg border border-navy-200 bg-white p-3">
      <svg viewBox={viewBox} role="img" aria-label={title} className="mx-auto block h-auto w-full max-w-md">
        <title>{title}</title>
        <desc>{desc}</desc>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-navy-500">{title}</figcaption>
    </figure>
  )
}

/**
 * The line of explanation under a diagram, wrapped to fit the canvas.
 *
 * SVG does not wrap text: a `<text>` longer than the viewBox simply runs off
 * the edge and is clipped. Every one of these notes was written as a single
 * line and half of them lost their last few words -- "...which is what makes
 * diffusion fa". Wrapping at a width measured from the font size is the only
 * way to keep writing them as sentences.
 */
function Note({ y, lines, width = 300 }: { y: number; lines: string[]; width?: number }) {
  const FONT = 7.5
  const perLine = Math.floor(width / (FONT * 0.52))
  const out: string[] = []
  for (const line of lines) {
    let current = ''
    for (const word of line.split(' ')) {
      if (current && (current + ' ' + word).length > perLine) {
        out.push(current)
        current = word
      } else current = current ? `${current} ${word}` : word
    }
    if (current) out.push(current)
  }
  return (
    <g>
      {out.map((line, i) => (
        <text key={i} x={14} y={y + i * 10} fontSize={FONT} fill={MUTED}>
          {line}
        </text>
      ))}
    </g>
  )
}

/** A label with a leader line, so the text never sits on top of the drawing. */
function Label({
  x,
  y,
  to,
  text,
  anchor = 'start',
  colour = INK,
}: {
  x: number
  y: number
  to: [number, number]
  text: string
  anchor?: 'start' | 'end' | 'middle'
  colour?: string
}) {
  return (
    <g>
      <line x1={x} y1={y - 3} x2={to[0]} y2={to[1]} stroke={MUTED} strokeWidth="0.8" />
      <circle cx={to[0]} cy={to[1]} r="1.6" fill={MUTED} />
      <text x={x} y={y} textAnchor={anchor} fontSize="8" fill={colour}>
        {text}
      </text>
    </g>
  )
}

/* ================================================================== */

export function Nephron() {
  return (
    <Frame
      title="The nephron"
      desc="A nephron. Blood arrives through the afferent arteriole into the glomerulus, a knot of capillaries inside Bowman's capsule, where ultrafiltration forces water and small molecules out of the blood. The filtrate passes along the proximal convoluted tubule, where all the glucose and most of the water and salts are reabsorbed, down the descending limb of the loop of Henle, up the ascending limb, along the distal convoluted tubule, and into the collecting duct, where ADH controls how much further water is reabsorbed. What is left is urine."
      viewBox="0 0 320 210"
    >
      {/* Bowman's capsule and glomerulus */}
      <path d="M52 44 a20 20 0 1 1 22 26" fill={FILL} stroke={INK} strokeWidth="1.6" />
      <path
        d="M58 44 q6-7 12-2 q7-6 10 3 q6 5-1 10 q-4 8-11 3 q-9 2-10-6 z"
        fill="#fecaca"
        stroke={RED}
        strokeWidth="1.2"
      />
      <line x1="24" y1="36" x2="56" y2="40" stroke={RED} strokeWidth="2.4" />
      <line x1="24" y1="58" x2="56" y2="54" stroke={BLUE} strokeWidth="2" />

      {/* Tubule: PCT, loop, DCT, collecting duct */}
      <path
        d="M74 70 q26-16 34 6 q8 20-14 22 q-20 4-12 22 l4 52 q2 14 16 14 q14 0 16-14 l4-52 q6-16-6-20 q22-10 40 2 q22 12 34 0"
        fill="none"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M190 100 l0 86 q0 8 10 8 l14 0" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />

      <Label x={16} y={30} to={[38, 37]} text="afferent arteriole" colour={RED} />
      <Label x={16} y={70} to={[38, 56]} text="efferent arteriole" colour={BLUE} />
      <Label x={104} y={22} to={[68, 44]} text="glomerulus" colour={RED} />
      <Label x={104} y={36} to={[56, 62]} text="Bowman's capsule" />
      <Label x={112} y={54} to={[104, 78]} text="proximal convoluted tubule" anchor="middle" />
      <Label x={16} y={140} to={[86, 140]} text="loop of Henle" />
      <Label x={16} y={152} to={[86, 156]} text="(descending, then ascending)" colour={MUTED} />
      <Label x={306} y={54} to={[176, 80]} text="distal convoluted tubule" anchor="end" />
      <Label x={306} y={110} to={[192, 130]} text="collecting duct" anchor="end" />
      <Label x={306} y={176} to={[214, 194]} text="to ureter — urine" anchor="end" colour={ACCENT} />

      <Note y={204} lines={["Ultrafiltration at the capsule; selective reabsorption all along the tubule."]} />
    </Frame>
  )
}

export function Heart() {
  return (
    <Frame
      title="The human heart"
      desc="A section through the heart showing four chambers. Deoxygenated blood returns from the body through the vena cava into the right atrium, passes the tricuspid valve into the right ventricle, and leaves through the pulmonary artery to the lungs. Oxygenated blood returns from the lungs through the pulmonary vein into the left atrium, passes the bicuspid valve into the left ventricle, and leaves through the aorta to the body. The wall of the left ventricle is much thicker than the right, because it pumps blood to the whole body rather than only to the lungs."
      viewBox="0 0 320 220"
    >
      {/* Outline */}
      <path d="M96 28 q76-14 112 22 q26 44 2 112 q-22 44-78 42 q-52-2-60-54 q-6-68 24-122 z" fill={FILL} stroke={INK} strokeWidth="1.6" />
      {/* Septum */}
      <path d="M160 40 q10 70 2 156" fill="none" stroke={INK} strokeWidth="2" />

      {/* Chambers: right (blue, our left) and left (red, our right) */}
      <path d="M110 52 q40-10 46 14 q2 18-24 20 q-26 2-30-12 q-2-16 8-22 z" fill="#dbeafe" stroke={BLUE} strokeWidth="1.2" />
      <path d="M172 52 q40-10 44 14 q2 18-22 20 q-26 2-30-12 q-2-16 8-22 z" fill="#fee2e2" stroke={RED} strokeWidth="1.2" />
      <path d="M108 100 q46-8 50 20 q2 42-20 56 q-28 2-36-30 q-4-34 6-46 z" fill="#dbeafe" stroke={BLUE} strokeWidth="1.2" />
      {/* Left ventricle drawn with a visibly thicker wall -- the answer to a
          question CAPS asks in every grade. */}
      <path d="M172 100 q48-8 52 20 q2 42-22 56 q-28 2-34-30 q-4-34 4-46 z" fill="#fee2e2" stroke={RED} strokeWidth="4.5" />

      {/* Great vessels */}
      <path d="M118 30 l0-22" stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
      <path d="M150 26 q6-22 30-20" fill="none" stroke={BLUE} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M186 24 q-4-20-26-18" fill="none" stroke={RED} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M214 46 l24-8" stroke={RED} strokeWidth="5" strokeLinecap="round" />

      {/* Valves */}
      <path d="M126 86 l10 10 l10-10" fill="none" stroke={INK} strokeWidth="1.6" />
      <path d="M182 86 l10 10 l10-10" fill="none" stroke={INK} strokeWidth="1.6" />

      <Label x={14} y={22} to={[116, 16]} text="vena cava (from body)" colour={BLUE} />
      <Label x={306} y={14} to={[178, 10]} text="pulmonary artery (to lungs)" anchor="end" colour={BLUE} />
      <Label x={306} y={40} to={[234, 40]} text="aorta (to body)" anchor="end" colour={RED} />
      <Label x={306} y={66} to={[216, 58]} text="pulmonary vein" anchor="end" colour={RED} />
      <Label x={14} y={62} to={[118, 62]} text="right atrium" colour={BLUE} anchor="start" />
      <Label x={306} y={92} to={[200, 62]} text="left atrium" anchor="end" colour={RED} />
      <Label x={14} y={150} to={[112, 140]} text="right ventricle" colour={BLUE} />
      <Label x={306} y={156} to={[208, 142]} text="left ventricle" anchor="end" colour={RED} />
      <Label x={14} y={100} to={[130, 92]} text="tricuspid valve" />
      <Label x={306} y={124} to={[196, 92]} text="bicuspid valve" anchor="end" />

      <Note y={206} lines={["The left ventricle wall is thicker: it pumps to the whole body, the right only to the lungs."]} />
    </Frame>
  )
}

export function Alveolus() {
  return (
    <Frame
      title="Gas exchange at an alveolus"
      desc="Air travels down the trachea, into the bronchi, along the bronchioles and into the alveoli. Each alveolus is a thin-walled air sac wrapped in a capillary. Oxygen diffuses from the alveolar air, where its concentration is high, across the one-cell-thick wall into the blood; carbon dioxide diffuses the other way. The surfaces are moist, thin and enormous in total area, which is what makes diffusion fast enough."
      viewBox="0 0 320 200"
    >
      {/* Airway */}
      <path d="M22 14 l0 40 q0 10 14 14 l20 8" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M56 76 l26 12 M56 76 q18 22 6 44" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M82 88 l22 10" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />

      {/* Alveoli cluster */}
      {[
        [136, 74, 24],
        [172, 62, 18],
        [168, 104, 20],
        [126, 116, 16],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#fff7ed" stroke={INK} strokeWidth="1.6" />
      ))}

      {/* Capillary wrapping the big alveolus */}
      <path
        d="M104 62 q40-30 74 2 q30 30 4 60 q-34 28-66 2"
        fill="none"
        stroke={RED}
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Diffusion arrows */}
      <g stroke={BLUE} strokeWidth="1.8" fill="none" markerEnd="">
        <path d="M136 58 l0-14" />
        <path d="M136 44 l-3 5 M136 44 l3 5" />
      </g>
      <g stroke={GREEN} strokeWidth="1.8" fill="none">
        <path d="M150 90 l0 14" />
        <path d="M150 104 l-3-5 M150 104 l3-5" />
      </g>

      <Label x={16} y={10} to={[22, 16]} text="trachea" />
      <Label x={20} y={140} to={[60, 110]} text="bronchus" />
      <Label x={80} y={158} to={[100, 96]} text="bronchiole" />
      <Label x={306} y={40} to={[190, 60]} text="alveolus (air sac)" anchor="end" />
      <Label x={306} y={148} to={[186, 124]} text="capillary" anchor="end" colour={RED} />
      <text x={148} y={40} fontSize="8" fill={BLUE}>
        O₂ into the blood
      </text>
      <text x={158} y={120} fontSize="8" fill={GREEN}>
        CO₂ out of the blood
      </text>
      <Note y={176} lines={["Thin wall, moist surface, huge total area, rich blood supply — all four make diffusion fast."]} />
    </Frame>
  )
}

export function LeafSection() {
  // The drawing stops at x = 206 so that the label column to its right is
  // clear of it. An earlier version filled the canvas edge to edge, which left
  // the labels nowhere to go but on top of the cells they were naming.
  const L = 20
  const R = 206
  const W = R - L
  return (
    <Frame
      title="A leaf in cross-section"
      desc="A cross-section through a leaf. A waxy cuticle covers the upper epidermis and reduces water loss. Below it the palisade mesophyll cells are packed with chloroplasts and do most of the photosynthesis. The spongy mesophyll below has large air spaces that let carbon dioxide reach the cells. The vascular bundle carries xylem on the upper side, bringing water up, and phloem on the lower side, carrying sugars away. The lower epidermis contains stomata, each a pore between two guard cells, through which carbon dioxide enters and water vapour and oxygen leave."
      viewBox="0 0 320 200"
    >
      <rect x={L} y="24" width={W} height="8" fill="#fef3c7" stroke={INK} strokeWidth="1" />
      <rect x={L} y="32" width={W} height="22" fill="#ecfccb" stroke={INK} strokeWidth="1" />
      {/* Palisade: tall cells, packed with chloroplasts. */}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={L + 3 + i * 26} y="54" width="22" height="40" fill="#dcfce7" stroke={GREEN} strokeWidth="1" />
          {[0, 1, 2, 3].map((c) => (
            <ellipse
              key={c}
              cx={L + 9 + i * 26 + (c % 2) * 10}
              cy={62 + Math.floor(c / 2) * 18}
              rx="3.6"
              ry="2.4"
              fill={GREEN}
            />
          ))}
        </g>
      ))}
      {/* Spongy: round cells with air spaces between them. */}
      <rect x={L} y="94" width={W} height="50" fill="#f0fdf4" stroke={INK} strokeWidth="1" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle
          key={i}
          cx={L + 14 + (i % 5) * 38 + (i > 4 ? 18 : 0)}
          cy={i > 4 ? 126 : 106}
          r="9"
          fill="#dcfce7"
          stroke={GREEN}
          strokeWidth="1"
        />
      ))}
      {/* Vascular bundle: xylem on top, phloem below. */}
      <circle cx="112" cy="118" r="17" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <path d="M100 112 a13 13 0 0 1 24 0 z" fill="#bfdbfe" stroke={BLUE} strokeWidth="1" />
      <path d="M100 124 a13 13 0 0 0 24 0 z" fill="#fde68a" stroke={ACCENT} strokeWidth="1" />
      {/* Lower epidermis, with one stoma between two guard cells. */}
      <rect x={L} y="144" width={W} height="20" fill="#ecfccb" stroke={INK} strokeWidth="1" />
      <path d="M58 144 a12 12 0 0 1 0 20 z" fill="#bbf7d0" stroke={GREEN} strokeWidth="1.4" />
      <path d="M86 144 a12 12 0 0 0 0 20 z" fill="#bbf7d0" stroke={GREEN} strokeWidth="1.4" />

      <Label x={306} y={26} to={[R - 8, 28]} text="waxy cuticle" anchor="end" />
      <Label x={306} y={42} to={[R - 8, 43]} text="upper epidermis" anchor="end" />
      <Label x={306} y={66} to={[R - 8, 70]} text="palisade mesophyll" anchor="end" />
      <Label x={306} y={78} to={[R - 8, 82]} text="— most chloroplasts" anchor="end" colour={MUTED} />
      <Label x={306} y={102} to={[R - 8, 104]} text="spongy mesophyll" anchor="end" />
      <Label x={306} y={114} to={[R - 8, 116]} text="— air spaces" anchor="end" colour={MUTED} />
      <Label x={306} y={134} to={[124, 112]} text="xylem — water up" anchor="end" colour={BLUE} />
      <Label x={306} y={146} to={[124, 126]} text="phloem — sugars away" anchor="end" colour={ACCENT} />
      <Label x={306} y={164} to={[R - 8, 154]} text="lower epidermis" anchor="end" />
      <Label x={306} y={178} to={[74, 160]} text="stoma + two guard cells" anchor="end" colour={GREEN} />

      <Note y={192} lines={["CO₂ enters and O₂ and water vapour leave through the stomata."]} />
    </Frame>
  )
}

export function Eye() {
  return (
    <Frame
      title="The human eye"
      desc="A horizontal section through the eye. Light passes through the transparent cornea, then the pupil, the size of which is controlled by the iris, and then the lens, which the ciliary muscles change shape to focus. The image forms on the retina at the back, where rods and cones convert it to nerve impulses. The sharpest vision is at the yellow spot, or fovea. Where the optic nerve leaves there are no receptors, so that point is the blind spot. The choroid behind the retina supplies blood and absorbs stray light, and the tough sclera is the outer coat."
      viewBox="0 0 320 210"
    >
      <circle cx="160" cy="100" r="76" fill={FILL} stroke={INK} strokeWidth="2.4" />
      <circle cx="160" cy="100" r="70" fill="#fff" stroke="#a16207" strokeWidth="3" />
      <circle cx="160" cy="100" r="64" fill="#fff" stroke={ACCENT} strokeWidth="2.4" />
      {/* Cornea bulge on the left */}
      <path d="M96 76 q-22 24 0 48" fill="#e0f2fe" stroke={BLUE} strokeWidth="2.4" />
      {/* Iris and pupil */}
      <path d="M100 74 l14 14 M100 126 l14-14" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {/* Lens */}
      <ellipse cx="124" cy="100" rx="9" ry="22" fill="#dbeafe" stroke={BLUE} strokeWidth="1.8" />
      {/* Ciliary body */}
      <path d="M118 74 l-4-6 M118 126 l-4 6" stroke={INK} strokeWidth="2" />
      {/* Optic nerve */}
      <path d="M228 112 q26 10 42 4" fill="none" stroke={ACCENT} strokeWidth="9" strokeLinecap="round" />
      {/* Fovea */}
      <circle cx="226" cy="92" r="3.4" fill={RED} />
      {/* Light rays */}
      <g stroke={MUTED} strokeWidth="0.9" strokeDasharray="4 3">
        <path d="M8 74 l108 22" />
        <path d="M8 126 l108-22" />
        <path d="M132 100 l92-8" />
        <path d="M132 100 l92 8" />
      </g>

      <Label x={70} y={52} to={[92, 84]} text="cornea" colour={BLUE} anchor="end" />
      <Label x={70} y={160} to={[106, 126]} text="iris" anchor="end" />
      <Label x={106} y={176} to={[116, 118]} text="pupil" anchor="middle" />
      <Label x={150} y={186} to={[124, 122]} text="lens" anchor="middle" />
      <Label x={150} y={36} to={[116, 72]} text="ciliary muscle" anchor="middle" />
      <Label x={256} y={46} to={[222, 62]} text="retina — rods and cones" anchor="end" />
      <Label x={306} y={80} to={[228, 88]} text="yellow spot (fovea)" anchor="end" colour={RED} />
      <Label x={306} y={150} to={[230, 116]} text="blind spot" anchor="end" />
      <Label x={306} y={164} to={[262, 118]} text="optic nerve" anchor="end" colour={ACCENT} />
      <Label x={196} y={186} to={[172, 164]} text="choroid · sclera" anchor="middle" />
      <text x={8} y={100} fontSize="8" fill={MUTED}>
        light
      </text>
    </Frame>
  )
}

export function Ear() {
  return (
    <Frame
      title="The human ear"
      desc="Sound is collected by the pinna and travels down the auditory canal to the eardrum, which vibrates. The three ossicles - hammer, anvil and stirrup - amplify the vibration and pass it through the oval window into the fluid of the cochlea, where receptor cells convert it to nerve impulses carried by the auditory nerve. The three semicircular canals above the cochlea sense balance rather than sound, and the Eustachian tube connects the middle ear to the throat so that pressure on both sides of the eardrum stays equal."
      viewBox="0 0 320 200"
    >
      {/* Pinna and canal */}
      <path d="M18 40 q34-26 46 12 q10 34-12 44 q-18 8-24-10 z" fill={FILL} stroke={INK} strokeWidth="1.8" />
      <path d="M62 78 l70 8" stroke={INK} strokeWidth="14" strokeLinecap="round" opacity="0.18" />
      <path d="M62 70 l72 8 M62 88 l72 8" stroke={INK} strokeWidth="1.6" />
      {/* Eardrum */}
      <line x1="136" y1="72" x2="136" y2="100" stroke={ACCENT} strokeWidth="3" />
      {/* Ossicles */}
      <path d="M142 80 l12-10 l12 12 l14-4" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="154" cy="70" r="3" fill={INK} />
      <circle cx="166" cy="82" r="3" fill={INK} />
      <circle cx="180" cy="78" r="3" fill={INK} />
      {/* Oval window + cochlea */}
      <line x1="188" y1="70" x2="188" y2="88" stroke={BLUE} strokeWidth="2.6" />
      <path
        d="M196 80 a22 22 0 1 0 22 22 a15 15 0 1 0-14-14 a9 9 0 1 0 8 8"
        fill="none"
        stroke={BLUE}
        strokeWidth="3.4"
      />
      {/* Semicircular canals */}
      <g fill="none" stroke={GREEN} strokeWidth="2.4">
        <ellipse cx="204" cy="42" rx="18" ry="11" />
        <ellipse cx="204" cy="42" rx="11" ry="18" />
      </g>
      {/* Auditory nerve */}
      <path d="M232 110 q26 12 50 6" fill="none" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" />
      {/* Eustachian tube */}
      <path d="M180 100 q10 40 56 46" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />

      <Label x={22} y={126} to={[40, 88]} text="pinna" />
      <Label x={78} y={122} to={[98, 92]} text="auditory canal" />
      <Label x={120} y={52} to={[136, 76]} text="eardrum" anchor="end" colour={ACCENT} />
      <Label x={14} y={30} to={[160, 68]} text="ossicles: hammer, anvil, stirrup" />
      <Label x={252} y={68} to={[192, 74]} text="oval window" colour={BLUE} />
      <Label x={252} y={96} to={[216, 100]} text="cochlea" colour={BLUE} />
      <Label x={306} y={22} to={[220, 36]} text="semicircular canals (balance)" anchor="end" colour={GREEN} />
      <Label x={286} y={128} to={[274, 116]} text="auditory nerve" anchor="end" colour={ACCENT} />
      <Label x={306} y={168} to={[224, 140]} text="Eustachian tube — equalises pressure" anchor="end" />
    </Frame>
  )
}

export function ReflexArc() {
  return (
    <Frame
      title="The reflex arc"
      desc="A stimulus is detected by a receptor in the skin. The sensory neuron carries the impulse along its axon into the spinal cord through the dorsal root, where it passes across a synapse to an interneuron, and across a second synapse to a motor neuron. The motor neuron carries the impulse out through the ventral root to an effector, here a muscle, which contracts. The response happens before the brain is involved, which is why a reflex is fast and involuntary."
      viewBox="0 0 320 190"
    >
      {/* Spinal cord in section */}
      <ellipse cx="228" cy="92" rx="44" ry="40" fill={FILL} stroke={INK} strokeWidth="1.8" />
      <path
        d="M212 66 q-14 8-10 26 q4 18 12 24 q16 6 26-2 q12-10 8-28 q-4-16-16-22 q-12-4-20 2 z"
        fill="#e2e8f0"
        stroke={INK}
        strokeWidth="1.2"
      />
      {/* Receptor */}
      <path d="M14 40 l24 0 l0 14 l-24 0 z" fill="#fee2e2" stroke={RED} strokeWidth="1.4" />
      {/* Sensory neuron */}
      <path d="M38 47 q64-10 110 22" fill="none" stroke={BLUE} strokeWidth="2.4" />
      <circle cx="150" cy="72" r="7" fill="#dbeafe" stroke={BLUE} strokeWidth="1.6" />
      <path d="M157 70 q26-4 34 10" fill="none" stroke={BLUE} strokeWidth="2.4" />
      {/* Interneuron */}
      <circle cx="222" cy="86" r="6" fill="#e2e8f0" stroke={INK} strokeWidth="1.6" />
      {/* Motor neuron */}
      <path d="M216 96 q-30 14-34 34" fill="none" stroke={GREEN} strokeWidth="2.4" />
      <circle cx="180" cy="134" r="7" fill="#dcfce7" stroke={GREEN} strokeWidth="1.6" />
      <path d="M173 138 q-64 18-128 6" fill="none" stroke={GREEN} strokeWidth="2.4" />
      {/* Effector */}
      <path d="M14 132 q16-8 30 0 q-14 14-30 6 z" fill="#dcfce7" stroke={GREEN} strokeWidth="1.4" />

      {/* Direction arrows */}
      <g fill={MUTED}>
        <path d="M84 44 l-7 3 l0-6 z" transform="translate(6 0)" />
        <path d="M100 142 l7-3 l0 6 z" transform="translate(-6 0)" />
      </g>

      <Label x={12} y={30} to={[26, 40]} text="receptor in the skin" colour={RED} />
      <Label x={60} y={76} to={[86, 50]} text="sensory neuron" colour={BLUE} />
      <Label x={130} y={54} to={[150, 66]} text="cell body (dorsal root)" anchor="middle" colour={BLUE} />
      <Label x={272} y={56} to={[224, 80]} text="interneuron" anchor="end" />
      <Label x={272} y={130} to={[204, 106]} text="grey matter of the spinal cord" anchor="end" />
      <Label x={306} y={168} to={[150, 140]} text="motor neuron (ventral root)" anchor="end" colour={GREEN} />
      <Label x={14} y={158} to={[28, 140]} text="effector — muscle contracts" colour={GREEN} />

      <Note y={180} lines={["Two synapses and no brain: that is why a reflex is fast and involuntary."]} />
    </Frame>
  )
}

export function DnaStructure() {
  return (
    <Frame
      title="The structure of DNA"
      desc="DNA is a double helix. Each strand is a backbone of alternating deoxyribose sugar and phosphate groups, and the two strands run in opposite directions. The strands are held together by hydrogen bonds between complementary base pairs: adenine always pairs with thymine by two hydrogen bonds, and cytosine always pairs with guanine by three. Because the pairing is fixed, each strand carries the information needed to rebuild the other, which is what makes replication possible."
      viewBox="0 0 320 210"
    >
      {/* Two sine backbones */}
      {[0, 1].map((s) => (
        <path
          key={s}
          d={Array.from({ length: 61 }, (_, i) => {
            const y = 18 + i * 2.7
            const x = 160 + (s === 0 ? 1 : -1) * 46 * Math.sin((i / 60) * Math.PI * 3)
            return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
          }).join('')}
          fill="none"
          stroke={s === 0 ? BLUE : ACCENT}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      ))}
      {/* Base pairs */}
      {Array.from({ length: 15 }, (_, k) => {
        const i = 2 + k * 4
        const y = 18 + i * 2.7
        const dx = 46 * Math.sin((i / 60) * Math.PI * 3)
        const pair = k % 2 === 0 ? ['A', 'T'] : ['C', 'G']
        const bonds = k % 2 === 0 ? 2 : 3
        return (
          <g key={k}>
            <line x1={160 + dx} y1={y} x2={160 - dx} y2={y} stroke={MUTED} strokeWidth={bonds === 3 ? 1.8 : 1.1} />
            <text x={160 + dx * 0.55} y={y + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={BLUE}>
              {pair[0]}
            </text>
            <text x={160 - dx * 0.55} y={y + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={ACCENT}>
              {pair[1]}
            </text>
          </g>
        )
      })}

      <Label x={16} y={30} to={[120, 26]} text="sugar–phosphate backbone" colour={BLUE} />
      <Label x={306} y={64} to={[206, 60]} text="hydrogen bonds" anchor="end" />
      <text x={16} y={190} fontSize="8" fill={INK}>
        A pairs with T (2 hydrogen bonds) · C pairs with G (3)
      </text>
      <Note y={198} lines={["The pairing is fixed, so each strand can rebuild the other. That is what replication uses."]} />
    </Frame>
  )
}

export function EnergyPyramid() {
  return (
    <Frame
      title="Energy flow through a food chain"
      desc="A pyramid of energy. Producers such as grass capture energy from sunlight. Only about a tenth of the energy at each level is passed on to the next: the rest is lost as heat in respiration, in movement, and in the parts that are not eaten. So a primary consumer receives about ten per cent of what the producers captured, a secondary consumer about one per cent, and a tertiary consumer about a tenth of one per cent. That is why food chains are short and why there are far fewer top predators than plants."
      viewBox="0 0 320 200"
    >
      {[
        ['Producers — grass', '100 000 kJ', 0, '#bbf7d0', GREEN],
        ['Primary consumers — grasshoppers', '10 000 kJ', 1, '#fde68a', ACCENT],
        ['Secondary consumers — frogs', '1 000 kJ', 2, '#fed7aa', RED],
        ['Tertiary consumers — snakes', '100 kJ', 3, '#fecaca', RED],
      ].map(([name, energy, level, fill, stroke], i) => {
        const l = Number(level)
        const w = 186 - l * 42
        const x = 26 + l * 21
        const y = 152 - l * 36
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height="30" fill={String(fill)} stroke={String(stroke)} strokeWidth="1.4" />
            <text x={x + 6} y={y + 13} fontSize="8" fill={INK}>
              {name}
            </text>
            <text x={x + 6} y={y + 24} fontSize="8" fontWeight="700" fill={String(stroke)}>
              {energy}
            </text>
            {l < 3 ? (
              <g>
                <path d={`M${x + w + 6} ${y + 15} l16 0`} stroke={MUTED} strokeWidth="1.2" />
                <path d={`M${x + w + 22} ${y + 15} l-5-3 l0 6 z`} fill={MUTED} />
                <text x={x + w + 26} y={y + 6} fontSize="7" fill={MUTED}>
                  90% lost
                </text>
                <text x={x + w + 26} y={y + 15} fontSize="7" fill={MUTED}>
                  as heat, movement,
                </text>
                <text x={x + w + 26} y={y + 24} fontSize="7" fill={MUTED}>
                  uneaten parts
                </text>
              </g>
            ) : null}
          </g>
        )
      })}
      <Note y={190} lines={["About 10% passes to the next level, which is why food chains are short."]} />
    </Frame>
  )
}

export function PlantTransport() {
  return (
    <Frame
      title="Water transport through a plant"
      desc="Water enters through root hair cells by osmosis, because the soil solution is less concentrated than the cell sap. It crosses the root to the xylem, and is drawn up the xylem vessels as a continuous column: water evaporating from the leaves through the stomata pulls the column up, and the water molecules hold together by cohesion and to the vessel walls by adhesion. This is the transpiration pull. Phloem, alongside the xylem, carries dissolved sugars from the leaves to wherever the plant is growing or storing, in both directions."
      viewBox="0 0 320 236"
    >
      {/* Stem */}
      <rect x="140" y="52" width="26" height="118" fill="#ecfccb" stroke={INK} strokeWidth="1.4" />
      <rect x="145" y="52" width="7" height="118" fill="#bfdbfe" stroke={BLUE} strokeWidth="1" />
      <rect x="155" y="52" width="7" height="118" fill="#fde68a" stroke={ACCENT} strokeWidth="1" />
      {/* Leaves */}
      <path d="M140 66 q-52-24-72 6 q34 22 72 4 z" fill="#dcfce7" stroke={GREEN} strokeWidth="1.4" />
      <path d="M166 92 q52-24 72 6 q-34 22-72 4 z" fill="#dcfce7" stroke={GREEN} strokeWidth="1.4" />
      {/* Roots + root hairs */}
      <path d="M153 170 l0 20 M153 182 q-24 14-38 26 M153 182 q24 14 38 26" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1={126 + i * 7}
          y1={198 + Math.abs(i - 4) * 3}
          x2={120 + i * 7}
          y2={208 + Math.abs(i - 4) * 3}
          stroke={GREEN}
          strokeWidth="1.2"
        />
      ))}
      {/* Transpiration arrows from the leaves */}
      <g stroke={BLUE} strokeWidth="1.4" fill="none">
        <path d="M84 60 l-4-12 M80 48 l-3 5 M80 48 l3 5" />
        <path d="M222 88 l4-12 M226 76 l-3 5 M226 76 l3 5" />
      </g>
      {/* Upward flow arrow inside xylem */}
      <g stroke={BLUE} strokeWidth="1.6" fill="none">
        <path d="M148.5 162 l0-96 M148.5 66 l-3 6 M148.5 66 l3 6" />
      </g>
      {/* Phloem, both directions */}
      <g stroke={ACCENT} strokeWidth="1.6" fill="none">
        <path d="M158.5 70 l0 92 M158.5 162 l-3-6 M158.5 162 l3-6" />
      </g>

      <Label x={54} y={40} to={[80, 50]} text="water vapour leaves through stomata" colour={BLUE} />
      <Label x={306} y={64} to={[228, 78]} text="transpiration" anchor="end" colour={BLUE} />
      <Label x={104} y={128} to={[147, 124]} text="xylem — water up only" anchor="end" colour={BLUE} />
      <Label x={306} y={140} to={[160, 132]} text="phloem — sugars, both ways" anchor="end" colour={ACCENT} />
      <Label x={14} y={190} to={[122, 202]} text="root hair cells — osmosis" colour={GREEN} />
      <Note y={220} lines={["Cohesion holds the column together, adhesion holds it to the vessel wall, and evaporation from the leaves pulls it up."]} />
    </Frame>
  )
}

export function FlowerStructure() {
  return (
    <Frame
      title="The structure of a flower"
      desc="A section through an insect-pollinated flower. The male parts are the stamens, each a filament carrying an anther in which pollen grains are made. The female parts make up the carpel: a sticky stigma that receives pollen, a style down which the pollen tube grows, and an ovary containing ovules. After pollination and fertilisation the ovule becomes a seed and the ovary becomes the fruit. Petals attract insects, sepals protected the bud, and the nectary produces the nectar the insect comes for."
      viewBox="0 0 320 210"
    >
      {/* Receptacle and stalk */}
      <path d="M140 156 q20 14 40 0 l0 6 q-20 16-40 0 z" fill="#ecfccb" stroke={INK} strokeWidth="1.2" />
      <line x1="160" y1="162" x2="160" y2="196" stroke={GREEN} strokeWidth="3.4" />
      {/* Petals */}
      <path d="M140 156 q-62-18-96-64 q52-10 96 40 z" fill="#fce7f3" stroke="#be185d" strokeWidth="1.4" />
      <path d="M180 156 q62-18 96-64 q-52-10-96 40 z" fill="#fce7f3" stroke="#be185d" strokeWidth="1.4" />
      {/* Sepals */}
      <path d="M140 158 q-34 8-50 24 q34 2 50-16 z" fill="#dcfce7" stroke={GREEN} strokeWidth="1.2" />
      <path d="M180 158 q34 8 50 24 q-34 2-50-16 z" fill="#dcfce7" stroke={GREEN} strokeWidth="1.2" />
      {/* Carpel: ovary, style, stigma */}
      <ellipse cx="160" cy="138" rx="21" ry="18" fill="#fef9c3" stroke={ACCENT} strokeWidth="1.6" />
      <circle cx="152" cy="138" r="4.4" fill="#fde68a" stroke={ACCENT} strokeWidth="1" />
      <circle cx="168" cy="140" r="4.4" fill="#fde68a" stroke={ACCENT} strokeWidth="1" />
      <line x1="160" y1="120" x2="160" y2="58" stroke={ACCENT} strokeWidth="2.6" />
      <ellipse cx="160" cy="54" rx="11" ry="5" fill="#fbbf24" stroke={ACCENT} strokeWidth="1.4" />
      {/* Stamens */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={`M${160 + s * 12} 126 q${s * 30}-28 ${s * 34}-56`} fill="none" stroke={INK} strokeWidth="1.8" />
          <ellipse
            cx={160 + s * 46}
            cy={70}
            rx="8"
            ry="5"
            fill="#fed7aa"
            stroke={RED}
            strokeWidth="1.4"
            transform={`rotate(${s * 40} ${160 + s * 46} 70)`}
          />
        </g>
      ))}
      {/* Nectary */}
      <circle cx="140" cy="150" r="4" fill="#fecaca" stroke={RED} strokeWidth="1" />

      <Label x={200} y={44} to={[168, 52]} text="stigma — receives pollen" colour={ACCENT} />
      <Label x={226} y={94} to={[164, 92]} text="style" colour={ACCENT} />
      <Label x={236} y={138} to={[180, 138]} text="ovary, containing ovules" colour={ACCENT} />
      <Label x={112} y={38} to={[116, 66]} text="anther — makes pollen" anchor="end" colour={RED} />
      <Label x={96} y={100} to={[136, 104]} text="filament" anchor="end" />
      <Label x={30} y={92} to={[76, 108]} text="petal" anchor="end" colour="#be185d" />
      <Label x={60} y={196} to={[104, 176]} text="sepal" anchor="end" colour={GREEN} />
      <Label x={240} y={196} to={[144, 152]} text="nectary" anchor="end" colour={RED} />
      <Note y={202} lines={["Stamen = filament + anther (male). Carpel = stigma + style + ovary (female)."]} />
    </Frame>
  )
}

export const LIFE_SCI_FIGURES = {
  nephron: Nephron,
  heart: Heart,
  alveolus: Alveolus,
  'leaf-section': LeafSection,
  eye: Eye,
  ear: Ear,
  'reflex-arc': ReflexArc,
  'dna-structure': DnaStructure,
  'energy-pyramid': EnergyPyramid,
  'plant-transport': PlantTransport,
  'flower-structure': FlowerStructure,
} as const

export type LifeSciFigureId = keyof typeof LIFE_SCI_FIGURES
