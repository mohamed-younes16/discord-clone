import React from 'react'

const layout = ({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { serverId: string };
  }) => {
  return (
    <div>

        {children}
    </div>
  )
}

export default layout