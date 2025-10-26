import React from 'react';
import Spline from '@splinetool/react-spline';
import { Shield, Sparkles } from 'lucide-react';

export default function HeroLanding({ onGetStarted, onOpenChat }) {
  return (
    <section className="relative">
      <div className="h-[360px] w-full overflow-hidden rounded-2xl border bg-black/5">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white" />

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
          <Sparkles size={14}/> AI-powered protection
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">SafeShe — Your Personal Safety Companion</h1>
        <p className="mt-2 text-slate-600">Instant SOS, live location sharing, trusted guardians, and an AI voice agent ready when you are.</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button onClick={onGetStarted} className="px-5 py-3 rounded-xl bg-rose-600 text-white font-medium shadow-lg active:scale-95 inline-flex items-center gap-2">
            <Shield/> Get Started
          </button>
          <button onClick={onOpenChat} className="px-5 py-3 rounded-xl bg-white border font-medium active:scale-95">Ask the AI</button>
        </div>
      </div>
    </section>
  );
}
