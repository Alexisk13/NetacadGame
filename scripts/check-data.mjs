// Validates question data: JSON syntax, unique ids, answer indices, topics, no em/en dashes.
import { readFileSync } from 'node:fs'

const load = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url), 'utf8'))
const tickets = load('tickets.json')
const cards = load('flashcards.json')
const quiz = load('quiz.json')
const errors = []
const topics = new Set([0, ...tickets.map((t) => t.id)])
const dash = new RegExp(`[${String.fromCharCode(8211)}${String.fromCharCode(8212)}]`) // en dash, em dash

const ids = new Set()
for (const item of [...cards, ...quiz]) {
  if (ids.has(item.id)) errors.push(`duplicate id ${item.id}`)
  ids.add(item.id)
  if (!topics.has(item.t)) errors.push(`${item.id}: unknown topic ${item.t}`)
}
for (const q of quiz) {
  if (!Array.isArray(q.a) || q.a.length === 0) errors.push(`${q.id}: no answers`)
  for (const i of q.a) if (i < 0 || i >= q.o.length) errors.push(`${q.id}: answer index ${i} out of range`)
  if (new Set(q.o).size !== q.o.length) errors.push(`${q.id}: duplicate options`)
}
// Tickets: speech data from EKSAMENA_BILETES.md.
for (const t of tickets) {
  if (!t.idea) errors.push(`ticket ${t.id}: no idea`)
  if (!Array.isArray(t.plan) || t.plan.length !== 5 || t.plan.some((p) => !p.h || !p.t)) errors.push(`ticket ${t.id}: plan must have 5 { h, t }`)
  if (!t.facts?.length) errors.push(`ticket ${t.id}: no facts`)
  if (!t.followups?.length || t.followups.some((f) => !f.q || !f.a)) errors.push(`ticket ${t.id}: bad followups`)
  for (const l of t.links || []) if (!topics.has(l) || l === 0) errors.push(`ticket ${t.id}: bad link ${l}`)
}

// Lessons: one per ticket, each step well formed.
const lessons = load('lessons.json')
const WIDGETS = ['binary', 'subnet', 'ipv6', 'encap', 'mactable', 'cli']
for (const t of tickets) if (!lessons.some((l) => l.t === t.id)) errors.push(`ticket ${t.id}: no lesson`)
for (const l of lessons) {
  l.steps.forEach((s, i) => {
    const at = `lesson ${l.t} step ${i + 1} (${s.k})`
    const bad = (msg) => errors.push(`${at}: ${msg}`)
    if (s.k === 'info') { if (!s.h || !(s.t || s.b || s.tbl)) bad('needs h and content') }
    else if (s.k === 'life') { if (!s.h || !s.t || (s.map && s.map.some((p) => p.length !== 2))) bad('needs h, t and [life, network] pairs') }
    else if (s.k === 'mcq') { if (!s.q || !(s.a >= 0 && s.a < s.o?.length) || new Set(s.o).size !== s.o.length) bad('bad options/answer') }
    else if (s.k === 'order') { if (!s.q || s.items?.length < 2 || new Set(s.items).size !== s.items.length) bad('items must be 2+ unique') }
    else if (s.k === 'match') { if (!s.q || s.pairs?.length < 2 || new Set(s.pairs.map((p) => p[1])).size !== s.pairs.length || new Set(s.pairs.map((p) => p[0])).size !== s.pairs.length) bad('pairs must be unique on both sides') }
    else if (s.k === 'sort') { if (!s.q || s.buckets?.length < 2 || s.items?.some(([, b]) => !(b >= 0 && b < s.buckets.length))) bad('bad bucket index') }
    else if (s.k === 'flow') { if (!s.h || s.steps?.some((x) => !x.m || !(x.f >= 0 && x.f < s.actors.length) || !(x.to >= 0 && x.to < s.actors.length))) bad('bad actor index') }
    else if (s.k === 'widget') { if (!WIDGETS.includes(s.w)) bad(`unknown widget ${s.w}`) }
    else bad('unknown step type')
  })
}

// Videos: ticket keys exist, every referenced video has metadata, ids look like YouTube ids.
const videos = load('videos.json')
if (!/^PL[\w-]+$/.test(videos.playlist?.id ?? '')) errors.push('videos: bad playlist id')
for (const [id, v] of Object.entries(videos.videos)) {
  if (!/^[\w-]{11}$/.test(id)) errors.push(`videos: bad id ${id}`)
  if (!v.title) errors.push(`videos: ${id} has no title`)
}
for (const [t, ids] of Object.entries(videos.tickets)) {
  if (!tickets.some((x) => x.id === Number(t))) errors.push(`videos: unknown ticket ${t}`)
  for (const id of ids) if (!videos.videos[id]) errors.push(`videos: ticket ${t} uses unknown video ${id}`)
}

for (const f of ['tickets.json', 'flashcards.json', 'quiz.json', 'lessons.json', 'videos.json']) {
  const text = readFileSync(new URL(`../src/data/${f}`, import.meta.url), 'utf8')
  text.split('\n').forEach((line, n) => { if (dash.test(line)) errors.push(`${f}:${n + 1}: em/en dash`) })
}

console.log(`tickets ${tickets.length}, flashcards ${cards.length}, quiz ${quiz.length}, lesson steps ${lessons.reduce((n, l) => n + l.steps.length, 0)}`)
for (const t of topics) {
  const c = cards.filter((x) => x.t === t).length
  const q = quiz.filter((x) => x.t === t).length
  if (c === 0 || q === 0) errors.push(`topic ${t}: ${c} cards, ${q} questions`)
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('data ok')
