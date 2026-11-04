# Tīklu treniņš

Exam prep game for "Datoru tīkli I" (Cisco ITN v7). Vite + React, hosted free on GitHub Pages, accounts and progress in Supabase (free tier).

Modes:
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
- `tickets.json`: 18 tickets with speech plan (5 phases) and key facts.
- `flashcards.json`: `{ id, t, q, a }`, `t` = ticket number (0 = ITN 1 basics).
- `quiz.json`: `{ id, t, q, o: [options], a: [correct indexes], e: explanation }`. More than one index = "choose N". Options are shuffled in the game.

Run `npm run check-data` after editing (checks JSON, ids, answer indexes, no em dashes).

## Supabase setup (once)

1. Create a free project at https://supabase.com.
2. **SQL Editor > New query**: paste `supabase/schema.sql`, Run. This creates the `progress` table with Row Level Security, so every user can only read and write their own row.
3. **Authentication > Sign In / Providers**: turn off **Allow new users to sign up** (only you create accounts).
4. **Authentication > Users > Add user > Create new user**: add the 3 users (email + password, tick **Auto Confirm User**).
   Optional display name: in the user's raw metadata set `{"name": "Aleksis"}`, otherwise the part of the email before `@` is shown.
5. **Project Settings > API**: copy the Project URL and the anon (or publishable) key into `.env` (see `.env.example`).
   These two values are public by design; the data is protected by RLS, not by hiding the key.

## Deploy to GitHub Pages (free)

1. Create a GitHub repo and push this folder to the `main` branch.
2. Repo **Settings > Secrets and variables > Actions > New repository secret**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Repo **Settings > Pages > Source**: GitHub Actions.
4. Push to `main` (or run the workflow manually). The site appears at `https://<user>.github.io/<repo>/`.
5. In Supabase **Authentication > URL Configuration**, set Site URL to that address.
