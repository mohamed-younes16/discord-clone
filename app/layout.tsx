
import { ThemeProvider } from '@/components/ui/theme-provider';
import './globals.css'
import { ClerkProvider, currentUser } from '@clerk/nextjs'
import '@radix-ui/themes/styles.css';
import { ReactNode } from 'react';
import SideBarNav from '@/components/SideBarNav';
import { ConnectToDB, getuserfromDB } from '@/lib/db-actions';
import { UserObject } from '..';
import { redirect } from 'next/navigation';




export const metadata = {
  title: 'Discord',
  description: 'Discord clone',
}
export default async function RootLayout({ children }:{children:ReactNode}) {

  ConnectToDB()

const user = await currentUser()

const Userdata:UserObject = await getuserfromDB(user?.id || "")


if (!Userdata?.onboarded ) redirect("/profile")


  return ( 

  
    <ClerkProvider>


      <html  suppressHydrationWarning lang="en" 
        
    >
        <body>      <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    
    storageKey="discord-theme"
  >
    <SideBarNav userData={Userdata}/>
     {children}
  </ThemeProvider>
         
          
          </body>
      </html>

    </ClerkProvider>
  )
}