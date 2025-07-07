'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gamepad2, LogOut, Sparkles, Play, Music, Mic } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const games = [
    {
      id: 'mic-grab',
      title: 'Mic Grab',
      description: 'A fast-paced mic snatching karaoke game for music lovers!',
      icon: Mic,
      gradient: 'from-pink-500 via-purple-500 to-indigo-500',
      bgGradient: 'from-pink-500/20 via-purple-500/20 to-indigo-500/20',
      href: '/languages',
      players: '1-8 Players',
      difficulty: 'Easy',
      tags: ['Music', 'Party', 'Karaoke']
    },
    {
      id: 'coming-soon-1',
      title: 'Rhythm Rush',
      description: 'Coming soon! Beat-matching game with epic soundtracks.',
      icon: Music,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgGradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
      href: '#',
      players: '1-4 Players',
      difficulty: 'Medium',
      tags: ['Rhythm', 'Music', 'Arcade'],
      comingSoon: true
    },
    {
      id: 'coming-soon-2',
      title: 'Battle Royale Quiz',
      description: 'Coming soon! Last person standing wins the ultimate quiz!',
      icon: Gamepad2,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgGradient: 'from-orange-500/20 via-red-500/20 to-pink-500/20',
      href: '#',
      players: '2-100 Players',
      difficulty: 'Hard',
      tags: ['Quiz', 'Battle', 'Trivia'],
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Gamepad2 className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Game Hub
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Your gaming paradise awaits</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <div className="relative group">
                <img
                  src={user.prefs?.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=8b5cf6&color=fff`}
                  alt="User"
                  className="h-10 w-10 rounded-full ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900 transition-all duration-300 group-hover:ring-pink-400 group-hover:scale-105"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 sm:mb-12">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h2>
              <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
                Ready to dive into some amazing games? Pick your adventure below!
              </p>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-400">3</div>
                <div className="text-sm text-gray-400">Games Available</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">0</div>
                <div className="text-sm text-gray-400">Games Played</div>
              </div>
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-emerald-400">--</div>
                <div className="text-sm text-gray-400">Best Score</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-orange-400">0</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => {
              const IconComponent = game.icon;
              return (
                <Link
                  key={game.id}
                  href={game.comingSoon ? '#' : game.href}
                  className={`group relative bg-gradient-to-br ${game.bgGradient} backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${game.comingSoon ? 'cursor-not-allowed' : 'hover:shadow-purple-500/25'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={game.comingSoon ? (e) => e.preventDefault() : undefined}
                >
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Coming Soon Badge */}
                  {game.comingSoon && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                  
                  {/* Game Icon Background */}
                  <div className="relative h-32 sm:h-40 flex items-center justify-center overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-80`}></div>
                    <div className="relative z-10">
                      <IconComponent className="h-16 w-16 sm:h-20 sm:w-20 text-white drop-shadow-lg" />
                    </div>
                    {/* Animated particles */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                  
                  {/* Game Info */}
                  <div className="p-4 sm:p-6 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                        {game.title}
                      </h3>
                      {!game.comingSoon && (
                        <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                          <Play className="h-4 w-4 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{game.description}</p>
                    
                    {/* Game Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {game.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Game Details */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>{game.players}</span>
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${game.difficulty === 'Easy' ? 'bg-green-500' : game.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        {game.difficulty}
                      </span>
                    </div>
                    
                    {/* Play Button */}
                    {!game.comingSoon && (
                      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-2xl font-semibold text-white transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        Play Now
                      </button>
                    )}
                    
                    {game.comingSoon && (
                      <div className="w-full bg-gradient-to-r from-gray-600 to-gray-700 py-3 rounded-2xl font-semibold text-gray-300 text-center">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-300">More games coming soon! Stay tuned for updates.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}