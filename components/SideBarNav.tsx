"use client";
import { ModeToggle } from "./ui/themeButton";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";
import TooltipComp from "./ui/TooltipComp";
import { ScrollArea } from "./ui/scroll-area";
import ServerLinks from "./ServersLinks";
import { ReactNode, useEffect } from "react";
import { useStore } from "@/store";
import ManageServers from "./CreateServer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import Request from "./Request";
import { User } from "..";

const SideBarNav = ({
  allservers,
  children,
  userId,
  freindesRequests,
}: {
  allservers: any;
  children?: ReactNode;
  userId: string;
  freindesRequests: User[];
}) => {
  const router = useRouter();
  const { SideBarOpen, setSideBarOpen, requests, setRequests } = useStore();

  const env = process.env.NODE_ENV;
  const apiUrl =
    env == "development"
      ? "http://localhost:5000"
      : "https://discord-api.up.railway.app";

  useEffect(() => {
    setRequests(freindesRequests.length);
    axios.get(`${apiUrl}/state?state=online&userId=${userId}`);
    router.refresh();
    const handleWindowClose = async () => {
      axios.get(`${apiUrl}/state?state=offline&userId=${userId}`);
    };

    window.addEventListener("unload", handleWindowClose);
    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.addEventListener("beforeunload", handleWindowClose);
      window.removeEventListener("unload", handleWindowClose);
    };
  }, []);

  return (
    <div
      suppressHydrationWarning
      className={`transition-all relative z-[999]  duration-150 `}
    >
      <div
        suppressHydrationWarning
        className={`fixed duration-150 top-0 transition-all 
    max-w-fit z-50   flexcenter left-0 h-screen  
    w-fit 
    bg-zinc-400 dark:bg-[#0f0f0f] shadow-xl shadow-black    
     flex flex-col 
max-h-[calc(100dvh-100px)]  min-h-full justify-between 
${SideBarOpen ? "translate-x-0" : "-translate-x-full"}


`}
      >
        <button
          className={`absolute  z-[888] cursor-pointer
            bottom-[120px] bg-[url(/assets/right-arrow.svg)] flex
             h-[60px] border-black border-[6px] w-[60px]  duration-150  !rounded-full right-0 
            active:scale-95 

            translate-x-full

              ${SideBarOpen ? "rotate-180" : ""}

          bg-black bg-cover
            p-1 delay-100  transition-all`}
          onClick={() => setSideBarOpen(!SideBarOpen)}
        ></button>

        <div className="flex shadow-xl  justify-center shadow-black h-full">
          <div className="flex z-50 shadow-xl shadow-black  h-full">
            <div className="flex h-full p-2 flex-col items-center  w-[90px]   justify-between">
              <div className="flexcenter  flex-col">
                <ScrollArea className=" flex flex-col items-center ">
                  <ServerLinks data={allservers} />
                </ScrollArea>

                <TooltipComp hoverText="Create Server">
                  <ManageServers
                    userId={userId}
                    actionType="create"
                    submitText="create"
                  />
                </TooltipComp>

                {requests > 0 && (
                  <>
                    <Separator className="my-6" />

                    <div className="  relative">
                      {" "}
                      <TooltipComp hoverText="Freinds Request">
                        {/* <Link href={"/requests"}> </Link> */}
                        <Request freindsRequests={freindesRequests} />
                        <div className="absolute rounded-full -top-[18px] -left-[15px] h-[23px] w-[23px] bg-red-600">
                          {requests}
                        </div>
                      </TooltipComp>{" "}
                    </div>
                  </>
                )}
              </div>

              <div className="flexcenter flex-col  gap-10">
                
                  <ModeToggle  />
                

                <TooltipComp hoverText="Profile Page">
                  <Link
                    href={"/profile"}
                    aria-label="redirect to profile page "
                  >
                    <UserCircle2 className="h-10 w-10 " />
                  </Link>
                </TooltipComp>
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default SideBarNav;

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
