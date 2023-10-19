import { clerkClient } from "@clerk/nextjs";

export const getAllUsers = async () => {
  // console.log("clerkClient:", clerkClient);
  const users = await clerkClient.users?.getUserList();
  users.map((user) => {
    // console.log("user:", user.emailAddresses[0].emailAddress);
  });
  return users;
};
