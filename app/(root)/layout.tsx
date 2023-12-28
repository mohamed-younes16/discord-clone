
import { ThemeProvider } from '@/components/ui/theme-provider';
import { getCurrentUser, } from '@/lib/db-actions';
import { ClerkProvider, currentUser, } from '@clerk/nextjs';
import '@radix-ui/themes/styles.css';
import { ReactNode } from 'react';
import '../globals.css';


import CheckUser from '@/components/CheckUser';
import { User } from '@/index';





export const metadata = {
  title: 'Discord',
  description: 'Discord clone',
}
export default async function RootLayout({ children }:{children:ReactNode}) {

  const clerkUser= await currentUser()
  const Userdata:User =await getCurrentUser (clerkUser?.id ||"")


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