"use client";

import { use, useEffect } from "react";
import ChatContainer from "@/components/chat/chat-container";
import { getAllUsers, getCurrentUser, getUserById } from "@/lib/clerkUtils";
import { Divide } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Subscription() {
  const defaultButtonVariant = buttonVariants({ variant: "default" });

  useEffect(() => {
    // Check local storage for the subscription setting
    const subscriptionStatus = localStorage.getItem("subscription");

    if (!subscriptionStatus || subscriptionStatus !== "paid") {
      // Set the local storage value to 'paid'
      localStorage.setItem("subscription", "paid");

      // Reload the page
      window.location.reload();
    }
  }, []);

  return (
    <section className="w-full  py-8 md:py-12 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-8">
              <h1 className="sm:min-h-[70px] text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r dark:from-white dark:to-gray-500 from-black to-gray-600 ">
                You are on the pro plan.
              </h1>
              <p className="max-w-[600px] text-zinc-600 md:text-xl dark:text-zinc-100 mx-auto">
                You can create new chat rooms and have unlimited chat messages.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2 mx-auto">
              <div>
                <Link href="/app" className={`p-4 ${defaultButtonVariant}`}>
                  Start Chatting
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /* <div className="">
      <div>Welcome</div>
      <div>
        <Link href="/app">Start Chatting</Link>
      </div>
    </div> */
}
