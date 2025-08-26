import React, { useState } from 'react'
import { Modal, Button, Form, Select, Input } from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import TextArea from 'antd/lib/input/TextArea'
import handleErrorApi from '@/utils/handleErrorApi'
import { deposit } from 'api/general'
import FormWithCaptcha from '../HOC/FormWithCaptcha'

export default function Deposit({ visible, setShowReportModal }) {
  const [isSubmitted, setSubmit] = useState(false)
  const [money, setMoney] = useState('')
  const onCapchaChange = () => {}
  const handleOk = () => {}

  const handleCancel = () => {
    setShowReportModal(false)
    setMoney('')
    setSubmit(false)
  }
  const handleSubmit = async () => {
    if (!isNaN(money) && parseInt(money) > 0) {
      try {
        const res = await deposit(money)
        if (res) {
          window.open(res)
          setSubmit(true)
        }
      } catch (err) {
        handleErrorApi(err)
      }
    }
  }
  return (
    <Modal
      title={!isSubmitted ? 'Yunecoin' : 'Hướng dẫn'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={true}
      footer={false}
    >
      {isSubmitted == true ? (
        <>
          <p className="text-red-500 text-semibold">
            *Thanh toán thành công bạn nhớ lưu lại mã giao dịch để đề phòng sai sót.
          </p>
          <div className="h-full w-full flex items-center justify-center overflow-hidden ">
            <img
              src="/img/hdnt.png"
              alt="Hướng dẫn"
              className="max-h-full max-w-full flex-shrink-0 "
            />
          </div>
        </>
      ) : (
        <FormWithCaptcha
          onSubmitCapture={handleSubmit}
          action={
            <Form.Item className="flex items-center justify-end text-right">
              <Button
                htmlType="submit"
                type="primary"
                className="bg-pink text-white border-none hover:bg-pink-dark ml-auto "
              >
                Đồng ý
              </Button>
              <Button htmlType="button" onClick={handleCancel} style={{ margin: '0 8px' }}>
                Hủy
              </Button>
            </Form.Item>
          }
        >
          <Form.Item>
            <label>Số tiền:</label>
            <Input
              min={20000}
              value={money}
              suffix="Yunecoin"
              type="number"
              onChange={(e) => setMoney(e.target.value)}
            />
          </Form.Item>
        </FormWithCaptcha>
      )}
    </Modal>
  )
}
