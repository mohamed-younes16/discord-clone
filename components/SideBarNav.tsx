import { ModeToggle } from './ui/themeButton';

import { UserCircle2 } from "lucide-react";

import {  UserObject } from "..";

import Link from "next/link";

import TooltipComp from './ui/TooltipComp';
import { Separator } from './ui/separator';


import { findServersBelong } from '@/lib/db-actions';
import { ScrollArea } from './ui/scroll-area';

import ServerLinks from './ServersLinks';
import ManageServers from './CreateServer';






const SideBarNav =async ({userData}:{userData:UserObject}) => {
  const allservers = await findServersBelong()

  return (

    <div suppressHydrationWarning className=' fixed top-0  flexcenter left-0 h-screen  
    w-[90px] 
     bg-gray-300 dark:bg-[#0f0f0f] '>
 
      <div className="flex h-full p-2 flex-col w-full justify-between">

          <div className='flexcenter flex-col'>
            <TooltipComp hoverText='Create Server'>
              <ManageServers actionType='create' submitText='create' />
            </TooltipComp>
            <Separator  className='my-4'/>
            <ScrollArea>
              <ServerLinks data={allservers}/>
            </ScrollArea>
           
           
     
          </div>
        

            <div className=' flexcenter flex-col  gap-6'>  
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