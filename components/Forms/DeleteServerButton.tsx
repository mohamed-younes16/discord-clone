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
import { LogOutIcon, Trash2Icon } from "lucide-react";
import { UserLeaves, deleteServer } from "@/lib/db-actions";
import { Toaster, toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
const DeleteLeaveServerButton = ({
  serverId,
  actionType,
}: {
  serverId: string;
  actionType: "leave" | "delete";
}) => {
  const router = useRouter();
  const deleteServ = async () => {
    if (actionType == "delete") {
      try {
        toast.loading(actionType == "delete" ? "deleting....." : "leaving....");

        const idDeleted = (await deleteServer(serverId)) || {
          valid: false,
          message: "check your connection",
        };

        if (idDeleted?.valid) {
          toast.success(idDeleted?.message, { duration: 3000 });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          setTimeout(() => {
            toast.dismiss();
            setTimeout(() => {
              toast.error(idDeleted?.message, { duration: 3000 });
            }, 300);
          }, 200);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (actionType == "leave") {
      try {
        toast.loading(actionType == "leave" && "leaving.....", {
          duration: 1000,
        });

        const LeaveServer = (await UserLeaves(serverId)) || {
          valid: false,
          message: "check your connection",
        };

        if (LeaveServer?.valid) {
          toast.success(LeaveServer?.message, { duration: 3000 });
          router.push("/");
          redirect("/");
        } else {
          setTimeout(() => {
            toast.dismiss();
            setTimeout(() => {
              toast.error(LeaveServer?.message, { duration: 3000 });
            }, 300);
          }, 200);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {" "}
        <p
          className=" p-1  text-red-600 flex justify-between items-center 
hover:bg-white  rounded-md transition-all !bg-opacity-20"
        >
          {actionType} Server
          {actionType == "delete" ? <Trash2Icon /> : <LogOutIcon />}
        </p>
      </DialogTrigger>
      <DialogContent>
        <Toaster richColors position="top-center" />
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            <Button
              onClick={() => deleteServ()}
              className=" mt-4 flex gap-4 "
              variant={"destructive"}
            >
              {actionType}{" "}
              {actionType == "delete" ? <Trash2Icon /> : <LogOutIcon />}
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLeaveServerButton;
