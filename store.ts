import {create , } from "zustand"
import { createJSONStorage, persist } from 'zustand/middleware'

type Store = {
    SideBarOpen: boolean ;
    setSideBarOpen: (v:boolean) => void;
    requests:number ,
    setRequests: (v:number) => void;
  }
  
 export  const useStore = create<Store>()(persist( (set) => ({
    SideBarOpen:true ,
    setSideBarOpen: (v:boolean) => set(() => ({ SideBarOpen:v })),
    requests:0 ,
    setRequests: (v:number) => set(() => ({ requests:v })),
  }),{name:"data",
  storage: createJSONStorage(() => sessionStorage)}) 
  )