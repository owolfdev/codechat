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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

import { Checkbox } from "@/components/ui/checkbox";

function ChatInvitations({ users }: { users: any }) {
  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getParticipantRecordsForUser, changeParticipantStatus } =
    useSupabaseChat();
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

  const handleCheckChange = (event: any) => {
    console.log("handleCheckChange", event);
  };

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        {filteredInvitations.length > 0 && (
          <Button size="sm" variant="ghost" onClick={handleResetDialog}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex gap-2 items-center">
                    <MdOutlineMarkEmailUnread className="transform scale-150" />
                    {filteredInvitations.length}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="mb-2">
                  <p>Manage pending invitations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        )}
      </DialogTrigger>
    );
  };

  return (
    <Dialog>
      <ToolTipComponent />
      <DialogContent className=" top-[200px] max-w-[360px] sm:max-w-[425px] sm:top-1/2">
        <DialogHeader>
          <DialogTitle>Pending Invitations</DialogTitle>
          <DialogDescription>
            Accept or reject invitations to join chats.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {filteredInvitations.map((invitation) => {
            console.log("invitation.invited_by:", invitation.invited_by);
            const invitedByName = getFullNameById(users, invitation.invited_by);
            return (
              <div
                key={invitation.participant_id}
                className="border rounded px-4 py-2 flex flex-col "
              >
                <div>{invitation.chat_room_name}</div>
                <div>invited by: {invitedByName}</div>
                <div className="flex gap-4 mt-2 mb-2">
                  <RadioGroup
                    defaultValue="pending"
                    onValueChange={(value) => {
                      console.log("onValueChange", value);
                      changeParticipantStatus(
                        value as string,
                        invitation.participant_id
                      );
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="r1" />
                      <Label htmlFor="r1">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accepted" id="r2" />
                      <Label htmlFor="r2">Accepted</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rejected" id="r3" />
                      <Label htmlFor="r3">Rejected</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Confirm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChatInvitations;
