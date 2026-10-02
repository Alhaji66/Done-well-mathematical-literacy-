// Undo the redirect encoding from 404.html (see public/404.html for why this exists).
// Only GitHub Pages needs it; on any other host the address has no `?/` and this does nothing.
;(function (l) {
  if (l.search[1] === '/') {
    var decoded = l.search
      .slice(1)
      .split('&')
      .map(function (s) {
        return s.replace(/~and~/g, '&')
      })
      .join('?')
    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash)
  }
})(window.location)
