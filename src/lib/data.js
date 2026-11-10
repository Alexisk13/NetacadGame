import tickets from '../data/tickets.json'
import flashcards from '../data/flashcards.json'
import quiz from '../data/quiz.json'

export { tickets }
export const TOPICS = [{ id: 0, title: 'Tīklu pamati (ITN 1)', short: 'Pamati' }].concat(
  tickets.map((t) => ({ id: t.id, title: t.title, short: `${t.id}. ${t.title.replace(/\.$/, '')}` })),
)
export const topicTitle = (id) => TOPICS.find((t) => t.id === id)?.title ?? ''

export const CARDS = flashcards.map((c) => ({ ...c, key: `f:${c.id}` }))
export const QUESTIONS = quiz.map((q) => ({ ...q, key: `q:${q.id}` }))
export const ALL_ITEMS = [...CARDS, ...QUESTIONS]
export { default as LESSONS } from '../data/lessons.json'
