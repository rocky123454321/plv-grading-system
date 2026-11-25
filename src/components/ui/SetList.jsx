import { CircleSlash } from "lucide-react";

/** Renders an array as a mathematical set: { a, b, c }. */
export default function SetList({ items }) {
  if (items.length === 0)
    return (
      <span className="set-empty">
        <CircleSlash size={14} aria-hidden="true" /> ∅ (empty set)
      </span>
    );
  return (
    <span className="set-list">
      <span className="set-brace">{"{"}</span>
      {items.map((x) => (
        <span className="item" key={x}>{x}</span>
      ))}
      <span className="set-brace">{"}"}</span>
    </span>
  );
}
