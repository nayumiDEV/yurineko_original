import handleErrorApi from '@/utils/handleErrorApi'
import { DatePicker, Form, Input, message, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { editProfile, uploadAvatar, uploadCover } from 'api/general'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ReactImageFallback from 'react-image-fallback'
import { connect } from 'react-redux'
import { getProfile } from '../../redux/actions'

function FormEditUser({ user, handleCloseModal, ...props }) {
  const [cover, setCover] = useState('')
  const [avatar, setAvatar] = useState('')

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [love, setLove] = useState('')
  const [bio, setBio] = useState('')
  const [shortBio, setShortBio] = useState('')
  const [placeOfBirth, setPlaceOfBirth] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [editImage, setEditManga] = useState(false)

  useEffect(() => {
    setName(user.name)
    setUsername(user.username)
    setLove(user.love)
    setBio(user.bio)
    setShortBio(user.shortBio)
    setPlaceOfBirth(user.place_of_birth)
    setDob(user.dob)
    setGender(user.sex)
  }, [user])

  async function uploadImage(type, file) {
    try {
      const formData = new FormData()
      formData.append(type, file)
      message.loading('Uploading')

      if (type == 'avatar') {
        uploadAvatar(formData)
      }
      if (type == 'cover') {
        uploadCover(formData)
      }
      setEditManga(true)
    } catch (e) {
      handleErrorApi(e)
      // message.error('Có lỗi xảy ra.')
    }
  }

  const reset = () => {
    setName('')
    setUsername('')
    setLove('')
    setBio('')
    setShortBio('')
    setPlaceOfBirth('')
    setDob('')
    setGender('')
  }
  const customAction = (type, { file }) => {
    uploadImage(type, file)
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
        if (type == 'avatar') {
          setAvatar(src)
        }
        if (type == 'cover') {
          setCover(src)
        }
      }
    })
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

  const handleSubmit = async () => {
    message.loading('Uploading...')
    editProfile({
      name,
      love,
      bio,
      shortBio,
      gender,
      dob: dob.length > 10 ? moment(dob).format('DD/MM/YYYY') : dob,
      placeOfBirth,
    })
      .then((res) => {
        handleCloseModal()
        props.getProfile()
        reset()
      })
      .catch((err) => {
        handleErrorApi(err)
      })
    // console.log(name)
  }
  const handleClose = () => {
    // reset()
    handleCloseModal()
    if (editImage) {
      props.getProfile()
    }
  }
  return (
    <div className="p-2 w-full rounded-2xl bg-white ">
      <div className="flex justify-between items-center mb-2">
        <div className="flex">
          <button className="text-pink text-md mr-2" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
          <h2 className="text-md font-semibold">Chỉnh sửa hồ sơ</h2>
        </div>
        <button onClick={handleSubmit} className="px-2 py-1 rounded-md bg-pink text-white">
          Lưu
        </button>
      </div>
      <div className="">
        <div>
          <div className="flex items-center justify-center rounded-md max-h-55 overflow-hidden ">
            <ImgCrop aspect={2.25} modalTitle="Chỉnh sửa ảnh">
              <Upload
                customRequest={(props) => customAction('cover', props)}
                multiple={false}
                showUploadList={false}
                listType={false}
                beforeUpload={beforeUpload}
                accept="image/png, image/jpeg"
              // disabled={isLoading}
              >
                <ReactImageFallback
                  className="hover:opacity-70 max-w-full max-h-full flex-shrink-0"
                  src={cover ? cover : user.cover}
                  alt="cover"
                  fallbackImage={process.env.BANNER_PROFILE}
                />
              </Upload>
            </ImgCrop>
          </div>
          <div
            className="my-2 ring-4 ring-white flex items-center justify-center overflow-hidden rounded-full cursor-pointer transform -translate-y-8 translate-x-4"
            style={{ width: 60, height: 60 }}
          >
            <ImgCrop aspect={1} modalTitle="Chỉnh sửa ảnh">
              <Upload
                className="h-full"
                customRequest={(props) => customAction('avatar', props)}
                multiple={false}
                showUploadList={false}
                listType={false}
                beforeUpload={beforeUpload}
                accept="image/png, image/jpeg"
              // disabled={isLoading}
              >
                <ReactImageFallback
                  className="hover:opacity-70 min-w-full min-h-full flex-shrink-0"
                  src={avatar ? avatar : user.avatar}
                  alt="logo"
                  fallbackImage="/img/defaultAvatar.jpg"
                />
              </Upload>
            </ImgCrop>
          </div>
        </div>
        <Form className="transform -translate-y-4 modal-form-edit">
          <div className="border rounded-md px-2 py-1 mb-2 flex flex-col">
            <label className="text-gray-dark leading-tight">Tên</label>
            <input value={name} placeholder="Nhập tên" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="border rounded-md px-2 py-1 mb-2 flex flex-col">
            <label className="text-gray-dark leading-tight">Giới tính</label>
            <select defaultValue={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="0">Nữ</option>
              <option value="1">Nam</option>
              <option value="2">Khác</option>
            </select>
          </div>
          <div className="border rounded-md px-2 py-1 mb-2 flex flex-col">
            <label className="text-gray-dark leading-tight">Sở thích</label>
            <input value={love} placeholder="" onChange={(e) => setLove(e.target.value)} />
          </div>
          <div className="border rounded-md px-2 py-1 mb-2 flex flex-col">
            <label className="text-gray-dark leading-tight">Ngày sinh</label>
            <DatePicker
              placeholder={moment(dob).format('DD/MM/YYYY')}
              format="DD/MM/YYYY"
              className="border-none focus:border-transparent px-0 py-0"
              onChange={(date, datestring) => {
                setDob(datestring)
              }}
            />

            {/* <input value={dob} type="date" onChange={(e) => setDob(e.target.value)} /> */}
          </div>
          <div className="border rounded-md px-2 py-1 mb-2 flex flex-col">
            <label className="text-gray-dark leading-tight">Vị trí</label>
            <input value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} />
          </div>
          <div className="border rounded-md px-2 py-1 mb-2 flex flex-col">
            <label className="text-gray-dark leading-tight">Mô tả</label>
            <input value={shortBio} onChange={(e) => setShortBio(e.target.value)} />
          </div>
          <div className="border rounded-md px-2 py-1 mb-2 flex flex-col">
            <label className="text-gray-dark leading-tight">Giới thiệu</label>
            <input value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </Form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {
  getProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormEditUser)
