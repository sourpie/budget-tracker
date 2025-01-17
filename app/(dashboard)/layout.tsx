import Navbar from '@/components/Navbar'
import React, { ReactNode } from 'react'

const layout = ({ children }: {children: ReactNode}) => {
return (
    <div className='relative flex h-screen w-full flex-col justify-center'>
    <Navbar></Navbar>
    {children}
</div>
)
}

export default layout