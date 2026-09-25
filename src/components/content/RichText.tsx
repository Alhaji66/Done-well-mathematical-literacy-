import { MathText } from '@/components/practise/MathText'

/**
 * Writes an editor's plain text out as a page: a blank line starts a new
 * paragraph, "# " and "## " start headings, "- " starts a bullet. Nothing is
 * ever inserted as HTML -- whatever an editor types is shown as text -- so a
 * stray tag cannot become part of the page.
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, '\n').split(/\n{2,}/)
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-navy-800">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter((l) => l.trim())
        if (!lines.length) return null
        // A heading can have its text straight underneath, with no blank line.
        const heading = lines[0].startsWith('## ') ? 3 : lines[0].startsWith('# ') ? 2 : 0
        if (heading) {
          const rest = lines.slice(1).join('\n')
          return (
            <div key={i} className="space-y-2 pt-2">
              {heading === 2 ? (
                <h2 className="text-lg font-bold text-navy-900">{lines[0].slice(2)}</h2>
              ) : (
                <h3 className="text-base font-bold text-navy-900">{lines[0].slice(3)}</h3>
              )}
              {rest ? (
                <p className="whitespace-pre-line">
                  <MathText>{rest}</MathText>
                </p>
              ) : null}
            </div>
          )
        }
        if (lines.every((l) => /^\s*[-*] /.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>
                  <MathText>{l.replace(/^\s*[-*] /, '')}</MathText>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="whitespace-pre-line">
            <MathText>{lines.join('\n')}</MathText>
          </p>
        )
      })}
    </div>
  )
}
