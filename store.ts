import {create , } from "zustand"
import { createJSONStorage, persist } from 'zustand/middleware'

type Store = {
    SideBarOpen: boolean ;
    setSideBarOpen: (v:boolean) => void;
  }
  
 export  const useStore = create<Store>()(persist( (set) => ({
    SideBarOpen:false ,
    setSideBarOpen: (v:boolean) => set(() => ({ SideBarOpen:v })),
  }),{name:"data",
  storage: createJSONStorage(() => sessionStorage)}) 
  )