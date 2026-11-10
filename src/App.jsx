import { useEffect, useState } from 'react'
import { supabase, hasBackend, needsPasswordFromLink } from './lib/supabase'
import { useProgress } from './lib/store'
import Login from './components/Login'
import SetPassword from './components/SetPassword'
import Home from './components/Home'
import Study from './components/Study'
import Tickets from './components/Tickets'
import Learn from './components/Learn'

const NAV = [
  { id: 'home', label: 'Sākums' },
  { id: 'learn', label: 'Mācības' },
  { id: 'quiz', label: 'Viktorīna' },
  { id: 'cards', label: 'Kartītes' },
  { id: 'tickets', label: 'Biļetes' },
]

export default function App() {
  const [session, setSession] = useState(hasBackend ? undefined : { user: { id: 'local', email: 'lokāli' } })
  const [choosePassword, setChoosePassword] = useState(needsPasswordFromLink)

  useEffect(() => {
    if (!hasBackend) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      if (event === 'PASSWORD_RECOVERY') setChoosePassword(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="center muted">Ielādē...</div>
  if (!session) return <Login />
  if (choosePassword) {
    return (
      <SetPassword
        title="Izvēlies paroli"
        intro={`Konts: ${session.user.email}. Ar šo paroli turpmāk pieslēgsies.`}
        onDone={() => setChoosePassword(false)}
      />
    )
  }
  return <Game user={session.user} />
}

function Game({ user }) {
  const { progress, update, sync, reset, flush } = useProgress(user.id)
  const [screen, setScreen] = useState('home')
  const [preset, setPreset] = useState(null)
  const [ticketPreset, setTicketPreset] = useState(null)
  const [openLesson, setOpenLesson] = useState(null)
  const [changingPassword, setChangingPassword] = useState(false)

  if (!progress) return <div className="center muted">Ielādē progresu...</div>
  if (changingPassword) {
    return <SetPassword title="Mainīt paroli" onDone={() => setChangingPassword(false)} onCancel={() => setChangingPassword(false)} />
  }

  const name = user.user_metadata?.name || user.email.split('@')[0]
  const go = (id, topics = null, ticket = null) => {
    setPreset(topics)
    setTicketPreset(ticket)
    setOpenLesson(null)
    setScreen(id)
    window.scrollTo(0, 0)
  }
  const logout = async () => {
    await flush()
    await supabase.auth.signOut()
  }

  return (
    <div className="app">
      <header className="top">
        <button className="brand" onClick={() => go('home')}>
          <img src="./favicon.svg" alt="" width="28" height="28" />
          <span>Tīklu treniņš</span>
        </button>
        <nav>
          {NAV.map((n) => (
            <button key={n.id} className={screen === n.id ? 'active' : ''} onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="who">
          <span className={`dot ${sync}`} title={SYNC_LABEL[sync]} />
          <span className="muted">{name}</span>
          {hasBackend && <button className="link" onClick={logout}>Iziet</button>}
        </div>
      </header>
      {!hasBackend && (
        <div className="banner">Lokālais režīms: progress tiek glabāts tikai šajā pārlūkā. Konti darbojas, kad ir iestatīts Supabase.</div>
      )}
      <main>
        {screen === 'home' && <Home name={name} progress={progress} go={go} reset={reset} changePassword={hasBackend ? () => setChangingPassword(true) : null} openLesson={(id) => { go('learn'); setOpenLesson(id) }} />}
        {screen === 'learn' && <Learn progress={progress} update={update} go={go} openLesson={openLesson} setOpenLesson={setOpenLesson} />}
        {screen === 'quiz' && <Study key={`q${preset}`} mode="quiz" progress={progress} update={update} preset={preset} />}
        {screen === 'cards' && <Study key={`c${preset}`} mode="cards" progress={progress} update={update} preset={preset} />}
        {screen === 'tickets' && <Tickets key={ticketPreset ?? 'list'} progress={progress} update={update} preset={ticketPreset} />}
      </main>
    </div>
  )
}

const SYNC_LABEL = {
  idle: 'Sinhronizēts',
  saving: 'Saglabā...',
  saved: 'Saglabāts mākonī',
  offline: 'Nav savienojuma ar serveri, saglabāts lokāli',
  error: 'Neizdevās saglabāt mākonī, saglabāts lokāli',
}
