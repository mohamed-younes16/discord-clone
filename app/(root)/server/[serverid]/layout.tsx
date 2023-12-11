import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react'

const layout = ({
    children,

  }: {
    children: React.ReactNode;
    params: { serverId: string };
  }) => {
  return (
    <div className=' min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover  bg-[url(/assets/cccircular.svg)] dark:bg-transparent bg-[#3e3e3efc]'>
<Suspense>
        {children || <div className="fixed inset-0 flexcenter">
    <Loader2 className=" h-20 w-20 animate-spin "/>
</div>}
</Suspense>

    </div>
  )
}

export default layout