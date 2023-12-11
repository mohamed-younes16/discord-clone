"use server";
import { ServerSetup, UserSetup } from "@/index";
import Servers, { ServerDocument } from "@/models/Servers";
import Users, { UserDocument } from "@/models/UsersModel";
import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextApiRequest } from "next";
import { v4 } from "uuid";

export const ConnectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI || "");
  } catch (error) {
    console.log(error);
  }
};

export const getuserfromDB = async (id: string) => {
  try {
    ConnectToDB();
    const user = await Users.findOne({ id });
    return user;
  } catch (error) {
    console.log(error);
    return "user not found";
  }
};

export const getCurrentProfile = async (populated:boolean) => {
  try {

    ConnectToDB();
   
    const  userd  = auth();
 const g = await currentUser()

    const user = populated
      ? await Users.findOne({ id: userd.userId }).populate("freinds.freindId")
      : await Users.findOne({ id: userd.userId });

    return user
  } catch (error) {
    console.log(error);
    return "user not found";
  }
};
export const addUpdateUser = async (data: UserSetup) => {
  try {
    ConnectToDB();
    const currentus = auth();
    await Users.findOneAndUpdate(
      { id: currentus.userId || null },
      { ...data, onboarded: true },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const findusers = async () => {
  try {
    ConnectToDB();
    const addingusertodb = await Users.find({});

    return addingusertodb;
  } catch (error) {
    console.log(error);
  }
};

export const findServersBelong = async () => {
  try {
    ConnectToDB();
    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");
    const allServers = await Servers.find({ "members.member": userfromdb._id });

    return allServers;
  } catch (error) {
    console.log(error);
  }
};

export const findServerBelongByID = async (serverId: string) => {
  try {
    
    ConnectToDB();
    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    const Server = await Servers.findOne({
      "members.member": userfromdb._id,
      _id: serverId,
    });

    return Server;
  } catch (error) {
    console.log(error);
  }
};

export const findServer = async (
  id: string,
  chatOptions: { limit: number }
) => {
  try {
    ConnectToDB();

    const Server: ServerDocument | null = await Servers.findById(id)
      .sort({ "channels.chat.createdAt": -1 }) // Sort the channels based on createdAt in descending order
      .populate("channels.chat.creator", "username imageUrl")
      .populate("members.member", "imageUrl username name active _id")
      .limit(chatOptions.limit);

    return Server;
  } catch (error) {
    console.log(error);
  }
};
export const findServerbyQuery = async (serverinvitation: string) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    const Theserver = await Servers.findOne({
      invitationLink: serverinvitation,
    }).select("_id name imageUrl");

    if (userfromdb)
      return {
        servername: Theserver?.name || "",
        imageUrl: Theserver?.imageUrl || "",
      };
  } catch (error) {
    console.log(error);
  }
};

export const addUpdateServer = async (
  data: ServerSetup,
  action: "create" | "update",
  id?: string
) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    if (action === "create" && currentus.userId && userfromdb) {
      const newServer = await Servers.create({ ...data, invitationLink: v4() });

      newServer.channels.push({
        name: "general",
        chat: [],
        type: "text",
        creator: userfromdb._id,
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
      });
      newServer.members.push({ member: userfromdb._id, userType: "admin" });

      await newServer.save();

      return { valid: true, message: "created successfully" };
    } else if (action === "update" && currentus.userId && userfromdb) {
      await Servers.findByIdAndUpdate(id, data);

      return { valid: true, message: "updated successfully" };
    }

    return { valid: true, message: "created successfully" };
  } catch (error: any) {
    console.log(error);

    if (error.message.includes("duplicate"))
      return { valid: false, message: "name already exists " };
  }
};

export const isServerAdmin = async (id: string) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");
    const serverFromDb = await Servers.findById(id)
      .populate("members.member", "id username")
      .exec();

    const isPermitted = serverFromDb?.members.find(
      (e: any) => e.member.id == userfromdb.id && e.userType == "admin"
    );

    return isPermitted;
  } catch (error) {
    console.log(error);
  }
};

export const deleteServer = async (id: string) => {
  try {
    const isPermitted = await isServerAdmin(id);

    if (isPermitted) {
      await Servers.findByIdAndDelete(id)

      return { valid: true, message: "deleted" };
    }

    return { valid: false, message: "check your connection" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "check your connection" };
  }
};

