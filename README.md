# Student Grading & Eligibility System

**Final Project – Discrete Mathematics** · Pamantasan ng Lungsod ng Valenzuela · College of Engineering and Information Technology

A React web app that decides whether students passed or earned honors, groups them into sets, and models their subject enrollment as a relation. Every result on screen is computed by Discrete Mathematics code in `src/lib/`.

## Group members

- C Josh Mondragón
- John Richmond
- Mark Daniel Padilla (Group creator)
- Rocky Jay Ducusin
- Tristan Ronald Blas

## Get the code

Source code: https://github.com/rocky123454321/plv-grading-system

```bash
git clone https://github.com/rocky123454321/plv-grading-system.git
cd plv-grading-system
npm install
npm run dev
```

No Git? On the GitHub page, click **Code → Download ZIP**, extract it, open the folder in a terminal, then run `npm install` and `npm run dev`. You need Node.js installed first.

## Objectives and users

- Show how propositional logic, set theory and relations solve a real grading problem.
- Intended users: instructors checking student eligibility, and students checking their own standing.
- IT subject area: Data Structures and Algorithms, Web Development, Information Management.

## Discrete Mathematics concepts and where they are implemented

| Concept | What the program does | File |
| --- | --- | --- |
| Propositional logic | A = Prelim ≥ 75, B = Midterm ≥ 75, C = Final ≥ 75, D = Average ≥ 90. Passed = A ∧ B ∧ C. Honors = Passed ∧ D. Failed = ¬(A ∧ B ∧ C). | `src/lib/logic.js`, `src/lib/grading.js` |
| Truth tables, tautology, contradiction | Builds all 16 rows for A, B, C, D and classifies each statement. | `makeAllRows`, `classify` in `src/lib/logic.js` |
| Logical equivalence, De Morgan's law, implication | Checks that `¬(A∧B∧C) ≡ ¬A ∨ ¬B ∨ ¬C` row by row. Includes the implications Honors → Passed (tautology) and Passed → Honors. | `compareStatements` in `src/lib/logic.js` |
| Set theory | One set of students per subject, plus Passed, Honors, Failed. Union, intersection, difference, symmetric difference, complement, subset and disjoint tests, shown on a Venn diagram. | `src/lib/sets.js` |
| Relations | R ⊆ S × T where S = students and T = subjects. Shows the Cartesian product matrix, domain, range and inverse relation R⁻¹. | `src/lib/relations.js` |

## Sample input and output

Input: Ana Reyes with grades 92, 94, 95. Ben Cruz with 80, 78, 85. Carla Santos with 70, 82, 90.

| Student | A | B | C | D | Result |
| --- | --- | --- | --- | --- | --- |
| Ana Reyes | T | T | T | T | Passed, Honors |
| Ben Cruz | T | T | T | F | Passed |
| Carla Santos | F | T | T | F | Failed (A is false) |

Sets: `Math ∩ Programming = { Ana Reyes, Dan Lopez }`. Relation: `(Ana Reyes, Math) ∈ R`, `(Ana Reyes, Database) ∉ R`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 8 tests for the logic, sets and relations code
npm run build    # production build in dist/
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Keep the detected settings (Framework: Vite, Build: `npm run build`, Output: `dist`) and press **Deploy**.

Or with the CLI: `npx vercel --prod`.

## Folder structure

```
src/
  components/
    layout/   Header, Loader, Cursor
    ui/       Button, Tag, TF, SetList, Formula, PageHeader, VennDiagram
  data/       constants, sample students, members, navigation
  hooks/      useStudents, useTheme, useHashTab, useLocalStorage
  lib/        logic.js, grading.js, sets.js, relations.js (the Discrete Math code) + tests
  pages/      GroupPage, StudentsPage, LogicPage, SetsPage, RelationsPage
  styles/     tokens, base, layout, components, group, pages
public/
  favicon.svg
  photos/     member photos (josh.jpg, john.jpg, mark.jpg, rocky.jpg, tristan.jpg)
```

## Credits

React, Vite and lucide-react (icons). Fonts: Unbounded and Figtree from Google Fonts (SIL Open Font License).
Student records and edits are saved in the browser (localStorage); **Reset sample data** restores the defaults.