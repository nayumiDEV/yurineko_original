import React, { useMemo, useState } from 'react'
import { Table, Tag, Space, Select, Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { findOrigin } from 'api/admin'

const { Search } = Input

function mapFromResultToData(result) {
  return result.map((item) => ({
    name: item.name,
    key: item.id,
    mangaCount: item.mangaCount,
    description: item.description,
    ...item,
  }))
}

export default function AdminOriginal({
  data,
  handleShowModal,
  showDeleteConfirm,
  handleOpenDrawer,
  handleChangePage,
}) {
  const onSearch = async (text) => {
    // console.log(text)
    if (text.length > 0) {
      const res = await findOrigin(text)
      setSearchData(mapFromResultToData(res))
    } else setSearchData([])
  }
  const [allData, setData] = useState([])
  const [searchData, setSearchData] = useState([])

  useMemo(() => {
    setData(mapFromResultToData(data.result))
  }, [data])

  const columns = [
    {
      title: 'Tên Truyện',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Số Truyện',
      dataIndex: 'mangaCount',
      key: 'mangaCount',
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
        pagination={{
          pageSize: 20,
          total: searchData.length > 0 ? searchData.length : data.resultCount,
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
