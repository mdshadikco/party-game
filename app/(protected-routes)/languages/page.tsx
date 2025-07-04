// app/languages/page.tsx
"use client";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const languages = ["English", "Hindi", "Nepali"];

export default function LanguageSelectionPage() {
  const router = useRouter();

  const handleLanguageSelect = (language: string) => {
    console.log({language})

    socket.emit("find-available-room", language.toLowerCase(), (response: any) => {
      if (response && response.roomId) {
        router.push(`/mic-grab/room/${response.roomId}`);
      } else {
        alert("No room available. Please create one.");
      }
    });
  };
  
  

  const handleCreateRoom = () =>{
    router.push("/mic-grab/create-room");
  }

  useEffect(()=>{
    router.prefetch("/mic-grab/create-room");
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-12 text-white">
    {/* Header */}
    <div className="flex items-center justify-between mb-10">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg 
            className="h-5 w-5 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        </div>
        <span className="font-semibold text-lg">Mic Grab</span>
      </div>
  
      {/* Create Room Button */}
      <button
        onClick={handleCreateRoom} // Define this function in your component
        className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-indigo-400 hover:to-blue-600 px-4 py-2 rounded-lg font-medium shadow-md transition-all"
      >
        + Create Room
      </button>
    </div>
  
    {/* Language Selection */}
    <h1 className="text-3xl font-bold mb-8">🎯 Choose Your Language</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageSelect(lang)}
          className="bg-gradient-to-r from-indigo-400 to-blue-600 hover:from-pink-500 hover:to-red-500 px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all"
        >
          {lang}
        </button>
      ))}
    </div>
  </div>
  
  );
}
