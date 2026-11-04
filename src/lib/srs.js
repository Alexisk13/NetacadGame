// Leitner style spaced repetition. Box 0 = new or forgotten, box 5 = mastered.
const MIN = 60 * 1000
const DAY = 24 * 60 * MIN
export const MAX_BOX = 5
export const INTERVALS = [0, 10 * MIN, DAY, 3 * DAY, 7 * DAY, 16 * DAY]

export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** result: 'again' | 'hard' | 'good' */
export function grade(rec, result, now = Date.now()) {
  const r = { box: 0, due: 0, seen: 0, ok: 0, bad: 0, ...rec }
  r.seen += 1
  if (result === 'again') {
    r.box = 0
    r.bad += 1
  } else if (result === 'hard') {
    r.box = Math.max(1, r.box)
    r.ok += 1
  } else {
    r.box = Math.min(MAX_BOX, r.box + 1)
    r.ok += 1
  }
  r.due = now + INTERVALS[r.box]
  r.last = now
  return r
}

export const isDue = (rec, now = Date.now()) => !rec || rec.due <= now

/**
 * Builds a study queue: due items first (weakest first), then new items.
 * If nothing is due, falls back to the weakest items so practice never stops.
 */
export function buildQueue(items, srs, size, now = Date.now()) {
  const due = items
    .filter((i) => srs[i.key] && srs[i.key].due <= now)
    .sort((a, b) => srs[a.key].box - srs[b.key].box || srs[a.key].due - srs[b.key].due)
  const fresh = shuffle(items.filter((i) => !srs[i.key]))
  let queue = [...shuffle(due.slice(0, size)), ...fresh].slice(0, size)
  let extra = false
  if (queue.length === 0) {
    extra = true
    queue = shuffle(items)
      .sort((a, b) => (srs[a.key]?.box ?? 0) - (srs[b.key]?.box ?? 0))
      .slice(0, size)
  }
  return { queue: shuffle(queue), extra }
}

export function counts(items, srs, now = Date.now()) {
  let due = 0, fresh = 0, mastered = 0, boxSum = 0
  for (const i of items) {
    const r = srs[i.key]
    if (!r) fresh++
    else {
      if (r.due <= now) due++
      if (r.box >= 4) mastered++
      boxSum += r.box
    }
  }
  return { due, fresh, mastered, total: items.length, mastery: items.length ? boxSum / (items.length * MAX_BOX) : 0 }
}
