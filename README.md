# Tīklu treniņš

Exam prep game for "Datoru tīkli I" (Cisco ITN v7). Vite + React, hosted free on GitHub Pages, accounts and progress in Supabase (free tier).

Modes:
- **Mācības**: one bite-sized lesson per ticket: short idea cards, each followed by a quick check (tap answer, ordering, matching, sorting, message-flow diagrams) and mini-labs (binary/hex bits, switch MAC table, encapsulation, subnetting, IPv6 shortening). Wrong steps repeat at the end; 1-3 stars per lesson.
- **Laboratorijas simulators**: Cisco IOS CLI for the lab exam (switch basic configuration), with abbreviations, `?`, real IOS errors and a task checklist.
- **Viktorīna**: NetAcad style multiple choice (single and "choose two/three") with explanations.
- **Kartītes**: flashcards with self rating.
- **Biļetes**: draw one of the 18 oral exam tickets, 5-minute timer with speech checkpoints, fact checklist, follow-up questions.

Both quiz and flashcards use spaced repetition (Leitner boxes 0-5, intervals 0, 10 min, 1, 3, 7, 16 days). Wrong answers come back 3 items later in the same session.

## Run locally

```
npm install
npm run dev
```

Without a `.env` the app runs in **local mode** (no login, progress in this browser only).

## Content

All questions are in `src/data/`:
- `tickets.json`: 18 tickets with main idea, required facts, 5-part speech plan, follow-up questions and related tickets. Generated from `EKSAMENA_BILETES.md` (the source of truth for the oral exam).
- `videos.json`: YouTube playlist plus video ids per ticket (first = main video). Players load only after a click, via youtube-nocookie.com.
- `lessons.json`: `{ t, steps: [...] }` per ticket. Step kinds: `info` (h, t, b bullets, tbl rows, tip), `life` (real-life comparison: h, t, map [life, network] pairs), `mcq` (q, o, a index, e), `order` (q, items in correct order), `match` (q, pairs), `sort` (q, buckets, items [text, bucket]), `flow` (h, actors, steps {f, to, m, n}), `widget` (w: binary, subnet, ipv6, encap, mactable, cli).
- `flashcards.json`: `{ id, t, q, a }`, `t` = ticket number (0 = ITN 1 basics).
- `quiz.json`: `{ id, t, q, o: [options], a: [correct indexes], e: explanation }`. More than one index = "choose N". Options are shuffled in the game.

Run `npm run check-data` after editing (checks JSON, ids, answer indexes, lesson step shapes, no em dashes) and `npm test` (renders every lesson step and page, runs the lab exam through the CLI simulator).

## Supabase setup (once)

1. Create a free project at https://supabase.com.
2. **SQL Editor > New query**: paste `supabase/schema.sql`, Run. This creates the `progress` table with Row Level Security, so every user can only read and write their own row.
3. **Authentication > Sign In / Providers**: turn off **Allow new users to sign up** (only you create accounts).
4. **Authentication > URL Configuration**: Site URL = the GitHub Pages address; add `http://localhost:5173/` to Redirect URLs for local testing.
5. Add the users, either way:
   - **Create new user** (email + temporary password, tick **Auto Confirm User**), send them the password, they change it with **Mainīt paroli** in the app.
   - **Send invitation**: they get an email link, open the app and choose their own password. Supabase's built-in email only delivers to members of your Supabase organization, so for anyone else set up custom SMTP first (Authentication > Emails > SMTP Settings, e.g. a free Resend or Brevo account).
   Optional display name: in the user's raw metadata set `{"name": "Aleksis"}`, otherwise the part of the email before `@` is shown.
6. Forgotten password: **Aizmirsi paroli?** on the login screen sends a reset link (same email limits as invites).
7. **Project Settings > API**: copy the Project URL and the anon (or publishable) key into `.env` (see `.env.example`).
   These two values are public by design; the data is protected by RLS, not by hiding the key.

## Deploy to GitHub Pages (free)

1. Create a GitHub repo and push this folder to the `main` branch.
2. Repo **Settings > Secrets and variables > Actions > New repository secret**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Repo **Settings > Pages > Source**: GitHub Actions.
4. Push to `main` (or run the workflow manually). The site appears at `https://<user>.github.io/<repo>/`.
5. In Supabase **Authentication > URL Configuration**, set Site URL to that address.
