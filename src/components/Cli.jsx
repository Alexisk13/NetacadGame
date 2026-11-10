import { useEffect, useRef, useState } from 'react'

/*
 * Small Cisco IOS simulator for the lab exam: switch basic configuration.
 * Supports keyword abbreviations (en, conf t, int vlan 1, copy run start, sh ip int br) and "?".
 */

const MODE_SUFFIX = { user: '>', priv: '#', config: '(config)#', line: '(config-line)#', if: '(config-if)#' }
const MODE_NAME = { user: 'User EXEC', priv: 'Privileged EXEC', config: 'Global config', line: 'Line config', if: 'Interface config' }
const A = '<arg>'
const REST = '<rest>'

// Command definitions per mode: keywords (prefix-matched), then handler.
const COMMANDS = {
  user: [
    [['enable'], (s) => ({ mode: 'priv' })],
    [['ping', A], (s, a) => ({ out: ping(s, a[0]) })],
    [['show', 'version'], () => ({ out: VERSION })],
    [['exit'], () => ({ out: '\nSW con0 is now available\n\nPress RETURN to get started.', mode: 'user' })],
  ],
  priv: [
    [['configure', 'terminal'], () => ({ out: 'Enter configuration commands, one per line.  End with CNTL/Z.', mode: 'config' })],
    [['copy', 'running-config', 'startup-config'], (s) => ({ out: 'Destination filename [startup-config]?\nBuilding configuration...\n[OK]', set: { saved: snapshot(s) } })],
    [['show', 'running-config'], (s) => ({ out: runningConfig(s) })],
    [['show', 'ip', 'interface', 'brief'], (s) => ({ out: ipBrief(s) })],
    [['show', 'version'], () => ({ out: VERSION })],
    [['ping', A], (s, a) => ({ out: ping(s, a[0]) })],
    [['disable'], () => ({ mode: 'user' })],
    [['exit'], () => ({ mode: 'user', out: '\nSW con0 is now available\n\nPress RETURN to get started.' })],
  ],
  config: [
    [['hostname', A], (s, a) => (validHostname(a[0]) ? { set: { hostname: a[0] } } : { out: '% Hostname contains invalid characters or does not start with a letter' })],
    [['line', 'console', '0'], () => ({ mode: 'line', set: { line: 'con' } })],
    [['line', 'vty', '0', '15'], () => ({ mode: 'line', set: { line: 'vty' } })],
    [['enable', 'secret', A], (s, a) => ({ set: { enableSecret: a[0] } })],
    [['enable', 'password', A], (s, a) => ({ set: { enablePassword: a[0] } })],
    [['service', 'password-encryption'], () => ({ set: { encryption: true } })],
    [['banner', 'motd', REST], (s, a) => banner(a[0])],
    [['interface', REST], (s, a) => iface(a[0])],
    [['ip', 'default-gateway', A], (s, a) => ({ set: { gateway: a[0] } })],
    [['exit'], () => ({ mode: 'priv' })],
    [['end'], () => ({ mode: 'priv' })],
  ],
  line: [
    [['password', A], (s, a) => ({ set: { [`${s.line}Pw`]: a[0] } })],
    [['login'], (s) => ({ set: { [`${s.line}Login`]: true } })],
    [['transport', 'input', 'ssh'], () => ({})],
    [['exit'], () => ({ mode: 'config' })],
    [['end'], () => ({ mode: 'priv' })],
  ],
  if: [
    [['ip', 'address', A, A], (s, a) => ipAddress(a[0], a[1])],
    [['no', 'shutdown'], () => ({ set: { sviUp: true }, out: '%LINK-5-CHANGED: Interface Vlan1, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan1, changed state to up' })],
    [['shutdown'], () => ({ set: { sviUp: false } })],
    [['description', REST], () => ({})],
    [['exit'], () => ({ mode: 'config' })],
    [['end'], () => ({ mode: 'priv' })],
  ],
}

const VERSION = 'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE4\nROM: Bootstrap program is C2960 boot loader\n\n64K bytes of flash-simulated non-volatile configuration memory.'

const validHostname = (h) => /^[A-Za-z]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(h)
const isIp = (v) => /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(v) && v.split('.').every((o) => Number(o) <= 255)

