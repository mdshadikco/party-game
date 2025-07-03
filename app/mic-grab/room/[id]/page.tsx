// app/mic-grab/room/[id]/page.tsx

import { db } from "@/lib/database";
import RoomClient from "@/views/room-client";
import { notFound } from "next/navigation";

const ROOMS_COLLECTION_ID = process.env.NEXT_PUBLIC_ROOMS_ID || "";

export default async function Room({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = await params;

  try {
    const room = await db.get(ROOMS_COLLECTION_ID, roomId);
    return <RoomClient room={room} />;
  } catch (error) {
    console.error("Room fetch error:", error);
    notFound();
  }
}