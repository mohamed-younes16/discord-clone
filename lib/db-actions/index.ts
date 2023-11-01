"use server"
import { ServerSetup, UserSetup } from "@/index";
import Servers, { Member } from "@/models/Servers";
import Users from "@/models/UsersModel"
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid';


export const ConnectToDB = async ()=> {
    try {
      
      await  mongoose.connect(process.env.DB_URI  || "")

  

    } catch (error) {

        console.log(error)
        
    }
}


export const getuserfromDB=async (id:string)=>{
    try {
      const user = await Users.findOne({id})
      return user
    } catch (error) {
      console.log(error)
      return "user not found"
    }
}

export const addUpdateUser = async (data:UserSetup)=>{

  try {
    ConnectToDB()
    const currentus =   auth()
    await Users.findOneAndUpdate({id:currentus.userId || null},
      {...data,onboarded:true},{upsert:true,new:true})

    return true
  } catch (error) {
      console.log(error)  
    return false

  }
}

export const findusers = async ()=>{
  try {
    ConnectToDB()
    const addingusertodb = await Users.find({})

   

    return addingusertodb
  } catch (error) {
  console.log(error)  
  }
}

export const findServersBelong = async ()=>{
  try {
    ConnectToDB()
    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")

    const allServers = await Servers.find({"members.member":userfromdb._id})


    return allServers
  } catch (error) {
  console.log(error)  
  }
}

export const findServer= async (id:string)=>{
  try {
    ConnectToDB()



    const Server= await Servers.findById(id)



    return Server
  } catch (error) {
  console.log(error)  
  }
}
export const findServerbyQuery= async (serverinvitation:string)=>{
  try {
    
    ConnectToDB()

    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")

     const Theserver =   await Servers.findOne({invitationLink:serverinvitation}).select("_id name imageUrl")


    if (userfromdb) return ( {
    servername:Theserver?.name ||"",
    imageUrl:Theserver?.imageUrl ||""
  })
    

  

    

  } catch (error) {
    console.log(error)
  }
}


export const addUpdateServer= async (data:ServerSetup,action:"create"|"update",id?:string)=>{

  try {

    ConnectToDB()

    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")

    if(action === "create" && currentus.userId && userfromdb) {
      const invitationLink = uuidv4()
    const newServer =  await Servers.create({...data})

    newServer.members.push({member:userfromdb._id,userType:"admin"})

    await newServer.save()

      return {valid:true,message:"created successfully"}
    }

    
    else if(action === "update" && currentus.userId && userfromdb) {
   

       await Servers.findByIdAndUpdate(id,data)
    
        return {valid:true,message:"updated successfully"}
      }
  
    return {valid:true,message:"created successfully"}
    
  } catch (error:any) {
    console.log(error)

      if ( error.message.includes("duplicate")) return {valid:false,message:"name already exists "}
    
    
   

  }
}

export const isServerAdmin = async (id:string)=>{
  try {
    
    ConnectToDB()

    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")
    const serverFromDb = await Servers.findById(id) 
    .populate("members.member","id username") // Replace "username email" with the fields you want to populate
    .exec();
    
    const isPermitted = serverFromDb?.members.find((e:any)=>e.member.id == userfromdb.id && e.userType =="admin")
  
      return isPermitted

  } catch (error) {
    console.log(error)
  }
}

export const deleteServer = async (id:string)=>{
  try {
 
    const isPermitted =   await isServerAdmin(id)
    isPermitted ? await Servers.findByIdAndRemove(id) : ""
      return "Deleted"

  } catch (error) {
    console.log(error)
  }
}


export const addingMember = async (serverinvitation:string)=>{
  try {
    
    ConnectToDB()

    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")
    
    
    const  isAlreadyIn =  await Servers.find({invitationLink:serverinvitation,"members.member":userfromdb._id})
     const Theserver =   await Servers.findOne({invitationLink:serverinvitation}).select("_id name")


    if (isAlreadyIn.length == 0) {
      console.log("adding")
      const adding = await Servers.findOneAndUpdate({invitationLink:serverinvitation},{$push:{members:{member:userfromdb._id,userType:"member"}}})
    console.log(adding)
      return  {message:'added',
    serverId:Theserver?._id.toString() || "",
    servername:Theserver?.name ||""
  }
    }

    if (isAlreadyIn.length > 0) {
     
      return {
        message:'exist',
        serverId:Theserver?._id.toString() || "",
      servername:Theserver?.name || ""}
    }
    

    

  } catch (error) {
    console.log(error)
  }
}


export const getMembers = async(serverId:string )=> {
  try {
    
    ConnectToDB()

    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")
    

  
     const Theserver =   await Servers.findById(serverId).populate("members.member").select("members")

    if (userfromdb) {
         return Theserver?.members
    }
    return null
  } catch (error) {
    console.log(error)
  }
}

export const changeUserType = async(member:any, type:"editor"|"member",serverId:string)=>{
  try {

    ConnectToDB();

    const serverup = await Servers.findOneAndUpdate(
      { _id: serverId, "members.member": member._id }, 
      { $set: { 'members.$.userType': type } },
      {new:true}
  
    );

    return serverup ? true : false

   
  } catch (error) {
    console.log(error);
  }
}

