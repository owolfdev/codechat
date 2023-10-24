import { clerkClient } from "@clerk/nextjs";

const getUserById = async (userId) => {
  console.log("userId from getUserById:", userId);
  try {
    const user = await clerkClient.users?.getUser(
      "user_2X0Dwuc6TBuTuBMIr76QTSOq3yU"
    );
    console.log("user from getUserById!!!!!:", user);
    if (user) {
      // Assuming that the user has a "firstName" and "lastName" field
      return `${user.firstName} ${user.lastName}`;
    }
    return "Unknown User";
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return "Unknown User";
  }
};

getUserById("user_2X0Dwuc6TBuTuBMIr76QTSOq3yU");