export const addingMember = async (serverinvitation: string) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    const isAlreadyIn = await Servers.find({
      invitationLink: serverinvitation,
      "members.member": userfromdb._id,
    });
    const Theserver = await Servers.findOne({
      invitationLink: serverinvitation,
    }).select("_id name");

    if (isAlreadyIn.length == 0) {
      const adding = await Servers.findOneAndUpdate(
        { invitationLink: serverinvitation },
        { $push: { members: { member: userfromdb._id, userType: "member" } } }
      );

      return {
        message: "added",
        serverId: Theserver?._id.toString() || "",
        servername: Theserver?.name || "",
      };
    }

    if (isAlreadyIn.length > 0) {
      return {
        message: "exist",
        serverId: Theserver?._id.toString() || "",
        servername: Theserver?.name || "",
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMembers = async (serverId: string) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    const Theserver = await Servers.findById(serverId)
      .populate("members.member")
      .select("members");

    if (userfromdb) {
      return Theserver?.members;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const changeUserType = async (
  memberId: string,
  type: "editor" | "member",
  serverId: string
) => {
  try {
    ConnectToDB();

    const isAdmin = await isServerAdmin(serverId);

    if (isAdmin) {
      const server: any = await Servers.findById(serverId);
      const memberIndex = server.members.findIndex(
        (member: any) => member.member.toString() === memberId
      );

      if (
        memberIndex !== -1 &&
        server.members[memberIndex].userType !== "admin"
      ) {
        server.members[memberIndex].userType = type;
        await server.save();

        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (serverId: string) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    const isadm = await Servers.findOne({
      _id: serverId,
      "members.member": userfromdb._id,
      "members.userType": "admin",
    });
    return isadm ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const deleteUserFromMembers = async (
  memberId: string,
  serverId: string
) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    const isAdmin = await Servers.findOne({
      _id: serverId,
      "members.member": userfromdb._id,
      "members.userType": "admin",
    });
    const isDeletedAdmin = await Servers.findOne({
      _id: serverId,
      members: { member: memberId, userType: "admin" },
    });

    if (isAdmin && !isDeletedAdmin) {
      const server = await Servers.findOneAndUpdate(
        { _id: serverId },
        {
          $pull: { members: { member: memberId }, userType: { $ne: "admin" } },
        },
        { new: true }
      );

      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const UserLeaves = async (serverId: string) => {
  try {
    ConnectToDB();

    const currentus = auth();

    const userfromdb = await getuserfromDB(currentus.userId || "");

    const isDeletedAdmin = await Servers.findOne({
      _id: serverId,
      members: { member: userfromdb._id, userType: "admin" },
    });

    if (!isDeletedAdmin) {
      await Servers.findOneAndUpdate(
        { _id: serverId },
        {
          $pull: {
            members: { member: userfromdb._id },
            userType: { $ne: "admin" },
          },
        }
      );

      return { valid: true, message: "leaved" };
    }

    return { valid: false, message: "not authorized" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const checkState = async (state: boolean) => {
  try {
    ConnectToDB();

    const userfromdb: UserDocument = await getCurrentProfile(false);
    await Users.findByIdAndUpdate(userfromdb._id, { active: state });
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const addChannelToServer = async (
  serverId: string,
  name: string,
  type: "text" | "video" | "audio"
) => {
  try {
    ConnectToDB();

    const isadmin = await isAdmin(serverId);

    const userfromdb: UserDocument = await getCurrentProfile(false);

    if (isadmin) {
      const isnameUnique = await Servers.findOne({
        _id: serverId,
        "channels.name": name,
      });

      if (!isnameUnique) {
        const Theserver = await Servers.findByIdAndUpdate(
          serverId.toString(),
          {
            $push: {
              channels: {
                name,
                type: type.toString(),
                chat: [],
                creator: userfromdb._id,
              },
            },
          },
          { new: true }
        );

        return { valid: true, message: "added channel" };
      }

      return { valid: false, message: "channel already exists" };
    }
    return { valid: false, message: "unauthorized or check connection" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const SendMessage = async (
  channelId: any,
  serverId: any,
  message: string,
  fileUrl: string,
  fileType: "pdf" | "image",
  req: NextApiRequest
) => {
  try {
    ConnectToDB();

    const { userId } = getAuth(req);

    const userfromdb: UserDocument = await getuserfromDB(userId || "");

    if (userfromdb?.onboarded) {
      const servermessage: any = await Servers.findOneAndUpdate(
        { _id: serverId.toString(), "channels.name": channelId },
        {
          $push: {
            "channels.$.chat": {
              creator: userfromdb._id,
              content: { text: message, file: { url: fileUrl, fileType } },
              likes: 0,
            },
          },
        },
        { new: true }
      ).populate("channels.chat.creator", "username imageUrl");

      return servermessage?.channels.filter((e: any) => e.name === channelId)[0]
        .chat;
    }
    return;
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const EditMessageDB = async (
  channelId: any,
  serverId: any,
  messageId: string,
  message: string,
  req: NextApiRequest
) => {
  try {
    ConnectToDB();

    const { userId } = getAuth(req);
    const userfromdb: UserDocument = await getuserfromDB(userId || "");

    if (userfromdb?.onboarded) {
      const servermessage: any = await Servers.findOneAndUpdate(
        {
          _id: serverId.toString(),
          "channels.name": channelId,
          "channels.chat._id": messageId, // Match the specific message by its _id
        },
        {
          $set: { "channels.$[outer].chat.$[inner].content.text": message },
        },
        {
          new: true,
          arrayFilters: [
            { "outer.chat._id": messageId },
            { "inner._id": messageId },
          ],
        }
      ).populate("channels.chat.creator", "username imageUrl");

      return servermessage?.channels.filter((e: any) => e.name === channelId)[0]
        .chat;
    }
    return;
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happened" };
  }
};

export const DeleteMessageDB = async (
  channelId: any,
  serverId: any,
  messageId: string,
  req: NextApiRequest
) => {
  try {
    ConnectToDB();

    const { userId } = getAuth(req);
    const userfromdb: UserDocument = await getuserfromDB(userId || "");

    if (userfromdb?.onboarded) {
      const servermessage: any = await Servers.findOneAndUpdate(
        { _id: serverId.toString(), "channels.name": channelId },
        {
          $pull: { "channels.$.chat": { _id: messageId } },
        },
        { new: true }
      ).populate("channels.chat.creator", "username imageUrl");

      return servermessage?.channels.filter((e: any) => e.name === channelId)[0]
        .chat;
    }
    return;
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happened" };
  }
};

export const GetChannels = async (serverId: any) => {
  try {
    ConnectToDB();

    const { userId } = auth();

    const userfromdb: UserDocument = await getuserfromDB(userId || "");

    if (userfromdb) {
      const serverChannels = await Servers.findById(serverId).select(
        "channels"
      );

      return serverChannels;
    }
    return;
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const getChat = async (
  serverId: string,
  channelId: string,
  limit: number
) => {
  try {
    ConnectToDB();

    const userfromdb: UserDocument = await getCurrentProfile(false);

    if (userfromdb) {
      const chat = await Servers.findOne(
        { _id: serverId, "channels.name": channelId },
        { "channels.chat": { $slice: [2, limit] } },
        {}
      ).populate({
        path: "channels.chat",
        options: {
          sort: { createdAt: -1 },
          limit: limit || 10,
        },
      });

      return chat;
    }
    return;
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};
export const addFreind = async (freindId: string) => {
  try {
    ConnectToDB();
    const userfromdb: UserDocument = await getCurrentProfile(true)
    
    if (userfromdb) {

    await Users.findByIdAndUpdate(
        userfromdb._id,
        {
          $push: {
            freinds: { freindId: new mongoose.Types.ObjectId(freindId) },
          },
        },
        { new: true }
      )
     const gg =   await Users.findByIdAndUpdate(
        freindId,
        {
          $push: {
            freinds: { freindId: new mongoose.Types.ObjectId( userfromdb._id) },
          },
        },
        { new: true }
      );
      console.log(gg)
      return { valid: true, message: "Freind Added" };
    }
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};
export const getAUser = async (
  name: string,
  type: "Online" | "All" | "Pending" | "Blocked"
) => {
  try {

    ConnectToDB();

   
    const userfromdb: UserDocument = await getCurrentProfile(true);
    
    const similarUsers = await Users.find({
      username: { $regex: new RegExp(name, "i") },
      _id: { $ne: userfromdb._id } // Exclude the current user
    });

    return similarUsers
      ? { valid: true, users: JSON.parse(JSON.stringify(similarUsers || {})) }
      : { valid: false, message: "No user found" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "Error happened" };
  }
};

export const updateChannel = async (
  serverId: string,
  channelId: string,
  values: any
) => {
  try {
    ConnectToDB();

    const isadmin = await isAdmin(serverId);

    if (isadmin) {
      const isnameUnique = await Servers.findOne({
        _id: serverId,
        "channels.name": values.name,
      });

      if (!isnameUnique) {
        await Servers.findOneAndUpdate(
          { _id: serverId.toString(), "channels._id": channelId },
          {
            $set: {
              "channels.$.name": values.name,
              "channels.$.type": values.type.toString(),
            },
          },
          { new: true }
        );

        return { valid: true, message: "updated channel" };
      }

      return { valid: false, message: "channel already exists" };
    }
    return { valid: false, message: "unauthorized or check connection" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const deletechannelDB = async (serverId: string, channelId: string) => {
  try {
    ConnectToDB();

    const isadmin = await isAdmin(serverId);

    if (isadmin) {
      await Servers.findOneAndUpdate(
        { _id: serverId.toString() },
        {
          $pull: { channels: { _id: channelId } },
        },
        { new: true }
      );

      return { valid: true, message: "deleted channel" };
    }
    return { valid: false, message: "unauthorized or check connection" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};
