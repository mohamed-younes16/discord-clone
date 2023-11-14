import {create} from "zustand"


type Store = {
    SideBarOpen: boolean ;
    setSideBarOpen: (v:boolean) => void;
  }
  
 export  const useStore = create<Store>()((set) => ({
    SideBarOpen:false ,
    setSideBarOpen: (v:boolean) => set(() => ({ SideBarOpen:v })),
  }))