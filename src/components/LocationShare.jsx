import React, { useEffect, useMemo, useState } from 'react';
import { Map, MapPin, Share2, Satellite } from 'lucide-react';

function getMapsLink(coords) {
  if (!coords) return '';
  const { latitude, longitude } = coords;
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

export default function LocationShare() {
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [watching, setWatching] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [speed, setSpeed] = useState(null);
  const [altitude, setAltitude] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const shareText = useMemo(() => {
    if (!coords) return 'My location is not available yet.';
    return `My live location: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}${
      accuracy ? ` (±${Math.round(accuracy)}m)` : ''
    }\nMap: ${getMapsLink(coords)}`;
  }, [coords, accuracy]);

  function start() {
    if (!('geolocation' in navigator)) return;
    if (watchId) return;
    setStatus('Tracking…');
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const c = pos.coords;
        setCoords(c);
        setAccuracy(c.accuracy);
        setSpeed(c.speed);
        setAltitude(c.altitude);
        setWatching(true);
      },
      (err) => {
        setStatus(err.message || 'Error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    setWatchId(id);
  }

  function stop() {
    if (watchId && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchId);
    }
    setWatchId(null);
    setWatching(false);
    setStatus('Idle');
  }

  async function share() {
    const text = shareText;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My location', text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Location copied to clipboard');
      }
    } catch {}
  }

  return (
    <section className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Map className="text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-800">Live Location</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={start} className="px-3 py-2 rounded-xl bg-emerald-600 text-white">Start</button>
        <button onClick={stop} className="px-3 py-2 rounded-xl bg-slate-200">Stop</button>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-xl border text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Satellite size={16} /> Status: <span className="font-medium">{status}</span>
        </div>
        <div className="mt-2 text-slate-700">
          {coords ? (
            <>
              <div className="flex items-center gap-2"><MapPin size={16}/> {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)} {accuracy ? `±${Math.round(accuracy)}m` : ''}</div>
              <div className="mt-1">Speed: {speed != null ? `${(speed * 3.6).toFixed(1)} km/h` : '—'}</div>
              <div>Altitude: {altitude != null ? `${altitude.toFixed(1)} m` : '—'}</div>
              <a href={getMapsLink(coords)} target="_blank" rel="noreferrer" className="text-rose-700 underline mt-1 inline-block">Open in Maps</a>
            </>
          ) : (
            <div>No location yet. Start tracking to get updates.</div>
          )}
        </div>
        <button onClick={share} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs">
          <Share2 size={16}/> Share
        </button>
      </div>
    </section>
  );
}
