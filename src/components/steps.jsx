import { useMemo, useState } from 'react'
import { shuffle } from '../lib/srs'

/*
 * Lesson step components. Each graded step calls onResult(firstTryCorrect) exactly once
 * when the learner has finished it; the player then shows the "Tālāk" button.
 */

export function InfoStep({ step }) {
  return (
    <div className="step-info">
      <h2>{step.h}</h2>
      {step.t && <p>{step.t}</p>}
      {step.b && (
        <ul className="bullets">
          {step.b.map((b) => <li key={b}>{b}</li>)}
        </ul>
      )}
      {step.tbl && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>{step.tbl[0].map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
            <tbody>
              {step.tbl.slice(1).map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {step.tip && <div className="tip">💡 {step.tip}</div>}
    </div>
  )
}

export function McqStep({ step, onResult }) {
  const order = useMemo(() => shuffle(step.o.map((_, i) => i)), [step])
  const [picked, setPicked] = useState(null)
  const choose = (i) => {
    if (picked !== null) return
    setPicked(i)
    onResult(i === step.a)
  }
  return (
    <div>
      <h2>{step.q}</h2>
      <div className="options">
        {order.map((i) => {
          let cls = ''
          if (picked !== null) cls = i === step.a ? 'right' : i === picked ? 'wrong' : 'dim'
          return (
            <button key={i} className={`option ${cls}`} onClick={() => choose(i)}>{step.o[i]}</button>
          )
        })}
      </div>
      {picked !== null && step.e && <div className={`feedback ${picked === step.a ? 'ok' : 'bad'}`}>{step.e}</div>}
    </div>
  )
}

export function OrderStep({ step, onResult }) {
  const pool = useMemo(() => {
    let s = shuffle(step.items.map((_, i) => i))
    // Never start already solved.
    if (s.every((v, i) => v === i)) s = [...s.slice(1), s[0]]
    return s
  }, [step])
  const [answer, setAnswer] = useState([])
  const [checked, setChecked] = useState(false)
  const left = pool.filter((i) => !answer.includes(i))
  const ok = answer.every((v, i) => v === i)

  const check = () => {
    setChecked(true)
    onResult(ok)
  }

  return (
    <div>
      <h2>{step.q}</h2>
      <p className="muted small">Spied vienumus pareizajā secībā. Spied atkārtoti, lai noņemtu.</p>
      <ol className="order-answer">
        {answer.map((i, pos) => (
          <li key={i}>
            <button
              className={`chip-btn ${checked ? (i === pos ? 'right' : 'wrong') : 'placed'}`}
              onClick={() => !checked && setAnswer(answer.filter((x) => x !== i))}
            >
              {step.items[i]}
            </button>
          </li>
        ))}
        {!checked && left.length > 0 && <li className="slot muted small">{answer.length + 1}. ?</li>}
      </ol>
      {!checked && (
        <div className="chip-pool">
          {left.map((i) => (
            <button key={i} className="chip-btn" onClick={() => setAnswer([...answer, i])}>{step.items[i]}</button>
          ))}
        </div>
      )}
      {!checked && (
        <div className="row end">
          <button className="primary" disabled={left.length > 0} onClick={check}>Pārbaudīt</button>
        </div>
      )}
      {checked && (
        <div className={`feedback ${ok ? 'ok' : 'bad'}`}>
          <strong>{ok ? 'Pareizi!' : 'Pareizā secība:'}</strong>
          {!ok && <div>{step.items.join(' → ')}</div>}
        </div>
      )}
    </div>
  )
}

export function MatchStep({ step, onResult }) {
  const right = useMemo(() => shuffle(step.pairs.map((_, i) => i)), [step])
  const [sel, setSel] = useState(null)
  const [done, setDone] = useState([])
  const [wrong, setWrong] = useState(null)
  const [mistakes, setMistakes] = useState(0)

  const pickRight = (j) => {
    if (sel === null || done.includes(j)) return
    if (sel === j) {
      const next = [...done, j]
      setDone(next)
      setSel(null)
      if (next.length === step.pairs.length) onResult(mistakes === 0)
    } else {
      setMistakes((m) => m + 1)
      setWrong(j)
      setTimeout(() => setWrong(null), 450)
    }
  }

  return (
    <div>
      <h2>{step.q}</h2>
      <p className="muted small">Izvēlies kreisajā pusē, tad atbilstošo labajā.</p>
      <div className="match">
        <div className="match-col">
          {step.pairs.map((p, i) => (
            <button
              key={i}
              className={`chip-btn ${done.includes(i) ? 'right' : sel === i ? 'placed' : ''}`}
              disabled={done.includes(i)}
              onClick={() => setSel(i)}
            >
              {p[0]}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((j) => (
            <button
              key={j}
              className={`chip-btn ${done.includes(j) ? 'right' : wrong === j ? 'wrong shake' : ''}`}
              disabled={done.includes(j)}
              onClick={() => pickRight(j)}
            >
              {step.pairs[j][1]}
            </button>
          ))}
        </div>
      </div>
      {done.length === step.pairs.length && (
        <div className={`feedback ${mistakes === 0 ? 'ok' : 'bad'}`}>
          {mistakes === 0 ? 'Visi pāri pareizi ar pirmo reizi!' : `Gatavs. Kļūdas: ${mistakes}.`}
        </div>
      )}
    </div>
  )
}

export function SortStep({ step, onResult }) {
  const items = useMemo(() => shuffle(step.items.map((_, i) => i)), [step])
  const [answers, setAnswers] = useState({})
  const [mistakes, setMistakes] = useState(0)

  const put = (i, b) => {
    if (i in answers) return
    const next = { ...answers, [i]: b }
    const miss = mistakes + (step.items[i][1] === b ? 0 : 1)
    setAnswers(next)
    setMistakes(miss)
    if (Object.keys(next).length === step.items.length) onResult(miss === 0)
  }

  return (
    <div>
      <h2>{step.q}</h2>
      <div className="sort-list">
        {items.map((i) => {
          const [text, correct] = step.items[i]
          const a = answers[i]
          return (
            <div key={i} className={`sort-item ${a === undefined ? '' : a === correct ? 'right' : 'wrong'}`}>
              <span>{text}</span>
              <div className="sort-btns">
                {step.buckets.map((b, bi) => (
                  <button
                    key={b}
                    className={a === undefined ? '' : bi === correct ? 'is-right' : bi === a ? 'is-wrong' : 'is-dim'}
                    onClick={() => put(i, bi)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {Object.keys(answers).length === step.items.length && (
        <div className={`feedback ${mistakes === 0 ? 'ok' : 'bad'}`}>
          {mistakes === 0 ? 'Viss pareizi!' : `Gatavs. Kļūdas: ${mistakes}. Sarkanās rindas parāda pareizo atbildi.`}
        </div>
      )}
    </div>
  )
}

/** Message sequence diagram: pick the next message, arrows appear between the actors. */
export function FlowStep({ step, onResult }) {
  const chips = useMemo(() => shuffle(step.steps.map((s, i) => ({ i, m: s.m }))), [step])
  const [placed, setPlaced] = useState(0)
  const [used, setUsed] = useState([])
  const [wrong, setWrong] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const n = step.actors.length

  const pick = (c) => {
    if (placed >= step.steps.length || used.includes(c.i)) return
    if (c.m === step.steps[placed].m) {
      const next = placed + 1
      setUsed([...used, c.i])
      setPlaced(next)
      if (next === step.steps.length) onResult(mistakes === 0)
    } else {
      setMistakes((m) => m + 1)
      setWrong(c.i)
      setTimeout(() => setWrong(null), 450)
    }
  }

  return (
    <div>
      <h2>{step.h}</h2>
      <p className="muted small">Izvēlies, kas notiek tālāk.</p>
      <div className="flow" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {step.actors.map((a) => <div key={a} className="flow-actor">{a}</div>)}
        {step.steps.slice(0, placed).map((s, i) => {
          const lo = Math.min(s.f, s.to)
          const hi = Math.max(s.f, s.to)
          const self = s.f === s.to
          return (
            <div key={i} className={`flow-row ${self ? 'self' : s.to > s.f ? 'right' : 'left'}`} style={{ gridColumn: `${lo + 1} / ${hi + 2}`, gridRow: i + 2 }}>
              <div className="flow-label">{s.m}</div>
              {!self && <div className="flow-arrow" />}
              {s.n && <div className="flow-note">{s.n}</div>}
            </div>
          )
        })}
      </div>
      {placed < step.steps.length ? (
        <div className="chip-pool">
          {chips.filter((c) => !used.includes(c.i)).map((c) => (
            <button key={c.i} className={`chip-btn ${wrong === c.i ? 'wrong shake' : ''}`} onClick={() => pick(c)}>{c.m}</button>
          ))}
        </div>
      ) : (
        <div className={`feedback ${mistakes === 0 ? 'ok' : 'bad'}`}>{mistakes === 0 ? 'Pareizi!' : `Gatavs. Kļūdas: ${mistakes}.`}</div>
      )}
    </div>
  )
}
