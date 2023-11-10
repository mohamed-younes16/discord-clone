import React from 'react'

const layout = ({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { serverId: string };
  }) => {
  return (
    <div className=' min-h-screen dark:bg-[url(/assets/magicdark.png)] 
    bg-cover  bg-[url(/assets/cccircular.svg)] dark:bg-transparent bg-[#3e3e3efc]'>

        {children}
    </div>
  )
}

export default layout