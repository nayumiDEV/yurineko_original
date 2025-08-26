import GoogleAd from '@/components/ads/GGAds'
import withAuth from '@/components/HOC/withAuth'
import MangaBoxList from '@/components/manga/MangaBoxList'
import MangaSection from '@/components/section/MangaSection'
import LayoutHome from '@/layouts/Home'
import { getFavorite } from 'api/general'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

function favorite() {
  const [data, setData] = useState({})
  const [isLoading, setLoading] = useState(true)

  const getNewList = async (page = 1) => {
    setLoading(true)
    try {
      const res = await getFavorite(page)
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
      <GoogleAd />
      <Helmet>
        <title>Yêu thích</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />

      </Helmet>
      <div className="container mx-auto xl:px-40">
        <p className="p-2 text-pink text-center text-2xl font-semibold mt-2">Yêu thích</p>
        <div className="px-2 md:px-0"></div>
        {/* <MangaSection isSearch={true}/> */}

        <MangaSection
          title={''}
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

export default withAuth(favorite)
