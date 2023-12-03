
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"





 

const page =   ({params:{serverid,}}:{params:{serverid:string,}}) => {


 redirect(`/server/${serverid}/channel/general`) 

return <div className="fixed inset-0 flexcenter">
    <Loader2 className=" h-20 w-20 animate-spin "/>
</div>
}

export default page