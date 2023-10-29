"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { useUser } from "@clerk/nextjs";
import ChatList from "./chat-list";
import CreateChat from "./create-chat";
import EditChat from "./edit-chat";
import Invite from "./invite-contacts";
import ChatInvitations from "./chat-invitations";
import LeaveChat from "./leave-chat";
import { initializeSupabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@clerk/nextjs";

interface ChatRoom {
  chat_room_id: string;
  name: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

function ChatContainer({
  users,
  currentUser,
}: {
  users: User[];
  currentUser: User;
}) {
  const { getChatRooms, getChatRoomsForUpdate } = useSupabaseChat();
  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  ); // Update the type here

  const getChatRoomsForUser = async () => {
    console.log("Fetching chat rooms...");
    const chatRoomsData = await getChatRooms();
    console.log("Fetched chat rooms:", chatRoomsData);
    console.log("Fetched", chatRoomsData?.length, "chat rooms");
    if (chatRoomsData !== undefined) {
      setChatRooms(chatRoomsData);
    }
    setLoading(false);
  };

  const getChatRoomsForUserUpdate = async () => {
    console.log("Fetching chat rooms for realtime update...");
    const chatRoomsData = await getChatRoomsForUpdate();
    console.log("Fetched chat rooms:", chatRoomsData);
    console.log("Fetched", chatRoomsData?.length, "chat rooms");
    if (chatRoomsData !== undefined) {
      setChatRooms(chatRoomsData);
    }
    setLoading(false);
    return chatRoomsData;
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    getChatRoomsForUser();
  }, [isLoaded, isSignedIn, user]);

  const supbaseRealtimeSubscription = async () => {
    const supabaseAccessToken = await getToken({
      template: "supabase-codechat",
    });

    const supabase = initializeSupabaseClient(supabaseAccessToken);

    if (user && chatRooms) {
      supabase
        .channel("user_chat_rooms_list_for_user_invitations")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "chat_participants" },
          async (payload: any) => {
            // Check if the updated participant is in the selected chat room

            console.log("PAYLOAD", payload);

            const chatRoomsForFilter = await getChatRoomsForUserUpdate();

            setChatRooms(chatRoomsForFilter!);

            let chatRoom = chatRoomsForFilter?.find(
              (room) => room.chat_room_id === payload.new.chat_room_id
            );

            console.log("CHAT ROOMS", chatRoomsForFilter);

            if (!chatRoom && chatRoomsForFilter) {
              chatRoom = chatRoomsForFilter[0];
            }

            console.log("CHAT ROOM from chat container", chatRoom);

            if (!chatRoom) return;

            // Update the selected chat room with the new payload
            console.log("PAYLOAD", payload.new);
            setSelectedChatRoom(chatRoom!);

            // Update local storage
            localStorage.setItem(
              `selectedChatRoom_${user.id}`,
              JSON.stringify(chatRoom)
            );

            // Run getChatRoomsForUserUpdate to ensure chat room data is up to date
          }
        )
        .subscribe();
    }
  };

  useEffect(() => {
    if (user && isLoaded && isSignedIn) {
      supbaseRealtimeSubscription();
    }

    const unsubscribeRealtimeSubscription = async () => {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      return () => {
        if (user && isLoaded && isSignedIn) {
          supabase
            .channel("user_chat_rooms_list_for_user_invitations")
            .unsubscribe();
        }
      };
    };

    unsubscribeRealtimeSubscription();
  }, [user]);

  return (
    <div className="px-10 py-8 border rounded w-full max-w-screen-md md:min-w-[600px] sm:min-w-[450px]">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-2">
            <div id="admin" className="flex gap-2">
              <CreateChat />
              <EditChat selectedChatRoom={selectedChatRoom} />
              <Invite selectedChatRoom={selectedChatRoom} users={users} />
            </div>
            <div id="user" className="flex gap-2">
              <ChatInvitations users={users} />
              <LeaveChat selectedChatRoom={selectedChatRoom} />
            </div>
          </div>
          <div className="flex w-full">
            <ChatList
              selectedChatRoom={selectedChatRoom}
              setSelectedChatRoom={setSelectedChatRoom}
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
