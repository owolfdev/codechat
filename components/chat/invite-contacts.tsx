"use client";

import React, { useState, useEffect, useRef } from "react";

import { useAuth } from "@clerk/nextjs";

import { AiOutlineSend } from "react-icons/ai";

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

import { useToast } from "@/components/ui/use-toast";

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

const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

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

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [invitee, setInvitee] = useState<any | null>(null);

  const { toast } = useToast();

  const handleUpdateZodState = () => {
    form.trigger();
  };

  const handleResetDialog = () => {
    form.reset();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {}

  // In your React component
  const handleInviteUser = async () => {
    const inviteeEmail = getValues("email"); // Get the email address from the form

    const addParticipantStatus = await addParticipantToChatRoom(
      invitee,
      selectedChatRoom.chat_room_id,
      "pending",
      userId as string
    );

    if (addParticipantStatus === "accepted") {
      toast({
        title: "User already accepted the invitation.",
        description: `${inviteeEmail} has already been invited to "${selectedChatRoom.name}" and accepted the invitation.`,
      });
      return;
    }

    if (addParticipantStatus === "rejected") {
      toast({
        title: "User already rejected the invitation.",
        description: `${inviteeEmail} has already been invited to "${selectedChatRoom.name}" and rejected the invitation.`,
      });
      return;
    }

    try {
      const response = await fetch("/api/send-email-to-invitee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: inviteeEmail,
          subject: "You are invited to a chat room in CodeChat app",
          html: `
          <h1>You are invited to a chat room in CodeChat app</h1>
          <p>Hi there coder!</p> <p>You have been invited to join a chat room called: &quot;${selectedChatRoom.name}&quot;.</p> <p>To accept the invitation, you should log in, or sign up for CodeChat app.</p> <p>Look for the envelope icon to access the invitation</p> <p>Click the link below to open the app:</p>
          <a href="https://codechat-eta.vercel.app/">Click here to open CodeChat</a>
          <p>See you there!</p>
          <strong>CodeChat team</strong>
        `,
        }),
      });

      if (response.ok) {
        // Email sent successfully
        toast({
          title: "User invited and email sent.",
          description: `"${inviteeEmail}" was invited successfully to "${selectedChatRoom.name}". An email has been sent.`,
        });

        // Reset the form and clear state
        form.reset();
        setInvitee(null);
        setSelectedUser(null);
      } else {
        // Handle error response from the server
        console.error("Error sending email:", response.statusText);
        // You can also show an error message to the user if needed
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error sending email:", error);
      // You can also show an error message to the user if needed
    }
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
                <div>Send invitations</div>
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
          <DialogContent className=" top-[200px] max-w-[360px] sm:max-w-[425px] sm:top-1/2">
            <DialogHeader>
              <DialogTitle>Invite Contacts</DialogTitle>
              {/* <DialogDescription>
                Invite members to the selected chat.
              </DialogDescription> */}
            </DialogHeader>
            {/* <div>{JSON.stringify(selectedChatRoom?.chat_room_id)}</div> */}
            {/* add form here */}
            <div>
              Invite member to:{" "}
              <span className="font-bold">{selectedChatRoom?.name}</span>.
            </div>
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
                          className="text-md sm:text-sm"
                          type="email"
                          id="email"
                          placeholder="Email"
                          {...field}
                          onChange={(e) => {
                            // Access the field value as it changes
                            field.onChange(e);
                            setInvitee(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
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
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                </div>
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
