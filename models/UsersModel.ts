import mongoose, { Schema } from "mongoose"
import { date } from "zod"



const usermodel = new Schema({
   id:{type:String,required:true},

   name: {
   
      type: String,
      required: true,
   
   },
   
   username: {
      type: String,
      required: true,
      unique: true,
   
   },
   
   imageUrl: String,
   
   bio: String,
   
   onboarded: {
   type: Boolean,
   default: false,
   },
   
   servers: [{
         type:Schema.Types.Mixed,
      
      ref :"Servers"
   }
      
      ],
      createdAt :{ 
         type: Schema.Types.Date,
         default: new Date
     }
})

const Users = mongoose.models?.Users || mongoose.model("Users",usermodel)

export default Users