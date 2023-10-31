import * as z from "zod"

export const ServerSchema = z.object({
imageUrl:z.string().min(1,{message:"you must enter an image atleast"}),
name:z.string().min(4,{message:"must be at least 4 characters long"}),
})

