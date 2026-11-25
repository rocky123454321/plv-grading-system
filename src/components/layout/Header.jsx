import { Moon, Sun } from "lucide-react";
import { NAV_ITEMS } from "../../data/navigation";

export default function Header({ active, onNavigate, theme, onThemeChange }) {
  return (
    <header id="topbar">
      <a className="brand" href="#group" onClick={() => window.scrollTo(0, 0)}>
        Discrete Math
        <span>PLV · Final project</span>
      </a>

      <nav id="tabs" aria-label="Pages">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={active === id ? "active" : ""}
            aria-current={active === id ? "page" : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="theme" role="group" aria-label="Color theme">
        <button
          className={theme === "light" ? "on" : ""}
          onClick={() => onThemeChange("light")}
          aria-pressed={theme === "light"}
        >
          <Sun size={14} aria-hidden="true" /> Light
        </button>
        <button
          className={theme === "dark" ? "on" : ""}
          onClick={() => onThemeChange("dark")}
          aria-pressed={theme === "dark"}
        >
          <Moon size={14} aria-hidden="true" /> Dark
        </button>
      </div>
    </header>
  );
}
