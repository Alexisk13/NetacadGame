import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Without env values the game runs in local mode: no login, progress only in this browser.
export const hasBackend = Boolean(url && key && !url.includes('YOUR-PROJECT'))
export const supabase = hasBackend ? createClient(url, key) : null
