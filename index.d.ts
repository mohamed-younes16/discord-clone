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