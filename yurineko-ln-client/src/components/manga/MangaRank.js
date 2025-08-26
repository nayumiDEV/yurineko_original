import React from 'react'
import { number } from '../menu/Rank'
import Link from 'next/link'
import { linkParser } from '@/utils/generateLink'
import imgLink from '@/utils/imgLink'

export default function MangaRank({ item, index, type, mangaType = "lightnovel" }) {
  return (
    <Link href={linkParser(mangaType, item.id)}>
      <div className="flex items-center p-1 cursor-pointer">
        <div className="w-16">
          <div
            className={`text-7xl font-medium flex items-center justify-center flex-shrink-0 flex-grown-0 w-16 overflow-hidden ${number[index]}`}
          >
            {index + 1}
          </div>
        </div>
        <div className="w-16">
          <div className="flex items-center justify-center w-16">
            <img
              className="min-w-full min-h-full flex-shrink-0"
              src={imgLink(item.thumbnail)}
              alt="thumbnail"
            />
          </div>
        </div>
        <div className="p-2">
          <a href={linkParser(mangaType, item.id)}>
            <p className="text-pink dark:text-dark-text font-semibold text-md clamp-1">
              {item.originalName}
            </p>
          </a>
          <p className="text-base italic text-gray dark:text-dark-text">{`${type == 'view' ? 'Lượt xem' : type == 'list' ? 'Lượt list' : 'Số like'
            }: ${item.counter}`}</p>
          <p className="text-base italic text-gray dark:text-dark-text">
            Tác giả/Họa sĩ:{' '}
            {item.author.length > 0
              ? item.author.map((i) => `${i.name}`).join(', ')
              : 'Đang cập nhật'}
          </p>
          <p className="text-base text-gray-800 clamp-1 font-bold dark:text-dark-text">
            » {item.lastChapter?.name}
          </p>
        </div>
      </div>
    </Link>
  )
}
