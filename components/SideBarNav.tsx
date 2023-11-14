"use client"
import { ModeToggle } from './ui/themeButton';
import { ChevronDown, Hash, Lock, Mic, PlusIcon, Settings, UserCircle2, UserPlus, Video } from "lucide-react";
import Link from "next/link";
import TooltipComp from './ui/TooltipComp';
import { Separator } from './ui/separator';

import { ScrollArea } from './ui/scroll-area';
import ServerLinks from './ServersLinks';
import ManageServers from './CreateServer';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InviteButton } from './InviteButton';
import DeleteLeaveServerButton from './Forms/DeleteServerButton';
import ChannelForm from './Forms/CreateChannel';
import ChannelHandler from './Forms/ChannelHandler';
import { ServerDocument } from '@/models/Servers';
import ManageUsers from './ManageUsers';





const SideBarNav = ({allservers,serverid,currentServer,channelId,isAdmin}:{allservers?:any,serverid?:string,currentServer?:ServerDocument | undefined, channelId?:string,isAdmin:any }) => {
  const channlesType = currentServer && [ ...new Set( currentServer?.channels.map((e:any)=>e.type))]
  const [open , setopen] = useState(false)
  const [visible , setvisible] = useState(true)


  const isPcUser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    const pcKeywords = ['windows', 'macintosh', 'linux'];
        for (const keyword of pcKeywords) {
            if(userAgent.toLowerCase().includes("android") || userAgent.toLowerCase().includes("iphone")) {
                return false;
            }
        else if (userAgent.toLowerCase().includes(keyword)) {
            
            return true;
        }
        }
    
      
    };


    useEffect(() => {
    function trackMousePosition(event: { clientX: number; }) {
        if (isPcUser() ) {
                ((event.clientX / window.innerWidth ) * 100) < 10   ? setvisible(true) :setvisible(false);
        }
        else if (window.innerWidth <= 800){
            setvisible(true)
        }
    
    }

    document.addEventListener('pointermove', trackMousePosition)
    
    return () => document.removeEventListener('pointermove', trackMousePosition);
        

    }, [])
    

  return (

    <div suppressHydrationWarning className={`fixed duration-700 top-0 transition-all 
    max-w-fit z-50   flexcenter left-0 h-screen  
    w-fit 
    bg-gray-400 dark:bg-[#0f0f0f] shadow-xl shadow-black    
     flex flex-col 
max-h-[calc(100dvh-100px)]  min-h-full justify-between 
${open ? "translate-x-0" : "-translate-x-full"}

`}>
  
        
        <button className={`absolute  z-[888] cursor-pointer
            ${ open ? " hover:shadow-red-400":" hover:shadow-emerald-400"}
            bottom-[120px]  shadow-lg  !rounded-full right-0 
            ${visible || open 
              ? "translate-x-full "
              :""}
              
            bg-[#040209] p-1 delay-100  transition-all`}
            onClick={()=> setopen(s=>!s)}>
                <Image src="/assets/right-arrow.svg" height={60} width={60} 
                alt="toggle menu " style={{transitionDuration:"700ms"}}  className={`transition-all   animate-[pulse_3s_infinite_ease-out] ${open ?"rotate-180":""}`} />
            </button>

            {/* <button onClick={()=>setopen(false)} className="ml-2 rounded-full text-white p-2  top-4 right-4
            absolute hover:shadow-[red]   shadow-md transition-all ">
                <Image alt="close" src="/assets/close.svg" height={40} width={40}/>
            </button> */}
            <div className="flex h-full">
                    <div className="flex h-full p-2 flex-col  w-[90px]   justify-between">

                  <div className='flexcenter flex-col'>
                    <TooltipComp hoverText='Create Server'>
                      <ManageServers actionType='create' submitText='create' />
                    </TooltipComp>
                    <Separator  className='my-4'/>
                    <ScrollArea>
                      <ServerLinks data={allservers}/>
                    </ScrollArea>

                  </div>
                

                    <div className='flexcenter flex-col  gap-6'>  
                    <TooltipComp hoverText='change theme'>
                      <ModeToggle/>
                    </TooltipComp>
                      
                      <TooltipComp hoverText='Profile Page'>
                          <Link href={"/profile"} aria-label="redirect to profile page " >
                                  <UserCircle2 className='h-10 w-10 '/>
                              </Link>
                
                      </TooltipComp>

                  </div>

              </div>  

              {currentServer &&<div  suppressHydrationWarning className="w-60  bg-gray-400 
                dark:bg-[#191919fc] h-screen">

            
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
                                                    <ChannelForm actionType='create' serverId={serverid} />
                                    </>) : (
                                        <>
                                        <Separator className='my-2' />

                                    <DeleteLeaveServerButton actionType='leave'  serverid={serverid}  />

                                        </>

                                    ) }
                                                    
                            
                                
                        
                            </PopoverContent>

                        </Popover>
                        <ScrollArea className="flex flex-col">

                        {channlesType?.map((e:string)=>(<>

                        <div className="flex items-center px-3 w-full justify-between">
                            <p className=' w-full'>
                            {e} Channels
                            </p>
                            {isAdmin && <ChannelForm actionType='create'  icon={<PlusIcon/>} serverId={serverid} /> }
                        </div>

                            {   currentServer?.channels.map ((el)=> {

                            return (el.type == e )&&  
                            (  <div className={`flex justify-between
                            transition-all px-4 dark:hover:!text-white
                            ${channelId == el.name ? "bg-gray-900 dark:bg-gray-400":""}
                            items-center dark:hover:bg-gray-400
                            hover:!bg-opacity-20`}>
                                <Link href={`/server/${serverid}/channel/${el.name}`}
                                className=" w-full  py-2 ">
                                <div className="flex
                                    text-gray-500 text-base
                                    gap-4">

                            {    e== "text" 
                            ? ( <Hash size={20} />)
                            : e == "audio" ? 
                            (<Mic size={20}/>)
                            :e=="video" 
                            ? (<Video size={20} />) :""

                            }
                                <p>{el.name}</p>
                
                                </div>

                                
                                </Link>
                                {el.name !== "general" 
                                
                                ? (                        <ChannelHandler channel={JSON.stringify(el) }  serverId={serverid} />
        )
                                :(<Lock />)}
                            </div>
                            
                                )
                                


                            } )}
                        </>




                        ) )}
                
                        </ScrollArea>

                </div>}
              
            </div>

     

    </div>
  )
}

