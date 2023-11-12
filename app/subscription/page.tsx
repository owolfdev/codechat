"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const subscriptionStatusMessages = {
  free: "You can upgrade to enable more options.",
  pro: " You can create new chat rooms and have unlimited chat messages.",
};

export default function Subscription() {
  const defaultButtonVariant = buttonVariants({ variant: "default" });

  const { user } = useUser();

  const { findProfileByUserId, modifyProfileSubscription } = useSupabaseChat();

  const [subscriptionStatus, setSubscriptionStatus] = useState("Pro");
  const [subscriptionStatusMessage, setSubscriptionStatusMessage] = useState(
    subscriptionStatusMessages.pro
  );

  useEffect(() => {
    findProfileByUserId(user?.id as string).then((profile) => {
      console.log("profile from subscription page!!!!:", profile, user?.id);
      if (profile) {
        if (profile.subscription === "paid") {
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
  }, [user?.id]);

  const handleShowCancelDialog = () => {
    console.log("show cancel dialog");
  };

  const handleCancelSubscription = () => {
    console.log("cancel subscription");
    modifyProfileSubscription(user?.id as string, "free").then((res) => {
      console.log("res from cancel subscription:", res);
      if (res) {
        setSubscriptionStatus("free");
        setSubscriptionStatusMessage(subscriptionStatusMessages.free);
      }
    });
  };

  const CancelSubscriptionDialog = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={handleShowCancelDialog} variant="destructive">
            Cancel Subscription
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription to CodeChat?
              Note that it is a one time payment and not recurring.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4"></div>
          <DialogFooter>
            <div className="flex gap-4">
              <DialogClose>
                <Button>No, Exit</Button>
              </DialogClose>
              <DialogClose>
                <Button
                  onClick={handleCancelSubscription}
                  variant="destructive"
                >
                  Yes, Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <section className="w-full  py-8 md:py-12 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-8">
              <h1 className="sm:min-h-[70px] text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r dark:from-white dark:to-gray-500 from-black to-gray-600 ">
                You are on the {subscriptionStatus} plan.
              </h1>
              <p className="max-w-[600px] text-zinc-600 md:text-xl dark:text-zinc-100 mx-auto">
                {subscriptionStatusMessage}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2 mx-auto">
              {/*  */}
              {subscriptionStatus === "free" ? (
                <div className="flex gap-4">
                  <Link
                    href="/upgrade"
                    className={`p-4 ${defaultButtonVariant} bg-yellow-400 hover:bg-yellow-200`}
                  >
                    Upgrade
                  </Link>
                  <Link href="/app" className={`p-4 ${defaultButtonVariant}`}>
                    Start Chatting for Free
                  </Link>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div>
                    <Link href="/app" className={`p-4 ${defaultButtonVariant}`}>
                      Start Chatting
                    </Link>
                  </div>
                  <div>
                    <CancelSubscriptionDialog />
                  </div>
                </div>
              )}
              {/*  */}
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
