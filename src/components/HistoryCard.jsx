import { Link2, Copy, Share2, CheckCheck } from 'lucide-react';
import { getTheme } from '@/lib/themeClasses';

export default function HistoryCard({ item, copiedId, onCopy, onShare, formatTime, darkMode }) {
  const { card, border, cardInner, heading, muted } = getTheme(darkMode);
  const d = darkMode;
  const linkColor  = d ? 'text-cyan-400'  : 'text-cyan-600';
  const copyColor  = d ? 'text-cyan-400 hover:text-cyan-300'     : 'text-cyan-600 hover:text-cyan-500';
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
            <span className={`text-xs font-medium ${d ? 'text-red-400' : 'text-red-500'}`}>
              −{item.removed.length} tracker{item.removed.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => onCopy(item.cleaned, item.id)}
          className={`flex flex-col items-center gap-0.5 transition-colors select-none ${copyColor}`}
        >
          {copiedId === item.id ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span className="text-[10px]">Copy</span>
        </button>
        <button
          onClick={() => onShare(item.cleaned)}
          className={`flex flex-col items-center gap-0.5 transition-colors select-none ${shareColor}`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px]">Share</span>
        </button>
      </div>
    </div>
  );
}