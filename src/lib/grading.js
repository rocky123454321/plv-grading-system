import { PASSING_GRADE, HONORS_AVERAGE } from "../data/constants.js";
import { getStatement } from "./logic.js";

/** Build the four propositions for a student and evaluate them with the logic statements. */
export function getStatus(student) {
  const [prelim, midterm, final] = student.grades;
  const average = (prelim + midterm + final) / 3;

  const A = prelim >= PASSING_GRADE;
  const B = midterm >= PASSING_GRADE;
  const C = final >= PASSING_GRADE;
  const D = average >= HONORS_AVERAGE;

  return {
    average,
    A, B, C, D,
    passed: getStatement("passed").check(A, B, C, D),
    honors: getStatement("honors").check(A, B, C, D),
    failed: getStatement("failed").check(A, B, C, D),
  };
}

/** Returns an error message, or "" when the inputs are valid. */
export function validateNewStudent(name, grades, existing) {
  if (name.trim() === "") return "Enter a student name.";
  if (grades.some((g) => Number.isNaN(g) || g < 0 || g > 100))
    return "Grades must be numbers from 0 to 100.";
  if (existing.some((s) => s.name.toLowerCase() === name.trim().toLowerCase()))
    return "That student already exists.";
  return "";
}

export const clampGrade = (value) => {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
};
