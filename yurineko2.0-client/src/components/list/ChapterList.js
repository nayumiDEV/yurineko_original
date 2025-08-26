import readLink from '@/utils/readLink'
import { timeFromNow } from '@/utils/timeUpdate'
import React, { useState } from 'react'
import Link from 'next/link'

export default function ChapterList({ chapters, mangaID }) {
  const [isIncrease, setIsIncrease] = useState(true)
  const [data, setData] = useState(chapters ? chapters : [])

  const handleChange = (type) => {
    setIsIncrease(type)
    setData(data.reverse())
  }

  return (
    <div className="mt-4 shadow-md bg-white dark:bg-dark-black rounded-md">
      <div className="rounded-md shadow-md p-2 flex justify-between items-center bg-gray-100 dark:bg-dark-black">
        <h2 className="font-bold text-md dark:text-dark-text">
          <i className="far fa-list-alt"></i> Chapters
        </h2>
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleChange(false)}
            disabled={isIncrease == false ? true : false}
            className="hover:text-pink cursor-pointer p-2 rounded-md text-gray text-md flex items-center justify-center"
          >
            <i className="fas fa-sort-amount-up"></i>
          </button>
          <button
            onClick={() => handleChange(true)}
            disabled={isIncrease == true ? true : false}
            className="hover:text-pink curspor-pointer p-2 rounded-md text-gray text-md flex items-center justify-center"
          >
            <i className="fas fa-sort-amount-down"></i>
          </button>
        </div>
      </div>
      <div className="mt-1 px-2 py-3 flex justify-between items-center bg-white dark:bg-dark-gray-light">
        <ul className="w-full scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch overflow-auto max-h-96">
          {data.map((item) => (
            <li key={item.id} className="">
              <a
                key={item.id}
                href={readLink(mangaID, item.id)}
                className="link-chapter text-gray-darkness visited:text-gray-300 visited:bg-opacity-30 cursor-pointer mb-3 p-2 flex items-center justify-between bg-gray-100 dark:bg-dark-gray active:bg-green-700"
              >
                <span className="text-md dark:text-dark-text font-normal clamp-1">
                  {item.name}
                </span>
                <span className="text-base text-gray dark:text-dark-text">
                  {timeFromNow(item.date)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
