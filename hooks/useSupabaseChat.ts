// hooks/useDefaultChat.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { initializeSupabaseClient } from "@/lib/supabaseClient";

export function useSupabaseChat() {
  //
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
        const data = await createDefaultChatRoom();
        console.log("data for create default chat room", data);
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

  const editChatRoomName = async (
    roomId: string,
    newName: string,
    description: string
  ) => {
    if (isLoaded && isSignedIn && user) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      const { data, error } = await supabase
        .from("chat_rooms")
        .update({ name: newName, description: description })
        .eq("chat_room_id", roomId)
        .eq("admin_id", user.id);

      if (error) {
        console.error(error);
        alert("Error editing chat room name");
      } else {
        console.log("Chat room name updated successfully.");
        // You can add any additional logic here if needed
      }
    }
  };

  const createChatRoom = async (name: string, description: string) => {
    console.log("Creating a new chat room...");
    if (isLoaded && isSignedIn && user) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      const { data, error } = await supabase.from("chat_rooms").insert([
        {
          name,
          description: description || "",
          admin_id: user.id,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Error creating chat room");
      } else {
        console.log("Chat room created successfully.");
        // You can add any additional logic here if needed
      }
    }
  };

  return {
    getChatRooms,
    createChatRoom,
    editChatRoomName,
  };
}
