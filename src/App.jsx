import { useCallback, useEffect, useState } from "react";
import Header from "./components/layout/Header";
import Loader from "./components/layout/Loader";
import Cursor from "./components/layout/Cursor";
import GroupPage from "./pages/GroupPage";
import StudentsPage from "./pages/StudentsPage";
import LogicPage from "./pages/LogicPage";
import SetsPage from "./pages/SetsPage";
import RelationsPage from "./pages/RelationsPage";
import { NAV_ITEMS } from "./data/navigation";
import { useHashTab } from "./hooks/useHashTab";
import { useStudents } from "./hooks/useStudents";
import { useTheme } from "./hooks/useTheme";

const TAB_IDS = NAV_ITEMS.map((item) => item.id);

export default function App() {
  const [tab, go] = useHashTab(TAB_IDS, "group");
  const [theme, setTheme] = useTheme();
  const { students, ...actions } = useStudents();
  const [loading, setLoading] = useState(true);

  const finishLoading = useCallback(() => setLoading(false), []);

  // Lock scrolling while the start-up screen is visible.
  useEffect(() => {
    document.body.classList.toggle("loading", loading);
  }, [loading]);

  return (
    <>
      {loading && <Loader onDone={finishLoading} />}
      <Cursor />
      <Header active={tab} onNavigate={go} theme={theme} onThemeChange={setTheme} />

      <main>
        {tab === "group" && <GroupPage onNavigate={go} />}
        {tab === "students" && <StudentsPage students={students} actions={actions} />}
        {tab === "logic" && <LogicPage students={students} />}
        {tab === "sets" && <SetsPage students={students} />}
        {tab === "relations" && <RelationsPage students={students} actions={actions} />}
      </main>
    </>
  );
}
