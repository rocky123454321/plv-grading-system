import { useCallback, useEffect, useState } from "react";

/** Keeps the active page in the URL hash (#logic) so links and refresh work without a router. */
export function useHashTab(validIds, fallback) {
  const read = () => {
    const id = window.location.hash.replace("#", "");
    return validIds.includes(id) ? id : fallback;
  };
  const [tab, setTab] = useState(read);

  useEffect(() => {
    const onHashChange = () => setTab(read());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback((id) => {
    window.location.hash = id;
    window.scrollTo(0, 0);
  }, []);

  return [tab, go];
}
