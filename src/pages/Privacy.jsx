import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white max-w-2xl mx-auto px-5 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-3xl font-black tracking-wider mb-1">
        <span className="text-white">B4</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">TRACK</span>
      </h1>
      <h2 className="text-xl font-semibold text-gray-300 mb-1">Privacy Policy</h2>
      <p className="text-gray-500 text-sm mb-10">Last updated: June 20, 2025</p>

      <div className="space-y-8 text-gray-300 leading-relaxed">

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Overview</h3>
          <p>
            B4TRACK is a URL tracking parameter remover. We built it with one principle: <strong className="text-white">your data never leaves your device.</strong> This privacy policy explains what that means in practice.
          </p>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Data We Do NOT Collect</h3>
          <ul className="space-y-2 list-none">
            {[
              'URLs you paste or clean',
              'Your browsing history or clipboard content',
              'Personal information of any kind',
              'Device identifiers or analytics',
              'Crash reports or usage telemetry',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Local Storage Only</h3>
          <p>
            B4TRACK stores your cleaning history and settings exclusively in your device's local storage (<code className="text-cyan-400 text-sm">localStorage</code>). This data never leaves your device and is never transmitted to any server. You can clear it at any time from the app's History tab.
          </p>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Clipboard Access</h3>
          <p>
            When you use "Paste" or "Sanitize Clipboard," the app reads your clipboard solely to process URLs on-device. The clipboard content is never stored beyond the immediate cleaning operation and is never sent anywhere.
          </p>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">No Third-Party Services</h3>
          <p>
            B4TRACK does not integrate any third-party analytics, advertising, tracking SDKs, or data brokers. There are no external network requests made by the app during normal operation.
          </p>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Internet Permission</h3>
          <p>
            The app is delivered as a Progressive Web App (PWA). The internet permission is used solely to load the app itself — not to transmit any user data.
          </p>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Children's Privacy</h3>
          <p>
            B4TRACK does not knowingly collect any information from anyone, including children under 13. Since no data is collected at all, COPPA compliance is inherent.
          </p>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Changes to This Policy</h3>
          <p>
            If this policy ever changes, the updated version will be posted at <a href="https://b4track.app/privacy" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">b4track.app/privacy</a> with a new effective date.
          </p>
        </section>

        <section>
          <h3 className="text-white font-semibold text-lg mb-2">Contact</h3>
          <p>
            Questions? Reach out at <a href="https://b4track.app" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">b4track.app</a>.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-[#2a2a4a] text-center text-gray-600 text-xs">
        © {new Date().getFullYear()} B4TRACK · <a href="https://b4track.app" className="hover:text-gray-400 transition-colors">b4track.app</a>
      </div>
    </div>
  );
}