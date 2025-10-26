import React from 'react';
import { Apple, LogIn, Shield, UserPlus } from 'lucide-react';

function ProviderButton({ label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-2 border rounded-xl px-3 py-2 hover:bg-slate-50">
      <LogIn size={18}/> {label}
    </button>
  );
}

export function LoginPage({ onDone }) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
          <Shield size={14}/> Secure sign in
        </div>
        <h2 className="mt-3 text-2xl font-bold">Welcome back</h2>
        <p className="text-slate-600 text-sm">Sign in to access your safety dashboard.</p>
      </div>
      <div className="space-y-3">
        <ProviderButton label="Continue with Google" onClick={() => alert('Connect backend auth for Google')} />
        <ProviderButton label="Continue with Microsoft" onClick={() => alert('Connect backend auth for Microsoft')} />
        <button onClick={() => alert('Connect backend auth for Apple')} className="w-full flex items-center justify-center gap-2 border rounded-xl px-3 py-2 hover:bg-slate-50">
          <Apple size={18}/> Continue with Apple
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Email" />
        <input className="border rounded-xl px-3 py-2" type="password" placeholder="Password" />
        <button onClick={onDone} className="bg-rose-600 text-white rounded-xl px-3 py-2">Sign in</button>
      </div>
    </div>
  );
}

export function SignupPage({ onDone }) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
          <UserPlus size={14}/> Create account
        </div>
        <h2 className="mt-3 text-2xl font-bold">Join SafeShe</h2>
        <p className="text-slate-600 text-sm">Protect yourself with trusted guardians and real-time safety.</p>
      </div>
      <div className="space-y-3">
        <ProviderButton label="Sign up with Google" onClick={() => alert('Connect backend auth for Google')} />
        <ProviderButton label="Sign up with Microsoft" onClick={() => alert('Connect backend auth for Microsoft')} />
        <button onClick={() => alert('Connect backend auth for Apple')} className="w-full flex items-center justify-center gap-2 border rounded-xl px-3 py-2 hover:bg-slate-50">
          <Apple size={18}/> Sign up with Apple
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Full name" />
        <input className="border rounded-xl px-3 py-2" placeholder="Email" />
        <input className="border rounded-xl px-3 py-2" type="password" placeholder="Password" />
        <button onClick={onDone} className="bg-rose-600 text-white rounded-xl px-3 py-2">Create account</button>
      </div>
    </div>
  );
}
