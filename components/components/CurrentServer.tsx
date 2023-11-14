"use client"

import { useParams } from 'next/navigation'
import React from 'react'

const CurrentServer  = ({id}:{id:string}) => {
    const params = useParams()


  return  <div className={`absolute   -left-0 w-1 bg-emerald-600  rounded-xl
   ${params?.serverid == id ? "w-1 h-full " :" w-0 h-0" } transition-all`}></div>

    
  
}

export default CurrentServer  