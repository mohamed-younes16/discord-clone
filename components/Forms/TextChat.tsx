/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"



import * as z from "zod"
import axios from "axios"
import {
    Form,
    FormControl,
    FormField,
    FormItem,

    FormMessage,
} from "@/components/ui/form"

import { Input  } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import qs from "query-string";
import { Toaster, toast } from 'sonner'

import { Badge } from "@/components/ui/badge"


import {io} from "socket.io-client"
import { useEffect, useRef, useState } from "react"
import {  Send } from "lucide-react"


import { ScrollArea } from "../ui/scroll-area"
import EmojiPicker from "./EmojiPicker"

import UploadFileChat from "./UploadFileChat"
import TooltipComp from "../ui/TooltipComp"
import { PopulatedChat } from "@/index"

import MessageComp from "../MessageComp"
import { getChat } from "@/lib/db-actions"
import { useRouter } from "next/navigation"



const TextChat = ({serverId,channelId,data,userId}:
    {serverId:string,channelId:string,data:PopulatedChat[],userId:string}) => {

    const [connected , setIsconnected ] = useState(false)
    const [chat ,setChat] = useState<PopulatedChat[]>(data || [])
    const [origin , setorigin] = useState<string>("")   
    const bottomRef = useRef<HTMLDivElement>(null);
    const router = useRouter()
    const [socket,setSocket] = useState<any>(null)
    toast.dismiss()



   useEffect(() => {

            setSocket( new ( io as any) (process.env.NEXT_PUBLIC_SITE_URL!,{
                    path:"/api/socket/io",addTrailingSlash:false})
            )
    

        toast.dismiss()
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [chat]);




    
    useEffect(() => {

        toast.dismiss()

        setorigin(window.location  && window.location.origin)
        
        const socket = new ( io as any) (process.env.NEXT_PUBLIC_SITE_URL!,{

            path:"/api/socket/io",addTrailingSlash:false})

            socket.on("connect",()=>{
                setIsconnected(true)
            });

            
        return () => {
                socket.disconnect();
        };

    }, [])



 
        socket &&  socket.on(`message-server-${serverId}-channel-${channelId}`,(message:PopulatedChat[])=>{
                    toast.dismiss()
                          console.log(message)
                    setChat(message)
                    console.log(message)
              
                });



 
 
    const ChannelSchema = z.object({

        message:z.string().min(1,{message:"Empty"})
        .refine(e=>e.toLocaleLowerCase() !== "general",{message:"you can't create an channel with name 'General'"}),
        fileUrl:z.string(),
        fileType:z.enum(["pdf","image"])

        })

  
        
    const form = useForm<z.infer<typeof ChannelSchema>>({
        resolver:zodResolver(ChannelSchema),
        defaultValues:{
            message:"",
            fileUrl:"",
            fileType:"pdf"

        }
    })



    async function  onSubmit(values:z.infer<typeof ChannelSchema>) {
        
        try {
            
            toast.loading("sending.....",{dismissible:false,duration:90000}) 
            
            const url  = qs.stringifyUrl({
                url:`${origin}/api/socket/messages`,
                query :{
                    serverId,
                    channelId,
                    type:"text",
                    actionType:"create",
                }
            })
           
            await axios.post(url,values)
            toast.dismiss()
            form.reset()
        
        }

        catch (error) {console.log(error)} 
    }

 


  return (
   <div className="flex-col flex  h-screen  w-full">
    <Toaster/>
     <ScrollArea className="chat flex px-4 flex-col max-h-[85%] h-[85%]  gap-10 ">
    {chat && chat.map((e,i)=>
   <MessageComp channelId={channelId} userId={userId} serverId={serverId} data={e} key={i}  />
   

  )}
    <div ref={bottomRef} />
     </ScrollArea>
<div className="p-4 max-h-[15%] h-[15%] ">
    <Form {...form}  >
  
    <form   className="space-y-8">



<div className="flex pb-12 gap-4">
<FormField
    control={form.control}
 
    name="fileUrl"

    render={({ field }) => (<>
    
    
    
        <FormItem className=" flex relative flex-col  items-start   ">

            {field.value &&<TooltipComp hoverText="one file added ">
        <p className=" bg-red-700 absolute w-6 flexcenter z-40 h-6 
            rounded-full -top-1 -right-1 text-base"> 1
                </p>
</TooltipComp>}

         <UploadFileChat setFileType={(type:"pdf"|"image")=>form.setValue("fileType",type)} SetfieldValue={(url:string)=> field.onChange(url)} />

            <FormControl className="">
         

            </FormControl>
            <FormMessage />
        </FormItem>
     
    </>

  


        )}
    /> 
    



    <FormField
    control={form.control}
 
    name="message"

    render={({ field }) => (<>
    
    
    
        <FormItem className=" flex flex-col w-full items-start   ">

        

            <FormControl className="">
                <Input placeholder="message..."  className="account-form_input !shadow-none
                 !ring-0
                 !outline-none !border-none "
                 type="text" {...field}  />

            </FormControl>
            <FormMessage />
        </FormItem>
        <EmojiPicker  onemojichange={(e:any)=>field.onChange(`${field.value}${e}`)} />
    </>

  


        )}
    /> 



<Button type="submit" disabled={form.formState.isSubmitting } 

onClick={form.handleSubmit(onSubmit)}
 className={`${form.formState.isSubmitting ?" bg-gray-500":"" } flexcenter gap-6`}>
   <Send />

     </Button>    
  
</div>

 
    </form>


</Form>
<div>
{connected ? (<Badge variant='outline'  className="  text-green-600 border-green-600"> connected  </Badge> ):
(<Badge  variant='outline'   className=" text-red-600 border-red-600"> wait for connection  </Badge> )

} 
</div>
</div>
   </div>
  

  
   



          


  )
}

export default TextChat

