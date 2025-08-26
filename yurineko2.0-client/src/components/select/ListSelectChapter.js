import { Select } from 'antd'
import React, { useState } from 'react'

export default function ListSelectChapter({ chapterInfo, listChapter, changeChapter }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <select
          className="px-2 py-1 text-xs md:text-base w-full h-full rounded-md"
          onBlur={() => {
            setOpen(false)
          }}
          onChange={(e) => changeChapter(e)}
          open={open}
          style={{ width: '100%' }}
          defaultValue={chapterInfo.id}
        >
          {listChapter.map((item, index) => (
            <option value={item.id} key={`chapter-${index}`} selected={item.id == chapterInfo.id}>
              {item.name}
            </option>
          ))}
        </select>
        <div
          style={{ backgroundColor: '#bfc2c7' }}
          className="h-full absolute flex items-center justify-center right-0 top-0 p-2 text-white rounded-tr-md rounded-br-md"
        >
          <i className="fas fa-sort-down text-white"></i>
        </div>
      </div>
    </>
  )
}
