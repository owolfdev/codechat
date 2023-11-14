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

import { Checkbox } from "@/components/ui/checkbox";

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

interface Participant {
  participant_id: string;
  firstName: string;
  lastName: string;
  user_email: string;
  invitation_status: string;
}

function LeaveChat({ selectedChatRoom, users }: any) {
  const {
    editChatRoomName,
    changeParticipantStatus,
    getParticipantRecordsForUser,
    deleteChatRoom,
    getParticipantsForChatRoom,
  } = useSupabaseChat();
  const dialogRef = useRef<HTMLElement | null>(null);

  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const [participatingUsers, setParticipatingUsers] = useState<any[]>([]);

  const [allInvitations, setAllInvitations] = useState<any[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<any[]>([]);
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const getParticipants = async () => {
    const currentParticipants = (await getParticipantsForChatRoom(
      selectedChatRoom?.chat_room_id
    )) as Participant[];

    const participating: Participant[] = currentParticipants.map(
      (participant) => {
        return users.find((user: any) => {
          if (
            user.email === participant.user_email &&
            participant.invitation_status === "accepted"
          ) {
            return user;
          }
        });
      }
    );

    setParticipatingUsers(participating);
  };

  useEffect(() => {
    if (selectedChatRoom) {
      getParticipants();
    }
  }, [selectedChatRoom]);

  useEffect(() => {}, [participatingUsers]);

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
    await deleteChatRoom(selectedChatRoom?.chat_room_id);
    toast({
      title: "Success",
      description: `You have deleted the chat "${chatName}".`,
    });
    // changeParticipantStatus("deleted", filteredInvitations[0].participant_id);
  };

  const handleCheckboxChange = (e: any) => {};

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
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
              </div>
            </div>
            {/* {isAdmin && (
              <div className="flex flex-col gap-1">
                <span className="font-bold">Suspend Participant:</span>
                <div className="flex flex-col gap-2">
                  {participatingUsers?.map((participant, index) => (
                    <div key={index}>
                      {participant && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={participant.participant_id}
                            onCheckedChange={handleCheckboxChange}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {participant?.firstName} {participant?.lastName}
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )} */}

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
