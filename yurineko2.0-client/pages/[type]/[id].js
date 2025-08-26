import MangaSection from '@/components/section/MangaSection'
import { getNewMangaList } from 'src/redux/actions'
import LayoutHome from '@/layouts/Home'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import Banner from '@/components/banner/Banner'
import RowAds from '@/components/ads/RowAds'
import { searchByType } from 'api/general'

function Show({ ...props }) {
  const route = useRouter()
  const [data, setData] = useState({})
  const [typeDetail, setType] = useState('')

  const id = route.query.id ?? ''
  const type = route.query.type

  const [isLoading, setIsloading] = useState(false)

  const getNewList = async (page) => {
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
  }

  if (id && type) {
    return (
      <LayoutHome>
        <ScrollToTop />
        <Banner url={process.env.BANNER_HOMEPAGE} />
        <RowAds top />
        <div className="container mx-auto xl:px-40 mt-2">
          {typeDetail && (
            <div>
              <p style={{ fontSize: '1.4rem' }} className=" font-semibold dark:text-dark-text pl-2">
                {`${type == 'tag'
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
