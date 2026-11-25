import { useState } from "react";
import { Braces } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SetList from "../components/ui/SetList";
import Tag from "../components/ui/Tag";
import VennDiagram from "../components/ui/VennDiagram";
import { OPERATIONS, SET_NAMES, complement, getSet, isDisjoint, isSubset } from "../lib/sets";

function YesNo({ value }) {
  return <Tag tone={value ? "good" : "bad"}>{value ? "Yes" : "No"}</Tag>;
}

export default function SetsPage({ students }) {
  const [nameX, setNameX] = useState("Math");
  const [nameY, setNameY] = useState("Programming");
  const [operation, setOperation] = useState("union");

  const X = getSet(students, nameX);
  const Y = getSet(students, nameY);
  const everyone = students.map((s) => s.name);
  const chosen = OPERATIONS[operation];
  const answer = chosen.run(X, Y);

  return (
    <section className="panel">
      <PageHeader icon={Braces} title="Set operations">
        Sets come from the student records: one set per subject, plus Passed, Honors and Failed.
      </PageHeader>

      <div className="row">
        <select value={nameX} onChange={(e) => setNameX(e.target.value)} aria-label="Set X">
          {SET_NAMES.map((n) => <option key={n}>{n}</option>)}
        </select>
        <select value={operation} onChange={(e) => setOperation(e.target.value)} aria-label="Operation">
          {Object.entries(OPERATIONS).map(([key, op]) => (
            <option key={key} value={key}>{op.label} ({op.eq})</option>
          ))}
        </select>
        <select value={nameY} onChange={(e) => setNameY(e.target.value)} aria-label="Set Y">
          {SET_NAMES.map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>

      <VennDiagram X={X} Y={Y} nameX={nameX} nameY={nameY} operation={operation} />

      <div className="set-lines">
        <p>X = {nameX} = <SetList items={X} /></p>
        <p>Y = {nameY} = <SetList items={Y} /></p>
      </div>

      <div className="result" role="status">
        <b>{chosen.eq}</b> = <SetList items={answer} />
        <br /><small>Number of elements: {answer.length}</small>
      </div>

      <dl className="facts">
        <div><dt>Complement of X (everyone not in X)</dt><dd><SetList items={complement(everyone, X)} /></dd></div>
        <div><dt>X ⊆ Y?</dt><dd><YesNo value={isSubset(X, Y)} /></dd></div>
        <div><dt>Y ⊆ X?</dt><dd><YesNo value={isSubset(Y, X)} /></dd></div>
        <div><dt>Disjoint (X ∩ Y = ∅)?</dt><dd><YesNo value={isDisjoint(X, Y)} /></dd></div>
      </dl>
    </section>
  );
}
