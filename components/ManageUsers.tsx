
/* eslint-disable react-hooks/exhaustive-deps */
import {  Check, GripVertical, ShieldAlert, UserX, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { getMembers, isServerAdmin } from "@/lib/db-actions"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import MembersHandler from "./MembersHandler"
import { Toaster } from "sonner"




const ManageUsers =async ({serverid}:{serverid:string})  => {

const membersData = await getMembers(serverid)
const Isadmin = await isServerAdmin(serverid)
console.log(membersData)



  return (

    <div>
            <Dialog >


      <DialogTrigger className="w-full" asChild>
        <div className=" p-1 my-2 !bg-opacity-25 transition-all 
        rounded-md dark:hover:bg-white flex items-center justify-between">
            Manage Users <Users size={20} strokeWidth={3} />


            </div> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
              <h1 className=" text-2xl font-bold "> Manage Users</h1>
              </DialogTitle>
          <DialogDescription>

                <ScrollArea className=" h-[400px] ">

                <Toaster richColors/>

                     {membersData && membersData?.map((e)=>{
                       
                        
                        return (

                    <div key={e.member._id.toString()} 
                    className="flex w-full items-start gap-4  my-6">

                    {e.member?.imageUrl && 
                    <Image height={60} width={60}
                    className="!h-16 !w-16 rounded-full bg-cover "
                    alt="image of user" src={e.member?.imageUrl} />
                    }

                        <div className=" flex justify-between w-full items-center" >
                            <div>
                                  <p className=" text-start text-xl dark:text-white 
                            font-semibold ">  
                              {e.member.username}</p>
                              <p className=" text-start text-xl dark:text-gray-500
                            font-semibold ">  
                              {e.member.name}</p>
                            </div>

                           
                        </div>
                        {Isadmin?.member._id.toString() !== e.member._id.toString() && (
                        
                        <MembersHandler serverId={serverid} memberstring={JSON.stringify(e)}/>
                        
                        )}
                       

                    
                    </div>
                )}
                
                )}

           
                </ScrollArea>
               
            
                     
          </DialogDescription>

        </DialogHeader>



                

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default ManageUsers