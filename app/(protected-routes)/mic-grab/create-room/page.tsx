'use client';

import React, { useState } from 'react';
import { db } from '@/lib/database';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { ID, Permission, Query, Role } from 'appwrite';
import { Mic, Users, Globe, Lock, ArrowLeft, Sparkles, Music, Crown, Eye, EyeOff } from 'lucide-react';

const ROOMS_COLLECTION_ID = process.env.NEXT_PUBLIC_ROOMS_ID || ""; // replace this

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name || !language) {
      // Custom alert with better styling
      return;
    }
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

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸', description: 'Global hits and classics' },
    { value: 'hindi', label: 'Hindi', flag: '🇮🇳', description: 'Bollywood and Indian pop' },
    { value: 'nepali', label: 'Nepali', flag: '🇳🇵', description: 'Nepali folk and modern' }
  ];

  const isFormValid = name.trim() && language;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Mic className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Create Room
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">Set up your karaoke experience</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Become the Host
                </span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Create your own karaoke room and invite friends for an unforgettable musical experience!
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="space-y-6">
              {/* Room Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Users className="h-4 w-4 text-purple-400" />
                  Room Name
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter a catchy room name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                  />
                  <div className="absolute right-4 top-4 text-xs text-gray-400">
                    {name.length}/30
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Music className="h-4 w-4 text-purple-400" />
                  Language
                </label>
                <div className="grid gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                        language === lang.value
                          ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <div className="font-semibold text-white">{lang.label}</div>
                            <div className="text-sm text-gray-400">{lang.description}</div>
                          </div>
                        </div>
                        {language === lang.value && (
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Privacy */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  {password ? <Lock className="h-4 w-4 text-purple-400" /> : <Globe className="h-4 w-4 text-purple-400" />}
                  Room Privacy
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter password (leave empty for public room)"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {password ? (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Private room - only people with password can join</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-3 w-3" />
                      <span>Public room - anyone can join</span>
                    </>
                  )}
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                disabled={loading || !isFormValid}
                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
                  loading || !isFormValid
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Room...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Create Room
                  </div>
                )}
              </button>

              {/* Form Validation Message */}
              {!isFormValid && (
                <div className="text-center text-sm text-gray-400 bg-white/5 rounded-2xl p-3">
                  Please fill in the room name and select a language to continue
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-3 text-blue-300">🎯 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Choose a fun, memorable room name that reflects your music taste</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Public rooms get more participants, private rooms offer intimacy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Select the language your group is most comfortable singing in</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}