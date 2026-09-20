import { analyticalGeometryG10 as qs } from '../src/data/analyticalGeometryG10.ts'
for (const id of ['ag10-dist-surd', 'ag10-dist-find-k', 'ag10-grad-perpendicular-k', 'ag10-grad-order', 'ag10-mid-fourth-vertex', 'ag10-figure-rhombus']) {
  const q = qs.find((x) => x.id === id)!
  console.log('===', id)
  console.log('Q:', q.prompt)
  console.log('A:', q.answer)
}
