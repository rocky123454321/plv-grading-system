import { useEffect, useState } from "react";

const SYMBOLS = ["∧", "∨", "¬", "→", "∪", "∩", "∈", "∀"];
const DURATION = 2200; // ms

/** Start-up screen: a spinning logic symbol and a progress bar. Calls onDone when finished. */
export default function Loader({ onDone }) {
  const [percent, setPercent] = useState(0);
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const start = Date.now();
    let exitTimer;
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setPercent(p);
      setSymbol(SYMBOLS[Math.floor(elapsed / 280) % SYMBOLS.length]);
      if (p >= 100) {
        clearInterval(timer);
        exitTimer = setTimeout(() => {
          setLeaving(true);
          setTimeout(onDone, 600);
        }, 250);
      }
    }, 40);
    return () => {
      clearInterval(timer);
      clearTimeout(exitTimer);
    };
  }, [onDone]);

  return (
    <div id="loader" className={leaving ? "done" : ""} role="status" aria-live="polite">
      <div className="loader-ring">
        <div className="loader-symbol" aria-hidden="true">{symbol}</div>
      </div>
      <div className="loader-title">Discrete <span>Math</span></div>
      <div className="loader-bar"><i style={{ width: `${percent}%` }} /></div>
      <div className="loader-percent">{percent}%</div>
    </div>
  );
}
