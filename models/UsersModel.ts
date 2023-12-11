import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
  id: string;
  name: string;
  username: string;
  imageUrl?: string;
  bio?: string;
  onboarded: boolean;
  freinds: Schema.Types.ObjectId;
  createdAt: Date;
  active:boolean;
  
}


const userSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  imageUrl: String,
  bio: String,
  onboarded: { type: Boolean, default: false },
  freinds: [{  
  freindId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
}}],
  createdAt: {
    type: Schema.Types.Date,
    default: new Date(),
  },
  active:{type: Boolean, default:false}
});

// Define the user document interface

// Create the Users model
const Users= mongoose.models.Users || mongoose.model("Users", userSchema);

export default Users;
