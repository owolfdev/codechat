import ChatContainer from "@/components/chat/chat-container";
import { getAllUsers, getCurrentUser, getUserById } from "@/lib/clerkUtils";

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
    <div className="">
      <ChatContainer users={users} currentUser={currentUser} />
    </div>
  );
}
