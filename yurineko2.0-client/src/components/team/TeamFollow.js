import React, { useState, useEffect } from 'react'
import ReactImageFallback from 'react-image-fallback'
import SubscribeTeam from '../button/SubscribeTeam'
import Link from 'next/link'
import { teamLink } from '@/utils/generateLink'

export default function TeamFollow({ item }) {
  const [follower, setFollower] = useState('')
  useEffect(() => {
    setFollower(item.follower ?? 0)
  }, [item])
  return (
    <div className="rounded-md p-2 bg-gray-200 dark:bg-dark-black shadow">
      <div className="rounded max-h-32 w-full flex items-center justify-center overflow-hidden shadow ">
        <Link href={teamLink(item.url ? item.url : item.id)}>
          <img
            src={item.cover ?? process.env.BANNER_TEAM}
            // fallbackImage={process.env.BANNER_TEAM}
            alt="img"
            className="max-w-full max-h-full flex-shrink-0"
          />
        </Link>
      </div>
      <div className="flex items-center justify-between pt-2 dark:text-dark-text">
        <div>
          <Link href={teamLink(item.url ? item.url : item.id)}>
            <p className="text-md font-semibold cursor-pointer">{item.name}</p>
          </Link>
          <p className="text-base font-xs text-gray-500">{follower} theo dõi</p>
        </div>
        <div className="flex items-center ">
          <SubscribeTeam
            teamId={item.id}
            defaultFollow={item.userData?.follow ?? item.follow ?? false}
            defaultSubscribe={item.userData?.subscribe ?? item.subscribe ?? false}
            handleInc={() => {
              setFollower(follower + 1)
            }}
            handleDec={() => {
              setFollower(follower - 1)
            }}
          />
        </div>
      </div>
    </div>
  )
}
