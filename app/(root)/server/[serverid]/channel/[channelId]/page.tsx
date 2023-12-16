import {
findServer,
findServersBelong,
getCurrentUser,
} from "@/lib/db-actions";
import { Loader2, MonitorX, ServerCrashIcon, } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import dynamic from "next/dynamic";

import SideBarNav from "@/components/SideBarNav";
import LiveVidAud from "@/components/LiveVidAud";
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover";
import { InviteButton } from "@/components/InviteButton";
import {
ChevronDown,
Hash,
Lock,
Mic,
PlusIcon,
Settings,
Video,
} from "lucide-react";
import ManageUsers from "@/components/ManageUsers";
import { Separator } from "@/components/ui/separator";
import DeleteLeaveServerButton from "@/components/Forms/DeleteServerButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChannelForm from "@/components/Forms/CreateChannel";
import ManageServers from "@/components/CreateServer";
import ChannelHandler from "@/components/Forms/ChannelHandler";
import { Suspense } from "react";
import {  Server, User } from "@/index";
import { currentUser } from "@clerk/nextjs";

const TextChat = dynamic(() => import("@/components/Forms/TextChat"), {
ssr: false,
});

const page = async ({
params: { serverId, channelId },
searchParams:{limit}
}: {
params: { serverId: string; channelId: string };
searchParams:{limit:string}
}) => {

    const clerkUser= await currentUser()
    const Userdata:User =await getCurrentUser (clerkUser?.id ||"")
  
  

const currentServer:Server = await findServer({
    serverId,
    chatLimit: +limit || 10,
    userId: Userdata.id,
    operationType: "findSpecific",
    channelId:"",
});

const allservers = await findServersBelong("findGeneral");

const currentChannel = currentServer?.channels.find(
    (e) => e.name === channelId
);

const channlesType = currentServer && [
    ...new Set(currentServer?.channels.map((e) => e.type)),
];

const isAdmin = currentServer?.members.some(
    (e) => e.memberId === Userdata.id && e.userType === "admin"
);
const currentMember = currentServer.members.find(
    (e) => e.memberId === Userdata.id 
)
const memberId = currentMember?.id

if (!Userdata?.onboarded) redirect("/profile");

return (
    <Suspense
    fallback={
        <div className="fixed inset-0 flexcenter">
        <Loader2 className="animate-spin h-16 w-16 " />
        </div>
    }
    >
    {currentChannel ? (
        <div className="  flex  w-full h-full">
        <SideBarNav
            userId={Userdata.id}
            allservers={JSON.parse(JSON.stringify(allservers))}
        >
            <div
            className="w-64  bg-gray-400 
                dark:bg-[#191919fc] h-screen"
            >
            <Popover>
                <PopoverTrigger className="w-full">
                <div
                    role="button"
                    className=" px-4 w-full text-start flex justify-between 
                            text-xl font-semibold items-center py-2 bg-gray-500
                            dark:bg-[#1d1e20] text-gray-800 dark:text-gray-200"
                >
                    {currentServer?.name}

                    <ChevronDown />
                </div>
                </PopoverTrigger>

                <PopoverContent className="w-48 p-3 cursor-pointer ">
            
                <InviteButton
                    serverInvitaion={currentServer?.invitationLink || ""}
                />

                {isAdmin ? (
                    <>
                    <Separator className="my-2" />

                    <ManageUsers
                        userId={Userdata.id}
                        membersData={currentServer.members}
                
                        serverId={serverId || ""}
                    />

                    <ManageServers
                        userId={Userdata.id}
                        icon={
                        <p
                            className=" flex justify-between items-center 
                                                p-1 hover:bg-white rounded-md transition-all !bg-opacity-20"
                        >
                            Edit Server
                            <Settings />
                        </p>
                        }
                        text="Edit Server"
                        data={{
                        imageUrl: currentServer?.imageUrl,
                        name: currentServer?.name,
                        }}
                        submitText="Update"
                        actionType="update"
                        serverId={serverId || ""}
                    />
                    <div className="my-2" />
                    <DeleteLeaveServerButton
                    isAdmin={isAdmin}
                        actionType="delete"
                        serverId={serverId}
                        userId={Userdata.id}
                        memberId={memberId || ""}
                    />
                    <div className="my-2" />
                    <ChannelForm isAdmin={isAdmin}  actionType="create" serverId={serverId} />
                    </>
                ) : (
                    <>
                    <Separator className="my-2" />

                    <DeleteLeaveServerButton
                    userId={Userdata.id}
                    memberId={memberId || ""}
                    isAdmin={isAdmin}
                        actionType="leave"
                        serverId={serverId}
                    />
                    </>
                )}
                </PopoverContent>
            </Popover>

            <ScrollArea className="flex px-3 flex-col">
                {channlesType?.map((e: string) => (
                <>
                    <div className="flex items-center  w-full justify-between">
                    <p className="  text-lg font-semibold  w-full">
                        {e} Channels
                    </p>
                    {isAdmin && (
                        <ChannelForm
                        isAdmin={isAdmin}
                        actionType="create"
                        icon={<PlusIcon />}
                        serverId={serverId || ""}
                        />
                    )}
                    </div>

                    {currentServer?.channels.map((el) => {
                    return (
                        el.type == e && (
                        <div
                            className={`flex justify-between
                            transition-all p-2 my-1 items-center rounded-md dark:hover:!text-white
                            dark:text-neutral-400 text-neutral-700
                            ${
                            channelId == el.name
                                ? "bg-neutral-700 !text-white  dark:bg-neutral-500"
                                : ""
                            }
                            items-center dark:hover:bg-neutral-800 hover:bg-neutral-500 text-lg 
                            `}
                        >
                            <Link
                            href={`/server/${serverId}/channel/${el.name}`}
                            className=" w-full  py-2 "
                            >
                            <div
                                className="flex items-center
                                    text-base
                                    gap-4"
                            >
                                {e == "text" ? (
                                <Hash size={20} />
                                ) : e == "audio" ? (
                                <Mic size={20} />
                                ) : e == "video" ? (
                                <Video size={20} />
                                ) : (
                                ""
                                )}
                                <p>{el.name}</p>
                            </div>
                            </Link>
                            {el.name !== "general" ? (
                            <ChannelHandler
                            userId={Userdata.id}
                            channelId={el.id}
                            isAdmin={isAdmin}
                                channel={JSON.stringify(el)}
                                serverId={serverId || ""}
                            />
                            ) : (
                            <Lock />
                            )}
                        </div>
                        )
                    );
                    })}
                </>
                ))}

                <Separator className=" my-6" />

                <h2 className=" text-lg font-semibold ">Members</h2>

                {currentServer?.members.map((m) => (
                <>
                    <Separator className=" my-4" />

                    <div
                    key={m.member.id}
                    className="  w-full flex items-center gap-4 "
                    >
                    <div className="  !h-[50px] !w-[50px]  relative rounded-full    object-cover">
                        <Image
                        fill
                        src={m.member.imageUrl || ""}
                        alt=""
                        className="rounded-full  !min-h-[50px] !min-w-[50px]  "
                        />
                        {m.member.active && (
                        <div className=" absolute z-10 h-3 w-3 rounded-full bg-green-500 bottom-0 left-0" />
                        )}
                    </div>
                    <div className=" flex justify-between  items-center">
                        <div>
                        <p
                            className=" text-start text-xl dark:text-white 
                            font-semibold "
                        >
                            {m.member.username}
                        </p>
                        <p
                            className=" text-start text-xl dark:text-gray-500
                            font-semibold "
                        >
                            {m.member.name}
                        </p>
                        </div>
                    </div>
                    </div>
                </>
                ))}
            </ScrollArea>
            </div>
        </SideBarNav>

        <div className=" w-full h-screen  backdrop-blur-sm  bg-[#27272794] ">
            {currentServer && currentChannel.type == "text" ? (
            <TextChat
            channelName={currentChannel.name}
                limit={+limit ||10}
                data={JSON.parse(JSON.stringify(currentChannel.chat))}
                userId={Userdata.id.toString()}
                channelId={currentChannel.id}
                serverId={serverId}
                memberId={memberId ||""}
            />
            ) : currentChannel.type == "video" ? (
            <LiveVidAud
                audio={false}
            
                user={JSON.parse(JSON.stringify(Userdata))}
                chatId={currentChannel.id}
            />
            ) : (
            <LiveVidAud
                audio={true}
             
                user={JSON.parse(JSON.stringify(Userdata))}
                chatId={currentChannel.id}
            />
            )}
        </div>
        </div>
    ) : (
        <>
        <div
            className="flexcenter backdrop-blur-md  bg-black 
        !bg-opacity-75 flex-col gap-6  w-full h-screen"
        >
            {currentServer && (
            <Image
                height={60}
                width={60}
                className="!h-20 !w-20  border border-white rounded-full bg-cover "
                alt="image of user"
                src={currentServer?.imageUrl || ""}
            />
            )}

            {!currentServer && !currentChannel ? (
            <>
                <MonitorX size={120} />
                <p className=" text-2xl font-bold text-center max-md:text-lg">
                You are not invited to The server{" "}
                </p>
            </>
            ) : (
            <>
                <ServerCrashIcon size={150} strokeWidth={1} />
                <p className=" text-2xl font-bold">Server Not Found </p>
            </>
            )}

            <div className="flexcenter gap-6">
            <Button>
                <Link href={"/"}> return to main page</Link>
            </Button>
            </div>
        </div>
        </>
    )}
    </Suspense>
);
};

export default page;
