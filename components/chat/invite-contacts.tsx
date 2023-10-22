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
  invite: z.string().optional(),
});

function Invite({ selectedChatRoom }: any) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      invite: "",
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
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <div id="modal">
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleResetDialog}>Invite</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Contacts</DialogTitle>
              <DialogDescription>Edit the active chat room.</DialogDescription>
            </DialogHeader>
            <div>{JSON.stringify(selectedChatRoom?.chat_room_id)}</div>
            {/* add form here */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                onChange={handleUpdateZodState}
              >
                {/* <FormField
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
                /> */}
                <FormField
                  control={form.control}
                  name="invite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Invite one or more contacts to your chat"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogClose asChild>
                  {isValid ? (
                    <Button type="submit">Invite</Button>
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
