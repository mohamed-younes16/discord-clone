import mongoose, { Document, Model } from "mongoose";
import { v4 } from "uuid";
import { UserDocument } from "./UsersModel";

export interface Member {
    member: UserDocument;
    userType: "admin" | "member" | "editor";
}

export interface Chat {
    content: {
        text: string;
        file?: {
        id: string;
        url: string;
        fileId: string;
        fileType:"image"|"pdf";
        }
    };
    id: string;
    channelId: string;
    creatorId: string;
    createdAt: Date;
}
export interface channel{  
    name:String;
    type:"text"|"video"|"audio" ;
    chat:Chat[];
    creator: UserDocument;
    createdAt: Date;
    id: string;
    serversBelongId: string;
    creatorId: string;
 
}
export interface ServerDocument {
    members: Member[];
    channels:channel[];
    updatedAt: Date;
    id: string;
    name: string;
    imageUrl: string;
    createdAt: Date;
    invitationLink: string;
}

const servermodel = new mongoose.Schema<ServerDocument>({
    name: {
        type: String,
        required: true,
        unique:true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    members: [
        {
            member: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
               
            },
            userType: {
                type: String,
                enum: ["admin", "member", "editor"],
                default: "member",
            },
        },
    ],

    channels : [{
        name: {
            type:String,
           
        },
        creator :
        {type: mongoose.Schema.Types.ObjectId,
            ref: "Users", 
        },
            type :{
                type: String,
                enum: ["audio", "text", "video"],
                default: "text",
            },
        chat: [
        {
            creator: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            },
            content: {
                text:  String,
               
                file: {
                    url:String,
                    fileType : {type:String,enum :["image","pdf"]}
                },
            },
            createdAt: {
                type: Date,
                default: new Date(),
            },
            likes: Number,
        }],
        createdAt: {
            type: Date,
            default: new Date(),
        }

}
],
    
    createdAt: {
        type: Date,
        default: new Date(),
    },
    invitationLink :{
        type:String,
        default:v4(),
        unique:true
    }
});

const Servers: Model<any> = mongoose.models?.Servers || mongoose.model<any>("Servers", servermodel);

export default Servers;
