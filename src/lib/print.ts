/**
 * Print one part of a page on its own. Pages hold more than one printable
 * `print-area` -- a mark book with its moderation report, a list with its
 * letters home -- and index.css leaves every other area off the paper while
 * `body[data-print]` names the part being printed.
 */
export function printPart(part: 'moderation' | 'letters' | 'schedule') {
  document.body.dataset.print = part
  const done = () => {
    delete document.body.dataset.print
    window.removeEventListener('afterprint', done)
  }
  window.addEventListener('afterprint', done)
  window.print()
}
