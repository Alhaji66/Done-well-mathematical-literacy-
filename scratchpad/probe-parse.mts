import { curveFrom, evalExpr, normalise, windowFor } from '../src/data/graphSpecs'

let bad = 0
const check = (name: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) bad += 1
  console.log(ok ? 'PASS' : 'FAIL', name.padEnd(38), ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`)
}

// The independent evaluator first -- everything else leans on it.
check('evalExpr x²−9 at 4', evalExpr(normalise('x² − 9'), 4), 7)
check('evalExpr −x²+6x−5 at 3', evalExpr(normalise('−x² + 6x − 5'), 3), 4)
check('evalExpr (x−3)²−4 at 5', evalExpr(normalise('(x − 3)² − 4'), 5), 0)
check('evalExpr 6÷(x−1)−2 at 4', evalExpr(normalise('6 ÷ (x − 1) − 2'), 4), 0)
check('evalExpr 2ˣ at 5', evalExpr(normalise('2ˣ'), 5), 32)
check('evalExpr rejects trailing words', evalExpr(normalise('x² − 9 lies below'), 2), null)
check('evalExpr rejects a lone a', evalExpr(normalise('a ÷ (x − 1)'), 2), null)

// Now the family recogniser.
check('line 8x − 2', curveFrom('8x − 2'), { kind: 'line', m: 8, c: -2 })
check('line x − 4', curveFrom('x − 4'), { kind: 'line', m: 1, c: -4 })
check('line −3x + 7', curveFrom('−3x + 7'), { kind: 'line', m: -3, c: 7 })
check('parabola x² − 9', curveFrom('x² − 9'), { kind: 'parabola', a: 1, b: 0, c: -9 })
check('parabola x² − 4x − 5', curveFrom('x² − 4x − 5'), { kind: 'parabola', a: 1, b: -4, c: -5 })
check('parabola −x² + 6x − 5', curveFrom('−x² + 6x − 5'), { kind: 'parabola', a: -1, b: 6, c: -5 })
check('parabola 2x² + 3x + 1', curveFrom('2x² + 3x + 1'), { kind: 'parabola', a: 2, b: 3, c: 1 })
// Completed square must EXPAND correctly: (x−3)²−4 = x²−6x+5
check('square (x − 3)² − 4', curveFrom('(x − 3)² − 4'), { kind: 'parabola', a: 1, b: -6, c: 5 })
check('square (x + 2)² − 9', curveFrom('(x + 2)² − 9'), { kind: 'parabola', a: 1, b: 4, c: -5 })
check('square −(x − 1)² + 4', curveFrom('−(x − 1)² + 4'), { kind: 'parabola', a: -1, b: 2, c: 3 })
check('hyperbola 6/(x − 1) − 2', curveFrom('6/(x − 1) − 2'), { kind: 'hyperbola', a: 6, p: 1, q: -2 })
check('hyperbola 4 ÷ (x + 2) + 1', curveFrom('4 ÷ (x + 2) + 1'), { kind: 'hyperbola', a: 4, p: -2, q: 1 })
check('hyperbola 3/x − 1', curveFrom('3/x − 1'), { kind: 'hyperbola', a: 3, p: 0, q: -1 })
check('exponential 2ˣ', curveFrom('2ˣ'), { kind: 'exponential', a: 1, b: 2, q: 0 })
check('exponential 3ˣ − 4', curveFrom('3ˣ − 4'), { kind: 'exponential', a: 1, b: 3, q: -4 })
check('cubic x³ − 3x', curveFrom('x³ − 3x'), { kind: 'cubic', a: 1, b: 0, c: -3, d: 0 })

// It MUST refuse these.
check('refuses unknown a', curveFrom('a ÷ (x − 1) − 2'), null)
check('refuses trailing prose', curveFrom('x² − 9 lies below the x-axis'), null)
check('refuses f(x − 1) + 2', curveFrom('f(x − 1) + 2'), null)
check('refuses sin x', curveFrom('sin x'), null)
check('refuses empty', curveFrom(''), null)
check('refuses √x', curveFrom('√x'), null)

// Windows must contain the features the question asks about.
const w1 = windowFor({ kind: 'parabola', a: -1, b: 14, c: -40 })
const vertexX = 7, vertexY = 9
console.log(
  w1.xRange[0] <= vertexX && vertexX <= w1.xRange[1] && w1.yRange[0] <= vertexY && vertexY <= w1.yRange[1]
    ? 'PASS turning point (7 ; 9) is inside the window'
    : `FAIL window ${JSON.stringify(w1)} hides the turning point`,
)
const w2 = windowFor({ kind: 'hyperbola', a: 6, p: 1, q: -2 })
console.log(
  w2.xRange[0] < 1 && 1 < w2.xRange[1] && w2.yRange[0] < -2 && -2 < w2.yRange[1]
    ? 'PASS both hyperbola asymptotes are inside the window'
    : `FAIL window ${JSON.stringify(w2)} misses an asymptote`,
)
console.log(bad ? `\n${bad} FAILURES` : '\nevery parse correct')
