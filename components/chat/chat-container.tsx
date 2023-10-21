"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { useUser } from "@clerk/nextjs";
import ChatList from "./chat-list";

interface ChatRoom {
  chat_room_id: string;
  name: string;
}

function ChatContainer() {
  const { getChatRooms } = useSupabaseChat();
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  ); // Update the type here

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    getChatRooms().then((chatRoomsData: any) => {
      if (chatRoomsData !== undefined) {
        setChatRooms(chatRoomsData);
      }
      setLoading(false);
    });
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="p-10 border rounded">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ChatList
            selectedChatRoom={selectedChatRoom}
            setSelectedChatRoom={setSelectedChatRoom}
            chatRooms={chatRooms}
          />
          {selectedChatRoom && selectedChatRoom.chat_room_id}
        </>
      )}
    </div>
  );
}

export default ChatContainer;
