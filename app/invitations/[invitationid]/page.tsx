import Isadded from '@/components/Isadded'
import { addingMember } from '@/lib/db-actions'
import { Toaster, toast } from 'sonner'


const page =async  ({params:{invitationid}}:{params:{invitationid:string}}) => {

    const adding = await addingMember(invitationid)

        console.log(adding)
  return   (   <div className=' z-[1000]   
  bg-cover
 w-screen h-screen fixed inset-0 flex flex-col bg-black gap-4 justify-center items-center'>
 <Toaster position='top-center' richColors  className='text-3xl'/>
 {adding &&  <Isadded adding={adding?.message} serverId={adding?.serverId} />}

     <div className="font-bold dark:text-white
      mb-9 animate-pulse text-black text-3xl">Redirecting you to the server  </div>



 </div>)
}

export default page