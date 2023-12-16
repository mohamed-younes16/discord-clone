"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeMemberType, deleteUserFromMembers } from "@/lib/db-actions";

import { Check, GripVertical, Loader2, ShieldAlert, UserX } from "lucide-react";
import { useRouter } from "next/navigation";

import { Member } from "..";
import { useState } from "react";


const MembersHandler = ({
   member,
  serverId,userId,isAdmin
}: {
  member: Member;
  serverId: string;
  userId:string;
  isAdmin:boolean
}) => {

  const router = useRouter();
const [Handling ,setIsHandling] = useState<boolean>(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className="w-10 h-10 rounded-full hover:bg-gray-300
                cursor-pointer transition-all flexcenter !bg-opacity-20"
        >
      { !Handling ? ( <GripVertical size={20} strokeWidth={3} />):<Loader2 className="animate-spin"/>  }
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <div className="flex justify-start gap-2">
              <ShieldAlert />
              Role
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
            onClick={async() =>{
              setIsHandling(true)
              if ( member.userType === "member") 
              {
              await  changeMemberType(member.id,"moderator",serverId,isAdmin,userId)
              setIsHandling(false)
              router.refresh()
              }

              }}
              className=" flex justify-between  "
            >
              <p>Moderator</p>

              {member.userType === "moderator" && <Check />}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async() =>{
                setIsHandling(true)
             if ( member.userType === "moderator") 
             {
            await  changeMemberType(member.id,"member",serverId,isAdmin,userId)
            setIsHandling(false)
              router.refresh()
              }
                  
              }}
              className=" flex justify-between  "
            >
              <p>member</p>

              {member.userType == "member" && <Check />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>{
             deleteUserFromMembers(member.id,serverId ,userId,isAdmin,)
            router.refresh()
            }}
          className=" flex justify-between  "
        >
          <UserX size={20} color="red" />

          <p>Kick out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default MembersHandler;
