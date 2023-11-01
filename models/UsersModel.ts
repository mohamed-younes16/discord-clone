import mongoose, { Schema, Document, Model } from "mongoose";

// Define the user schema
const userSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  imageUrl: String,
  bio: String,
  onboarded: { type: Boolean, default: false },
  servers: [
    {
      type: Schema.Types.Mixed,
      ref: "Servers",
    },
  ],
  createdAt: {
    type: Schema.Types.Date,
    default: new Date(),
  },
});

// Define the user document interface
export interface UserDocument extends Document {
  id: string;
  name: string;
  username: string;
  imageUrl?: string;
  bio?: string;
  onboarded: boolean;
  servers: Schema.Types.Mixed[];
  createdAt: Date;
}

// Create the Users model
const Users= mongoose.models.Users || mongoose.model("Users", userSchema);

export default Users;
