import withAuth from '@/components/HOC/withAuth'
import MangaSection from '@/components/section/MangaSection'
import LayoutHome from '@/layouts/Home'
import { Col, Row, Select } from 'antd'
import { getHistory, getYurilist } from 'api/general'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

function yurilist() {
  const [data, setData] = useState({})
  const [isLoading, setLoading] = useState(true)

  const getNewList = async (page = 1) => {
    setLoading(true)
    try {
      const res = await getHistory(page)
      const { resultCount } = res

      setData({
        ...data,
        resultCount,
        [page]: { ...res },
      })
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  return (
    <LayoutHome>
      <Helmet>
        <title>Lịch sử</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />

      </Helmet>
      <div className="container mx-auto xl:px-40">
        <div className="px-2 md:px-0"></div>
        {/* <MangaSection isSearch={true}/> */}

        <MangaSection
          title={'Lịch sử'}
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
