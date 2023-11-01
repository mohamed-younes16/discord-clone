
import SideBarNav from "@/components/SideBarNav"

import { ConnectToDB, getuserfromDB } from "@/lib/db-actions";

import { UserButton, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { UserObject } from "@/index";









export default async function Home() {
ConnectToDB()

const user = await currentUser()

const Userdata:UserObject = await getuserfromDB(user?.id || "")





  return ( 

    <main className=" min-h-screen dark:bg-[url(/assets/magicdark.png)]  bg-cover bg-[url(/assets/magiclight.png)]
      "> 


        
        
       
        <div className="ml-20">

        </div>



        
    </main>
  )
}
