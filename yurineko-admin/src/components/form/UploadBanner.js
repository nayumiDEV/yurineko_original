import React, { useState } from 'react'
import ImgCrop from 'antd-img-crop'
import { Upload, Button, message } from 'antd'
import { adminUploadBanner } from '../../redux/actions'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function UploadBanner({ name, isLoading, ...props }) {
  const [selectedImg, setSelectedImg] = useState('')

  const customAction = ({file}) => {
    handleUpload(file)
    return new Promise(async (res, rej) => {
      let src = file.url
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
        })
      }
      if (src) {
        res(src)
        setSelectedImg(src)
      }
    })
  }
  
  const handleUpload = (file) => {
    const formData = new FormData()
    formData.append(name, file)
    props.adminUploadBanner(formData)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('Chỉ chấp nhận JPG/PNG file!')
    }
    const isLt7M = file.size / 1024 / 1024 < 7
    if (!isLt7M) {
      message.error('Kích thước phải bé hơn 7MB')
    }
    return isJpgOrPng && isLt7M
  }
  return (
    <div>
      <div className="flex justify-end items-center">
        <ImgCrop aspect={4.5} modalTitle="Chỉnh sửa ảnh">
          <Upload
            customRequest={customAction}
            multiple={false}
            showUploadList={false}
            listType={false}
            beforeUpload={beforeUpload}
            accept="image/png, image/jpeg"
            disabled={isLoading}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </ImgCrop>
      </div>

      <div>
        <div className="mx-auto block w-100 flex items-center justify-center">
          <img
            className="w-100 block hover:opacity-50 hover:bg-red-700 cursor-pointer"
            src={selectedImg ? selectedImg : '/img/placeholder-banner.jpeg'}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {
  adminUploadBanner,
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadBanner)
