import SearchFreind from "@/components/Forms/SearchFreind";
import SideBarNav from "@/components/SideBarNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/index";
import { findServersBelong, getCurrentUser } from "@/lib/db-actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const allServers = await findServersBelong("findGeneral");
  const clerkUser = await currentUser();
  const Userdata: User = await getCurrentUser(clerkUser?.id || "");
  const userFriends = [
    ...(Userdata.freindsWith || []),
    ...(Userdata.freindsOf || []),
  ];
  console.log(Userdata);
  return (
    <main
      className=" min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover  bg-[url(/assets/cccircular.svg)] dark:bg-transparent bg-[#3e3e3efc]
      "
    >
      <Suspense>
        <SideBarNav
          freindesRequests={Userdata.freindsRequestedFrom}
          userId={Userdata.id}
          allservers={JSON.parse(JSON.stringify(allServers))}
        >
          {userFriends?.length > 0 && (
            <div
              className="w-fit  bg-gray-400 
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
                      className="flex items-center p-2 cursor-pointer hover:bg-neutral-700 rounded-lg 
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
          )}
        </SideBarNav>

        <div className="w-full backdrop-blur-lg relative h-screen">
          <SearchFreind userFriends={userFriends} userId={Userdata.id} />
        </div>
      </Suspense>
    </main>
  );
}
