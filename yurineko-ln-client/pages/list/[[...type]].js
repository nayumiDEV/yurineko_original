import GoogleAd from '@/components/ads/GGAds'
import withAuth from '@/components/HOC/withAuth'
import BlockLoading from '@/components/loading/BlockLoading'
import MangaBoxList from '@/components/manga/MangaBoxList'
import MangaSection from '@/components/section/MangaSection'
import LayoutHome from '@/layouts/Home'
import { Col, Row, Select } from 'antd'
import { getYurilist } from 'api/general'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

function yurilist() {
  const route = useRouter()
  const [data, setData] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [select, setSelect] = useState('all')

  const type = route.query.type ? route.query.type[0] : 'all'

  const getNewList = async (page = 1) => {
    // if (_.isEmpty(data[page])) {
    setLoading(true)
    try {
      const res = await getYurilist(select, page)
      const { resultCount } = res

      setData({
        ...data,
        resultCount,
        [page]: { ...res },
      })
      setType(res.detail)
      setLoading(false)
    } catch {
      setLoading(false)
    }
    // }
    // if (_.isEmpty(data[parseInt(page) + 1])) {
    //   getNextNewList(page)
    // }
  }

  useEffect(() => {
    setSelect(type)
  }, [type])

  useEffect(() => {
    getNewList()
  }, [select])

  const handleChangeType = (e) => {
    setSelect(e)
  }

  return (
    <LayoutHome>
      <GoogleAd />
      <Helmet>
        <title>Yuri list</title>
      </Helmet>
      <div className="container mx-auto xl:px-40">
        <p className="p-2 text-pink text-center text-2xl font-semibold mt-2">Yuri List</p>
        <div className="px-2 md:px-0"></div>
        {/* <MangaSection isSearch={true}/> */}

        <MangaSection
          title={
            <Select onChange={handleChangeType} defaultValue={select} className="w-full max-w-md">
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="follow">Theo dõi</Select.Option>
              <Select.Option value="will">Sẽ đọc</Select.Option>
              <Select.Option value="done">Đọc xong</Select.Option>
              <Select.Option value="stop">Ngừng theo dõi</Select.Option>
            </Select>
          }
          list={type == 'all' ? null : type}
          isSearch={true}
          data={data}
          pagination={true}
          getData={getNewList}
          isLoading={isLoading}
        />
      </div>
    </LayoutHome>
  )
}

export default withAuth(yurilist)
