import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineSend } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const popularLanguages = [
  "message",
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

function ChatRoom({ selectedChatRoom }: any) {
  const [language, setLanguage] = React.useState("javascript");

  const handleSend = (e: any) => {
    e.preventDefault();
    console.log("send");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* <div>{selectedChatRoom.name}</div> */}
      {/*  */}
      <div className="border rounded-lg w-full min-h-[100px]">Chat View</div>
      {/*  */}

      <form action="" onSubmit={handleSend}>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-4 w-full">
            <Input
              id="title"
              type="text"
              className="text-md sm:text-sm"
              // value={title}
              // onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title"
            />

            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {popularLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            // ref={textAreaRef}
            // value={currentMessage}
            className="border rounded p-2 outline-gray-400 w-full h-40"
            // onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type a message..."
          />

          <Button type="submit">
            <div className="flex gap-2 items-center">
              <span>Send</span> <AiOutlineSend size={20} />
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatRoom;
