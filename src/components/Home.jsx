import { TOPICS, CARDS, QUESTIONS, ALL_ITEMS } from '../lib/data'
import { counts } from '../lib/srs'
import { streak } from '../lib/store'

export default function Home({ name, progress, go, reset, openLesson }) {
  const { srs, stats, tickets } = progress
  const all = counts(ALL_ITEMS, srs)
  const cards = counts(CARDS, srs)
  const quiz = counts(QUESTIONS, srs)
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0
  const ticketsDone = Object.keys(tickets).length
  const lessonsDone = Object.keys(progress.lessons || {}).length

  return (
    <div className="stack">
      <section className="hero">
        <h1>Sveiks, {name}!</h1>
        <p className="muted">Atkārto katru dienu: kļūdainās atbildes atgriežas biežāk, zināmās retāk.</p>
        <div className="stats">
          <Stat label="Dienas pēc kārtas" value={streak(stats.days)} />
          <Stat label="Apgūts" value={`${Math.round(all.mastery * 100)}%`} />
          <Stat label="Precizitāte" value={`${accuracy}%`} />
          <Stat label="Biļetes izrunātas" value={`${ticketsDone}/18`} />
        </div>
      </section>

      <section className="modes">
        <Mode title="Mācības" desc="Īsi soļi ar uzdevumiem un mini laboratorijām. Sāc šeit, ja tēma ir jauna." note={`${lessonsDone}/18 pabeigtas`} onClick={() => go('learn')} />
        <Mode title="Viktorīna" desc="NetAcad stila jautājumi ar vienu vai vairākām pareizām atbildēm." due={quiz.due} fresh={quiz.fresh} onClick={() => go('quiz')} />
        <Mode title="Kartītes" desc="Porti, PDU, slāņi, IOS režīmi, adreses. Pagriez un novērtē sevi." due={cards.due} fresh={cards.fresh} onClick={() => go('cards')} />
        <Mode title="Biļetes" desc="Izlozē eksāmena biļeti un runā 5 minūtes ar plānu un faktu sarakstu." onClick={() => go('tickets')} />
      </section>

      <section className="card">
        <h2>Tēmas</h2>
        <div className="topics">
          {TOPICS.map((t) => {
            const items = ALL_ITEMS.filter((i) => i.t === t.id)
            const c = counts(items, srs)
            const tk = tickets[t.id]
            return (
              <div className="topic-row" key={t.id}>
                <div className="topic-name">
                  <span>{t.id ? `${t.id}. ` : ''}{t.title.replace(/\.$/, '')}</span>
                  <small className="muted">
                    {c.due > 0 ? `${c.due} jāatkārto` : 'nav jāatkārto'}, {c.fresh} jauni
                    {tk ? `, runāts ${tk.n}x (${tk.last}%)` : ''}
                  </small>
                </div>
                <div className="bar"><div style={{ width: `${Math.round(c.mastery * 100)}%` }} /></div>
                <div className="topic-actions">
                  {t.id > 0 && <button onClick={() => openLesson(t.id)}>Mācība</button>}
                  <button onClick={() => go('quiz', [t.id])}>Viktorīna</button>
                  <button onClick={() => go('cards', [t.id])}>Kartītes</button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <p className="center">
        <button className="link danger" onClick={() => { if (confirm('Dzēst visu savu progresu? To nevar atsaukt.')) reset() }}>
          Dzēst manu progresu
        </button>
      </p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function Mode({ title, desc, due, fresh, note, onClick }) {
  return (
    <button className="mode card" onClick={onClick}>
      <h3>{title}</h3>
      <p className="muted">{desc}</p>
      {note && <div className="pills"><span className="pill ok">{note}</span></div>}
      {due !== undefined && (
        <div className="pills">
          <span className="pill warn">{due} jāatkārto</span>
          <span className="pill">{fresh} jauni</span>
        </div>
      )}
    </button>
  )
}
