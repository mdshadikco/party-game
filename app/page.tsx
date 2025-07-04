import { ProtectedRoute } from "@/component/protected-route";
import Image from "next/image";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen justify-center items-center from-gray-400 to-indigo-400 bg-gradient-to-bl text-3xl text-white">
        Why are you here?
      </div>
    </ProtectedRoute>
  );
}
