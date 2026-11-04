import { useState } from 'react'
import { supabase, appUrl } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [info, setInfo] = useState('')

  const forgot = async () => {
    setError('')
    setInfo('')
    if (!email.trim()) return setError('Ieraksti savu e-pastu un spied vēlreiz.')
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: appUrl() })
    setBusy(false)
    if (error) setError(error.message)
    else setInfo('Ja šis konts eksistē, e-pastā ir saite paroles maiņai.')
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setError(error.message === 'Invalid login credentials' ? 'Nepareizs e-pasts vai parole.' : error.message)
  }

  return (
    <div className="login">
      <form className="card" onSubmit={submit}>
        <img src="./favicon.svg" alt="" width="56" height="56" />
        <h1>Tīklu treniņš</h1>
        <p className="muted">Gatavošanās eksāmenam "Datoru tīkli I" (Cisco ITN v7)</p>
        <label>
          E-pasts
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Parole
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="error">{error}</div>}
        {info && <div className="muted small">{info}</div>}
        <button className="primary" disabled={busy}>{busy ? 'Pieslēdzas...' : 'Pieslēgties'}</button>
        <button type="button" className="link" onClick={forgot} disabled={busy}>Aizmirsi paroli?</button>
      </form>
    </div>
  )
}
