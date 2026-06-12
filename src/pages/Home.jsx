import { useState, useEffect } from 'react';
import { Link2, Sparkles, Copy, Share2, Trash2, Clock, Settings, Home, CheckCheck } from 'lucide-react';
import { cleanUrl } from '@/lib/urlCleaner';
import { toast } from 'sonner';

export default function HomePage() {
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [autoCopy, setAutoCopy] = useState(true);
  const [oneTapClean, setOneTapClean] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('b4track_history');
    if (saved) setHistory(JSON.parse(saved));
    const ac = localStorage.getItem('b4track_autocopy');
    if (ac !== null) setAutoCopy(ac === 'true');
    const otc = localStorage.getItem('b4track_onetap');
    if (otc !== null) setOneTapClean(otc === 'true');
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('b4track_history', JSON.stringify(newHistory));
  };

  const handleClean = () => {
    if (!inputUrl.trim()) {
      toast.error('Please enter a URL first');
      return;
    }
    const cleaned = cleanUrl(inputUrl.trim());
    const entry = {
      id: Date.now(),
      original: inputUrl.trim(),
      cleaned,
      timestamp: new Date().toISOString(),
    };
    const newHistory = [entry, ...history].slice(0, 50);
    saveHistory(newHistory);
    if (autoCopy) {
      navigator.clipboard.writeText(cleaned).catch(() => {});
      toast.success('Link cleaned & copied!', { icon: '✨' });
    } else {
      toast.success('Link cleaned!', { icon: '✨' });
    }
    setInputUrl('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputUrl(text);
      if (oneTapClean && text.trim()) {
        setTimeout(() => {
          const cleaned = cleanUrl(text.trim());
          const entry = {
            id: Date.now(),
            original: text.trim(),
            cleaned,
            timestamp: new Date().toISOString(),
          };
          const newHistory = [entry, ...history].slice(0, 50);
          saveHistory(newHistory);
          if (autoCopy) {
            navigator.clipboard.writeText(cleaned).catch(() => {});
            toast.success('Pasted, cleaned & copied!', { icon: '⚡' });
          } else {
            toast.success('Pasted & cleaned!', { icon: '⚡' });
          }
          setInputUrl('');
        }, 100);
      }
    } catch {
      toast.error('Clipboard access denied');
    }
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

  const clearHistory = () => {
    saveHistory([]);
    toast.success('History cleared');
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' • ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4">
        <button className="p-2">
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>
        <h1 className="text-2xl font-black tracking-wider">
          <span className="text-white">B4</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">TRACK</span>
        </h1>
        <a href="https://buymeacoffee.com/b4k3d" target="_blank" rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
          </svg>
        </a>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4">

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Input Card */}
            <div className="bg-[#16162a] rounded-2xl p-5 border border-[#2a2a4a]">
              <p className="text-violet-400 text-sm font-medium mb-3">Enter URL to clean</p>
              <div className="flex items-center gap-3 bg-[#0d0d1a] border border-[#3a3a6a] rounded-xl px-4 py-3 mb-4 focus-within:border-violet-500 transition-colors">
                <Link2 className="w-5 h-5 text-violet-400 shrink-0" />
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClean()}
                  placeholder="https://example.com/long-url..."
                  className="bg-transparent flex-1 text-sm text-gray-300 placeholder-gray-600 outline-none"
                />
                {inputUrl && (
                  <button onClick={() => setInputUrl('')} className="text-gray-500 hover:text-gray-300 text-xs">✕</button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePaste}
                  className="flex-1 py-3 rounded-xl border border-[#3a3a6a] text-gray-400 text-sm font-medium hover:border-violet-500 hover:text-violet-400 transition-all"
                >
                  📋 Paste
                </button>
                <button
                  onClick={handleClean}
                  className="flex-[2] py-3 rounded-xl font-bold text-white text-base bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40"
                >
                  <Sparkles className="w-5 h-5" />
                  Clean Link
                </button>
              </div>
            </div>

            {/* History Preview */}
            {history.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-bold text-lg">History</h2>
                  <button onClick={clearHistory} className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
                    Clear all
                  </button>
                </div>
                <div className="space-y-3">
                  {history.slice(0, 4).map((item) => (
                    <HistoryCard key={item.id} item={item} copiedId={copiedId} onCopy={copyToClipboard} onShare={shareUrl} formatTime={formatTime} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {history.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#16162a] flex items-center justify-center mx-auto mb-4 border border-[#2a2a4a]">
                  <Link2 className="w-7 h-7 text-violet-400" />
                </div>
                <p className="text-gray-500 text-sm">Paste a URL above to get started</p>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-xl">History</h2>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
                  Clear all
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <HistoryCard key={item.id} item={item} copiedId={copiedId} onCopy={copyToClipboard} onShare={shareUrl} formatTime={formatTime} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-white font-bold text-xl">Settings</h2>

            <div className="bg-[#16162a] rounded-2xl border border-[#2a2a4a] overflow-hidden">
              <SettingRow
                icon="📋"
                iconBg="bg-violet-600/20"
                title="Auto-copy to clipboard"
                description="Automatically copy cleaned link to clipboard"
                value={autoCopy}
                onChange={(v) => { setAutoCopy(v); localStorage.setItem('b4track_autocopy', v); }}
              />
              <div className="h-px bg-[#2a2a4a]" />
              <SettingRow
                icon="⚡"
                iconBg="bg-cyan-600/20"
                title="One-tap Clean"
                description="Clean link as soon as you paste"
                value={oneTapClean}
                onChange={(v) => { setOneTapClean(v); localStorage.setItem('b4track_onetap', v); }}
              />
            </div>

            {/* About */}
            <div className="bg-[#16162a] rounded-2xl border border-[#2a2a4a] p-5 space-y-4">
              <h3 className="text-white font-semibold">About B4TRACK</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Strip tracking parameters from URLs. Clean & private browsing, powered by open source logic.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/b4k3d" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a] text-center text-sm text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  GitHub
                </a>
                <a href="https://buymeacoffee.com/b4k3d" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-700/30 text-center text-sm text-yellow-400 hover:from-yellow-600/30 hover:to-orange-600/30 transition-all flex items-center justify-center gap-2">
                  ☕ Buy me a coffee
                </a>
              </div>
            </div>

            {/* Tracker params list */}
            <div className="bg-[#16162a] rounded-2xl border border-[#2a2a4a] p-5">
              <h3 className="text-white font-semibold mb-3">Tracked Parameters Removed</h3>
              <div className="flex flex-wrap gap-2">
                {['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ref','referrer','mc_cid','mc_eid','_ga','igshid','si','feature','pp'].map(p => (
                  <span key={p} className="px-2 py-1 rounded-md bg-[#0d0d1a] border border-[#2a2a4a] text-xs text-gray-400 font-mono">{p}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#12121f] border-t border-[#2a2a4a] px-6 py-3 flex justify-around items-center">
        <NavButton icon={<Home className="w-6 h-6" />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavButton icon={<Clock className="w-6 h-6" />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <NavButton icon={<Settings className="w-6 h-6" />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </div>
  );
}

function HistoryCard({ item, copiedId, onCopy, onShare, formatTime }) {
  return (
    <div className="bg-[#16162a] rounded-2xl p-4 border border-[#2a2a4a] flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a] flex items-center justify-center shrink-0">
        <Link2 className="w-5 h-5 text-violet-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{item.original}</p>
        <p className="text-cyan-400 text-xs truncate">{item.cleaned}</p>
        <p className="text-gray-600 text-xs mt-0.5">{formatTime(item.timestamp)}</p>
      </div>
      <div className="flex gap-3 shrink-0">
        <button onClick={() => onCopy(item.cleaned, item.id)}
          className="flex flex-col items-center gap-0.5 text-cyan-400 hover:text-cyan-300 transition-colors">
          {copiedId === item.id ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span className="text-[10px]">Copy</span>
        </button>
        <button onClick={() => onShare(item.cleaned)}
          className="flex flex-col items-center gap-0.5 text-violet-400 hover:text-violet-300 transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-[10px]">Share</span>
        </button>
      </div>
    </div>
  );
}

function SettingRow({ icon, iconBg, title, description, value, onChange }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-lg shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${value ? 'bg-gradient-to-r from-violet-600 to-cyan-500' : 'bg-[#2a2a4a]'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[60px]">
      <span className={active ? 'text-cyan-400' : 'text-gray-600'}>{icon}</span>
      <span className={`text-xs font-medium ${active ? 'text-cyan-400' : 'text-gray-600'}`}>{label}</span>
      {active && <span className="w-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />}
    </button>
  );
}