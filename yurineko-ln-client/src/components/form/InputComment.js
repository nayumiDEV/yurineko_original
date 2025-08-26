import React, { useRef, useState, useEffect } from 'react'
import { Picker } from 'emoji-mart'
import { Dropdown, Image, Menu } from 'antd'
import Emoji from '../menu/Emoji'
import axios from 'axios'
import { postComment } from 'api/general'
import handleErrorApi from '@/utils/handleErrorApi'

export default function InputComment({
  mangaID,
  chapterID,
  replyID,
  handlePostSuccess,
  id,
  tagName = '',
}) {
  const [isLoading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [file, setFile] = useState('')
  const [image, setImage] = useState('')
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  const changeComment = (event) => {
    if (event.target.innerHTML == '<br>') event.target.innerHTML = ' '
    if (event.target.innerHTML.length == 0) {
      event.target.innerHTML = ' '
    }
    setContent(event.target.innerHTML.replace(/\&nbsp;/g, ''))
  }

  const handleKeydown = (event) => {
    //   console.log(event.keyCode)
    if (event.keyCode == 13 && !event.shiftKey) {
      handleSubmit(event)
    }

    //   event.target.innerHTML = event.target.innerHTML.trim()
  }

  const handleEmoji = (emoji) => {
    ref.current.append('[*' + emoji + '*]')
    setContent(ref.current.innerHTML)
    setVisible(false)
  }

  const handleAddImage = async (event) => {
    const file = event.target.files[0]
    setFile(file)
    var reader = new FileReader()
    var url = reader.readAsDataURL(file)
    reader.onloadend = function (e) {
      setImage(reader.result)
    }
  }

  const handleRemoveImage = () => {
    setImage('')
    setFile('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isLoading == false) {
      const formData = new FormData()
      formData.append('content', content.trim())
      formData.append('chapterID', chapterID)
      formData.append('lightnovelID', mangaID)
      formData.append('replyID', replyID)
      if (file) {
        formData.append('image', file)
      }
      setLoading(true)
      resetForm()
      postComment(formData)
        .then((res) => {
          handlePostSuccess(res)
        })
        .catch((err) => {
          setLoading(false)
          setError('Bình luận thất bại')
          handleErrorApi(err)
        })
    }
  }

  const handleVisibleChange = (flag) => {
    setVisible(flag)
  }

  useEffect(() => {
    function handleFunction(e) {
      // cancel paste
      e.preventDefault()

      // get text representation of clipboard
      var text = (e.originalEvent || e).clipboardData.getData('text/plain')

      // insert text manually
      document.execCommand('insertHTML', false, text)
    }

    ref.current.addEventListener('paste', handleFunction)
    return () => {
      if (ref.current) ref.current.removeEventListener('paste', handleFunction)
    }
  }, [])

  const resetForm = () => {
    setContent('')
    setFile('')
    setImage('')
    setError('')
    setLoading(false)
    ref.current.innerHTML = ''
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="mb-6 flex-wrap px-2 py-2 flex rounded-3xl w-full mx-auto border-2 bg-white items-center">
          {tagName && (
            <div className="">
              <span className="text-blue-500">{`@${tagName}`}</span>
            </div>
          )}
          <div
            className="px-1 input-comment max-w-full min-w-3/4 relative"
            onInput={changeComment}
            contentEditable={true}
            placeholder="Viết bình luận..."
            onKeyDown={handleKeydown}
            role="textbox"
            ref={ref}
          ></div>
          <div className="flex w-24 items-center justify-center self-end justify-self-end ml-auto">
            <Dropdown
              overlay={<Emoji handleEmoji={handleEmoji} />}
              trigger={['click']}
              placement="topCenter"
              arrow={true}
              visible={visible}
              onVisibleChange={handleVisibleChange}
            >
              <button className="text-md text-gray mx-2 hover:text-gray">
                <i className="far fa-laugh"></i>
              </button>
            </Dropdown>
            <label htmlFor={id} className="text-md text-gray mx-2 hover:text-gray">
              <i className="fas fa-file-image"></i>
            </label>
            <button className="text-md text-gray mx-2 hover:text-gray" type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
            <input
              type="file"
              hidden
              id={id}
              onChange={handleAddImage}
              name="image"
              accept=".png, .jpg, .jpeg"
              multiple={false}
            />
          </div>
        </div>
        {image && (
          <div className="relative max-w-xs mt-1 flex items-center justify-center overflow-hidden rounded-md bg-white">
            <Image
              preview={false}
              className="max-w-full max-h-full flex-shrink-0"
              src={image}
              alt="image"
            />
            <button
              className="absolute top-2 right-2 text-white text-md hover:text-pink"
              onClick={handleRemoveImage}
            >
              <i className="far fa-times-circle"></i>
            </button>
          </div>
        )}
      </form>
    </>
  )
}
