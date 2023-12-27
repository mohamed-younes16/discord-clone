"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
const env = process.env.NODE_ENV;
const apiUrl =
  env == "development"
    ? "http://localhost:5000"
    : "https://discord-api.up.railway.app";

const DeleteChannelButton = ({
  serverId,
  channelId,
  userId,
  isAdmin,
}: {
  serverId: string;
  channelId: string;
  userId: string;
  isAdmin: boolean;
}) => {
  const router = useRouter();

  const deleteChannel = async () => {
    try {
      toast.loading("deleting.....");

      const idDeleted = await axios.delete(`${apiUrl}/servers/delete`, {
        data: {
          userId,
          isAdmin,
          operationType: "deleteChannel",
          channelId,
        },
      });

      if (idDeleted?.data) {
        toast.success(idDeleted?.data.message, { duration: 3000 });
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setTimeout(() => {
          toast.dismiss();
          setTimeout(() => {
            toast.error(idDeleted?.data.message, { duration: 3000 });
          }, 300);
        }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {" "}
        <p
          className=" p-1  text-red-600 flex 
justify-between items-center 
hover:bg-white  rounded-md transition-all !bg-opacity-20"
        >
          Delete <Trash2 />
        </p>
      </DialogTrigger>
      <DialogContent>
        <Toaster richColors position="top-center" />
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            <Button
              onClick={() => deleteChannel()}
              className=" mt-4 flex gap-4 "
              variant={"destructive"}
            >
              <p className=" text-base">Delete Channel</p>
              <Trash2 size={20} />
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelButton;
