# DONE WELL® School Support Platform

_Resources. Practice. Support. Progress._

A mobile-first MVP for the DONE WELL® School Support Platform — an extension of Done Well Publications (South Africa). It brings together educational publications, practice, assessment and progress support for **learners, parents, teachers and schools**, starting with Grade 10–12 Mathematical Literacy (Finance, Data Handling, Maps and Plans, Measurement, Probability, Tariffs, and Profit/Loss/Breakeven).

This is a UI/UX prototype built with **demo data** — no backend, authentication or payments are wired up yet, but the code is structured so Supabase/database, real auth and payments can be added later without redesigning the UI.

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
