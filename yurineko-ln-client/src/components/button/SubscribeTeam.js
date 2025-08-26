import handleErrorApi from '@/utils/handleErrorApi'
import { subscribeTeam, unSubscribeTeam, unFollowTeam, followTeam } from 'api/general'
import React, { useState } from 'react'

export default function SubscribeTeam({
  defaultSubscribe,
  defaultFollow,
  teamId,
  handleInc,
  handleDec,
}) {
  const [follow, setFollow] = useState(defaultFollow)
  const [subscribe, setSubscribe] = useState(defaultSubscribe)

  const handleFollow = async () => {
    try {
      if (follow == false) {
        await followTeam(teamId)
        setFollow(true)
        handleInc()
      } else {
        await unFollowTeam(teamId)
        setFollow(false)
        handleDec()
        // setSubscribe(false)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }
  const handleSubscribe = async () => {
    try {
      if (subscribe == false) {
        await subscribeTeam(teamId)
        setSubscribe(true)
      } else {
        await unSubscribeTeam(teamId)
        setSubscribe(false)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }
  return (
    <>
      <button
        onClick={handleFollow}
        className={`${
          follow == true
            ? 'bg-button-active text-white border-button-active'
            : 'bg-button-disable text-white dark:bg-dark-black dark:text-dark-text border-button-disable'
        } mb-1 text-xl mr-2 px-2 py-1 rounded-md text-base items-center justify-center border-2 text-black font-semibold`}
      >
        <i className="fas fa-star mr-2"></i>
        {follow ? 'Đang t.dõi' : 'Theo dõi'}
      </button>
      <button
        onClick={handleSubscribe}
        className={`${
          subscribe == true
            ? 'bg-button-active text-white border-button-active'
            : 'bg-button-disable text-white dark:bg-dark-black dark:text-dark-text border-button-disable'
        } mb-1 text-xl mr-2 px-2 py-1 rounded-md text-base items-center justify-center border-2 text-black font-semibold`}
      >
        <i className="fas fa-bell"></i>
      </button>
    </>
  )
}
