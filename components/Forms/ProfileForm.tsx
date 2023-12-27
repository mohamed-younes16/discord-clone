"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { SetupSchema } from "@/models/Schemas/Setup";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input, InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import "@uploadthing/react/styles.css";
import { getCurrentProfilepage } from "@/lib/db-actions";
import { useRouter } from "next/navigation";

import axios from "axios";

import { User } from "@/index";
import { X } from "lucide-react";

const env = process.env.NODE_ENV;
const apiUrl =
  env == "development"
    ? "http://localhost:5000"
    : "https://dicord-api.onrender.com";
const ProfileForm = ({ userData }: { userData?: User }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SetupSchema>>({
    resolver: zodResolver(SetupSchema),
    defaultValues: {
      bio: userData?.bio || "",
      imageUrl: userData?.imageUrl || "",
      name: userData?.name || "",
      username: userData?.username || "",
    },
  });

  async function onSubmit(values: z.infer<typeof SetupSchema>) {
    try {
      toast.loading("uploading.....", { dismissible: false });

      const currentClerkUser = await getCurrentProfilepage();

      const data = {
        ...values,
        ...currentClerkUser,
      };

      const adding = axios.post(
        `${apiUrl}/register?onboarded=${userData?.onboarded}`,
        data
      );
      toast.dismiss();
      adding
        .then((e) => toast.success(e.data.message))
        .catch((e) => {
          toast.error(e.response.data.message);
        });

      toast.dismiss();
      setTimeout(() => {
        router.refresh();
      }, 400);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className=" flex justify-center  gap-20 flex-wrap max-md:gap-10 ">
              {field.value ? (
                <FormLabel
                  className=" mr-8 relative 
             w-[250px] flex justify-center items-center m-0 !h-[250px] 
            bg-zinc-900 rounded-full flexcenter "
                >
                  {field?.value ? (
                    <>
                      <X
                        onClick={() => field.onChange("")}
                        className="absolute cursor-pointer transition-all  
                      hover:scale-105 bg-red-500 top-2 right-2 
                      rounded-full p-2 h-10 w-10 z-50"
                      ></X>
                      <Image
                        src={field.value}
                        className="object-cover rounded-full"
                        alt="image of you"
                        fill
                      />
                    </>
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      className=" object-contain"
                      alt="image"
                      height={70}
                      width={70}
                    />
                  )}
                </FormLabel>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  appearance={{
                    container: ` max-md:!px-2 max-md:!py-6 transition-all hover:scale-105 dark:border-black
                    bg-white cursor-pointer dark:bg-zinc-300 `,
                    label: `text-xl `,
                  }}
                  onClientUploadComplete={(e) => field.onChange(e?.[0].url)}
                />
              )}

              {/* <FormControl className="account-form_image-input cursor-pointer
             border-white border-4 w-fit  h-24  flexcenter border-dashed ">
                <Input type="file"   accept="images/*" 
                onChange={e=>handleimage(e , field.onChange,setfiles)} />
            </FormControl> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=" flex flex-col   ">
              <FormLabel className="   ">Name</FormLabel>

              <FormControl className="">
                <Input className="account-form_input " type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className=" flex flex-col   ">
              <FormLabel className="   ">Username</FormLabel>

              <FormControl className=" ">
                <Input className="account-form_input " type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className=" flex flex-col   ">
              <FormLabel className="    ">Bio</FormLabel>

              <FormControl className="">
                <Input
                  className="account-form_input "
                  type="text"
                  {...(field as InputProps)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`${
            form.formState.isSubmitting ? " animate-bounce bg-zinc-500" : ""
          } flexcenter gap-6`}
        >
          Submit
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

export default ProfileForm;
