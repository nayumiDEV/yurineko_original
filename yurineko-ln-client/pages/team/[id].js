import { getNewMangaList } from 'src/redux/actions'
import LayoutHome from '@/layouts/Home'
import { Col, Modal, Row, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import { getTeam, searchByType, searchMangaByType } from 'api/general'
import { Helmet } from 'react-helmet'
import ReactImageFallback from 'react-image-fallback'
import SubscribeTeam from '@/components/button/SubscribeTeam'
import Link from 'next/link'
import { userLink } from '@/utils/generateLink'
import handleErrorApi from '@/utils/handleErrorApi'
import GoogleAd from '@/components/ads/GGAds'
import FrameAds from '@/components/ads/FrameAds'
import RowAds from '@/components/ads/RowAds'
import { getTeamMangaRanking, getTeamLightnovelRanking } from 'api/general'
import DynamicSection from '@/components/section/DynamicSection'
import DynamicRank from '@/components/menu/DynamicRank'

const { Option } = Select;

const icon = {
  link: <i className="fas fa-link" style={{ color: "#17cae4" }}></i>,
  facebook: <i className="fab fa-facebook text-blue-500"></i>,
  discord: <i className="fab fa-discord text-indigo-400"></i>,
  wordpress: <i className="fab fa-wordpress" style={{ color: "#21759b" }}></i>,
  blogger: <i className="fab fa-blogger" style={{ color: "#f49340" }}></i>,
}

function show({ ...props }) {
  const route = useRouter()
  const [data, setData] = useState({})
  const [teamData, setTeam] = useState('')
  const [follower, setFollower] = useState('')
  const [isVisibleModal, setIsVisibleModal] = useState(false)
  const [apiType, setApiType] = useState('lightnovel');

  const id = route.query.id ?? ''
  const type = 'team'

  const [isLoading, setIsLoading] = useState(false)

  const getNewList = async (page) => {
    if (_.isEmpty(data[apiType]) || _.isEmpty(data[apiType][page])) {
      setIsLoading(true)
      try {
        let res;
        if (apiType == 'manga') {
          res = await searchMangaByType({ type, id }, page)
        } else if (apiType == 'lightnovel') {
          res = await searchByType({ type, id }, page)
        }
        const { resultCount } = res;

        setData({
          ...data,
          [apiType]: {
            resultCount,
            ...data[apiType],
            [page]: { ...res }
          }
          ,
        })
        setIsLoading(false)
      } catch {
        setIsLoading(false)
      }
    }
  }

  useEffect(async () => {
    try {
      if (id) {
        const res = await getTeam(id)
        setTeam(res);
        setFollower(res.follower);
        setApiType('lightnovel');
      }
    } catch (err) {
      // handleErrorApi(err)
    }
  }, [id])

  if (id && type && teamData) {
    return (
      <LayoutHome>
        <GoogleAd />
        <ScrollToTop />
        <Helmet>
          <title>Team | {teamData.name}</title>
        </Helmet>
        <div className="w-screen bg-white dark:bg-dark shadow">
          <div className="container mx-auto xl:px-40 pb-2">
            <Row>
              <div className="relative w-full h-full">
                <ReactImageFallback
                  className="block mx-auto md:rounded-b-xl"
                  src={teamData.cover}
                  fallbackImage="/img/discord.jpg"
                  alt={`Banner team ${teamData.name} | Yurineko`}
                />
                <Row className="pt-2">
                  <div
                    className="flex flex-nowrap">
                    <ReactImageFallback
                      className="w-28 h-28 -mt-8 mb-auto ml-2 rounded-full border-8 border-white dark:border-dark md:ml-5 md:w-40 md:h-40 md:-mt-12 bg-white dark:bg-dark"
                      src={teamData.avatar}
                      fallbackImage="/img/defaultAvatar.jpg"
                      alt={`Avatar team ${teamData.name} | Yurineko`}
                    />
                    <div className="px-2 lg:max-w-xs xl:max-w-md">
                      <h2
                        className="font-black text-xl dark:text-dark-text md:text-2xl"
                      >
                        {teamData.name}
                      </h2>
                      <h4 className="dark:text-dark-text md:text-lg">
                        {`@${teamData.url}`}
                      </h4>
                      <SubscribeTeam
                        teamId={teamData.id}
                        defaultSubscribe={teamData.userData?.subscribe ?? false}
                        defaultFollow={teamData.userData?.follow ?? false}
                        handleInc={() => {
                          setFollower(follower + 1)
                        }}
                        handleDec={() => {
                          setFollower(follower - 1)
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="px-4 space-y-1">
                      <div
                        className="flex dark:text-dark-text">
                        <i className="fas fa-info-circle mr-2 leading-6 text-gray-500 dark:text-gray-400"></i>
                        <p
                          dangerouslySetInnerHTML={{ __html: teamData.description || "Team chưa có miêu tả" }}>
                        </p>
                      </div>
                      <div
                        className="flex dark:text-dark-text">
                        <i className="fas fa-rss-square mr-2 leading-6 text-gray-500 dark:text-gray-400"></i>
                        <span>{follower} người theo dõi</span>
                      </div>
                      <div
                        className="flex dark:text-dark-text">
                        <i className="fas fa-user mr-2 leading-6 text-gray-500 dark:text-gray-400"></i>
                        <span>{teamData.members.length} thành viên <span className="text-blue-500 font-medium cursor-pointer" onClick={() => { setIsVisibleModal(true) }}>Xem</span></span>
                      </div>
                      <div className="text-lg space-x-3">
                        {teamData.social.map(e => (
                          <a href={e.link} target="_blank" rel="noreferrer">
                            {icon[e.type] && icon[e.type]}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
            </Row>
          </div>
        </div>

        <div className="container mx-auto xl:px-40">
          <RowAds top />
          <Row className="mx-auto" gutter={[20, 16]}>
            <Col xs={24} xl={16} className="py-2">
              <DynamicSection
                selector={
                  <Select className="w-40" defaultValue={"lightnovel"} onChange={(value) => setApiType(value)}>
                    <Option value="lightnovel">Novel</Option>
                    <Option value="manga">Manga</Option>
                  </Select>
                }
                data={data}
                pagination={true}
                getData={getNewList}
                apiType={apiType}
                isLoading={isLoading}
              />
            </Col>

            <Col xs={24} xl={8} className="py-2">
              <DynamicRank
                getRanking={{
                  manga: getTeamMangaRanking,
                  lightnovel: getTeamLightnovelRanking
                }}
                teamId={id}
                apiType={apiType} />
            </Col>
          </Row>

        </div>
        <RowAds top={false} />
        <Modal
          visible={isVisibleModal}
          footer={false}
          closable={false}
          wrapClassName="edit-profile-modal"
          keyboard={true}
          mask={true}
          maskClosable={true}
          onCancel={() => { setIsVisibleModal(false) }}
        >
          <div className="w-full rounded-lg bg-white">
            <div className="flex w-full p-2 border-b justify-between">
              <h5 className="font-bold text-2xl">Danh sách thành viên</h5>
              <button className="text-pink text-2xl px-2" onClick={() => { setIsVisibleModal(false) }}>
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
            <div className="overflow-y-auto list-member" >
              {teamData.members.map((mem, index) => (
                <Link href={userLink(mem.username)} >
                  <div wrap={false} className={`cursor-pointer hover:bg-gray-100 p-4 flex items-center ${index == teamData.members.length - 1 ? " rounded-b-lg" : ""}`}>
                    <ReactImageFallback
                      className="block rounded-full mr-5 w-16 h-16 ring-white ring-4"
                      src={mem.avatar}
                      fallbackImage="/img/defaultAvatar.jpg"
                      alt={mem.name}
                    />
                    <span className="text-lg font-medium">{mem.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Modal>
      </LayoutHome>
    )
  }
  return null
}

const Page = show
const mapStateToProps = (state) => ({
  data: state.page.newMangaList,
})

const mapDispatchToProps = {
  getNewMangaList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
