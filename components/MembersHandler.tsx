"use client"
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
import { changeUserType } from "@/lib/db-actions"
import { Member } from "@/models/Servers"
import { Check, GripVertical, ShieldAlert, UserX } from 'lucide-react'
import { useRouter } from "next/navigation"
import { toast } from "sonner"









const MembersHandler = ({memberstring,serverId}:{memberstring:string,serverId:string}) => {
    const router = useRouter()
const member:Member = JSON.parse(memberstring)
const changeUser = async (member:any, type:"editor"|"member",serverId:string) =>{
try {
    toast.loading("changing permissions.....")
    const changing = await changeUserType(member, type, serverId)
    console.log(changing)
        if(changing) {
                toast.dismiss()
                toast.success("changed successfully")
                router.refresh()
        }

} catch (error) {
    
}
   



}
  return (
    <DropdownMenu>

    <DropdownMenuTrigger>
        <div className="w-10 h-10 rounded-full hover:bg-gray-300
                cursor-pointer transition-all flexcenter !bg-opacity-20">
            <GripVertical size={20} strokeWidth={3} />
            </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent>
    
       
        <DropdownMenuSub >
                <DropdownMenuSubTrigger className="cursor-pointer" >
                    <div className="flex justify-start gap-2">
                       <ShieldAlert />
                    Role 
                    </div>
                    
                </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>

                <DropdownMenuItem
                  onClick={()=> member.userType == "member" ?
                  changeUser(member.member , "editor",serverId) :""}
                className=" flex justify-between  ">

                        <p>Moderator</p>

                        {member.userType == "editor" && <Check className="text-green-600"/>}

            </DropdownMenuItem>

            <DropdownMenuItem
            onClick={()=> member.userType == "editor" 
            ?changeUser(member.member , "member",serverId) :""}
            
            className=" flex justify-between  ">

            <p>member</p>

            {member.userType == "member" && <Check/>}

            </DropdownMenuItem>


            </DropdownMenuSubContent>

        </DropdownMenuSub>
         <DropdownMenuSeparator />
        <DropdownMenuItem className=" flex justify-between  ">

            <UserX size={20}   color="red"/>

            <p>Kick out</p>
            
            </DropdownMenuItem>
     
    </DropdownMenuContent>
</DropdownMenu>

  )
}

export default MembersHandler