import React, { useMemo, useState } from 'react'
import { Table, Tag, Space, Select, Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Search } = Input

function mapFromResultToData(result) {
  return result.map((item) => ({
    name: item.name,
    key: item.id,
    money: item.money,
    method: item.type,
    createAt: item.time,
    username: item.username,
    email: item.email,
  }))
}

export default function AdminOriginal({
  data,
  handleShowModal,
  showDeleteConfirm,
  handleOpenDrawer,
  handleChangePage,
}) {
  const onSearch = (text) => {
    // console.log(text)
    if (text.length > 0) {
      setSearchData(
        allData.filter((item) =>
          String(item.otherName).toLocaleLowerCase().includes(text.toLocaleLowerCase())
        )
      )
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
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Tên User',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số Tiền',
      dataIndex: 'money',
      key: 'money',
    },
    {
      title: 'Phương Thức',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createAt',
      key: 'createAt',
    },
  ]

  return (
    <div>
      <div className="w-100 bg-red flex flex-wrap items-center justify-between">
        {/* <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
          style={{ width: 200 }}
        /> */}
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
