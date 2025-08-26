import handleErrorApi from '@/utils/handleErrorApi'
import { subscribeManga, unSubscribeManga } from 'api/general'
import React, { useState } from 'react'

export default function SubscribeMangaInChapter({ mangaId, defaultValue = false }) {
  const [status, setStatus] = useState(defaultValue)

  const handleClick = async () => {
    try {
      if (status == false) {
        await subscribeManga(mangaId)
        setStatus(true)
      } else {
        await unSubscribeManga(mangaId)
        setStatus(false)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }
  return (
    <>
      <button
        onClick={handleClick}
        className={`${
          status == true
            ? 'bg-button-active text-white border-button-active'
            : 'bg-button-disable text-white border-button-disable'
        } h-10 rounded font-semibold text-2xl px-2 py-2 flex items-center justify-center border-2 font-semibold`}
      >
        <i className="far fa-bell"></i>
      </button>
    </>
  )
}
