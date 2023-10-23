"use client";

import React, { useState, useEffect, useRef } from "react";

import Select from "react-select";

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
import { Label } from "@/components/ui/label";

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Chat name must be at least 2 characters.",
  }),
  invite: z.string().optional(),
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
      name: "",
      invite: "",
    },
  });

  const selectRef = useRef(null);

  const { control, handleSubmit, setValue, getValues } = form;

  const { isDirty, isValid } = useFormState({ control });

  // const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // useEffect(() => {
  //   const getUsers = async () => {
  //     const users = await getAllUsers();
  //     console.log("users from getUsers, initial load:", users);
  //     setUsers(users);
  //   };
  //   getUsers();
  // }, []);

  useEffect(() => {
    console.log("selectedUser:", selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    console.log("users:", users);
  }, [users]);

  const handleUpdateZodState = () => {
    console.log("handleUpdateZodState");
    form.trigger();
  };

  const handleResetDialog = () => {
    console.log("handleResetDialog");
    if (selectRef.current) {
      setValue("invite", "");
      setSelectedUser(null);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit");
    // console.log(values);
    // console.log(selectedUser);
  }

  const handleInviteUser = () => {
    console.log("handleInviteUser");
    console.log(getValues("invite"));
    console.log("selectedUser", selectedUser);
    setSelectedUser(null);
  };

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
                <FormField
                  control={form.control}
                  name="invite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite</FormLabel>
                      <FormControl>
                        <Select
                          ref={selectRef}
                          className="text-black"
                          // Add custom styles here, similar to the example
                          styles={{}}
                          // Options for user selection (users array)
                          options={users?.map((user: any) => ({
                            value: user.emailAddresses[0].emailAddress, // Set value to email address
                            label: user.emailAddresses[0].emailAddress,
                          }))}
                          // Handle user selection
                          onChange={(selectedOption) => {
                            const selectedUser = users.find(
                              (user: any) =>
                                user.emailAddresses[0].emailAddress ===
                                selectedOption?.value
                            );

                            setSelectedUser(selectedUser);
                            // Set the value to the email address
                            setValue("invite", selectedOption?.value || "");
                          }}
                          // Value for the selected user (email address)
                          value={
                            selectedUser
                              ? {
                                  value:
                                    selectedUser.emailAddresses[0].emailAddress, // Set value to email address
                                  label:
                                    selectedUser.emailAddresses[0].emailAddress,
                                }
                              : null
                          }
                          // Allow multiple selections if needed
                          isMulti={false}
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
                    <Button onClick={handleInviteUser} type="submit">
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
