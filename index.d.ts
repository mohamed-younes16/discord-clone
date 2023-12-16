
import { Server as IoServer} from "socket.io";
import { Chat } from "./models/Servers";



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
