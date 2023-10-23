// hooks/useDefaultChat.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { initializeSupabaseClient } from "@/lib/supabaseClient";
import { log } from "console";

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

      // Use select to fetch chat rooms
      const { data: chatRoomsData, error: chatRoomsError } = await supabase
        .from("chat_rooms")
        .select("*");

      if (chatRoomsError) {
        console.error(chatRoomsError);
        alert("Error fetching chat rooms");
        return;
      }

      if (chatRoomsData) {
        // Use filter to filter chat rooms where the user is a participant
        const filteredChatRooms = await Promise.all(
          chatRoomsData.map(async (chatRoom) => {
            // Check if there is a corresponding record in chat_participants
            const { data: participantsData, error: participantsError } =
              await supabase
                .from("chat_participants")
                .select("*")
                .eq("user_email", user.emailAddresses[0].emailAddress)
                .eq("chat_room_id", chatRoom.chat_room_id)
                .eq("invitation_status", "accepted");

            if (participantsError) {
              console.error(participantsError);
              return null;
            }

            if (participantsData && participantsData.length > 0) {
              return chatRoom;
            }

            return null;
          })
        );

        // Filter out null entries (chat rooms where the user is not a participant)
        const filteredChatRoomsList = filteredChatRooms.filter(Boolean);

        console.log("Chat rooms found:", filteredChatRoomsList);
        return filteredChatRoomsList;
      } else {
        console.log("No chat rooms found for the user.");
        return [];
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
        console.log("This user does not have a chat room. Creating one...");
        const data = await createChatRoom(
          `${user.firstName}'s Chat Room`,
          `${user.firstName}'s default chat space.`
        );
        console.log("data for create default chat room", data);
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

      // Step 1: Insert the new chat room into the chat_rooms table
      const { data: chatRoomData, error } = await supabase
        .from("chat_rooms")
        .insert([
          {
            name,
            description: description || "",
            admin_id: user.id,
          },
        ])
        .select();

      if (error) {
        console.error(error);
        alert("Error creating chat room");
        return;
      }

      console.log("Chat room created successfully. DATA: ", chatRoomData);

      // Define the expected type for chatRoomData
      type ChatRoomData = {
        chat_room_id: string; // Assuming "id" is the chat_room_id field in chat_rooms
      };

      const chatRoomDataForCheckLength = chatRoomData! as ChatRoomData[];

      if (
        Array.isArray(chatRoomData) &&
        chatRoomDataForCheckLength.length > 0
      ) {
        const newChatRoom = chatRoomData[0] as ChatRoomData;

        // Step 2: Insert a record into the chat_participants table

        await addParticipantToChatRoom(
          user.emailAddresses[0].emailAddress,
          newChatRoom.chat_room_id,
          "accepted"
        );

        console.log("Chat room created successfully.");
        // You can add any additional logic here if needed
      } else {
        console.error("Chat room data is null or empty.");
        alert("Error creating chat room");
      }
    }
  };

  const addParticipantToChatRoom = async (
    user_email: string,
    chat_room_id: string,
    invitation_status: string
  ) => {
    if (isLoaded && isSignedIn) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      const { error } = await supabase.from("chat_participants").insert([
        {
          user_email,
          chat_room_id,
          invitation_status,
          joined_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error(error);
        alert("Error adding participant to chat room");
      } else {
        console.log("Participant added to chat room successfully.");
        // You can add any additional logic here if needed
      }
    }
  };

  const getParticipantRecordsForUser = async (userEmail: string) => {
    if (isLoaded && isSignedIn) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      console.log("Getting participant records for user:", userEmail);

      // Use select to fetch participants
      const { data: participantsData, error: participantsError } =
        await supabase
          .from("chat_participants")
          .select("*")
          .eq("user_email", userEmail);

      if (participantsError) {
        console.error(participantsError);
        alert("Error fetching participants");
        return [];
      }

      if (participantsData) {
        // console.log("Participants found:", participantsData);
        return participantsData;
      } else {
        console.log("No participants found for the user.");
        return [];
      }
    }
  };

  return {
    getChatRooms,
    createChatRoom,
    editChatRoomName,
    addParticipantToChatRoom,
    getParticipantRecordsForUser,
  };
}
