import { Server as NetServer , Socket } from "net";
import { NextApiResponse } from "next";
import { Server as IoServer} from "socket.io";
import { Chat } from "./models/Servers";



// export type UserObject = {
//     _id: ObjectId;
//     id: string;
//     __v: number;
//     bio: string;
//     createdAt: Date;
//     imageUrl: string;
//     name: string;
//     onboarded: boolean;
//     servers: any[]; // You can specify a more specific type for 'servers' if needed
//     username: string;
// };
// export type UserSetup = {
//     username: string;
//     imageUrl: string;
//     name: string;
//     bio?: string;
//   };

//   export type ServerSetup = {
//     imageUrl: string;
//     name: string;
//   };

//   interface ServerDataType {
//     _id: string; // This should be a string representation of ObjectId
//     name: string;
//     invitationLink: string;
//     imageUrl: string;
//     createdAt: Date;
//     members: any[]; // The structure of the "members" array is not specified in the provided data
//     chat: any[]; // The structure of the "chat" array is not specified in the provided data
//     __v: number;
//   }

  export type NextApiResponseServerIo = NextApiResponse & {
    socket :Socket &{
        server:NetServer& {
          io:IoServer
        }
    }
  }

  // export interface ChannelDocument {
  //   _id: string;
  //   name: string;
  //   type: "text" | "video" | "audio";
  //   chat: Chat[];
  //   creator: mongoose.Types.ObjectId;
  //   createdAt: Date;
  // } 
  // export interface PopulatedChat {
  //     creator: UserObject;
  //     content: {
  //         text: string;
         
  //         file?: {
  //             url:string;
  //             fileType:"image"|"pdf";
  //         }
  //     };
  //     createdAt: Date;
  //     likes: number;
  //     _id:string;
  // }
  



  // TypeScript Types

export interface User {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  bio: string;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  friends: User[];
  friendsof: User[];
  memberOf: Member[];
  email: string;
  channelsAdmin: Channel[];
}

export interface Server {
  id: string;
  updatedAt: Date;
  name: string;
  imageUrl: string;
  createdAt: Date;
  members: Member[];
  invitationLink: string;
  channels: Channel[];
}

export interface Member {
  id: string;
  member: User;
  memberId: string;
  server: Server;
  serverId: string;
  userType: UserType;
  chatList: Chat[];
}

export enum UserType {
  admin = "admin",
  moderator = "moderator",
  member = "member",
}

export enum ChannelTypes {
  video = "video",
  audio = "audio",
  text = "text",
}

export interface Channel {
  serversBelong: Server;
  serversBelongId: string;
  id: string;
  type: ChannelTypes;
  name: string;
  creator: User;
  creatorId: string;
  createdAt: Date;
  chat: Chat[];
}

export interface Chat {
  id: string;
  channel: Channel;
  channelId: string;
  creator: Member;
  creatorId: string;
  content?: Content;
  createdAt: Date;
}

export interface Content {
  id: string;
  chat: Chat;
  chatId: string;
  text: string;
  file?: File;
}

export interface File {
  id: string;
  url: string;
  fileType: FileTypes;
  content: Content;
  fileId: string;
}

export enum FileTypes {
  pdf = "pdf",
  image = "image",
}
