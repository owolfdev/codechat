import { clerkClient } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";

export const getAllUsers = async () => {
  // console.log("clerkClient:", clerkClient);
  const users = await clerkClient.users?.getUserList();
  users?.map((user) => {
    // console.log("user:", user.emailAddresses[0].emailAddress);
  });
  return users;
};

export const getUserById = async (userId) => {
  console.log("userId from getUserById:", userId);
  try {
    const user = await clerkClient.users?.getUser(userId);
    console.log("user from getUserById!!!!!:", user);
    if (user) {
      // Assuming that the user has a "firstName" and "lastName" field
      return user;
    }
    return "Unknown User";
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return "Unknown User";
  }
};

export const getCurrentUser = async () => {
  try {
    const { userId } = auth();
    const user = await currentUser();
    // console.log("userId from getCurrentUser:", userId);
    // console.log("currentUser from getCurrentUser:", currentUser);

    if (user) {
      // console.log("user from getCurrentUser:", user);

      return user;
    }
    return null; // No user is authenticated
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// getUserById("user_2X0Dwuc6TBuTuBMIr76QTSOq3yU");
