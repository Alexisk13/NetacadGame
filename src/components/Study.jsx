import { useEffect, useMemo, useState } from 'react'
import { TOPICS, CARDS, QUESTIONS, topicTitle } from '../lib/data'
import { buildQueue, counts, grade, shuffle } from '../lib/srs'

const SIZES = [10, 20, 40]
const REQUEUE_GAP = 3
const COUNT_WORD = { 2: 'divas', 3: 'trīs', 4: 'četras' }

export default function Study({ mode, progress, update, preset }) {
  const pool = mode === 'quiz' ? QUESTIONS : CARDS
  const [topics, setTopics] = useState(() => new Set(preset ?? TOPICS.map((t) => t.id)))
  const [size, setSize] = useState(20)
  const [run, setRun] = useState(null) // { queue, extra }
  const [result, setResult] = useState(null)

  const selected = useMemo(() => pool.filter((i) => topics.has(i.t)), [pool, topics])
  const c = counts(selected, progress.srs)

  const start = () => {
    setResult(null)
    setRun(buildQueue(selected, progress.srs, size))
  }

  const record = (item, outcome, wasCorrect) => {
    update((p) => {
      p.srs[item.key] = grade(p.srs[item.key], outcome)
      p.stats.answered += 1
      if (wasCorrect) p.stats.correct += 1
      return p
    })
  }

  if (result) return <Result mode={mode} result={result} onAgain={start} onSetup={() => { setResult(null); setRun(null) }} />

  if (run) {
    const Session = mode === 'quiz' ? QuizSession : CardSession
    return <Session key={run.queue.map((i) => i.id).join()} initial={run.queue} extra={run.extra} record={record} onDone={(r) => { setRun(null); setResult(r) }} onExit={() => setRun(null)} />
  }

  const toggle = (id) => {
    const next = new Set(topics)
    next.has(id) ? next.delete(id) : next.add(id)
    setTopics(next)
  }

  return (
    <div className="stack">
      <section className="card">
        <h1>{mode === 'quiz' ? 'Viktorīna' : 'Kartītes'}</h1>
        <p className="muted">
          {mode === 'quiz'
            ? 'Izvēlies tēmas. Vispirms nāk jautājumi, kas jāatkārto, tad jauni. Kļūdainie atgriežas tajā pašā sesijā.'
            : 'Izlasi jautājumu, atbildi galvā, pagriez kartīti un godīgi novērtē sevi.'}
        </p>
        <div className="chip-actions">
          <button className="link" onClick={() => setTopics(new Set(TOPICS.map((t) => t.id)))}>Visas</button>
          <button className="link" onClick={() => setTopics(new Set())}>Neviena</button>
        </div>
        <div className="chips">
          {TOPICS.map((t) => {
            const tc = counts(pool.filter((i) => i.t === t.id), progress.srs)
            return (
              <button key={t.id} className={`chip ${topics.has(t.id) ? 'on' : ''}`} onClick={() => toggle(t.id)} title={t.title}>
                {t.short}
                {tc.due > 0 && <span className="badge">{tc.due}</span>}
              </button>
            )
          })}
        </div>
        <div className="row">
          <span className="muted">Sesijas garums:</span>
          {SIZES.map((s) => (
            <button key={s} className={`chip ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>
          ))}
        </div>
        <div className="row spread">
          <div className="pills">
            <span className="pill warn">{c.due} jāatkārto</span>
            <span className="pill">{c.fresh} jauni</span>
            <span className="pill ok">{c.mastered} apgūti</span>
          </div>
          <button className="primary" disabled={!selected.length} onClick={start}>Sākt</button>
        </div>
      </section>
    </div>
  )
}

/** Shared queue logic: wrong items are put back a few positions later. */
function useQueue(initial) {
  const [queue, setQueue] = useState(initial)
  const [idx, setIdx] = useState(0)
  const [firstTry, setFirstTry] = useState({})
  const item = queue[idx]
  const mark = (ok) => {
    const isFirst = !(item.key in firstTry)
    if (isFirst) setFirstTry((f) => ({ ...f, [item.key]: ok }))
    if (!ok) {
      setQueue((q) => {
        const copy = [...q]
        copy.splice(Math.min(idx + 1 + REQUEUE_GAP, copy.length), 0, item)
        return copy
      })
    }
    return { isFirst, retried: !isFirst }
  }
  const next = () => setIdx((i) => i + 1)
  const done = idx >= queue.length
  const summary = () => ({
    total: Object.keys(firstTry).length,
    correct: Object.values(firstTry).filter(Boolean).length,
    missed: initial.filter((i) => firstTry[i.key] === false),
  })
  return { item, idx, queue, mark, next, done, summary }
}

function Progress({ idx, total, item, onExit, extra }) {
  return (
    <div className="session-head">
      <button className="link" onClick={onExit}>Beigt</button>
      <div className="bar thin"><div style={{ width: `${(idx / total) * 100}%` }} /></div>
      <span className="muted">{idx + 1}/{total}</span>
      <div className="topic-tag">{item.t ? `${item.t}. biļete: ` : ''}{topicTitle(item.t).replace(/\.$/, '')}{extra ? ' (papildu treniņš)' : ''}</div>
    </div>
  )
}

function QuizSession({ initial, extra, record, onDone, onExit }) {
  const q = useQueue(initial)
  const [picked, setPicked] = useState([])
  const [checked, setChecked] = useState(false)
  const item = q.item

  const order = useMemo(() => {
    if (!item) return []
    const idxs = item.o.map((_, i) => i)
    return item.o.length === 2 ? idxs : shuffle(idxs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, q.idx])

  useEffect(() => { if (q.done) onDone(q.summary()) })

  const need = item?.a.length ?? 1
  const correct = item && checked && picked.length === need && picked.every((p) => item.a.includes(p))

  const choose = (i) => {
    if (checked) return
    if (need === 1) setPicked([i])
    else setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length < need ? [...p, i] : p))
  }
  const check = () => {
    if (picked.length !== need) return
    setChecked(true)
    const ok = picked.every((p) => item.a.includes(p))
    const { retried } = q.mark(ok)
    record(item, ok ? (retried ? 'hard' : 'good') : 'again', ok)
  }
  const next = () => { setPicked([]); setChecked(false); q.next() }

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      const n = Number(e.key)
      if (n >= 1 && n <= order.length) choose(order[n - 1])
      if (e.key === 'Enter') checked ? next() : check()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!item) return null
  return (
    <div className="stack">
      <Progress idx={q.idx} total={q.queue.length} item={item} onExit={onExit} extra={extra} />
      <section className="card question">
        <h2>{item.q}</h2>
        {need > 1 && <p className="hint">Izvēlies {COUNT_WORD[need] ?? need} atbildes.</p>}
        <div className="options">
          {order.map((i, n) => {
            const isPicked = picked.includes(i)
            const isRight = item.a.includes(i)
            let cls = isPicked ? 'picked' : ''
            if (checked) cls = isRight ? 'right' : isPicked ? 'wrong' : 'dim'
            return (
              <button key={i} className={`option ${cls}`} onClick={() => choose(i)}>
                <span className="key">{n + 1}</span>
                <span>{item.o[i]}</span>
              </button>
            )
          })}
        </div>
        {checked && (
          <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
            <strong>{correct ? 'Pareizi!' : 'Nepareizi.'}</strong> {item.e}
            {!correct && <div className="muted small">Šis jautājums vēl atgriezīsies šajā sesijā.</div>}
          </div>
        )}
        <div className="row end">
          {!checked
            ? <button className="primary" disabled={picked.length !== need} onClick={check}>Pārbaudīt</button>
            : <button className="primary" onClick={next}>Tālāk</button>}
        </div>
      </section>
      <p className="muted small center kbd-hint">Taustiņi: 1-6 izvēlas, Enter pārbauda un iet tālāk.</p>
    </div>
  )
}

function CardSession({ initial, extra, record, onDone, onExit }) {
  const q = useQueue(initial)
  const [flipped, setFlipped] = useState(false)
  const item = q.item

  useEffect(() => { if (q.done) onDone(q.summary()) })

  const rate = (outcome) => {
    const ok = outcome !== 'again'
    const { retried } = q.mark(ok)
    record(item, ok && retried ? 'hard' : outcome, ok)
    setFlipped(false)
    q.next()
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!flipped) setFlipped(true) }
      if (flipped && e.key === '1') rate('again')
      if (flipped && e.key === '2') rate('hard')
      if (flipped && e.key === '3') rate('good')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!item) return null
  return (
    <div className="stack">
      <Progress idx={q.idx} total={q.queue.length} item={item} onExit={onExit} extra={extra} />
      <button className={`flashcard card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(true)}>
        <div className="fc-q">{item.q}</div>
        {flipped ? <div className="fc-a">{item.a}</div> : <div className="muted small">Pieskaries vai spied atstarpi, lai redzētu atbildi</div>}
      </button>
      {flipped && (
        <div className="rate">
          <button className="bad" onClick={() => rate('again')}><span className="key">1</span> Nezināju</button>
          <button className="mid" onClick={() => rate('hard')}><span className="key">2</span> Grūti</button>
          <button className="ok" onClick={() => rate('good')}><span className="key">3</span> Zināju</button>
        </div>
      )}
    </div>
  )
}

function Result({ mode, result, onAgain, onSetup }) {
  const pct = result.total ? Math.round((result.correct / result.total) * 100) : 0
  return (
    <div className="stack">
      <section className="card center">
        <h1>{pct >= 80 ? 'Lieliski!' : pct >= 50 ? 'Labi, turpini!' : 'Vēl jāpatrenējas'}</h1>
        <div className="big">{pct}%</div>
        <p className="muted">Ar pirmo mēģinājumu: {result.correct} no {result.total}</p>
        <div className="row center-row">
          <button className="primary" onClick={onAgain}>Vēl viena sesija</button>
          <button onClick={onSetup}>Mainīt tēmas</button>
        </div>
      </section>
      {result.missed.length > 0 && (
        <section className="card">
          <h2>Kļūdas, ko atcerēties</h2>
          <ul className="missed">
            {result.missed.map((i) => (
              <li key={i.key}>
                <strong>{i.q}</strong>
                <span>{mode === 'quiz' ? i.a.map((a) => i.o[a]).join('; ') : i.a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
