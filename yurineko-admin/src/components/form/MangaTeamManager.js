import { Button, Checkbox, message, Modal, Select } from 'antd'
import { getMangaFromTeam, getTeamList, changeOwner, getAllTeam } from 'api/admin'
import { List } from 'rc-field-form'
import React, { useEffect, useState } from 'react'

const Option = Select.Option

export default function MangaTeamManager({ isOpen, handleCancel }) {
  const [team, setTeam] = useState([])
  const [from, setFrom] = useState('')
  const [toTeam, setTo] = useState('')
  const [isSelectAll, setSelectAll] = useState(false)
  const [mangaList, setMangaList] = useState('')
  const [selectList, setList] = useState(new Set())

  useEffect(async () => {
    const res = await getAllTeam()
    setTeam(res)
  }, [])

  const handleSelectFrom = async (e) => {
    setFrom(e)
    setSelectAll(false)
    const res = await getMangaFromTeam(e)
    setMangaList(res)
    setList(new Set())
  }
  const handleSelectTo = (e) => {
    setTo(e)
  }
  const selectManga = (e, id) => {
    if (e.target.checked == true) {
      setList(new Set(selectList.add(id)))
    } else {
      let newList = selectList
      newList.delete(id)
      setList(new Set(newList))
    }
  }
  const selectAll = (e) => {
    if (e.target.checked == true) {
      setSelectAll(true)
      setList(new Set(mangaList.map((item) => item.id)))
    } else {
      setSelectAll(false)
      setList(new Set())
    }
  }

  const handleSubmit = async () => {
    try {
      const res = await changeOwner({ mangaID: Array.from(selectList), from, to: toTeam })
      message.success('Chuyển thành công')
      handleSelectFrom(from)
    } catch (err) {
      message.error('Thao tác thất bại')
    }
  }
  return (
    <Modal title="Quản lí sở hữu truyện" visible={isOpen} footer={false} onCancel={handleCancel}>
      <div>
        <div className="flex justify-between">
          <div>
            <p>From:</p>
            <Select
              style={{ width: 150 }}
              onChange={handleSelectFrom}
              showSearch={true}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {team && team.map((item) => <Option key={item.id}>{item.name}</Option>)}
            </Select>
          </div>
          <div>
            <p>To:</p>
            <Select
              style={{ width: 150 }}
              onChange={handleSelectTo}
              showSearch={true}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {team && team.map((item) => <Option key={item.id}>{item.name}</Option>)}
            </Select>
          </div>
        </div>
        {mangaList && (
          <>
            <div className="mt-4 p-2">
              <Checkbox checked={isSelectAll} onChange={selectAll}>
                Tất cả
              </Checkbox>
            </div>
            <div className="">
              <ul className="max-h-60 overflow-y-auto border p-2">
                {mangaList.map((item) => (
                  <li>
                    <Checkbox
                      checked={selectList.has(item.id)}
                      //   onClick={() => selectManga(item.id)}
                      onChange={(e) => selectManga(e, item.id)}
                    >
                      {item.name}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      {mangaList && (
        <div className="mt-2">
          <Button onClick={handleSubmit} className="bg-green-500 block ml-auto text-white">
            Chuyển
          </Button>
        </div>
      )}
    </Modal>
  )
}