function banner(text) {
  const t = text.trim()
  const d = t[0]
  if (!t || t.length < 3 || t.lastIndexOf(d) === 0) return { out: '% Banner jāieliek starp diviem vienādiem atdalītājiem, piem. #Teksts#' }
  return { set: { banner: t.slice(1, t.lastIndexOf(d)) } }
}

function iface(rest) {
  const name = rest.replace(/\s+/g, '').toLowerCase()
  if (/^v(l(a(n)?)?)?1$/.test(name)) return { mode: 'if', set: { iface: 'Vlan1' } }
  if (/^(f|fa|fastethernet|g|gi|gigabitethernet)\d+\/\d+$/.test(name)) return { mode: 'if', set: { iface: name } }
  return { out: '% Invalid input detected.' }
}

function ipAddress(ip, mask) {
  if (!isIp(ip) || !isIp(mask)) return { out: '% Invalid input detected.' }
  return { set: { ip, mask } }
}

const CONFIG_KEYS = ['hostname', 'conPw', 'conLogin', 'vtyPw', 'vtyLogin', 'enableSecret', 'enablePassword', 'encryption', 'banner', 'ip', 'mask', 'sviUp', 'gateway']
/** Only the configuration (what copy running-config startup-config would store). */
const snapshot = (s) => JSON.stringify(CONFIG_KEYS.map((k) => s[k] ?? null))

function runningConfig(s) {
  const lines = ['Building configuration...', '', 'Current configuration:', '!', s.encryption ? 'service password-encryption' : 'no service password-encryption', '!', `hostname ${s.hostname}`, '!']
  if (s.enableSecret) lines.push('enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0')
  if (s.enablePassword) lines.push(`enable password ${s.encryption ? '7 0822455D0A16' : s.enablePassword}`)
  lines.push('!', 'interface Vlan1', s.ip ? ` ip address ${s.ip} ${s.mask}` : ' no ip address', s.sviUp ? '' : ' shutdown', '!')
  if (s.gateway) lines.push(`ip default-gateway ${s.gateway}`, '!')
  if (s.banner) lines.push(`banner motd ^C${s.banner}^C`, '!')
  lines.push('line con 0')
  if (s.conPw) lines.push(` password ${s.encryption ? '7 0822455D0A16' : s.conPw}`)
  if (s.conLogin) lines.push(' login')
  lines.push('!', 'line vty 0 15')
  if (s.vtyPw) lines.push(` password ${s.encryption ? '7 0822455D0A16' : s.vtyPw}`)
  if (s.vtyLogin) lines.push(' login')
  lines.push('!', 'end')
  return lines.filter((l, i) => l !== '' || i < 3).join('\n')
}

function ipBrief(s) {
  const up = s.sviUp && s.ip
  const row = (n, ip, st, pr) => `${n.padEnd(23)}${ip.padEnd(16)}YES manual ${st.padEnd(22)}${pr}`
  return [
    'Interface              IP-Address      OK? Method Status                Protocol',
    row('FastEthernet0/1', 'unassigned', 'up', 'up'),
    row('FastEthernet0/2', 'unassigned', 'down', 'down'),
    row('Vlan1', s.ip || 'unassigned', s.sviUp ? 'up' : 'administratively down', up ? 'up' : 'down'),
  ].join('\n')
}

function ping(s, target) {
  if (!isIp(target)) return '% Unrecognized host or address.'
  const head = `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:`
  const sameNet = s.ip && s.mask === '255.255.255.0' && s.ip.split('.').slice(0, 3).join('.') === target.split('.').slice(0, 3).join('.')
  if (s.sviUp && s.ip && sameNet && target !== s.ip) return `${head}\n.!!!!\nSuccess rate is 80 percent (4/5), round-trip min/avg/max = 1/1/3 ms\n(Pirmais "." ir ARP: komutators vēl nezināja datora MAC.)`
  return `${head}\n.....\nSuccess rate is 0 percent (0/5)`
}

