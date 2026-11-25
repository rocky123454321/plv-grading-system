/**
 * PROPOSITIONAL LOGIC
 * A, B, C, D are propositions (each one is true or false).
 *   &&  AND (conjunction)     ||  OR (disjunction)
 *   !   NOT (negation)        !p || q   p → q (implication)
 */

export const STATEMENTS = [
  { id: "passed",   name: "Passed",             text: "A ∧ B ∧ C",
    check: (A, B, C, D) => A && B && C },
  { id: "honors",   name: "Honors",             text: "(A ∧ B ∧ C) ∧ D",
    check: (A, B, C, D) => (A && B && C) && D },
  { id: "failed",   name: "Failed",             text: "¬(A ∧ B ∧ C)",
    check: (A, B, C, D) => !(A && B && C) },
  { id: "demorgan", name: "Failed (De Morgan)", text: "¬A ∨ ¬B ∨ ¬C",
    check: (A, B, C, D) => !A || !B || !C },
  { id: "h-to-p",   name: "Honors → Passed",    text: "((A∧B∧C)∧D) → (A∧B∧C)",
    check: (A, B, C, D) => !((A && B && C) && D) || (A && B && C) },
  { id: "p-to-h",   name: "Passed → Honors",    text: "(A∧B∧C) → ((A∧B∧C)∧D)",
    check: (A, B, C, D) => !(A && B && C) || ((A && B && C) && D) },
  { id: "p-and-f",  name: "Passed ∧ Failed",    text: "(A∧B∧C) ∧ ¬(A∧B∧C)",
    check: (A, B, C, D) => (A && B && C) && !(A && B && C) },
];

export const getStatement = (id) => STATEMENTS.find((s) => s.id === id);

/** All 2 × 2 × 2 × 2 = 16 combinations of true/false for A, B, C, D. */
export function makeAllRows() {
  const rows = [];
  const values = [true, false];
  for (const A of values)
    for (const B of values)
      for (const C of values)
        for (const D of values) rows.push([A, B, C, D]);
  return rows;
}

export const evaluate = (statement, row) => statement.check(row[0], row[1], row[2], row[3]);

/** Tautology = always true, Contradiction = always false, otherwise Contingency. */
export function classify(statement) {
  const results = makeAllRows().map((row) => evaluate(statement, row));
  if (results.every((r) => r === true))
    return { kind: "tautology", label: "Tautology", detail: "always true" };
  if (results.every((r) => r === false))
    return { kind: "contradiction", label: "Contradiction", detail: "always false" };
  return { kind: "contingency", label: "Contingency", detail: "sometimes true, sometimes false" };
}

/** Two statements are logically equivalent when they agree in every row. */
export function compareStatements(one, two) {
  const rows = makeAllRows();
  const different = rows.filter((row) => evaluate(one, row) !== evaluate(two, row));
  return { equivalent: different.length === 0, differentRows: different, total: rows.length };
}
