import withoutAuth from '@/components/HOC/withUnAuth'
import BlockLoading from '@/components/loading/BlockLoading'
import PageLoading from '@/components/loading/PageLoading'
import LayoutHome from '@/layouts/Home'
import handleErrorApi from '@/utils/handleErrorApi'
import { message, Modal, Result } from 'antd'
import { Button, Col, Form, Input, Row } from 'antd'
import { resetPw } from 'api/general'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import Link from 'next/link'
import FormWithCaptcha from '@/components/HOC/FormWithCaptcha'
import GoogleAd from '@/components/ads/GGAds'

function Reset() {
  const [isDone, setIsDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState('')
  const [password, setPassword] = useState('')
  const [repass, setRepass] = useState('')

  const route = useRouter()
  const query = route.query
  const token = query.token ?? ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (password == repass) {
        setIsLoading(true)
        await resetPw({ token: token, password: password })
        setIsLoading(false)
        setIsDone(true)
      }
    } catch (err) {
      setErr(err)
      message.error('Lỗi khi xác thực')
      // handleErrorApi(err)
    }
  }
  const onCapchaChange = (e) => {}
  return (
    <LayoutHome>
      <GoogleAd />
      <Helmet>
        <title>Quên mật khẩu</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />

      </Helmet>
      <PageLoading isLoading={isLoading} />
      <div className="container mx-auto xl:px-40 mt-4">
        <Row>
          <Col xs={24} md={12}>
            <div className="hidden md:flex items-center justify-center w-full h-full p-2">
              <div className="flex overflow-hidden justify-center align-center w-full max-w-md">
                <img
                  className="flex-shrink-0 max-w-full max-h-full"
                  src="/img/quenmatkhau.png"
                  alt="image"
                />
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="w-full h-full w-full max-w-md flex items-center justify-center mx-auto p-2">
              <div className="w-full">
                <h2 className="p-0 text-pink-dark text-3xl uppercase font-semibold mb-2">
                  Quên mật khẩu
                </h2>
                {/* <p className="text-red-500 border-l-2 border-red-500 px-2 py-1 leading-none">
                  Vui lòng nhập email của bạn
                </p> */}
                <FormWithCaptcha
                  onSubmitCapture={handleSubmit}
                  action={
                    <button
                      htmlType="submit"
                      className=" bg-pink w-full block p-2 uppercase text-xl font-semibold text-white rounded flex items-center justify-center"
                    >
                      Xác nhận
                    </button>
                  }
                >
                  <Form.Item
                    name="password"
                    minLength="6"
                    title='Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt'
                  >
                    <div>
                      <p className="text-gray text-md font-semibold">Mật khẩu</p>
                      <Input
                        type="password"
                        required
                        placeholder="Nhập mật khẩu"
                        minLength="6"
                        title='Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt'
                        className="my-2 p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="re_password"
                    minLength="6"
                    title='Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt'
                  >
                    <div>
                      <p className="text-gray text-md font-semibold">Xác nhận</p>

                      <Input
                        type="password"
                        required
                        placeholder="Xác nhận mật khẩu"
                        minLength="6"
                        title='Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt'
                        className="my-2 p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
                        onChange={(e) => setRepass(e.target.value)}
                      />
                    </div>
                  </Form.Item>
                </FormWithCaptcha>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {isDone && (
        <Modal visible={true} footer={false} closable={false}>
          <Result
            status="success"
            title="Thành công!"
            subTitle="Thay đổi mật khẩu thành công."
            extra={[
              <Link href="/account">
                <button className="bg-pink text-white p-2 w-24">Đăng nhập</button>
              </Link>,
            ]}
          />
        </Modal>
      )}
      {err && (
        <Modal visible={true} footer={false} closable={false}>
          <Result
            status="error"
            title="Xác minh tài khoản thất bại!"
            subTitle="Đường dẫn hết hạn hoặc bị sai"
            extra={[
              <Link href="/">
                <button className="bg-pink text-white p-2 w-24">Trang chủ</button>
              </Link>,
            ]}
          />
        </Modal>
      )}
    </LayoutHome>
  )
}

export default withoutAuth(Reset)
