"use client";

import { addingMember, findServerbyQuery } from "@/lib/db-actions";
import { Toaster, toast } from "sonner";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { Separator } from "@radix-ui/react-dropdown-menu";

const Page = ({
  params: { invitationid },
}: {
  params: { invitationid: string };
}) => {
  const [servername, setServerName] = useState("");
  const [serverImage, setserverImage] = useState("");
  const [isjoning, setisjoning] = useState(false);
  const Router = useRouter();
  const env = process.env.NODE_ENV;
  const apiUrl =
    env == "development"
      ? "http://localhost:5000"
      : "https://discord-api.up.railway.app";

  useEffect(() => {
    const getname = async () => {
      const serverdata = await findServerbyQuery(invitationid);

      setServerName(serverdata?.name || "");
      setserverImage(serverdata?.imageUrl || "");
    };

    getname();
  }, []);

  const addingmember = async () => {
    setisjoning(true);

    const adding = await addingMember(invitationid);

    if (adding?.serversBelongsTo) {
      toast.dismiss();
      toast.message(<p className="flexcenter"> {adding.message}</p>);
      setTimeout(() => {
        setisjoning(false);
        Router.push(`/server/${adding?.serversBelongsTo.id}`);
        Router.refresh();
      }, 500);
    }
    if (!adding?.serversBelongsTo) {
      toast.dismiss();
      toast.message(<p className="flexcenter"> {adding.message}</p>);
      setTimeout(() => {
        setisjoning(false);
        window.location.assign(`/`);
        Router.refresh();
      }, 500);
    }

    // } else if (adding?.message == "exist") {
    //   toast.dismiss();

    //   toast.message(<p className="text-2xl font-semibold"> already in </p>);

    //   setTimeout(() => {
    //     setisjoning(false);
    //     Router.push(`/server/${adding?.serverId}`);
    //     Router.refresh();
    //   }, 500);
    // }
  };

  return (
    <div
      className="  
  bg-cover p-2
 w-screen h-screen fixed inset-0 flex flex-col
   bg-[url(/assets/body-bg.svg)] bg-black gap-4 justify-center items-center"
    >
      <Toaster position="top-center" richColors className="text-3xl" />

      <Card
        className={`transition-all duration-150 
       bg-zinc-800 border-none overflow-hidden outline-none
        ${
          servername
            ? "w-[450px] max-md:w-[300px] opacity-1"
            : "w-[0px] opacity-0 "
        }  `}
      >
        <CardHeader>
          <CardTitle>
            <div className="flexcenter">
              {serverImage && (
                <Image
                  width={50}
                  height={50}
                  className=" bg-cover rounded-full !w-20 !h-20"
                  loading="eager"
                  alt="server Image"
                  src={"" || serverImage}
                />
              )}
            </div>
            <Separator className="my-4  bg-stone-600 h-[1px] " />
            <div
              className="font-bold dark:text-white  text-center 
      mb-9 text-black text-xl"
            >
              <span className=" font-medium text-gray-300">
                You have invitation to join
                <div className="font-bold text-white"> {servername} server</div>
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardFooter>
          <div className="flex w-full gap-4">
            <Button
              className=" w-full flexcenter !bg-white !text-black  gap-5"
              onClick={() => addingmember()}
            >
              Join the Server
              {isjoning ? (
                <Loader2 className=" animate-spin" />
              ) : (
                <Check className="mr-2 font-bold h-6 w-6" strokeWidth={5} />
              )}
            </Button>
            <Button variant={"outline"} onClick={() => Router.push("/")}>
              {" "}
              cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
