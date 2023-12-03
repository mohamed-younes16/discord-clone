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

import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Toaster, toast } from "sonner";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import { getAUser } from "@/lib/db-actions";
import { UserDocument } from "@/models/UsersModel";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const SearchFreind = () => {
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
  })
  
  const {watch,} = form
  const SideBarOpen = useStore().SideBarOpen;

  const freindsList: ["Online", "All", "Pending", "Blocked"] = [
    "Online",
    "All",
    "Pending",
    "Blocked",
  ];




  async function onSubmit(values: z.infer<typeof ChannelSchema>) {
    try {
      toast.loading("", { dismissible: false });

      toast.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
  
  const sub  =   watch(async(v)=>{
  setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 5000)

  if( watch().name.length > 0 )  {
      const users = await getAUser(watch().name, watch().type);
       
        setFreinds(users?.users || []);
        setIsLoading(false);

  }
      

   })
  
    return () => sub.unsubscribe()

  }, [watch]);


  return (
    <div
      className={` ${SideBarOpen && "pl-[90px] "} transition-all duration-700 `}
    >
      { !(freinds.length > 0 ) &&   <div
            className=" w-1/3 absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2 max-md:h-2/3 max-md:w-2/3 h-1/3
           bg-contain bg-center bg-no-repeat bg-[url(/assets/p2.svg)] "
          />}
     
      <div className={`w-full bg-[#252525]  shadow-xl  `}>
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
              <g fill="none" fill-rule="evenodd">
                <path
                  fill="currentColor"
                  fill-rule="nonzero"
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
                <Separator
                  orientation="vertical"
                  className="mx-3  bg-zinc-700 "
                />
              </>
            ))}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) =>{
             
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
            )}}
          />

          {/* <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={`${
              form.formState.isSubmitting ? " animate-bounce bg-gray-500" : ""
            } flexcenter gap-6`}
          >
            Search
            {form.formState.isSubmitting && (
              <div
                className="w-8 h-8 border-4 border-white
   dark:border-black !border-t-transparent rounded-full animate-spin"
              />
            )}
          </Button> */}
        </form>
      </Form>

      {loading ? (
       watch().name.length > 0 && <Loader2 className=" animate-spin" />
      ) : (
        <div className="flexcenter p-6 flex-col">
          {freinds?.map((e) => (
              <div key={e._id.toString()} 
              className="flex w-full items-start gap-4  my-6">

              {e?.imageUrl && 
              <Image height={60} width={60}
              className="!h-16 !w-16 rounded-full bg-cover "
              alt="image of user" src={e?.imageUrl} />
              }

                  <div className=" flex justify-between w-full items-center" >
                      <div>
                            <p className=" text-start text-xl dark:text-white 
                      font-semibold ">  
                        {e.username}</p>
                        <p className=" text-start text-xl dark:text-gray-500
                      font-semibold ">  
                        {e.name}</p>
                      </div>

                     
                  </div>
               
                 

              
              </div>
          ))}
        </div>
      )}
        

    </div>
  );
};

export default SearchFreind;
