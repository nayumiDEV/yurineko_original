import React, { useEffect, useState } from 'react'
import { Row, Col, message } from 'antd'
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
import PageLoading from '@/components/loading/PageLoading'
import UserBadge from '@/components/list/UserBadge'
import ReactImageFallback from 'react-image-fallback'
import BlockLoading from '@/components/loading/BlockLoading'
import { getProfile, getUserProfile } from 'api/general'
import GuestInfo from '@/components/tab/GuestInfo'
import handleErrorApi from '@/utils/handleErrorApi'

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

function profile({ user, ...props }) {
  const router = useRouter()
  const { id } = router.query
  const userId = id ? id[0] : ''
  const [isLoading, setLoading] = useState(true)
  const [userInfo, setInfo] = useState('')

  useEffect(async () => {
    // if (!user) {
    //   // props.getProfile()
    // }
    if (userId) {
      try {
        if (userId == user.id) return window.location.replace('/me')
        const res = await getUserProfile(userId)
        setInfo(res)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        handleErrorApi(e)
      }
    }
  }, [userId])

  const [activeTab, setActiveTab] = useState(1)

  const handleChangeTab = (key) => {
    setActiveTab(key)
  }
  return (
    <LayoutHome>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      {/* <PageLoading /> */}
      <div className="container xl:px-40 mx-auto h-full min-h-xl">
        {/* <p className="p-2 text-white text-center text-md font-semibold bg-pink-light md:hidden dark:bg-dark">
          Trang cá nhân
        </p> */}

        {isLoading ? (
          <BlockLoading isLoading={isLoading} />
        ) : (
          <Row className="" gutter={{ xs: 0, md: 12 }}>
            <GuestInfo user={userInfo} />
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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(profile)
