import handleErrorApi from '@/utils/handleErrorApi'
import React, { useState } from 'react'
import { likeComment, unLikeComment } from '../../../api/general'

export default function Heart({ id, defaultLike = false, likeCount }) {
  const [isLike, setLike] = useState(defaultLike)
  const [count, setCount] = useState(likeCount)
  const handleLike = async (e) => {
    // console.log(e.target.checked)
    try {
      if (isLike == false) {
        await likeComment(id)
        setLike(true)
      } else {
        await unLikeComment(id)
        setLike(false)
      }
      if (isLike == false) setCount(count + 1)
      else setCount(count - 1 > 0 ? count - 1 : 0)
    } catch (err) {
      handleErrorApi(err)
    }
  }
  return (
    <>
      <button className="text-md mr-2 cursor-pointer">
        <div>
          <input
            type="checkbox"
            checked={isLike}
            onChange={handleLike}
            hidden
            id={`like-${id}`}
          />
          <label htmlFor={`like-${id}`}>
            {isLike == true ? (
              <i className="fas fa-heart text-pink"></i>
            ) : (
              <i className="far fa-heart text-gray"></i>
            )}
          </label>
        </div>
      </button>
      <span className="text-base">{count}</span>
    </>
  )
}
