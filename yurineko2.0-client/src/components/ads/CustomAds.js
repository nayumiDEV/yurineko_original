import useAuth from '@/hooks/useAuth'
import React from 'react'

export default function CustomBanner({ url, image }) {
  return (
    <a target="_blank" href={url} rel="noopener">
      <div className="w-full mx-auto flex items-center justify-center py-4">
        <img className="w-full" src={image}></img>
      </div>
    </a>
  )
}

export const FreeCustomBanner = ({ url, image }) => {
  const auth = useAuth()

  if (!auth?.token || (auth.role == 1 && !auth.isPremium)) {
    return (
      <a target="_blank" href={url} rel="noopener">
        <div className="w-full mx-auto flex items-center justify-center py-4">
          <img className="w-full" src={image}></img>
        </div>
      </a>
    )
  }

  return null
}
