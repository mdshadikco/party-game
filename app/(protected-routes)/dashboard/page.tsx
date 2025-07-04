'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const games = [
    {
      id: 'mic-grab',
      title: 'Mic Grab',
      description: 'A fast-paced mic snatching karaoke game for music lovers!',
      image: '/images/mic-grab.webp', // Add this image to your public folder
      href: '/languages',
    },
    // Future games can go here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-[#111827]">
        <h1 className="text-2xl font-bold">🎮 Game Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.name}</span>
          <img
            src={user.prefs?.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
            alt="User"
            className="h-8 w-8 rounded-full"
          />
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6">Available Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-200"
            >
              <img
                src={game.image}
                alt={game.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-sm text-gray-300">{game.description}</p>
                <button className="mt-4 inline-block bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold">
                  Play Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
