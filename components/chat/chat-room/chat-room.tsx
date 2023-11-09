"use client";

import React, { useState, useEffect } from "react";
import RSSelect, { StylesConfig } from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineSend } from "react-icons/ai";
import { useAuth } from "@clerk/nextjs";

import { initializeSupabaseClient } from "@/lib/supabaseClient";

import { useTheme } from "next-themes";

import { useUser } from "@clerk/clerk-react";

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import ChatView from "@/components/chat/chat-room/chat-view";

import { z } from "zod"; // Import Zod

const titleSchema = z.string().min(1, "Title must not be empty");
const messageSchema = z.string().min(1, "Message must not be empty");

const popularLanguages = [
  "text",
  "javascript",
  "html",
  "css",
  "typescript",
  "php",
  "python",
  "java",
  "go",
  "ruby",
  "rust",
  "c",
  "c++",
  "c#",
  // Add more languages as needed
];

const maxMessagesForFree = 25;

interface CustomStyles {
  option: (defaultStyles: any, state: any) => any;
  placeholder: (provided: any, state: any) => any;
  control: (defaultStyles: any, state: any) => any;
  input: (styles: any) => any;
}

const initialCustomStyles: CustomStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles,
  }),
  placeholder: (provided, state) => ({
    ...provided,
  }),

  control: (defaultStyles, state) => ({
    ...defaultStyles,
    borderRadius: "0.35rem",
    backgroundColor: "transparent",
    borderColor: "gray-300",
  }),
  input: (styles: any) => ({
    ...styles,
    color: "black",
  }),
};

const customStylesDef = (theme: any) => ({
  option: (defaultStyles: any, { isFocused }: any) => ({
    ...defaultStyles,
    backgroundColor: isFocused
      ? theme === "dark"
        ? "#e2e8f0"
        : "#e2e8f0"
      : "transparent",
    color: isFocused
      ? theme === "dark"
        ? "black"
        : "#6B728"
      : theme === "dark"
      ? "black"
      : "#6B728",
    ":active": {
      ...defaultStyles[":active"],
      backgroundColor: isFocused
        ? theme === "dark"
          ? "#e2e8f0"
          : "#e2e8f0"
        : "transparent",
      color: isFocused
        ? theme === "dark"
          ? "black"
          : "#6B728"
        : theme === "dark"
        ? "black"
        : "#6B728",
    },
  }),

  placeholder: (provided: any, state: any) => ({
    // Styles for the placeholder text
    ...provided,
    color: "#6B7280",
    fontSize: "14px",
  }),

  control: (defaultStyles: any, state: any) => ({
    ...defaultStyles,
    borderRadius: "0.35rem",
    backgroundColor: theme === "dark" ? "#020817" : "white",
    borderColor: "gray-300",
    boxShadow: state.isFocused
      ? theme === "dark"
        ? "0 0 0 2px black, 0 0 0 4px white"
        : "0 0 0 2px white, 0 0 0 4px black"
      : "none",
    "&:hover": {
      borderColor: "gray-300",
    },
  }),

  input: (provided: any) => ({
    ...provided,
    color: theme === "dark" ? "white" : "black",
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: theme === "dark" ? "white" : "black",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "14px",
  }),
});

