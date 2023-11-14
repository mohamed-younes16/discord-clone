import SideBarNav from "@/components/SideBarNav";
import { findServersBelong } from "@/lib/db-actions";
import { ServerDocument } from "@/models/Servers";


export default async function Home() {
const allServers  = await findServersBelong()

  return ( 

    <main className=" min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover  bg-[url(/assets/cccircular.svg)] dark:bg-transparent bg-[#3e3e3efc]
      ">  

  <SideBarNav  allservers={JSON.parse( JSON.stringify( allServers))} />
        
        
       
        <div className="ml-20">

        </div>



        
    </main>
  )
}