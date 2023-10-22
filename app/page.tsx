import ChatContainer from "@/components/chat/chat-container";
import { getAllUsers } from "@/lib/clerkUtils";
export default async function Home() {
  const users = await getAllUsers();

  // await createDefaultChat();
  return (
    <div>
      <ChatContainer users={users} />
    </div>
  );
}
