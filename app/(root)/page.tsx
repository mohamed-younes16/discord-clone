import SearchFreind from "@/components/Forms/SearchFreind";
import SideBarNav from "@/components/SideBarNav";
import { Separator } from "@/components/ui/separator";
import { findServersBelong } from "@/lib/db-actions";


export default async function Home() {
  const allServers = await findServersBelong();


  return (
    <main
      className=" min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover  bg-[url(/assets/cccircular.svg)] dark:bg-transparent bg-[#3e3e3efc]
      "
    >
      <SideBarNav allservers={JSON.parse(JSON.stringify(allServers))} />

      <div className="">
        <div className="w-full backdrop-blur-lg relative h-screen">
         
         <SearchFreind />
        </div>
      </div>
    </main>
  );
}
