import MangaBoxList from '@/components/manga/MangaBoxList'
import MangaSection from '@/components/section/MangaSection'
import { getNewMangaList } from 'src/redux/actions'
import LayoutHome from '@/layouts/Home'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import { searchByKeywork, searchByKeyworkPage, searchByType } from 'api/general'
import Banner from '@/components/banner/Banner'
import GoogleAd from '@/components/ads/GGAds'
import FrameAds from '@/components/ads/FrameAds'
import RowAds from '@/components/ads/RowAds'

function Show({ ...props }) {
  const route = useRouter()
  const [data, setData] = useState({})
  const [typeDetail, setType] = useState('')
  const [currentPage, setPage] = useState(1)

  const id = route.query.id ?? ''
  const type = route.query.type

  const [isLoading, setIsloading] = useState(false)

  const getNextNewList = async (page) => {
    try {
      const res = await searchByType(query, parseInt(page) + 1)
      const { resultCount } = res
      setData({
        ...data,
        resultCount,
        [parseInt(page) + 1]: { ...res },
      })
    } catch {}
  }
  const getNewList = async (page) => {
    setPage(page)
    if (_.isEmpty(data[page])) {
      setIsloading(true)
      try {
        const res = await searchByType({ type, id }, page)
        const { resultCount } = res

        setData({
          ...data,
          resultCount,
          [page]: { ...res },
        })
        setType(res.detail)
        setIsloading(false)
      } catch {
        setIsloading(false)
      }
    }
    // if (_.isEmpty(data[parseInt(page) + 1])) {
    //   getNextNewList(page)
    // }
  }

  // console.log(data)
  // useEffect(() => {
  //   // setIsloading(true)
  //   getNewList(currentPage)
  // }, [type, id])

  if (id && type) {
    return (
      <LayoutHome>
        <GoogleAd />
        <ScrollToTop />
        <Banner url={process.env.BANNER_HOMEPAGE} />
        <RowAds top />
        <div className="container mx-auto xl:px-40 mt-2">
          {typeDetail && (
            <div>
              <p style={{ fontSize: '1.4rem' }} className=" font-semibold dark:text-dark-text pl-2">
                {`${
                  type == 'tag'
                    ? 'Tag'
                    : type == 'author'
                    ? 'Author'
                    : type == 'couple'
                    ? 'Couple'
                    : type == 'origin'
                    ? 'Doujin'
                    : ''
                } > ${typeDetail.name}`}
              </p>
              <p
                style={{ fontSize: '1.2 rem' }}
                className="dark:text-dark-text pl-2"
                dangerouslySetInnerHTML={{ __html: typeDetail.description }}
              ></p>
            </div>
          )}
          <MangaSection
            title={''}
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

const Page = Show
const mapStateToProps = (state) => ({
  data: state.page.newMangaList,
})

const mapDispatchToProps = {
  getNewMangaList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
