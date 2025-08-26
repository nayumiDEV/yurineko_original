import useAuth from '@/hooks/useAuth'
import React from 'react'
import { AdminTag, PremiumTag, UploadTag, UserTag } from '../tag/UserTag'

export default function UserBadge({ user }) {
  user = user ?? useAuth()
  if (user)
    return (
      <>
        {user.role === 3 && <AdminTag />}
        {user.role === 2 && <UploadTag />}
        {user.role === 1 && <UserTag />}
        {user.isPremium == true && <PremiumTag />}
      </>
    )
  return null
}
