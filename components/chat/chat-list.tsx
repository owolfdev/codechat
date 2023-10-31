"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { initializeSupabaseClient } from "@/lib/supabaseClient";

interface ChatRoom {
  chat_room_id: string;
  name: string;
}

function ChatList({
  chatRooms,
  setChatRooms,
  setSelectedChatRoom,
  selectedChatRoom,
}: {
  chatRooms: ChatRoom[];
  setSelectedChatRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  selectedChatRoom: ChatRoom | null;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
}) {
  const { getToken } = useAuth();
  const { user } = useUser();

  React.useEffect(() => {
    const storedChatRoom = localStorage.getItem(`selectedChatRoom_${user?.id}`);
    if (storedChatRoom) {
      const storedChatRoomObj = JSON.parse(storedChatRoom);
      const matchingChatRoom = chatRooms.find(
        (room) => room.chat_room_id === storedChatRoomObj.chat_room_id
      );

      if (matchingChatRoom) {
        // Check if the name in local storage matches the name in chatRooms
        if (storedChatRoomObj.name !== matchingChatRoom.name) {
          storedChatRoomObj.name = matchingChatRoom.name; // Update the name
          localStorage.setItem(
            `selectedChatRoom_${user?.id}`,
            JSON.stringify(storedChatRoomObj)
          );
        }
        setSelectedChatRoom(storedChatRoomObj);
      }
    }
  }, [chatRooms, user?.id]);

  const handleChatRoomSelect = (room: ChatRoom) => {
    // console.log("update", room);
    setSelectedChatRoom(room);
    localStorage.setItem(`selectedChatRoom_${user?.id}`, JSON.stringify(room));
  };

  React.useEffect(() => {
    const supabaseRealtimeSubscription = async () => {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      const channel = supabase
        .channel(`chat_rooms_for_chat_list`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_rooms",
          },
          (payload: any) => {
            const roomExists = chatRooms.some(
              (room) => room.chat_room_id === payload.new.chat_room_id
            );

            if (!roomExists) {
              setSelectedChatRoom(payload.new);
              setChatRooms((prevChatRooms) => {
                if (
                  !prevChatRooms.some(
                    (room) => room.chat_room_id === payload.new.chat_room_id
                  )
                ) {
                  return [...prevChatRooms, payload.new];
                }
                return prevChatRooms; // No change needed
              });

              localStorage.setItem(
                `selectedChatRoom_${user?.id}`,
                JSON.stringify(payload.new)
              );
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_rooms",
          },
          (payload: any) => {
            if (payload.new.chat_room_id === selectedChatRoom?.chat_room_id) {
              setSelectedChatRoom(payload.new);
              setChatRooms((prevChatRooms) =>
                prevChatRooms.map((chatRoom) =>
                  chatRoom.chat_room_id === payload.new.chat_room_id
                    ? payload.new
                    : chatRoom
                )
              );

              localStorage.setItem(
                `selectedChatRoom_${user?.id}`,
                JSON.stringify(payload.new)
              );
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    };

    supabaseRealtimeSubscription();
  }, [selectedChatRoom]);

  return (
    <Select
      value={selectedChatRoom?.name || ""}
      onValueChange={(value) => {
        const selectedRoom = chatRooms.find((room) => room.name === value);
        if (selectedRoom) {
          handleChatRoomSelect(selectedRoom);
        }
      }}
    >
      <SelectTrigger className="">
        <SelectValue placeholder="Select a chat">
          {selectedChatRoom ? selectedChatRoom.name : ""}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div>
            {chatRooms.length > 0 ? (
              <div>
                {chatRooms.map((room) => (
                  <SelectItem key={room.chat_room_id} value={room.name}>
                    {room.name}
                  </SelectItem>
                ))}
              </div>
            ) : (
              <div>No chat rooms found.</div>
            )}
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ChatList;
