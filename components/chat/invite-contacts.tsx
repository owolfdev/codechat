"use client";

import React, { useState, useEffect, useRef } from "react";

import Select from "react-select";

import { useAuth } from "@clerk/nextjs";

import { AiOutlineSend } from "react-icons/ai";

// import { getAllUsers } from "@/lib/clerkUtils";

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

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm, useFormState } from "react-hook-form";

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

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

function Invite({
  selectedChatRoom,
  users,
}: {
  selectedChatRoom: any;
  users: any;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { addParticipantToChatRoom } = useSupabaseChat();

  const { userId, sessionId, getToken } = useAuth();

  const selectRef = useRef(null);

  const { control, handleSubmit, setValue, getValues } = form;

  const { isDirty, isValid } = useFormState({ control });

  // const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [invitee, setInvitee] = useState<any | null>(null);

  useEffect(() => {
    console.log("selectedUser:", selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    console.log("selectedChatRoom:", selectedChatRoom);
    console.log("logged in user", userId);
  }, [selectedChatRoom]);

  useEffect(() => {
    console.log("users:", users);
  }, [users]);

  const handleUpdateZodState = () => {
    console.log("handleUpdateZodState");
    form.trigger();
  };

  const handleResetDialog = () => {
    form.reset();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit");
    // console.log(values);
    // console.log(selectedUser);
    console.log("invitee", invitee);
  }

  const handleInviteUser = () => {
    console.log("handleInviteUser");
    // console.log("invitee", invitee);
    // console.log("selectedChatRoom", selectedChatRoom.chat_room_id);
    addParticipantToChatRoom(
      invitee,
      selectedChatRoom.chat_room_id,
      "pending",
      userId as string
    );
    form.reset(); // Reset the entire form
    setInvitee(null);
    setSelectedUser(null);
  };

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={handleResetDialog}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AiOutlineSend size={20} />
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <p>Send invitations</p>
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
          <ToolTipComponent />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Contacts</DialogTitle>
              <DialogDescription>
                Invite contact to{" "}
                <span className="font-bold">{selectedChatRoom?.name}</span>.
              </DialogDescription>
            </DialogHeader>
            {/* <div>{JSON.stringify(selectedChatRoom?.chat_room_id)}</div> */}
            {/* add form here */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                onChange={handleUpdateZodState}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invitee email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Email"
                          // onChange={(e) => {
                          //   setInvitee(e.target.value);
                          // }}
                          {...field}
                          onChange={(e) => {
                            // Access the field value as it changes
                            field.onChange(e);
                            setInvitee(e.target.value);
                          }}
                        />
                        {/* <Input
                          value={invitee}
                          onChange={(e) => {
                            setInvitee(e.target.value);
                          }}
                          placeholder="Enter the email address of the invitee."
                          // {...field}
                        /> */}
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogClose asChild>
                  {isValid ? (
                    <Button onClick={handleInviteUser} type="submit">
                      Invite
                    </Button>
                  ) : (
                    <Button disabled={true} type="submit">
                      Invite
                    </Button>
                  )}
                </DialogClose>
              </form>
            </Form>
            {/* end form */}
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Invite;
