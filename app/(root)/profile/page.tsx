
import { ModeToggle } from '@/components/ui/themeButton'

import { Toaster } from 'sonner'

import "@uploadthing/react/styles.css";

import { getuserfromDB } from '@/lib/db-actions';
import { SignOutButton, currentUser } from '@clerk/nextjs';

import { HomeIcon, LucideLogOut } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserObject } from '@/index';
import ProfileForm from '@/components/Forms/ProfileForm';
import TooltipComp from '@/components/ui/TooltipComp';





const Page =async () => {
    const currentUs = await currentUser()
  const CurrentUserData :UserObject = await getuserfromDB(currentUs?.id ||"")


return (<>
    <div className="fixed inset-0 left-0 top-0  text-black  
    dark:text-white
    min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover bg-[url(/assets/magiclight.png)]">
 <div className=' w-[80dvw] m-auto p-4 rounded-2xl  mt-6 border-gray-400 border-2 backdrop-blur-xl '> 
 <Toaster richColors closeButton position='top-center'/>

    <div className="flex items-center  gap-6">
        
    <div className=' flexcenter  gap-4 '>
     

              <TooltipComp hoverText='Log-out'>
                  <SignOutButton>
                          <LucideLogOut className='h-8 w-8 '/>
                      </SignOutButton>
        
              </TooltipComp>
    </div>
            
  
  {CurrentUserData?.onboarded &&    <TooltipProvider>

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



<ProfileForm userData={CurrentUserData}/>

</div></div>



</>


)
   
}

export default Page