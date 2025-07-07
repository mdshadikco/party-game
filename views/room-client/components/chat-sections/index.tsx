"use client";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import VoiceChatManager from "../voice-chat-manager";
import { Send, Smile, Mic, MicOff } from "lucide-react";

interface ChatMessage {
  user: string;
  message: string;
}

interface ChatSectionProps {
  roomId: string;
  currentUser: string;
  userId?: string;
}

export default function ChatSection({
  roomId,
  currentUser,
  userId,
}: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonEmojis = ["😊", "😂", "👍", "👎", "❤️", "😢", "😮", "🔥", "👏", "🎉"];

  useEffect(() => {
    const handleReceiveMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to the bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const chatPayload = {
      roomId,
      message: {
        user: currentUser,
        message: newMessage.trim(),
      },
    };

    socket.emit("send-message", chatPayload);
    setMessages((prev) => [...prev, chatPayload.message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    // Add voice recognition logic here
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const isCurrentUserMessage = (user: string) => user === currentUser;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      {/* Chat Messages - Only show recent messages */}
      {messages.length > 0 && (
        <div className="max-h-32 overflow-y-auto mb-4 mx-4 sm:mx-8">
          <div className="space-y-2">
            {messages.slice(-3).map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  isCurrentUserMessage(msg.user) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-lg backdrop-blur-sm ${
                    isCurrentUserMessage(msg.user)
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {!isCurrentUserMessage(msg.user) && (
                    <div className="text-xs text-cyan-200 mb-1 font-medium">
                      {msg.user}
                    </div>
                  )}
                  <div className="text-sm leading-relaxed">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 sm:left-8 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xl">
          <div className="grid grid-cols-5 gap-2">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 text-lg hover:bg-white/20 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-md border-t border-white/10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-200 flex-shrink-0 backdrop-blur-sm border border-white/20"
            >
              <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Voice Chat Manager */}
            <div className="flex-shrink-0">
              <VoiceChatManager roomId={roomId} userId={userId || ""} />
            </div>

            {/* Mic Button
            <button
              onClick={toggleMic}
              className={`p-2 sm:p-3 rounded-xl transition-all duration-200 flex-shrink-0 backdrop-blur-sm border border-white/20 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button> */}

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}