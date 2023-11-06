"use server"
import { ServerSetup, UserSetup } from "@/index";
import Servers from "@/models/Servers";
import Users, { UserDocument } from "@/models/UsersModel"
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose"
import { v4 } from "uuid";


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

export const findServerBelongByID = async (serverId:string)=>{
  try {
    ConnectToDB()
    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")

    const Server = await Servers.findOne({"members.member":userfromdb._id,_id:serverId})


    return Server
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


    const newServer =  await Servers.create({...data,invitationLink:v4()})
  

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

   if (isPermitted){ 

    await Servers.findByIdAndRemove(id) 
    
    return { valid: true, message:"deleted" }

  }

  return  { valid: false, message:"check your connection" }
      

  } catch (error) {
    console.log(error)
   return { valid: false, message:"check your connection" }
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

export const changeUserType = async(memberId:string, type:"editor"|"member",serverId:string)=>{
  try {


    ConnectToDB();

    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")


    const isAdmin =  await isServerAdmin(serverId)
      console.log(isAdmin)
    if (isAdmin) {
      const server :any = await Servers.findById(serverId);
      const memberIndex = server.members.findIndex(
        (member:any) => member.member.toString() === memberId
      );

      if (memberIndex !== -1 && server.members[memberIndex].userType !== 'admin') {
        server.members[memberIndex].userType = type;
        await server.save();

        console.log(server);
        return true;
      }
 

  
    }
   return false

   
  } catch (error) {
    console.log(error);
  }
}

export const isAdmin = async (serverId:string)=> {

  try {
    ConnectToDB();


    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")


    const isadm =  await Servers.findOne({
        _id: serverId,
        'members.member': userfromdb._id,
        'members.userType': "admin"
      })
          return isadm ? true : false



  } catch (error) {
    
    console.log(error)
    return false 

  }
}
export const deleteUserFromMembers = async (memberId:string, serverId:string) => {
  try {
    ConnectToDB();


    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")



    const isAdmin =  await Servers.findOne({
      _id: serverId,
      'members.member': userfromdb._id,
      'members.userType': "admin"
    });
    const isDeletedAdmin = await Servers.findOne({
      _id: serverId,
      members :{member:memberId,userType:"admin"}
    });
      console.log(isDeletedAdmin)
    if (isAdmin && !isDeletedAdmin) {

      const server = await Servers.findOneAndUpdate(
      { _id: serverId },
      { $pull: { members: { member: memberId },userType:{$ne:"admin"}} },
      { new: true }


     

    );
     console.log(server)
     return true
    }


    return false
  } catch (error) {
  
    console.log(error);
    return false
  }
};
export const UserLeaves = async (serverId:string) => {
  try {
    ConnectToDB();


    const currentus =   auth()

    const userfromdb = await getuserfromDB(currentus.userId ||"")


    const isDeletedAdmin = await Servers.findOne({
      _id: serverId,
      members :{member: userfromdb._id,userType:"admin"}
    });
    
    if (!isDeletedAdmin) {

      const server = await Servers.findOneAndUpdate(
      { _id: serverId },
      { $pull: { members: { member: userfromdb._id },userType:{$ne:"admin"}} },
    )
   
     return { valid: true, message:"leaved" }
    }


    return { valid: false, message:"not authorized" }
  } catch (error) {
  
    console.log(error);
    return { valid: false, message:"error happend" }
  }
};







export const addChannelToServer = async (serverId:string,name:string,type:"text"|"video"|"audio" )=>{
  try {
    
    ConnectToDB()

  const isadmin = await isAdmin(serverId)


  const currentus =   auth()

  const userfromdb:UserDocument = await getuserfromDB(currentus.userId ||"")


  
  if(isadmin)  {
    const isnameUnique =  await Servers.findOne({_id:serverId,"channels.name":name})
    console.log(isnameUnique)
    if( !isnameUnique) {
    

    const Theserver = await Servers.findByIdAndUpdate(
        serverId.toString(),
        {
          $push:{channels: {name,type:type.toString(),chat:[],creator:userfromdb._id}}
        }
        ,{new: true}
        )
     
          console.log(Theserver,type)
        return{ valid: true, message:"added channel" }

    }
   

      return{ valid: false, message:"channel already exists" }

  } 
  return{ valid: false, message:"unauthorized or check connection" }
    

  } catch (error) {
    console.log(error)
    return{ valid: false, message:"error happend" }
  }
}
