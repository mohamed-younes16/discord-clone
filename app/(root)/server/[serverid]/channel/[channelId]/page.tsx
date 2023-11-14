import { findServer, findServerBelongByID,
    findServersBelong,
    getCurrentProfile, isServerAdmin } from '@/lib/db-actions'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, Hash, Lock, Mic, MonitorX, PlusIcon,
    ServerCrashIcon, Settings, UserPlus, Video,  } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import ManageServers from '@/components/CreateServer'
import DeleteLeaveServerButton from '@/components/Forms/DeleteServerButton'
import { InviteButton } from '@/components/InviteButton'
import { redirect } from 'next/navigation'
import { UserObject } from '@/index'
import ManageUsers from '@/components/ManageUsers'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import ChannelForm from '@/components/Forms/CreateChannel'
import dynamic from 'next/dynamic'
import ChannelHandler from '@/components/Forms/ChannelHandler'
import { ScrollArea } from "@/components/ui/scroll-area"
import SideBarNav from '@/components/SideBarNav'
import LiveVidAud from '@/components/LiveVidAud'

const  TextChat  = dynamic (()=>import ( '@/components/Forms/TextChat') , {ssr:false,}) 



const page = async  ({params:{serverid,channelId,}}:{params:{serverid:string,channelId:string}}) => {

    
const currentServer = await  findServer(serverid)
const belongToServer = await findServerBelongByID(serverid)
const allservers  = await findServersBelong()
const currentChannel = currentServer?.channels.find(e => e.name === channelId) 
  
const isAdmin = await  isServerAdmin(serverid)

const Userdata:UserObject = await getCurrentProfile()





if (!Userdata?.onboarded ) redirect("/profile")

    return (
    
    <div className=''>
        <SideBarNav serverid={serverid} isAdmin={JSON.parse( JSON.stringify(isAdmin))}
         channelId={channelId} allservers={JSON.parse( JSON.stringify( allservers))} currentServer={JSON.parse( JSON.stringify(currentServer))} />
    
    
    {belongToServer && currentChannel ? (
    
    
    <div className="pl-[90px]  flex  w-full h-full">

        
        
        <div className=" w-full h-screen  backdrop-blur-sm "> 

    
    {currentServer &&   

    currentChannel.type == "text" ? (  <TextChat
        data={JSON.stringify(currentServer?.
        channels.filter(e=>e.name==channelId)[0])}
        userId={Userdata._id.toString()} 
        channelId={channelId} serverId={serverid} />) :
        currentChannel.type == "video" ?
        (

            <LiveVidAud audio={false} video={true} user={JSON.parse(JSON.stringify (Userdata))} chatId = {currentChannel._id.toString()} />
        ) :(
            <LiveVidAud audio={true} video={false} user={JSON.parse(JSON.stringify (Userdata))} chatId = {currentChannel._id.toString()} />


        )
  }    


        </div>



        </div>):
        ( <>
        <div className="flexcenter backdrop-blur-md  bg-black 
        !bg-opacity-75 flex-col gap-6  w-full h-screen">
    
    { currentServer &&
        <Image height={60} width={60}
                    className="!h-20 !w-20  border border-white rounded-full bg-cover "
                    alt="image of user" src={currentServer?.imageUrl || ""} />}

        {  !belongToServer && currentServer && currentChannel ? 
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