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
import { useForm, useFormState } from "react-hook-form";

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

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
  } = useSupabaseChat();
  const dialogRef = useRef<HTMLElement | null>(null);

  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const [allInvitations, setAllInvitations] = useState<any[]>([]); // Specify the type as an array of any
  const [filteredInvitations, setFilteredInvitations] = useState<any[]>([]); // Specify the type as an array of any

  useEffect(() => {
    const fetchInvitations = async () => {
      const participants = await getParticipantRecordsForUser(
        user?.emailAddresses[0].emailAddress as string
      );

      console.log("participants from leave chat:", participants);
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
  }, [user, selectedChatRoom]);

  useEffect(() => {
    console.log("allInvitations:", allInvitations);
    console.log("filteredInvitations:", filteredInvitations);
  }, [allInvitations, filteredInvitations]);

  const handleLeaveChat = (e: any) => {
    console.log("handleLeaveChat");
    changeParticipantStatus("left", filteredInvitations[0].participant_id);
  };

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      // Use type assertion to tell TypeScript that dialogRef.current has a close function
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
                <p>Leave chat</p>
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
              <DialogTitle>Leave Chat</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave this chat?
              </DialogDescription>
            </DialogHeader>

            {/* add form here */}
            {/* <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                onChange={handleUpdateZodState}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Edit the title of your chat room"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Edit the description of your chat room"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <DialogClose asChild>
                    <Button type="submit">Edit Chat</Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
            end form */}
            <div className="flex gap-4">
              <DialogClose asChild>
                <Button onClick={handleLeaveChat}>Leave Chat</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive">Cancel</Button>
              </DialogClose>
            </div>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default LeaveChat;
