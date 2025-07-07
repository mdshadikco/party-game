"use client";
import { useEffect, useState } from "react";
import { Plus, User, Check } from "lucide-react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import ChatSection from "./components/chat-sections";
import VoiceChatManager from "./components/voice-chat-manager";

interface RoomClientProps {
  room: any;
}

export default function RoomClient({ room }: RoomClientProps) {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth(); // Use the auth context
  const [participants, setParticipants] = useState([
    { id: 1, isEmpty: true, isUser: false, isReady:false, user:{ id: "", name: ""} },
    { id: 2, isEmpty: true, isUser: false, isReady:false, user:{ id: "", name: ""} },
    { id: 3, isEmpty: true, isUser: false, isReady:false, user:{ id: "", name: ""} },
    { id: 4, isEmpty: true, isUser: false, isReady:false, user:{ id: "", name: ""} },
    { id: 5, isEmpty: true, isUser: false, isReady:false, user:{ id: "", name: ""} },
    { id: 6, isEmpty: true, isUser: false, isReady:false, user:{ id: "", name: ""} },
  ]);

  // Initialize user in room when auth is ready
  useEffect(() => {
    if (!user || authLoading) return;

    console.log("✅ User from context:", user);

    // Place current user in the first empty slot
    setParticipants((prev) => {
      const updated = [...prev];
      const firstEmptyIndex = updated.findIndex((p) => p.isEmpty);
      if (firstEmptyIndex !== -1) {
        updated[firstEmptyIndex] = {
          id: updated[firstEmptyIndex].id,
          isEmpty: false,
          isUser: true,
          isReady: false,
          user: {
            id: user.$id,
            name: user.name,
          },
        };
      }
      return updated;
    });

    // Emit socket events
    socket.emit("user-joined", {
      roomId: room.$id,
      user: {
        id: user.$id,
        name: user.name,
      },
    });

    socket.emit("join-room", {
      roomId: room.$id,
      user: {
        userId: user.$id,
        name: user.name,
      },
      language: room?.language,
    });
  }, [user, authLoading, room.$id]);

  // Handle user leaving the room
  useEffect(() => {
    if (!user) return;

    const handleUserLeave = () => {
      console.log("👋 User leaving room...");
      socket.emit("user-left", {
        roomId: room.$id,
        userId: user.$id,
        userName: user.name,
      });
    };

    // Handle browser close/refresh
    const handleBeforeUnload = (e: any) => {
      handleUserLeave();
      // Optional: Show confirmation dialog when user tries to close
      // e.preventDefault();
      // e.returnValue = 'Are you sure you want to leave the room?';
    };

    // Handle page visibility change (tab switching, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        console.log("📱 Page became hidden");
        // Optional: You might want to start a timer here
        // If user doesn't come back in X seconds, remove them
      } else if (document.visibilityState === "visible") {
        console.log("📱 Page became visible again");
        // User came back, cancel any timers
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function - this runs when component unmounts
    return () => {
      console.log("🧹 Component unmounting, removing user from room");
      handleUserLeave();

      // Remove event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, room.$id]);

  // Socket listeners
  useEffect(() => {
    if (!user) return;

    console.log("🔌 Setting up socket listeners");

    const handleParticipantsUpdate = (updatedList: any[]) => {
        console.log("👥 Participants update received:", updatedList);
      
        const filled = new Array(6).fill(null).map((_, i) => {
          const userData = updatedList[i];
          if (userData) {
            return {
              id: i + 1,
              isEmpty: false,
              isReady: !!userData.isReady, // ensure it's a boolean
              isUser: userData.userId === user.$id,
              user: {
                id: userData.userId,
                name: userData.name ?? "Unknown", // fallback if name is missing
              },
            };
          } else {
            return {
              id: i + 1,
              isEmpty: true,
              isReady: false,
              isUser: false,
              user: {
                id: "",
                name: "",
              },
            };
          }
        });
      
        setParticipants(filled);
      };
      
    const handleReceiveMessage = (msg: any) => {
      console.log("📩 Received:", msg);
    };

    const handleNewUser = (newUser: any) => {
      console.log("🧑 New user joined:", newUser);
      setParticipants((prev) => {
        const updated = [...prev];
        const firstEmptyIndex = updated.findIndex((p) => p.isEmpty);
        if (firstEmptyIndex !== -1) {
          updated[firstEmptyIndex] = {
            id: updated[firstEmptyIndex].id,
            isEmpty: false,
            isUser: false,
            isReady: false,
            user: newUser,
          };
        }
        return updated;
      });
    };

    const handleUserReadyUpdate = ({ userId, isReady }: {userId: any, isReady: any}) => {
      console.log("👀 Ready update received:", userId, isReady);
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.user?.id === userId) {
            console.log(
              "🔄 Updating participant ready state:",
              p.user,
              isReady
            );
            return { ...p, isReady };
          }
          return p;
        })
      );
    };

    socket.on("participants-update", handleParticipantsUpdate);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("new-user", handleNewUser);
    socket.on("user-ready-update", handleUserReadyUpdate);

    return () => {
      console.log("🔌 Cleaning up socket listeners");
      socket.off("participants-update", handleParticipantsUpdate);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("new-user", handleNewUser);
      socket.off("user-ready-update", handleUserReadyUpdate);
    };
  }, [user]);

  const toggleReady = () => {
    console.log("🔄 Toggle ready clicked");
    console.log("Current user:", user);
    console.log("Current participants:", participants);

    if (!user) {
      console.error("❌ No user found");
      return;
    }

    // Find current user's participant data
    const currentUserParticipant = participants.find((p) => p.isUser);

    if (!currentUserParticipant) {
      console.error("❌ Current user not found in participants");
      console.log("Participants:", participants);
      return;
    }

    const newReadyState = !currentUserParticipant.isReady;

    console.log("📤 Emitting ready-state-changed", {
      roomId: room.$id,
      userId: user.$id,
      isReady: newReadyState,
    });

    // Emit socket event
    socket.emit("ready-state-changed", {
      roomId: room.$id,
      userId: user.$id,
      isReady: newReadyState,
    });

    // Update local state immediately for UI responsiveness
    setParticipants((prev) => {
      const updated = prev.map((p) => {
        if (p.isUser) {
          console.log(
            "🔄 Updating user ready state:",
            p.isReady,
            "->",
            newReadyState
          );
          return { ...p, isReady: newReadyState };
        }
        return p;
      });

      console.log("📊 Updated participants:", updated);
      return updated;
    });
  };

  const activePlayers = participants.filter((p) => !p.isEmpty);
  const allSlotsFilledAndReady =
    participants.length === 6 &&
    participants.every((p) => !p.isEmpty) &&
    participants.every((p) => p.isReady);
  const currentUserReady = participants.find((p) => p.isUser)?.isReady || false;

  // Debug logs
  console.log("Current user ready state:", currentUserReady);
  console.log("Active players:", activePlayers.length);

  const getPositionStyle = (index: number): React.CSSProperties => {
    const isLeftSide = index < 3;
    const sideIndex = index % 3;
    const verticalSpacing = 100;
    const horizontalOffset = 140;
    const x = isLeftSide ? -horizontalOffset : horizontalOffset;
    const y = (sideIndex - 1) * verticalSpacing;
  
    return {
      position: "absolute",
      left: `calc(50% + ${x}px - 40px)`,
      top: `calc(50% + ${y}px - 40px)`,
    };
  };
  

  const getAvatarColors = () => {
    const colors = [
      "from-orange-400 to-red-500",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-orange-500",
      "from-cyan-400 to-blue-500",
      "from-purple-400 to-purple-600",
    ];
    return colors;
  };

  const leaveRoom = () => {
    console.log("🚪 User manually leaving room");
    socket.emit("user-left", {
      roomId: room.$id,
      userId: user?.$id,
      userName: user?.name,
    });

    // Navigate back to dashboard or rooms list
    router.push("/dashboard");
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show error if no user (not authenticated)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to join the room</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Main spotlight effect */}
      <div className="absolute top-0 left-1/2 w-64 h-96 bg-gradient-to-b from-cyan-300/30 via-cyan-400/20 to-transparent transform -translate-x-1/2 blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Room info */}
        <div className="absolute top-8 left-8 text-white">
          <h1 className="text-2xl font-bold mb-1">
            🎤 {room?.name || "Game Room"}
          </h1>

          <p className="text-cyan-200 opacity-90">
            Language: {room?.language || "English"}
          </p>
        </div>
        <div className="absolute top-8 right-8">
          <button
            onClick={leaveRoom}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Exit
          </button>
        </div>

        {/* Central game area */}
        <div className="relative w-96 h-80 mb-16">
          {/* Central area - either GET READY button or Stage */}
          {allSlotsFilledAndReady ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80 blur-sm"></div>
              <div className="w-28 h-6 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full mt-1 mx-auto border-2 border-cyan-300/50"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <button
                  onClick={toggleReady}
                  className={`${
                    currentUserReady
                      ? "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700"
                      : "bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
                  } text-white font-bold text-2xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300`}
                >
                  {currentUserReady ? "Cancel" : "Get Ready"}
                </button>
                {!currentUserReady && (
                  <button
                    onClick={() => {}}
                    className="mt-2 bg-gradient-to-r from-indigo-400 to-blue-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Invite Friends
                  </button>
                )}
              </div>
            </div>
          )}

          {/* User avatars */}
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              style={getPositionStyle(index)}
              className="w-20 h-20 relative"
            >
              {participant.isEmpty ? (
                <div className="w-20 h-20 rounded-full border-3 border-dashed border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <Plus className="w-8 h-8 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
              ) : (
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                      getAvatarColors()[index]
                    } p-1 shadow-lg hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-white">
                      <User className="w-8 h-8" />
                    </div>
                  </div>

                  {participant.isReady && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}

                  {!participant.isEmpty && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-800 text-nowrap px-2 py-0.5 rounded-full text-xs text-white font-medium">
                      {participant.isUser
                        ? "YOU"
                        : participant.user?.name || "Player"}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status message */}
        {!allSlotsFilledAndReady && (
          <div className="text-center mb-8">
            <p className="text-white text-lg font-medium">
              {activePlayers.length < 6
                ? `Waiting for players... (${activePlayers.length}/6)`
                : currentUserReady
                ? "Wait for other players to get ready!"
                : "Get ready to start the game!"}
            </p>
            {activePlayers.length === 6 && (
              <p className="text-white/70 text-sm mt-2">
                {activePlayers.filter((p) => p.isReady).length} / 6 players
                ready
              </p>
            )}
          </div>
        )}

        {allSlotsFilledAndReady && (
          <div className="text-center mb-8">
            <p className="text-green-400 text-xl font-bold animate-pulse">
              🎉 All players ready! Game starting soon...
            </p>
          </div>
        )}

        <ChatSection roomId={room.$id} currentUser={user?.name} userId = {user?.$id} />
      </div>
    </div>
  );
}
