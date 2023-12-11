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

import { addUpdateUser, getCurrentProfile } from "@/lib/db-actions";

import { useRouter } from "next/navigation";
import { UserObject } from "@/index";
import axios from "axios";

const ProfileForm = ({ userData }: { userData: UserObject }) => {
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

      const currentUser = await getCurrentProfile(false);
      // console.log({ ...values, ...currentUser });
      // const adding = await axios.post("http://localhost:5000/register", {
      //   ...values,
      //   ...currentUser,
      // });
      // console.log(adding.data);
      // const uploadUser  = await addUpdateUser(values)
      // toast.dismiss()
      // uploadUser
      // ?  toast.success("uploaded",{duration:3000})
      // :  toast.error("failed to upload",{duration:3000})

      // setTimeout(() => {

      //     router.push("/")
      // }, 400);
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
              <UploadDropzone
                endpoint="imageUploader"
                onUploadProgress={(e) => console.log(e)}
                appearance={{
                  container: ` max-md:!px-2 max-md:!py-6 transition-all hover:scale-105 dark:border-black
                     bg-white cursor-pointer dark:bg-neutral-300 `,
                  label: `text-xl `,
                }}
                onClientUploadComplete={(e) => field.onChange(e?.[0].url)}
              />

              <FormLabel
                className=" mr-8 relative overflow-hidden
             w-[250px] flex justify-center items-center m-0 !h-[250px] 
            bg-gray-900 rounded-full flexcenter "
              >
                {field?.value ? (
                  <Image
                    src={field.value}
                    className="object-cover"
                    alt="image of you"
                    fill
                  />
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
            form.formState.isSubmitting ? " animate-bounce bg-gray-500" : ""
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
