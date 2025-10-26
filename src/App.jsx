import React, { useState } from 'react';
import SOSPanel from './components/SOSPanel.jsx';
import ContactsManager from './components/ContactsManager.jsx';
import LocationShare from './components/LocationShare.jsx';
import SafetyToolkit from './components/SafetyToolkit.jsx';
import { Shield, Menu } from 'lucide-react';

export default function App() {
  const [contacts, setContacts] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-rose-600" />
            <span className="font-semibold">SafeShe</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-100">
            <Menu />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-md mx-auto p-4 space-y-4">
        <SOSPanel contacts={contacts} />
        <ContactsManager onChange={setContacts} />
        <LocationShare />
        <SafetyToolkit />

        <footer className="pt-6 pb-12 text-center text-xs text-slate-500">
          Built for fast, reliable help when you need it most.
        </footer>
      </main>
    </div>
  );
}
