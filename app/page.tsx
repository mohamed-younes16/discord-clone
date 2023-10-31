
import SideBarNav from "@/components/SideBarNav"

import { ConnectToDB, findServersBelong, getuserfromDB } from "@/lib/db-actions";

import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { UserObject } from "..";








export default async function Home() {
ConnectToDB()

const user = await currentUser()

const Userdata:UserObject = await getuserfromDB(user?.id || "")

if (!Userdata?.onboarded ) redirect("/profile")



  return ( 

    <main className=" min-h-screen dark:bg-[url(/assets/magicdark.png)]  bg-cover bg-[url(/assets/magiclight.png)]
      "> 


          
        
        
        <SideBarNav userData={Userdata} />
        <div className="ml-20">

        </div>



        
    </main>
  )
}
