import { useMemo, useState } from 'react'
import { shuffle } from '../lib/srs'

/* Interactive mini-labs used inside lessons. Each calls onResult(noMistakes) once when finished. */

const BITS = [128, 64, 32, 16, 8, 4, 2, 1]
const hex2 = (n) => n.toString(16).toUpperCase().padStart(2, '0')

export function BinaryWidget({ step, onResult }) {
  const [bits, setBits] = useState(0)
  const [round, setRound] = useState(0)
  const targets = step.targets
  const target = targets[round]
  const solved = round >= targets.length

  const toggle = (v) => {
    if (solved) return
    const next = bits ^ v
    setBits(next)
    if (next === target) {
      setTimeout(() => {
        setBits(0)
        setRound((r) => {
          if (r + 1 >= targets.length) onResult(true)
          return r + 1
        })
      }, 700)
    }
  }

  return (
    <div>
      <h2>{step.h}</h2>
      {!solved ? (
        <p>Ieslēdz bitus, lai iegūtu <strong className="accent">{target}</strong> ({round + 1}/{targets.length})</p>
      ) : (
        <p className="ok-text">Visi skaitļi salikti!</p>
      )}
      <div className="bits">
        {BITS.map((v) => (
          <button key={v} className={`bit ${bits & v ? 'on' : ''}`} onClick={() => toggle(v)}>
            <span className="bit-val">{bits & v ? 1 : 0}</span>
            <span className="bit-w">{v}</span>
          </button>
        ))}
      </div>
      <div className={`bit-out ${bits === target ? 'hit' : ''}`}>
        <div><small>Decimāli</small><strong>{bits}</strong></div>
        <div><small>Binārā</small><strong>{bits.toString(2).padStart(8, '0')}</strong></div>
        <div><small>Hex</small><strong>0x{hex2(bits)}</strong></div>
      </div>
      <p className="muted small">Atņemšanas metode: sāc ar 128. Ja skaitlis ir lielāks vai vienāds, ieslēdz bitu un atņem.</p>
    </div>
  )
}

function makeSubnet() {
  const prefix = shuffle([24, 25, 26, 27, 28, 29, 30])[0]
  const block = 2 ** (32 - prefix)
  const base = shuffle(['192.168.1', '192.168.10', '10.0.5', '172.16.20'])[0]
  const last = 1 + Math.floor(Math.random() * 253)
  const net = Math.floor(last / block) * block
  return {
    ip: `${base}.${last}`,
    prefix,
    mask: `255.255.255.${(256 - block) % 256}`,
    net: `${base}.${net}`,
    bc: `${base}.${net + block - 1}`,
    hosts: String(block - 2),
    block,
  }
}

export function SubnetWidget({ step, onResult }) {
  const ROUNDS = 2
  const [q, setQ] = useState(makeSubnet)
  const [round, setRound] = useState(1)
  const [vals, setVals] = useState({ net: '', bc: '', hosts: '' })
  const [checked, setChecked] = useState(false)
  const [allOk, setAllOk] = useState(true)
  const [finished, setFinished] = useState(false)

  const fields = [['net', 'Tīkla adrese'], ['bc', 'Apraides adrese'], ['hosts', 'Hostu skaits']]
  const isOk = (k) => vals[k].trim() === q[k]
  const check = () => {
    setChecked(true)
    if (!fields.every(([k]) => isOk(k))) setAllOk(false)
  }
  const next = () => {
    if (round >= ROUNDS) {
      setFinished(true)
      onResult(allOk && fields.every(([k]) => isOk(k)))
      return
    }
    setQ(makeSubnet())
    setVals({ net: '', bc: '', hosts: '' })
    setChecked(false)
    setRound(round + 1)
  }

  return (
    <div>
      <h2>{step.h}</h2>
      <p>
        Adrese <strong className="accent">{q.ip}/{q.prefix}</strong> <span className="muted">(maska {q.mask})</span>
        <span className="muted small"> {round}/{ROUNDS}</span>
      </p>
      <div className="form-grid">
        {fields.map(([k, label]) => (
          <label key={k}>
            {label}
            <input
              className={checked ? (isOk(k) ? 'in-ok' : 'in-bad') : ''}
              value={vals[k]}
              disabled={checked}
              inputMode={k === 'hosts' ? 'numeric' : 'decimal'}
              onChange={(e) => setVals({ ...vals, [k]: e.target.value })}
            />
            {checked && !isOk(k) && <small className="ok-text">Pareizi: {q[k]}</small>}
          </label>
        ))}
      </div>
      {checked && (
        <div className="feedback">
          Bloka izmērs = 2^{32 - q.prefix} = {q.block}. Tīkli sākas ar {q.block} soli, apraide = nākamais tīkls - 1, hosti = {q.block} - 2.
        </div>
      )}
      {!finished && (
        <div className="row end">
          {!checked
            ? <button className="primary" disabled={fields.some(([k]) => !vals[k].trim())} onClick={check}>Pārbaudīt</button>
            : <button className="primary" onClick={next}>{round >= ROUNDS ? 'Gatavs' : 'Nākamā adrese'}</button>}
        </div>
      )}
    </div>
  )
}

