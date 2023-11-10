
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/index";
import { SendMessage,  } from "@/lib/db-actions";




const Handler = async (
    req: NextApiRequest, 
    res: NextApiResponseServerIo

    ) => {

  if (req.method !== "POST" ) {
    return res.status(401).json({error:"method not Valid"})
  }
  const {message,} =  await req.body
  const {serverId,channelId  } =  req.query

const sending =  await SendMessage(channelId,serverId,message,req)

 res.socket?.server?.io?.emit(`message-server-${serverId}-channel-${channelId}`,sending)

res.status(200).json({message:"succes________________________"})

}

export default Handler;