import { useState } from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { cleanUrlDetailed, extractUrls } from '@/lib/urlCleaner';
import { getTheme } from '@/lib/themeClasses';
import { readClipboardText } from '@/lib/clipboard';
import { toast } from 'sonner';
import CleanResultModal from '@/components/CleanResultModal';

export default function BulkTab({ history, saveHistory, aggressiveMode, darkMode }) {
  const [text, setText] = useState('');
  const [modalResult, setModalResult] = useState(null);
  const d = darkMode;
  const { card, cardInner, border, borderInput, heading, subtext, inputText } = getTheme(d);

  const detectedUrls = extractUrls(text);

  const handleBulkClean = () => {
    const urls = extractUrls(text);
    if (urls.length === 0) { toast.error('No URLs found in the text'); return; }
    const entries = urls.map((u) => {
      const { cleaned, removed } = cleanUrlDetailed(u, aggressiveMode);
      return { id: Date.now() + Math.random(), original: u, cleaned, removed: removed || [], timestamp: new Date().toISOString() };
    });
    saveHistory([...entries, ...history].slice(0, 50));
    setModalResult({ type: 'clipboard', entries });
  };

  const handlePaste = async () => {
    try {
      setText(await readClipboardText());
    } catch {
      toast.error('Clipboard access denied');
    }
  };

  return (
    <div className="space-y-5 px-4 pt-4">
      <div className={`${card} rounded-2xl p-5 border ${border} shadow-sm`}>
        <p className={`text-sm font-medium mb-3 ${d ? 'text-violet-400' : 'text-violet-600'}`}>Paste a list of URLs to clean</p>
        <div className={`${cardInner} border ${borderInput} rounded-xl p-3 mb-3 focus-within:border-violet-500 transition-colors`}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder={'Paste one URL per line, or any text with links in it…\n\nhttps://example.com/?utm_source=newsletter\nhttps://youtube.com/watch?v=dQw4w9WgXcQ&feature=share'}
            className={`w-full resize-none bg-transparent text-sm leading-relaxed ${inputText} ${d ? 'placeholder-gray-600' : 'placeholder-gray-400'} outline-none`}
          />
        </div>
        {detectedUrls.length > 0 && (
          <p className={`text-xs mb-3 ${d ? 'text-cyan-400' : 'text-cyan-600'}`}>
            {detectedUrls.length} link{detectedUrls.length !== 1 ? 's' : ''} detected
          </p>
        )}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handlePaste}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all select-none ${d ? 'border-[#3a3a6a] text-gray-400 hover:border-violet-500 hover:text-violet-400' : 'border-gray-300 text-gray-600 hover:border-violet-500 hover:text-violet-600 bg-gray-50'}`}
          >
            📋 Paste
          </button>
          {text && (
            <button
              onClick={() => setText('')}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all select-none ${d ? 'border-[#3a3a6a] text-gray-400 hover:border-red-500 hover:text-red-400' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 bg-gray-50'}`}
            >
              Clear
            </button>
          )}
        </div>
        <button
          onClick={handleBulkClean}
          disabled={detectedUrls.length === 0}
          className="w-full py-3.5 rounded-xl font-bold text-white text-base bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30 disabled:opacity-40 disabled:cursor-not-allowed select-none"
        >
          <Sparkles className="w-5 h-5" />
          Clean All Links
        </button>
      </div>

      <div className={`${card} rounded-2xl p-4 border ${border}`}>
        <div className="flex items-center gap-2 mb-2">
          <Layers className={`w-4 h-4 ${d ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <p className={`text-sm font-semibold ${heading}`}>How bulk clean works</p>
        </div>
        <p className={`text-xs leading-relaxed ${subtext}`}>
          Paste any text containing one or more links. Every URL is stripped of trackers and shown cleaned, with a list of exactly what was dodged. Results are saved to your history.
        </p>
      </div>

      <CleanResultModal result={modalResult} onClose={() => setModalResult(null)} />
    </div>
  );
}