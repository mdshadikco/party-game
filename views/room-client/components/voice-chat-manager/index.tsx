"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { socket } from "@/lib/socket";
import Peer from "simple-peer";

export default function VoiceChatManager({ roomId, userId }: { roomId: string; userId: string }) {
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ [userId: string]: Peer.Instance }>({});
  const [micOn, setMicOn] = useState(true);

  useEffect(() => {
    const enableVoice = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        socket.emit("voice-join", { roomId, userId });

        // Listen for new users joining voice chat
        socket.on("voice-user-joined", ({ userId: remoteId }) => {
          if (remoteId === userId || peersRef.current[remoteId]) return;

          const peer = createPeer(remoteId, stream);
          peersRef.current[remoteId] = peer;
        });

        // When another user sends us a signal
        socket.on("voice-signal", ({ from, signal }) => {
          let peer = peersRef.current[from];

          if (!peer) {
            peer = addPeer(from, stream);
            peersRef.current[from] = peer;
          }

          peer.signal(signal);
        });

        // Clean up when user leaves
        socket.on("voice-user-left", ({ userId: remoteId }) => {
          const peer = peersRef.current[remoteId];
          if (peer) {
            peer.destroy();
            delete peersRef.current[remoteId];
          }
        });

      } catch (err) {
        console.error("❌ Mic permission denied or error:", err);
      }
    };

    enableVoice();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      Object.values(peersRef.current).forEach((peer) => peer.destroy());
      socket.off("voice-user-joined");
      socket.off("voice-signal");
      socket.off("voice-user-left");
    };
  }, [roomId, userId]);

  const createPeer = (remoteId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("voice-signal", {
        to: remoteId,
        from: userId,
        signal,
      });
    });

    peer.on("stream", (remoteStream) => {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch((e) => console.error("🔇 Error playing audio:", e));
    });

    return peer;
  };

  const addPeer = (remoteId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("voice-signal", {
        to: remoteId,
        from: userId,
        signal,
      });
    });

    peer.on("stream", (remoteStream) => {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch((e) => console.error("🔇 Error playing remote audio:", e));
    });

    return peer;
  };

  const toggleMic = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setMicOn((prev) => !prev);
  };

  return (
    <div className="relative left-0 z-20">
      <button
        onClick={toggleMic}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition duration-200 text-white font-medium`}
      >
        {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-neutral-300" />}
      </button>
    </div>
  );
}
