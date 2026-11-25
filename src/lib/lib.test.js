import test from "node:test";
import assert from "node:assert/strict";
import { STATEMENTS, getStatement, classify, compareStatements, makeAllRows } from "./logic.js";
import { getStatus } from "./grading.js";
import { union, intersection, difference, symmetricDifference, isSubset, isDisjoint, getSet } from "./sets.js";
import { buildRelation, hasPair, domainOf, rangeOf, inverseOf } from "./relations.js";
import { INITIAL_STUDENTS } from "../data/students.js";

test("truth table has 16 rows", () => assert.equal(makeAllRows().length, 16));

test("logic classification", () => {
  assert.equal(classify(getStatement("h-to-p")).kind, "tautology");
  assert.equal(classify(getStatement("p-and-f")).kind, "contradiction");
  assert.equal(classify(getStatement("passed")).kind, "contingency");
});

test("De Morgan: Failed ≡ ¬A ∨ ¬B ∨ ¬C", () => {
  assert.equal(compareStatements(getStatement("failed"), getStatement("demorgan")).equivalent, true);
  assert.equal(compareStatements(getStatement("passed"), getStatement("honors")).equivalent, false);
});

test("every statement can be evaluated", () => {
  for (const s of STATEMENTS) assert.equal(typeof s.check(true, false, true, false), "boolean");
});

test("student status", () => {
  const [ana, , carla, , ella] = INITIAL_STUDENTS;
  assert.deepEqual([getStatus(ana).passed, getStatus(ana).honors], [true, true]);
  assert.deepEqual([getStatus(carla).passed, getStatus(carla).A], [false, false]);
  assert.deepEqual([getStatus(ella).passed, getStatus(ella).B], [false, false]);
});

test("set operations", () => {
  assert.deepEqual(union([1, 2], [2, 3]), [1, 2, 3]);
  assert.deepEqual(intersection([1, 2], [2, 3]), [2]);
  assert.deepEqual(difference([1, 2], [2, 3]), [1]);
  assert.deepEqual(symmetricDifference([1, 2], [2, 3]).sort(), [1, 3]);
  assert.equal(isSubset([1], [1, 2]), true);
  assert.equal(isDisjoint([1], [2]), true);
});

test("Passed and Failed partition the students", () => {
  const p = getSet(INITIAL_STUDENTS, "Passed");
  const f = getSet(INITIAL_STUDENTS, "Failed");
  assert.equal(isDisjoint(p, f), true);
  assert.equal(union(p, f).length, INITIAL_STUDENTS.length);
  assert.equal(isSubset(getSet(INITIAL_STUDENTS, "Honors"), p), true);
});

test("relation, domain, range, inverse", () => {
  const R = buildRelation(INITIAL_STUDENTS);
  assert.equal(R.length, 10);
  assert.equal(hasPair(R, "Ana Reyes", "Math"), true);
  assert.equal(hasPair(R, "Ana Reyes", "Database"), false);
  assert.equal(domainOf(R, INITIAL_STUDENTS.map((s) => s.name)).length, 5);
  assert.deepEqual(rangeOf(R), ["Math", "Programming", "Database"]);
  assert.deepEqual(inverseOf(R)[0], ["Math", "Ana Reyes"]);
});
