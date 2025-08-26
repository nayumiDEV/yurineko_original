import { Form, Divider, Input } from 'antd'
import React, { useState } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'
import FBLogin from './FBLogin'

function LoginForm({ responseFacebook, isLoading, ...props }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    props.login({ email, password })
  }

  return (
    <>
      <FBLogin responseFacebook={responseFacebook} />
      <Form onSubmitCapture={handleLogin}>
        <Divider orientation="center" className="text-gray">
          hoặc
        </Divider>
        <Form.Item>
          <div className="my-4">
            <p className="text-gray text-md font-semibold">Email</p>
            <Input
              type="email"
              name="email"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
            />
          </div>
        </Form.Item>
        <Form.Item>
          <div className="my-4">
            <p className="text-gray text-md font-semibold">Mật khẩu</p>
            <Input
              type="password"
              name="password"
              required
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
            />
          </div>
        </Form.Item>

        {/* <div className="h-24 w-full bg-pink my-3"></div> */}
        <Link href="/forgot">
          <a className="flex mt-4 justify-end ml-auto font-semibold text-gray-dark">Quên mật khẩu?</a>
        </Link>
        <Form.Item>
          <button
            htmlType="submit"
            className="bg-pink w-full block p-2 uppercase text-xl font-semibold text-white rounded flex items-center justify-center"
          >
            Đăng nhập
          </button>
        </Form.Item>
      </Form>
    </>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {
  login,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
