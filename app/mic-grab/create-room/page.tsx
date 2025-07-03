'use client';

import React, { useState } from 'react';
import { db } from '@/lib/database';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { ID, Permission, Query, Role } from 'appwrite';

const ROOMS_COLLECTION_ID = process.env.NEXT_PUBLIC_ROOMS_ID || ""; // replace this

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleCreate = async () => {
  if (!name || !language) return alert('Name and language required!');
  setLoading(true);

  try {
    const user = await account.get();

    // 🔍 Check for existing room by same user + same name
    const existing = await db.list(ROOMS_COLLECTION_ID, [
      Query.equal('name', name),
      Query.equal('hostId', user.$id),
    ]);

    if (existing.total > 0) {
      alert('You already have a room with this name');
      return setLoading(false);
    }

    // ✅ If not exists, create new room
    const room = await db.create(ROOMS_COLLECTION_ID, {
      name,
      language,
      password: password || null,
      hostId: user.$id,
      isPublic: !password,
    },
    [Permission.read(Role.any())]
);

    router.push(`/mic-grab/room/${room.$id}`);
  } catch (err) {
    console.error(err);
    alert('Error creating room');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">🎤 Create Room</h1>

      <input
        className="bg-gray-800 p-3 rounded"
        placeholder="Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="bg-gray-800 p-3 rounded"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="">Select Language</option>
        <option value="english">English</option>
        <option value="hindi">Hindi</option>
        <option value="nepali">Nepali</option>
      </select>

      <input
        className="bg-gray-800 p-3 rounded"
        placeholder="Password (optional)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-green-600 p-3 rounded font-bold"
      >
        {loading ? 'Creating...' : 'Create Room'}
      </button>
    </div>
  );
}
