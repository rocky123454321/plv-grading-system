import { ArrowLeftRight, Check, Network } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SetList from "../components/ui/SetList";
import { SUBJECTS } from "../data/constants";
import { buildRelation, cartesianSize, domainOf, hasPair, rangeOf, studentsOf } from "../lib/relations";

export default function RelationsPage({ students, actions }) {
  const R = buildRelation(students);
  const names = students.map((s) => s.name);
  const domain = domainOf(R, names);
  const range = rangeOf(R);
  const product = cartesianSize(names.length);

  return (
    <section className="panel">
      <PageHeader icon={Network} title="Enrollment relation">
        R ⊆ S × T, where S is the set of students and T is the set of subjects. Click a cell to enroll or drop.
      </PageHeader>

      <div className="stats stats-compact">
        <div className="stat"><b>{names.length}</b><span>|S| students</span></div>
        <div className="stat"><b>{SUBJECTS.length}</b><span>|T| subjects</span></div>
        <div className="stat"><b>{product}</b><span>|S × T| possible pairs</span></div>
        <div className="stat stat-good"><b>{R.length}</b><span>|R| enrolled pairs</span></div>
      </div>

      {names.length === 0 ? (
        <p className="empty">No students yet. Add students on the Grades page.</p>
      ) : (
        <div className="table-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th className="left">S \ T</th>
                {SUBJECTS.map((t) => <th key={t}>{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="left">{s.name}</td>
                  {SUBJECTS.map((t) => {
                    const on = hasPair(R, s.name, t);
                    return (
                      <td key={t}>
                        <button
                          className={on ? "cell cell-on" : "cell"}
                          aria-pressed={on}
                          aria-label={`${s.name}, ${t}: ${on ? "enrolled" : "not enrolled"}`}
                          onClick={() => actions.toggleSubject(s.id, t)}
                        >
                          {on ? <><Check size={14} aria-hidden="true" /> in R</> : "–"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="result">
        <b>R</b> = {"{ "}
        {R.length === 0 ? "∅" : R.map(([s, t]) => `(${s}, ${t})`).join(", ")}
        {" }"}
      </div>

      <dl className="facts">
        <div><dt>Domain (students in at least one subject)</dt><dd><SetList items={domain} /></dd></div>
        <div><dt>Range (subjects with at least one student)</dt><dd><SetList items={range} /></dd></div>
      </dl>

      <h3 className="subhead">
        <ArrowLeftRight size={18} aria-hidden="true" /> Inverse relation R<sup>-1</sup>
      </h3>
      <p className="note">Every pair (student, subject) is flipped into (subject, student).</p>
      <ul className="inverse">
        {SUBJECTS.map((t) => (
          <li key={t}>
            <b>{t}</b> → <SetList items={studentsOf(R, t)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
