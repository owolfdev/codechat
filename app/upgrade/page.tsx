"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import PayPalButton from "@/components/payments/paypal-button";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";

const subscriptionStatusMessages = {
  free: "You can upgrade to enable more options.",
  pro: " You can create new chat rooms and have unlimited chat messages.",
};

export default function Home() {
  const defaultButtonVariant = buttonVariants({ variant: "default" });

  const { user } = useUser();

  const { findProfileByUserId } = useSupabaseChat();

  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [subscriptionStatusMessage, setSubscriptionStatusMessage] =
    useState("");

  useEffect(() => {
    findProfileByUserId(user?.id as string).then((profile) => {
      if (profile) {
        if (profile.subscription_status === "paid") {
          setSubscriptionStatus("Pro");
          setSubscriptionStatusMessage(subscriptionStatusMessages.pro);
        } else {
          setSubscriptionStatus("free");
          setSubscriptionStatusMessage(subscriptionStatusMessages.free);
        }
      } else {
        setSubscriptionStatus("free");
        setSubscriptionStatusMessage(subscriptionStatusMessages.free);
      }
    });
  }, []);

  return (
    <section className="">
      <div className="container px-4 md:px-6">
        {/*  */}
        <div className="flex flex-col justify-center space-y-8 text-center">
          <div className="space-y-8">
            <h1 className="sm:min-h-[70px] text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r dark:from-white dark:to-gray-500 from-black to-gray-600 ">
              You are on the {subscriptionStatus} plan.
            </h1>
            <p className="max-w-[600px] text-zinc-600 md:text-xl dark:text-zinc-100 mx-auto">
              {subscriptionStatusMessage}
            </p>
          </div>
        </div>
        {/*  */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between dark:text-gray-800">
            <div>
              <h3 className="text-2xl font-bold text-center">Free</h3>
              <div className="mt-4 text-center text-zinc-600">
                <span className="text-4xl font-bold">$0</span>
                {"\n                          "}
              </div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <span className="bg-green-500 rounded-full mr-2 p-1">
                    <svg
                      className=" text-white text-xs"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="">One Chat Room</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 rounded-full mr-2 p-1">
                    <svg
                      className=" text-white text-xs"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  Up to 25 chat messages.
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 rounded-full mr-2 p-1">
                    <svg
                      className=" text-white text-xs"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  Invite your friends.
                </li>
              </ul>
            </div>
            <div className="flex justify-center w-72 font-bold text-xl">
              Chat for free, forever.
            </div>
            <div className="">
              <Link
                href="/app"
                className={`${defaultButtonVariant} dark:bg-black text-white w-full`}
              >
                Start Chatting for Free
              </Link>
            </div>
          </div>
          <div className="relative flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between border-4 border-purple-500 dark:text-gray-800">
            <div className="px-3 py-1 text-sm text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full inline-block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
              Power Users
            </div>
            <div>
              <h3 className="text-2xl font-bold text-center">Pro</h3>
              <div className="mt-4 text-center text-zinc-600 ">
                <span className="text-4xl font-bold">$10</span>
                {"\n                          "}
              </div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <span className="bg-green-500 rounded-full mr-2 p-1">
                    <svg
                      className=" text-white text-xs"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  Unlimited Chat Rooms
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 rounded-full mr-2 p-1">
                    <svg
                      className=" text-white text-xs"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  Unlimited Chat Messages
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 rounded-full mr-2 p-1">
                    <svg
                      className=" text-white text-xs"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  Invite your Friends.
                </li>
                <li className="flex items-center">
                  <span className="bg-green-500 rounded-full mr-2 p-1">
                    <svg
                      className=" text-white text-xs"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  One time Payment.
                </li>
              </ul>
            </div>
            <div className="mt-6">
              {/* <SimpleButton /> */}
              <PayPalButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
