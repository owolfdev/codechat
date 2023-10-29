import ChatContainer from "@/components/chat/chat-container";

import { getAllUsers, getCurrentUser } from "@/lib/clerkUtils";

export default async function Home() {
  const usersData = await getAllUsers();
  const currentUserData = await getCurrentUser();

  const users = usersData.map((user) => {
    return {
      id: user.id as string,
      firstName: user.firstName as string,
      lastName: user.lastName as string,
      email: user.emailAddresses[0].emailAddress as string,
    };
  });

  const currentUser = {
    id: currentUserData?.id as string,
    firstName: currentUserData?.firstName as string,
    lastName: currentUserData?.lastName as string,
    email: currentUserData?.emailAddresses[0].emailAddress as string,
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <ChatContainer users={users} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
