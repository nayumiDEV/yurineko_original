import handleErrorApi from '@/utils/handleErrorApi'
import { likeChapter, likeManga, unlikeChapter, unlikeManga } from 'api/general'
import React, { useState } from 'react'

export default function LikeChapterButton({ mangaId, defaultValue = false }) {
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
        } ml-2 rounded font-semibold text-base px-2 py-2 flex items-center justify-center h-10 border-2`}
      >
        <i className="fas fa-crown"></i>
      </button>
    </>
  )
}
