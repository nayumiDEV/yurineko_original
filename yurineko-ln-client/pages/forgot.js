import withoutAuth from '@/components/HOC/withUnAuth'
import PageLoading from '@/components/loading/PageLoading'
import LayoutHome from '@/layouts/Home'
import handleErrorApi from '@/utils/handleErrorApi'
import { Button, Col, Form, Input, Row } from 'antd'
import { message, Modal, Result } from 'antd'
import Link from 'next/link'
import { forgot, resetPw } from 'api/general'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import FormWithCaptcha from '@/components/HOC/FormWithCaptcha'
import GoogleAd from '@/components/ads/GGAds'

function Forgot() {
  const [isDone, setIsDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await forgot(email)
      setIsLoading(false)
      setIsDone(true)
    } catch (err) {
      handleErrorApi(err)
    }
  }
  const onCapchaChange = (e) => {
  }
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
                      disabled={isLoading}
                      htmlType="submit"
                      className=" bg-pink w-full block p-2 uppercase text-xl font-semibold text-white rounded flex items-center justify-center"
                    >
                      Xác nhận
                    </button>
                  }
                >
                  <p className="text-gray text-md font-semibold">Email</p>
                  <Input
                    type="email"
                    required
                    className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
            subTitle="Kiểm tra email và xác nhận lấy lại mật khẩu."
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

export default withoutAuth(Forgot)
