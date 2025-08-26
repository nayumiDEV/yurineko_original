import React, { useMemo, useState } from 'react'
import { Table, Tag, Space, Select, Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { banUser } from '../../redux/actions'

const { Search } = Input

function mapFromResultToData(result) {
  return result.map((item) => ({
    name: item.name,
    key: item.id,
    mangaID: item.lnID,
    mangaName: item.originalName,
    detail: item.content,
    createAt: item.createAt,
    userID: item.userID,
    ...item,
  }))
}

function AdminOriginal({ data, handleChangePage, handleDelete, ...props }) {
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

  useMemo(() => {
    setData(mapFromResultToData(data.result))
  }, [data])

  const columns = [
    {
      title: 'Tên User',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Tên Manga',
      dataIndex: 'mangaName',
      key: 'mangaName',
      render: (text, item) => {
        return (
          <a
            target="_blank"
            href={
              process.env.REACT_APP_LN_URL +
              String(
                item.chapterID == 0
                  ? `/novel/${item.mangaID}`
                  : `/read/${item.chapterID}`
              )
            }
          >
            {text}
          </a>
        )
      },
    },
    {
      title: 'Nội Dung',
      dataIndex: 'detail',
      key: 'detail',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (time) => {
        let date = new Date(time)
        return (
          <span>{date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN')}</span>
        )
      },
    },
  ]

  return (
    <div>
      <div className="w-100 bg-red flex flex-wrap items-center justify-between"></div>
      <Table
        columns={columns}
        dataSource={searchData.length > 0 ? searchData : allData}
        onChange={(pagi) => handleChangePage(pagi)}
        pagination={{ pageSize: 20, total: data.resultCount, showSizeChanger: false }}
      />
    </div>
  )
}

const mapDispatchToProps = {
  banUser,
}

export default connect(null, mapDispatchToProps)(AdminOriginal)
