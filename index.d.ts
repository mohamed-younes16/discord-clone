import { Server as IoServer } from "socket.io";
import { Chat } from "./models/Servers";
// models/User.ts
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
  FreindOfChat: FreindsChatObject[];
  FreindWithChat: FreindsChatObject[];
  memberOf: Member[];
  email: string;
  channelsAdmin: Channel[];
  chatsOwner: FreindsChatList[];
  freindsWith: User[];
  freindsOf: User[];
  freindsRequestedTo: User[];
  freindsRequestedFrom: User[];
}

// models/FreindsChatObject.ts
export interface FreindsChatObject {
  id: string;
  chatCreator: User;
  ChatWith: User;
  chat: FreindsChatList[];
}

// models/FreindsChatList.ts
export interface FreindsChatList {
  id: string;
  createdAt: Date;
  freindChatRefrence: FreindsChatObject;
  freindChatRefrenceId: string;
  creator: User;
  creatorId: string;
  content: FreindChatContent ;
  creator: Member;


}

// models/FreindChatContent.ts
export interface FreindChatContent {
  id: string;
  chat: FreindsChatList;
  text: string;
  file: File | null;
}

// models/File.ts
export interface File {
  id: string;
  url: string;
  fileType: FileTypes;
  content: Content;
  contentFreind: FreindChatContent | null;
}

// enums/FileTypes.ts
export enum FileTypes {
  pdf = "pdf",
  image = "image",
}

// models/server.ts
export interface Server {
  updatedAt: Date;
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  members: Member[];
  invitationLink: string;
  channels: Channel[];
}

// enums/UserType.ts
export enum UserType {
  admin = "admin",
  moderator = "moderator",
  member = "member",
}

// enums/ChannelTypes.ts
export enum ChannelTypes {
  video = "video",
  audio = "audio",
  text = "text",
}

// models/Channel.ts
export interface Channel {
  serversBelong: Server;
  id: string;
  type: ChannelTypes;
  name: string;
  creator: User;
  createdAt: Date;
  chat: Chat[];
}

// models/Chat.ts
export interface Chat {
  id: string;
  channel: Channel;
  channelId: string;
  creator: Member;
  creatorId: string;
  content?: Content;
  createdAt: Date;
}

// models/Content.ts
export interface Content {
  id: string;
  chat: Chat;
  text: string;
  file: File | null;
}

// export interface User {
//   id: string;
//   name: string;
//   username: string;
//   imageUrl: string;
//   bio: string;
//   onboarded: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   active: boolean;
//   friends: User[];
//   friendsof: User[];
//   memberOf: Member[];
//   email: string;
//   channelsAdmin: Channel[];
// }

// export interface Server {
//   id: string;
//   updatedAt: Date;
//   name: string;
//   imageUrl: string;
//   createdAt: Date;
//   members: Member[];
//   invitationLink: string;
//   channels: Channel[];
// }

export interface Member {
  id: string;
  member: User;
  memberId: string;
  server: Server;
  serverId: string;
  userType: UserType;
  chatList: Chat[];
}

// export enum UserType {
//   admin = "admin",
//   moderator = "moderator",
//   member = "member",
// }

// export enum ChannelTypes {
//   video = "video",
//   audio = "audio",
//   text = "text",
// }

// export interface Channel {
//   serversBelong: Server;
//   serversBelongId: string;
//   id: string;
//   type: ChannelTypes;
//   name: string;
//   creator: User;
//   creatorId: string;
//   createdAt: Date;
//   chat: Chat[];
// }

// export interface Chat {
//   id: string;
//   channel: Channel;
//   channelId: string;
//   creator: Member;
//   creatorId: string;
//   content?: Content;
//   createdAt: Date;
// }

// export interface Content {
//   id: string;
//   chat: Chat;
//   chatId: string;
//   text: string;
//   file?: File;
// }

// export interface File {
//   id: string;
//   url: string;
//   fileType: FileTypes;
//   content: Content;
//   fileId: string;
// }

// export enum FileTypes {
//   pdf = "pdf",
//   image = "image",
// }
