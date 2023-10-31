import * as z from "zod"


export const SetupSchema = z.object({
    username:z.string().min(5,{message:"must be at least 5 characters long"}),
imageUrl:z.string().min(1,{message:"you must enter an image atleast"}),
name:z.string().min(4,{message:"must be at least 4 characters long"}),
bio:z.string().max(40,{message:"must be maximum 50 characters long"}),

})

