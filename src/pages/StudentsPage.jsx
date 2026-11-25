import { useState } from "react";
import { Award, GraduationCap, Plus, RotateCcw, Trash2, TrendingUp, UserCheck, UserX, Users } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Tag from "../components/ui/Tag";
import TF from "../components/ui/TF";
import { getStatus } from "../lib/grading";
import { SUBJECTS } from "../data/constants";

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className={`stat stat-${tone || "neutral"}`}>
      <Icon size={18} aria-hidden="true" />
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function AddStudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [grades, setGrades] = useState(["", "", ""]);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const message = onAdd(name, grades.map(parseFloat));
    setError(message);
    if (!message) {
      setName("");
      setGrades(["", "", ""]);
    }
  };

  const setGradeAt = (i, v) => setGrades((g) => g.map((x, idx) => (idx === i ? v : x)));

  return (
    <form className="row add-form" onSubmit={submit} noValidate>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" aria-label="Student name" />
      {["Prelim", "Midterm", "Final"].map((label, i) => (
        <input
          key={label}
          type="number" min="0" max="100"
          value={grades[i]}
          onChange={(e) => setGradeAt(i, e.target.value)}
          placeholder={label}
          aria-label={`${label} grade`}
        />
      ))}
      <Button type="submit" icon={Plus}>Add student</Button>
      {error && <span className="error" role="alert">{error}</span>}
    </form>
  );
}

export default function StudentsPage({ students, actions }) {
  const statuses = students.map(getStatus);
  const passed = statuses.filter((s) => s.passed).length;
  const honors = statuses.filter((s) => s.honors).length;
  const classAverage = students.length
    ? statuses.reduce((sum, s) => sum + s.average, 0) / students.length
    : 0;

  return (
    <section className="panel">
      <PageHeader
        icon={GraduationCap}
        title="Student records"
        action={<Button variant="outline" icon={RotateCcw} onClick={actions.resetStudents}>Reset sample data</Button>}
      >
        Edit any grade or enrollment. The status columns are computed with propositional logic.
      </PageHeader>

      <div className="stats">
        <Stat icon={Users} label="Students" value={students.length} />
        <Stat icon={UserCheck} label="Passed" value={passed} tone="good" />
        <Stat icon={UserX} label="Failed" value={students.length - passed} tone="bad" />
        <Stat icon={Award} label="Honors" value={honors} tone="gold" />
        <Stat icon={TrendingUp} label="Class average" value={classAverage.toFixed(1)} />
      </div>

      <AddStudentForm onAdd={actions.addStudent} />

      {students.length === 0 ? (
        <p className="empty">No students yet. Add one above, or reset the sample data.</p>
      ) : (
        <div className="table-wrap">
          <table className="students-table">
            <thead>
              <tr>
                <th className="left">Name</th>
                <th>Prelim</th><th>Midterm</th><th>Final</th><th>Avg</th>
                <th title="Prelim ≥ 75">A</th><th title="Midterm ≥ 75">B</th>
                <th title="Final ≥ 75">C</th><th title="Average ≥ 90">D</th>
                <th>Result</th><th>Honors</th>
                <th className="left">Enrolled</th>
                <th><span className="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => {
                const st = statuses[i];
                return (
                  <tr key={student.id}>
                    <td className="left name-cell">{student.name}</td>
                    {student.grades.map((grade, g) => (
                      <td key={g}>
                        <input
                          type="number" min="0" max="100"
                          value={grade}
                          aria-label={`${student.name} grade ${g + 1}`}
                          onChange={(e) => actions.setGrade(student.id, g, e.target.value)}
                        />
                      </td>
                    ))}
                    <td>{st.average.toFixed(2)}</td>
                    <td><TF value={st.A} /></td>
                    <td><TF value={st.B} /></td>
                    <td><TF value={st.C} /></td>
                    <td><TF value={st.D} /></td>
                    <td>
                      <Tag tone={st.passed ? "good" : "bad"}>{st.passed ? "Passed" : "Failed"}</Tag>
                    </td>
                    <td>{st.honors ? <Tag tone="gold" icon={Award}>Honors</Tag> : "–"}</td>
                    <td className="left">
                      {SUBJECTS.map((subject) => (
                        <label className="checkbox-label" key={subject}>
                          <input
                            type="checkbox"
                            checked={student.enrolled.includes(subject)}
                            onChange={() => actions.toggleSubject(student.id, subject)}
                          />
                          {subject}
                        </label>
                      ))}
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        title="Remove student"
                        aria-label={`Remove ${student.name}`}
                        onClick={() => actions.removeStudent(student.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="legend">
        A: Prelim ≥ 75 &nbsp; B: Midterm ≥ 75 &nbsp; C: Final ≥ 75 &nbsp; D: Average ≥ 90<br />
        Passed = A ∧ B ∧ C &nbsp;|&nbsp; Honors = Passed ∧ D
      </p>
    </section>
  );
}
