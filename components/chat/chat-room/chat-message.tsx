"use client";
import React, { useState } from "react";
import Image from "next/image";
import { DeleteMessage } from "./delete-message";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export type ChatMessage = {
  chat_room_id: string;
  language: string;
  message_content: string;
  message_id: string;
  sender_id: string;
  timestamp: string;
  title: string;
};

const deleteAlertMessage = "Are you sure you want to delete this message?";

export const ChatContent: React.FC<{ item: ChatMessage }> = React.memo(
  ({ item }) => {
    console.log("ChatContent!!");
    return (
      <pre className=" whitespace-pre-wrap">
        <SyntaxHighlighter
          lineProps={{
            style: {
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              lineBreak: "anywhere",
            },
          }}
          wrapLines={true}
          language={item.language}
          style={vscDarkPlus}
          // Enable code wrapping
          customStyle={{
            borderRadius: "8px",
            padding: "10px",
            whiteSpace: "pre-wrap", // Preserve line breaks
          }}
          className="rounded-lg"
        >
          {item.message_content}
        </SyntaxHighlighter>
      </pre>
    );
  }
);
ChatContent.displayName = "ChatContent";

export const ControlBar: React.FC<{
  message: ChatMessage;
  setCopiedItemId: Function;
  copiedItemId: string | null;
  setCopiedTitles: Function;
  copiedTitles: Record<string, boolean>;
}> = React.memo(
  ({
    message,
    setCopiedItemId,
    copiedItemId,
    setCopiedTitles,
    copiedTitles,
  }) => {
    console.log("ControlBar!!");
    return (
      <div id="control-bar" className="flex pt-1 pb-1 mb-1 gap-4 items-center">
        <div className="">
          <button
            className="text-gray-100 hover:text-gray-200 bg-gray-500 hover:bg-gray-400 rounded-lg px-2 py-1 text-xs w-[60px]"
            onClick={() => {
              navigator.clipboard.writeText(message.message_content);
              setCopiedItemId(message.chat_room_id);
              setTimeout(() => setCopiedItemId(null), 1000); // Reset after a delay
            }}
          >
            {copiedItemId === message.chat_room_id ? "Copied!" : "Copy"}
          </button>
        </div>
        {/* title */}
        <div className="flex w-full justify-center hover:cursor-pointer hover:text-gray-200">
          <div
            onClick={() => {
              navigator.clipboard
                .writeText(message.title)
                .then(() => {
                  console.log("Text copied to clipboard:", message.title);
                  setCopiedTitles((prevCopiedTitles: any) => ({
                    ...prevCopiedTitles,
                    [message.chat_room_id]: true,
                  }));
                  setTimeout(() => {
                    setCopiedTitles((prevCopiedTitles: any) => ({
                      ...prevCopiedTitles,
                      [message.chat_room_id]: false,
                    }));
                  }, 1000); // Reset after a second
                })
                .catch((error) => {
                  console.error("Failed to copy text to clipboard:", error);
                });
            }}
          >
            {copiedTitles[message.chat_room_id]
              ? "Title copied!"
              : message.title}
          </div>
        </div>
        {/* title end */}
        <div>
          <div className="text-gray-100 bg-gray-500  rounded-lg px-2 py-1 text-xs">
            {message.language}
          </div>
        </div>
        {/* {userId === item.sender_id && <div className=""></div>} */}
      </div>
    );
  }
);
ControlBar.displayName = "ControlBar";

const handleDeleteMessage = async (id: string): Promise<void> => {
  console.log("id:", id);
};

function ChatMessage({ message, avatar }: { message: any; avatar?: any }) {
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [copiedTitles, setCopiedTitles] = useState<Record<string, boolean>>({});
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  return (
    <div className="">
      <div key={message.id} className="flex justify-between items-start gap-2">
        <div className="pt-3">
          {avatar && (
            <Image
              src={avatar || "/images/avatar-placeholder.jpg"}
              alt="avatar"
              className="rounded-full"
              width={30}
              height={30}
            />
          )}
        </div>
        <div
          onMouseEnter={() => setHoveredMessageId(message.message_id)}
          onMouseLeave={() => setHoveredMessageId(null)}
          className="relative w-full border rounded-lg px-2 py-1 bg-gray-700 text-white"
        >
          <ControlBar
            message={message}
            setCopiedItemId={setCopiedItemId}
            copiedItemId={copiedItemId}
            setCopiedTitles={setCopiedTitles}
            copiedTitles={copiedTitles}
          />
          {hoveredMessageId === message.message_id && (
            <DeleteMessage
              action={handleDeleteMessage}
              message={message}
              alert_message={deleteAlertMessage}
              title="Delete Message"
              setHoveredMessageId={setHoveredMessageId}
            />
          )}

          <ChatContent item={message} />
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
