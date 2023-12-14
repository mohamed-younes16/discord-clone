/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
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
  CardContent,
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
import { addFreind, getAUser } from "@/lib/db-actions";
import { UserDocument } from "@/models/UsersModel";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const SearchFreind = () => {
  const env = process.env.NODE_ENV
const apiUrl = env =="development" ?"http://localhost:5000":"https://dicord-api.onrender.com"

  const [freinds, setFreinds] = useState<UserDocument[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);

  const ChannelSchema = z.object({
    name: z
      .string()
      .min(4, { message: "must be at least 4 characters long" })
      .refine((e) => e.toLocaleLowerCase() !== "general", {
        message: "you can't create an channel with name 'General'",
      }),
    type: z.enum(["Online", "All", "Pending", "Blocked"]),
  });

  const form = useForm<z.infer<typeof ChannelSchema>>({
    resolver: zodResolver(ChannelSchema),
    defaultValues: {
      name: "",
      type: "Online",
    },
  });

  const { watch } = form;
  const SideBarOpen = useStore().SideBarOpen;

  const freindsList: ["Online", "All", "Pending", "Blocked"] = [
    "Online",
    "All",
    "Pending",
    "Blocked",
  ];
  useEffect(() => {
    let timeoutId;
  
    const sub = watch(async (v) => {
      setIsLoading(true);
  
      if (watch().name.length == 0) {
        setFreinds([]);
        clearTimeout(timeoutId); // Clear the timeout when the watch value changes
      }
  
      if (watch().name.length > 0) {
        timeoutId = setTimeout(async () => {
          const user = await axios.post(`${apiUrl}/login`, {
            "username": "yehhs",
            "pass": "mohamed2007",
            data : {
              "bio":"idk",
              "createdAt":"2023-10-27T13:31:26.639Z"
              ,"imageUrl":"https://utfs.io/f/c8d117ff-2bcd-444e-8f2f-efac8660934b-43bfjs.png",
            
              "name":"mohamed",
              "onboarded":true,"username":"younes_med",
              "active":true,
              email:"younes_med@prisma.",
              
            }
          });
          console.log(user.data.check);
          // setFreinds(users?.users || []);
          setIsLoading(false);
        }, 300); // Set your desired timeout value in milliseconds
      }
    });
  
    return () => {
      console.log(timeoutId)
      sub.unsubscribe();
      clearTimeout(timeoutId); // Clear the timeout when the component unmounts
    };
  }, [watch]);

  return (
    <div
      className={` ${SideBarOpen && "pl-[90px] "} transition-all duration-700 `}
    >
      <Toaster richColors />
      {!(freinds.length > 0) && (
        <div
          className=" w-1/3 absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2 max-md:h-2/3 max-md:w-2/3 h-1/3
           bg-contain bg-center bg-no-repeat bg-[url(/assets/p2.svg)] "
        />
      )}

      <div
        className={`w-full dark:bg-[#252525]  bg-[#6e737c] transition-all duration-700 shadow-xl max-w-[calc(100dvw_-_${
          SideBarOpen ? "90px" : "0px"
        })] 
      ${SideBarOpen && "overflow-x-scroll"}  overflow-y-hidden `}
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
              <div key={e} className=" flexcenter">
                {" "}
                <Separator
                  orientation="vertical"
                  className="mx-3  h-12  bg-zinc-700 "
                />
                <button
                  className={`p-1 text-lg rounded-md
                      hover:bg-zinc-400 transition-all
                        !bg-opacity-30

                        ${e === form.watch().type && "!bg-zinc-400"}
                        
                        `}
                  key={e}
                  onClick={() => form.setValue("type", e)}
                >
                  {e}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-8 p-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem className=" flex flex-col items-start   ">
                  <FormLabel>Freind Name</FormLabel>

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

      {loading ? (
        watch().name.length > 0 && (
          <div className="flexcenter px-6">
            <Loader2 className=" animate-spin h-14 w-14 " />
          </div>
        )
      ) : (
        <>
          <div className=" p-6 flex-col">
            {freinds?.map((e) => (
              <Popover key={e._id}>
                <PopoverTrigger>
                  <div
                    key={e._id.toString()}
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
                        <Button
                          onClick={async (ev) => {
                            ev.currentTarget.disabled = true;
                            toast.loading("", { duration: 90000 });
                            console.log("Click");
                            const adding = await addFreind(e._id);
                            toast.dismiss();
                            adding?.valid
                              ? toast.success(<p>{adding?.message} </p>)
                              : toast.error(<p>{adding?.message} </p>);
                            ev.currentTarget.disabled = false;
                          }}
                        >
                          Add Freind
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchFreind;
