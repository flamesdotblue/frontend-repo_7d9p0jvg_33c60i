import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, PhoneCall, Share2, MapPin, Copy } from 'lucide-react';

function getMapsLink(coords) {
  if (!coords) return '';
  const { latitude, longitude } = coords;
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

export default function SOSPanel({ contacts }) {
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const watchIdRef = useRef(null);

  useEffect(() => {
    // Try to get a fast fix on mount
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords(pos.coords);
          setAccuracy(pos.coords.accuracy);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const locationText = useMemo(() => {
    if (!coords) return 'Location not available yet.';
    return `My live location: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}${
      accuracy ? ` (±${Math.round(accuracy)}m)` : ''
    }\nMap: ${getMapsLink(coords)}`;
  }, [coords, accuracy]);

  const smsHref = useMemo(() => {
    const message = encodeURIComponent(
      `EMERGENCY: I need help. ${locationText}`
    );
    const numbers = contacts?.map((c) => c.phone).join(',');
    // sms: supports comma-separated numbers on many mobile browsers
    return `sms:${numbers || ''}?&body=${message}`;
  }, [contacts, locationText]);

  const callHref = useMemo(() => {
    const primary = contacts?.[0]?.phone || '';
    return `tel:${primary}`;
  }, [contacts]);

  async function copyLocation() {
    try {
      await navigator.clipboard.writeText(locationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  }

  function vibrate(pattern = [200, 100, 200, 100, 400]) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      o.start();
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        o.stop(ctx.currentTime + 0.1);
      }, 400);
    } catch (e) {
      // ignore
    }
  }

  async function handleSOS() {
    setLoading(true);
    vibrate();
    playBeep();
    try {
      if ('geolocation' in navigator) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setCoords(pos.coords);
              setAccuracy(pos.coords.accuracy);
              resolve();
            },
            () => resolve(),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
          );
        });
      }
      // Attempt to use Web Share if available
      const text = `EMERGENCY: I need help. ${locationText}`;
      if (navigator.share) {
        await navigator.share({ title: 'SOS', text });
      }
    } catch (e) {
      // best-effort
    } finally {
      setLoading(false);
    }
  }

  function startLiveTracking() {
    if (!('geolocation' in navigator)) return;
    if (watchIdRef.current) return; // already tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords(pos.coords);
        setAccuracy(pos.coords.accuracy);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  }

  function stopLiveTracking() {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }

  return (
    <section className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-rose-600" />
        <h2 className="text-lg font-semibold text-rose-700">Emergency SOS</h2>
      </div>
      <div className="flex flex-col items-center text-center">
        <button
          onClick={handleSOS}
          className="active:scale-95 transition rounded-full w-44 h-44 flex items-center justify-center bg-rose-600 text-white shadow-lg"
          aria-label="Send SOS"
        >
          {loading ? 'Preparing…' : 'SOS'}
        </button>
        <p className="mt-4 text-sm text-rose-700">Tap to buzz, get location, and share quickly.</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <a href={callHref} className="flex items-center justify-center gap-2 bg-white border rounded-xl py-2 hover:bg-rose-50">
          <PhoneCall size={18} /> Call
        </a>
        <a href={smsHref} className="flex items-center justify-center gap-2 bg-white border rounded-xl py-2 hover:bg-rose-50">
          <Share2 size={18} /> SMS
        </a>
        <button onClick={copyLocation} className="flex items-center justify-center gap-2 bg-white border rounded-xl py-2 hover:bg-rose-50">
          <Copy size={18} /> {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-white border rounded-xl text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin size={16} />
          <span className="font-medium">Current location</span>
        </div>
        <div className="mt-1 text-slate-700">
          {coords ? (
            <>
              <div>
                {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)} {accuracy ? `±${Math.round(accuracy)}m` : ''}
              </div>
              <a className="text-rose-700 underline" href={getMapsLink(coords)} target="_blank" rel="noreferrer">
                Open in Maps
              </a>
            </>
          ) : (
            <div>Fetching location…</div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={startLiveTracking} className="px-3 py-1.5 text-xs bg-rose-600 text-white rounded-lg">Start live</button>
          <button onClick={stopLiveTracking} className="px-3 py-1.5 text-xs bg-slate-200 rounded-lg">Stop</button>
        </div>
      </div>
    </section>
  );
}
