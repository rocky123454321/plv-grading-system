import { useCallback } from "react";
import { INITIAL_STUDENTS } from "../data/students";
import { STORAGE_KEYS } from "../data/constants";
import { clampGrade, validateNewStudent } from "../lib/grading";
import { useLocalStorage } from "./useLocalStorage";

/** All student records plus the actions that change them. */
export function useStudents() {
  const [students, setStudents] = useLocalStorage(STORAGE_KEYS.students, INITIAL_STUDENTS);

  const setGrade = useCallback((id, gradeIndex, value) => {
    setStudents((list) =>
      list.map((s) => {
        if (s.id !== id) return s;
        const grades = [...s.grades];
        grades[gradeIndex] = clampGrade(value);
        return { ...s, grades };
      })
    );
  }, [setStudents]);

  const toggleSubject = useCallback((id, subject) => {
    setStudents((list) =>
      list.map((s) => {
        if (s.id !== id) return s;
        const enrolled = s.enrolled.includes(subject)
          ? s.enrolled.filter((x) => x !== subject)
          : [...s.enrolled, subject];
        return { ...s, enrolled };
      })
    );
  }, [setStudents]);

  const removeStudent = useCallback((id) => {
    setStudents((list) => list.filter((s) => s.id !== id));
  }, [setStudents]);

  /** Returns an error message, or "" when the student was added. */
  const addStudent = useCallback((name, grades) => {
    const error = validateNewStudent(name, grades, students);
    if (error) return error;
    setStudents((list) => [
      ...list,
      { id: `s${Date.now()}`, name: name.trim(), grades, enrolled: [] },
    ]);
    return "";
  }, [students, setStudents]);

  const resetStudents = useCallback(() => setStudents(INITIAL_STUDENTS), [setStudents]);

  return { students, setGrade, toggleSubject, removeStudent, addStudent, resetStudents };
}
