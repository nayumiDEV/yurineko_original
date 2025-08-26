import { Form, Divider, Input, Result, Button, message } from 'antd'
import React, { useState } from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { connect } from 'react-redux'
import { signUp } from '../../redux/actions'
import ReCAPTCHA from 'react-google-recaptcha'
import FBLogin from './FBLogin'
import FormWithCaptcha from '../HOC/FormWithCaptcha'

function SignUpForm({ responseFacebook, callback, ...props }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRePassword] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (password == repassword) {
      props.signUp({ email, password, username, name }, callback)
    } else {
      message.error('Mật khẩu không trùng khớp!')
    }
  }

  return (
    <>
      <FBLogin responseFacebook={responseFacebook} />
      <Divider orientation="center">hoặc</Divider>
      <FormWithCaptcha
        onSubmitCapture={handleLogin}
        action={
          <button
            htmlType="submit"
            className="bg-pink w-full block p-2 uppercase text-xl font-semibold text-white rounded flex items-center justify-center"
          >
            Đăng ký
          </button>
        }
      >
        <div className="my-4">
          <p className="text-gray text-md font-semibold">Email</p>
          <Input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
          />
        </div>
        <div className="my-4">
          <p className="text-gray text-md font-semibold">Tên hiển thị</p>
          <Input
            type="text"
            required
            minLength="3"
            title="Tên phải có ít nhất 3 kí tự"
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
          />
        </div>
        {/* <Form.Item
        name="username"
        rules={[
          {},
          {
            pattern: /^[a-z](?:[a-z0-9_.]+)*$/,
            message:
            'Username chỉ bao gồm chữ thường, số và dấu ".", "_", bắt đầu bằng một chữ thường.',
          },
        ]}
        >
        <div className="">
        <p className="text-gray text-md font-semibold">Username</p>
        <Input
        type="text"
        required
        minLength="3"
        onChange={(e) => setUsername(e.target.value)}
        title={`Tối thiểu 3 ký tự, chỉ bao gồm chữ thường, số và dấu ".", "_", bắt đầu bằng một chữ thường."`}
        className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
        />
        </div>
      </Form.Item> */}
        <Form.Item
          name="password"
          minLength="6"
          title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
        >
          <div className="">
            <p className="text-gray text-md font-semibold">Mật khẩu</p>
            <Input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
              className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
            />
          </div>
        </Form.Item>
        <Form.Item
          name="repassword"
          minLength="6"
          title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
        >
          <div className="">
            <p className="text-gray text-md font-semibold">Nhập lại mật khẩu</p>
            <Input
              type="password"
              required
              onChange={(e) => setRePassword(e.target.value)}
              minLength="6"
              title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
              className="p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
            />
          </div>
        </Form.Item>
      </FormWithCaptcha>
    </>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {
  signUp,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)