/** Matches input tokens against a mode's command definitions with prefix abbreviations. */
function parse(mode, input) {
  const tokens = input.trim().split(/\s+/)
  const defs = COMMANDS[mode]
  let incomplete = false
  const candidates = []
  for (const [kw, fn] of defs) {
    const args = []
    let ok = true
    let ti = 0
    for (let k = 0; k < kw.length; k++) {
      const want = kw[k]
      if (want === REST) {
        if (ti >= tokens.length) { incomplete = true; ok = false; break }
        // Keep the original spacing (banners).
        args.push(input.slice(nthTokenIndex(input, ti)).trim())
        ti = tokens.length
        break
      }
      const tok = tokens[ti]
      if (tok === undefined) { if (k > 0) incomplete = true; ok = false; break }
      if (want === A) { args.push(tok); ti++; continue }
      if (!want.startsWith(tok.toLowerCase())) { ok = false; break }
      ti++
    }
    if (ok && ti === tokens.length) candidates.push([kw, fn, args])
  }
  if (candidates.length) return { match: candidates[0] }
  return { error: incomplete ? '% Incomplete command.' : 'invalid' }
}

function nthTokenIndex(input, n) {
  const re = /\S+/g
  let m
  let i = 0
  while ((m = re.exec(input))) {
    if (i === n) return m.index
    i++
  }
  return input.length
}

function help(mode) {
  const seen = new Set()
  return COMMANDS[mode]
    .map(([kw]) => kw.filter((k) => k !== A && k !== REST).join(' '))
    .filter((k) => (seen.has(k) ? false : seen.add(k)))
    .map((k) => `  ${k}`)
    .join('\n')
}

export const LAB_TASKS = [
  { text: 'Ieej privileged EXEC režīmā', hint: 'enable', done: (s) => s.visited.priv },
  { text: 'Ieej globālajā konfigurācijā', hint: 'configure terminal', done: (s) => s.visited.config },
  { text: 'Nomaini hostname', hint: 'hostname SW1', done: (s) => s.hostname !== 'Switch' },
  { text: 'Konsoles parole + login', hint: 'line console 0 → password cisco → login → exit', done: (s) => s.conPw && s.conLogin },
  { text: 'VTY parole + login', hint: 'line vty 0 15 → password cisco → login → exit', done: (s) => s.vtyPw && s.vtyLogin },
  { text: 'Šifrēta enable parole', hint: 'enable secret class', done: (s) => s.enableSecret },
  { text: 'Šifrē visas paroles', hint: 'service password-encryption', done: (s) => s.encryption },
  { text: 'Banneris', hint: 'banner motd #Tikai autorizetiem!#', done: (s) => s.banner },
  { text: 'SVI IP adrese', hint: 'interface vlan 1 → ip address 192.168.1.2 255.255.255.0', done: (s) => s.ip },
  { text: 'Ieslēdz SVI', hint: 'no shutdown', done: (s) => s.sviUp },
  { text: 'Atgriezies uz Switch# un saglabā', hint: 'end → copy running-config startup-config', done: (s) => s.saved && s.saved === snapshot(s) },
  { text: 'Pārbaudi ar ping datoru', hint: 'ping 192.168.1.10', done: (s) => s.pinged },
]

export const INITIAL = { mode: 'user', hostname: 'Switch', visited: {} }
export const promptOf = (s) => `${s.hostname}${MODE_SUFFIX[s.mode]}`

/** Pure command execution: returns the next state and the lines to print. */
export function runCommand(s, raw) {
  const prompt = promptOf(s)
  const out = [`${prompt} ${raw}`]
  const cmd = raw.trim()
  let next = s
  if (cmd === '') return { next, out }
  if (cmd.endsWith('?')) {
    out.push(`${MODE_NAME[s.mode]} komandas:`, help(s.mode))
    return { next, out }
  }
  const r = parse(s.mode, cmd)
  if (r.error === 'invalid') {
    out.push(`${' '.repeat(prompt.length + 1)}^`, "% Invalid input detected at '^' marker.")
    const hint = typoHint(cmd, s.mode)
    if (hint) out.push(`(Padoms: ${hint})`)
  } else if (r.error) {
    out.push(r.error)
  } else {
    const [kw, fn, args] = r.match
    const res = fn(s, args) || {}
    next = { ...s, ...(res.set || {}) }
    if (res.mode) next.mode = res.mode
    next.visited = { ...s.visited, [next.mode]: true }
    if (kw[0] === 'ping' && res.out && res.out.includes('!!!!')) next.pinged = true
    if (res.out) out.push(res.out)
  }
  return { next, out }
}

