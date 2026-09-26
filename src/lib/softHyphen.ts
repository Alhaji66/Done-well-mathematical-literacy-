/**
 * Soft hyphens for long words in narrow table columns.
 *
 * WHY. A 5- or 6-column table from a Mat Lit paper -- prices in three cities,
 * employment by sector and gender -- is wider than a phone. The column widths
 * are set by the longest unbreakable word in each column ("Bloemfontein",
 * "Manufacturing", "(thousands)"), not by the numbers, so the table ends up
 * wider than the screen and the last column sits behind a sideways scroll.
 *
 * CSS `hyphens: auto` would fix that where the browser has a hyphenation
 * dictionary, but not every phone browser does, and without one nothing
 * happens. So the break points are put into the text itself as soft hyphens
 * (U+00AD): invisible unless the word actually has to break, and then shown as
 * an ordinary hyphen. Every browser honours them.
 *
 * WHERE TO BREAK. The usual English syllable rules, which also suit South
 * African place names: between two consonants (Bloem-fontein, Manufac-turing)
 * or before a single consonant between vowels (thou-sands, calcu-lator). Of
 * the possible points, the one nearest the middle wins, and each side keeps at
 * least three letters, so nothing is left as a stray "ly" or "ds".
 *
 * Only words of EIGHT or more letters are touched, and nothing with a digit in
 * it: an amount like R1 250 must never split across two lines.
 */

const SHY = '\u00AD'
const MIN_WORD = 8
const MIN_SIDE = 3

const isVowel = (c: string) => /[aeiouy]/i.test(c)
const isLetter = (c: string) => /[a-z]/i.test(c)
// Pairs that sound as one consonant, so a break between them reads badly.
const DIGRAPHS = new Set(['th', 'ch', 'sh', 'ph', 'wh', 'ck', 'ng', 'gh', 'qu'])

/** The best place to break one run of letters, or -1 if there is none. */
function breakPoint(word: string): number {
  const n = word.length
  const candidates: { at: number; pair: boolean }[] = []
  for (let i = MIN_SIDE; i <= n - MIN_SIDE; i++) {
    const a = word[i - 1]
    const b = word[i]
    const next = word[i + 1] ?? ''
    // VC|CV: two consonants between vowels, split between them.
    if (!isVowel(a) && !isVowel(b) && isVowel(word[i - 2] ?? '') && isVowel(next) && !DIGRAPHS.has((a + b).toLowerCase())) {
      candidates.push({ at: i, pair: true })
    }
    // V|CV: one consonant between vowels goes with the second syllable.
    if (isVowel(a) && !isVowel(b) && isVowel(next)) candidates.push({ at: i, pair: false })
  }
  if (!candidates.length) return -1
  const mid = n / 2
  candidates.sort((x, y) => Math.abs(x.at - mid) - Math.abs(y.at - mid) || Number(y.pair) - Number(x.pair))
  return candidates[0].at
}

/** One soft hyphen in each long word of `text`; everything else untouched. */
export function softHyphenate(text: string): string {
  return text.replace(/[A-Za-z]+/g, (word, offset: number, whole: string) => {
    if (word.length < MIN_WORD) return word
    // A word glued to a digit ("15kg", "R1250abc") is part of a value.
    if (/\d/.test(whole[offset - 1] ?? '') || /\d/.test(whole[offset + word.length] ?? '')) return word
    const at = breakPoint(word)
    return at < 0 || !word.split('').every(isLetter) ? word : word.slice(0, at) + SHY + word.slice(at)
  })
}
