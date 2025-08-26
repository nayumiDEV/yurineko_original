import LayoutHome from '@/layouts/Home'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { confirmEmail } from 'api/general'
import { message, Modal, Result } from 'antd'
import { loginSuccess } from '../../src/redux/actions'
import { connect } from 'react-redux'

function confirm({ ...props }) {
  const route = useRouter()
  const query = route.query
  const token = query.token ?? ''
  const [err, setErr] = useState('')
  const [user, setUser] = useState('')

  useEffect(async () => {
    try {
      if (token) {
        const res = await confirmEmail(token)
        props.loginSuccess(res)
        setUser(res)
      }
    } catch (err) {
      message.error('Lỗi khi xác thực')
      setErr(err)
    }
  }, [token])

  return (
    <>
      <div className="w-full h-full bg-gray-100 bg-opacity flex items-center justify-center overflow-hidden fixed top-0 left-0">
        <div className="w-48 h-48 flex items-center justify-center overflow-hidden">
          <img src="/img/cat-loading.svg" className="flex-shrink-0 max-w-full max-h-full" />
        </div>
      </div>
      {user && (
        <Modal visible={true} footer={false} closable={false}>
          <Result
            status="success"
            title="Xác minh tài khoản thành công!"
            subTitle="Chúc bạn có những giây phút vui vẻ với Yurineko.net."
            extra={[
              <Link href="/">
                <button className="bg-pink text-white p-2 w-24">Trang chủ</button>
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
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
  loginSuccess,
}

export default connect(mapStateToProps, mapDispatchToProps)(confirm)