const IPV6_LIST = [
  '2001:0db8:0000:0000:0000:0000:0000:0001',
  'fe80:0000:0000:0000:0a12:00ff:fe34:0001',
  '2001:0db8:0000:1111:0000:0000:0000:0200',
  'ff02:0000:0000:0000:0000:0000:0000:0002',
  '2001:0db8:acad:0001:0000:0000:0000:0010',
  'fe80:0000:0000:0000:0000:0000:0000:0001',
]

export function expand(addr) {
  const s = addr.trim().toLowerCase()
  if (!/^[0-9a-f:]+$/.test(s) || (s.match(/::/g) || []).length > 1) return null
  let parts
  if (s.includes('::')) {
    const [a, b] = s.split('::')
    const left = a ? a.split(':') : []
    const right = b ? b.split(':') : []
    const missing = 8 - left.length - right.length
    if (missing < 1) return null
    parts = [...left, ...Array(missing).fill('0'), ...right]
  } else parts = s.split(':')
  if (parts.length !== 8 || parts.some((p) => p.length < 1 || p.length > 4)) return null
  return parts.map((p) => p.padStart(4, '0')).join(':')
}

export function compress(full) {
  const parts = full.split(':').map((p) => p.replace(/^0+(?=.)/, ''))
  let best = [-1, 0]
  for (let i = 0; i < 8; ) {
    if (parts[i] !== '0') { i++; continue }
    let j = i
    while (j < 8 && parts[j] === '0') j++
    if (j - i > best[1]) best = [i, j - i]
    i = j
  }
  if (best[1] < 2) return parts.join(':')
  const left = parts.slice(0, best[0]).join(':')
  const right = parts.slice(best[0] + best[1]).join(':')
  return `${left}::${right}`
}

export function Ipv6Widget({ step, onResult }) {
  const list = useMemo(() => shuffle(IPV6_LIST).slice(0, 3), [])
  const [round, setRound] = useState(0)
  const [val, setVal] = useState('')
  const [result, setResult] = useState(null) // null | 'ok' | 'bad'
  const [allOk, setAllOk] = useState(true)
  const [finished, setFinished] = useState(false)
  const full = list[round]
  const best = compress(full)

  const check = () => {
    const v = val.trim().toLowerCase()
    const sameAddress = expand(v) === full
    const noLeadingZeros = !v.split(':').some((p) => p.length > 1 && p.startsWith('0'))
    const ok = sameAddress && noLeadingZeros && v.length <= best.length
    setResult(ok ? 'ok' : 'bad')
    if (!ok) setAllOk(false)
  }
  const next = () => {
    if (round + 1 >= list.length) {
      setFinished(true)
      onResult(allOk)
      return
    }
    setRound(round + 1)
    setVal('')
    setResult(null)
  }

  return (
    <div>
      <h2>{step.h}</h2>
      <p className="muted small">Ieraksti īsāko pierakstu. ({round + 1}/{list.length})</p>
      <code className="addr">{full}</code>
      <input
        className={`mono ${result === 'ok' ? 'in-ok' : result === 'bad' ? 'in-bad' : ''}`}
        value={val}
        disabled={result !== null}
        placeholder="piem. 2001:db8::1"
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && val.trim() && result === null && check()}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
      {result && <div className={`feedback ${result}`}>{result === 'ok' ? 'Pareizi!' : 'Ne gluži.'} Īsākais pieraksts: <code>{best}</code></div>}
      {!finished && (
        <div className="row end">
          {result === null
            ? <button className="primary" disabled={!val.trim()} onClick={check}>Pārbaudīt</button>
            : <button className="primary" onClick={next}>{round + 1 >= list.length ? 'Gatavs' : 'Nākamā'}</button>}
        </div>
      )}
    </div>
  )
}

