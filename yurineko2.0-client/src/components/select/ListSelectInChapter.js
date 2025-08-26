import handleErrorApi from '@/utils/handleErrorApi'
import { Menu, Dropdown } from 'antd'
import { addToList, changeList, removeFromList } from 'api/general'
import React, { useState } from 'react'

const menu = [
  {
    key: 'delete',
    select: (
      <a className="text-md font-semibold hover:bg-red-500">
        <i className="fas fa-times"></i> Xóa khỏi list
      </a>
    ),
    button: (
      <button className="text-white bg-gray border-2 text-md border-gray h-10 rounded px-2 py-2 flex items-center justify-center">
        <i className="fas fa-bookmark mr-2"></i> Yuri list
        <i className="fas fa-angle-down ml-2"></i>
      </button>
    ),
  },
  {
    key: 'follow',
    select: (
      <a className="text-md font-semibold hover:bg-button-follow">
        <i className="fas fa-eye"></i> Theo dõi
      </a>
    ),
    button: (
      <button className="h-10 rounded bg-button-follow text-md text-white px-2 py-2 flex items-center justify-center">
        <i className="fas fa-eye mr-2"></i> Đã t.dõi
        <i className="fas fa-angle-down ml-2"></i>
      </button>
    ),
  },
  {
    key: 'done',
    select: (
      <a className="text-md font-semibold hover:bg-button-done">
        <i className="fas fa-check"></i> Đọc xong
      </a>
    ),
    button: (
      <button className="h-10 rounded bg-button-done text-md text-white px-2 py-2 flex items-center justify-center">
        <i className="fas fa-check mr-2"></i> Đọc xong
        <i className="fas fa-angle-down ml-2"></i>
      </button>
    ),
  },
  {
    key: 'will',
    select: (
      <a className="text-md font-semibold hover:bg-button-will">
        <i className="fas fa-calendar-week"></i> Sẽ đọc
      </a>
    ),
    button: (
      <button className="h-10 rounded bg-button-will text-md text-white px-2 py-2 flex items-center justify-center">
        <i className="fas fa-calendar-week mr-2"></i> Sẽ đọc
        <i className="fas fa-angle-down ml-2"></i>
      </button>
    ),
  },
  {
    key: 'stop',
    select: (
      <a className="text-md font-semibold hover:bg-button-stop hover:text-white">
        <i className="fas fa-pause"></i> Ngừng đọc
      </a>
    ),
    button: (
      <button className="h-10 rounded bg-button-stop text-md text-white px-2 py-2 flex items-center justify-center">
        <i className="fas fa-pause mr-2"></i> Ngừng đọc
        <i className="fas fa-angle-down ml-2"></i>
      </button>
    ),
  },
]

export default function ListSelectInChapter({ mangaId, defaultListKey }) {
  const [selected, setSelected] = useState(defaultListKey ?? 'delete')
  const [listKey, setListKey] = useState(defaultListKey)
  const handleSelect = async (type) => {
    try {
      if (listKey == null && type != 'delete') {
        await addToList(mangaId, type)
        setSelected(type)
        setListKey(type)
      } else if (listKey != null && type == 'delete') {
        await removeFromList(mangaId, listKey)
        setSelected(type)
        setListKey(null)
      } else if (listKey != null && type != 'delete') {
        await changeList(mangaId, type, listKey)
        setSelected(type)
        setListKey(type)
      }
    } catch (err) {
      handleErrorApi(err)
      // console.log(err)
    }
  }
  const FollowList = (
    <Menu>
      {menu.map((item) => {
        if (item.key == 'delete' && listKey == null) {
          return null
        }
        return (
          <Menu.Item key={item.key} onClick={() => handleSelect(item.key)}>
            {item.select}
          </Menu.Item>
        )
      })}
    </Menu>
  )
  const SelectedButton = () => (
    <>
      {menu.map((item) => {
        if (item.key == selected) return item.button
        else return null
      })}
    </>
  )
  return (
    <Dropdown overlay={FollowList} trigger={['click']} placement="bottomCenter">
      <div className="">
        <div className="">
          <SelectedButton />
        </div>
      </div>
    </Dropdown>
  )
}
