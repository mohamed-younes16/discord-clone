"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import * as z from "zod";
import { FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import EmojiPicker from "./Forms/EmojiPicker";
import MessageOpts from "./Forms/MessageOpts";
import { Separator } from "./ui/separator";
import { Chat, FreindsChatList } from "..";
import { formatDate } from "@/utils";
const env = process.env.NODE_ENV;
const apiUrl =
  env == "development"
    ? "http://localhost:5000"
    : "https://dicord-api.onrender.com";

type messgageCompProps =
  | {
      data: FreindsChatList;
      serverId?: string;
      channelId?: string;
      userId: string;
      chatLimit: number;
      target: "freinds";
      chatId: string;
    }
  | {
      data: Chat;
      serverId?: string;
      channelId?: string;
      userId: string;
      chatLimit: number;
      target: "channels";
      chatId?: null;
    };
const MessageComp = ({
  data,
  serverId,
  channelId,
  userId,
  chatLimit,
  target,
  chatId,
}: messgageCompProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const messageSchema = z.object({
    message: z.string().min(1, { message: "can't be Empty" }),
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: data?.content?.text || "",
    },
  });

  async function messageOnSubmit(values: z.infer<typeof messageSchema>) {
    try {
      switch (target) {
        case "channels":
          await axios.post(`${apiUrl}/servers/messages`, {
            messageId: data.id,
            channelId,
            chatLimit,
            operationType: "editMessage",
            userId,
            messageData: values,
            serverId,
          });
          break;
        case "freinds":
          await axios.post(`${apiUrl}/users/chat`, {
            messageId: data.id,
            chatLimit,
            operationType: "editMessage",
            userId,
            messageData: values,
            chatId,
          });
          break;
      }

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="hover:bg-[#55555550] transition-all ">
      {target === "channels" && (
        <div
          className={`w-full flex justify-between ${
            data.creator.memberId == userId
              ? "flex-row-reverse text-end"
              : "text-start"
          }`}
        >
          <div
            className={`w-full gap-6 my-5 flex ${
              data.creator.member.id == userId
                ? "flex-row-reverse text-end"
                : "text-start"
            }`}
          >
            <Image
              src={data.creator.member.imageUrl}
              className=" w-14 h-14 rounded-full object-cover overflow-hidden "
              alt=""
              height={50}
              width={50}
            />

            <div>
              <div
                className={` gap-6 flexcenter  ${
                  data.creator.member.id !== userId ? "flex-row-reverse" : ""
                }`}
              >
                <span className=" text-sm text-gray-800 dark:text-gray-500">
                  {" "}
                  {formatDate(data.createdAt.toString())}{" "}
                </span>
                <span className=" text-white text-xl font-semibold">
                  {" "}
                  {data?.creator?.member.username}
                </span>
              </div>
              <div className=" mt-4 ">
                {data?.content?.file?.url &&
                  (data?.content?.file.fileType == "pdf" ? (
                    <Link
                      target="_blank"
                      href={data?.content?.file?.url}
                      className=" flexcenter border-2 p-2 border-indigo-400 text-lg 
                        rounded-2xl  text-indigo-600 w-fit hover:underline  gap-2"
                    >
                      File Link
                      <FileText className="w-6 h-6" />
                    </Link>
                  ) : (
                    <div className=" rounded-2xl object-cover  relative overflow-hidden h-48 w-80">
                      <Image
                        src={data?.content?.file.url}
                        fill
                        alt="image of a message"
                      />
                    </div>
                  ))}

                {isEditing ? (
                  <Form {...messageForm}>
                    <form className="space-y-8">
                      {data?.content?.file?.url}

                      <div className="flex pb-12 gap-4">
                        <FormField
                          control={messageForm.control}
                          name="message"
                          render={({ field }) => {
                            return (
                              <>
                                <FormItem className=" flex relative flex-col  items-start   ">
                                  <FormControl className="flex ">
                                    <div className="flex gap-4">
                                      <Input
                                        className="account-form_input "
                                        type="text"
                                        {...field}
                                      />
                                      <EmojiPicker
                                        onemojichange={(e: any) =>
                                          field.onChange(`${field.value}${e}`)
                                        }
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              </>
                            );
                          }}
                        />

                        <Button
                          type="submit"
                          disabled={messageForm.formState.isSubmitting}
                          onClick={messageForm.handleSubmit(messageOnSubmit)}
                          className={`${
                            messageForm.formState.isSubmitting
                              ? " bg-zinc-500"
                              : ""
                          } flexcenter gap-6`}
                        >
                          {messageForm.formState.isSubmitting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <p className="  text-neutral-800 dark:text-gray-200 mt-4">
                    {data?.content?.text}
                  </p>
                )}
              </div>
            </div>
          </div>
          {userId && userId === data.creator.member.id && (
            <MessageOpts
              target={target}
              setEdit={setIsEditing}
              serverId={serverId}
              channelId={channelId}
              messageId={data.id}
              userId={userId}
              chatLimit={chatLimit}
            />
          )}
        </div>
      )}
      {target === "freinds" && (
        <div
          className={`w-full flex justify-between ${
            data.creator.id == userId
              ? "flex-row-reverse text-end"
              : "text-start"
          }`}
        >
          <div
            className={`w-full gap-6 my-5 flex ${
              data.creator.id == userId
                ? "flex-row-reverse text-end"
                : "text-start"
            }`}
          >
            <Image
              src={data.creator.imageUrl}
              className=" w-14 h-14 rounded-full object-cover overflow-hidden "
              alt=""
              height={50}
              width={50}
            />

            <div>
              <div
                className={` gap-6 flexcenter  ${
                  data.creator.id !== userId ? "flex-row-reverse" : ""
                }`}
              >
                <span className=" text-sm text-gray-800 dark:text-gray-500">
                  {" "}
                  {formatDate(data.createdAt.toString())}{" "}
                </span>
                <span className=" text-white text-xl font-semibold">
                  {" "}
                  {data?.creator.username}
                </span>
              </div>
              <div className=" mt-4 ">
                {data?.content?.file?.url &&
                  (data?.content?.file.fileType == "pdf" ? (
                    <Link
                      target="_blank"
                      href={data?.content?.file?.url}
                      className=" flexcenter border-2 p-2 border-indigo-400 text-lg 
                        rounded-2xl  text-indigo-600 w-fit hover:underline  gap-2"
                    >
                      File Link
                      <FileText className="w-6 h-6" />
                    </Link>
                  ) : (
                    <div className=" rounded-2xl object-cover  relative overflow-hidden h-48 w-80">
                      <Image
                        src={data?.content?.file.url}
                        fill
                        alt="image of a message"
                      />
                    </div>
                  ))}

                {isEditing ? (
                  <Form {...messageForm}>
                    <form className="space-y-8">
                      {data?.content?.file?.url}

                      <div className="flex pb-12 gap-4">
                        <FormField
                          control={messageForm.control}
                          name="message"
                          render={({ field }) => {
                            return (
                              <>
                                <FormItem className=" flex relative flex-col  items-start   ">
                                  <FormControl className="flex ">
                                    <div className="flex gap-4">
                                      <Input
                                        className="account-form_input "
                                        type="text"
                                        {...field}
                                      />
                                      <EmojiPicker
                                        onemojichange={(e: any) =>
                                          field.onChange(`${field.value}${e}`)
                                        }
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              </>
                            );
                          }}
                        />

                        <Button
                          type="submit"
                          disabled={messageForm.formState.isSubmitting}
                          onClick={messageForm.handleSubmit(messageOnSubmit)}
                          className={`${
                            messageForm.formState.isSubmitting
                              ? " bg-zinc-500"
                              : ""
                          } flexcenter gap-6`}
                        >
                          {messageForm.formState.isSubmitting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <p className="  text-neutral-800 dark:text-gray-200 mt-4">
                    {data?.content?.text}
                  </p>
                )}
              </div>
            </div>
          </div>
          {userId && userId === data.creator.id && (
            <MessageOpts
              chatId={chatId}
              target={target}
              setEdit={setIsEditing}
              serverId={serverId}
              channelId={channelId}
              messageId={data.id}
              userId={userId}
              chatLimit={chatLimit}
            />
          )}
        </div>
      )}

      <Separator />
    </div>
  );
};

export default MessageComp;