const ENCAP = [
  { layer: 'Transporta', add: '+ TCP galvene (porti, seq)', pdu: 'Segments' },
  { layer: 'Tīkla', add: '+ IP galvene (IP adreses)', pdu: 'Pakete' },
  { layer: 'Datu posma', add: '+ Ethernet galvene (MAC) + FCS', pdu: 'Kadrs' },
  { layer: 'Fiziskais', add: '→ biti vidē', pdu: 'Biti' },
]
const DECAP = ['Ethernet (pārbauda MAC un FCS)', 'IP (vai IP ir mans?)', 'TCP (ports → lietotne)', 'HTTP dati lietotnei']

export function EncapWidget({ step, onResult }) {
  const encOpts = useMemo(() => shuffle(ENCAP.map((_, i) => i)), [])
  const decOpts = useMemo(() => shuffle(DECAP.map((_, i) => i)), [])
  const [enc, setEnc] = useState(0)
  const [dec, setDec] = useState(0)
  const [wrong, setWrong] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const phase = enc < ENCAP.length ? 'enc' : dec < DECAP.length ? 'dec' : 'done'

  const miss = (key) => {
    setMistakes((m) => m + 1)
    setWrong(key)
    setTimeout(() => setWrong(null), 450)
  }
  const pickEnc = (i) => (i === enc ? setEnc(enc + 1) : miss(`e${i}`))
  const pickDec = (i) => {
    if (i !== dec) return miss(`d${i}`)
    setDec(dec + 1)
    if (dec + 1 === DECAP.length) onResult(mistakes === 0)
  }

  // Layers currently wrapped around the data (encapsulated minus removed by the receiver).
  const depth = phase === 'enc' ? enc : Math.max(0, Math.min(3, ENCAP.length - 1) - dec)
  const has = (n) => depth >= n
  const pdu = phase === 'enc' ? (enc ? ENCAP[enc - 1].pdu : 'Dati') : phase === 'dec' ? 'Saņēmējs atver...' : 'Dati nonākuši lietotnē'

  return (
    <div>
      <h2>{step.h}</h2>
      <div className="pdu-name">{pdu}</div>
      <div className={`envelope ${phase === 'enc' && enc === 4 ? 'bits' : ''}`}>
        {phase === 'enc' && enc === 4 ? (
          <span className="mono">0110 1001 0101 0011 1100 ...</span>
        ) : (
          <>
            {has(3) && <span className="seg eth">Ethernet</span>}
            {has(2) && <span className="seg ip">IP</span>}
            {has(1) && <span className="seg tcp">TCP</span>}
            <span className="seg data">HTTP dati</span>
            {has(3) && <span className="seg eth">FCS</span>}
          </>
        )}
      </div>
      {phase === 'enc' && (
        <>
          <p>Sūtītājs: kurš slānis strādā nākamais?</p>
          <div className="chip-pool">
            {encOpts.filter((i) => i >= enc).map((i) => (
              <button key={i} className={`chip-btn ${wrong === `e${i}` ? 'wrong shake' : ''}`} onClick={() => pickEnc(i)}>
                <strong>{ENCAP[i].layer}</strong>&nbsp;{ENCAP[i].add}
              </button>
            ))}
          </div>
        </>
      )}
      {phase === 'dec' && (
        <>
          <p>Saņēmējs: ko apstrādā nākamo?</p>
          <div className="chip-pool">
            {decOpts.filter((i) => i >= dec).map((i) => (
              <button key={i} className={`chip-btn ${wrong === `d${i}` ? 'wrong shake' : ''}`} onClick={() => pickDec(i)}>{DECAP[i]}</button>
            ))}
          </div>
        </>
      )}
      {phase === 'done' && <div className={`feedback ${mistakes ? 'bad' : 'ok'}`}>{mistakes ? `Gatavs. Kļūdas: ${mistakes}.` : 'Ideāli! Iekapsulēts un atvērts pareizā secībā.'}</div>}
    </div>
  )
}

