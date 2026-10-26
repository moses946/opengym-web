import { useEffect, useState } from 'react'
import { LOCAL_WEB } from '../lib/standalone.js'

let installPrompt = null
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  installPrompt = event
  window.dispatchEvent(new Event('opengym-install-ready'))
})

export default function InstallApp() {
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches || !!navigator.standalone)
  const [instructions, setInstructions] = useState(false)
  const [available, setAvailable] = useState(!!installPrompt)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const ready = () => setAvailable(true)
    const done = () => { installPrompt = null; setInstalled(true) }
    window.addEventListener('opengym-install-ready', ready)
    window.addEventListener('appinstalled', done)
    return () => {
      window.removeEventListener('opengym-install-ready', ready)
      window.removeEventListener('appinstalled', done)
    }
  }, [])
  if (!LOCAL_WEB || installed) return null
  const install = async () => {
    if (!installPrompt) { setInstructions(v => !v); return }
    setBusy(true)
    try {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
    } catch { setInstructions(true) } finally { installPrompt = null; setAvailable(false); setBusy(false) }
  }
  const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return <section className="card install-app" aria-label="Install openGym">
    <div className="row between" style={{ gap: 16 }}>
      <div><div className="small muted">YOUR GYM. ANYWHERE.</div><h2 style={{ fontSize: 20, margin: '5px 0' }}>Make room for your next PR.</h2><p className="small muted" style={{ margin: 0 }}>Install openGym. Train offline. Keep your data.</p></div>
      <button className="btn tinted" type="button" disabled={busy} onClick={install} aria-expanded={!available ? instructions : undefined}>{busy ? 'Installing…' : 'Install app'}</button>
    </div>
    {instructions && <p className="small" role="status" style={{ marginBottom: 0 }}>{apple ? 'Open this website in Safari, tap Share, then Add to Home Screen and Add.' : 'Open this website in Chrome or Edge, then use Install app in the browser menu or address bar. If it is unavailable, you can keep training in this tab.'}</p>}
  </section>
}
