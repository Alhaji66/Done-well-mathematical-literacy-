# DONE WELL® School Support Platform

_Resources. Practice. Support. Progress._

A mobile-first MVP for the DONE WELL® School Support Platform — an extension of Done Well Publications (South Africa). It brings together educational publications, practice, assessment and progress support for **learners, parents, teachers and schools**, starting with Grade 10–12 Mathematical Literacy (Finance, Data Handling, Maps and Plans, Measurement, Probability, Tariffs, and Profit/Loss/Breakeven).

This is a UI/UX prototype built with **demo data** — no backend, authentication or payments are wired up yet, but the code is structured so Supabase/database, real auth and payments can be added later without redesigning the UI.

## Subjects in scope

Four subjects carry content, across Grades 10–12:

| Subject | Papers | Questions |
| --- | ---: | ---: |
| Mathematical Literacy | 54 | 1 711 |
| Mathematics | 54 | 1 748 |
| Life Sciences | 54 | 1 994 |
| Physical Sciences | 54 | 2 043 |

English FAL is registered in `src/data/subjects.ts` but has no topics yet, so
it is filtered out of every subject selector until it does.

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
