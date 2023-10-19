"use client";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function AuthMessage() {
  const { userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  // Check if the user has provided a first and last name
  if (user?.firstName && user?.lastName) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div>
          Hello, {user.firstName} {user.lastName} welcome to Code Chat!
        </div>
        <div className="break-words">{JSON.stringify(user)}</div>
      </div>
    );
  } else {
    // If no first and last name is available, greet the user by email
    return (
      <div className="flex flex-col gap-4 w-full">
        <div>
          Hello, {user?.emailAddresses[0].emailAddress} welcome to Code Chat!
        </div>
        <div className="break-words">{JSON.stringify(user)}</div>
      </div>
    );
  }
}
