"use client"


import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'

const Isadded = ({adding,serverId}:{adding:any,serverId:string}) => {
    const Router =useRouter()

    console.log(serverId,"______________________________")



    if (adding == "added" ) {
        console.log("added")
      
        toast.success(<p className='text-2xl font-semibold'> Added</p>,{className:"text-3xl"})
        
       setTimeout(() => {
        Router.push(`/server/${serverId}`)
       }, 3000)
    }
    else if (adding == "exist" ) {
        console.log("exist")
      
        toast.message(<p className='text-2xl font-semibold'> already in </p>)
        setTimeout(() => {

            Router.push(`/server/${serverId}`)
           }, 3000)
     }
     

  return <>
   <Toaster position='top-center' richColors  className='text-3xl'/>
  </>
} 

export default Isadded