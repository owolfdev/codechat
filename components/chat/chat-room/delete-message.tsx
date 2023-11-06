"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useSupabaseChat } from "@/hooks/useSupabaseChat";

import { useToast } from "@/components/ui/use-toast";

type AlertProps = {
  action: (id: string) => void;
  message: any;
  alert_message: string;
  title: string;
  setHoveredMessageId: (id: string | null) => void;
};

export function DeleteMessage({
  action,
  message,
  alert_message,
  title,
  setHoveredMessageId,
}: AlertProps) {
  const { deleteChatMessage } = useSupabaseChat();
  const { toast } = useToast();

  const handleAction = () => {
    // action(item);
    deleteChatMessage(message.message_id).then(() => {
      toast({
        title: "Success!",
        description: `Message was deleted.`,
      });
    });
    setHoveredMessageId(null);
  };

  const handleCancel = () => {
    setHoveredMessageId(null);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className=" absolute top-0 right-0 text-white rounded-full w-6 h-6 focus:outline-none text-sm bg-red-700 flex items-center justify-center transform translate-x-[30%] -translate-y-[30%] pb-1">
          x
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{alert_message}</AlertDialogDescription>
        </AlertDialogHeader>
        {/* <div>{message.message_id}</div> */}
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAction}>
            Yes, delete it
          </AlertDialogAction>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
