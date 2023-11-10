import { ChannelDocument } from "@/index"
import { GetChannels } from "@/lib/db-actions"
import { redirect } from "next/navigation"




 

const page = async  ({params:{serverid,}}:{params:{serverid:string,}}) => {
// const serverchannels:any= await GetChannels(serverid)

// const generalChannel = serverchannels.channels.filter((e:any)=>e.name == "general")
  
return redirect(`/server/${serverid}/channel/general`) 
}

export default page