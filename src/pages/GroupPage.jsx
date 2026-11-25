import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sigma } from "lucide-react";
import { MEMBERS } from "../data/members";
import Button from "../components/ui/Button";

const PHONE_WIDTH = 820;

/** Scroll-driven member showcase: the scroll position decides which member is on screen. */
export default function GroupPage({ onNavigate }) {
  const panelRef = useRef(null);
  const stageRef = useRef(null);
  const ghostRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [photoOk, setPhotoOk] = useState(false);
  const [isPhone, setIsPhone] = useState(window.innerWidth <= PHONE_WIDTH);

  const member = MEMBERS[index];

  useEffect(() => {
    const update = () => {
      const scrollable = panelRef.current.offsetHeight - stageRef.current.offsetHeight;
      const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      const next = Math.min(MEMBERS.length - 1, Math.floor(progress * MEMBERS.length));
      ghostRef.current.style.transform = `translate(calc(-50% + ${-progress * 8}vw), -50%)`;
      setIndex(next);
    };
    const onResize = () => {
      setIsPhone(window.innerWidth <= PHONE_WIDTH);
      update();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Reset the photo state whenever the member changes (the symbol shows until the photo loads).
  useEffect(() => setPhotoOk(false), [index]);

  // Keep the name on one line on desktop, two lines on phones.
  const longest = isPhone
    ? Math.max(member.first.length, member.last.length)
    : member.first.length + member.last.length;
  const nameSize = isPhone ? Math.min(13, 100 / longest) : Math.min(8.5, 92 / longest);

  const scrollToMember = (i) => {
    const scrollable = panelRef.current.offsetHeight - stageRef.current.offsetHeight;
    window.scrollTo({ top: (scrollable * (i + 0.5)) / MEMBERS.length, behavior: "smooth" });
  };

  const number = String(index + 1).padStart(2, "0");

  return (
    <section id="groupPanel" ref={panelRef}>
      <div className="stage" ref={stageRef}>
        <div className="ghost" ref={ghostRef} aria-hidden="true">DISCRETE</div>

        <div className="dots">
          {MEMBERS.map((m, i) => (
            <button
              key={m.full}
              className={i === index ? "on" : ""}
              onClick={() => scrollToMember(i)}
              aria-label={`Show ${m.full}`}
            />
          ))}
        </div>
        <div className="hint">Scroll</div>

        <div className="badge">
          <div>Member {number}</div>
          <span className="pill">{member.role}</span>
        </div>

        <div className="glyph" key={`glyph-${index}`}>
          <img
            src={member.photo}
            alt={member.full}
            className={photoOk ? "ok swap" : ""}
            onLoad={() => setPhotoOk(true)}
            onError={() => setPhotoOk(false)}
          />
          {!photoOk && <span className="swap" aria-hidden="true">{member.glyph}</span>}
        </div>

        <div className="hero">
          <h1 className="name swap" key={`name-${index}`} style={{ fontSize: `${nameSize}vw` }}>
            <span className="first">{member.first}</span>
            <span className="last">{member.last}</span>
          </h1>
          <div className="meta">
            <p className="sub">Discrete Mathematics</p>
            <div className="count">
              <b>{number}</b>
              <div>
                <em>/ 0{MEMBERS.length}</em>
                <span>{member.full}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="concepts">
            <div className="label">Concepts used</div>
            <span className="chip" style={{ "--c": "#ff1f2d" }}>Logic</span>
            <span className="chip" style={{ "--c": "#3ddc84" }}>Sets</span>
            <span className="chip" style={{ "--c": "#a855f7" }}>Relations</span>
          </div>
          <div className="actions">
            <Button variant="white" icon={ArrowRight} onClick={() => onNavigate("students")}>
              Open project
            </Button>
            <Button variant="outline" icon={Sigma} onClick={() => onNavigate("logic")}>
              See logic
            </Button>
          </div>
          <div className="about">
            <div className="label">About the project</div>
            <p>
              Student Grading &amp; Eligibility System. Grades are checked with propositional
              logic, students are grouped with sets, and enrollment is modeled as a relation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
