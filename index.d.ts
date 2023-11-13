import { Server as NetServer , Socket } from "net";
import { NextApiResponse } from "next";
import { Server as IoServer} from "socket.io";
import { Chat } from "./models/Servers";



export type UserObject = {
    _id: ObjectId;
    id: string;
    __v: number;
    bio: string;
    createdAt: Date;
    imageUrl: string;
    name: string;
    onboarded: boolean;
    servers: any[]; // You can specify a more specific type for 'servers' if needed
    username: string;
};
export type UserSetup = {
    username: string;
    imageUrl: string;
    name: string;
    bio?: string;
  };

  export type ServerSetup = {
    imageUrl: string;
    name: string;
  };

  interface ServerDataType {
    _id: string; // This should be a string representation of ObjectId
    name: string;
    invitationLink: string;
    imageUrl: string;
    createdAt: Date;
    members: any[]; // The structure of the "members" array is not specified in the provided data
    chat: any[]; // The structure of the "chat" array is not specified in the provided data
    __v: number;
  }

  export type NextApiResponseServerIo = NextApiResponse & {
    socket :Socket &{
        server:NetServer& {
          io:IoServer
        }
    }
  }

  export interface ChannelDocument {
    _id: string;
    name: string;
    type: "text" | "video" | "audio";
    chat: Chat[];
    creator: mongoose.Types.ObjectId;
    createdAt: Date;
  } 
  export interface PopulatedChat {
      creator: UserObject;
      content: {
          text: string;
         
          file?: {
              url:string;
              fileType:"image"|"pdf";
          }
      };
      createdAt: Date;
      likes: number;
      _id:string;
  }
  