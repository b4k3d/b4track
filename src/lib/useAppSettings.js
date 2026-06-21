import { useState, useEffect } from 'react';

export function useAppSettings() {
  const [history, setHistory] = useState([]);
  const [autoCopy, setAutoCopy] = useState(true);
  const [oneTapClean, setOneTapClean] = useState(true);
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('b4track_history');
    if (saved) setHistory(JSON.parse(saved));

    const ac = localStorage.getItem('b4track_autocopy');
    if (ac !== null) setAutoCopy(ac === 'true');

    const otc = localStorage.getItem('b4track_onetap');
    if (otc !== null) setOneTapClean(otc === 'true');

    const ag = localStorage.getItem('b4track_aggressive');
    if (ag !== null) setAggressiveMode(ag === 'true');

    // Default to system preference if no saved value
    const dm = localStorage.getItem('b4track_darkmode');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = dm !== null ? dm === 'true' : systemDark;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('b4track_history', JSON.stringify(newHistory));
  };

  const toggleDarkMode = (val) => {
    setDarkMode(val);
    localStorage.setItem('b4track_darkmode', String(val));
    document.documentElement.classList.toggle('dark', val);
  };

  const setAutoCopyPersist = (v) => { setAutoCopy(v); localStorage.setItem('b4track_autocopy', v); };
  const setOneTapCleanPersist = (v) => { setOneTapClean(v); localStorage.setItem('b4track_onetap', v); };
  const setAggressiveModePersist = (v) => { setAggressiveMode(v); localStorage.setItem('b4track_aggressive', v); };

  return {
    history, saveHistory,
    autoCopy, setAutoCopy: setAutoCopyPersist,
    oneTapClean, setOneTapClean: setOneTapCleanPersist,
    aggressiveMode, setAggressiveMode: setAggressiveModePersist,
    darkMode, toggleDarkMode,
  };
}