import React, { useState } from 'react'
import { Row, Col } from 'antd'
import Rank from '@/components/menu/Rank'
import Banner from '@/components/banner/Banner'
import LayoutHome from '@/layouts/Home'
import RandomCarousel from '@/components/carousel/RandomCarousel'
import MangaSection from '@/components/section/MangaSection'
import { Helmet } from 'react-helmet'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import { getNewMangaList } from 'src/redux/actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import GroupPlatformButton from '@/components/button/GroupPlatformButton'
import { getRanking } from 'api/general'
import { ClickAduBanner } from '@/components/ads/ClickAdu'

function index({ rankData, data, ...props }) {
  const [isLoading, setIsloading] = useState(false)

  const getNextNewList = async (page) => {
    try {
      await props.getNewMangaList(parseInt(page) + 1, () => {})
    } catch {}
  }
  const getNewList = async (page) => {
    if (_.isEmpty(data[page])) {
      setIsloading(true)
      try {
        await props.getNewMangaList(page, () => {
          setIsloading(false)
        })
      } catch {
        setIsloading(true)
      }
    }
    if (_.isEmpty(data[parseInt(page) + 1])) {
      getNextNewList(page)
    }
  }

  // useMemo(() => {
  //   getNewList()
  // }, [])

  return (
    <LayoutHome>
      <ScrollToTop />
      <Helmet>
        <title>Yuri Neko - Sự dịu dàng cuối cùng</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />
      </Helmet>
      <Banner url={process.env.BANNER_HOMEPAGE} />
      <GroupPlatformButton />

      <div className="mb-3">
        <div className="container mx-auto xl:px-40">
          <div className="px-1 py-3">
            <h2 className="text-pink px-1 dark:text-dark-text">
              <i className="fas fa-dice text-2xl"></i>{' '}
              <span className="text-2xl font-bold ml-1 ">Random Yuri</span>
            </h2>
          </div>
        </div>
        <RandomCarousel />
      </div>
      <div className="container mx-auto xl:px-40">
        <Row className="mx-auto" gutter={[20, 16]}>
          <Col xs={24} xl={16} className="py-2">
            {/* <InputComment/> */}
            <ClickAduBanner id="1992195" />
            <MangaSection
              title={'Mới cập nhật'}
              data={data}
              getData={getNewList}
              isLoading={isLoading}
              icon={<i className="fas fa-external-link-alt text-2xl dark:text-dark-text"></i>}
            />
          </Col>

          <Col xs={24} xl={8} className="py-2">
            <Rank getRanking={getRanking} />
            <div className="w-5/6 max-w-screen mx-auto flex justify-center">
              <div
                className="fb-page ml-auto"
                style={{ marginBottom: 15, marginTop: 15 }}
                data-href="https://www.facebook.com/yurineko.moe/"
                data-tabs="timeline"
                data-width="350px"
                data-height=""
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
                data-lazy="true"
              ></div>
            </div>
          </Col>
        </Row>
      </div>
    </LayoutHome>
  )
}

const Page = index
const mapStateToProps = (state) => ({
  data: state.page.newMangaList,
})

const mapDispatchToProps = {
  getNewMangaList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
