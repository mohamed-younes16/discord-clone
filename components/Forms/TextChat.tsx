/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Lenis from "@studio-freight/lenis";
import * as z from "zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import qs from "query-string";
import { Toaster, toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useRef, useState } from "react";
import { Award, Loader2, Send } from "lucide-react";
import { io } from "socket.io-client";
import EmojiPicker from "./EmojiPicker";
import UploadFileChat from "./UploadFileChat";
import TooltipComp from "../ui/TooltipComp";
import MessageComp from "../MessageComp";
import { Chat } from "@/index";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { findServer } from "@/lib/db-actions";

const env = process.env.NODE_ENV;
const apiUrl =
  env == "development"
    ? "http://localhost:5000"
    : "https://dicord-api.onrender.com";
const TextChat = ({
  serverId,
  channelId,
  data,
  userId,
  memberId,
  limit,
  channelName,
}: {
  serverId: string;
  channelId: string;
  data: Chat[];
  userId: string;
  memberId: string;
  limit: number;
  channelName: string;
}) => {
  const [connected, setIsconnected] = useState(false);
  const [chat, setChat] = useState<Chat[]>(data.toReversed() || []);
  const bottomRef = useRef<any>(null);
  const socket = useMemo(() => io(apiUrl), []);
  const wrapper: any = useRef();
  const content: any = useRef();
  const [messagesToShow, setMessagesToShow] = useState(9);
  const [fetchingMessages, setFetchingMessages] = useState(true);
  const targetRef = useRef(null);

  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: wrapper?.current,
      duration: 0.6,

      content: content.current,
    });

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);


  }, []);

  useEffect(() => {
    toast.dismiss();
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  useEffect(() => {
    const change = async () => {
   
      const data = await findServer({
        serverId,
        chatLimit: messagesToShow,
        userId,
        operationType: "findChannel",
        channelId,
      });
      setChat(data.chat.toReversed());
      setFetchingMessages(false)
    };

    change();
  }, [messagesToShow]);
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.9,
    };

    const callback = async (entries: any) => {
      setTimeout(() => {
        entries.forEach(async (entry: any) => {
          if (entry.isIntersecting) {

            if ((messagesToShow <= chat.length) && (!fetchingMessages)) { 
              setFetchingMessages(true)
              setMessagesToShow((s) => s + 2);
            }
          }
        });
      }, 500);
    };

    const observer = new IntersectionObserver(callback, options);

    if (targetRef?.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      // Cleanup: disconnect the observer when the component unmounts
      observer.disconnect();
    };
  }, [chat.length,messagesToShow]);

  socket && socket.connect();
  socket &&
    socket.on(
      `message-server-${serverId}-channel-${channelId}`,
      (message: Chat[]) => {
        toast.dismiss();

        setChat(message.toReversed());
      }
    );

  socket?.on("connect", () => {
    setIsconnected(true);
  });
  const ChannelSchema = z.object({
    message: z
      .string()
      .min(1, { message: "Empty" })
      .refine((e) => e.toLocaleLowerCase() !== "general", {
        message: "you can't create an channel with name 'General'",
      }),
    fileUrl: z.string(),
    fileType: z.enum(["pdf", "image"]),
  });

  const form = useForm<z.infer<typeof ChannelSchema>>({
    resolver: zodResolver(ChannelSchema),
    defaultValues: {
      message: "",
      fileUrl: "",
      fileType: "pdf",
    },
  });
  async function onSubmit(values: z.infer<typeof ChannelSchema>) {
    try {
      toast.loading("sending.....", { dismissible: false, duration: 90000 });

      const url = qs.stringifyUrl({
        url: `${apiUrl}/servers/messages`,
      });

      await axios.post(url, {
        messageData: values,
        serverId,
        channelId,
        operationType: "createMessage",
        userId,
        memberId,
        chatLimit: messagesToShow,
      });

      toast.dismiss();
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex-col flex  h-screen  w-full">
      <Toaster richColors />
    
      <div
        id="text-wrapper"
        ref={wrapper}
        className="chat overflow-hidden relative  flex px-4 flex-col max-h-[85%] h-[85%]  gap-10 "
      >
      
        <div ref={content} id="text-content">
          <div ref={targetRef} className="" />
          {chat &&
            chat.map((e, i) => {
              return (
                <MessageComp
                  channelId={channelId}
                  userId={userId}
                  serverId={serverId}
                  data={e}
                  key={i}
                  chatLimit={messagesToShow}
                />
              );
            })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="p-4 max-h-[15%] h-[15%] ">
        <Form {...form}>
          <form className="space-y-8">
            <div className="flex pb-6 gap-4">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <>
                    <FormItem className=" flex relative flex-col  items-start   ">
                      {field.value && (
                        <TooltipComp hoverText="one file added ">
                          <p
                            className=" bg-red-700 absolute w-6 flexcenter z-40 h-6 
            rounded-full -top-1 -right-1 text-base"
                          >
                            {" "}
                            1
                          </p>
                        </TooltipComp>
                      )}

                      <UploadFileChat
                        setFileType={(type: "pdf" | "image") =>
                          form.setValue("fileType", type)
                        }
                        SetfieldValue={(url: string) => field.onChange(url)}
                      />

                      <FormControl className=""></FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <>
                    <FormItem className=" flex flex-col w-full items-start   ">
                      <FormControl className="">
                        <Input
                          placeholder="message..."
                          className="account-form_input !shadow-none
                !ring-0
                !outline-none !border-none "
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <EmojiPicker
                      onemojichange={(e: any) =>
                        field.onChange(`${field.value}${e}`)
                      }
                    />
                  </>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
                className={`${
                  form.formState.isSubmitting ? " bg-gray-500" : ""
                } flexcenter gap-6`}
              >
                <Send />
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-col pb-3 ">
          <div>
             {connected ? (
            <Badge
              variant="outline"
              className="  text-green-600 border-green-600"
            >
              {" "}
              connected{" "}
            </Badge>
          ) : (
            <Badge variant="outline" className=" text-red-600 border-red-600">
              {" "}
              wait for connection{" "}
            </Badge>
          )}
          </div>
          { fetchingMessages && (<Loader2 className=" self-center h-10 w-10   animate-spin"/>)}

         
        </div>
      </div>
    </div>
  );
};

export default TextChat;
