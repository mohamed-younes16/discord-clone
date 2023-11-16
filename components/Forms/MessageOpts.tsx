"use client"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    
  } from "@/components/ui/popover"
import { Edit, GripVertical } from 'lucide-react'
import { Button } from '../ui/button'
import qs from "query-string";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import axios from 'axios';
import { Dispatch, SetStateAction,  } from "react";
import { toast } from "sonner";






const MessageOpts = ({messageId ,channelId ,serverId,setEdit,origin}:
    {messageId:string ,channelId:string, origin:string,serverId:string,setEdit: Dispatch<SetStateAction<boolean>>}) => {
     
  return (
    <Popover  >
    <PopoverTrigger >
    <div className="w-10 h-10 rounded-full hover:bg-gray-300
                cursor-pointer transition-all flexcenter !bg-opacity-20">
            <GripVertical size={20} strokeWidth={3} />
            </div>
    </PopoverTrigger>
    <PopoverContent className=' !w-fit' side='left'>

                        <Dialog  >
                    <DialogTrigger className=" w-full">
                        <Button variant={ "destructive"} className=" w-full"> 
                                Delete 
                            </Button>
                    </DialogTrigger>
                    <DialogContent >
                        <DialogHeader>
                        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                        <DialogDescription>
                          <DialogClose >
                                <div className="flex mt-6 justify-start">
                                 <Button variant={ "destructive"}
                                 onClick={async ()=>{
                                  toast.loading("deleteing...",{duration:90000})
                                  const url  = qs.stringifyUrl({
                                    url: `${origin}/api/socket/messages`,
                                    query :{
                                        serverId,
                                        channelId,
                                        messageId,
                                        actionType:"delete",
                                    }
                                })
                               
                                await axios.post(url,{
                                 messageId
                                })

                             
                                
                                 }}
                                 > 
                                Delete  Message

                            </Button>
                            </div>
                       
                          </DialogClose>
                        
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                    </Dialog>

                    <div className=" flex flex-nowrap items-center 
                     p-2 hover:bg-white rounded-md transition-all !bg-opacity-20 mt-4">
                      <button  onClick={()=>setEdit(true)} className=" flex gap-6 ">
                        Edit  <Edit/>
                      </button>
                     
                    </div>

                        
    </PopoverContent>
  </Popover>
  )
}

export default MessageOpts