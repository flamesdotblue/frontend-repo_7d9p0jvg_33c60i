import React, { useEffect, useMemo, useState } from 'react';
import { UserPlus, Trash2, Users } from 'lucide-react';

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

export default function ContactsManager({ onChange }) {
  const [contacts, setContacts] = useLocalStorage('trusted_contacts', []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    onChange?.(contacts);
  }, [contacts, onChange]);

  function addContact(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setContacts((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), phone: phone.trim() },
    ]);
    setName('');
    setPhone('');
  }

  function removeContact(id) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  const smsAll = useMemo(() => {
    const nums = contacts.map((c) => c.phone).join(',');
    const body = encodeURIComponent('This is a test message from my safety app to confirm you as an emergency contact.');
    return `sms:${nums}?&body=${body}`;
  }, [contacts]);

  return (
    <section className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-800">Trusted Contacts</h2>
      </div>

      <form onSubmit={addContact} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <input
          className="sm:col-span-2 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="sm:col-span-2 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          placeholder="Phone (e.g., +11234567890)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          className="sm:col-span-1 flex items-center justify-center gap-2 bg-rose-600 text-white rounded-xl px-3 py-2 hover:bg-rose-700"
        >
          <UserPlus size={18} /> Add
        </button>
      </form>

      {contacts.length > 0 ? (
        <div className="mt-4 space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between border rounded-xl p-3">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-slate-500">{c.phone}</div>
              </div>
              <button onClick={() => removeContact(c.id)} className="text-slate-500 hover:text-rose-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <a href={smsAll} className="inline-block mt-2 text-rose-700 underline text-sm">Send test SMS to all</a>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">Add at least one person you trust for quick SOS.</p>
      )}
    </section>
  );
}
