import {
findServer,
findServerBelongByID,
findServersBelong,
getCurrentProfile,
isServerAdmin,
} from "@/lib/db-actions";

import { MonitorX, ServerCrashIcon, UserPlus } from "lucide-react";

import { redirect } from "next/navigation";
import { UserObject } from "@/index";

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
const TextChat = dynamic(() => import("@/components/Forms/TextChat"), {
ssr: false,
});

const page = async ({
params: { serverid, channelId },
}: {
params: { serverid: string; channelId: string };
}) => {
const currentServer = await findServer(serverid, { limit: 6 });
const belongToServer = await findServerBelongByID(serverid);
const allservers = await findServersBelong();
const currentChannel = currentServer?.channels.find(
    (e) => e.name === channelId
);
const channlesType = currentServer && [
    ...new Set(currentServer?.channels.map((e: any) => e.type)),
];
const isAdmin = await isServerAdmin(serverid);

const Userdata: UserObject = await getCurrentProfile();



if (!Userdata?.onboarded) redirect("/profile");

return (
    <div className="">
    {belongToServer && currentChannel ? (
        <div className="  flex  w-full h-full">
        <SideBarNav allservers={JSON.parse(JSON.stringify(allservers))}>
            <div
            className="w-60  bg-gray-400 
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

                <PopoverContent className="w-48 cursor-pointer ">
                <p
                    className=" p-1   dark:text-indigo-400 
                                flex justify-between
                                items-center  hover:bg-white  rounded-md transition-all !bg-opacity-20"
                >
                    Share Server
                    <UserPlus />
                </p>
                <div className="my-2" />

                <InviteButton
                    serverInvitaion={currentServer?.invitationLink || ""}
                />

                {isAdmin ? (
                    <>
                    <Separator className="my-2" />

                    <ManageUsers serverid={serverid || ""} />

                    <ManageServers
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
                        serverId={serverid || ""}
                    />
                    <div className="my-2" />
                    <DeleteLeaveServerButton
                        actionType="delete"
                        serverid={serverid}
                    />
                    <div className="my-2" />
                    <ChannelForm actionType="create" serverId={serverid} />
                    </>
                ) : (
                    <>
                    <Separator className="my-2" />

                    <DeleteLeaveServerButton
                        actionType="leave"
                        serverid={serverid}
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
                        actionType="create"
                        icon={<PlusIcon />}
                        serverId={serverid || ""}
                        />
                    )}
                    </div>

                    {currentServer?.channels.map((el) => {
                    return (
                        el.type == e && (
                        <div
                            className={`flex justify-between
                            transition-all px-4 dark:hover:!text-white
                            dark:text-neutral-400 text-neutral-700
                            ${
                            channelId == el.name
                                ? "bg-neutral-700 !text-white  dark:bg-neutral-500"
                                : ""
                            }
                            items-center dark:hover:bg-gray-400 hover:bg-gray-500 text-lg 
                            `}
                        >
                            <Link
                            href={`/server/${serverid}/channel/${el.name}`}
                            className=" w-full  py-2 "
                            >
                            <div
                                className="flex
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
                                channel={JSON.stringify(el)}
                                serverId={serverid || ""}
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
                    key={m.member._id}
                    className="  w-full flex items-center gap-4 "
                    >
                    <div className="w-12  h-12 relative rounded-full  object-cover">
                        <Image fill src={m.member.imageUrl || ""} alt=""  className=" rounded-full"/>
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
                data={JSON.parse(JSON.stringify(currentChannel.chat))}
                userId={Userdata._id.toString()}
                channelId={channelId}
                serverId={serverid}
            />
            ) : currentChannel.type == "video" ? (
            <LiveVidAud
                audio={false}
                video={true}
                user={JSON.parse(JSON.stringify(Userdata))}
                chatId={currentChannel._id.toString()}
            />
            ) : (
            <LiveVidAud
                audio={true}
                video={false}
                user={JSON.parse(JSON.stringify(Userdata))}
                chatId={currentChannel._id.toString()}
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

            {!belongToServer && currentServer && currentChannel ? (
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
    </div>
);
};

export default page;
