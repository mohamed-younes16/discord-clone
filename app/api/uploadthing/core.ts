
import { currentUser } from '@clerk/nextjs';
import { createUploadthing, type FileRouter } from "uploadthing/next";


const f = createUploadthing();


const currentUserid = async ()=>  await currentUser()
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
// Define as many FileRoutes as you like, each with a unique routeSlug
imageUploader: f({ image: { maxFileSize: "4MB",maxFileCount:1, }, })
    .middleware( async ({ req }) => {
    // This code runs on your server before upload
    const user = await currentUserid();

    // If you throw, the user will not be able to upload
    if (!user) throw new Error("Unauthorized");

    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {

    }),
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;