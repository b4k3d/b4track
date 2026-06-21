import { useState } from 'react';
import { Clock } from 'lucide-react';
import { getTheme } from '@/lib/themeClasses';
import { toast } from 'sonner';
import HistoryCard from '@/components/HistoryCard';
import PullToRefresh from '@/components/PullToRefresh';

export default function HistoryTab({ history, saveHistory, darkMode }) {
  const [copiedId, setCopiedId] = useState(null);
  const d = darkMode;
  const { card, border, heading, subtext } = getTheme(d);
  const totalTrackersDodged = history.reduce((sum, i) => sum + (i.removed?.length || 0), 0);

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

  const handleRefresh = async () => {
    const saved = localStorage.getItem('b4track_history');
    if (saved) saveHistory(JSON.parse(saved));
    await new Promise(r => setTimeout(r, 400));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} darkMode={d}>
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-bold text-xl ${heading}`}>History</h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className={`text-sm transition-colors select-none ${d ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500'}`}>
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
    </PullToRefresh>
  );
}