function ChatRoom({ users, selectedChatRoom, subscription }: any) {
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [language, setLanguage] = React.useState("javascript");
  const [errorMessage, setErrorMessage] = React.useState(""); // State for error message
  const [titleError, setTitleError] = React.useState(""); // State for title error message
  const [messageError, setMessageError] = React.useState(""); // State for message error message

  const { sendChatMessage, getChatMessagesForChatRoom } = useSupabaseChat();

  const [currentChatRoomId, setCurrentChatRoomId] = React.useState<any>(null);

  const { getToken } = useAuth();

  const { resolvedTheme } = useTheme();

  const [chatMessages, setChatMessages] = React.useState<any>([]);

  const getMessages = async (chatRoomId: any) => {
    // console.log("getMessages::::", chatRoomId);
    const messages = await getChatMessagesForChatRoom(chatRoomId);
    setChatMessages(messages);
  };

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
    setCustomStyles(customStylesDef(resolvedTheme));
  }, [resolvedTheme]);

  const { user } = useUser();

  const [customStyles, setCustomStyles] =
    useState<CustomStyles>(initialCustomStyles);

  // useEffect(() => {
  //   setCustomStyles(customStylesDef(theme));
  // }, [theme]);

  useEffect(() => {
    let supabaseRealtime: any;

    const subscribeToRealtime = async () => {
      const supabaseAccessToken = await getToken({
        template: "supabase-codechat",
      });
      const supabase = initializeSupabaseClient(supabaseAccessToken);

      if (user) {
        supabaseRealtime = supabase
          .channel("get_messages_on_delete")
          .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "chat_messages" },
            async (payload: any) => {
              console.log("currentChatRoomId", currentChatRoomId);
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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (subscription === "free") {
      if (selectedChatRoom?.chat_room_id) {
        getMessages(selectedChatRoom?.chat_room_id);
      }
      if (chatMessages.length > maxMessagesForFree) {
        alert("You are on a free plan. Please upgrade to more messages.");
        return;
      }
    }

    // Validate inputs using Zod
    try {
      titleSchema.parse(title); // Validate title
      setTitleError(""); // Clear title error message
    } catch (error: any) {
      // Handle title validation errors and set the error message
      const parsedObject = JSON.parse(error.message);
      setTitleError(parsedObject[0].message);
      return; // Don't proceed if there are validation errors
    }

    try {
      messageSchema.parse(message); // Validate message
      setMessageError(""); // Clear message error message
    } catch (error: any) {
      // Handle message validation errors and set the error message
      const parsedObject = JSON.parse(error.message);
      setMessageError(parsedObject[0].message);
      return; // Don't proceed if there are validation errors
    }

    if (user) {
      sendChatMessage(
        user.id,
        message,
        selectedChatRoom.chat_room_id,
        title,
        language
      );
      setMessage("");
      setTitle("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* <div>{selectedChatRoom.name}</div> */}
      {/*  */}
      {/* <div className="border rounded-lg w-full min-h-[100px]">Chat View</div> */}
      {/* <div>
        {users.map((user: any) => (
          <div>{user.imageUrl}</div>
        ))}
      </div> */}
      <ChatView
        subscription={subscription}
        users={users}
        selectedChatRoom={selectedChatRoom}
      />
      {/*  */}

      {selectedChatRoom && (
        <form action="" onSubmit={handleSend}>
          <div className="flex flex-col gap-4 w-full">
            {chatMessages.length > maxMessagesForFree && (
              <div className="flex w-full text-sm text-red-500 px-4">
                You have reached the limit of allowed chat messages for the free
                tier. Please delete some messages, or upgrade to increase your
                message limit.
              </div>
            )}
            <div>
              <div className="flex gap-4 w-full">
                <Input
                  id="title"
                  type="text"
                  className="text-md sm:text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title"
                />

                {/* <Select onValueChange={(value) => setLanguage(value)}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {popularLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select> */}

                <div className="w-[300px] sm:w-[500px]">
                  <RSSelect
                    placeholder="Language..."
                    // instanceId={instanceId}
                    styles={customStyles}
                    className="basic-single"
                    // classNamePrefix="select"
                    // defaultValue={{ value: items[0], label: items[0] }}
                    // isDisabled={isDisabled}
                    // isLoading={isLoading}
                    // isClearable={isClearable}
                    // isRtl={isRtl}
                    isSearchable={true}
                    name="color"
                    options={popularLanguages.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onChange={(option) => option && setLanguage(option?.value)}
                  />
                </div>
                {/*  */}
              </div>
              {/*  */}
              {titleError && (
                <div className="text-red-500 text-sm">{titleError}</div>
              )}
            </div>
            <div>
              <Textarea
                // ref={textAreaRef}
                value={message}
                className="text-md sm:text-sm"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              {messageError && (
                <div className="text-red-500 text-sm">{messageError}</div>
              )}
            </div>

            <Button type="submit">
              <div className="flex gap-2 items-center">
                <span>Send</span> <AiOutlineSend size={20} />
              </div>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ChatRoom;
