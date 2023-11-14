/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { CheckCheck, Copy, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"


export function InviteButton({serverInvitaion}:{serverInvitaion:string}) {

    const [isCopied , setisCopied] = useState(false)
    const [invitationLink, setinvitationLink] = useState("share Link")


    useEffect(() => {
      
        setinvitationLink(`${window && window?.location?.origin}/invitations/${serverInvitaion}`)
     

    }, [])
    
  

      const handleCopy = ()=>{
        navigator.clipboard.writeText(invitationLink)
        setisCopied(true)
        
      }
  return (
    <Dialog onOpenChange={(e:boolean)=>setTimeout(() => {
         e === false ? setisCopied(false):""
    }, 500)}>

      <DialogTrigger className="w-full" asChild>
        <div className=" p-1 my-2 !bg-opacity-25 transition-all rounded-md dark:hover:bg-white flex items-center justify-between">Share <Share2 /> </div> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to Join the Server.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={invitationLink}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3"  onClick={()=>handleCopy()}>

                {isCopied 

                ? <CheckCheck color="#54e605" /> 

                : <Copy className="h-4 w-4" />

                }
        

          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

