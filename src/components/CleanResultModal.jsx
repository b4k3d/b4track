import { Copy, Share2, CheckCheck, X, Shield } from 'lucide-react';
import { useState } from 'react';

export default function CleanResultModal({ result, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  // result = { type: 'single' | 'clipboard', entries: [{ original, cleaned, removed }] }
  const totalRemoved = result.entries.reduce((sum, e) => sum + e.removed.length, 0);
  const allRemoved = [...new Set(result.entries.flatMap((e) => e.removed))];

  const handleCopy = () => {
    const text = result.entries.length === 1
      ? result.entries[0].cleaned
      : result.entries.map((e) => e.cleaned).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    const url = result.entries[0]?.cleaned;
    if (!url) return;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#16162a] rounded-t-3xl border-t border-x border-[#2a2a4a] p-6 pb-10 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + close */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-1 rounded-full bg-[#3a3a6a] mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
          <div />
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats banner */}
        <div className="bg-gradient-to-r from-violet-900/40 to-cyan-900/30 rounded-2xl p-4 flex items-center gap-4 border border-violet-700/30">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">
              {totalRemoved} tracker{totalRemoved !== 1 ? 's' : ''} dodged
            </p>
            <p className="text-gray-400 text-sm">
              {result.entries.length} link{result.entries.length !== 1 ? 's' : ''} cleaned
            </p>
          </div>
        </div>

        {/* Cleaned URLs */}
        <div className="space-y-2">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Cleaned Link{result.entries.length > 1 ? 's' : ''}</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {result.entries.map((e, i) => (
              <div key={i} className="bg-[#0d0d1a] rounded-xl px-3 py-2 border border-[#2a2a4a]">
                <p className="text-cyan-400 text-xs break-all">{e.cleaned}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trackers dodged list */}
        {allRemoved.length > 0 && (
          <div className="space-y-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Trackers Dodged</p>
            <div className="flex flex-wrap gap-1.5">
              {allRemoved.map((p) => (
                <span key={p} className="px-2 py-1 rounded-md bg-red-900/30 border border-red-800/40 text-xs text-red-400 font-mono line-through">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-xl bg-[#0d0d1a] border border-[#3a3a6a] text-sm font-medium text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {result.entries.length === 1 && (
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-sm font-bold text-white hover:from-violet-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40"
            >
              <Share2 className="w-4 h-4" />
              Clean & Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}