"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"


import { ServerSchema } from "@/models/Schemas/ServerSetup"

import * as z from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input,  } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

import Image from 'next/image'
import { UploadDropzone, } from '@/utils/uploadthing'
import { toast } from 'sonner'

import "@uploadthing/react/styles.css";

import { addUpdateServer} from '@/lib/db-actions'



import { XCircle } from "lucide-react"


const ServerForm = ({data,submitText,actionType,serverId}:{serverId?:string,data?:any,submitText?:string,actionType:"create"|"update"}) => {



    const form = useForm<z.infer<typeof ServerSchema>>({
        resolver:zodResolver(ServerSchema),
        defaultValues:{

            imageUrl: data?.imageUrl || "",
            name: data?.name ||"",
        
        }

    })


    async function  onSubmit(values:any) {
        try {
            toast.loading("creating.....",{dismissible:false}) 
    
       const uploadServer =  await addUpdateServer(values,actionType,serverId)  || { valid: false, message:"check your connection" }
            toast.dismiss()
          if ( uploadServer?.valid)  {
                    toast.success(uploadServer?.message,{duration:3000}) 
        setTimeout(() => {

            window.location.reload()
        }, 500);
        
            }
           
            else {
                 toast.error(uploadServer?.message,{duration:3000})
            }
              

        }

        catch (error) {console.log(error)} 
    }

   

  return (
   
<Form {...form}  >
  
    <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


    
    <FormField
    control={form.control}

    name="imageUrl"

    render={({ field }) => (


        <FormItem className=" flex justify-center  gap-10 flex-wrap  ">
            { !field?.value &&     <UploadDropzone   

                endpoint="imageUploader"

                appearance={{container:` max-md:!px-2 max-md:!py-6 transition-all hover:scale-105 dark:border-black
                     bg-white cursor-pointer dark:bg-neutral-300 `,label:`text-xl `}}

                onClientUploadComplete={(e)=>field.onChange(e?.[0].url)}
            />
}
         
            <FormLabel className=" mr-8 relative 
             w-[100px] p-2  flex justify-center items-center m-0 !h-[100px] 
            bg-gray-900 rounded-full flexcenter ">
                {field?.value &&  <button 
                onClick={()=>{
                    field.onChange("")
                }}
                 className="absolute z-30 rounded-full text-white top-0 right-0  bg-red-600 p-1">
                <XCircle />
                </button>} 
               

                {field?.value ? ( 

                <Image src={field.value}  className= ' rounded-full object-cover'
                alt="image of you" fill />)

                :(<Image src="/assets/profile.svg"
                    className=" object-contain rounded-full" alt="image" height={70} width={70}/>)
            
            }
            </FormLabel>

            <FormMessage/>
        </FormItem>


        )}
    />





<FormField
    control={form.control}

    name="name"

    render={({ field }) => (


        <FormItem className=" flex flex-col   ">

            <FormLabel >
            Server Name
            </FormLabel>

            <FormControl className="">
                <Input className="account-form_input " type="text" {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>


        )}
    /> 





<Button type="submit" disabled={form.formState.isSubmitting } 
 className={`${form.formState.isSubmitting ?" animate-bounce bg-gray-500":"" } flexcenter gap-6`}>
    {submitText || "Submit"}
  {  form.formState.isSubmitting  && 
    <div className="w-8 h-8 border-4 border-white
     dark:border-black !border-t-transparent rounded-full animate-spin"/>
     }
     </Button>  
    </form>


</Form>




  )
}

export default ServerForm