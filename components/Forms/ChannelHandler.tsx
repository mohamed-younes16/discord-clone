"use client";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { GripVertical, PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";

import ChannelForm from "./CreateChannel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteChannelButton from "./DeleteChannelButton";

const ChannelHandler = ({
  serverId,
  channel,
}: {
  serverId: string;
  channel: string;
}) => {
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="p-1 rounded-full hover:bg-gray-300
                    cursor-pointer transition-all flexcenter !bg-opacity-20"
        >
          <GripVertical size={20} strokeWidth={3} />
        </div>
      </PopoverTrigger>

      <PopoverContent className=" w-fit">
        <ChannelForm
          icon={
            <div className="w-full gap-12 flex justify-between ">
              {" "}
              Edit <PenSquare />
            </div>
          }
          actionType="update"
          channel={channel}
          serverId={serverId}
        />
        <DropdownMenuSeparator />
        <div className=" flex justify-between text-red-600  ">
          <DeleteChannelButton
            channelId={JSON.parse(channel)._id}
            serverId={serverId}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChannelHandler;
