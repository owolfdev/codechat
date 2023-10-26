import ChatContainer from "@/components/chat/chat-container";

import { getAllUsers } from "@/lib/clerkUtils";
export default async function Home() {
  const users = await getAllUsers();

  // await createDefaultChat();
  return (
    <div className="w-full flex justify-center">
      <ChatContainer users={users} />
    </div>
  );
}
