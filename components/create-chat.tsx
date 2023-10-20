"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { log } from "console";

const supabaseClient = (supabaseAccessToken: any) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );
  // set Supabase JWT on the client object,
  // so it is sent up with all Supabase requests
  return supabase;
};

const CreateChat = () => {
  const [loading, setLoading] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [chatRoomExists, setChatRoomExists] = useState(false);

  useEffect(() => {
    const checkChatRoomExists = async () => {
      if (isLoaded && isSignedIn && user) {
        const supabaseAccessToken = await getToken({
          template: "supabase-codechat",
        });

        const supabase = supabaseClient(supabaseAccessToken);

        const { data, error } = await supabase
          .from("chat_rooms")
          .select("*")
          .eq("admin_id", user.id);

        if (data && data.length > 0) {
          // A chat room already exists for the current user
          console.log("chat room exists");
        } else if (error) {
          console.error(error);
        } else {
          createChatRoom();
        }
      }
    };
    checkChatRoomExists();
  }, [isLoaded, isSignedIn, user]);

  const createChatRoom = async () => {
    console.log("createChatRoom");
    if (isLoaded && isSignedIn && user && !chatRoomExists) {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });

      const supabase = supabaseClient(supabaseAccessToken);

      const { data, error } = await supabase.from("chat_rooms").insert({
        name: `${user.firstName}'s chat room`,
        description: `${user.firstName}'s default chat space`,
        admin_id: user.id,
      });

      if (error) {
        console.error(error);
        alert("Error creating chat room");
      } else {
        alert("Chat room created successfully");
        setChatRoomExists(true);
      }
    }
  };

  return <div>Create default chat room.</div>;
};

export default CreateChat;
