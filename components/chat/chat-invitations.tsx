"use client";

import React, { use, useEffect, useState } from "react";
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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

import { initializeSupabaseClient } from "@/lib/supabaseClient";

import { useToast } from "@/components/ui/use-toast";

function ChatInvitations({ users }: { users: any }) {
  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getParticipantRecordsForUser, changeParticipantStatus } =
    useSupabaseChat();
  const [allInvitations, setAllInvitations] = useState<any[]>([]); // Specify the type as an array of any
  const [filteredInvitations, setFilteredInvitations] = useState<any[]>([]); // Specify the type as an array of any

  const { toast } = useToast();

  const supbaseRealtimeSubscription = async () => {
    const supabaseAccessToken = await getToken({
      template: "supabase-codechat",
    });

    const supabase = initializeSupabaseClient(supabaseAccessToken);

    supabase
      .channel("invitations_for_user")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_participants" },
        fetchInvitations
      )
      .subscribe();
  };

  useEffect(() => {
    supbaseRealtimeSubscription();
  }, []);

  const fetchInvitations = async () => {
    const participants = await getParticipantRecordsForUser(
      user?.emailAddresses[0].emailAddress as string
    );

    // console.log("participants:", participants);
    setAllInvitations(participants!);
    const filteredInvites =
      participants?.filter((participant: any) => {
        return participant.invitation_status === "pending";
      }) || []; // Use an empty array as a fallback if participants is undefined
    setFilteredInvitations(filteredInvites);
  };

  useEffect(() => {
    fetchInvitations();
  }, [userId]);

  const getFullNameById = async (userId: string) => {
    const response = await fetch("/api/get-user-by-id", {
      method: "POST",
      body: JSON.stringify({ id: userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("response", response);

    const data = await response.json();

    console.log("data", data.data.firstName);

    const fullName = data.data.firstName + " " + data.data.lastName;

    return fullName;
  };

  // const handleChangeParticipantStatus =
  //   (status: string, participantId: string) => async () => {
  //     console.log("handleChangeParticipantStatus", status, participantId);
  //     const response = await changeParticipantStatus(status, participantId);
  //     console.log("response:", response);
  //     fetchInvitations();
  //   };

  function handleChangeParticipantStatus(
    status: string,
    participantId: string,
    chatRoomName: string
  ) {
    console.log("handleChangeParticipantStatus", status, participantId);
    changeParticipantStatus(status, participantId).then((response) => {
      console.log("response:", response);
      // fetchInvitations();
    });
    toast({
      title: "Invitation status updated.",
      description: `Invitation status for "${chatRoomName}" was updated successfully to "${status}".`,
    });
  }

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        {filteredInvitations.length > 0 && (
          <Button size="sm" variant="ghost">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex gap-2 items-center">
                    <MdOutlineMarkEmailUnread className="transform scale-150" />
                    {filteredInvitations.length}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="mb-2">
                  <div>Manage pending invitations</div>
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
        {filteredInvitations.length === 0 && (
          <div className="text-center py-4">
            <div className="text-orange-600">
              No pending invitations. Press confirm to exit this dialog.
            </div>
          </div>
        )}
        <div className="grid gap-4 py-4">
          {filteredInvitations.map((invitation) => {
            console.log("invitation.invited_by:", invitation.invited_by);
            const invitedByName = getFullNameById(invitation.invited_by);
            return (
              <div
                key={invitation.participant_id}
                className="border rounded px-4 py-2 flex flex-col "
              >
                <div>Chat title: {invitation.chat_room_name}</div>
                <div>Invited by: {invitedByName}</div>
                <div className="flex gap-4 mt-2 mb-2">
                  <RadioGroup
                    defaultValue="pending"
                    onValueChange={(value) => {
                      console.log("onValueChange", value);
                      handleChangeParticipantStatus(
                        value as string,
                        invitation.participant_id,
                        invitation.chat_room_name
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
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChatInvitations;
