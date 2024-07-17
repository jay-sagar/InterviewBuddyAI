"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

  const router = useRouter()

  const path = usePathname(); // give you the path
  // useEffect(() => {
  //   console.log(path);
  // })

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.png'} width={100} height={80} alt='logo'/>
      <ul className='hidden md:flex gap-6'>
      <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/' && 'text-primary font-bold'}`} onClick={() => router.push('/')}>Home</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard' && 'text-primary font-bold'}`} onClick={() => router.push('/dashboard')}>Dashboard</li>
              </ul>
      <UserButton/>
    </div>
  )
}

export default Header
