"use client";

import { getUserById } from "@/lib/clerkUtils";

import { Button } from "../ui/button";

import { AiOutlineInfoCircle } from "react-icons/ai";

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

import { useUser } from "@clerk/nextjs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { Divide } from "lucide-react";

interface Participant {
  participant_id: string;
  firstName: string;
  lastName: string;
  user_email: string;
  invitation_status: string;
}

function Info({
  users,
  selectedChatRoom,
}: {
  users: any;
  selectedChatRoom: any;
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participatingUsers, setParticipatingUsers] = useState<any[]>([]);
  const { getParticipantsForChatRoom } = useSupabaseChat();

  const { user } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (selectedChatRoom && user?.id === selectedChatRoom.admin_id) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [selectedChatRoom, user]);

  const getFullNameById = async (userId: string) => {
    const response = await fetch("/api/get-user-by-id", {
      method: "POST",
      body: JSON.stringify({ id: userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const fullName = data?.data?.firstName + " " + data?.data?.lastName;

    return fullName;
  };

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

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="">
                  <AiOutlineInfoCircle className="transform scale-150" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <div>Information</div>
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
      <DialogContent className=" top-[200px] max-w-[360px] sm:max-w-[425px] sm:top-1/2">
        <DialogHeader>
          <DialogTitle>About This Chat</DialogTitle>
          <DialogDescription>
            <div>Information about the selected chat room.</div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <span className="font-bold">Title:</span>{" "}
            <span className="font-bold">{selectedChatRoom?.name}</span>
          </div>
          <div>
            <span className="font-bold">Description:</span>{" "}
            {selectedChatRoom?.description}
          </div>
          <div>
            <span className="font-bold">Administrator:</span>{" "}
            <span>
              {isAdmin ? (
                <span>You are Admin.</span>
              ) : (
                <span>{getFullNameById(selectedChatRoom?.admin_id)}</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {/* <div>Participating Users:{JSON.stringify(participatingUsers)}</div> */}
            <span className="font-bold">Participants:</span>
            <div>
              {participatingUsers?.map((participant, index) => (
                <div key={participant?.firstName + index}>
                  {participant?.firstName} {participant?.lastName}{" "}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Info;
