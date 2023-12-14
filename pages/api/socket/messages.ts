import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/index";
import { DeleteMessageDB, EditMessageDB, SendMessage } from "@/lib/db-actions";

const Handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== "POST") {
    return res.status(401).json({ error: "method not Valid" });
  }
  const { message, fileUrl, fileType } = await req.body;
  const { serverId, channelId, actionType, messageId }: any = req.query;

  const sending =
    actionType == "create"
      ? await SendMessage(channelId, serverId, message, fileUrl, fileType, req)
      : actionType == "delete"
      ? await DeleteMessageDB(channelId, serverId, messageId, req)
      : actionType == "edit"
      ? await EditMessageDB(channelId, serverId, messageId, message, req)
      : "";
  const socket = res.socket?.server?.io;

  socket.emit(`message-server-${serverId}-channel-${channelId}`, sending);

  res.status(200).json({ message: "success________" });
};

export default Handler;
