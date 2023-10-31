// hooks/useDefaultChat.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { initializeSupabaseClient } from "@/lib/supabaseClient";

export function useSupabaseChat() {
  //
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const getChatRooms = async () => {
    const defaultChatRoomExists = await checkDefaultChatRoomExists();
    // Rest of your code
    if (defaultChatRoomExists) {
      // Add the code you want to run after the chat room exists here
    }
    // After the default chat room code is run, call getChatRoomList
    const data = await getChatRoomList(user);
    return data;
  };

  const getChatRoomsForUpdate = async () => {
    // After the default chat room code is run, call getChatRoomList
    const data = await getChatRoomList(user);
    return data;
  };

  const getChatRoomList = async (user: any) => {
    if (user) {
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
        // setDefaultChatRoomExists(true); // Set the flag to true if a chat room exists
        return true;
      } else if (error) {
        console.error(error);
      } else {
        const data = await createChatRoom(
          `${user.firstName}'s Chat Room`,
          `${user.firstName}'s default chat space.`
        );
      }
    }
  };

  const editChatRoomName = async (
    roomId: string,
    newName: string,
    description: string
  ) => {
    console.log("Editing chat room name...");
    console.log("roomId", roomId);
    console.log("newName", newName);
    console.log("description", description);
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

      // Define the expected type for chatRoomData
      type ChatRoomData = {
        chat_room_id: string;
        name: string;
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
        return newChatRoom;

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
        // Record already exists, check the invitation_status
        const existingParticipant = existingRecord[0]; // Assuming there's only one record

        if (existingParticipant.invitation_status === "accepted") {
          alert("Invitation already accepted.");
          return;
        } else if (existingParticipant.invitation_status === "rejected") {
          alert("Invitation already rejected.");
          return;
        }

        // If invitation_status is not accepted or rejected, update it to 'pending'
        const { error: updateError } = await supabase
          .from("chat_participants")
          .update({ invitation_status: "pending" })
          .eq("user_email", existingParticipant.user_email)
          .eq("chat_room_id", existingParticipant.chat_room_id);

        if (updateError) {
          console.error(updateError);
          alert("Error updating participant status");
        } else {
          // You can add any additional logic here if needed
        }
      } else {
        // Record doesn't exist, insert it
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
          return false;
        } else {
          return true;
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
