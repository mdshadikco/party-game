// app/languages/page.tsx
"use client";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Mic,
  Plus,
  ArrowLeft,
  Globe,
  Users,
  Sparkles,
  Volume2,
} from "lucide-react";
import CustomAlert from "@/component/common/alert-message";

const languages = [
  {
    name: "English",
    code: "en",
    flag: "🇺🇸",
    gradient: "from-blue-500 via-purple-500 to-indigo-600",
    bgGradient: "from-blue-500/20 via-purple-500/20 to-indigo-600/20",
    description: "Global language for worldwide fun",
  },
  {
    name: "Hindi",
    code: "hi",
    flag: "🇮🇳",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    bgGradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
    description: "हिंदी में मज़ेदार गाने गाएं",
  },
  {
    name: "Nepali",
    code: "ne",
    flag: "🇳🇵",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgGradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    description: "नेपाली गीतहरूको साथ रमाइलो गर्नुहोस्",
  },
];

const returnGradientColor = (lang : string | null) => {
  switch (lang) {
    case 'English':
      console.log("Here")
      return "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-600/20"
    case 'Hindi':
      return "bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20"
    case 'Nepali':
      return "bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
    default:
      return "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500"
  }
}

export default function LanguageSelectionPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleLanguageSelect = (language: string) => {
    console.log({ language });
    setSelectedLanguage(language);
    setIsSearching(true);

    socket.emit(
      "find-available-room",
      language.toLowerCase(),
      (response: any) => {
        setIsSearching(false);
        if (response && response.roomId) {
          router.push(`/mic-grab/room/${response.roomId}`);
        } else {
          setAlertMessage("No room available. Please create one.");
        }
        setSelectedLanguage(null);
      }
    );
  };

  const handleCreateRoom = () => {
    router.push("/mic-grab/create-room");
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    router.prefetch("/mic-grab/create-room");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Volume2 className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Mic Grab
                  </h1>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    Choose your language
                  </p>
                </div>
              </div>
            </div>

            {/* Create Room Button */}
            <button
              onClick={handleCreateRoom}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full font-medium shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Room</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
              <Globe className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">Language Selection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Choose Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Language
              </span>
            </h2>

            <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
              Select your preferred language to find or create a karaoke room
            </p>
          </div>

          {/* Language Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {languages.map((lang, index) => (
              <div
                key={lang.code}
                className={`group relative bg-gradient-to-br ${
                  lang.bgGradient
                } backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer ${
                  selectedLanguage === lang.name
                    ? "ring-2 ring-purple-400 scale-105"
                    : ""
                } ${
                  isSearching && selectedLanguage === lang.name
                    ? "pointer-events-none"
                    : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => !isSearching && handleLanguageSelect(lang.name)}
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Language Flag Background */}
                <div className="relative h-32 sm:h-36 flex items-center justify-center overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${lang.gradient} opacity-80`}
                  ></div>
                  <div className="relative z-10 text-center">
                    <div
                      className="text-4xl sm:text-5xl mb-2 animate-bounce"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {lang.flag}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/80">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {lang.code.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Animated particles */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div
                      className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>

                {/* Language Info */}
                <div className="p-6 relative z-10">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                      {lang.name}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      {lang.description}
                    </p>

                    {/* Action Button */}
                    <div className="relative">
                      {isSearching && selectedLanguage === lang.name ? (
                        <div className="flex items-center justify-center gap-2 w-full py-3 bg-white/20 rounded-2xl font-semibold text-white">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Searching...</span>
                        </div>
                      ) : (
                        <button
                          className={`w-full bg-gradient-to-r ${lang.gradient} hover:shadow-lg py-3 rounded-2xl font-semibold text-white transition-all duration-300 transform group-hover:scale-105`}
                        >
                          Select Language
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Find Room</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Select a language to automatically find and join available rooms
                with other players
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Create Room</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Want to host your own game? Create a private room and invite
                friends to join
              </p>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-300">
                More languages coming soon!
              </span>
            </div>
          </div>
        </div>
      </main>

      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
          gradientColor={returnGradientColor(selectedLanguage) || ""}
        />
      )}
    </div>
  );
}
