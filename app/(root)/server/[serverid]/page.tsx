

import { findServer, findServerBelongByID, getuserfromDB, isServerAdmin } from '@/lib/db-actions'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { ChevronDown, MonitorX, ServerCrashIcon, ServerOff, Settings, UserPlus,  } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import ManageServers from '@/components/CreateServer'

import DeleteLeaveServerButton from '@/components/Forms/DeleteServerButton'
import { InviteButton } from '@/components/InviteButton'

import { redirect } from 'next/navigation'
import { UserObject } from '@/index'
import { currentUser } from '@clerk/nextjs'
import ManageUsers from '@/components/ManageUsers'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import ChannelForm from '@/components/Forms/CreateChannel'


const page = async  ({params:{serverid}}:{params:{serverid:string}}) => {

const currentServer  = await  findServer(serverid)
const belongToServer = await findServerBelongByID(serverid)

const isAdmin = await  isServerAdmin(serverid)
const user = await currentUser()
const Userdata:UserObject = await getuserfromDB(user?.id || "")

if (!Userdata?.onboarded ) redirect("/profile")


  return (
     
    <div className=' min-h-screen dark:bg-[url(/assets/magicdark.png)] 
     bg-cover bg-[url(/assets/magiclight.png)]'>

    
    
      {belongToServer ? (<div className="pl-[90px]  w-full h-full">
          <div  suppressHydrationWarning className="w-48   bg-gray-400 dark:bg-[#26282c] h-screen">

      
                <Popover>

                    <PopoverTrigger className='w-full'>

                    <div role='button' className=" px-4 w-full text-start flex justify-between 
                    text-xl font-semibold items-center py-2 bg-gray-500
                     dark:bg-[#202226] text-gray-800 dark:text-gray-200">
                        {currentServer?.name}

                                <ChevronDown/>
                      </div>

                    </PopoverTrigger>

                    <PopoverContent className='w-48 cursor-pointer '>
                          <p className=' p-1   dark:text-indigo-400 flex justify-between
                           items-center  hover:bg-white  rounded-md transition-all !bg-opacity-20'>
                        Share Server
                        <UserPlus />
                        
                    </p>
                            <div className='my-2' />
                   
                        <InviteButton serverInvitaion={currentServer?.invitationLink || ""}/>
                      

                    
                        {isAdmin ?( <>
                            
                        <Separator className='my-2' />


                       
                       <ManageUsers  serverid={serverid} />
                 
                       <ManageServers

                                          icon={<p className=' flex justify-between items-center  p-1 hover:bg-white rounded-md transition-all !bg-opacity-20'>
                                            Edit Server
                                            <Settings />
                                            
                                            </p>} 
                                            text="Edit Server"

                                            data = {{imageUrl:currentServer?.imageUrl,name:currentServer?.name}}

                                            submitText="Update"
                                            actionType="update"
                                            serverId={serverid}
                                            />
                                              <div className="my-2"/>
                                              <DeleteLeaveServerButton actionType='delete' serverid={serverid}  />
                                              <div className="my-2"></div>
                                              <ChannelForm serverId={serverid} />
                            </>) : (
                                <>
                                  <Separator className='my-2' />

                            <DeleteLeaveServerButton actionType='leave'  serverid={serverid}  />

                                </>

                            ) }
                                            
                    
                        
                  
                    </PopoverContent>

                </Popover>

<Separator className=' mb-3'/>


          </div>


        </div>):
        ( <>
        <div className="flexcenter backdrop-blur-sm bg-black !bg-opacity-60 flex-col gap-6  w-full h-screen">
    
     { currentServer &&
        <Image height={60} width={60}
                    className="!h-20 !w-20  border border-white rounded-full bg-cover "
                    alt="image of user" src={currentServer?.imageUrl || ""} />}

        { !belongToServer && currentServer ? 
        (<><MonitorX size={120}/>
        <p className=' text-2xl font-bold text-center max-md:text-lg'>You are not invited to The server </p>
        
        </>) 
          :
          (<><ServerCrashIcon  size={150} strokeWidth={1} />
            <p className=' text-2xl font-bold'>Server Not Found </p>
            

          </>)
       }
        


          <div className="flexcenter gap-6">
            <Button >
               <Link href={"/"}> return to main page</Link>
            </Button>
          </div>
        </div>

        </>)
        }
        

    </div>
  )
}

export default page