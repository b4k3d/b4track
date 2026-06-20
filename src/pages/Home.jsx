import { useState, useEffect } from 'react';
import { Link2, Sparkles, Copy, Share2, Clock, Settings, Home, CheckCheck, ShieldCheck, Sun, Moon, X, Zap } from 'lucide-react';
import { cleanUrl, cleanUrlDetailed, extractUrls, TRACKING_PARAMS } from '@/lib/urlCleaner';
import { toast } from 'sonner';
import CleanResultModal from '@/components/CleanResultModal';

export default function HomePage() {
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [autoCopy, setAutoCopy] = useState(true);
  const [oneTapClean, setOneTapClean] = useState(true);
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [modalResult, setModalResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('b4track_history');
    if (saved) setHistory(JSON.parse(saved));
    const ac = localStorage.getItem('b4track_autocopy');
    if (ac !== null) setAutoCopy(ac === 'true');
    const otc = localStorage.getItem('b4track_onetap');
    if (otc !== null) setOneTapClean(otc === 'true');
    const ag = localStorage.getItem('b4track_aggressive');
    if (ag !== null) setAggressiveMode(ag === 'true');
    const dm = localStorage.getItem('b4track_darkmode');
    const isDark = dm !== null ? dm === 'true' : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);

    const params = new URLSearchParams(window.location.search);
    const shareUrl = params.get('share_url') || params.get('url') || params.get('text');
    if (shareUrl) {
      const urls = extractUrls(shareUrl);
      const target = urls.length > 0 ? urls[0] : shareUrl;
      const { cleaned, removed } = cleanUrlDetailed(target, aggressiveMode);
      const entry = { id: Date.now(), original: target, cleaned, removed: removed || [], timestamp: new Date().toISOString() };
      const saved2 = localStorage.getItem('b4track_history');
      const hist = saved2 ? JSON.parse(saved2) : [];
      const newHistory = [entry, ...hist].slice(0, 50);
      localStorage.setItem('b4track_history', JSON.stringify(newHistory));
      setHistory(newHistory);
      setModalResult({ type: 'single', entries: [entry] });
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('b4track_history', JSON.stringify(newHistory));
  };

  const toggleDarkMode = (val) => {
    setDarkMode(val);
    localStorage.setItem('b4track_darkmode', val);
    document.documentElement.classList.toggle('dark', val);
  };

  const handleClean = () => {
    if (!inputUrl.trim()) { toast.error('Please enter a URL first'); return; }
    const { cleaned, removed } = cleanUrlDetailed(inputUrl.trim(), aggressiveMode);
    const entry = { id: Date.now(), original: inputUrl.trim(), cleaned, removed: removed || [], timestamp: new Date().toISOString() };
    const newHistory = [entry, ...history].slice(0, 50);
    saveHistory(newHistory);
    if (autoCopy) navigator.clipboard.writeText(cleaned).catch(() => {});
    setInputUrl('');
    setModalResult({ type: 'single', entries: [entry] });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputUrl(text);
      if (oneTapClean && text.trim()) {
        setTimeout(() => {
          const { cleaned, removed } = cleanUrlDetailed(text.trim(), aggressiveMode);
          const entry = { id: Date.now(), original: text.trim(), cleaned, removed: removed || [], timestamp: new Date().toISOString() };
          const newHistory = [entry, ...history].slice(0, 50);
          saveHistory(newHistory);
          if (autoCopy) navigator.clipboard.writeText(cleaned).catch(() => {});
          setInputUrl('');
          setModalResult({ type: 'single', entries: [entry] });
        }, 100);
      }
    } catch {
      toast.error('Clipboard access denied');
    }
  };

  const handleSanitizeClipboard = async () => {
    let text;
    try {
      text = await navigator.clipboard.readText();
    } catch {
      toast.error('Clipboard access denied');
      return;
    }
    const urls = extractUrls(text);
    if (urls.length === 0) { toast.error('No URLs found in clipboard'); return; }

    const entries = urls.map((u) => {
      const { cleaned, removed } = cleanUrlDetailed(u, aggressiveMode);
      return { id: Date.now() + Math.random(), original: u, cleaned, removed: removed || [], timestamp: new Date().toISOString() };
    });

    let cleanedText = text;
    entries.forEach((e) => { cleanedText = cleanedText.replace(e.original, e.cleaned); });
    navigator.clipboard.writeText(cleanedText).catch(() => {});

    const newHistory = [...entries, ...history].slice(0, 50);
    saveHistory(newHistory);
    setModalResult({ type: 'clipboard', entries });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success('Copied!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const shareUrl = async (url) => {
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      copyToClipboard(url, null);
      toast.success('Link copied (share not supported)');
    }
  };

  const clearHistory = () => { saveHistory([]); toast.success('History cleared'); };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' • ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const totalTrackersDodged = history.reduce((sum, item) => sum + (item.removed?.length || 0), 0);

  // Shorthand theme classes
  const d = darkMode;
  const bg      = d ? 'bg-[#0d0d1a]'   : 'bg-gray-100';
  const card    = d ? 'bg-[#16162a]'   : 'bg-white';
  const cardInner = d ? 'bg-[#0d0d1a]' : 'bg-gray-50';
  const border  = d ? 'border-[#2a2a4a]' : 'border-gray-200';
  const borderInput = d ? 'border-[#3a3a6a]' : 'border-gray-300';
  const heading = d ? 'text-white'      : 'text-gray-900';
  const subtext = d ? 'text-gray-400'  : 'text-gray-500';
  const muted   = d ? 'text-gray-500'  : 'text-gray-400';
  const inputText = d ? 'text-gray-300' : 'text-gray-800';
  const navBg   = d ? 'bg-[#12121f]'   : 'bg-white';
  const divider = d ? 'bg-[#2a2a4a]'   : 'bg-gray-200';

  return (
    <div className={`min-h-screen ${bg} flex flex-col max-w-md mx-auto relative`}>

      {/* Hamburger Drawer Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className={`relative w-64 h-full ${d ? 'bg-[#12121f] border-r border-[#2a2a4a]' : 'bg-white border-r border-gray-200'} flex flex-col p-6 pt-14 z-10`}>
            <button onClick={() => setMenuOpen(false)} className={`absolute top-4 right-4 ${subtext} hover:${heading} transition-colors`}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black tracking-wider mb-8">
              <span className={heading}>B4</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">TRACK</span>
            </h2>
            <nav className="space-y-1 flex-1">
              {[
                { icon: <Home className="w-5 h-5" />, label: 'Home', tab: 'home' },
                { icon: <Clock className="w-5 h-5" />, label: 'History', tab: 'history' },
                { icon: <Settings className="w-5 h-5" />, label: 'Settings', tab: 'settings' },
              ].map(({ icon, label, tab }) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-cyan-500 border border-violet-400/30'
                      : `${subtext} ${d ? 'hover:text-white hover:bg-white/5' : 'hover:text-gray-900 hover:bg-gray-100'}`
                  }`}
                >
                  {icon}{label}
                </button>
              ))}
            </nav>
            {/* Light / Dark toggle — only in hamburger menu */}
            <div className={`pt-4 border-t ${d ? 'border-[#2a2a4a]' : 'border-gray-200'}`}>
              <p className={`text-xs font-medium mb-3 uppercase tracking-widest ${muted}`}>Appearance</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {d ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                  <span className={`text-sm ${subtext}`}>{d ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <button
                  onClick={() => toggleDarkMode(!d)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${d ? 'bg-gradient-to-r from-violet-600 to-cyan-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${d ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4">
        <button className="p-2" onClick={() => setMenuOpen(true)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 ${heading === 'text-white' ? 'bg-white' : 'bg-gray-800'}`}></span>
            <span className={`block w-6 h-0.5 ${d ? 'bg-white' : 'bg-gray-800'}`}></span>
            <span className={`block w-6 h-0.5 ${d ? 'bg-white' : 'bg-gray-800'}`}></span>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4">

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-5">
            {/* Stats strip */}
            {totalTrackersDodged > 0 && (
              <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border ${d ? 'bg-gradient-to-r from-violet-900/30 to-cyan-900/20 border-violet-800/30' : 'bg-violet-50 border-violet-200'}`}>
                <ShieldCheck className={`w-4 h-4 shrink-0 ${d ? 'text-cyan-400' : 'text-violet-600'}`} />
                <p className={`text-sm ${subtext}`}>
                  <span className={`font-bold ${heading}`}>{totalTrackersDodged}</span> trackers dodged across{' '}
                  <span className={`font-bold ${heading}`}>{history.length}</span> links
                </p>
              </div>
            )}

            {/* Input Card */}
            <div className={`${card} rounded-2xl p-5 border ${border} shadow-sm`}>
              <p className={`text-sm font-medium mb-3 ${d ? 'text-violet-400' : 'text-violet-600'}`}>Enter URL to clean</p>
              <div className={`flex items-center gap-3 ${cardInner} border ${borderInput} rounded-xl px-4 py-3 mb-4 focus-within:border-violet-500 transition-colors`}>
                <Link2 className={`w-5 h-5 shrink-0 ${d ? 'text-violet-400' : 'text-violet-500'}`} />
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClean()}
                  placeholder="https://example.com/long-url..."
                  className={`bg-transparent flex-1 text-sm ${inputText} ${d ? 'placeholder-gray-600' : 'placeholder-gray-400'} outline-none`}
                />
                {inputUrl && (
                  <button onClick={() => setInputUrl('')} className={`${subtext} hover:${heading} text-xs`}>✕</button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePaste}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${d ? 'border-[#3a3a6a] text-gray-400 hover:border-violet-500 hover:text-violet-400' : 'border-gray-300 text-gray-600 hover:border-violet-500 hover:text-violet-600 bg-gray-50'}`}
                >
                  📋 Paste
                </button>
                <button
                  onClick={handleClean}
                  className="flex-[2] py-3 rounded-xl font-bold text-white text-base bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30"
                >
                  <Sparkles className="w-5 h-5" />
                  Clean Link
                </button>
              </div>
            </div>

            {/* Sanitize Clipboard */}
            <button
              onClick={handleSanitizeClipboard}
              className={`w-full py-3.5 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${d ? 'border-cyan-700/40 bg-cyan-900/10 text-cyan-400 hover:bg-cyan-900/20 hover:border-cyan-500' : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:border-cyan-400'}`}
            >
              <ShieldCheck className="w-5 h-5" />
              Sanitize Clipboard
            </button>

            {/* History Preview */}
            {history.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`font-bold text-lg ${heading}`}>Recent</h2>
                  <button onClick={clearHistory} className={`text-sm transition-colors ${d ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500'}`}>
                    Clear all
                  </button>
                </div>
                <div className="space-y-3">
                  {history.slice(0, 4).map((item) => (
                    <HistoryCard key={item.id} item={item} copiedId={copiedId} onCopy={copyToClipboard} onShare={shareUrl} formatTime={formatTime} darkMode={d} />
                  ))}
                </div>
              </div>
            )}

            {history.length === 0 && (
              <div className="text-center py-12">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${card} ${border}`}>
                  <Link2 className={`w-7 h-7 ${d ? 'text-violet-400' : 'text-violet-500'}`} />
                </div>
                <p className={`text-sm ${subtext}`}>Paste a URL above to get started</p>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-bold text-xl ${heading}`}>History</h2>
              {history.length > 0 && (
                <button onClick={clearHistory} className={`text-sm transition-colors ${d ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500'}`}>
                  Clear all
                </button>
              )}
            </div>
            {totalTrackersDodged > 0 && (
              <div className="flex gap-3 mb-4">
                <div className={`flex-1 ${card} rounded-xl p-3 border ${border} text-center shadow-sm`}>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">{totalTrackersDodged}</p>
                  <p className={`text-xs ${subtext}`}>Trackers Dodged</p>
                </div>
                <div className={`flex-1 ${card} rounded-xl p-3 border ${border} text-center shadow-sm`}>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">{history.length}</p>
                  <p className={`text-xs ${subtext}`}>Links Cleaned</p>
                </div>
              </div>
            )}
            {history.length === 0 ? (
              <div className="text-center py-16">
                <Clock className={`w-12 h-12 mx-auto mb-3 ${d ? 'text-gray-700' : 'text-gray-300'}`} />
                <p className={subtext}>No history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <HistoryCard key={item.id} item={item} copiedId={copiedId} onCopy={copyToClipboard} onShare={shareUrl} formatTime={formatTime} darkMode={d} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className={`font-bold text-xl ${heading}`}>Settings</h2>

            <div className={`${card} rounded-2xl border ${border} overflow-hidden shadow-sm`}>
              <SettingRow
                icon="📋" iconBg={d ? 'bg-violet-600/20' : 'bg-violet-100'}
                title="Auto-copy to clipboard" description="Automatically copy cleaned link to clipboard"
                value={autoCopy} darkMode={d}
                onChange={(v) => { setAutoCopy(v); localStorage.setItem('b4track_autocopy', v); }}
              />
              <div className={`h-px ${divider}`} />
              <SettingRow
                icon="⚡" iconBg={d ? 'bg-cyan-600/20' : 'bg-cyan-100'}
                title="One-tap Clean" description="Clean link as soon as you paste"
                value={oneTapClean} darkMode={d}
                onChange={(v) => { setOneTapClean(v); localStorage.setItem('b4track_onetap', v); }}
              />
              <div className={`h-px ${divider}`} />
              <SettingRow
                icon="🛡️" iconBg={d ? 'bg-red-600/20' : 'bg-red-100'}
                title="Aggressive Mode" description="Also strips param prefixes: utm_, mtm_, pk_, hsa_, _hs, gclid, gbraid, wbraid, gad_"
                value={aggressiveMode} darkMode={d}
                onChange={(v) => { setAggressiveMode(v); localStorage.setItem('b4track_aggressive', v); }}
              />
            </div>

            {/* About */}
            <div className={`${card} rounded-2xl border ${border} p-5 space-y-4 shadow-sm`}>
              <h3 className={`font-semibold ${heading}`}>About B4TRACK</h3>
              <p className={`text-sm leading-relaxed ${subtext}`}>
                Strip tracking parameters from URLs. Clean & private browsing, powered by open source logic.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/b4k3d" target="_blank" rel="noopener noreferrer"
                  className={`flex-1 py-3 rounded-xl border text-center text-sm transition-all flex items-center justify-center gap-2 ${d ? 'bg-[#0d0d1a] border-[#2a2a4a] text-gray-400 hover:border-violet-500 hover:text-violet-400' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  GitHub
                </a>
                <a href="https://buymeacoffee.com/b4k3d" target="_blank" rel="noopener noreferrer"
                  className={`flex-1 py-3 rounded-xl border text-center text-sm transition-all flex items-center justify-center gap-2 ${d ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-700/30 text-yellow-400 hover:from-yellow-600/30 hover:to-orange-600/30' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>
                  ☕ Buy me a coffee
                </a>
              </div>
            </div>

            {/* Tracker params list */}
            <div className={`${card} rounded-2xl border ${border} p-5 shadow-sm`}>
              <h3 className={`font-semibold mb-1 ${heading}`}>Tracking Parameters Removed</h3>
              <p className={`text-xs mb-3 ${subtext}`}>{TRACKING_PARAMS.size} params across all major platforms</p>
              <div className="flex flex-wrap gap-1.5">
                {[...TRACKING_PARAMS].slice(0, 40).map(p => (
                  <span key={p} className={`px-2 py-1 rounded-md border text-xs font-mono ${d ? 'bg-[#0d0d1a] border-[#2a2a4a] text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>{p}</span>
                ))}
                <span className={`px-2 py-1 rounded-md border text-xs font-mono ${d ? 'bg-[#0d0d1a] border-[#2a2a4a] text-gray-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>+{Math.max(0, TRACKING_PARAMS.size - 40)} more</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${navBg} border-t ${border} px-6 py-3 flex justify-around items-center shadow-lg`}>
        <NavButton icon={<Home className="w-6 h-6" />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} darkMode={d} />
        <NavButton icon={<Clock className="w-6 h-6" />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} darkMode={d} />
        <NavButton icon={<Settings className="w-6 h-6" />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} darkMode={d} />
      </div>

      <CleanResultModal result={modalResult} onClose={() => setModalResult(null)} />
    </div>
  );
}

function HistoryCard({ item, copiedId, onCopy, onShare, formatTime, darkMode: d }) {
  const card    = d ? 'bg-[#16162a]' : 'bg-white';
  const border  = d ? 'border-[#2a2a4a]' : 'border-gray-200';
  const cardInner = d ? 'bg-[#0d0d1a]' : 'bg-gray-50';
  const heading = d ? 'text-white' : 'text-gray-900';
  const muted   = d ? 'text-gray-500' : 'text-gray-400';
  const linkColor = d ? 'text-cyan-400' : 'text-cyan-600';
  const copyColor = d ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500';
  const shareColor = d ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500';

  return (
    <div className={`${card} rounded-2xl p-4 border ${border} flex items-center gap-3 shadow-sm`}>
      <div className={`w-10 h-10 rounded-xl ${cardInner} border ${border} flex items-center justify-center shrink-0`}>
        <Link2 className={`w-5 h-5 ${d ? 'text-violet-400' : 'text-violet-500'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${heading}`}>{item.original}</p>
        <p className={`text-xs truncate ${linkColor}`}>{item.cleaned}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className={`text-xs ${muted}`}>{formatTime(item.timestamp)}</p>
          {item.removed?.length > 0 && (
            <span className={`text-xs font-medium ${d ? 'text-red-400' : 'text-red-500'}`}>−{item.removed.length} tracker{item.removed.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
      <div className="flex gap-3 shrink-0">
        <button onClick={() => onCopy(item.cleaned, item.id)} className={`flex flex-col items-center gap-0.5 transition-colors ${copyColor}`}>
          {copiedId === item.id ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span className="text-[10px]">Copy</span>
        </button>
        <button onClick={() => onShare(item.cleaned)} className={`flex flex-col items-center gap-0.5 transition-colors ${shareColor}`}>
          <Share2 className="w-5 h-5" />
          <span className="text-[10px]">Share</span>
        </button>
      </div>
    </div>
  );
}

function SettingRow({ icon, iconBg, title, description, value, onChange, darkMode: d }) {
  const heading = d ? 'text-white' : 'text-gray-800';
  const subtext = d ? 'text-gray-500' : 'text-gray-500';
  const toggleOff = d ? 'bg-[#2a2a4a]' : 'bg-gray-200';

  return (
    <div className="flex items-center gap-4 p-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-lg shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${heading}`}>{title}</p>
        <p className={`text-xs mt-0.5 ${subtext}`}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${value ? 'bg-gradient-to-r from-violet-600 to-cyan-500' : toggleOff}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function NavButton({ icon, label, active, onClick, darkMode: d }) {
  const activeColor = d ? 'text-cyan-400' : 'text-cyan-600';
  const inactiveColor = d ? 'text-gray-600' : 'text-gray-400';
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[60px]">
      <span className={active ? activeColor : inactiveColor}>{icon}</span>
      <span className={`text-xs font-medium ${active ? activeColor : inactiveColor}`}>{label}</span>
      {active && <span className="w-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />}
    </button>
  );
}