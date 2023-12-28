"use client";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import { GripVertical, Loader2, MessagesSquare } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { User } from "@/index";
import _ from "lodash";
import { deleteFriend, requestFreind } from "@/lib/db-actions";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SearchFreind = ({
  userId,
  userFriends,
}: {
  userId: string;
  userFriends: User[];
}) => {
  const env = process.env.NODE_ENV;
  const apiUrl =
    env == "development"
      ? "http://localhost:5000"
      : "https://discord-api.up.railway.app";
  const router = useRouter();
  const [freinds, setFreinds] = useState<User[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isRequseting, setisRequseting] = useState<boolean>(false);
  const [isRequseted, setisRequseted] = useState<boolean>(false);
  const [isSearchingMode, setisSearchingMode] = useState<boolean>(false);
  const ChannelSchema = z.object({
    name: z
      .string()
      .min(4, { message: "must be at least 4 characters long" })
      .refine((e) => e.toLocaleLowerCase() !== "general", {
        message: "you can't create an channel with name 'General'",
      }),
    type: z.enum(["All", "Blocked"]),
  });

  const form = useForm<z.infer<typeof ChannelSchema>>({
    resolver: zodResolver(ChannelSchema),
    defaultValues: {
      name: "",
      type: "All",
    },
  });

  const { watch } = form;
  const SideBarOpen = useStore().SideBarOpen;

  const freindsList: ["All", "Blocked"] = ["All", "Blocked"];
  useEffect(() => {
    const debouncedSearch = _.debounce(async () => {
      setIsLoading(true);

      if (watch().name.length === 0) {
        setFreinds([]);
      }

      if (watch().name.length > 0) {
        try {
          const username = watch().name;
          const user = await axios.get(
            `${apiUrl}/users/access?username=${username}&userId=${userId}&operationType=findUser`
          );
          setFreinds(user.data.users);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          setIsLoading(false);
        }
      }
    }, 800);

    const sub = watch(debouncedSearch);

    return () => {
      sub.unsubscribe();
      debouncedSearch.cancel();
    };
  }, [watch, userId]);

  return (
    <div className={` transition-all duration-150 `}>
      <Toaster richColors position="bottom-center" />
      {!(freinds.length > 0) && isSearchingMode && (
        <div
          className=" w-1/3 absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2 max-md:h-2/3 max-md:w-2/3 h-1/3
           bg-contain bg-center bg-no-repeat bg-[url(/assets/p2.svg)] "
        />
      )}

      <div
        className={`w-full dark:bg-[#252525]   bg-zinc-400 transition-all duration-150 shadow-xl max-w-[calc(100dvw_-_${
          SideBarOpen ? "90px" : "0px"
        })] 
      ${SideBarOpen && "max-sm:overflow-x-scroll"}  overflow-y-hidden `}
      >
        <div className="flex p-3  items-center ">
          <div className="flexcenter w-fit mr-7 gap-2">
            <svg
              x="0"
              y="0"
              aria-hidden="true"
              role="img"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none" fillRule="evenodd">
                <path
                  fill="currentColor"
                  fillRule="nonzero"
                  d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
                  transform="translate(2 4)"
                ></path>
                <path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
              </g>
            </svg>
            <p className=" text-xl font-bold ">Freinds</p>
          </div>
          <div className="flexcenter   h-12 ">
            {freindsList.map((e) => (
              <>
                {" "}
                <Separator
                  orientation="vertical"
                  className="mx-3  h-12  bg-zinc-700 "
                />
                <div key={e} className="w-24 flexcenter">
                  {" "}
                  <button
                    className={`p-1 w-full text-lg rounded-md
                      hover:bg-zinc-400 transition-all
                        !bg-opacity-30

                        ${
                          e === form.watch().type &&
                          !isSearchingMode &&
                          "!bg-zinc-400"
                        }
                        `}
                    key={e}
                    onClick={() => {
                      form.setValue("type", e);
                      setisSearchingMode(false);
                    }}
                  >
                    {e}
                  </button>
                </div>
              </>
            ))}
            <>
              <Separator
                orientation="vertical"
                className="mx-3  h-12  bg-zinc-700 "
              />
              <div className="w-28 mr-16 flexcenter">
                <button
                  className={`p-1 w-full text-lg rounded-md whitespace-nowrap
                      transition-all
                     ${
                       isSearchingMode
                         ? " text-green-600 !bg-opacity-30 bg-zinc-400"
                         : " shadow-md  hover:shadow-green-500 hover:bg-green-500 bg-green-700 "
                     }   `}
                  onClick={() => setisSearchingMode(true)}
                >
                  Add Freind
                </button>
              </div>
            </>
          </div>
        </div>
      </div>
      {isSearchingMode && (
        <Form {...form}>
          <form className="space-y-8 p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className=" flex flex-col items-start   ">
                    <FormLabel>Freind Name</FormLabel>
                    <FormDescription>
                      You can add friends with their usernames{" "}
                    </FormDescription>
                    <FormControl className="">
                      <Input
                        className="account-form_input "
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      )}

      {isSearchingMode && loading ? (
        watch().name.length > 0 && (
          <div className="flexcenter px-6">
            <Loader2 className=" animate-spin h-14 w-14 " />
          </div>
        )
      ) : (
        <>
          <div className=" p-6 flex-col flex ">
            {freinds?.map((e) => (
              <Popover key={e.id}>
                <PopoverTrigger>
                  <div
                    key={e.id}
                    className="flex w-full items-start gap-4  my-6"
                  >
                    {e?.imageUrl && (
                      <Image
                        height={60}
                        width={60}
                        className="!h-16 !w-16 rounded-full bg-cover "
                        alt="image of user"
                        src={e?.imageUrl}
                      />
                    )}

                    <div className=" flex justify-between w-full items-center">
                      <div>
                        <p
                          className=" text-start text-xl dark:text-white 
                      font-semibold "
                        >
                          {e.username}
                        </p>
                        <p
                          className=" text-start text-xl dark:text-gray-500
                      font-semibold "
                        >
                          {e.name}
                        </p>
                      </div>
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
                      <CardFooter className="flex justify-end mt-6">
                        {!isRequseted && (
                          <Button
                            onClick={async (ev) => {
                              setisRequseting(true);
                              toast.loading("", { duration: 90000 });
                              const adding = await requestFreind(userId, e.id);
                              toast.dismiss();
                              toast.success(<p>{adding} </p>);
                              setisRequseted(true);
                            }}
                          >
                            {isRequseting ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Add Freind"
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </>
      )}
      {!isSearchingMode && (
        <ScrollArea className="px-4">
          {userFriends.map((e, i) => (
            <>
              <div
                key={e.id}
                className="flex items-center p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg 
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
                <Link
                  className="p-2 rounded-full hover:bg-zinc-300
                    cursor-pointer transition-all flexcenter !bg-opacity-20"
                  href={`/chat/${e.id}`}
                >
                  <MessagesSquare />
                </Link>
                <Popover>
                  <PopoverTrigger>
                    <div
                      className="p-2 rounded-full hover:bg-zinc-300
                    cursor-pointer transition-all flexcenter !bg-opacity-20"
                    >
                      <GripVertical size={20} strokeWidth={3} />
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className=" w-fit">
                    <Button
                      variant={"destructive"}
                      onClick={async () => {
                        const deletion = await deleteFriend(userId, e.id);
                        toast.message(deletion);
                        router.refresh();
                      }}
                    >
                      {" "}
                      Delete
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
              <Separator className="my-4" />
            </>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default SearchFreind;
