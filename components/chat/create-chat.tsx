"use client";

import React, { useState, useEffect, use } from "react";
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

import { IoAddOutline } from "react-icons/io5";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

import { useToast } from "@/components/ui/use-toast";

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

  const { toast } = useToast();

  const handleUpdateZodState = () => {
    // console.log("handleUpdateZodState");
    form.trigger();
  };

  const handleResetDialog = () => {
    form.reset();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    createChatRoom(values.name, values.description as string).then((res) => {
      // console.log(res);
      if (res) {
        toast({
          title: "Chat created.",
          description: `"${res.name}" was created successfully.`,
        });
      } else {
        toast({
          title: "Chat not created.",
          description: "There was a problem creating your chat.",
        });
      }
    });
  }

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={handleResetDialog}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <IoAddOutline size={25} />
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <p>Create new chat</p>
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
          {/* <DialogTrigger asChild> */}
          <ToolTipComponent />
          {/* </DialogTrigger> */}
          <DialogContent className=" top-[200px] max-w-[360px] sm:max-w-[425px] sm:top-1/2">
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
