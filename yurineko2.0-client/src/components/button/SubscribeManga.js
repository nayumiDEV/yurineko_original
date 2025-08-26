import handleErrorApi from '@/utils/handleErrorApi'
import React, { useState } from 'react'
import { subscribeManga, unSubscribeManga } from '../../../api/general'

export default function SubscribeManga({ customClass, defaultSubscribe, mangaId }) {
  const [subscrible, setSubscribe] = useState(defaultSubscribe)

  const handleClick = async () => {
    try {
      if (subscrible == false) {
        await subscribeManga(mangaId)
        setSubscribe(true)
      } else {
        await unSubscribeManga(mangaId)
        setSubscribe(false)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={
          customClass +
          ` ${
            subscrible
              ? 'bg-button-active text-white border-button-active font-semibold'
              : 'bg-button-disable text-white border-button-disable font-semibold'
          }`
        }
      >
        <i className="fas fa-bell mr-2"></i>
        {subscrible ? 'Đã đăng ký' : 'Nhận thông báo'}
      </button>
    </>
  )
}
