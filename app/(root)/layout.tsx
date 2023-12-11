
import { ThemeProvider } from '@/components/ui/theme-provider';
import '../globals.css'
import { ClerkProvider,  } from '@clerk/nextjs'
import '@radix-ui/themes/styles.css';
import { ReactNode } from 'react';

import {  checkState, getCurrentProfile,  } from '@/lib/db-actions';
import { UserObject } from '@/index';
import { redirect } from 'next/navigation';





export const metadata = {
  title: 'Discord',
  description: 'Discord clone',
}
export default async function RootLayout({ children }:{children:ReactNode}) {


const Userdata:UserObject = await getCurrentProfile(false)


if (!Userdata?.onboarded ) redirect("/profile")
checkState(true)

  return ( 

  
    <ClerkProvider>


      <html  suppressHydrationWarning lang="en" 
         className=' '
    >
        <body>      <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    
    storageKey="discord-theme"
  >  

     {children}
  </ThemeProvider>
         
          
          </body>
      </html>

    </ClerkProvider>
  )
}