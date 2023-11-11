"use client";

import { use, useEffect } from "react";
import ChatContainer from "@/components/chat/chat-container";
import { getAllUsers, getCurrentUser, getUserById } from "@/lib/clerkUtils";
import { Divide } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import SimpleButton from "@/components/payments/simple-button";
import PayPalButton from "@/components/payments/paypal-button";

export default function Home() {
  const defaultButtonVariant = buttonVariants({ variant: "default" });

  // useEffect(() => {
  //   // Check local storage for the subscription setting
  //   const subscriptionStatus = localStorage.getItem("subscription");

  //   if (!subscriptionStatus || subscriptionStatus !== "free") {
  //     // Set the local storage value to 'free'
  //     localStorage.setItem("subscription", "free");

  //     // Reload the page
  //     window.location.reload();
  //   }
  // }, []);

  return (
    <section className="">
      <div className="container px-4 md:px-6">
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
            <div className="mt-6">
              <Link
                href="/app"
                className={`${defaultButtonVariant} dark:bg-black text-white w-full`}
              >
                Current Plan
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
