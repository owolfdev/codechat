"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { IoSettingsOutline } from "react-icons/io5";

function UpgradeButton() {
  const { user } = useUser();
  const { findProfileByUserId } = useSupabaseChat();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    findProfileByUserId(user?.id as string).then((data) => {
      setProfile(data);
    });
  }, [user]);

  const defaultButtonVariant = buttonVariants({ variant: "default" });
  {
    return user && profile?.subscription === "free" ? (
      <Link
        href="/upgrade"
        className={`${defaultButtonVariant}, bg-yellow-400 text-black hover:bg-yellow-200 h-8 w-20 `}
      >
        <span>Upgrade</span>
      </Link>
    ) : (
      <Link href="/subscription">
        <span className="">
          <IoSettingsOutline size={20} />
        </span>
      </Link>
    );
  }
}

export default UpgradeButton;
