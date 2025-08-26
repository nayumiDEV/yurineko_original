import React, { Component, useState } from 'react'
import { Form, Input, InputNumber, Button, Radio, DatePicker, Select, Upload } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'

export default function FormUploadCoverManga() {
  const [fileList, setFileList] = useState([])
  const [imgData, setImgData] = useState('')

  const onPreview = async (e) => {
    const files = Array.from(e.target.files)
    // console.log('files:', files)
    const file = files[0]
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => resolve(reader.result)
      })
    }
    if(src){
        setImgData(src)
    }
  }
  return (
    <Form name="nest-messages" className="md:max-w-3xl mx-auto">
      <h3 className="text-center text-3xl m-3 font-bold">Thêm Thumbnail</h3>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="flex items-center justify-center flex-col overflow-hidden">
          <label
            htmlFor="avt"
            className="block rounded border-dotted border-blue-300 w-100 h-100 border-2 flex items-center justify-center"
            style={{ width: 200, height: 300 }}
          >
            {!imgData && (
              <p className="color-blue">
                <UploadOutlined style={{ fontSize: 35, color: '#3fd2f6' }} />
              </p>
            )}
            <ImgCrop>
            <input hidden type="file" id="avt" accept="*.jpg" onChange={onPreview} />
            </ImgCrop>
            {imgData && <img src={imgData} />}
          </label>
        </div>
        <Button type="primary" size="middle" htmlType="submit" className="block m-auto mt-3">
          Hoàn thành
        </Button>
      </Form.Item>
    </Form>
  )
}