export default SideBarNav












// "use client"
// import { Swiper, SwiperSlide } from 'swiper/react';

// import { ModeToggle } from "./ToggleThemeButton"

// import { Navigation, Pagination, EffectCoverflow,Scrollbar} from 'swiper/modules';


// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import "swiper/css/scrollbar"
// import Image from 'next/image';
// import { BeanIcon, ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';



// const SideBarNav = () => {
//   return (
//     <div className=' fixed top-0  left-0 h-screen w-[900px] bg-slate-600'>
//         <ModeToggle/>
//         <Swiper 
//           effect={'coverflow'}
//           grabCursor={true}
//           centeredSlides={true}
//           loop={true}
//           slidesPerView={'auto'}
//           coverflowEffect={{
//             rotate: 50,
//             stretch: 0,
//             depth: 100,
//             modifier: 1,slideShadows:true
//           }}
//       scrollbar={{draggable:true,
//         }}
//     speed={1000}
//     pagination={{ el: '.swiper-pagination', clickable: true }}
//     navigation={{
//       nextEl: '.swiper-button-next',
//       prevEl: '.swiper-button-prev',
//       clickable: true,
//     }}
       
//           modules={[EffectCoverflow, Pagination, Navigation,Scrollbar]}
//           className="swiper_container"

//     >
//        <SwiperSlide>
//           <Image  alt="" height={300} width={300}  src="https://swiperjs.com/demos/images/nature-1.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-2.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-3.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-4.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-5.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-6.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-7.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-8.jpg" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Image  alt="" height={300} width={300} src="https://swiperjs.com/demos/images/nature-9.jpg" />
//         </SwiperSlide>
//         <div className="slider-controler">
//           <div className="swiper-button-prev !block !text-white !text-3xl before:hidden slider-arrow">
            
//               <ChevronLeftCircle  size={120} className='!w-5 bg-black 
//                rounded-full p-1 !h-5'/>
//           </div>
//           <div className="swiper-button-next !block !text-white !text-3xl  slider-arrow">
//           <ChevronRightCircle  size={120} className='!w-5 bg-black 
//            rounded-full p-1 !h-5'/>
//           </div>
//           <div className="swiper-pagination"></div>
//         </div>
//     </Swiper>
 
//     </div>
//   )
// }

// export default SideBarNav
