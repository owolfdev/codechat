"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { Button } from "../ui/button";
import { MdOutlineMarkEmailUnread } from "react-icons/md";

function ChatInvitations() {
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

  return (
    <div>
      <div>
        <Button variant="ghost" size="sm">
          {filteredInvitations.length > 0 && (
            <div className="flex gap-2 items-center">
              <MdOutlineMarkEmailUnread className="transform scale-150" />
              {filteredInvitations.length}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ChatInvitations;
