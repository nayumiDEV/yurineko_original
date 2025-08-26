import Banner from '@/components/banner/Banner'
import CheckboxTag from '@/components/button/CheckboxTag'
import MangaSection from '@/components/section/MangaSection'
import LayoutHome from '@/layouts/Home'
import handleErrorApi from '@/utils/handleErrorApi'
import { Form, Input, Tabs, Row, Col, Select, Checkbox, Button } from 'antd'
import { advSearch, getTag } from 'api/general'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
const { TabPane } = Tabs
const { Option } = Select

const children = []
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
}

export default function advanced() {
  const [data, setData] = useState({})
  const [isLoading, setIsloading] = useState(false)

  const [tags, setTags] = useState('')
  const [selectList, setSelect] = useState(new Set([]))
  const [exceptList, setExcept] = useState(new Set([]))
  const [numChapter, setNumChapter] = useState('1')
  const [status, setStatus] = useState('0')
  const [sort, setSort] = useState('7')

  useEffect(async () => {
    await getData()
  }, [])

  const getData = async (q = '') => {
    try {
      const res = await getTag(q)
      if (res) setTags(res)
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const handleSearch = async (e) => {}

  const handleAdd = (value) => {
    setSelect(new Set(value))
  }

  const handleExcept = (value) => {
    setExcept(new Set(value))
  }

  const handlePickTag = (id, nextStatus) => {
    if (nextStatus == 0) {
      selectList.delete(id)
      exceptList.delete(id)
    }
    if (nextStatus == 1) {
      selectList.add(id)
      exceptList.delete(id)
    }
    if (nextStatus == 2) {
      selectList.delete(id)
      exceptList.add(id)
    }
  }

  function handleChange(value) {}
  function onChange(checkedValues) {}

  const handleSubmit = async (e) => {
    e.preventDefault()
    getNewList(1, true)
  }

  const handleClear = () => {
    setSelect(new Set([]))
    setExcept(new Set([]))
    setSort('7')
    setNumChapter('1')
    setStatus('0')
  }

  const getNewList = async (page, forceRefresh = false) => {
    if (forceRefresh || _.isEmpty(data[page])) {
      setIsloading(true)
      try {
        const selectStr = Array.from(selectList)
          .map((item) => item.toString())
          .join(',')
        const exceptStr = Array.from(exceptList)
          .map((item) => item.toString())
          .join(',')

        const res = await advSearch({
          genre: selectStr,
          notGenre: exceptStr,
          status: status,
          minChapter: numChapter,
          sort: sort,
          page: page,
        })
        const { resultCount } = res

        setData({
          ...data,
          resultCount,
          [page]: { ...res },
        })
        setIsloading(false)
      } catch {
        setIsloading(false)
      }
    }
    // if (_.isEmpty(data[parseInt(page) + 1])) {
    //   getNextNewList(page)
    // }
  }

  return (
    <LayoutHome>
      <Helmet>
        <title>Tìm kiếm nâng cao</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />
      </Helmet>
      <Banner url={process.env.BANNER_HOMEPAGE} />
      <h2 className="text-center text-4xl text-pink font-semibold mt-4 dark:text-dark-text">
        Tìm kiếm nâng cao
      </h2>
      <div className="container mx-auto xl:px-40">
        <div className="px-4 py-8 border dark:border-none rounded-md shadow-md mt-4 mb-4 w-full mx-auto dark:bg-dark-black dark:text-dark-text">
          <Form className="advanced-form">
            <p className="text-xl font-semibold text-gray-darkness dark:text-dark-text leading-tight">
              Thể loại:
            </p>
            <Tabs defaultActiveKey="1" onChange={handleClear}>
              <TabPane tab={<span className="dark:text-dark-text">Thủ công</span>} key="1">
                <Row gutter={{ xs: 0, md: 24 }}>
                  <Col xs={24} md={12}>
                    <div className="flex flex-col ">
                      <p
                        htmlFor="add"
                        className="text-md text-semibold text-gray-dark dark:text-dark-text"
                      >
                        Tìm những tag này:
                      </p>
                      <Select
                        id="add"
                        mode="multiple"
                        allowClear
                        showSearch
                        className="w-full"
                        placeholder="Tên tag"
                        filterOption={(input, option) => {
                          return (
                            option.children &&
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          )
                        }}
                        defaultValue={[]}
                        value={Array.from(selectList)}
                        onChange={handleAdd}
                      >
                        {tags && tags.map((item) => <Option key={item.id}>{item.name}</Option>)}
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="flex flex-col">
                      <p
                        htmlFor="remove"
                        className="text-md text-semibold text-gray-dark dark:text-dark-text"
                      >
                        Loại những tag này:
                      </p>
                      <Select
                        id="remove"
                        mode="multiple"
                        allowClear
                        showSearch
                        className="w-full"
                        placeholder="Tên tag"
                        filterOption={(input, option) => {
                          return (
                            option.children &&
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          )
                        }}
                        value={Array.from(exceptList)}
                        defaultValue={[]}
                        onChange={handleExcept}
                      >
                        {tags && tags.map((item) => <Option key={item.id}>{item.name}</Option>)}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={<span className="dark:text-dark-text">Lựa chọn</span>} key="2">
                <div>
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <div className="shadow-inner border rounded w-6 h-6 block flex items-center justify-center">
                        <i className="fas fa-check text-green"></i>
                      </div>
                      <span className="ml-2 text-base text-gray-dark dark:text-dark-text">
                        Tìm truyện có tag này
                      </span>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label className="flex items-center cursor-pointer">
                      <div className="shadow-inner border rounded w-6 h-6 block flex items-center justify-center">
                        <i className="fas fa-times text-red-500"></i>
                      </div>
                      <span className="ml-2 text-base text-gray-dark dark:text-dark-text">
                        Loại trừ những tag này
                      </span>
                    </label>
                  </div>
                </div>
                <Row className="mt-4">
                  {tags &&
                    tags.map((item) => (
                      <CheckboxTag
                        key={item.id}
                        item={item}
                        handlePickTag={handlePickTag}
                        defaultStatus={
                          selectList.has(item.id) ? 1 : exceptList.has(item.id) ? 2 : 0
                        }
                      />
                    ))}
                </Row>
              </TabPane>
            </Tabs>
            <p className="text-xl font-semibold text-gray-darkness leading-tight mt-8 dark:text-dark-text">
              Sắp xếp:
            </p>
            <Row gutter={{ xs: 0, md: 24 }}>
              <Col xs={24} md={12}>
                <div className="py-2 flex items-center justify-between">
                  <p className="text-md text-semibold text-gray-dark dark:text-dark-text">
                    Số chapter:
                  </p>
                  <Select
                    value={numChapter}
                    className="w-2/4 max-w-xs"
                    onChange={(e) => {
                      setNumChapter(e)
                    }}
                  >
                    <Option value="1">{`>=1`}</Option>
                    <Option value="20">{`>=20`}</Option>
                    <Option value="50">{`>=50`}</Option>
                    <Option value="100">{`>=100`}</Option>
                    <Option value="200">{`>=200`}</Option>
                  </Select>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <p className="text-md text-semibold text-gray-dark dark:text-dark-text">
                    Tình trạng:
                  </p>
                  <Select value={status} className="w-2/4 max-w-xs" onChange={(e) => setStatus(e)}>
                    <Select.Option value="0">Tất cả</Select.Option>
                    <Select.Option value="1">Chưa ra mắt</Select.Option>
                    <Select.Option value="2">Đã xong</Select.Option>
                    <Select.Option value="3">Sắp ra mắt</Select.Option>
                    <Select.Option value="4">Đang tiến hành</Select.Option>
                    <Select.Option value="5">Dừng dịch</Select.Option>
                    <Select.Option value="6">Tạm ngưng</Select.Option>
                    <Select.Option value="7">Ngừng xuất bản</Select.Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="py-2 flex items-center justify-between">
                  <p className="text-md text-semibold text-gray-dark dark:text-dark-text">
                    {' '}
                    Sắp xếp theo:
                  </p>
                  <Select value={sort} className="w-2/4 max-w-xs" onChange={(e) => setSort(e)}>
                    <Select.Option value="1">Theo view tuần</Select.Option>
                    <Select.Option value="2">Theo view tháng</Select.Option>
                    <Select.Option value="3">Theo view năm</Select.Option>
                    <Select.Option value="4">Theo lượt follow</Select.Option>
                    <Select.Option value="5">Theo thời gian</Select.Option>
                    <Select.Option value="6">Theo số chap</Select.Option>
                    <Select.Option value="7">Theo năm ra mắt</Select.Option>
                  </Select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24} className="text-right">
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  className="bg-pink border-pink hover:bg-pink"
                >
                  Tìm
                </Button>
                <Button style={{ margin: '0 8px' }} onClick={handleClear}>
                  Đặt lại
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        {!_.isEmpty(data) && (
          <MangaSection
            title="Kết quả tìm kiếm:"
            isSearch={true}
            data={data}
            pagination={true}
            getData={getNewList}
            isLoading={isLoading}
          />
        )}
      </div>
    </LayoutHome>
  )
}
