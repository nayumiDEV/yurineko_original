import React from 'react'
import Link from 'next/link'

export default function DirectoryMenu({ type }) {
  return (
    <div className="flex items-center w-full bg-gray py-4 mb-2">
      <div className="container mx-auto xl:px-40">
        <p className="p-2 text-white text-3xl font-semibold mt-2">Danh Mục</p>
        <Link href="/directory">
          <button
            className={`p-2 leading-none rounded-md text-gray-light hover:bg-pink hover:text-white text-xl font-normal mr-4 ${
              type == 'origin' ? 'bg-pink' : ''
            }`}
          >
            Truyện gốc
          </button>
        </Link>
        <Link href="/directory/doujin">
          <button
            className={`p-2 leading-none rounded-md text-gray-light hover:bg-pink hover:text-white text-xl font-normal mr-4 ${
              type == 'doujin' ? 'bg-pink' : ''
            }`}
          >
            Doujins
          </button>
        </Link>
        <Link href="/directory/author">
          <button
            className={`p-2 leading-none rounded-md text-gray-light hover:bg-pink hover:text-white text-xl font-normal mr-4 ${
              type == 'author' ? 'bg-pink' : ''
            }`}
          >
            Tác giả/Họa sĩ
          </button>
        </Link>
        <Link href="/directory/tag">
          <button
            className={`p-2 leading-none rounded-md text-gray-light hover:bg-pink hover:text-white text-xl font-normal mr-4 ${
              type == 'tag' ? 'bg-pink' : ''
            }`}
          >
            Tags
          </button>
        </Link>

        <Link href="/directory/couple">
          <button
            className={`p-2 leading-none rounded-md text-gray-light hover:bg-pink hover:text-white text-xl font-normal mr-4 ${
              type == 'couple' ? 'bg-pink' : ''
            }`}
          >
            Couples
          </button>
        </Link>

        <Link href="/directory/team">
          <button
            className={`p-2 leading-none rounded-md text-gray-light hover:bg-pink hover:text-white text-xl font-normal mr-4 ${
              type == 'team' ? 'bg-pink' : ''
            }`}
          >
            Nhóm dịch
          </button>
        </Link>
      </div>
    </div>
  )
}
