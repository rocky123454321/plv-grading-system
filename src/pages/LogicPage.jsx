import { useState } from "react";
import { Equal, EqualNot, Sigma, UserSearch } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Tag from "../components/ui/Tag";
import TF from "../components/ui/TF";
import Formula from "../components/ui/Formula";
import { STATEMENTS, classify, compareStatements, evaluate, getStatement, makeAllRows } from "../lib/logic";
import { getStatus } from "../lib/grading";

const KIND_TONE = { tautology: "good", contradiction: "bad", contingency: "neutral" };

function StatementSelect({ id, value, onChange, label }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {STATEMENTS.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  );
}

function TruthTable({ statement, highlight }) {
  const kind = classify(statement);
  const sameRow = (row) => highlight && row.every((v, i) => v === highlight[i]);

  return (
    <>
      <p className="statement-line">
        <b>{statement.name}</b>: <Formula>{statement.text}</Formula>
        <Tag tone={KIND_TONE[kind.kind]}>{kind.label} ({kind.detail})</Tag>
      </p>
      <div className="table-wrap">
        <table className="truth-table">
          <thead>
            <tr><th>A</th><th>B</th><th>C</th><th>D</th><th>Result</th></tr>
          </thead>
          <tbody>
            {makeAllRows().map((row, i) => (
              <tr key={i} className={sameRow(row) ? "row-hit" : ""} style={{ animationDelay: `${i * 30}ms` }}>
                {row.map((v, c) => <td key={c}><TF value={v} /></td>)}
                <td><TF value={evaluate(statement, row)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {highlight && <p className="legend">The highlighted row is the selected student's A, B, C, D values.</p>}
    </>
  );
}

function Equivalence() {
  const [oneId, setOneId] = useState("failed");
  const [twoId, setTwoId] = useState("demorgan");
  const one = getStatement(oneId);
  const two = getStatement(twoId);
  const { equivalent, differentRows, total } = compareStatements(one, two);

  return (
    <>
      <div className="row">
        <StatementSelect id="equivOne" value={oneId} onChange={setOneId} label="First statement" />
        <span className="equiv-sign" aria-hidden="true">≡ ?</span>
        <StatementSelect id="equivTwo" value={twoId} onChange={setTwoId} label="Second statement" />
      </div>
      <div className="result" role="status">
        {equivalent ? (
          <>
            <Tag tone="good" icon={Equal}>Equivalent</Tag>{" "}
            <Formula>{one.text}</Formula> ≡ <Formula>{two.text}</Formula>. They match in all {total} rows
            (this is how De Morgan's law is proven).
          </>
        ) : (
          <>
            <Tag tone="bad" icon={EqualNot}>Not equivalent</Tag>{" "}
            They give different results in {differentRows.length} of {total} rows.
          </>
        )}
      </div>
    </>
  );
}

/** Plug a real student into the formulas and watch each one evaluate. */
function StudentInspector({ students, studentId, onChange }) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return <p className="empty">Add a student on the Grades page to inspect them here.</p>;

  const st = getStatus(student);
  const values = { A: st.A, B: st.B, C: st.C, D: st.D };
  const letter = (m) => (values[m] ? "T" : "F");

  return (
    <>
      <div className="row">
        <select value={studentId} onChange={(e) => onChange(e.target.value)} aria-label="Student">
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <span className="muted">
          Grades {student.grades.join(", ")} · average {st.average.toFixed(2)}
        </span>
      </div>

      <div className="props">
        {["A", "B", "C", "D"].map((p) => (
          <div key={p} className="prop">
            <b>{p}</b><TF value={values[p]} />
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th className="left">Statement</th><th className="left">With this student's values</th><th>Result</th></tr>
          </thead>
          <tbody>
            {STATEMENTS.map((s) => (
              <tr key={s.id}>
                <td className="left">{s.name}</td>
                <td className="left"><Formula>{s.text.replace(/[ABCD]/g, letter)}</Formula></td>
                <td><TF value={s.check(st.A, st.B, st.C, st.D)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function LogicPage({ students }) {
  const [statementId, setStatementId] = useState("passed");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const student = students.find((s) => s.id === studentId);
  const highlight = student ? (({ A, B, C, D }) => [A, B, C, D])(getStatus(student)) : null;

  return (
    <section className="panel">
      <PageHeader icon={Sigma} title="Truth table">
        Pick a statement to see its truth table over A, B, C, D and what kind of statement it is.
      </PageHeader>
      <div className="row">
        <label htmlFor="statementSelect">Statement</label>
        <StatementSelect id="statementSelect" value={statementId} onChange={setStatementId} label="Statement" />
      </div>
      <TruthTable statement={getStatement(statementId)} highlight={highlight} />

      <h3 className="subhead"><UserSearch size={18} aria-hidden="true" /> Try it on a student</h3>
      <p className="note">Replace A, B, C, D with a real student's results and evaluate every statement.</p>
      <StudentInspector students={students} studentId={studentId} onChange={setStudentId} />

      <h3 className="subhead"><Equal size={18} aria-hidden="true" /> Logical equivalence checker</h3>
      <p className="note">Two statements are equivalent if they have the same result in every row.</p>
      <Equivalence />
    </section>
  );
}
