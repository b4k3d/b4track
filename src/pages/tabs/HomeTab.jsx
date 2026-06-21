import { useState } from 'react';
import { Link2, Sparkles, ShieldCheck } from 'lucide-react';
import { cleanUrlDetailed, extractUrls } from '@/lib/urlCleaner';
import { getTheme } from '@/lib/themeClasses';
import { toast } from 'sonner';
import HistoryCard from '@/components/HistoryCard';
import CleanResultModal from '@/components/CleanResultModal';

export default function HomeTab({ history, saveHistory, autoCopy, oneTapClean, aggressiveMode, darkMode }) {
  const [inputUrl, setInputUrl] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [modalResult, setModalResult] = useState(null);
  const d = darkMode;
  const { bg, card, cardInner, border, borderInput, heading, subtext, muted, inputText } = getTheme(d);

  const totalTrackersDodged = history.reduce((sum, i) => sum + (i.removed?.length || 0), 0);

  const addEntry = (entry, newHistory) => {
    saveHistory(newHistory);
    if (autoCopy) navigator.clipboard.writeText(entry.cleaned).catch(() => {});
    setModalResult({ type: 'single', entries: [entry] });
  };

  const handleClean = () => {
    if (!inputUrl.trim()) { toast.error('Please enter a URL first'); return; }
    const { cleaned, removed } = cleanUrlDetailed(inputUrl.trim(), aggressiveMode);
    const entry = { id: Date.now(), original: inputUrl.trim(), cleaned, removed: removed || [], timestamp: new Date().toISOString() };
    addEntry(entry, [entry, ...history].slice(0, 50));
    setInputUrl('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputUrl(text);
      if (oneTapClean && text.trim()) {
        setTimeout(() => {
          const { cleaned, removed } = cleanUrlDetailed(text.trim(), aggressiveMode);
          const entry = { id: Date.now(), original: text.trim(), cleaned, removed: removed || [], timestamp: new Date().toISOString() };
          addEntry(entry, [entry, ...history].slice(0, 50));
          setInputUrl('');
        }, 100);
      }
    } catch {
      toast.error('Clipboard access denied');
    }
  };

  const handleSanitizeClipboard = async () => {
    let text;
    try { text = await navigator.clipboard.readText(); }
    catch { toast.error('Clipboard access denied'); return; }
    const urls = extractUrls(text);
    if (urls.length === 0) { toast.error('No URLs found in clipboard'); return; }
    const entries = urls.map((u) => {
      const { cleaned, removed } = cleanUrlDetailed(u, aggressiveMode);
      return { id: Date.now() + Math.random(), original: u, cleaned, removed: removed || [], timestamp: new Date().toISOString() };
    });
    let cleanedText = text;
    entries.forEach((e) => { cleanedText = cleanedText.replace(e.original, e.cleaned); });
    navigator.clipboard.writeText(cleanedText).catch(() => {});
    saveHistory([...entries, ...history].slice(0, 50));
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
    if (navigator.share) { await navigator.share({ url }); }
    else { copyToClipboard(url, null); toast.success('Link copied (share not supported)'); }
  };

  const clearHistory = () => { saveHistory([]); toast.success('History cleared'); };

  const formatTime = (iso) => {
    const dt = new Date(iso);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' • ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-5 px-4 pt-4">
      {totalTrackersDodged > 0 && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border ${d ? 'bg-gradient-to-r from-violet-900/30 to-cyan-900/20 border-violet-800/30' : 'bg-violet-50 border-violet-200'}`}>
          <ShieldCheck className={`w-4 h-4 shrink-0 ${d ? 'text-cyan-400' : 'text-violet-600'}`} />
          <p className={`text-sm ${subtext}`}>
            <span className={`font-bold ${heading}`}>{totalTrackersDodged}</span> trackers dodged across{' '}
            <span className={`font-bold ${heading}`}>{history.length}</span> links
          </p>
        </div>
      )}

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
            <button onClick={() => setInputUrl('')} className={`${subtext} text-xs select-none`}>✕</button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePaste}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all select-none ${d ? 'border-[#3a3a6a] text-gray-400 hover:border-violet-500 hover:text-violet-400' : 'border-gray-300 text-gray-600 hover:border-violet-500 hover:text-violet-600 bg-gray-50'}`}
          >
            📋 Paste
          </button>
          <button
            onClick={handleClean}
            className="flex-[2] py-3 rounded-xl font-bold text-white text-base bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30 select-none"
          >
            <Sparkles className="w-5 h-5" />
            Clean Link
          </button>
        </div>
      </div>

      <button
        onClick={handleSanitizeClipboard}
        className={`w-full py-3.5 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 select-none ${d ? 'border-cyan-700/40 bg-cyan-900/10 text-cyan-400 hover:bg-cyan-900/20 hover:border-cyan-500' : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:border-cyan-400'}`}
      >
        <ShieldCheck className="w-5 h-5" />
        Sanitize Clipboard
      </button>

      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`font-bold text-lg ${heading}`}>Recent</h2>
            <button onClick={clearHistory} className={`text-sm transition-colors select-none ${d ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500'}`}>
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

      <CleanResultModal result={modalResult} onClose={() => setModalResult(null)} />
    </div>
  );
}