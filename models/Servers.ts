import mongoose, { Document, Model } from "mongoose";
import { v4 } from "uuid";

interface Member {
    member: mongoose.Types.ObjectId;
    userType: "admin" | "member" | "editor";
}

interface Chat {
    creator: mongoose.Types.ObjectId;
    content: {
        text: string;
        image?: string;
        file?: string;
    };
    createdAt: Date;
    likes: number;
}

interface ServerDocument extends Document {
    name: string;
    imageUrl: string;
    invitationLink: string;
    members: Member[];
    chat: Chat[];
    createdAt: Date;
    _id:string;
}

const servermodel = new mongoose.Schema<ServerDocument>({
    name: {
        type: String,
        required: true,
        unique: true,
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
    chat: [
        {
            creator: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            },
            content: {
                text: {
                    type: String,
                    required: true,
                },
                image: String,
                file: String,
            },
            createdAt: {
                type: Date,
                default: new Date(),
            },
            likes: Number,
        },
    ],
    createdAt: {
        type: Date,
        default: new Date(),
    },
    invitationLink :{
        type:String,
        default:v4(),
        
    }
});

const Servers: Model<ServerDocument> = mongoose.models?.Servers || mongoose.model<ServerDocument>("Servers", servermodel);

export default Servers;
