// lib/voice.ts
import { io } from "socket.io-client";

type PeerMap = Record<string, RTCPeerConnection>;

export const createPeerConnection = (
  remoteUserId: string,
  stream: MediaStream,
  socket: any,
  peers: PeerMap
) => {
  const peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  stream.getTracks().forEach((track) => {
    peer.addTrack(track, stream);
  });

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        target: remoteUserId,
        candidate: event.candidate,
      });
    }
  };

  peer.ontrack = (event) => {
    const audio = document.createElement("audio");
    audio.srcObject = event.streams[0];
    audio.autoplay = true;
    audio.play();
  };

  peers[remoteUserId] = peer;
  return peer;
};
