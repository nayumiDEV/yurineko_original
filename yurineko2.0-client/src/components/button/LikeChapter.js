import handleErrorApi from '@/utils/handleErrorApi'
import { likeChapter, likeManga, unlikeChapter, unlikeManga } from 'api/general'
import React, { useState } from 'react'

export default function LikeChapter({ chapterId, defaultValue = false, likeCount }) {
  const [status, setStatus] = useState(defaultValue)

  const handleClick = async () => {
    try {
      if (status == false) {
        await likeChapter(chapterId)
        setStatus(true)
      } else {
        await unlikeChapter(chapterId)
        setStatus(false)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }
  return (
    <>
      <p
        onClick={handleClick}
        className="cursor-pointer text-center font-bold text-lg my-2 mt-4 dark:text-dark-text"
      >
        Thích Chapter:
        {status == true ? (
          <i className="fas fa-heart text-pink ml-2"></i>
        ) : (
          <i className="far fa-heart ml-2"></i>
        )}{' '}
        {status == false ? likeCount : likeCount + 1}
      </p>
    </>
  )
}
