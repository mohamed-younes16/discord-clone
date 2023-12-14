"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { ServerSchema } from "@/models/Schemas/ServerSetup";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import "@uploadthing/react/styles.css";
import { XCircle } from "lucide-react";
import axios from "axios";



const ServerForm = ({
  data,
  submitText,
  actionType,
  serverId = "",
  userId,
}: {
  serverId?: string;
  data?: any;
  submitText?: string;
  actionType: "create" | "update";
  userId: string;
}) => {
  const env = process.env.NODE_ENV;
  const apiUrl =
    env == "development"
      ? "http://localhost:5000"
      : "https://dicord-api.onrender.com";

  const form = useForm<z.infer<typeof ServerSchema>>({
    resolver: zodResolver(ServerSchema),
    defaultValues: {
      imageUrl: data?.imageUrl || "",
      name: data?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ServerSchema>) {
    try {
      toast.loading(actionType == "create" ? "creating....." : "updating....", {
        dismissible: true,
      });

      const uploadServer =
        actionType == "create"
          ? axios.post(`${apiUrl}/servers/create`, {
              serverData: values,
              userId,
            })
          : axios.patch(`${apiUrl}/servers/update`, {
              serverData: values,
              userId,
            });
      toast.dismiss();
      uploadServer
        .then((response) => {
          toast.success(response.data.message);
          setTimeout(() => {
                window.location.reload();
                }, 500);
        })
        .catch((error) => {
          toast.error(error.response.data.message, { dismissible: true });
        });
      toast.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl"
      >
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className=" flex justify-center  gap-10 flex-wrap  ">
              {!field?.value && (
                <UploadDropzone
                  endpoint="imageUploader"
                  appearance={{
                    container: ` max-md:!px-2 max-md:!py-6 transition-all hover:scale-105 dark:border-black
                    bg-white cursor-pointer dark:bg-neutral-300 `,
                    label: `text-xl `,
                  }}
                  onClientUploadComplete={(e) => field.onChange(e?.[0].url)}
                />
              )}

              <FormLabel
                className={` mr-8 relative 
            w-[100px] p-2  flex justify-center items-center m-0  !h-[100px] 
            bg-gray-900 rounded-full flexcenter ${
              !(field.value.length > 0) && "!hidden"
            }`}
              >
                {field?.value && (
                  <button
                    onClick={() => {
                      field.onChange("");
                    }}
                    className="absolute z-30 rounded-full text-white top-0 right-0  bg-red-600 p-1"
                  >
                    <XCircle />
                  </button>
                )}

                {field?.value ? (
                  <Image
                    src={field.value}
                    className=" rounded-full object-cover"
                    alt="image of you"
                    fill
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    className=" object-contain rounded-full"
                    alt="image"
                    height={70}
                    width={70}
                  />
                )}
              </FormLabel>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=" flex flex-col   ">
              <FormLabel>Server Name</FormLabel>

              <FormControl className="">
                <Input className="account-form_input " type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`${
            form.formState.isSubmitting ? " animate-bounce bg-gray-500" : ""
          } flexcenter gap-6`}
        >
          {submitText || "Submit"}
          {form.formState.isSubmitting && (
            <div
              className="w-8 h-8 border-4 border-white
    dark:border-black !border-t-transparent rounded-full animate-spin"
            />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ServerForm;
