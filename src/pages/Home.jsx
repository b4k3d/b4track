import { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Home, Clock, Settings, Sun, Moon, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cleanUrlDetailed, extractUrls } from '@/lib/urlCleaner';
import { useAppSettings } from '@/lib/useAppSettings';
import { getTheme } from '@/lib/themeClasses';
import HomeTab from './tabs/HomeTab';
import HistoryTab from './tabs/HistoryTab';
import SettingsTab from './tabs/SettingsTab';
import BulkTab from './tabs/BulkTab';
import CleanResultModal from '@/components/CleanResultModal';
import { useState } from 'react';

export default function HomePage() {
  const settings = useAppSettings();
  const { darkMode, toggleDarkMode, history, saveHistory, autoCopy, setAutoCopy, oneTapClean, setOneTapClean, aggressiveMode, setAggressiveMode } = settings;
  const [menuOpen, setMenuOpen] = useState(false);
  const [sharedModalResult, setSharedModalResult] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Refs to each tab's scrollable container for scroll-to-top on active tab tap
  const tabScrollRefs = useRef({});
  const d = darkMode;
  const { bg, navBg, border, heading, subtext, muted } = getTheme(d);

  // Handle incoming share_target URLs
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // Different Android versions/browsers populate different share fields — check the
    // common ones, then fall back to scanning ALL param values for a URL so no variant
    // slips through uncleaned.
    let shareUrl = params.get('share_url') || params.get('url') || params.get('text') || params.get('title') || params.get('link');
    if (!shareUrl) {
      for (const value of params.values()) {
        if (/https?:\/\//i.test(value)) { shareUrl = value; break; }
      }
    }
    if (shareUrl) {
      const urls = extractUrls(shareUrl);
      const target = urls.length > 0 ? urls[0] : shareUrl;
      const { cleaned, removed } = cleanUrlDetailed(target, aggressiveMode);
      const entry = { id: Date.now(), original: target, cleaned, removed: removed || [], timestamp: new Date().toISOString() };
      const saved = localStorage.getItem('b4track_history');
      const hist = saved ? JSON.parse(saved) : [];
      const newHistory = [entry, ...hist].slice(0, 50);
      localStorage.setItem('b4track_history', JSON.stringify(newHistory));
      saveHistory(newHistory);
      setSharedModalResult({ type: 'single', entries: [entry] });
      window.history.replaceState({}, '', '/');
    }
  }, [location.search]);

  const activeTab = location.pathname.replace('/', '') || 'home';

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home', path: '/home' },
    { icon: <Layers className="w-6 h-6" />, label: 'Bulk', path: '/bulk' },
    { icon: <Clock className="w-6 h-6" />, label: 'History', path: '/history' },
    { icon: <Settings className="w-6 h-6" />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={`min-h-screen ${bg} flex flex-col max-w-md mx-auto relative`}>

      {/* Hamburger Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.div
              className={`relative w-64 h-full ${d ? 'bg-[#12121f] border-r border-[#2a2a4a]' : 'bg-white border-r border-gray-200'} flex flex-col p-6 pt-14 z-10`}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <button onClick={() => setMenuOpen(false)} className={`absolute top-4 right-4 ${subtext} transition-colors select-none`} style={{ paddingTop: 'env(safe-area-inset-top)' }}>
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-black tracking-wider mb-8 select-none">
                <span className={heading}>B4</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">TRACK</span>
              </h2>
              <nav className="space-y-1 flex-1">
                {navItems.map(({ icon, label, path }) => (
                  <button
                    key={path}
                    onClick={() => { navigate(path); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all select-none ${
                      location.pathname === path
                        ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-cyan-500 border border-violet-400/30'
                        : `${subtext} ${d ? 'hover:text-white hover:bg-white/5' : 'hover:text-gray-900 hover:bg-gray-100'}`
                    }`}
                  >
                    {icon}{label}
                  </button>
                ))}
              </nav>

              {/* Dark/Light toggle */}
              <div className={`pt-4 border-t ${d ? 'border-[#2a2a4a]' : 'border-gray-200'}`}>
                <p className={`text-xs font-medium mb-3 uppercase tracking-widest ${muted}`}>Appearance</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {d ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                    <span className={`text-sm ${subtext}`}>{d ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <button
                    onClick={() => toggleDarkMode(!d)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative select-none ${d ? 'bg-gradient-to-r from-violet-600 to-cyan-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${d ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pb-4 shrink-0 select-none"
        style={{ paddingTop: 'calc(2.5rem + env(safe-area-inset-top))' }}
      >
        <button className="p-2 select-none" onClick={() => setMenuOpen(true)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 ${d ? 'bg-white' : 'bg-gray-800'}`} />
            <span className={`block w-6 h-0.5 ${d ? 'bg-white' : 'bg-gray-800'}`} />
            <span className={`block w-6 h-0.5 ${d ? 'bg-white' : 'bg-gray-800'}`} />
          </div>
        </button>
        <h1 className="text-2xl font-black tracking-wider">
          <span className={heading}>B4</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">TRACK</span>
        </h1>
        <a href="https://buymeacoffee.com/b4k3d" target="_blank" rel="noopener noreferrer"
          className={`${d ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
          </svg>
        </a>
      </div>

      {/* Always-mounted tabs — hidden via CSS to preserve scroll position and state */}
      <div className="flex-1 relative overflow-hidden">
        {/* Route redirect handler */}
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={null} />
          <Route path="bulk" element={null} />
          <Route path="history" element={null} />
          <Route path="settings" element={null} />
        </Routes>

        {[
          { path: '/home', el: (
            <HomeTab
              history={history} saveHistory={saveHistory}
              autoCopy={autoCopy} oneTapClean={oneTapClean} aggressiveMode={aggressiveMode}
              darkMode={d}
            />
          )},
          { path: '/history', el: (
            <HistoryTab history={history} saveHistory={saveHistory} darkMode={d} />
          )},
          { path: '/settings', el: (
            <SettingsTab
              autoCopy={autoCopy} setAutoCopy={setAutoCopy}
              oneTapClean={oneTapClean} setOneTapClean={setOneTapClean}
              aggressiveMode={aggressiveMode} setAggressiveMode={setAggressiveMode}
              darkMode={d}
            />
          )},
          { path: '/bulk', el: (
            <BulkTab
              history={history} saveHistory={saveHistory}
              aggressiveMode={aggressiveMode}
              darkMode={d}
            />
          )},
        ].map(({ path, el }) => {
          const isActive = location.pathname === path;
          return (
            <motion.div
              key={path}
              ref={el => { if (el) tabScrollRefs.current[path] = el; }}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : (location.pathname > path ? -20 : 20) }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="absolute inset-0 overflow-y-auto"
              style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))', pointerEvents: isActive ? 'auto' : 'none', visibility: isActive ? 'visible' : 'hidden' }}
            >
              {el}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${navBg} border-t ${border} px-6 flex justify-around items-center shadow-lg select-none`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingTop: '0.75rem' }}
      >
        {navItems.map(({ icon, label, path }) => {
          const isActive = location.pathname === path;
          const activeColor = d ? 'text-cyan-400' : 'text-cyan-600';
          const inactiveColor = d ? 'text-gray-600' : 'text-gray-400';
          return (
            <button
              key={path}
              onClick={() => {
                if (isActive) {
                  // Scroll active tab to top
                  const el = tabScrollRefs.current[path];
                  if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate(path);
                }
              }}
              className="flex flex-col items-center gap-1 min-w-[60px] pb-3 select-none"
            >
              <span className={isActive ? activeColor : inactiveColor}>{icon}</span>
              <span className={`text-xs font-medium ${isActive ? activeColor : inactiveColor}`}>{label}</span>
              {isActive && <span className="w-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />}
            </button>
          );
        })}
      </div>

      <CleanResultModal result={sharedModalResult} onClose={() => setSharedModalResult(null)} />
    </div>
  );
}