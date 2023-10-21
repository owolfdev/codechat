// hooks/useDefaultChat.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { initializeSupabaseClient } from "@/lib/supabaseClient";

export function useSupabaseChat() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [defaultChatRoomExists, setDefaultChatRoomExists] = useState(false);

  const getChatRooms = async () => {
    console.log("Getting chat rooms...");
    await checkDefaultChatRoomExists();

    // Rest of your code
    if (defaultChatRoomExists) {
      console.log("Default chat room exists.");
      // Add the code you want to run after the chat room exists here
    }
    // After the default chat room code is run, call getChatRoomList
    const data = await getChatRoomList();
    return data;
  };

  const getChatRoomList = async () => {
    if (isLoaded && isSignedIn && user) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("admin_id", user.id);

      if (data) {
        console.log("Chat rooms found:", data);
        return data;
        // You can process the list of chat rooms here or return it as needed
      } else if (error) {
        console.error(error);
      }
    }
  };

  const checkDefaultChatRoomExists = async () => {
    if (isLoaded && isSignedIn && user) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("admin_id", user.id);

      if (data && data.length > 0) {
        console.log("This user has a chat room.");
        setDefaultChatRoomExists(true); // Set the flag to true if a chat room exists
      } else if (error) {
        console.error(error);
      } else {
        console.log("This user does not have a chat room.");
        await createDefaultChatRoom();
      }
    }
  };

  const createDefaultChatRoom = async () => {
    console.log("Creating default chat room...");
    if (isLoaded && isSignedIn && user && !defaultChatRoomExists) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      const { data, error } = await supabase.from("chat_rooms").insert({
        name: `${user.firstName}'s Chat Room`,
        description: `${user.firstName}'s default chat space.`,
        admin_id: user.id,
      });

      if (error) {
        console.error(error);
        alert("Error creating chat room");
      } else {
        console.log("Default chat room created successfully.");
        setDefaultChatRoomExists(true);
        // You can add any additional logic here if needed
      }
    }
  };

  return {
    getChatRooms,
  };
}
