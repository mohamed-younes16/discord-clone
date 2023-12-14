
import { ThemeProvider } from '@/components/ui/theme-provider';
import '../globals.css'
import { ClerkProvider, currentUser,  } from '@clerk/nextjs'
import '@radix-ui/themes/styles.css';
import { ReactNode } from 'react';
import { headers } from 'next/headers';
import {  checkState, getCurrentProfile, getCurrentUser,  } from '@/lib/db-actions';
import { UserObject } from '@/index';
import { redirect } from 'next/navigation';
import CheckUser from '@/components/CheckUser';





export const metadata = {
  title: 'Discord',
  description: 'Discord clone',
}
export default async function RootLayout({ children }:{children:ReactNode}) {

  const clerkUser= await currentUser()
  const Userdata:UserObject =await getCurrentUser (clerkUser?.id ||"")


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
<CheckUser userData={Userdata} />
     {children}
  </ThemeProvider>
         
          
          </body>
      </html>

    </ClerkProvider>
  )
}