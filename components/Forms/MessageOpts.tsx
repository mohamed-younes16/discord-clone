"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
const env = process.env.NODE_ENV;
const apiUrl =
  env == "development"
    ? "http://localhost:5000"
    : "https://dicord-api.onrender.com";

const MessageOpts = ({
  messageId,
  channelId,
  serverId,
  setEdit,
  chatLimit,
  userId,
}: {
  messageId: string;
  channelId: string;
  serverId: string;
  setEdit: Dispatch<SetStateAction<boolean>>;
  chatLimit: number;
  userId;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="w-10 h-10 rounded-full hover:bg-gray-300
                cursor-pointer transition-all flexcenter !bg-opacity-20"
        >
          <GripVertical size={20} strokeWidth={3} />
        </div>
      </PopoverTrigger>
      <PopoverContent className=" !w-fit" side="left">
        <Dialog>
          <DialogTrigger className=" w-full">
            <div className=" bg-red-600 rounded-lg p-2 flexcenter">Delete</div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                <DialogClose>
                  <div className="flex mt-6 justify-start">
                    <Button
                      variant={"destructive"}
                      onClick={async () => {
                        toast.loading("deleteing...", { duration: 90000 });

                        await axios.post(`${apiUrl}/servers/messages`, {
                          messageId,
                          channelId,
                          chatLimit,
                          operationType: "deleteMessage",
                          userId,
                          serverId
                        });
                        toast.dismiss()
                      }}
                    >
                      Delete Message
                    </Button>
                  </div>
                </DialogClose>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div
          className=" flex flex-nowrap items-center 
                     p-2 hover:bg-white rounded-md transition-all !bg-opacity-20 mt-4"
        >
          <button onClick={() => setEdit(true)} className=" flex gap-6 ">
            Edit <Edit />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MessageOpts;
