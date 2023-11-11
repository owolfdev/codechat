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
import ChatRoom from "./chat-room/chat-room";
import Info from "./info";

import { useRouter } from "next/navigation";

import BarLoader from "react-spinners/BarLoader";

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
  imageUrl: string;
}

function ChatContainer({
  users,
  currentUser,
}: {
  users: User[];
  currentUser: User;
}) {
  const {
    getChatRooms,
    getChatRoomsForUpdate,
    findProfileByUserId,
    createProfile,
  } = useSupabaseChat();
  const { userId, sessionId, getToken } = useAuth();
  const [profileData, setProfileData] = useState<any>(null); // Update the type here
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  ); // Update the type here

  const router = useRouter();

  const getChatRoomsForUser = async () => {
    const chatRoomsData = await getChatRooms();
    if (chatRoomsData !== undefined) {
      setChatRooms(chatRoomsData);
    }
    setLoading(false);
  };

  const getChatRoomsForUserUpdate = async () => {
    const chatRoomsData = await getChatRoomsForUpdate();
    if (chatRoomsData !== undefined) {
      setChatRooms(chatRoomsData);
    }
    setLoading(false);
    return chatRoomsData;
  };

  const getProfile = async (_userId: string) => {
    console.log("getProfile: ", _userId);
    let profile = await findProfileByUserId(_userId);

    if (profile === undefined) {
      profile = await createProfile(_userId, "free");
    }

    console.log("profile: ", profile);

    return profile;
  };

  // useEffect(() => {
  //   router.refresh();
  // }, [router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;
    console.log("check for user profile: ", user, userId);
    getChatRoomsForUser();
    getProfile(userId!).then((data: any) => {
      console.log("data from subscription: ", data);
      setProfileData({
        id: userId!,
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.emailAddresses[0].emailAddress,
        imageUrl: user!.imageUrl,
        subscription: data?.subscription,
      });
    });
  }, [isLoaded, isSignedIn, user, userId]);

  useEffect(() => {
    console.log("profileData", profileData);
  }, [profileData]);

  useEffect(() => {
    let supabaseRealtime: any;

    const subscribeToRealtime = async () => {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });
      const supabase = initializeSupabaseClient(supabaseAccessToken);

      if (user && chatRooms) {
        supabaseRealtime = supabase
          .channel("user_chat_rooms_list_for_user_invitations")
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "chat_participants" },
            async (payload: any) => {
              const chatRoomsForFilter = await getChatRoomsForUserUpdate();
              setChatRooms(chatRoomsForFilter!);
              let chatRoom = chatRoomsForFilter?.find(
                (room) => room.chat_room_id === payload.new.chat_room_id
              );
              if (!chatRoom && chatRoomsForFilter) {
                chatRoom = chatRoomsForFilter[0];
              }
              if (!chatRoom) return;
              setSelectedChatRoom(chatRoom!);
              localStorage.setItem(
                `selectedChatRoom_${user.id}`,
                JSON.stringify(chatRoom)
              );
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

    if (user && isLoaded && isSignedIn) {
      subscribeToRealtime();
    }

    return () => {
      unsubscribeFromRealtime();
    };
  }, [user]);

  return (
    <div>
      {loading ? (
        <div className=" h-1/2 pt-[200px]">
          <BarLoader
            color="#767676"
            loading={loading}
            width={200}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="px-2 py-2 sm:px-8 sm:py-6 border rounded-lg w-full max-w-[360px] sm:max-w-screen-lg md:min-w-[740px] sm:min-w-[600px] dark:bg-gray-900 bg-gray-100 ">
          <div className="flex flex-col gap-4 items-center sm:items-stretch w-full">
            <div className="flex justify-between gap-2">
              <div id="admin" className="flex gap-2">
                <CreateChat subscription={profileData?.subscription} />
                {selectedChatRoom && (
                  <EditChat selectedChatRoom={selectedChatRoom} />
                )}
                {selectedChatRoom && (
                  <Invite selectedChatRoom={selectedChatRoom} users={users} />
                )}
              </div>
              <div id="user" className="flex gap-2">
                {selectedChatRoom && (
                  <Info users={users} selectedChatRoom={selectedChatRoom} />
                )}
                <ChatInvitations users={users} />
                {selectedChatRoom && (
                  <LeaveChat
                    selectedChatRoom={selectedChatRoom}
                    users={users}
                  />
                )}
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
            <div>
              <ChatRoom
                subscription={profileData?.subscription}
                users={users}
                selectedChatRoom={selectedChatRoom}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
