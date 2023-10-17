import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between sm:px-24 py-24 px-8">
      <SignUp />
    </main>
  );
}
