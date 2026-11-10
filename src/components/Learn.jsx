import { useState } from 'react'
import { tickets, LESSONS } from '../lib/data'
import { InfoStep, McqStep, OrderStep, MatchStep, SortStep, FlowStep } from './steps'
import { BinaryWidget, SubnetWidget, Ipv6Widget, EncapWidget, MacTableWidget } from './widgets'
import Cli from './Cli'

const STEP = { info: InfoStep, mcq: McqStep, order: OrderStep, match: MatchStep, sort: SortStep, flow: FlowStep }
const WIDGET = { binary: BinaryWidget, subnet: SubnetWidget, ipv6: Ipv6Widget, encap: EncapWidget, mactable: MacTableWidget }
const CliStep = ({ step, onResult }) => (
  <div>
    <h2>{step.h}</h2>
    <p className="muted small">Konfigurē komutatoru tāpat kā eksāmenā. Pareizās komandas atzīmē uzdevumus.</p>
    <Cli onResult={onResult} compact />
  </div>
)
WIDGET.cli = CliStep

const graded = (step) => step.k !== 'info'
const starsFor = (ratio) => (ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1)
const Stars = ({ n = 0 }) => (
  <span className="stars" aria-label={`${n} no 3 zvaigznēm`}>
    {[1, 2, 3].map((i) => <span key={i} className={i <= n ? 'on' : ''}>★</span>)}
  </span>
)

