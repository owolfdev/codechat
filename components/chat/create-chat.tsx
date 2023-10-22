"use client";

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";

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
  description: z.string().optional(),
});

function CreateChat() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { createChatRoom } = useSupabaseChat();

  const { control } = form;

  const { isDirty, isValid } = useFormState({ control });

  const handleUpdateZodState = () => {
    // console.log("handleUpdateZodState");
    form.trigger();
  };

  const handleResetDialog = () => {
    form.reset();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    createChatRoom(values.name, values.description as string);
  }

  return (
    <>
      <div id="modal">
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleResetDialog}>New Chat</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
              <DialogDescription>Create a new chat room.</DialogDescription>
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
                          placeholder="Enter the title of your chat room"
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
                          placeholder="Add a description of your chat room"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogClose asChild>
                  {isValid ? (
                    <Button type="submit">Create Chat</Button>
                  ) : (
                    <Button disabled={true} type="submit">
                      Create Chat
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

export default CreateChat;
