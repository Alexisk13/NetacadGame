import { useState } from 'react'
import { supabase } from '../lib/supabase'

/** Lets a logged-in user choose a new password (after an invite link, reset link, or by choice). */
export default function SetPassword({ title, intro, onDone, onCancel }) {
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 8) return setError('Parolei jābūt vismaz 8 rakstzīmēm.')
    if (password !== repeat) return setError('Paroles nesakrīt.')
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(error.message)
    else onDone()
  }

  return (
    <div className="login">
      <form className="card" onSubmit={submit}>
        <h1>{title}</h1>
        {intro && <p className="muted">{intro}</p>}
        <label>
          Jaunā parole
          <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Atkārto paroli
          <input type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="primary" disabled={busy}>{busy ? 'Saglabā...' : 'Saglabāt paroli'}</button>
        {onCancel && <button type="button" className="link" onClick={onCancel}>Atcelt</button>}
      </form>
    </div>
  )
}
