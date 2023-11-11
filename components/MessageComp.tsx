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
import { toast } from 'sonner'

import { FileText,  } from "lucide-react"

import Image from "next/image"

import { formatDate } from "@/lib/utils"

import { PopulatedChat } from "@/index"
import Link from "next/link"
import { useState } from "react"
import MessageOpts from "./Forms/MessageOpts"
import { Separator } from "./ui/separator"
import EmojiPicker from "./Forms/EmojiPicker"




const MessageComp = ({data,serverId,channelId,userId}:
    {data:PopulatedChat,serverId:string,channelId:string,userId:string}) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    console.log(data.creator._id  , userId )
    const messageSchema = z.object({

        message:z.string().min(1,{message:"can't be Empty"})


        })
    
    const messageForm = useForm<z.infer<typeof messageSchema>>({
        resolver:zodResolver(messageSchema),
        defaultValues:{
            message:data.content.text,
        }

    })



    async function  messageOnSubmit(values:z.infer<typeof messageSchema>) {
        
        try {

            toast.loading("editing.....",{dismissible:false,duration:90000}) 
    
            const url  = qs.stringifyUrl({
                url: "http://localhost:3000/api/socket/messages",
                query :{
                    serverId,
                    channelId,
                    actionType:"edit",
                    messageId: data._id
                }
            })
           
            await axios.post(url,values)
            setIsEditing(false)
          

        }

        catch (error) {console.log(error)} 
    }


  return (
    <> 
    
    <div  className={`w-full flex justify-between ${data.creator._id == userId ? "flex-row-reverse text-end" :"text-start"}`}>

        <div className={`w-full gap-6 my-5 flex ${data.creator._id == userId ? "flex-row-reverse text-end" :"text-start"}`}>
            <Image src={data.creator.imageUrl} 
            className=" w-14 h-14 rounded-full bg-cover overflow-hidden "
                alt="" height={50} width={50}/>

                <div>

                    <div className={` gap-6 flexcenter  ${data.creator._id !== userId ? "flex-row-reverse" :""}`}>
                        <span className=" text-sm text-gray-500"> {formatDate(data.createdAt.toString())}  </span>
                        <span  className=" text-white text-xl font-bold"> {data?.creator.username}</span>
                    </div>
        <div className=" mt-4">
            {data.content.file?.url && ( data.content.file.fileType =="pdf"  ? (

                                                        <Link target="_blank" href={data.content.file?.url} 
                                                    className=" flexcenter border-2 p-2 border-indigo-400 text-xl 
                                                    rounded-2xl  text-indigo-600 hover:underline  gap-2" >
                                                    File Link
                                                        <FileText className="w-6 h-6"/>
                                                    </Link>
                                                    ) :(<div className=" rounded-2xl relative overflow-hidden h-48 w-60">
                                                    <Image src={data.content.file.url} fill alt="image of a message"/>
                                                    </div>))

                                                    
                                                
                                                }

                 {isEditing ?
                (
                    <Form {...messageForm}  >
  
                    <form   className="space-y-8">
                {data.content.file?.url }
                
                
                <div className="flex pb-12 gap-4">
                <FormField
                    control={messageForm.control}
                 
                    name="message"
                
                    render={({ field }) =>{ 
                    
                        return (<>
                    
                    
                    
                        <FormItem className=" flex relative flex-col  items-start   ">
                
                            <FormControl className="flex ">
                            <div className="flex gap-4">
                              <Input defaultValue={data.content.text} className="account-form_input " type="text" {...field} />
                            <EmojiPicker  onemojichange={(e:any)=>field.onChange(`${field.value}${e}`)} />
                            </div>
                          
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                     
                    </>
                
                  
                
                
                        )}}
                    /> 
                    
                
                
                
                 
                <Button type="submit" disabled={messageForm.formState.isSubmitting } 
                
                onClick={messageForm.handleSubmit(messageOnSubmit)}
                 className={`${messageForm.formState.isSubmitting ?" bg-gray-500":"" } flexcenter gap-6`}>
                   Save
                
                     </Button>    
                  
                </div>
                
                 
                    </form>
                
                
                </Form>
                ) :(
                    <p className="  text-gray-300 mt-4">



                          {data.content.text}

                      </p>
               )
                }                                
              
        </div>
                
                </div>
            
            </div>
   {userId.toString() === data.creator._id.toString() &&   <MessageOpts setEdit={setIsEditing}  serverId={serverId} channelId={channelId} messageId={data._id.toString()}  />                                         }   

    </div>
    
     <Separator/>
    
    </>
  )
}

export default MessageComp