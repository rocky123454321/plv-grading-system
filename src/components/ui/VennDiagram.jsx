import { difference, intersection } from "../../lib/sets";

const W = 640, H = 300;
const X_CIRCLE = { cx: 235, cy: 150, r: 120 };
const Y_CIRCLE = { cx: 405, cy: 150, r: 120 };
const MAX_NAMES = 5;

/** Names stacked in one region of the diagram (long lists are shortened). */
function Names({ items, x }) {
  const shown = items.slice(0, MAX_NAMES);
  const extra = items.length - shown.length;
  const lines = extra > 0 ? [...shown, `+${extra} more`] : shown;
  const top = 150 - ((lines.length - 1) * 18) / 2;
  return (
    <text x={x} textAnchor="middle" className="venn-names">
      {lines.map((line, i) => (
        <tspan key={i} x={x} y={top + i * 18}>{line}</tspan>
      ))}
    </text>
  );
}

/** Two-set Venn diagram. The highlighted region shows the chosen operation. */
export default function VennDiagram({ X, Y, nameX, nameY, operation }) {
  const both = intersection(X, Y);
  const onlyX = difference(X, Y);
  const onlyY = difference(Y, X);

  const accent = "var(--accent)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="venn" role="img"
         aria-label={`Venn diagram of ${nameX} and ${nameY}: ${onlyX.length} only in ${nameX}, ${both.length} in both, ${onlyY.length} only in ${nameY}`}>
      <defs>
        <clipPath id="clipY"><circle {...Y_CIRCLE} /></clipPath>
        <mask id="maskDifference">
          <rect width={W} height={H} fill="black" />
          <circle {...X_CIRCLE} fill="white" />
          <circle {...Y_CIRCLE} fill="black" />
        </mask>
        <mask id="maskSymmetric">
          <rect width={W} height={H} fill="black" />
          <circle {...X_CIRCLE} fill="white" />
          <circle {...Y_CIRCLE} fill="white" />
          <circle {...X_CIRCLE} fill="black" clipPath="url(#clipY)" />
        </mask>
      </defs>

      {/* highlighted result region */}
      <g className="venn-fill" fill={accent}>
        {operation === "union" && (<><circle {...X_CIRCLE} /><circle {...Y_CIRCLE} /></>)}
        {operation === "intersection" && <circle {...X_CIRCLE} clipPath="url(#clipY)" />}
        {operation === "difference" && <rect width={W} height={H} mask="url(#maskDifference)" />}
        {operation === "symmetric" && <rect width={W} height={H} mask="url(#maskSymmetric)" />}
      </g>

      <circle {...X_CIRCLE} className="venn-outline" />
      <circle {...Y_CIRCLE} className="venn-outline" />

      <text x={X_CIRCLE.cx - 50} y="24" textAnchor="middle" className="venn-title">X: {nameX}</text>
      <text x={Y_CIRCLE.cx + 50} y="24" textAnchor="middle" className="venn-title">Y: {nameY}</text>

      <Names items={onlyX} x={165} />
      <Names items={both} x={320} />
      <Names items={onlyY} x={475} />
    </svg>
  );
}