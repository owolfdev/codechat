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
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineEdit } from "react-icons/ai";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

import { useToast } from "@/components/ui/use-toast";

import { useUser } from "@clerk/nextjs";

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
  name: z.string().min(2, {
    message: "Chat name must be at least 2 characters.",
  }),
  description: z.string(),
});

function EditChat({ selectedChatRoom }: any) {
  const { editChatRoomName } = useSupabaseChat();
  const dialogRef = useRef<HTMLElement | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedChatRoom?.name || "hi mom",
      description: selectedChatRoom?.description || "hi dad",
    },
  });

  const { control } = form;

  const { isDirty, isValid } = useFormState({ control });

  const handleUpdateZodState = () => {
    // console.log("handleUpdateZodState");
    form.trigger();
  };

  const handleResetDialog = () => {
    form.reset();
    if (selectedChatRoom) {
      // console.log("selectedChatRoom from edit chat:", selectedChatRoom);
      form.setValue("name", selectedChatRoom?.name);
      form.setValue("description", selectedChatRoom?.description);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values for submit edit changes", values);
    console.log("selectedChatRoom", selectedChatRoom);
    editChatRoomName(
      selectedChatRoom?.chat_room_id,
      values.name,
      values.description
    );
    toast({
      title: "Chat edited.",
      description: `"${values.name}" was edited successfully.`,
    });
  }

  useEffect(() => {
    if (selectedChatRoom && user?.id === selectedChatRoom.admin_id) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [selectedChatRoom, user]);

  useEffect(() => {
    if (selectedChatRoom) {
      // console.log("selectedChatRoom from edit chat:", selectedChatRoom);
      form.setValue("name", selectedChatRoom?.name);
      form.setValue("description", selectedChatRoom?.description);
    }
  }, [selectedChatRoom]);

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
                <AiOutlineEdit size={22} />
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <div>Edit current chat</div>
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
              <DialogTitle>Edit Chat</DialogTitle>
              <DialogDescription>Edit the active chat room.</DialogDescription>
            </DialogHeader>

            {/* add form here */}
            <Form {...form}>
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
                          className="sm:text-sm text-lg"
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
                        <Textarea
                          className="sm:text-sm text-lg"
                          placeholder="Edit the description of your chat room"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <DialogClose disabled={!isAdmin} asChild>
                      <Button type="submit" disabled={!isAdmin}>
                        Edit Chat
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive">Cancel</Button>
                    </DialogClose>
                  </div>
                  <div>
                    {!isAdmin && (
                      <span className="text-sm text-red-500">
                        You must be Admin to edit this chat.
                      </span>
                    )}
                  </div>
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

export default EditChat;
