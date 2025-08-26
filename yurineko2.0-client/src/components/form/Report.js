import React, { useState } from 'react'
import { Modal, Button, Form, Select, Result } from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import TextArea from 'antd/lib/input/TextArea'
import { report } from 'api/general'
import handleErrorApi from '@/utils/handleErrorApi'
import FormWithCaptcha from '../HOC/FormWithCaptcha'

export default function Report({ visible, setShowReportModal, mangaID, chapterID }) {
  const [type, setType] = useState(1)
  const [detail, setDetail] = useState('')
  const [isSubmit, setSubmit] = useState(false)

  const onCapchaChange = () => {}
  const handleOk = () => {}

  const handleCancel = () => {
    setSubmit(false)
    setDetail('')
    setType(1)
    setShowReportModal(false)
  }
  const handleSubmit = async () => {
    try {
      const res = await report({ chapterID, mangaID, type, detail })
      if (res) {
        // setShowReportModal(false)
        setSubmit(true)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  return (
    <Modal
      title="Báo lỗi truyện"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={true}
      footer={false}
    >
      {isSubmit ? (
        <Result status="success" title="Báo lỗi thành công!" subTitle="Cảm ơn bạn đã báo lỗi." />
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
                Gửi
              </Button>
              <Button htmlType="button" style={{ margin: '0 8px' }} onClick={handleCancel}>
                Đóng
              </Button>
            </Form.Item>
          }
        >
          <Form.Item>
            <Select
              name="type"
              style={{ width: '100%' }}
              value="1"
              onChange={(value) => setType(value)}
            >
              <Select.Option value="1">Lỗi ảnh, không load được ảnh</Select.Option>
              <Select.Option value="2">Sai thứ tự chapter</Select.Option>
              <Select.Option value="3">Chapter bị trùng</Select.Option>
              <Select.Option value="4">Up sai truyện</Select.Option>
              <Select.Option value="5">Chapter chưa dịch (RAW)</Select.Option>
              <Select.Option value="6">Lỗi khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <label>Mô tả</label>
            <TextArea onChange={(e) => setDetail(e.target.value)} />
          </Form.Item>
        </FormWithCaptcha>
      )}
    </Modal>
  )
}
