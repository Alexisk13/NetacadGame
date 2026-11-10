import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, hasBackend } from './supabase'

export const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const lsKey = (uid) => `netacad-progress-${uid}`
export const emptyProgress = () => ({ v: 1, t: 0, srs: {}, tickets: {}, lessons: {}, stats: { answered: 0, correct: 0, days: [] } })

function readLocal(uid) {
  try {
    const raw = localStorage.getItem(lsKey(uid))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function writeLocal(uid, data) {
  try { localStorage.setItem(lsKey(uid), JSON.stringify(data)) } catch { /* storage full or blocked */ }
}
const normalize = (p) => {
  const base = emptyProgress()
  return { ...base, ...p, stats: { ...base.stats, ...(p?.stats || {}) } }
}

/** Loads progress (newest of server and local copy) and syncs changes back with a debounce. */
export function useProgress(uid) {
  const [progress, setProgress] = useState(null)
  const [sync, setSync] = useState('idle') // idle | saving | saved | offline | error
  const timer = useRef(null)
  const latest = useRef(null)

  useEffect(() => {
    if (!uid) return
    let cancelled = false
    ;(async () => {
      const local = readLocal(uid)
      let server = null
      if (hasBackend) {
        const { data, error } = await supabase.from('progress').select('data').eq('user_id', uid).maybeSingle()
        if (error) setSync('offline')
        else server = data?.data ?? null
      }
      const pick = (server?.t ?? -1) >= (local?.t ?? -1) ? server : local
      if (!cancelled) {
        const p = normalize(pick)
        latest.current = p
        setProgress(p)
      }
    })()
    return () => { cancelled = true }
  }, [uid])

  const pushNow = useCallback(async () => {
    clearTimeout(timer.current)
    timer.current = null
    if (!hasBackend || !latest.current) return
    setSync('saving')
    const { error } = await supabase
      .from('progress')
      .upsert({ user_id: uid, data: latest.current, updated_at: new Date().toISOString() })
    setSync(error ? 'error' : 'saved')
  }, [uid])

  useEffect(() => {
    const flush = () => { if (document.visibilityState === 'hidden' && timer.current) pushNow() }
    document.addEventListener('visibilitychange', flush)
    return () => document.removeEventListener('visibilitychange', flush)
  }, [pushNow])

  const update = useCallback((fn) => {
    setProgress((prev) => {
      const next = fn(structuredClone(prev))
      next.t = Date.now()
      const today = localDay()
      if (!next.stats.days.includes(today)) next.stats.days = [...next.stats.days, today].slice(-400)
      latest.current = next
      writeLocal(uid, next)
      clearTimeout(timer.current)
      timer.current = setTimeout(pushNow, 1500)
      return next
    })
  }, [uid, pushNow])

  const reset = useCallback(() => update(() => emptyProgress()), [update])

  return { progress, update, sync, reset, flush: pushNow }
}

export function streak(days) {
  const set = new Set(days)
  let n = 0
  const d = new Date()
  if (!set.has(localDay(d))) d.setDate(d.getDate() - 1)
  while (set.has(localDay(d))) { n++; d.setDate(d.getDate() - 1) }
  return n
}
