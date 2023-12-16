
import { Toaster } from 'sonner'

import "@uploadthing/react/styles.css";

import { getCurrentUser  } from '@/lib/db-actions';
import { SignOutButton, currentUser,  } from '@clerk/nextjs';

import { HomeIcon, LucideLogOut } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import ProfileForm from '@/components/Forms/ProfileForm';
import TooltipComp from '@/components/ui/TooltipComp';
import { User } from '@/index';







const Page =async () => {
  const clerkUser= await currentUser()
  const CurrentUserData:User =await getCurrentUser (clerkUser?.id ||"")

return (<>
    <div className="fixed inset-0  flexcenter left-0 top-0  text-black  
    dark:text-white
    min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover bg-[url(/assets/magiclight.png)]">
 <div className=' w-[80dvw]  p-4 rounded-2xl  mt-6 border-neutral-600 border backdrop-blur-md '> 
 <Toaster richColors closeButton position='top-center'/>

    <div className="flex items-center  gap-6">
        
    <div className=' flexcenter  gap-4 '>
     

              <TooltipComp hoverText='Log-out'>
                  <SignOutButton>
                          <LucideLogOut className='h-8 w-8 '/>
                      </SignOutButton>
        
              </TooltipComp>
    </div>
            
  
  { clerkUser &&    <TooltipProvider>

    <Tooltip delayDuration={200}>
    <TooltipTrigger>

            <Link href={"/"} aria-label="redirect to profile page " >
                <HomeIcon className='h-10 w-10 '/>
            </Link>

    </TooltipTrigger>
    <TooltipContent>
        <p>Main Page</p>
    </TooltipContent>
    </Tooltip>

    </TooltipProvider>}
 

    </div>



<ProfileForm userData={JSON.parse(JSON.stringify(CurrentUserData)) ||null }/>

</div></div>



</>


)
   
}

export default Page