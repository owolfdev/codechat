"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm, useFormState } from "react-hook-form";

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

import { useToast } from "@/components/ui/use-toast";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Chat name must be at least 2 characters.",
  }),
  description: z.string(),
});

function LeaveChat({ selectedChatRoom }: any) {
  const {
    editChatRoomName,
    changeParticipantStatus,
    getParticipantRecordsForUser,
    deleteChatRoom,
  } = useSupabaseChat();
  const dialogRef = useRef<HTMLElement | null>(null);

  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const [allInvitations, setAllInvitations] = useState<any[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<any[]>([]);
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchInvitations = async () => {
      const participants = await getParticipantRecordsForUser(
        user?.emailAddresses[0].emailAddress as string
      );
      setAllInvitations(participants!);
      const filteredInvites =
        participants?.filter((participant: any) => {
          return participant.chat_room_id === selectedChatRoom?.chat_room_id;
        }) || [];
      setFilteredInvitations(filteredInvites);
    };
    if (user) {
      fetchInvitations();
    }
    if (user?.id === selectedChatRoom?.admin_id) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user, selectedChatRoom]);

  useEffect(() => {}, [allInvitations, filteredInvitations]);

  const handleLeaveChat = (chatName: string) => {
    toast({
      title: "Success",
      description: `You have left the chat "${chatName}".`,
    });
    changeParticipantStatus("left", filteredInvitations[0].participant_id);
  };

  const handleDeleteChat = async (chatName: string) => {
    console.log("delete chat", chatName);
    await deleteChatRoom(selectedChatRoom?.chat_room_id);
    toast({
      title: "Success",
      description: `You have deleted the chat "${chatName}".`,
    });
    // changeParticipantStatus("deleted", filteredInvitations[0].participant_id);
  };

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      (dialogRef.current as any).close();
    }
  };

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <MdOutlineCancel size={22} />
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <div>Leave or Delete chat</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DialogTrigger>
    );
  };

  return (
    <>
      <div id="modal">
        <Dialog>
          <DialogTrigger asChild>
            <ToolTipComponent />
          </DialogTrigger>
          <DialogContent className=" top-[200px] max-w-[360px] sm:max-w-[425px] sm:top-1/2">
            <DialogHeader>
              {isAdmin ? (
                <DialogTitle>Leave or Delete Chat</DialogTitle>
              ) : (
                <DialogTitle>Leave Chat</DialogTitle>
              )}
              {isAdmin ? (
                <DialogDescription>{`Click "Leave" to leave the chat, or "Delete" to delete the chat, else cancel.`}</DialogDescription>
              ) : (
                <DialogDescription>{`Click "Leave" to leave the chat, else cancel.`}</DialogDescription>
              )}
            </DialogHeader>
            {isAdmin ? (
              <div>
                Are you sure you want to leave or delete{" "}
                <span className="font-bold">{selectedChatRoom?.name}</span>?
              </div>
            ) : (
              <div>
                Are you sure you want to leave{" "}
                <span className="font-bold">{selectedChatRoom?.name}</span>?
              </div>
            )}

            <div className="flex gap-4">
              <DialogClose asChild>
                <Button
                  onClick={(e) => handleLeaveChat(selectedChatRoom?.name)}
                >
                  Leave
                </Button>
              </DialogClose>
              {isAdmin && (
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={(e) => handleDeleteChat(selectedChatRoom?.name)}
                  >
                    Delete
                  </Button>
                </DialogClose>
              )}
              <div>
                <DialogClose asChild>
                  <Button variant="destructive">Cancel</Button>
                </DialogClose>
              </div>
            </div>

            {!isAdmin && (
              <div className="text-sm  text-muted-foreground  ">
                Note: You must be admin to delete the chat.
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default LeaveChat;
