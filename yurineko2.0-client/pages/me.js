import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import LayoutHome from '@/layouts/Home'
import UserAccount from '@/components/tab/UserAccount'
import UserNotify from '@/components/tab/UserNotify'
import UserBlacklist from '@/components/tab/UserBlacklist'
import UserInfo from '@/components/tab/UserInfo'
import { AdminTag, PremiumTag, UploadTag } from '@/components/tag/UserTag'
import { Helmet } from 'react-helmet'
import { useRouter } from 'next/router'
import withAuth from '@/components/HOC/withAuth'
import { connect } from 'react-redux'
import { getProfile } from '../src/redux/actions'
import PageLoading from '@/components/loading/PageLoading'
import UserBadge from '@/components/list/UserBadge'
import ReactImageFallback from 'react-image-fallback'
import BlockLoading from '@/components/loading/BlockLoading'

const menu = [
  {
    key: 1,
    route: 'adasda',
    name: 'Trang cá nhân',
    component: <UserInfo />,
  },
  {
    key: 2,
    route: 'security',
    name: 'Tài khoản',
    component: <UserAccount />,
  },
  {
    key: 3,
    route: 'notification',
    name: 'Thông báo',
    component: <UserNotify />,
  },
  {
    key: 4,
    route: 'black-list',
    name: 'Blacklist tags',
    component: <UserBlacklist />,
  },
]

function me({ user, isLoading, ...props }) {
  const router = useRouter()
  const { id } = router.query
  const userId = id ? id[0] : ''

  useEffect(() => {
    if (!user) {
      // props.getProfile()
    }
  }, [])

  const [activeTab, setActiveTab] = useState(1)

  const handleChangeTab = (key) => {
    setActiveTab(key)
  }
  return (
    <LayoutHome>
      <Helmet>
        <title>Profile</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />

      </Helmet>
      {/* <PageLoading /> */}
      <div className="container xl:px-40 mx-auto h-full min-h-xl">
        <p className="p-2 text-white text-center text-md font-semibold bg-pink-light md:hidden dark:bg-dark">
          Trang cá nhân
        </p>

        {isLoading ? (
          <BlockLoading isLoading={isLoading} />
        ) : (
          <Row className="" gutter={{ xs: 0, md: 12 }}>
            <Col xs={24} md={8}>
              <div className="p-2 px-2 md:px-2 md:border-r md:border-r-gray-500 h-full">
                <div className="p-2 bg-gray-400 dark:bg-dark-black text-white dark:text-dark-text rounded-md flex items-center">
                  <div className="p-2">
                    <div
                      className="ring ring-white flex items-center justify-center overflow-hidden rounded-full cursor-pointer"
                      style={{ width: 50, height: 50 }}
                    >
                      <ReactImageFallback
                        className="min-w-full min-h-full block flex-shrink-0"
                        src={user.avatar}
                        alt="logo"
                        fallbackImage="/img/defaultAvatar.jpg"
                      />
                    </div>
                  </div>
                  <div className="ml-2">
                    <p className="text-md font-semibold mb-1">{user.name}</p>
                    <div className="mb-1">
                      <UserBadge user={user} />
                    </div>
                    <p className="font-semibold mb-1">
                      <i className="fas fa-coins"></i> {user.money} Yunecoin
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <ul className="p-0">
                    {menu.map((item) => (
                      <li
                        key={item.key}
                        onClick={() => handleChangeTab(item.key)}
                        className={`${
                          item.key == activeTab ? 'border-l-4 border-blue text-blue' : ''
                        } bg-gray-700 text-md p-2 text-white font-semibold rounded-md flex items-center justify-center mb-1 cursor-pointer`}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <div className="p-2 md:px-0">
                {menu.map((item) => {
                  if (item.key == activeTab) return item.component
                  else return null
                })}
              </div>
            </Col>
          </Row>
        )}
      </div>
    </LayoutHome>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {
  getProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(me))
