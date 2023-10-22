"use client";

import React, { useState, useEffect } from "react";

import Select from "react-select";

import { getAllUsers } from "@/lib/clerkUtils";

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

  const { control, handleSubmit, setValue, getValues } = form;

  const { isDirty, isValid } = useFormState({ control });

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllUsers();
      console.log("users from getUsers, initial load:", users);
      setUsers(users);
    };
    getUsers();
  }, []);

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
                <FormField
                  control={form.control}
                  name="invite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite</FormLabel>
                      <FormControl>
                        <Select
                          // Add custom styles here, similar to the example
                          styles={
                            {
                              // Custom styles go here
                              // ...
                            }
                          }
                          // Options for user selection (users array)
                          options={users?.map((user) => ({
                            value: user.id,
                            label: user.username,
                          }))}
                          // Handle user selection
                          onChange={(selectedOption) => {
                            const selectedUser = users.find(
                              (user) => user.id === selectedOption?.value
                            );
                            setSelectedUser(selectedUser);
                            setValue("invite", selectedUser?.username || "");
                          }}
                          // Value for the selected user
                          value={
                            selectedUser
                              ? {
                                  value: selectedUser.id,
                                  label: selectedUser.username,
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

// "use client";
// import React, { useState, useEffect } from "react";
// import { getAllUsers } from "@/lib/clerkUtils";
// import { Button } from "../ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, useFormState } from "react-hook-form";
// import * as z from "zod";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import Select from "react-select"; // Import react-select

// const formSchema = z.object({
//   name: z.string().min(2, {
//     message: "Chat name must be at least 2 characters.",
//   }),
//   invite: z.string().optional(),
// });

// function Invite({ selectedChatRoom }: any) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       invite: "",
//     },
//   });

//   const { control, handleSubmit, setValue, getValues } = form;

//   const { isDirty, isValid } = useFormState({ control });

//   const [users, setUsers] = useState<any[]>([]);
//   const [selectedUser, setSelectedUser] = useState<any | null>(null);

//   useEffect(() => {
//     const getUsers = async () => {
//       const users = await getAllUsers();
//       setUsers(users);
//     };
//     getUsers();
//   }, []);

//   const handleResetDialog = () => {
//     form.reset();
//     setSelectedUser(null);
//   };

//   const handleInvite = () => {
//     // Perform the action with the selected user (selectedUser)
//     const selectedUser = getValues("invite");
//     console.log("Invite user:", selectedUser);
//     // Reset the form and selected user after the action
//     handleResetDialog();
//   };

//   return (
//     <>
//       <div id="modal">
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button onClick={handleResetDialog}>Invite</Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Invite Contacts</DialogTitle>
//               <DialogDescription>Edit the active chat room.</DialogDescription>
//             </DialogHeader>
//             <div>{JSON.stringify(selectedChatRoom?.chat_room_id)}</div>
//             {/* Replace the Input with the Select component */}
//             <FormField
//               control={form.control}
//               name="invite"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Invite</FormLabel>
//                   <FormControl>
//                     <Select
//                       // Add custom styles here, similar to the example
//                       styles={
//                         {
//                           // Custom styles go here
//                           // ...
//                         }
//                       }
//                       // Options for user selection (users array)
//                       options={users?.map((user) => ({
//                         value: user.id,
//                         label: user.username,
//                       }))}
//                       // Handle user selection
//                       onChange={(selectedOption) => {
//                         const selectedUser = users.find(
//                           (user) => user.id === selectedOption?.value
//                         );
//                         setSelectedUser(selectedUser);
//                         setValue("invite", selectedUser?.username || "");
//                       }}
//                       // Value for the selected user
//                       value={
//                         selectedUser
//                           ? {
//                               value: selectedUser.id,
//                               label: selectedUser.username,
//                             }
//                           : null
//                       }
//                       // Allow multiple selections if needed
//                       isMulti={false}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogClose asChild>
//               {isValid ? (
//                 <Button type="submit" onClick={handleInvite}>
//                   Invite
//                 </Button>
//               ) : (
//                 <Button disabled={true} type="submit">
//                   Invite
//                 </Button>
//               )}
//             </DialogClose>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );
// }

// export default Invite;
