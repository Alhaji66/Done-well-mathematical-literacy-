# DONE WELL® School Support Platform

_Resources. Practice. Support. Progress._

A mobile-first MVP for the DONE WELL® School Support Platform — an extension of Done Well Publications (South Africa). It brings together educational publications, practice, assessment and progress support for **learners, parents, teachers and schools**, starting with Grade 10–12 Mathematical Literacy (Finance, Data Handling, Maps and Plans, Measurement, Probability, Tariffs, and Profit/Loss/Breakeven).

The app runs on **Supabase** — Postgres, row-level security and passwordless
magic-link authentication are wired up and in use (`src/lib/supabaseClient.ts`,
`src/lib/privacy.ts`). A demo mode still works without an account, and with no
Supabase credentials configured the app falls back to it rather than breaking,
so the public site and the question bank stay browsable offline.

**Payments are the part that is not built.** There is no billing, subscription
or paywall code anywhere in the repo.

## Subjects in scope

Four subjects carry content, across Grades 10–12:

| Subject | Papers | Questions |
| --- | ---: | ---: |
| Mathematical Literacy | 54 | 1 711 |
| Mathematics | 54 | 1 748 |
| Life Sciences | 54 | 1 994 |
| Physical Sciences | 54 | 2 043 |

English FAL was registered in `src/data/subjects.ts` with no topics and has
been removed. It was never visible — every selector filters on topic count —
so it amounted to a placeholder six call sites had to remember to hide.
Finishing the four subjects above comes first; it can be registered again when
there is content to register it for.

**Accounting is out of scope.** An external review asked whether it was meant
to be a fourth subject and flagged that it should not be assumed from wording
alone; this is the explicit answer. The obstacle is structural rather than a
question of how much content there is to write: NSC Accounting is answered in
ledgers, journals and financial statements, which the `Question` model in
`src/types/index.ts` cannot represent — its `answer` is a string. Adding
Accounting would mean a tabular answer type, a trial-balance context shared
across a whole question, and line-by-line marking in the paper runner, all of
which touch every subject's code paths. That work would have to come before
any Accounting content. See the note at the top of `src/data/subjects.ts`.

## Tech stack

- React + TypeScript + Vite
- React Router (role-based routing under `/app/<role>/...`)
- Tailwind CSS (navy & gold brand tokens in `tailwind.config.js`)

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and produce a production build
npm run preview   # preview the production build
```

## Structure

- `src/types` — shared domain types (Grade, Subject, Topic, Resource, Question, Assessment, Progress)
- `src/data` — demo/mock content (swap for a real API/Supabase later)
- `src/context/DemoAuthContext.tsx` — lightweight demo role switcher (Learner / Parent / Teacher / School)
- `src/components` — shared UI kit and layouts (public site + role dashboard shell)
- `src/pages` — public marketing pages plus the four role experiences (`learner`, `parent`, `teacher`, `school`)

## Try the demo

Visit `/sign-in` and pick a role — no account required. Each role lands on a full sample dashboard built from realistic demo data.
