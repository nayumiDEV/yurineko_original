import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import React from 'react'

export default function PremiumAds() {
  const auth = useAuth()

  if (!auth || !auth.token || (auth.role == 1 && auth.isPremium == false))
    return (
      <Link href="https://www.facebook.com/yurineko.moe/posts/1771443086360014">
        <div className="w-full mx-auto flex items-center justify-center py-4">
          <img src="/img/donate-me-001.png" alt="banner" />
        </div>
      </Link>
    )
  return null
}
