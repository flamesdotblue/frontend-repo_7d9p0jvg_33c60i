import React, { useEffect, useRef, useState } from 'react';
import { BellRing, Lightbulb, ShieldCheck, Volume2 } from 'lucide-react';

export default function SafetyToolkit() {
  const [strobe, setStrobe] = useState(false);
  const [siren, setSiren] = useState(false);
  const strobeRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  useEffect(() => {
    let interval;
    if (strobe) {
      let on = false;
      interval = setInterval(() => {
        on = !on;
        if (strobeRef.current) strobeRef.current.style.opacity = on ? '1' : '0.1';
      }, 120);
    }
    return () => clearInterval(interval);
  }, [strobe]);

  function toggleSiren() {
    if (!siren) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.connect(g);
        g.connect(ctx.destination);
        let t = 0;
        const sweep = () => {
          if (!o) return;
          const base = 440 + 440 * Math.abs(Math.sin(t));
          o.frequency.setValueAtTime(base, ctx.currentTime);
          t += 0.08;
          if (siren) requestAnimationFrame(sweep);
        };
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        o.start();
        audioCtxRef.current = ctx;
        oscRef.current = o;
        setSiren(true);
        requestAnimationFrame(sweep);
      } catch {}
    } else {
      try {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
      } catch {}
      setSiren(false);
    }
  }

  useEffect(() => {
    return () => {
      try {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
      } catch {}
    };
  }, []);

  return (
    <section className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-800">Safety Toolkit</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setStrobe((s) => !s)} className={`px-3 py-3 rounded-xl border ${strobe ? 'bg-yellow-100 border-yellow-300' : 'bg-white'}`}>
          <div className="flex items-center gap-2 justify-center"><Lightbulb/> Screen Strobe</div>
        </button>
        <button onClick={toggleSiren} className={`px-3 py-3 rounded-xl border ${siren ? 'bg-rose-100 border-rose-300' : 'bg-white'}`}>
          <div className="flex items-center gap-2 justify-center"><Volume2/> Loud Siren</div>
        </button>
      </div>

      <div ref={strobeRef} className={`mt-4 rounded-xl h-16 transition-opacity duration-100 ${strobe ? 'bg-yellow-300' : 'bg-slate-100'}`} />

      <div className="mt-4 text-sm text-slate-600">
        - Use Screen Strobe to draw attention in dark surroundings.
        <br/>
        - Use Loud Siren to deter harassment or alert nearby people.
      </div>
    </section>
  );
}
