import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Without env values the game runs in local mode: no login, progress only in this browser.
export const hasBackend = Boolean(url && key && !url.includes('YOUR-PROJECT'))

// Invite and password reset emails link back here with "#...&type=invite" or "type=recovery".
// Read it before the client consumes and clears the URL hash.
const linkType = new URLSearchParams(window.location.hash.slice(1)).get('type')
export const needsPasswordFromLink = linkType === 'invite' || linkType === 'recovery'

export const supabase = hasBackend ? createClient(url, key) : null

/** Where auth emails should send the user back to (this app's address). */
export const appUrl = () => window.location.origin + window.location.pathname
