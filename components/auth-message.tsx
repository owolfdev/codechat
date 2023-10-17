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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        Hello, {user?.firstName} {user?.lastName} welcome to Code Chat!
      </div>
      {/* <div className="  break-words">{JSON.stringify(user)}</div> */}
      {/* <div className="max-w-[600px] break-words">{`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`}</div> */}
    </div>
  );
}
