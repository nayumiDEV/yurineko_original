import React, { useMemo, useState } from 'react'
import { Table, Tag, Space, Select, Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getAllTeam } from 'api/admin'

const { Search } = Input

function mapFromResultToData(result) {
  return result.map((item) => ({
    name: item.name,
    key: item.id,
    memberCount: item.memberCount,
    mangaCount: item.mangaCount,
    createAt: item.createAt,
    ...item,
  }))
}

export default function AdminOriginal({
  data,
  handleShowModal,
  showDeleteConfirm,
  handleOpenDrawer,
  handleChangePage,
  handleShowModalMember,
}) {
  const onSearch = async (text) => {
    // console.log(text)
    if (text.length > 0) {
      const res = await getAllTeam(text)
      setSearchData(mapFromResultToData(res))
    } else setSearchData([])
  }
  const [allData, setData] = useState([])
  const [searchData, setSearchData] = useState([])

  const handleChange = (value) => {}

  useMemo(() => {
    setData(mapFromResultToData(data.result))
  }, [data])

  const columns = [
    {
      title: 'Tên Nhóm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Thành Viên',
      dataIndex: 'memberCount',
      key: 'memberCount',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Số Truyện',
      dataIndex: 'mangaCount',
      key: 'mangaCount',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (time) => <span>{new Date(time).toLocaleDateString()}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (value) => <div dangerouslySetInnerHTML={{ __html: value }} />,
    },
    {
      title: 'Công Cụ',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a className="text-green" onClick={() => handleShowModalMember(record)}>
            Thành viên
          </a>
          <a className="text-blue" onClick={() => handleOpenDrawer(record)}>
            Sửa
          </a>
          <a className="text-red-600" onClick={() => showDeleteConfirm(record.key)}>
            Xóa
          </a>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="w-100 bg-red flex flex-wrap items-center justify-between">
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
          style={{ width: 200 }}
        />
        <button
          type="primary"
          className="flex items-center justify-center bg-green-500 text-white rounded p-2"
          onClick={handleShowModal}
        >
          <PlusOutlined style={{ fontSize: 18 }} /> Add new
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={searchData.length > 0 ? searchData : allData}
        onChange={(pagi) => handleChangePage(pagi)}
        pagination={{ pageSize: 20, total: data.resultCount, showSizeChanger: false }}
      />
    </div>
  )
}
