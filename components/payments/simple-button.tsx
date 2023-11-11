"use client";
import React from "react";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SimpleButton = () => {
  const { modifyProfileSubscription } = useSupabaseChat();
  const { user } = useUser();
  const router = useRouter();
  const handleClick = () => {
    fetch("/api/update-subscription", {
      method: "POST",
      body: JSON.stringify({ payer: "Billy" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "here is the response data from simple button (front end)",
          data
        );
        console.log(
          "here is the user from simple button (front end)",
          user?.id
        );
        modifyProfileSubscription(user?.id as string, "paid");
        router.push("/app");
      })
      .catch((error) => console.error(error));
  };

  return (
    <button
      className="border rounded px-4 py-2 bg-black text-white w-full text-sm"
      onClick={handleClick}
    >
      Buy Now (Test)
    </button>
  );
};

export default SimpleButton;
