"use client";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

interface ChatMessage {
  user: string;
  message: string;
}

interface ChatSectionProps {
  roomId: string;
  currentUser: string;
}

export default function ChatSection({ roomId, currentUser }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  console.log({messages, newMessage, currentUser})

  return (
    <div className="w-full max-w-md bg-white/10 text-white rounded-lg p-4 flex flex-col space-y-2 h-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1 text-sm pr-1">
        {messages.map((msg, index) => (
          <div key={index} className="break-words">
            <span className="font-semibold">{msg.user}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-white/20 text-white px-3 py-2 rounded-lg outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
