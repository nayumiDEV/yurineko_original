import handleErrorApi from '@/utils/handleErrorApi'
import { Select } from 'antd'
import { addBlackListTag, deleteBlackListTag, getBlackListTag, getTag } from 'api/general'
import React, { useEffect, useState } from 'react'

const { Option } = Select
export default function UserBlacklist() {
  const [tags, setTags] = useState('')
  const [blackList, setBlackList] = useState(new Set())

  useEffect(async () => {
    try {
      const res = await getTag('')
      if (res) setTags(res)
    } catch (err) {
      handleErrorApi(err)
    }
  }, [])

  useEffect(async () => {
    try {
      const res = await getBlackListTag()
      if (res) setBlackList(new Set(res.map((item) => item.id)))
    } catch (err) {
      handleErrorApi(err)
    }
  }, [])

  const addBlackList = async (id) => {
    try {
      setBlackList(new Set(blackList.add(id)))
      await addBlackListTag(id)
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const removeBlacklist = async (id) => {
    try {
      let newList = new Set(blackList)
      newList.delete(id)
      setBlackList(new Set(newList))
      await deleteBlackListTag(id)
    } catch (err) {
      handleErrorApi(err)
    }
  }

  function onChange(value) {
    addBlackList(value)
  }
  return (
    <div className="rounded-md bg-blue-200 dark:bg-dark-gray flex flex-col">
      <div className="rounded-md leading-tight text-md bg-blue-300 dark:bg-dark-black dark:text-dark-text font-semibold p-3 flex items-center justify-start">
        Blacklist tags
      </div>
      <div className="text-base leading-tight font-semibold p-3 flex items-start justify-start flex-col">
        <div className="w-full max-w-md">
          <Select
            showSearch
            className="tag-select"
            style={{ width: '100%' }}
            placeholder="Chọn tag muốn hạn chế"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option) =>
              option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {tags &&
              tags.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </div>
        <div className="mt-2 w-full max-w-md">
          <p className="text-md font-semibold leading-tight dark:text-dark-text">Danh sách chặn</p>
          <ul className="list-block bg-white dark:bg-dark border rounded-xl p-2 w-100 mt-1">
            {tags &&
              Array.from(blackList).map((item) => {
                const index = tags.findIndex((tag) => tag.id == item)
                return (
                  <li className=" flex justify-between py-2 px-1 mb-1">
                    <span className="text-base text-gray dark:text-dark-text">
                      {tags[index].name}
                    </span>{' '}
                    <button
                      onClick={() => removeBlacklist(item)}
                      className="text-base text-gray-500 hover:text-red-500 italic hover:font-semibold dark:text-dark-text"
                    >
                      xóa
                    </button>
                  </li>
                )
              })}
          </ul>
        </div>
      </div>
    </div>
  )
}
