"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { Button } from "../ui/button";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getUserById } from "@/lib/clerkUtils"; // Import the function

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function ChatInvitations({ users }: { users: any }) {
  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getParticipantRecordsForUser } = useSupabaseChat();
  const [allInvitations, setAllInvitations] = useState<any[]>([]); // Specify the type as an array of any
  const [filteredInvitations, setFilteredInvitations] = useState<any[]>([]); // Specify the type as an array of any

  useEffect(() => {
    const fetchInvitations = async () => {
      const participants = await getParticipantRecordsForUser(
        user?.emailAddresses[0].emailAddress as string
      );

      console.log("participants:", participants);
      setAllInvitations(participants!);
      const filteredInvites =
        participants?.filter((participant: any) => {
          return participant.invitation_status === "pending";
        }) || []; // Use an empty array as a fallback if participants is undefined
      setFilteredInvitations(filteredInvites);
    };

    fetchInvitations();
  }, [userId]);

  const handleResetDialog = () => {
    console.log("handleResetDialog");
    // if (selectRef.current) {
    //   setValue("email", "");
    //   setSelectedUser(null);
    // }
  };

  const getFullNameById = (users: any, userId: string) => {
    const user = users.find((user: any) => user.id === userId);
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "Unknown User";
  };

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={handleResetDialog}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {filteredInvitations.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <MdOutlineMarkEmailUnread className="transform scale-150" />
                    {filteredInvitations.length}
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <p>Manage pending invitations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DialogTrigger>
    );
  };

  return (
    <Dialog>
      <ToolTipComponent />

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pending Invitations</DialogTitle>
          <DialogDescription>
            Accept or reject invitations to join chats.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {filteredInvitations.map((invitation) => {
            console.log("invitation.invited_by:", invitation.invited_by);
            // const invitedByName = users?.find(
            //   (user: any) => user.user_id === invitation.invited_by
            // );
            const invitedByName = getFullNameById(users, invitation.invited_by);

            return (
              <div>
                <div>{invitation.chat_room_name}</div>{" "}
                <div>
                  invited by:
                  {invitedByName}
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChatInvitations;
