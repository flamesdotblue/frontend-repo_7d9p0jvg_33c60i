import React, { useRef, useState } from 'react';
import { Shield, Menu, LogIn, UserPlus, Home, MessageCircle } from 'lucide-react';
import HeroLanding from './components/HeroLanding.jsx';
import Chatbot from './components/Chatbot.jsx';
import { LoginPage, SignupPage } from './components/Auth.jsx';
import AdvancedFeatures from './components/AdvancedFeatures.jsx';
import SOSPanel from './components/SOSPanel.jsx';
import ContactsManager from './components/ContactsManager.jsx';
import LocationShare from './components/LocationShare.jsx';
import SafetyToolkit from './components/SafetyToolkit.jsx';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState('home'); // home | login | signup | app
  const [chatOpen, setChatOpen] = useState(false);
  const sosRef = useRef(null);

  function handleAICommand(cmd) {
    if (cmd === 'sos') {
      // Focus SOS section
      document.getElementById('sos-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (cmd === 'share') {
      document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-rose-600" />
            <button className="font-semibold" onClick={() => setPage('home')}>SafeShe</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage('login')} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Login">
              <LogIn />
            </button>
            <button onClick={() => setPage('signup')} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Sign up">
              <UserPlus />
            </button>
            <button onClick={() => setChatOpen(true)} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Chatbot">
              <MessageCircle />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Pages */}
      {page === 'home' && (
        <main className="max-w-md mx-auto p-4 space-y-6">
          <HeroLanding onGetStarted={() => setPage('signup')} onOpenChat={() => setChatOpen(true)} />
          <AdvancedFeatures />
          <section className="bg-white border rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="mt-2 space-y-2 text-sm text-slate-600 list-decimal list-inside">
              <li>Add trusted contacts and set your check-in timer.</li>
              <li>Use SOS for emergencies to alert guardians instantly.</li>
              <li>Share live location when you’re on the move.</li>
              <li>Use the AI for guidance and voice-triggered actions.</li>
            </ol>
          </section>
          <div className="pb-10" />
        </main>
      )}

      {page === 'login' && (
        <main className="max-w-md mx-auto p-4">
          <LoginPage onDone={() => setPage('app')} />
        </main>
      )}

      {page === 'signup' && (
        <main className="max-w-md mx-auto p-4">
          <SignupPage onDone={() => setPage('app')} />
        </main>
      )}

      {page === 'app' && (
        <main className="max-w-md mx-auto p-4 space-y-4">
          <section id="sos-section"><SOSPanel ref={sosRef} contacts={contacts} /></section>
          <ContactsManager onChange={setContacts} />
          <section id="location-section"><LocationShare /></section>
          <SafetyToolkit />
          <AdvancedFeatures />
          <footer className="pt-6 pb-12 text-center text-xs text-slate-500">
            Built for fast, reliable help when you need it most.
          </footer>
        </main>
      )}

      <nav className="fixed bottom-5 inset-x-0 flex justify-center">
        <div className="mx-auto w-[90%] max-w-md bg-white/90 backdrop-blur rounded-full border shadow-lg px-3 py-2 flex items-center justify-around">
          <button onClick={() => setPage('home')} className={`px-3 py-1.5 rounded-full text-sm ${page==='home'?'bg-rose-600 text-white':'hover:bg-slate-100'}`}><Home size={16}/> Home</button>
          <button onClick={() => setPage('login')} className={`px-3 py-1.5 rounded-full text-sm ${page==='login'?'bg-rose-600 text-white':'hover:bg-slate-100'}`}><LogIn size={16}/> Login</button>
          <button onClick={() => setPage('signup')} className={`px-3 py-1.5 rounded-full text-sm ${page==='signup'?'bg-rose-600 text-white':'hover:bg-slate-100'}`}><UserPlus size={16}/> Sign up</button>
          <button onClick={() => setPage('app')} className={`px-3 py-1.5 rounded-full text-sm ${page==='app'?'bg-rose-600 text-white':'hover:bg-slate-100'}`}><Shield size={16}/> App</button>
        </div>
      </nav>

      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} onCommand={handleAICommand} />
    </div>
  );
}
