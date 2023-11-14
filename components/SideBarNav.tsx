"use client"
import { ModeToggle } from './ui/themeButton';
import { ChevronDown, Hash, Lock, Mic, PlusIcon, Settings, UserCircle2, UserPlus, Video } from "lucide-react";
import Link from "next/link";
import TooltipComp from './ui/TooltipComp';
import { Separator } from './ui/separator';

import { ScrollArea } from './ui/scroll-area';
import ServerLinks from './ServersLinks';
import ManageServers from './CreateServer';

import { ReactNode, useEffect, useState } from 'react';

import Image from 'next/image';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InviteButton } from './InviteButton';
import DeleteLeaveServerButton from './Forms/DeleteServerButton';
import ChannelForm from './Forms/CreateChannel';

import { Member, ServerDocument } from '@/models/Servers';
import ManageUsers from './ManageUsers';
import { useStore } from '@/store';






const SideBarNav = ({allservers,serverid,currentServer,channelId,isAdmin,children}:
  {allservers:any,serverid?:string,currentServer?:any | undefined,
     channelId?:string,isAdmin?:any ,children?:ReactNode }) => {

    const channlesType = currentServer && [ ...new Set( currentServer?.channels.map((e:any)=>e.type))]

  const [visible , setvisible] = useState(true)
      const {SideBarOpen,setSideBarOpen} = useStore()

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
<div className={`transition-all relative z-50  duration-700  ${SideBarOpen ? "lg:pl-[330px] ":""}`}>
  
  
  <div suppressHydrationWarning className={`fixed duration-700 top-0 transition-all 
    max-w-fit z-50   flexcenter left-0 h-screen  
    w-fit 
    bg-gray-400 dark:bg-[#0f0f0f] shadow-xl shadow-black    
     flex flex-col 
max-h-[calc(100dvh-100px)]  min-h-full justify-between 
${SideBarOpen ? "translate-x-0" : "-translate-x-full"}

`}>
  
        
        <button className={`absolute  z-[888] cursor-pointer
            bottom-[120px] bg-[url(/assets/right-arrow.svg)] flex
             h-[60px] border-black border-[6px] w-[60px] animate-pulse  shadow-lg  !rounded-full right-0 
            active:scale-95 
            ${visible || SideBarOpen 
              ? "translate-x-full scale-100 "
              :"scale-75"}
               bg-black bg-cover
            p-1 delay-100  transition-all`}
            onClick={()=> setSideBarOpen(!SideBarOpen)}>
              
            </button>

            {/* <button onClick={()=>setopen(false)} className="ml-2 rounded-full text-white p-2  top-4 right-4
            absolute hover:shadow-[red]   shadow-md transition-all ">
                <Image alt="close" src="/assets/close.svg" height={40} width={40}/>
            </button> */}
            <div className="flex h-full">
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

            
              
            </div>

     {children}

            </div>
           
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