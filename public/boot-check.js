// If the app does not start, say so -- and why -- instead of leaving a blank
// white page. Loaded before the app itself, as a file rather than inline script
// because the security policy (public/_headers) refuses inline script.
;(function () {
  var problems = []
  var note = null

  window.addEventListener(
    'error',
    function (e) {
      var t = e.target
      if (t && t !== window && (t.src || t.href)) problems.push('Could not load ' + (t.src || t.href))
      else if (e.message) problems.push(e.message)
    },
    true,
  )
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason
    problems.push(String((r && r.message) || r))
  })
  document.addEventListener('securitypolicyviolation', function (e) {
    problems.push('Blocked by the security policy: ' + (e.blockedURI || 'inline code') + ' (' + e.violatedDirective + ')')
  })

  function started() {
    var root = document.getElementById('root')
    return root && root.childElementCount > 0
  }

  function show() {
    if (started() || note) return
    note = document.createElement('div')
    note.setAttribute('role', 'alert')
    note.style.cssText =
      'max-width:28rem;margin:3rem auto;padding:1.25rem;font:15px/1.5 system-ui,sans-serif;color:#0b1f3a;border:1px solid #f2c94c;background:#fffbea;border-radius:12px'
    var title = document.createElement('p')
    title.style.cssText = 'margin:0 0 .5rem;font-weight:700'
    title.textContent = problems.length ? 'DONE WELL could not start.' : 'DONE WELL is taking a long time to start.'
    var body = document.createElement('p')
    body.style.cssText = 'margin:0 0 .75rem'
    body.textContent = problems.length
      ? 'Please refresh the page. If this keeps happening, send a screenshot of this message to DONE WELL.'
      : 'Your connection may be slow. Wait a moment, or refresh the page.'
    var button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Refresh'
    button.style.cssText = 'padding:.5rem 1rem;border:0;border-radius:8px;background:#0b1f3a;color:#fff;font:inherit'
    button.addEventListener('click', function () {
      location.reload()
    })
    note.appendChild(title)
    note.appendChild(body)
    note.appendChild(button)
    if (problems.length) {
      var details = document.createElement('pre')
      details.style.cssText = 'margin:.75rem 0 0;white-space:pre-wrap;word-break:break-word;font-size:12px;color:#5b6475'
      details.textContent = problems.slice(0, 5).join('\n')
      note.appendChild(details)
    }
    document.body.appendChild(note)
  }

  // The app may still start after the note appears (a slow connection): then the note goes.
  var checks = 0
  var timer = setInterval(function () {
    checks++
    if (started()) {
      if (note) note.remove()
      clearInterval(timer)
    } else if (checks === 8) {
      show()
    } else if (checks > 8 && problems.length && note && note.querySelector('pre') === null) {
      note.remove()
      note = null
      show()
    } else if (checks > 120) {
      clearInterval(timer)
    }
  }, 1000)
})()
