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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"


import { Button } from '@/components/ui/button'

import Image from 'next/image'
import { UploadDropzone, } from '@/utils/uploadthing'
import { toast } from 'sonner'

import "@uploadthing/react/styles.css";
import { FileText, PlusIcon, XCircle } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog"
import { useEffect, useState } from "react"
import Link from "next/link"


const UploadFileChat = ({SetfieldValue,setFileType}:{SetfieldValue:(v:any)=>void,setFileType:(v:any)=>void}) => {
    const [endPoint , setEndPoint] = useState<"messageFile" | "imageUploader">("messageFile")
    const  fileUploadSchema = z.object({
  
        fileUrl:z.string(),
        fileType: z.enum(["pdf","image"])
       

        })
    const form = useForm<z.infer<typeof fileUploadSchema>>({
        resolver:zodResolver(fileUploadSchema),
        defaultValues:{
            fileUrl:  "",
            fileType:"pdf"

        }
    })


    async function  onSubmit(values:z.infer<typeof fileUploadSchema>) {
        try {

            SetfieldValue(values.fileUrl)
        }

        catch (error) {console.log(error)} 
    }



  return (
    <Dialog>
        <DialogTrigger>
        <div className="bg-stone-800  relative rounded-full transition-all p-2 hover:bg-stone-500">
                <PlusIcon className=' h-8 w-8  transition-all text-emerald-500 hover:text-emerald-300'/>
              </div>
        </DialogTrigger>
        <DialogContent>
                                <Form {...form}  >
            
                <form  onSubmit={form.handleSubmit(onSubmit)}  className="space-y-8">

               
                
                <FormField
                control={form.control}

                name="fileUrl"

                render={({ field }) => (


                    <FormItem className=" flex justify-center  gap-10 flex-wrap  ">
                        { !field?.value &&     <UploadDropzone   

                            endpoint={endPoint}

                            appearance={{container:` max-md:!px-2 max-md:!py-6 transition-all hover:scale-105 dark:border-black
                                bg-white cursor-pointer dark:bg-neutral-300 `,label:`text-xl `}}

                            onClientUploadComplete={(e)=>{
                                SetfieldValue(e?.[0].url)
                                
                                field.onChange(e?.[0].url)}}
                        />
            }
                   {   form.getValues().fileType === "image" ? (

                                                    
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
                                                        
                                                            {
                                
                                    field?.value ? (
                                    <Image src={field.value} className='rounded-full object-cover' alt="image of you" fill />
                                    ) : (
                                    <Image src="/assets/profile.svg" className="object-contain rounded-full" alt="image" height={70} width={70} />
                                    )
                                
                                }

                                                        
                                                        </FormLabel>

                   ):(
                    <FormLabel>
                                    <FormLabel className=" relative 
                                                        flex justify-center items-center m-0 
                                                         rounded-full flexcenter ">
                                                            {field?.value &&  <button 
                                                            onClick={()=>{
                                                                field.onChange("")
                                                            }}
                                                            className="absolute z-30 rounded-full text-white -top-3 -right-3  bg-red-600 p-1">
                                                            <XCircle />
                                                            </button>} 
                                                        
                                       {field?.value && ( 
                                            <Link target="_blank" href={field.value} 
                                            className=" flexcenter border-4 p-3 border-indigo-400 text-2xl h-28 rounded-2xl  text-indigo-600 hover:underline  gap-6" >
                                            File Link
                                                <FileText size={20}/>
                                            </Link> 
                                        
                                    ) 
                                
                                }










                                                        
                                                        </FormLabel>

                    </FormLabel>
                   )
                   
                   
                   
                   }
                        <FormMessage/>
                    </FormItem>


                    )}
                />

   
<FormField
                control={form.control}

                name="fileType"

                render={({ field }) => (


                    <FormItem className=" flex justify-center  gap-10 flex-wrap  ">
                    
                    
                        <FormLabel className=" mr-8 relative 
                       
                       flexcenter ">

                    <Select onValueChange={(e:string)=>{
                        e == "pdf" ? setEndPoint("messageFile") :setEndPoint("imageUploader")
                        
                        field.onChange(e)
                        setFileType(e)
                        }}>

                        <SelectTrigger className="w-[180px]">

                            <SelectValue placeholder="File Type" />

                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="pdf">PDF</SelectItem>

                            <SelectItem value="image">Image</SelectItem>
                        
                        </SelectContent>

                    </Select>

                        </FormLabel>

                        <FormMessage/>
                    </FormItem>


                    )}
                />

            
          





    {form.getValues("fileUrl") && <Button  disabled={form.formState.isSubmitting }
    
    onClick={()=>{
        form.reset()
        SetfieldValue("")}} variant={"destructive"}

            className={` flexcenter gap-6`}>
            Remove

                </Button>  }
           



    
                </form>


            </Form>
        </DialogContent>

    </Dialog>
   





  )
}

export default UploadFileChat







