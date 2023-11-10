

const loading = () => {
  return (
    <div className='dark:text-blackfrom-slate-100 z-[1000]  
    bg-fixed dark:bg-[url(/assets/magicdark.png)] 
    bg-cover  dark:bg-transparent  bg-[url(/assets/cccircular.svg)]
   w-screen h-screen  backdrop-blur-md fixed
    inset-0 flex flex-col gap-4 justify-center items-center'>
     

       <div className="font-bold dark:text-primary-purple
        mb-9 dark:text-white animate-pulse text-black text-3xl">Loading your Page...  </div>

     <div className=' flex gap-1'> {[...Array(4).keys()].map((e,i)=>
     <div key={i} style={{animationDelay:`${i*.20}s`}} 
     className='  h-8 mx-3 rounded-full     dark:bg-white 
      bg-black  w-8 animate-pulse'></div>)}</div> 
   </div>
  )
}

export default loading