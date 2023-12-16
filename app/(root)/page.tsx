import SearchFreind from "@/components/Forms/SearchFreind";
import SideBarNav from "@/components/SideBarNav";
import { User } from "@/index";

import { findServersBelong, getCurrentUser } from "@/lib/db-actions";
import { currentUser } from "@clerk/nextjs";
import { Suspense }  from "react";


export default async function Home() {
  const allServers = await findServersBelong("findGeneral");
  const clerkUser= await currentUser()
  const Userdata:User =await getCurrentUser (clerkUser?.id ||"")



  return (
    <main
      className=" min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover  bg-[url(/assets/cccircular.svg)] dark:bg-transparent bg-[#3e3e3efc]
      "
    >
     <Suspense  >
<SideBarNav userId={Userdata.id} allservers={JSON.parse(JSON.stringify(allServers))} />



    
        <div className="w-full backdrop-blur-lg relative h-screen">
         <SearchFreind userId={Userdata.id} />
        </div>
  
      </Suspense>
    </main>
  );
}
