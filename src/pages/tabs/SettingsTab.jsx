import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, AlertTriangle, UserX } from 'lucide-react';
import { TRACKING_PARAMS } from '@/lib/urlCleaner';
import { getTheme } from '@/lib/themeClasses';
import { base44 } from '@/api/base44Client';

export default function SettingsTab({ autoCopy, setAutoCopy, oneTapClean, setOneTapClean, aggressiveMode, setAggressiveMode, darkMode }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const d = darkMode;
  const { card, border, heading, subtext, muted, divider } = getTheme(d);

  const handleDeleteAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      // Attempt permanent account deletion if the SDK supports it
      if (typeof base44.auth.deleteAccount === 'function') {
        await base44.auth.deleteAccount();
      } else {
        // Fallback: log out and clear all local data
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) await base44.auth.logout();
      }
    } catch {}
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 px-4 pt-4">
      <h2 className={`font-bold text-xl ${heading}`}>Settings</h2>

      {/* Toggles */}
      <div className={`${card} rounded-2xl border ${border} overflow-hidden shadow-sm`}>
        <SettingRow
          icon="📋" iconBg={d ? 'bg-violet-600/20' : 'bg-violet-100'}
          title="Auto-copy to clipboard" description="Automatically copy cleaned link to clipboard"
          value={autoCopy} darkMode={d} onChange={setAutoCopy}
        />
        <div className={`h-px ${divider}`} />
        <SettingRow
          icon="⚡" iconBg={d ? 'bg-cyan-600/20' : 'bg-cyan-100'}
          title="One-tap Clean" description="Clean link as soon as you paste"
          value={oneTapClean} darkMode={d} onChange={setOneTapClean}
        />
        <div className={`h-px ${divider}`} />
        <SettingRow
          icon="🛡️" iconBg={d ? 'bg-red-600/20' : 'bg-red-100'}
          title="Aggressive Mode" description="Also strips param prefixes: utm_, mtm_, pk_, hsa_, _hs, gclid, gbraid, wbraid, gad_"
          value={aggressiveMode} darkMode={d} onChange={setAggressiveMode}
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
            className={`flex-1 py-3 rounded-xl border text-center text-sm transition-all flex items-center justify-center gap-2 select-none ${d ? 'bg-[#0d0d1a] border-[#2a2a4a] text-gray-400 hover:border-violet-500 hover:text-violet-400' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </a>
          <a href="https://buymeacoffee.com/b4k3d" target="_blank" rel="noopener noreferrer"
            className={`flex-1 py-3 rounded-xl border text-center text-sm transition-all flex items-center justify-center gap-2 select-none ${d ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-700/30 text-yellow-400 hover:from-yellow-600/30 hover:to-orange-600/30' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>
            ☕ Buy me a coffee
          </a>
        </div>
        <div className="text-center pt-1">
          <Link to="/privacy" className={`text-xs transition-colors ${d ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}>Privacy Policy</Link>
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
          <span className={`px-2 py-1 rounded-md border text-xs font-mono ${d ? 'bg-[#0d0d1a] border-[#2a2a4a] text-gray-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
            +{Math.max(0, TRACKING_PARAMS.size - 40)} more
          </span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${card} rounded-2xl border ${d ? 'border-red-900/40' : 'border-red-200'} p-5 shadow-sm space-y-3`}>
        <h3 className={`font-semibold mb-1 ${d ? 'text-red-400' : 'text-red-600'}`}>Danger Zone</h3>
        <p className={`text-xs ${subtext}`}>Permanently clears local data or removes your account.</p>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full py-3 rounded-xl border border-red-700/50 bg-red-900/20 text-red-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-900/30 transition-all select-none"
        >
          <Trash2 className="w-4 h-4" />
          Delete All Data
        </button>

        <button
          onClick={() => setShowDeleteAccountConfirm(true)}
          className="w-full py-3 rounded-xl border border-red-700/50 bg-red-900/10 text-red-500 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-900/25 transition-all select-none"
        >
          <UserX className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Confirm Delete Data dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className={`w-full max-w-sm ${d ? 'bg-[#16162a] border-[#2a2a4a]' : 'bg-white border-gray-200'} border rounded-2xl p-6 space-y-4 shadow-2xl`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className={`font-bold ${heading}`}>Delete all data?</p>
                <p className={`text-xs ${subtext}`}>History and settings will be erased.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium select-none ${d ? 'border-[#3a3a6a] text-gray-400 hover:text-white' : 'border-gray-300 text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllData}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors select-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Account dialog */}
      {showDeleteAccountConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className={`w-full max-w-sm ${d ? 'bg-[#16162a] border-[#2a2a4a]' : 'bg-white border-gray-200'} border rounded-2xl p-6 space-y-4 shadow-2xl`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-900/30 flex items-center justify-center shrink-0">
                <UserX className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className={`font-bold ${heading}`}>Delete account?</p>
                <p className={`text-xs ${subtext}`}>Your session and all local data will be removed.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDeleteAccountConfirm(false)}
                disabled={deletingAccount}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium select-none ${d ? 'border-[#3a3a6a] text-gray-400 hover:text-white' : 'border-gray-300 text-gray-600 hover:text-gray-900'} transition-colors disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors select-none disabled:opacity-50"
              >
                {deletingAccount ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({ icon, iconBg, title, description, value, onChange, darkMode: d }) {
  const { heading } = getTheme(d);
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
        className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 select-none ${value ? 'bg-gradient-to-r from-violet-600 to-cyan-500' : toggleOff}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  );
}