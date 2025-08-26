import handleErrorApi from '@/utils/handleErrorApi'
import { Form, Input, message, Modal } from 'antd'
import { changePassword, editUsername } from 'api/general'
import React, { useState, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import FormWithCaptcha from '../HOC/FormWithCaptcha'
import PageLoading from '../loading/PageLoading'

function UserAccount({ user }) {
  const [visible, setVisible] = useState(false)
  const [repassword, setRepassword] = useState('')
  const [password, setPassword] = useState('')
  const [oldPass, setOldPass] = useState('')
  const [isEditting, setEditting] = useState(false)
  const [username, setUsername] = useState('')

  const showModal = () => {
    setVisible(true)
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (password == repassword) {
        await changePassword({ oldPass, password })
        setVisible(false)
      } else message.error('Mật khẩu không trùng khớp!')
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }
  const handleUpdateUsername = async (e) => {
    try {
      message.loading('Loading...')
      await editUsername({
        username,
      })
      setEditting(false)
      message.success('Cập nhật thành công!')
    } catch (err) {
      handleErrorApi(err)
    }
  }

  useEffect(() => {
    setUsername(user.username)
  }, [user])

  if (user)
    return (
      <>
        <PageLoading />
        <div className="rounded-md bg-blue-200 dark:text-dark-text dark:bg-dark-gray flex flex-col">
          <div className="flex items-center border-b border-gray-300 ">
            <span className="w-32 rounded-md leading-tight text-md bg-blue-300 dark:bg-dark-black font-semibold p-3 flex items-center justify-center">
              Username:
            </span>
            <span className="flex-1 text-md leading-tight font-semibold p-3 flex items-center justify-start">
              {isEditting == false ? (
                <>
                  {username}
                  <button
                    onClick={() => {
                      setEditting(true)
                      setUsername(user.username)
                    }}
                    className="text-blue-500 font-bold"
                  >
                    Thay đổi
                  </button>
                </>
              ) : (
                <>
                  <Form onFinish={handleUpdateUsername} className="max-w-xs w-full">
                    <Form.Item
                      name="username"
                      className="my-0 mb-2 inline max-w-xs w-full"
                      // hasFeedback={true}
                      // noStyle={true}
                      rules={[
                        {},
                        {
                          pattern: /^[a-z](?:[a-z0-9_.]+)*$/,
                          message:
                            'Tối thiểu 3 ký tự, chỉ bao gồm chữ thường, số và dấu ".", "_", bắt đầu bằng một chữ thường.',
                        },
                      ]}
                    >
                      <input
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        className="p-2 w-full"
                      />
                    </Form.Item>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setEditting(false)
                          setUsername(user.username)
                        }}
                        className="mr-2 my-2 bg-gray-500 text-white px-4 py-1 rounded inline"
                      >
                        Huỷ
                      </button>
                      <button
                        type={'submit'}
                        className="my-2 bg-pink-dark text-white px-4 py-1 rounded inline"
                      >
                        Lưu
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </span>
          </div>
          <div className="flex items-center border-b border-gray-300 ">
            <span className="w-32 rounded-md leading-tight text-md bg-blue-300 dark:bg-dark-black font-semibold p-3 flex items-center justify-center">
              Email:
            </span>
            <span className="flex-1 text-md leading-tight font-semibold p-3 flex items-center justify-start">
              {user.email}
            </span>
          </div>
          <div className="flex items-center border-b border-r-gray-500">
            <span className="w-32 rounded-md leading-tight text-md bg-blue-300 dark:bg-dark-black font-semibold p-3 flex items-center justify-center">
              Mật khẩu:
            </span>
            <span className="flex-1 text-md leading-tight font-semibold p-3 flex items-center justify-start">
              ******
              <button onClick={showModal} className="text-blue-500 font-bold">
                Đổi mật khẩu
              </button>
            </span>
          </div>
          <Modal footer={false} title="Đổi mật khẩu" visible={visible} onCancel={handleCancel}>
            <FormWithCaptcha
              onSubmitCapture={handleSubmit}
              action={
                <button
                  htmlType="submit"
                  className=" bg-pink w-full block p-2 uppercase text-xl font-semibold text-white rounded flex items-center justify-center"
                >
                  Cập nhật
                </button>
              }
            >
              <Form.Item name="password">
                <p className="text-gray text-md font-semibold">Mật khẩu hiện tại</p>
                <Input
                  type="password"
                  required
                  value={oldPass}
                  placeholder="Nhập mật khẩu"
                  className="my-2 mb-0 p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
                  onChange={(e) => setOldPass(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="new_password"
                minLength="6"
                title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
              >
                <div className="">
                  <p className="text-gray text-md font-semibold">Mật khẩu mới</p>
                  <Input
                    type="password"
                    required
                    value={password}
                    placeholder="Nhập mật khẩu mới"
                    minLength="6"
                    title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
                    className="my-2 mb-0 p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="re_password"
                minLength="6"
                title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
              >
                <div className="">
                  <p className="text-gray text-md font-semibold">Xác nhận</p>
                  <Input
                    type="password"
                    required
                    value={repassword}
                    placeholder="Xác nhận mật khẩu"
                    minLength="6"
                    title="Tối thiểu tám ký tự, ít nhất một chữ cái, một số, một ký tự đặc biệt"
                    className="my-2 mb-0 p-2 rounded focus:border-pink hover:border-pink focus:shadow-none"
                    onChange={(e) => setRepassword(e.target.value)}
                  />
                </div>
              </Form.Item>
            </FormWithCaptcha>
          </Modal>
        </div>
      </>
    )
  else return null
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)
