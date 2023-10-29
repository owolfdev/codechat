import { getUserById } from "@/lib/clerkUtils";

import { Button } from "../ui/button";

import { AiOutlineInfoCircle } from "react-icons/ai";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

function Info({
  users,
  selectedChatRoom,
}: {
  users: any;
  selectedChatRoom: any;
}) {
  const getFullNameById = async (userId: string) => {
    const response = await fetch("/api/get-user-by-id", {
      method: "POST",
      body: JSON.stringify({ id: userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("response", response);

    const data = await response.json();

    console.log("first name", data?.data?.firstName);

    const fullName = data?.data?.firstName + " " + data?.data?.lastName;

    return fullName;
  };

  const ToolTipComponent = () => {
    return (
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="">
                  <AiOutlineInfoCircle className="transform scale-150" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <div>Information</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DialogTrigger>
    );
  };

  return (
    <Dialog>
      <ToolTipComponent />
      <DialogContent className=" top-[200px] max-w-[360px] sm:max-w-[425px] sm:top-1/2">
        <DialogHeader>
          <DialogTitle>About This Chat</DialogTitle>
          <DialogDescription>
            <div>Information about the selected chat room.</div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <span className="font-bold">Title:</span> {selectedChatRoom?.name}
          </div>
          <div>
            <span className="font-bold">Description:</span>{" "}
            {selectedChatRoom?.description}
          </div>
          <div>
            <span className="font-bold">Administrator:</span>{" "}
            {getFullNameById(selectedChatRoom?.admin_id)}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Info;
