"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { useUser } from "@clerk/nextjs";
import ChatList from "./chat-list";
import CreateChat from "./create-chat";
import EditChat from "./edit-chat";
import Invite from "./invite-contacts";

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
        <div className="flex flex-col gap-4">
          <ChatList
            selectedChatRoom={selectedChatRoom}
            setSelectedChatRoom={setSelectedChatRoom}
            chatRooms={chatRooms}
            setChatRooms={setChatRooms}
          />

          <div className="flex gap-4">
            <CreateChat />
            <EditChat selectedChatRoom={selectedChatRoom} />
            <Invite selectedChatRoom={selectedChatRoom} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
