"use client"
import React from 'react'

const Loading = () => {
  return (
    <div className=' z-[1000]   
    dark:bg-[url(/assets/magicdark.png)]  bg-cover bg-[url(/assets/magiclight.png)]
    w-screen h-screen fixed inset-0 flex flex-col gap-4 justify-center items-center'>
      

        <div className="font-bold dark:text-white mb-9 animate-pulse text-black text-3xl">Loading your Page...  </div>

      <div className=' flex gap-1'>

         {[1,2,3,4].map((e,i)=>

         <div key={i} style={{animationDelay:`${i*.20}s`}} 

      className='  h-8 mx-3 rounded-full     dark:bg-white
        bg-black  w-8 animate-pulse'></div>)}</div> 
    </div>
  )
}

export default Loading