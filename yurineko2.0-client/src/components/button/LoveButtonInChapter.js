import handleErrorApi from '@/utils/handleErrorApi'
import { likeManga, unlikeManga } from 'api/general'
import React, { useState } from 'react'

export default function LoveButtonInChapter({ mangaId, defaultValue = false }) {
  const [status, setStatus] = useState(defaultValue)

  const handleClick = async () => {
    try {
      if (status == false) {
        await likeManga(mangaId)
        setStatus(true)
      } else {
        await unlikeManga(mangaId)
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
          status == true ? 'bg-pink text-white border-pink' : 'bg-gray text-white border-gray'
        } h-10 leading-none rounded text-md font-normal px-3 py-2 flex items-center justify-center border-2`}
      >
        <i className="fas fa-crown mr-2"></i> {status ? 'Đã thích' : 'Yêu thích'}
      </button>
    </>
  )
}
