import { SUBJECTS } from "../data/constants.js";

/**
 * RELATIONS & CARTESIAN PRODUCT
 * S = students, T = subjects.  S × T = every possible (student, subject) pair.
 * R ⊆ S × T = the pairs that really exist (student is enrolled in subject).
 */
export function buildRelation(students) {
  const pairs = [];
  students.forEach((s) => s.enrolled.forEach((subject) => pairs.push([s.name, subject])));
  return pairs;
}

export const hasPair = (R, studentName, subject) =>
  R.some(([s, t]) => s === studentName && t === subject);

export const domainOf = (R, studentNames) =>
  studentNames.filter((n) => R.some(([s]) => s === n));

export const rangeOf = (R) => SUBJECTS.filter((t) => R.some(([, subject]) => subject === t));

/** Inverse relation: flip every (student, subject) into (subject, student). */
export const inverseOf = (R) => R.map(([s, t]) => [t, s]);

export const studentsOf = (R, subject) => R.filter(([, t]) => t === subject).map(([s]) => s);

export const cartesianSize = (studentCount) => studentCount * SUBJECTS.length;
