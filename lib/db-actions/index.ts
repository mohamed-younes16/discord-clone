"use server";

import { auth, currentUser,  } from "@clerk/nextjs/server";
import axios from "axios";

const env = process.env.NODE_ENV;
const apiUrl =
  env == "development"
    ? "http://localhost:5000"
    : "https://dicord-api.onrender.com";

export const getCurrentUser = async (id: string) => {
  const userData = await axios(`${apiUrl}/login`, {
    method: "post",
    data: {
      data: { id },
    },
  });

  return userData?.data?.user || null;
};

export const getCurrentServerCreate = async () => {
  try {
    const clerkUser = await currentUser();
    return clerkUser;
  } catch (error) {
    console.log(error);
  }
};
export const getCurrentProfilepage = async () => {
  try {
    const clerkUser = await currentUser();

    return JSON.parse(
      JSON.stringify({
        id: clerkUser?.id,
        email: clerkUser?.emailAddresses[0].emailAddress,
        onboarded: true,
        active: true,
      })
    );
  } catch (error) {
    console.log(error);
    return "user not found";
  }
};

export const findServersBelong = async (
  operationType: "findGeneral" | "findSpecific"
) => {
  try {
    const { userId } = auth();

    // const userfromdb = await getuserfromDB(userId || "");
    // const allServers = await Servers.find({ "members.member": userfromdb.id });
    const allServers = await axios.get(`${apiUrl}/servers/access`, {
      data: { userId, operationType },
    });

    return allServers.data.serversBelongsTo;
  } catch (error) {
    console.log(error);
  }
};

export const findServer = async ({
  serverId,
  chatLimit,
  userId,
  operationType,
  channelId,
}: {
  serverId: string;
  chatLimit: number;
  userId: string;
  operationType: "findGeneral" | "findSpecific" | "findChannel";
  channelId: string;
}) => {
  try {
    const allServers: any = await axios.get(`${apiUrl}/servers/access`, {
      data: { userId, serverId, chatLimit, operationType, channelId },
    });

    return allServers.data.serversBelongsTo;
  } catch (error) {
    console.log(error);
  }
};
export const findServerbyQuery = async (serverinvitation: string) => {
  try {
    const { userId } = auth();

    const serverdata = await axios.get(`${apiUrl}/servers/access`, {
      data: {
        invitationLink: serverinvitation,
        operationType: "findInvitation",
        userId,
      },
    });

    return serverdata.data.serversBelongsTo;
  } catch (error) {
    console.log(error);
  }
};

export const deleteServer = async (
  serverId: string,
  isAdmin: boolean,
  userId: string
) => {
  try {
    if (isAdmin) {
      const deletingOperation = await axios.delete(`${apiUrl}/servers/delete`, {
        data: { serverId, userId, isAdmin },
      });

      return { valid: true, message: deletingOperation.data.message };
    }

    return { valid: false, message: "check your connection" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "check your connection" };
  }
};

export const addingMember = async (serverinvitation: string) => {
  try {
    const { userId } = auth();

    let serverdata = axios.patch(`${apiUrl}/servers/update`, {
      invitationLink: serverinvitation,
      operationType: "addingMember",
      userId,
    });
    return serverdata
      .then((data) => {
        console.log(data);
        return JSON.parse(JSON.stringify(data.data));
      })
      .catch((error) => error.response.data);
  } catch (error) {
    console.log(error);
  }
};

export const changeMemberType = async (
  memberId: string,
  userType: "moderator" | "member",
  serverId: string,
  isAdmin: boolean,
  userId:string
) => {
  try {
    if (isAdmin) {
      await axios.patch(`${apiUrl}/servers/update`, {
        memberId,
        operationType: "changeMemberType",
        userType,
        isAdmin,
        userId,
        serverId
      });
      // return Theserver.then((data) => {
      //   return JSON.parse(JSON.stringify({ ...data.data, valid: true }));
      // }).catch((error) => ({ ...error.response.data, valid: false }));
    }
    }

  catch (error) {
    console.log(error);
  }
};

export const deleteUserFromMembers = async (
  memberId: string,
  serverId: string,
  userId:string,
  isAdmin: boolean
) => {
  try {
    if (isAdmin) {
      await axios.delete(`${apiUrl}/servers/delete`, {data:{
        memberId,
        operationType: "deleteMember",
        isAdmin,
        userId,
        serverId
      }

      });
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const UserLeaves = async (
  serverId: string,
  isAdmin: boolean,
  memberId: string
) => {
  try {
    const { userId } = auth();

    if (!isAdmin) {
      let serverdata = await axios.patch(`${apiUrl}/servers/update`, {
        operationType: "leaveMember",
        userId,
        serverId,
        memberId,
      });

      return serverdata && { valid: true, message: "leaved" };
    }

    return { valid: false, message: "not authorized" };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const addChannelToServer = async (
  serverId: string,
  name: string,
  type: "text" | "video" | "audio",
  isAdmin: boolean
) => {
  try {
    if (isAdmin) {
      const { userId } = auth();

      const Theserver = axios.post(`${apiUrl}/servers/create`, {
        serverId,
        userId,
        isAdmin,
        operationType: "createChannel",
        name,
        type,
      });
      return Theserver.then((data) => {
        return JSON.parse(JSON.stringify({ ...data.data, valid: true }));
      }).catch((error) => ({ ...error.response.data, valid: false }));
    }

    return { valid: false, message: "Not Allowed " };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};

export const updateCHANNEL = async (
  channelId: string,
  isAdmin: boolean,
  updateChannelValues: { name: string; type: "text" | "video" | "audio" }
) => {
  try {
    if (isAdmin) {
      const { userId } = auth();

      const Theserver = axios.patch(`${apiUrl}/servers/update`, {
        channelId,
        userId,
        isAdmin,
        operationType: "editChannel",
        updateChannelValues,
      });
      return Theserver.then((data) => {
        return JSON.parse(JSON.stringify({ ...data.data, valid: true }));
      }).catch((error) => ({ ...error.response.data, valid: false }));
    }

    return { valid: false, message: "Not Allowed " };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "error happend" };
  }
};
