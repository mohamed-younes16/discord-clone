"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import ServerForm from "./Forms/ServerForm";

const ManageServers = ({
  icon,
  text,
  data,
  submitText,
  actionType,
  serverId,
  userId,
}: {
  userId: string;
  icon?: ReactNode;
  text?: string;
  data?: any;
  submitText?: string;
  actionType: "create" | "update";
  serverId?: string;
}) => {
  const { theme } = useTheme();
  const toasterTheme =
    theme == "light"
      ? "light"
      : theme == "dark"
      ? "dark"
      : theme == "system"
      ? "system"
      : undefined;
  return (
    <>
      {" "}
      <Dialog >
        <DialogTrigger className="flexcenter w-full">
          {icon || (
            <div className="bg-stone-800 flex justify-center   rounded-full transition-all  hover:bg-stone-500">
              <PlusIcon className=" h-12 w-12  transition-all text-emerald-500 hover:text-emerald-300" />
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <Toaster theme={toasterTheme} richColors />
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold">
              {text || "Create Server"}
            </DialogTitle>
          </DialogHeader>

          <ServerForm
            userId={userId}
            serverId={serverId}
            actionType={actionType}
            data={data}
            submitText={submitText}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageServers;
