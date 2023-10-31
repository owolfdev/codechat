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

  const handleInviteUser = () => {
    addParticipantToChatRoom(
      invitee,
      selectedChatRoom.chat_room_id,
      "pending",
      userId as string
    ).then((res) => {
      if (res) {
        toast({
          title: "User invited.",
          description: `"${invitee}" was invited successfully to "${selectedChatRoom.name}".`,
        });
      }
    });
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
                          className="sm:text-sm text-lg"
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
                    <Button variant="destructive">Cancel</Button>
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