export default function Cli({ onResult, compact }) {
  const [s, setS] = useState(INITIAL)
  const [lines, setLines] = useState(['Switch con0 is now available', '', 'Press RETURN to get started.', ''])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState({ list: [], pos: -1 })
  const [showHints, setShowHints] = useState(false)
  const [reported, setReported] = useState(false)
  const screen = useRef(null)
  const inputRef = useRef(null)

  const prompt = `${s.hostname}${MODE_SUFFIX[s.mode]}`
  const tasks = LAB_TASKS.map((t) => ({ ...t, ok: Boolean(t.done(s)) }))
  const allDone = tasks.every((t) => t.ok)
  const nextTask = tasks.find((t) => !t.ok)

  useEffect(() => { screen.current?.scrollTo(0, screen.current.scrollHeight) }, [lines])
  useEffect(() => {
    if (allDone && !reported) {
      setReported(true)
      onResult?.(true)
    }
  }, [allDone, reported, onResult])

  const run = (raw) => {
    const { next, out } = runCommand(s, raw)
    setS(next)
    setLines((l) => [...l, ...out].slice(-300))
    if (raw.trim()) setHist((h) => ({ list: [...h.list, raw.trim()], pos: -1 }))
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp' && hist.list.length) {
      e.preventDefault()
      const pos = hist.pos < 0 ? hist.list.length - 1 : Math.max(0, hist.pos - 1)
      setHist({ ...hist, pos })
      setInput(hist.list[pos])
    } else if (e.key === 'ArrowDown' && hist.pos >= 0) {
      e.preventDefault()
      const pos = hist.pos + 1
      setHist({ ...hist, pos: pos >= hist.list.length ? -1 : pos })
      setInput(pos >= hist.list.length ? '' : hist.list[pos])
    }
  }

  const reset = () => {
    setS(INITIAL)
    setLines(['Switch con0 is now available', '', 'Press RETURN to get started.', ''])
    setReported(false)
  }

  return (
    <div className={`cli-wrap ${compact ? 'compact' : ''}`}>
      <div className="cli-main">
        <div className="cli-screen" ref={screen} onClick={() => inputRef.current?.focus()}>
          {lines.map((l, i) => <div key={i}>{l || ' '}</div>)}
          <div className="cli-input-line">
            <span>{prompt}&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              aria-label="IOS komanda"
            />
          </div>
        </div>
        <div className="row">
          <span className="pill">{MODE_NAME[s.mode]}</span>
          <button className="link" onClick={reset}>Sākt no jauna</button>
          <span className="muted small">? parāda komandas, bultiņa uz augšu atkārto iepriekšējo.</span>
        </div>
      </div>
      <div className="cli-tasks">
        <div className="row spread" style={{ marginTop: 0 }}>
          <strong>Uzdevumi {tasks.filter((t) => t.ok).length}/{tasks.length}</strong>
          <label className="toggle" style={{ marginTop: 0 }}>
            <input type="checkbox" checked={showHints} onChange={(e) => setShowHints(e.target.checked)} /> Padomi
          </label>
        </div>
        <ul className="facts">
          {tasks.map((t) => (
            <li key={t.text}>
              <label className={t.ok ? 'done' : t === nextTask ? 'current' : ''}>
                <input type="checkbox" checked={t.ok} readOnly />
                <span>
                  {t.text}
                  {(showHints || t.ok) && <code className="hint-code">{t.hint}</code>}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {allDone && <div className="feedback ok">Laboratorijas darbs izpildīts! Tieši tā tas jādara eksāmenā.</div>}
      </div>
    </div>
  )
}

/** Friendly hints for the mistakes classmates actually made. */
function typoHint(cmd, mode) {
  const c = cmd.toLowerCase()
  if (/^host\s+name/.test(c)) return 'hostname ir viens vārds'
  if (/^banner\s+mo\s/.test(c)) return 'banner motd ir viens vārds: banner motd #teksts#'
  if (mode === 'user' && /^(conf|hostname|line|interface)/.test(c)) return 'vispirms enable'
  if (mode === 'priv' && /^(hostname|line|interface|enable secret|service|banner)/.test(c)) return 'vispirms configure terminal'
  if (mode === 'config' && /^(password|login|ip address|no shut)/.test(c)) return 'šī komanda der līnijas vai interfeisa režīmā'
  if (mode !== 'priv' && /^copy/.test(c)) return 'saglabā no Switch# režīma (end, tad copy)'
  return ''
}