export default function Learn({ progress, update, go, openLesson, setOpenLesson }) {
  const [lab, setLab] = useState(false)
  const lessons = progress.lessons || {}

  if (lab) {
    return (
      <div className="stack">
        <div className="session-head"><button className="link" onClick={() => setLab(false)}>Atpakaļ</button></div>
        <section className="card">
          <h1>Laboratorijas simulators</h1>
          <p className="muted">Komutatora pamata konfigurācija pa konsoli, tieši kā eksāmenā. Raksti komandas, uzvedne mainās kā īstā IOS. Saīsinājumi strādā (en, conf t, int vlan 1, copy run start).</p>
          <Cli />
        </section>
      </div>
    )
  }

  if (openLesson) {
    const t = tickets.find((x) => x.id === openLesson)
    const lesson = LESSONS.find((l) => l.t === openLesson)
    return (
      <Player
        key={openLesson}
        t={t}
        lesson={lesson}
        best={lessons[openLesson]?.stars ?? 0}
        onExit={() => setOpenLesson(null)}
        onFinish={(stars) => update((p) => {
          const prev = p.lessons?.[t.id] || { stars: 0, n: 0 }
          p.lessons = { ...(p.lessons || {}), [t.id]: { stars: Math.max(prev.stars, stars), n: prev.n + 1, at: Date.now() } }
          return p
        })}
        openOther={(id) => setOpenLesson(id)}
        go={go}
      />
    )
  }

  const doneCount = Object.keys(lessons).length
  const nextId = tickets.find((t) => !lessons[t.id])?.id

  return (
    <div className="stack">
      <section className="card hero-ticket">
        <div>
          <h1>Mācības</h1>
          <p className="muted">Katra biļete ir īss ceļš: viena doma, tad uzreiz uzdevums. Bez garām lapām teksta. Pabeidz mācību, tad trenē runu.</p>
          <div className="pills"><span className="pill ok">{doneCount}/18 pabeigtas</span></div>
        </div>
        {nextId && <button className="primary big-btn" onClick={() => setOpenLesson(nextId)}>Turpināt: {nextId}. biļete</button>}
      </section>

      <button className="card lab-card" onClick={() => setLab(true)}>
        <div className="lab-icon">&gt;_</div>
        <div>
          <h3>Laboratorijas simulators</h3>
          <p className="muted small">Konfigurē komutatoru komandrindā kā praktiskajā eksāmenā: hostname, paroles, SVI, saglabāšana, ping.</p>
        </div>
      </button>

      <div className="lesson-grid">
        {tickets.map((t) => {
          const l = lessons[t.id]
          const steps = LESSONS.find((x) => x.t === t.id)?.steps.length ?? 0
          return (
            <button key={t.id} className={`lesson-tile ${l ? 'done' : ''} ${t.id === nextId ? 'next' : ''}`} onClick={() => setOpenLesson(t.id)}>
              <div className="lesson-top">
                <span className="num">{t.id}</span>
                <Stars n={l?.stars} />
              </div>
              <span className="ttl">{t.title}</span>
              <small className="muted">{steps} soļi{l ? `, iziets ${l.n}x` : ''}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Player({ t, lesson, best, onExit, onFinish, openOther, go }) {
  // Queue of step indexes; wrongly answered steps are appended once more at the end.
  const [queue, setQueue] = useState(() => lesson.steps.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [first, setFirst] = useState({})
  const [finished, setFinished] = useState(null)

  const idx = queue[pos]
  const step = lesson.steps[idx]
  const retry = pos >= lesson.steps.length

  const onResult = (ok) => {
    setAnswered(true)
    if (!(idx in first)) setFirst((f) => ({ ...f, [idx]: ok }))
    if (!ok && !retry) setQueue((q) => [...q, idx])
  }

  const next = () => {
    if (pos + 1 >= queue.length) {
      const gradedIdx = lesson.steps.map((s, i) => (graded(s) ? i : -1)).filter((i) => i >= 0)
      const correct = gradedIdx.filter((i) => first[i]).length
      const stars = starsFor(gradedIdx.length ? correct / gradedIdx.length : 1)
      onFinish(stars)
      setFinished({ stars, correct, total: gradedIdx.length })
      return
    }
    setPos(pos + 1)
    setAnswered(false)
    window.scrollTo(0, 0)
  }

  if (finished) return <LessonEnd t={t} result={finished} best={best} onExit={onExit} openOther={openOther} go={go} />

  const Comp = step.k === 'widget' ? WIDGET[step.w] : STEP[step.k]
  const isInfo = step.k === 'info'

  return (
    <div className="stack">
      <div className="session-head">
        <button className="link" onClick={onExit}>Beigt</button>
        <div className="bar thin"><div style={{ width: `${(pos / queue.length) * 100}%` }} /></div>
        <span className="muted">{pos + 1}/{queue.length}</span>
        <div className="topic-tag">{t.id}. {t.title}{retry ? ' · atkārtojums' : ''}</div>
      </div>
      <section className={`card lesson-step ${isInfo ? 'is-info' : ''}`}>
        <Comp key={pos} step={step} onResult={onResult} />
        {(isInfo || answered) && (
          <div className="row end">
            <button className="primary" onClick={next} autoFocus>{isInfo ? 'Sapratu' : 'Tālāk'}</button>
          </div>
        )}
        {step.k === 'widget' && !answered && (
          <div className="row end">
            <button className="link" onClick={() => { setFirst((f) => ({ ...f, [idx]: false })); setAnswered(true) }}>Izlaist</button>
          </div>
        )}
      </section>
    </div>
  )
}

function LessonEnd({ t, result, best, onExit, openOther, go }) {
  return (
    <div className="stack">
      <section className="card center">
        <div className="ticket-no">Biļete Nr. {t.id}</div>
        <h1>{t.title}</h1>
        <div className="stars big-stars"><Stars n={result.stars} /></div>
        <p className="muted">Ar pirmo mēģinājumu: {result.correct} no {result.total}{result.stars > best && best > 0 ? ' · jauns rekords!' : ''}</p>
        <div className="row center-row">
          <button className="primary" onClick={() => go('tickets', null, t.id)}>Trenēt runu</button>
          <button onClick={() => go('cards', [t.id])}>Kartītes</button>
          <button onClick={onExit}>Visas mācības</button>
        </div>
      </section>
      <section className="card">
        <h2>Galvenā doma</h2>
        <p className="idea">{t.idea}</p>
        <h2>Fakti, kas jāpasaka runā</h2>
        <ul className="bullets">{t.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </section>
      {t.links.length > 0 && (
        <section className="card">
          <h2>Saistītās tēmas</h2>
          <p className="muted small">Noslēgumā piemini saiti uz citu biļeti, tas izklausās pārliecinoši.</p>
          <div className="chips">
            {t.links.map((id) => (
              <button key={id} className="chip" onClick={() => openOther(id)}>{id}. {tickets.find((x) => x.id === id)?.title}</button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
