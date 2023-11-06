"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

import * as z from "zod"

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

import { Toaster, toast } from 'sonner'

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
import { GitBranch,  } from "lucide-react"

import { Separator } from "../ui/separator"
import { addChannelToServer } from "@/lib/db-actions"





const ChannelForm = ({serverId}:{serverId:string}) => {


     const ChannelSchema = z.object({
  
        name:z.string().min(4,{message:"must be at least 4 characters long"})
        .refine(e=>e.toLocaleLowerCase() !== "general",{message:"you can't create an channel with name 'General'"}),
        type:z.enum(["text","audio","video"])

        })
        
        

    const form = useForm<z.infer<typeof ChannelSchema>>({
        resolver:zodResolver(ChannelSchema),
        defaultValues:{

            name:"",
            type:"text"
        }

    })


    async function  onSubmit(values:z.infer<typeof ChannelSchema>) {
            console.log(values)
        try {

            toast.loading("creating.....",{dismissible:false}) 
    
       const uploadServer =  await addChannelToServer(serverId||"",values.name,values.type)  || { valid: false, message:"check your connection" }
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
   
    <Dialog > 


    <DialogTrigger className="w-full" asChild>
      <div className=" p-1 my-2 !bg-opacity-25 transition-all 
      rounded-md dark:hover:bg-white flex items-center justify-between">
          Create Channel <GitBranch />


          </div> 
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
        <Toaster richColors position="top-center"/>

      <DialogHeader>

        <DialogTitle>
            <h1 className=" text-2xl font-bold "> Create Channel</h1>
            </DialogTitle>

        <DialogDescription>

            <Form {...form}  >
  
    <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">




<FormField
    control={form.control}

    name="name"

    render={({ field }) => (


        <FormItem className=" flex flex-col items-start   ">

            <FormLabel >
            Channel Name
            </FormLabel>

            <FormControl className="">
                <Input className="account-form_input " type="text" {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>


        )}
    /> 


<Separator />
<FormField
    control={form.control}

    name="type"

    render={({ field }) => (


        <FormItem className=" flex flex-col   ">

                <Select onValueChange={e=>field.onChange(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Channel Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                </SelectContent>
                </Select>
        </FormItem>


        )}
    /> 





<Button type="submit" disabled={form.formState.isSubmitting } 
 className={`${form.formState.isSubmitting ?" animate-bounce bg-gray-500":"" } flexcenter gap-6`}>
    create
  {  form.formState.isSubmitting  && 
    <div className="w-8 h-8 border-4 border-white
     dark:border-black !border-t-transparent rounded-full animate-spin"/>
     }
     </Button>  
    </form>


</Form>

          
                   
        </DialogDescription>

      </DialogHeader>



      
    </DialogContent>
  </Dialog>




  )
}

export default ChannelForm