const PCS = [
  { name: 'PC1', mac: 'AA', port: 1 },
  { name: 'PC2', mac: 'BB', port: 2 },
  { name: 'PC3', mac: 'CC', port: 3 },
  { name: 'PC4', mac: 'DD', port: 4 },
]
const EVENTS = [
  { from: 0, to: 2, label: 'PC1 → PC3', why: 'Tabula ir tukša: PC3 MAC nav zināms, tāpēc pārpludina. Iemācās AA = ports 1.' },
  { from: 2, to: 0, label: 'PC3 → PC1 (atbilde)', why: 'AA jau ir tabulā (ports 1): sūta tikai tur. Iemācās CC = ports 3.' },
  { from: 1, to: 'bc', label: 'PC2 → FF-FF-FF-FF-FF-FF (ARP apraide)', why: 'Apraidi vienmēr pārpludina visos portos, izņemot ienākošo. Iemācās BB = ports 2.' },
  { from: 3, to: 1, label: 'PC4 → PC2', why: 'BB ir tabulā (ports 2): tikai uz portu 2. Iemācās DD = ports 4.' },
  { from: 0, to: 3, label: 'PC1 → PC4', why: 'DD ir tabulā (ports 4): tikai uz portu 4. AA taimeris tiek atjaunots.' },
]

function outPorts(ev, table) {
  const src = PCS[ev.from].port
  if (ev.to !== 'bc') {
    const known = table.find((r) => r.mac === PCS[ev.to].mac)
    if (known) return [known.port]
  }
  return PCS.map((p) => p.port).filter((p) => p !== src)
}
const describe = (ports) => (ports.length === 1 ? `Tikai uz portu ${ports[0]}` : `Pārpludina: porti ${ports.join(', ')}`)

export function MacTableWidget({ step, onResult }) {
  const [idx, setIdx] = useState(0)
  const [table, setTable] = useState([])
  const [answer, setAnswer] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const ev = EVENTS[idx]
  const finished = idx >= EVENTS.length

  const options = useMemo(() => {
    if (!ev) return []
    const src = PCS[ev.from].port
    const right = describe(outPorts(ev, table))
    const flood = describe(PCS.map((p) => p.port).filter((p) => p !== src))
    const single = ev.to === 'bc' ? 'Tikai uz portu 1' : `Tikai uz portu ${PCS[ev.to].port}`
    return shuffle([...new Set([right, flood, single, 'Atmet kadru'])])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const correct = ev ? describe(outPorts(ev, table)) : ''
  const lit = answer ? outPorts(ev, table) : []

  const choose = (o) => {
    if (answer) return
    setAnswer(o)
    if (o !== correct) setMistakes((m) => m + 1)
  }
  const next = () => {
    const src = PCS[ev.from]
    setTable((t) => (t.some((r) => r.mac === src.mac) ? t : [...t, { mac: src.mac, port: src.port }]))
    setAnswer(null)
    if (idx + 1 >= EVENTS.length) onResult(mistakes === 0)
    setIdx(idx + 1)
  }

  return (
    <div>
      <h2>{step.h}</h2>
      <div className="sw-lab">
        <div className="sw-box">
          <div className="sw-title">Komutators</div>
          <div className="sw-ports">
            {PCS.map((p) => (
              <div key={p.port} className={`sw-port ${answer && ev && PCS[ev.from].port === p.port ? 'src' : ''} ${lit.includes(p.port) ? 'out' : ''}`}>
                <span>Fa0/{p.port}</span>
                <small>{p.name} ({p.mac})</small>
              </div>
            ))}
          </div>
        </div>
        <table className="tbl mac-tbl">
          <thead><tr><th>MAC</th><th>Ports</th></tr></thead>
          <tbody>
            {table.length === 0 && <tr><td colSpan="2" className="muted small">tukša</td></tr>}
            {table.map((r) => <tr key={r.mac}><td>{r.mac}</td><td>{r.port}</td></tr>)}
          </tbody>
        </table>
      </div>
      {!finished && (
        <>
          <p>Kadrs: <strong>{ev.label}</strong> ({idx + 1}/{EVENTS.length}). Ko darīs komutators?</p>
          <div className="options">
            {options.map((o) => (
              <button key={o} className={`option ${answer ? (o === correct ? 'right' : o === answer ? 'wrong' : 'dim') : ''}`} onClick={() => choose(o)}>{o}</button>
            ))}
          </div>
          {answer && (
            <>
              <div className={`feedback ${answer === correct ? 'ok' : 'bad'}`}>{ev.why}</div>
              <div className="row end"><button className="primary" onClick={next}>{idx + 1 >= EVENTS.length ? 'Gatavs' : 'Nākamais kadrs'}</button></div>
            </>
          )}
        </>
      )}
      {finished && <div className="feedback ok">Tabula ir pilna: tagad komutators sūta katru kadru tikai uz vajadzīgo portu.</div>}
    </div>
  )
}
