import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import React from 'react'

export default function DiscordBanner() {
  return (
    <a target="_blank" href="https://discord.gg/QYPYqqMCaK" rel="noreferrer">
      <div className="w-full mx-auto flex items-center justify-center py-4">
        <img src="/img/discord.jpg" alt="banner" />
      </div>
    </a>
  )
}
