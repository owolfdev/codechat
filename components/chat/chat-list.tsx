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
import { initializeSupabaseClient } from "@/lib/supabaseClient";
import { set } from "react-hook-form";

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

  React.useEffect(() => {
    const storedChatRoom = localStorage.getItem("selectedChatRoom");
    if (storedChatRoom) {
      setSelectedChatRoom(JSON.parse(storedChatRoom));
    }
  }, []);

  const handleChatRoomSelect = (room: ChatRoom) => {
    console.log("update", room);
    setSelectedChatRoom(room);
    localStorage.setItem("selectedChatRoom", JSON.stringify(room));
  };

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
          console.log(
            "SUPABASE insert for chat_rooms payload:",
            "old:",
            payload.old,
            "new:",
            payload.new
          );
          setSelectedChatRoom(payload.new);
          setChatRooms((prevChatRooms) => {
            return prevChatRooms.map((chatRoom) => {
              if (chatRoom.chat_room_id === payload.new.chat_room_id) {
                return payload.new;
              } else {
                return chatRoom;
              }
            });
          });
          console.log(
            "set selected chat room to local storage for INSERT new chat room",
            payload.new
          );
          localStorage.setItem("selectedChatRoom", JSON.stringify(payload.new));
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
            console.log(
              "SUPABASE update for chat_rooms payload:",
              "old:",
              payload.old,
              "new:",
              payload.new
            );
            setSelectedChatRoom(payload.new);
            setChatRooms((prevChatRooms) => {
              return prevChatRooms.map((chatRoom) => {
                if (chatRoom.chat_room_id === payload.new.chat_room_id) {
                  return payload.new;
                } else {
                  return chatRoom;
                }
              });
            });
            localStorage.setItem(
              "selectedChatRoom",
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

  React.useEffect(() => {
    supabaseRealtimeSubscription();
    console.log(
      "supabaseRealtimeSubscription updated selectedChatRoom",
      selectedChatRoom
    );
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
      <SelectTrigger className="w-[180px]">
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
