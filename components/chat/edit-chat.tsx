"use client";

import React, { useState, useEffect } from "react";
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Chat name must be at least 2 characters.",
  }),
  description: z.string(),
});

function EditChat({ selectedChatRoom }: any) {
  const { editChatRoomName } = useSupabaseChat();

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
    console.log("handleUpdateZodState");
    form.trigger();
  };

  const handleResetDialog = () => {
    form.reset();
    if (selectedChatRoom) {
      console.log("selectedChatRoom from edit chat:", selectedChatRoom);
      form.setValue("name", selectedChatRoom?.name);
      form.setValue("description", selectedChatRoom?.description);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    editChatRoomName(
      selectedChatRoom?.chat_room_id,
      values.name,
      values.description
    );
  }

  useEffect(() => {
    if (selectedChatRoom) {
      console.log("selectedChatRoom from edit chat:", selectedChatRoom);
      form.setValue("name", selectedChatRoom?.name);
      form.setValue("description", selectedChatRoom?.description);
    }
  }, [selectedChatRoom]);

  return (
    <>
      <div id="modal">
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleResetDialog}>Edit Chat</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                <DialogClose asChild>
                  {isValid ? (
                    <Button type="submit">Edit Chat</Button>
                  ) : (
                    <Button disabled={true} type="submit">
                      Edit Chat
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

export default EditChat;
