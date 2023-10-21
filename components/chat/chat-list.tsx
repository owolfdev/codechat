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

interface ChatRoom {
  chat_room_id: string;
  name: string;
}

function ChatList({
  chatRooms,
  setSelectedChatRoom,
  selectedChatRoom,
}: {
  chatRooms: ChatRoom[];
  setSelectedChatRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  selectedChatRoom: ChatRoom | null;
}) {
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
