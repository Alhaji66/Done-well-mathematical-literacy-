# Done-well-mathematical-literacy-
repository for Grade 11 and 12 Mathematical Literacy exam solutions, focusing on finance, data handling, measurements, and maps/plans for the 2026 year.

## Project structure

Each exam topic has a corresponding solver module under `src/`, with matching
tests under `tests/`. These functions back the worked exam solutions and are
unit tested against known exam-style answers.

```
src/
  finance/        simple/compound interest, currency conversion, inflation
  dataHandling/   mean, median, mode, range, standard deviation, probability
  measurement/    area, volume, unit conversion
  mapsPlans/      map scale, distance conversion, compass bearings
  shared/         rounding helpers shared across topics
tests/            mirrors src/, one test file per module
```

## Getting started

```
npm install
npm test          # run the test suite
npm run test:watch
npm run coverage   # run tests with a coverage report
npm run typecheck
```

Tests run automatically on every push and pull request via GitHub Actions
(see `.github/workflows/test.yml`).

## Adding a new solver

1. Add the function to the relevant module in `src/` (or create a new
   topic module if it doesn't fit an existing one).
2. Add unit tests in the matching `tests/` file, including at least one
   case derived from a real exam memo answer and one edge case
   (zero/negative input, boundary value, malformed input).
3. Run `npm test` and `npm run typecheck` before committing.
