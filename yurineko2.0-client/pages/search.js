import MangaSection from '@/components/section/MangaSection'
import { getNewMangaList } from 'src/redux/actions'
import LayoutHome from '@/layouts/Home'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import { searchByKeywork, searchByKeyworkPage } from 'api/general'
import RowAds from '@/components/ads/RowAds'

function search({ ...props }) {
  const route = useRouter()
  const [data, setData] = useState({})

  const query = route.query.query ?? ''

  const [isLoading, setIsloading] = useState(false)

  const getNextNewList = async (page) => {
    try {
      const res = await searchByKeyworkPage(query, parseInt(page) + 1)
      const { resultCount } = res
      setData({
        ...data,
        resultCount,
        [parseInt(page) + 1]: { ...res },
      })
    } catch {}
  }
  const getNewList = async (page) => {
    if (_.isEmpty(data[page])) {
      setIsloading(true)
      try {
        const res = await searchByKeyworkPage(query, page)
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

  if (query) {
    return (
      <LayoutHome>
        <ScrollToTop />
        <RowAds top />

        <div className="container mx-auto xl:px-40">
          <MangaSection
            title={`Kết quả tìm kiếm: ${query}`}
            isSearch={true}
            data={data}
            pagination={true}
            getData={getNewList}
            isLoading={isLoading}
          />
        </div>
        <RowAds top={false} />
      </LayoutHome>
    )
  }
  return null
}

const Page = search
const mapStateToProps = (state) => ({
  data: state.page.newMangaList,
})

const mapDispatchToProps = {
  getNewMangaList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
