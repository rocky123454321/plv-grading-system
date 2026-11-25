import { useEffect, useRef } from "react";

/** Red circle cursor. Only runs on devices with a mouse; says "Scroll" over the member name. */
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    document.body.classList.add("has-cursor");

    const move = (e) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.classList.add("shown");
      const overName = e.target.closest(".name") !== null;
      const overLink = e.target.closest("button, a, input, select, label") !== null;
      el.classList.toggle("big", overName);
      el.classList.toggle("link", overLink && !overName);
    };
    const leave = () => el.classList.remove("shown");

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("has-cursor");
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div id="cursor" ref={ref} aria-hidden="true">
      <span>Scroll</span>
    </div>
  );
}
