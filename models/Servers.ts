import mongoose, { Document, Model } from "mongoose";
import { v4 } from "uuid";
import { UserDocument } from "./UsersModel";

export interface Member {
    member: UserDocument;
    userType: "admin" | "member" | "editor";
}

export interface Chat {
    creator: mongoose.Types.ObjectId;
    content: {
        text: string;
        image?: string;
        file?: string;
    };
    createdAt: Date;
    likes: number;
}

export interface ServerDocument extends Document {
    name: string;
    imageUrl: string;
    invitationLink: string;
    members: Member[];
    channels:{ 
        name:String;
        type:"text"|"video"|"audio" ;
        chat:Chat[];
        creator: mongoose.Types.ObjectId;
        createdAt: Date;
    };
    createdAt: Date;
    _id:string;
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
                text: {
                    type: String,
                   
                },
                image: String,
                file: String,
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
        default:v4({ random: [
            0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36,
          ],}),
        unique:true
    }
});

const Servers: Model<ServerDocument> = mongoose.models?.Servers || mongoose.model<ServerDocument>("Servers", servermodel);

export default Servers;
