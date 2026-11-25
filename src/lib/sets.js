import { SUBJECTS } from "../data/constants.js";
import { getStatus } from "./grading.js";

/** SET THEORY - sets are plain arrays of unique values. */
export const union = (a, b) => a.concat(b.filter((x) => !a.includes(x)));
export const intersection = (a, b) => a.filter((x) => b.includes(x));
export const difference = (a, b) => a.filter((x) => !b.includes(x));
export const symmetricDifference = (a, b) => union(difference(a, b), difference(b, a));
export const isSubset = (a, b) => a.every((x) => b.includes(x));
export const isDisjoint = (a, b) => intersection(a, b).length === 0;
export const complement = (universe, a) => difference(universe, a);

export const OPERATIONS = {
  union:        { label: "Union",                eq: "X ∪ Y", symbol: "∪", run: union },
  intersection: { label: "Intersection",         eq: "X ∩ Y", symbol: "∩", run: intersection },
  difference:   { label: "Difference",           eq: "X − Y", symbol: "−", run: difference },
  symmetric:    { label: "Symmetric difference", eq: "X ⊕ Y", symbol: "⊕", run: symmetricDifference },
};

export const SET_NAMES = [...SUBJECTS, "Passed", "Honors", "Failed"];

/** Build a set of student names from the records. */
export function getSet(students, setName) {
  if (SUBJECTS.includes(setName))
    return students.filter((s) => s.enrolled.includes(setName)).map((s) => s.name);
  const key = { Passed: "passed", Honors: "honors", Failed: "failed" }[setName];
  return students.filter((s) => getStatus(s)[key]).map((s) => s.name);
}
