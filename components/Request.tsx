"use client";
import { CheckCircle, UserPlus, XCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { User } from "..";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleFreindRequest } from "@/lib/db-actions";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import { useStore } from "@/store";
import { Button } from "./ui/button";

const Request = ({ freindsRequests }: { freindsRequests: User[] }) => {
  const [requestState, setRequestState] = useState<User[]>(freindsRequests);
  const { requests, setRequests } = useStore();
  return (
    <>
      <Drawer>
        <DrawerTrigger><UserPlus className="h-[35px] w-[35px]"/></DrawerTrigger>
        <DrawerContent className="max-md:h-[80dvh] md:h-[60dvh] text-center ">
          <DrawerTitle className=" mt-4"> Friends Requests</DrawerTitle>
          <Toaster />
          <ScrollArea className="my-10 rounded-md 
        max-md:p-2 max-lg:!w-[100dvw] lg:!min-w-[800px] max-w-[1500px] mx-auto ">
            {requestState.map((e) => (
              <div
                key={e.id}
                className="flex items-center p-2 hover:bg-neutral-700 rounded-lg 
                   transition-all w-full   gap-4  my-6"
              >
                <Popover key={e.id}>
                  <PopoverTrigger className="w-full flexcenter gap-4 overflow-auto">
                    {e?.imageUrl && (
                      <Image
                        height={60}
                        width={60}
                        className="h-16 w-16 max-sm:w-12 max-sm:h-12 rounded-full bg-cover "
                        alt="image of user"
                        src={e?.imageUrl}
                      />
                    )}

                    <div className=" flex justify-between w-full items-center">
                      <div className="whitespace-nowrap ">
                        <p
                          className="overflow-auto text-start max-sm:text-base text-xl dark:text-white 
                  font-semibold "
                        >
                          {e.username}
                        </p>
                        <p
                          className=" text-start  max-sm:text-base text-xl dark:text-gray-500
                  font-semibold "
                        >
                          {e.name}
                        </p>
                      </div>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    className="ml-6 p-0"
                    side="top"
                    sideOffset={-30}
                  >
                    <div className="flex">
                      <Card className="w-[350px]">
                        <CardHeader>
                          <CardTitle>Bio</CardTitle>
                          <CardDescription>{e?.bio}</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flexcenter gap-4">
                  <button
                    onClick={async () => {
                      await handleFreindRequest("accept", e.id);
                      setRequestState((s) => s.filter((el) => el.id !== e.id));
                      setRequests(requests - 1);
                    }}
                    className="transition-all shadow-lg  hover:shadow-green-500 hover:bg-green-500 bg-green-800 rounded-lg"
                  >
                    <CheckCircle className="w-12 h-8 max-sm:w-8 p-1" />{" "}
                  </button>
                  <button
                    onClick={async () => {
                      await handleFreindRequest("decline", e.id);

                      setRequestState((s) => s.filter((el) => el.id !== e.id));
                      setRequests(requests - 1);
                    }}
                    className="transition-all  shadow-lg  hover:shadow-red-500 hover:bg-red-500 bg-red-900  rounded-lg"
                  >
                    <XCircle className="w-12 max-sm:w-8 h-8 p-1" />
                  </button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Request;
