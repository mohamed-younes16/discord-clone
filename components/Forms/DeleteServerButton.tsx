"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { LogOutIcon, Trash2Icon } from 'lucide-react'
import { deleteServer } from '@/lib/db-actions'
const DeleteLeaveServerButton = ({serverid , actionType}:{serverid:string,actionType:"leave" | "delete"}) => {

    const deleteServ = async  ()=> {
           

       if (actionType == "delete"){ await deleteServer(serverid)}

    }
    
  return (
    
            
            <Dialog >

<DialogTrigger className='w-full'>  <p className=' p-1  text-red-600 flex justify-between items-center 
hover:bg-white  rounded-md transition-all !bg-opacity-20'>
    {actionType} Server
    <Trash2Icon className='' />
    </p>
    
    </DialogTrigger>
<DialogContent>
    <DialogHeader>
    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
    <DialogDescription>
      <Button 
      onClick={()=> deleteServ()}
      
      className=" mt-4 flex gap-4 "  variant={"destructive"}>
                 {actionType}  {actionType == "delete" ?  <Trash2Icon /> : <LogOutIcon/>} 
      </Button>
    </DialogDescription>
    </DialogHeader>
</DialogContent>
</Dialog>
    
  )
}

export default DeleteLeaveServerButton