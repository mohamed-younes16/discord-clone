import SideBarNav from "@/components/SideBarNav";
import { FreindsChatObject, User } from "@/index";

import { findServersBelong, getCurrentUser } from "@/lib/db-actions";
import { auth } from "@clerk/nextjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import FriendChat from "@/components/Forms/FreindChat";
import axios from "axios";

const env = process.env.NODE_ENV;
const apiUrl =
  env == "development"
    ? "http://localhost:5000"
    : "https://dicord-api.onrender.com";

const page = async ({
  params: { friendId },
}: {
  params: { friendId: string };
}) => {
  const allServers = await findServersBelong("findGeneral");
  const { userId } = auth();
  const Userdata: User = await getCurrentUser(userId || "");
  const userFriends = [
    ...(Userdata.freindsWith || []),
    ...(Userdata.freindsOf || []),
  ];
  const findChatData = async () => {
    try {
      const { userId } = auth();
      const allServers = await axios.get(
        `${apiUrl}/users/access?friendId=${friendId}&userId=${userId}&operationType=findChat&chatLimit=10`
      );

      return allServers.data.chatObject;
    } catch (error) {
      console.log(error);
    }
  };
  const chatObjectData: FreindsChatObject = await findChatData();

  return (
    <div>
      <SideBarNav
        freindesRequests={Userdata.freindsRequestedFrom}
        userId={Userdata.id}
        allservers={JSON.parse(JSON.stringify(allServers))}
      >
        <div
          className="w-fit  bg-zinc-400 
                dark:bg-[#191919fc] h-screen"
        >
          <Separator className="my-6" />
          <p
            className="  max-sm:text-base
           text-xl px-3 dark:text-gray-500 font-semibold "
          >
            Direct messages
          </p>
          <ScrollArea className="flex mt-4 px-3 flex-col">
            {userFriends.map((e, i) => (
              <>
                <div
                  key={e.id}
                  className="flex items-center p-2 cursor-pointer hover:bg-zinc-700 rounded-lg 
                 transition-all w-full  gap-4  "
                >
                  <Link
                    href={`/chat/${e.id}`}
                    className="w-full flexcenter gap-4 overflow-auto"
                  >
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
                  </Link>
                </div>
                <Separator className="my-4" />
              </>
            ))}
          </ScrollArea>
        </div>
      </SideBarNav>
      <FriendChat
        chatId={chatObjectData.id}
        data={chatObjectData.chat}
        userId={Userdata.id}
        friendId={friendId}
      />
    </div>
  );
};

export default page;
