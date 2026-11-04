import { useEffect, useMemo, useRef, useState } from 'react'
import { tickets, CARDS } from '../lib/data'
import { shuffle } from '../lib/srs'

const TOTAL = 300
const PHASES = [
  { key: 'ievads', label: 'Ievads', from: 0, to: 30, tip: 'Viena teikuma definīcija un kāpēc tas ir svarīgi' },
  { key: 'darbiba', label: 'Kā tas darbojas', from: 30, to: 120, tip: 'Galvenais mehānisms soli pa solim' },
  { key: 'detalas', label: 'Detaļas', from: 120, to: 210, tip: 'Skaitļi, lauki, standarti, porti' },
  { key: 'piemers', label: 'Piemērs', from: 210, to: 270, tip: 'Viena reāla situācija vai salīdzinājums' },
  { key: 'nosleg', label: 'Noslēgums', from: 270, to: 300, tip: 'Kopsavilkums un saite ar citu tēmu' },
]
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function beep(freq = 660, ms = 180) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = freq
    g.gain.value = 0.08
    o.connect(g).connect(ctx.destination)
    o.start()
    setTimeout(() => { o.stop(); ctx.close() }, ms)
  } catch { /* audio not available */ }
}

export default function Tickets({ progress, update }) {
  const [ticket, setTicket] = useState(null)
  const [summary, setSummary] = useState(null)

  const draw = () => {
    // Weighted draw: tickets practiced less often (or scored lower) come up more.
    const weights = tickets.map((t) => {
      const r = progress.tickets[t.id]
      return r ? 1 / (1 + r.n) + (100 - r.last) / 200 : 2
    })
    let x = Math.random() * weights.reduce((a, b) => a + b, 0)
    const pick = tickets.find((_, i) => (x -= weights[i]) <= 0) ?? tickets[0]
    setSummary(null)
    setTicket(pick)
  }

  const finish = (t, checked, elapsed) => {
    const score = Math.round((checked.size / t.facts.length) * 100)
    update((p) => {
      const prev = p.tickets[t.id] || { n: 0, best: 0 }
      p.tickets[t.id] = { n: prev.n + 1, best: Math.max(prev.best, score), last: score, at: Date.now() }
      return p
    })
    setSummary({ t, score, elapsed, missed: t.facts.filter((_, i) => !checked.has(i)) })
    setTicket(null)
  }

  if (ticket) return <Speech key={ticket.id} t={ticket} onFinish={finish} onExit={() => setTicket(null)} />
  if (summary) return <Summary s={summary} onDraw={draw} onList={() => setSummary(null)} />

  return (
    <div className="stack">
      <section className="card hero-ticket">
        <div>
          <h1>Mutiskais eksāmens</h1>
          <p className="muted">Izlozē biļeti, runā 5 minūtes pēc plāna un atzīmē faktus, ko pieminēji. Biežāk izkritīs biļetes, kuras runāji retāk vai sliktāk.</p>
        </div>
        <button className="primary big-btn" onClick={draw}>Izlozēt biļeti</button>
      </section>
      <section className="card">
        <h2>Visas biļetes</h2>
        <div className="ticket-grid">
          {tickets.map((t) => {
            const r = progress.tickets[t.id]
            return (
              <button key={t.id} className="ticket" onClick={() => { setSummary(null); setTicket(t) }}>
                <span className="num">{t.id}</span>
                <span className="ttl">{t.title}</span>
                <small className="muted">{r ? `${r.n}x, pēdējo reizi ${r.last}%, labākais ${r.best}%` : 'vēl nav runāts'}</small>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Speech({ t, onFinish, onExit }) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [showPlan, setShowPlan] = useState(true)
  const [checked, setChecked] = useState(() => new Set())
  const phaseRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const startAt = Date.now() - elapsed * 1000
    const id = setInterval(() => setElapsed(Math.min(TOTAL, (Date.now() - startAt) / 1000)), 250)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const phase = Math.max(0, PHASES.findIndex((p) => elapsed >= p.from && elapsed < p.to))
  const current = elapsed >= TOTAL ? PHASES.length : phase

  useEffect(() => {
    if (current !== phaseRef.current) {
      phaseRef.current = current
      if (current === PHASES.length) { beep(880, 500); setRunning(false) } else beep()
    }
  }, [current])

  const toggle = (i) => {
    const next = new Set(checked)
    next.has(i) ? next.delete(i) : next.add(i)
    setChecked(next)
  }

  return (
    <div className="stack">
      <div className="session-head">
        <button className="link" onClick={onExit}>Atpakaļ</button>
        <span className="muted">{t.modules}</span>
      </div>
      <section className="card speech-head">
        <div className="ticket-no">Biļete Nr. {t.id}</div>
        <h1>{t.title}</h1>
        <div className={`timer ${elapsed >= TOTAL ? 'over' : ''}`}>{fmt(Math.max(0, TOTAL - elapsed))}</div>
        <div className="phasebar">
          {PHASES.map((p, i) => (
            <div key={p.key} className={`ph ${i < current ? 'past' : i === current ? 'now' : ''}`} style={{ flex: p.to - p.from }}>
              <div className="fill" style={{ width: i === current ? `${((elapsed - p.from) / (p.to - p.from)) * 100}%` : i < current ? '100%' : 0 }} />
              <span>{p.label}</span>
            </div>
          ))}
        </div>
        <div className="row center-row">
          <button className="primary" onClick={() => setRunning(!running)} disabled={elapsed >= TOTAL}>
            {running ? 'Pauze' : elapsed > 0 ? 'Turpināt' : 'Sākt runu'}
          </button>
          <button onClick={() => { setRunning(false); setElapsed(0); phaseRef.current = 0 }}>No sākuma</button>
          <button onClick={() => onFinish(t, checked, elapsed)}>Pabeigt un novērtēt</button>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={showPlan} onChange={(e) => setShowPlan(e.target.checked)} />
          Rādīt runas plānu (izslēdz, lai trenētos kā eksāmenā)
        </label>
      </section>

      <div className="speech-grid">
        <section className="card">
          <h2>Runas plāns</h2>
          {PHASES.map((p, i) => (
            <div key={p.key} className={`plan ${i === current ? 'now' : ''}`}>
              <div className="plan-head">
                <strong>{p.label}</strong>
                <span className="muted small">{fmt(p.from)}-{fmt(p.to)}</span>
              </div>
              <div className="muted small">{p.tip}</div>
              {showPlan ? <p>{t.plan[p.key]}</p> : <p className="muted small">(paslēpts)</p>}
            </div>
          ))}
        </section>
        <section className="card">
          <h2>Fakti, ko pieminēt <span className="muted small">{checked.size}/{t.facts.length}</span></h2>
          <p className="muted small">Atzīmē to, ko tiešām pateici. Draugs var klausīties un atzīmēt.</p>
          <ul className="facts">
            {t.facts.map((f, i) => (
              <li key={i}>
                <label className={checked.has(i) ? 'done' : ''}>
                  <input type="checkbox" checked={checked.has(i)} onChange={() => toggle(i)} />
                  <span>{f}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Summary({ s, onDraw, onList }) {
  const followUps = useMemo(() => shuffle(CARDS.filter((c) => c.t === s.t.id)).slice(0, 4), [s])
  const [open, setOpen] = useState(() => new Set())
  return (
    <div className="stack">
      <section className="card center">
        <div className="ticket-no">Biļete Nr. {s.t.id}</div>
        <h1>{s.t.title}</h1>
        <div className="big">{s.score}%</div>
        <p className="muted">Pieminēti fakti, runas laiks {fmt(s.elapsed)}</p>
        <div className="row center-row">
          <button className="primary" onClick={onDraw}>Izlozēt nākamo</button>
          <button onClick={onList}>Visas biļetes</button>
        </div>
      </section>
      {s.missed.length > 0 && (
        <section className="card">
          <h2>Nākamreiz piemini</h2>
          <ul className="missed">{s.missed.map((m) => <li key={m}>{m}</li>)}</ul>
        </section>
      )}
      <section className="card">
        <h2>Papildjautājumi</h2>
        <p className="muted small">Eksaminētājs pēc runas uzdod jautājumus. Atbildi skaļi, tad pārbaudi.</p>
        <div className="followups">
          {followUps.map((c, i) => (
            <button key={c.id} className="followup" onClick={() => setOpen(new Set(open).add(i))}>
              <strong>{c.q}</strong>
              {open.has(i) ? <span>{c.a}</span> : <span className="muted small">Rādīt atbildi</span>}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
