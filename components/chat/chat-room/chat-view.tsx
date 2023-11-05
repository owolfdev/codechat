"use client";
import React, { use, useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/nextjs";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { initializeSupabaseClient } from "@/lib/supabaseClient";
import { getUserById } from "@/lib/clerkUtils";
import Image from "next/image";
import ChatMessage from "./chat-message";

interface Participant {
  participant_id: string;
  firstName: string;
  lastName: string;
  user_email: string;
  invitation_status: string;
}

function ChatView({
  users,
  selectedChatRoom,
}: {
  users: any;
  selectedChatRoom: any;
}) {
  const { getChatMessagesForChatRoom } = useSupabaseChat();
  const [chatMessages, setChatMessages] = React.useState<any>([]);
  const [currentChatRoomId, setCurrentChatRoomId] = React.useState<any>(null); // State to hold chatRoomId
  const [sender, setSender] = React.useState<any>(null);

  const { user } = useUser();
  const { getToken } = useAuth();

  const getMessages = async (chatRoomId: any) => {
    const messages = await getChatMessagesForChatRoom(chatRoomId);
    setChatMessages(messages);
  };

  const [participatingUsers, setParticipatingUsers] = useState<any[]>([]);
  const { getParticipantsForChatRoom } = useSupabaseChat();

  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChatRoom?.chat_room_id) {
      getMessages(selectedChatRoom?.chat_room_id);
    }
  }, [selectedChatRoom]);

  useEffect(() => {
    if (selectedChatRoom?.chat_room_id) {
      setCurrentChatRoomId(selectedChatRoom?.chat_room_id); // Set the chatRoomId in state when it changes
    }
  }, [selectedChatRoom?.chat_room_id]);

  useEffect(() => {
    console.log("chatMessages:", chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    let supabaseRealtime: any;

    const subscribeToRealtime = async () => {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });
      const supabase = initializeSupabaseClient(supabaseAccessToken);

      if (user) {
        supabaseRealtime = supabase
          .channel("get_messages_for_chat_room")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "chat_messages" },
            async (payload: any) => {
              console.log(
                "chat room id from realtime in chat view",
                currentChatRoomId // Access the chatRoomId from state
              );
              getMessages(currentChatRoomId); // Pass the chatRoomId to getMessages
            }
          )
          .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "chat_messages" },
            async (payload: any) => {
              console.log(
                "Delete message from realtime in chat view",
                currentChatRoomId // Access the chatRoomId from state
              );
              getMessages(currentChatRoomId); // Pass the chatRoomId to getMessages
            }
          )
          .subscribe();
      }
    };

    const unsubscribeFromRealtime = async () => {
      if (supabaseRealtime) {
        await supabaseRealtime.unsubscribe();
      }
    };

    if (user && currentChatRoomId) {
      subscribeToRealtime();
    }

    return () => {
      unsubscribeFromRealtime();
    };
  }, [user, currentChatRoomId]);

  const getMessageSender = async (senderId: any) => {
    const response = await fetch("/api/get-user-by-id", {
      method: "POST",
      body: JSON.stringify({ userId: senderId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  };

  // useEffect(() => {
  //   getMessageSender(chatMessages[0]?.sender_id);
  // }, []);

  const getParticipants = async () => {
    const currentParticipants = (await getParticipantsForChatRoom(
      selectedChatRoom?.chat_room_id
    )) as Participant[];

    console.log("currentParticipants:", currentParticipants);

    const participating: Participant[] = currentParticipants.map(
      (participant) => {
        return users.find((user: any) => {
          if (
            user.email === participant.user_email &&
            participant.invitation_status === "accepted"
          ) {
            return user;
          }
        });
      }
    );

    console.log("users:", users);
    console.log("participating:", participating);
    setParticipatingUsers(participating);
  };

  useEffect(() => {
    console.log("use effect [messages], scroll to bottom", chatMessages);
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    console.log("selectedChatRoom, from info:", selectedChatRoom);
    if (selectedChatRoom) {
      getParticipants();
    }
  }, [selectedChatRoom]);

  useEffect(() => {
    console.log("sender", sender);
  }, [sender]);

  return (
    <div>
      <div className="border rounded-lg w-full min-h-[100px] max-h-screen px-2 py-2 sm:px-4 sm:py-4 text-black  flex flex-col gap-4 overflow-y-scroll bg-white dark:bg-black ">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500">
            No messages in this chat room yet.
          </div>
        )}
        {chatMessages.map((message: any) => {
          const avatar = participatingUsers.find(
            (user: any) => user?.id === message?.sender_id
          )?.imageUrl;

          return message.sender_id === user?.id ? (
            <div key={message.id} className="flex justify-end w-full">
              <div className="w-full sm:w-11/12">
                <ChatMessage message={message} chatRoom={selectedChatRoom} />
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex justify-start w-full">
              <div className="w-full sm:w-11/12">
                <ChatMessage
                  message={message}
                  avatar={avatar}
                  chatRoom={selectedChatRoom}
                />
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatView;
