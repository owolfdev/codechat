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

  const getChatRooms = async () => {
    console.log("Getting chat rooms...");
    const defaultChatRoomExists = await checkDefaultChatRoomExists();

    // Rest of your code
    if (defaultChatRoomExists) {
      console.log("Default chat room exists.");
      // Add the code you want to run after the chat room exists here
    }
    // After the default chat room code is run, call getChatRoomList
    const data = await getChatRoomList(user);
    return data;
  };

  const getChatRoomsForUpdate = async () => {
    console.log("Getting chat rooms for UPDATE...");

    // After the default chat room code is run, call getChatRoomList
    const data = await getChatRoomList(user);
    console.log("data for getChatRoomsForUpdate", data);
    return data;
  };

  const getChatRoomList = async (user: any) => {
    console.log("Getting chat room list... heres the user", user);
    if (user) {
      console.log(
        "Getting chat room list for user!!!!!!!!!:",
        user.emailAddresses[0]
      );
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      console.log("supabase here from get chat room list", supabase);

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
    if (user) {
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
        // setDefaultChatRoomExists(true); // Set the flag to true if a chat room exists
        return true;
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
    if (user) {
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
          "accepted",
          user.id
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
    invitation_status: string,
    invited_by: string
  ) => {
    // console.log("Adding participant to chat room...");
    // console.log("user_email", user_email);
    // console.log("chat_room_id", chat_room_id);

    if (user) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      // Check if a record with the same user_email and chat_room_id already exists
      const { data: existingRecord, error: existingRecordError } =
        await supabase
          .from("chat_participants")
          .select("*")
          .eq("user_email", user_email || "")
          .eq("chat_room_id", chat_room_id);

      if (existingRecordError) {
        console.error(existingRecordError);
        alert("Error checking for existing participant record");
      } else if (existingRecord && existingRecord.length > 0) {
        // Record already exists, show an alert
        alert("This user has already been invited to the chat room.");
      } else {
        // Record doesn't exist, insert it
        // console.log("Adding participant to chat room...");
        // console.log("user_email", user_email);
        // console.log("chat_room_id", chat_room_id);
        // console.log("invitation_status", invitation_status);

        const { error } = await supabase.from("chat_participants").insert([
          {
            user_email,
            chat_room_id,
            invitation_status,
            joined_at: new Date().toISOString(),
            invited_by,
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
    }
  };

  const getParticipantRecordsForUser = async (userEmail: string) => {
    if (user) {
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
        // Iterate through participants and fetch chat room names
        const participantsWithChatRoomNames = await Promise.all(
          participantsData.map(async (participant) => {
            // Fetch the chat room name based on chat_room_id
            const { data: chatRoomData, error: chatRoomError } = await supabase
              .from("chat_rooms")
              .select("name")
              .eq("chat_room_id", participant.chat_room_id);

            if (chatRoomError) {
              console.error(chatRoomError);
              return null;
            }

            const chatRoomName =
              chatRoomData && chatRoomData.length > 0
                ? chatRoomData[0].name
                : "Chat Room Not Found"; // Handle if chat room not found

            return {
              ...participant,
              chat_room_name: chatRoomName,
            };
          })
        );

        return participantsWithChatRoomNames.filter(Boolean);
      } else {
        console.log("No participants found for the user.");
        return [];
      }
    }
  };

  const changeParticipantStatus = async (
    invitation_status: string,
    participant_id: string
  ) => {
    if (user) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = initializeSupabaseClient(supabaseAccessToken);

      // Check if the provided participant_id exists in the chat_participants table
      const { data: existingParticipant, error: existingParticipantError } =
        await supabase
          .from("chat_participants")
          .select("*")
          .eq("participant_id", participant_id);

      if (existingParticipantError) {
        console.error(existingParticipantError);
        alert("Error checking for existing participant record");
        return;
      }

      if (existingParticipant && existingParticipant.length > 0) {
        // Update the invitation_status for the provided participant_id
        const { error } = await supabase
          .from("chat_participants")
          .update({ invitation_status: invitation_status })
          .eq("participant_id", participant_id);

        if (error) {
          console.error(error);
          alert("Error changing participant status");
        } else {
          console.log("Participant status changed successfully.");
          // You can add any additional logic here if needed
        }
      } else {
        alert("Participant not found");
      }
    }
  };

  return {
    getChatRooms,
    getChatRoomsForUpdate,
    createChatRoom,
    editChatRoomName,
    addParticipantToChatRoom,
    getParticipantRecordsForUser,
    changeParticipantStatus,
  };
}
