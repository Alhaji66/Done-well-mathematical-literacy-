# DONE WELL® School Support Platform

*Resources. Practice. Support. Progress.*

A mobile-first school support hub for learners, parents, teachers and schools, built as an extension of Done Well Publications (South Africa). This prototype connects Done Well's Learner Book → Workbook → Teacher Guide → Tests → Memos → Assessment Data → Targeted Intervention into one lightweight, affordable platform.

The MVP ships with realistic demo data (Grade 12 Mathematical Literacy) and a demo role switcher so visitors can explore the Learner, Parent, Teacher and School experiences without creating an account. It is structured so a real backend (Supabase), authentication and payments can be added later without redesigning the UI.

## Getting started

```bash
npm install
npm run dev
```

## Tech stack

React + TypeScript + Vite + Tailwind CSS + React Router, with a mock data layer under `src/data` designed to be swapped for real API/Supabase calls later.
