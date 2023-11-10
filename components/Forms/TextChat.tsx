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
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input  } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import qs from "query-string";
import { toast } from 'sonner'

import { Badge } from "@/components/ui/badge"


import {io} from "socket.io-client"
import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { Chat } from "@/models/Servers"
import { ChannelDocument } from "@/index"
import Image from "next/image"
import { ScrollArea } from "../ui/scroll-area"


const TextChat = ({serverId,channelId,data,userId}:{serverId:string,channelId:string,data:string,userId:string}) => {
console.log(JSON.parse(data) , userId)
    const [connected , setIsconnected ] = useState(false)
    const [chat ,setChat] = useState<Chat[]>(JSON.parse(data).chat  || [])
    
    const socket  = io({path:"/api/socket/io",addTrailingSlash:false})
    socket.on(`message-server-${serverId}-channel-${channelId}`,(message)=>{
        setChat(message)
    })

    useEffect(() => {
    
    const socket = new ( io as any) (process.env.NEXT_PUBLIC_SITE_URL!,{
        path:"/api/socket/io",addTrailingSlash:false})

        socket.on("connect",()=>{
            console.log("connected!")
            setIsconnected(true)
        })

    }, [])


    const ChannelSchema = z.object({

        message:z.string().min(1,{message:"Empty"})
        .refine(e=>e.toLocaleLowerCase() !== "general",{message:"you can't create an channel with name 'General'"}),


        })
        
    const form = useForm<z.infer<typeof ChannelSchema>>({
        resolver:zodResolver(ChannelSchema),
        defaultValues:{
            message:"",
        }

    })


    async function  onSubmit(values:z.infer<typeof ChannelSchema>) {
        
        try {

            toast.loading("creating.....",{dismissible:false}) 
    
            const url  = qs.stringifyUrl({
                url: "http://localhost:3000/api/socket/messages",
                query :{
                    serverId,
                    channelId,
                    type:"text",
                    
                }
            })
            console.log(url,values)
            await axios.post(url,values)
            form.reset()

        }

        catch (error) {console.log(error)} 
    }

   



  return (
   <div className="flex-col flex  h-screen  w-full">
     <ScrollArea className="chat flex px-4 flex-col max-h-[85%] h-[85%]  gap-10 ">
    {chat && chat.map((e:any,i)=>
    <div key={i} className={`w-full gap-6 flex ${e.creator._id == userId ? "flex-row-reverse" :""}`}>
       <Image src={e.creator.imageUrl} 
       className=" w-12 h-12 rounded-full overflow-hidden "
        alt="" height={50} width={50}/>
          <p>
        {e.content.text}

    </p>
    </div>
  )}
   
     </ScrollArea>
<div className="p-4 max-h-[15%] h-[15%] ">
    <Form {...form}  >
  
    <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">



<div className="flex w-full pb-12 gap-4">
    <FormField
    control={form.control}
 
    name="message"

    render={({ field }) => (


        <FormItem className=" flex flex-col w-full items-start   ">

        

            <FormControl className="">
                <Input placeholder="message..."  className="account-form_input !shadow-none
                 !ring-0
                 !outline-none !border-none "
                 type="text" {...field}  />
            </FormControl>
            <FormMessage />
        </FormItem>


        )}
    /> 


<Button type="submit" disabled={form.formState.isSubmitting } 
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

