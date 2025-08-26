import LayoutHome from '@/layouts/Home'
import { Button, Col, Divider, Form, Input, Modal, Result, Row, Tabs } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import FacebookLogin from 'react-facebook-login'
import Link from 'next/link'
import LoginForm from '@/components/form/LoginForm'
import SignUpForm from '@/components/form/SignUpForm'
import PageLoading from '@/components/loading/PageLoading'
import { connect } from 'react-redux'
import { parseCookies } from '@/utils/parseCookie'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import isClient from '@/utils/isClient'
import withoutAuth from '@/components/HOC/withUnAuth'
import { loginFB } from '../src/redux/actions'
import BanModal from '@/components/modal/BanModal'

const { TabPane } = Tabs

function account({ refer, ...props }) {
  const route = useRouter()
  const [rendered, setRender] = useState(false)
  const [visible, setVisible] = useState(false)
  const [banned, setBanned] = useState(false)
  const user = useAuth()

  const responseFacebook = (response) => {
    const { userID, accessToken } = response
    if (userID && accessToken) {
      props.loginFB({ accessToken, facebookID: userID })
    }
    // if(response.)
  }
  useEffect(() => {
    setRender(true)
  }, [])

  useEffect(() => {
    if (props.banned) {
      setBanned(props.banned)
    }
  }, [props.banned])

  const fallback = route.query.url ?? '/'

  if (isClient()) {
    if (user && user.token) {
      route.replace(fallback, '', { shallow: true })
    }
  }

  return (
    <LayoutHome>
      <PageLoading />
      <Helmet>
        <title>Yuri Portal - Yuri Neko</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />
      </Helmet>
      <div className="container mx-auto xl:px-40 min-h-xl">
        <Row>
          <Col xs={24} md={12}>
            <div className="mt-4 md:pt-8 hidden md:flex items-start justify-center w-full h-full px-2">
              <div className="flex overflow-hidden justify-center align-center w-full max-w-md">
                <img
                  className="flex-shrink-0 max-w-full max-h-full"
                  src="/img/dangnhap.png"
                  alt="image"
                />
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mt-4 md:pt-8 w-full h-full w-full flex items-center justify-center mx-auto px-2">
              <div className="w-full login-tab">
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      <h2 className="p-0 text-pink-dark text-3xl uppercase font-semibold mb-2">
                        Đăng Nhập
                      </h2>
                    }
                    key="1"
                  >
                    <LoginForm responseFacebook={responseFacebook} />
                  </TabPane>
                  <TabPane
                    tab={
                      <h2 className="p-0 text-pink-dark text-3xl uppercase font-semibold mb-2">
                        Đăng Ký
                      </h2>
                    }
                    key="2"
                  >
                    <SignUpForm
                      responseFacebook={responseFacebook}
                      callback={() => setVisible(true)}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Modal visible={visible} footer={false} closable={true}>
        <Result
          status="success"
          title="Xác minh email để hoàn tất đăng ký"
          subTitle="Nhấp vào liên kết Yurineko gửi đến bạn qua hòm thư email để hoàn tất quá trình đăng ký."
          icon={
            <div className="flex items-center justify-center">
              <img src="/img/gmail-ico.png" />
            </div>
          }
          extra={[
            <Link href="/">
              <button className="bg-pink text-white p-2 w-24">Trang chủ</button>
            </Link>,
          ]}
        />
      </Modal>
      <BanModal banned={banned} onClose={() => setBanned(false)} />
    </LayoutHome>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
  banned: state.user.banned,
})

const mapDispatchToProps = {
  loginFB,
}

let Page = connect(mapStateToProps, mapDispatchToProps)(account)

export default withoutAuth(Page)
