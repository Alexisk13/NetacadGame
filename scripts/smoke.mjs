// Smoke test: renders every lesson step, runs the lab exam through the CLI simulator,
// and checks the IPv6 helpers. Run with: npm test
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

// Minimal browser globals for modules that read the URL at import time.
globalThis.window ??= { location: { hash: '', origin: 'http://localhost', pathname: '/' } }

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const load = (p) => server.ssrLoadModule(p)
let failures = 0
const check = (name, ok, extra = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${extra ? `  ${extra}` : ''}`)
}

try {
  const { LESSONS } = await load('/src/lib/data.js')
  const steps = await load('/src/components/steps.jsx')
  const widgets = await load('/src/components/widgets.jsx')
  const cli = await load('/src/components/Cli.jsx')

  // 1. Every lesson step renders without throwing.
  const STEP = { info: steps.InfoStep, life: steps.LifeStep, mcq: steps.McqStep, order: steps.OrderStep, match: steps.MatchStep, sort: steps.SortStep, flow: steps.FlowStep }
  const WIDGET = { binary: widgets.BinaryWidget, subnet: widgets.SubnetWidget, ipv6: widgets.Ipv6Widget, encap: widgets.EncapWidget, mactable: widgets.MacTableWidget, cli: cli.default }
  let rendered = 0
  for (const lesson of LESSONS) {
    for (const [i, step] of lesson.steps.entries()) {
      const Comp = step.k === 'widget' ? WIDGET[step.w] : STEP[step.k]
      try {
        if (!Comp) throw new Error(`unknown step ${step.k}/${step.w}`)
        renderToString(createElement(Comp, { step, onResult: () => {} }))
        rendered++
      } catch (e) {
        check(`lesson ${lesson.t} step ${i + 1}`, false, e.message)
      }
    }
  }
  check(`rendered ${rendered} lesson steps`, rendered === LESSONS.reduce((n, l) => n + l.steps.length, 0))

  // 2. The full lab exam in the CLI simulator, with abbreviations.
  const lab = [
    'en', 'conf t', 'hostname SW1', 'line con 0', 'password cisco', 'login', 'exit',
    'line vty 0 15', 'password cisco', 'login', 'exit', 'enable secret class', 'service password-encryption',
    'banner motd #Tikai autorizetiem!#', 'int vlan 1', 'ip address 192.168.1.2 255.255.255.0', 'no shut',
    'exit', 'ip default-gateway 192.168.1.1', 'end', 'copy run start', 'ping 192.168.1.10', 'sh ip int br',
  ]
  let s = cli.INITIAL
  for (const c of lab) s = cli.runCommand(s, c).next
  const open = cli.LAB_TASKS.filter((t) => !t.done(s)).map((t) => t.text)
  check('lab exam completes all tasks', open.length === 0, open.join('; '))
  check('prompt after lab', cli.promptOf(s) === 'SW1#', cli.promptOf(s))

  // 3. Typical mistakes give errors, not silent success.
  const err = (state, c) => cli.runCommand(state, c).out.join('\n')
  check('hostname in user mode is rejected', err(cli.INITIAL, 'hostname X').includes('Invalid input'))
  const conf = cli.runCommand(cli.runCommand(cli.INITIAL, 'enable').next, 'configure terminal').next
  check('banner mo t d is rejected', err(conf, 'banner mo t d #x#').includes('%'))
  check('incomplete command', err(conf, 'hostname').includes('Incomplete'))
  check('hostname starting with digit rejected', err(conf, 'hostname 1SW').includes('%'))
  const unsaved = cli.runCommand(s, 'conf t').next
  const changed = cli.runCommand(unsaved, 'hostname SW2').next
  check('changing config after save marks save task undone', !cli.LAB_TASKS[10].done(changed))

  // 4. Whole pages render with an empty progress object.
  const { emptyProgress } = await load('/src/lib/store.js')
  const Home = (await load('/src/components/Home.jsx')).default
  const Learn = (await load('/src/components/Learn.jsx')).default
  const Tickets = (await load('/src/components/Tickets.jsx')).default
  const p = emptyProgress()
  const noop = () => {}
  const page = (name, el) => {
    try { renderToString(el); check(`page ${name}`, true) } catch (e) { check(`page ${name}`, false, e.message) }
  }
  page('home', createElement(Home, { name: 'test', progress: p, go: noop, reset: noop, openLesson: noop }))
  page('learn list', createElement(Learn, { progress: p, update: noop, go: noop, openLesson: null, setOpenLesson: noop }))
  for (const lesson of LESSONS) page(`lesson ${lesson.t}`, createElement(Learn, { progress: p, update: noop, go: noop, openLesson: lesson.t, setOpenLesson: noop }))
  page('tickets list', createElement(Tickets, { progress: p, update: noop }))
  page('speech 9', createElement(Tickets, { progress: p, update: noop, preset: 9 }))

  // 5. IPv6 helpers.
  check('compress 2001:db8::1', widgets.compress('2001:0db8:0000:0000:0000:0000:0000:0001') === '2001:db8::1')
  check('compress 2001:db8:0:1111::200', widgets.compress('2001:0db8:0000:1111:0000:0000:0000:0200') === '2001:db8:0:1111::200')
  check('expand round trip', widgets.expand('fe80::a12:ff:fe34:1') === 'fe80:0000:0000:0000:0a12:00ff:fe34:0001')
  check('double :: invalid', widgets.expand('2001::1::2') === null)
} finally {
  await server.close()
}

console.log(failures ? `\n${failures} failure(s)` : '\nall good')
process.exit(failures ? 1 : 0)
