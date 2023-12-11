import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

import TooltipComp from "./ui/TooltipComp";
import { ServerDataType } from "..";
import CurrentServer from "./CurrentServer";

const ServerLinks = ({ data }: { data: any }) => {
  return (
    <div>
      <TooltipComp hoverText={"main Page"}>
        <div>
          <Link
            className="w-16 hover:scale-90 transition-all h-16 
        relative  rounded-full flexcenter   "
            href={`/`}
            aria-label="redirect to server page  "
          >
            <CurrentServer id={"/"} />
            <Image
              src="/assets/discord-icon.svg"
              height={50}
              width={50}
              alt=""
              className="object-cover !min-w-[50px] ml-1 !min-h-[50px] rounded-2xl"
            />
          </Link>

          <Separator className="my-4" />
        </div>
      </TooltipComp>

      {data?.map((e: ServerDataType) => (
        <TooltipComp hoverText={e.name} key={e._id}>
          <div>
            <Link
              className="w-16 hover:scale-90 transition-all h-16 
                    relative  rounded-full flexcenter   "
              href={`/server/${e._id.toString()}/channel/general`}
              aria-label="redirect to server page  "
            >
              <CurrentServer id={e._id.toString()} />
              <Image
                src={e.imageUrl}
                height={50}
                width={50}
                alt=""
                className="object-cover !min-w-[50px] ml-1 !min-h-[50px] rounded-2xl"
              />
            </Link>

            <Separator className="my-4" />
          </div>
        </TooltipComp>
      ))}
    </div>
  );
};

export default ServerLinks;
