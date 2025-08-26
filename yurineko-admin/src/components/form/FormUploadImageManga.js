import React, { useEffect, useMemo, useState } from 'react'
import { UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { addChapter, editChapter } from '../../redux/actions/upload'
import axios from 'axios'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Radio,
  DatePicker,
  Select,
  Upload,
  Modal,
  message,
  Empty,
  Progress,
} from 'antd'
import { connect } from 'react-redux'
import { getChapterList, deleteChapter } from 'api/uploader'
import { ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

function FormUploadImageManga({ mangaID, ...props }) {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [editMode, setMode] = useState(false)
  const [chapterName, setChapterName] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [chapterList, setChapterList] = useState('')
  const [selectChapter, setChapter] = useState('')
  const [editChapter, setEditChapter] = useState('')
  const [progress, setProgress] = useState(0)

  const getChapter = async () => {
    try {
      setLoading(true)
      const res = await getChapterList(mangaID)
      setChapterList(res)
      if (res.length > 0) {
        setChapter(res[0])
      } else setChapter('')
      setLoading(false)
    } catch (e) {}
  }
  useMemo(async () => {
    try {
      await getChapter()
      setProgress(0)
    } catch (e) {}
  }, [mangaID])

  // useEffect(async()=>{})

  const changeMode = () => {
    setMode(!editMode)
    setProgress(0)
  }
  const changeModeEdit = () => {
    setEditChapter(selectChapter)
    setMode(true)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (editChapter) {
      handleUpdate(e)
    } else {
      handleUpload(e)
    }
  }
  const handleUpload = (e) => {
    if (chapterName && fileList.length > 0) {
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('chapter', file.originFileObj)
      })
      formData.append('mangaID', mangaID)
      formData.append('name', chapterName)
      props.addChapter(
        formData,
        () => {
          changeMode()
          handleClear()
          getChapter()
        },
        setProgress
      )
    }
  }

  const handleDelete = async () => {
    try {
      const res = await deleteChapter(selectChapter.id)
      getChapter()
    } catch (err) {
      message.error('Có lỗi xảy ra')
    }
  }

  const showConfirm = () => {
    confirm({
      title: 'Bạn có chắc muốn xóa chapter này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Dữ liệu bị xóa không thể phục hồi.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk() {
        handleDelete()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const handleUpdate = (e) => {
    // if (fileList.length > 0) {
    const formData = new FormData()
    fileList.sort(collator.compare).forEach((file) => {
      formData.append('chapter', file.originFileObj)
    })

    formData.append('mangaID', mangaID)
    if (chapterName && chapterName != editChapter) {
      formData.append('name', chapterName)
    }
    props.editChapter(
      {
        id: editChapter.id,
        formData,
      },
      async () => {
        handleClear()
        setMode()
        getChapter()
      },
      setProgress
    )
    // }
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }
  const handleCancel = () => setPreviewVisible(false)
  const handleChange = ({ fileList }) => setFileList(fileList)
  const handleClear = () => {
    setChapterName('')
    setFileList([])
  }

  const customAction = (file) =>
    new Promise(async (res, rej) => {
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
      }
    })
  console.log(progress)
  let collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  return (
    <div className="w-full modal-chapter overflow-y-hidden" style={{}}>
      {!isLoading && (
        <>
          {!editMode ? (
            <>
              <div className="w-full mb-2 flex">
                <div className="flex-1">
                  <button
                    className="w-full p-2 border-rounded bg-green-500 ml-auto block text-white"
                    onClick={() => {
                      changeMode()
                      setEditChapter('')
                      handleClear()
                    }}
                  >
                    + Thêm chapter
                  </button>
                </div>
                <div className="flex-3 flex ">
                  {selectChapter && (
                    <>
                      <div className="flex-1 text-center text-xl font-semibold">
                        {selectChapter.name}
                      </div>
                      <button
                        onClick={() => {
                          changeModeEdit()
                        }}
                        className="block ml-auto p-1"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => {
                          showConfirm()
                        }}
                        className="block ml-auto p-1"
                      >
                        <DeleteOutlined />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {chapterList && chapterList.length > 0 ? (
                <div className="flex item-center h-full">
                  <div className="flex-1 h-full overflow-y-auto">
                    <ul
                      style={{ maxHeight: 500 }}
                      className="h-auto w-full overflow-y-auto p-2 pb-12"
                    >
                      {chapterList &&
                        chapterList.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => setChapter(item)}
                            className="font-semibold hover:bg-gray-100 cursor-pointer py-2"
                          >
                            {item.name}
                            {item.maxID == 0 && (
                              <span className="text-yellow-500 ml-2 text-sm">
                                <i className="fas fa-exclamation-triangle"></i>
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="flex-3 m-0 h-full">
                    <div className="h-auto max-h-full w-full overflow-y-auto p-2 flex flex-wrap pb-12">
                      {selectChapter &&
                        selectChapter.url
                          .sort(collator.compare)
                          .map((item, index) => (
                            <img
                              key={index}
                              src={item}
                              alt="img"
                              className="manga-img border-rounded"
                            />
                          ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Empty className="h-full" description="Truyện chưa có chapter nào" />
              )}
            </>
          ) : (
            <>
              <div>
                <p
                  onClick={() => {
                    changeMode()
                    setEditChapter('')
                    handleClear()
                  }}
                  className="text-xs text-gray cursor-pointer hover:text-blue"
                >
                  Quay lại
                </p>
              </div>
              <Form name="nest-messages" className="md:max-w-3xl mx-auto">
                <h3 className="text-center font-semibold text-2xl mb-2">
                  {editChapter ? `Chỉnh sửa chapter: ${editChapter.name}` : 'Thêm chapter mới'}
                </h3>
                {editChapter && (
                  <p className="text-red-500 text-xs font-semibold">
                    Bỏ qua bước reup ảnh nếu chỉ đổi tên chapter
                  </p>
                )}
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Input
                    value={chapterName}
                    placeholder={editChapter?.name ?? 'Tên chapter'}
                    className="font-semibold"
                    onChange={(e) => setChapterName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <p className="text-red-500 text-xs font-semibold">
                    Ảnh đăng lên yurineko sẽ tự động được sắp xếp theo thứ tự tên ảnh, không phải
                    theo thứ tự chọn. Trình Preview chỉ để minh họa và không liên quan đến thứ tự
                    ảnh thực tế. Hỗ trợ dung lượng mỗi ảnh tối đa 7mb, tối đa 100mb mỗi chapter.
                  </p>
                  <div className="flex p-3 overflow-auto rounded border-dotted border-blue-300 w-100 h-80 border-2">
                    <Upload
                      action={customAction}
                      multiple={true}
                      listType="picture-card"
                      onPreview={handlePreview}
                      onChange={handleChange}
                      accept="image/png, image/jpeg"
                      defaultFileList={[...fileList]}
                      fileList={fileList.sort(collator.compare)}
                    >
                      <p>
                        <p>
                          <UploadOutlined />
                        </p>
                        <p>Upload</p>
                      </p>
                    </Upload>
                  </div>
                </Form.Item>
                {progress > 0 && <Progress percent={Math.round(progress)} status="active" />}
                <div className="block m-auto mt-3 flex items-center justify-center">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    className="m-2 flex items-center justify-center"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button
                    type="primary"
                    size="middle"
                    htmlType="submit"
                    onClick={handleSubmit}
                    className="m-2"
                  >
                    {editChapter ? 'Cập nhật' : 'Hoàn thành'}
                  </Button>
                </div>
              </Form>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </>
          )}
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
  addChapter,
  editChapter,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormUploadImageManga)
