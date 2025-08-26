import handleErrorApi from '@/utils/handleErrorApi'
import { likeManga, unlikeManga } from 'api/general'
import React, { useState } from 'react'

export default function LoveButton({ mangaId, defaultValue = false, defaultCount }) {
  const [status, setStatus] = useState(defaultValue)
  const [count, setCount] = useState(defaultCount)

  const handleClick = async () => {
    try {
      if (status == false) {
        await likeManga(mangaId)
        setStatus(true)
        setCount(count + 1)
      } else {
        await unlikeManga(mangaId)
        setStatus(false)
        setCount(count - 1 >= 0 ? count - 1 : 0)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }
  return (
    <>
      <button
        onClick={handleClick}
        style={{
          height: '40px',
        }}
        className={`${
          status == true
            ? 'bg-pink-dark text-white border-pink'
            : 'bg-white dark:bg-dark dark:text-dark-text'
        } w-1/2 rounded-xl border-2 font-bold mr-auto flex items-center justify-center my-1 p-2`}
      >
        <i className="fas fa-crown mr-2"></i> <span>{status ? 'Đã thích' : 'Yêu thích'}</span>
      </button>
      <span className="font-bold dark:text-dark-text mr-auto">{count} người</span>
    </>
  )
}
