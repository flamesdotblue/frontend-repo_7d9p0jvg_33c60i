import React, { useState } from 'react';
import { AlertTriangle, Bell, Camera, EyeOff, Map, Mic, Route, ShieldCheck, Timer } from 'lucide-react';

export default function AdvancedFeatures() {
  const [backgroundShare, setBackgroundShare] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [voice, setVoice] = useState(false);
  const [stealth, setStealth] = useState(false);

  return (
    <section className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-800">Advanced Safety</h2>
      </div>

      <div className="space-y-4">
        <FeatureToggle
          on={backgroundShare}
          setOn={setBackgroundShare}
          icon={<Map/>}
          title="Background live location to guardians"
          desc="Share your movement in the background to selected guardians. Requires backend connection."
          badge="Connect backend to enable"
        />
        <FeatureToggle
          on={checkIn}
          setOn={setCheckIn}
          icon={<Timer/>}
          title="Check-in timer with auto-alert"
          desc="Set a timer to auto-notify contacts if you don’t confirm you’re safe."
        />
        <FeatureToggle
          on={voice}
          setOn={setVoice}
          icon={<Mic/>}
          title="Quick voice commands (hands-free)"
          desc="Trigger SOS or share location by voice when screen access is hard."
        />
        <FeatureToggle
          on={stealth}
          setOn={setStealth}
          icon={<EyeOff/>}
          title="Stealth mode with decoy screen"
          desc="Discreet interface and a decoy calculator screen for sensitive situations."
        />

        <div className="grid sm:grid-cols-2 gap-3">
          <InfoCard icon={<Route/>} title="Safe route suggestions" desc="Prefer bright streets and high-activity paths using public safety data."/>
          <InfoCard icon={<AlertTriangle/>} title="Area alerts" desc="Get notified about high-risk zones around you."/>
          <InfoCard icon={<Camera/>} title="Incident reporting" desc="Capture photo/audio evidence with secure cloud backup (requires backend)."/>
          <InfoCard icon={<Bell/>} title="Guardian alerts" desc="One-tap alerting and acknowledgment flows for faster response."/>
        </div>
      </div>
    </section>
  );
}

function FeatureToggle({ on, setOn, icon, title, desc, badge }) {
  return (
    <div className="border rounded-xl p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700">{icon}</div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-slate-600">{desc}</div>
            {badge && <div className="mt-1 inline-block text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700">{badge}</div>}
          </div>
        </div>
        <button onClick={() => setOn(!on)} className={`w-12 h-7 rounded-full relative transition ${on ? 'bg-rose-600' : 'bg-slate-200'}`} aria-pressed={on}>
          <span className={`absolute top-0.5 ${on ? 'right-0.5' : 'left-0.5'} w-6 h-6 bg-white rounded-full shadow`} />
        </button>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc }) {
  return (
    <div className="border rounded-xl p-4 bg-slate-50">
      <div className="flex items-center gap-2 text-slate-800 font-medium">{icon} {title}</div>
      <div className="text-sm text-slate-600 mt-1">{desc}</div>
    </div>
  );
}
