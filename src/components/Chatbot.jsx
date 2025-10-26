import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Mic, Send, X } from 'lucide-react';

function simpleAI(input) {
  const text = input.toLowerCase();
  if (/(sos|help|emergency)/.test(text)) return 'If this is an emergency, press the big SOS button. I can also share your live location with your trusted contacts.';
  if (/(walk|route|safe)/.test(text)) return 'For safer travel, enable live tracking and share with guardians. I can also suggest staying on well-lit streets and avoiding isolated shortcuts.';
  if (/(check|timer|remind)/.test(text)) return 'Use the Check-in timer to set an auto-alert if you don’t confirm you’re safe.';
  if (/(report|incident|photo|audio)/.test(text)) return 'You can record photo/audio as evidence and save it securely when backend is connected.';
  if (/(voice|hands\-?free)/.test(text)) return 'Enable voice commands to trigger SOS or share location without touching your phone.';
  return 'I’m here to help with safety tips, SOS, location sharing, and more. Ask me anything!';
}

export default function Chatbot({ open, onClose, onCommand }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I’m your safety assistant. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setTimeout(() => {
      const reply = simpleAI(text);
      setMessages((m) => [...m, { role: 'ai', content: reply }]);
      if (/sos|emergency/i.test(text)) onCommand?.('sos');
      if (/share|location|guardian/i.test(text)) onCommand?.('share');
    }, 200);
  }

  function toggleMic() {
    if (listening) {
      try { recRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported on this browser.'); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold"><MessageCircle/> Safety Assistant</div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X/></button>
        </div>
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`${m.role === 'ai' ? 'bg-slate-100' : 'bg-rose-100'} rounded-xl px-3 py-2 text-sm`}>{m.content}</div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t p-3 flex items-center gap-2">
          <button onClick={toggleMic} className={`p-2 rounded-lg ${listening ? 'bg-rose-600 text-white' : 'bg-slate-100'}`} aria-label="Toggle microphone">
            <Mic size={18}/>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask anything…"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <button onClick={send} className="px-3 py-2 bg-rose-600 text-white rounded-lg inline-flex items-center gap-1"><Send size={16}/> Send</button>
        </div>
      </div>
    </div>
  );
}
