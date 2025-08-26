import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import React from 'react'

export default function HelpBanner() {
  const auth = useAuth()

  // if (!auth || !auth.token || (auth.role == 1 && auth.isPremium == false))
  return (
    // <Link href="https://www.facebook.com/yurineko.moe/posts/1771443086360014">
    //   <div className="container xl:px-40 w-full mx-auto my-4">
    //     <img src="/img/help-banner.jpg" alt="banner" />
    //   </div>
    // </Link>
    null
  )
  // return null
}
