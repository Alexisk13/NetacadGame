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
for (const f of ['tickets.json', 'flashcards.json', 'quiz.json']) {
  const text = readFileSync(new URL(`../src/data/${f}`, import.meta.url), 'utf8')
  text.split('\n').forEach((line, n) => { if (dash.test(line)) errors.push(`${f}:${n + 1}: em/en dash`) })
}

console.log(`tickets ${tickets.length}, flashcards ${cards.length}, quiz ${quiz.length}`)
for (const t of topics) {
  const c = cards.filter((x) => x.t === t).length
  const q = quiz.filter((x) => x.t === t).length
  if (c === 0 || q === 0) errors.push(`topic ${t}: ${c} cards, ${q} questions`)
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('data ok')
