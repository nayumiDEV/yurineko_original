import React, { useState, useEffect } from 'react'
import { Dropdown, Image, Menu } from 'antd'
import Emoji from '../menu/Emoji'
import { createCommentV1, getMentionSearchAhead, updateCommentV1, uploadImage } from 'api/general'
import handleErrorApi from '@/utils/handleErrorApi'
import { Mention, MentionsInput } from 'react-mentions'

const transformMention = (data = []) => data.reduce((prev, curr) => {
  prev[curr.mId] = curr.mName;
  return prev;
}, {});

export default function InputComment({
  mangaID,
  chapterID,
  replyID,
  handlePostSuccess,
  id,
  replyUser = null,
  isEdit = false,
  currentItem = null,
  onCancelEdit = () => { },
}) {
  const [isLoading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [file, setFile] = useState('')
  const [image, setImage] = useState('')
  const [visible, setVisible] = useState(false)
  const [mention, setMention] = useState({})

  const fetchSuggestions = (query, callback) => {
    if (!query) return;
    getMentionSearchAhead({ query })
      .then((res) => {
        setMention({ ...mention, ...transformMention(res) });
        return res.map((item) => ({ id: item.mId, display: item.mName, image: item.mAvatar }));
      }).then(callback);
  };

  const displayTransform = (id) => {
    if (mention[id]) return `@${mention[id]}`;
    return `@${id}`;
  };

  const renderSuggestions = (entry, search, highlightedDisplay, index, focused) => {
    const { id, display, image } = entry;
    return (
      <div className="flex p-2 rounded items-center dark:text-gray-50" key={id}>
        <img className="h-12 w-12 rounded-full mr-2" src={image} alt={display} />
        <span className="inline-block font-bold">{display}</span>
      </div>
    );
  };

  const handleKeydown = (event) => {
    if (event.keyCode == 13 && !event.shiftKey) {
      handleSubmit(event)
    }
  }

  const handleEmoji = (emoji) => {
    setContent(content + '[*' + emoji + '*]')
    setVisible(false)
  }

  const handleAddImage = async (event) => {
    try {
      const file = event.target.files[0]
      const resUpload = await handleUploadImage(file)
      setImage(process.env.BASE_STORAGE + '/' + resUpload?.path)
      setFile(resUpload)
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const handleUploadImage = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return uploadImage(formData)
  }

  const handleRemoveImage = () => {
    setImage('')
    setFile('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const contentToSubmit = content.trim();
    if (contentToSubmit.length == 0) {
      return alert('Bạn không thể comment nội dung trống!')
    }

    if (isEdit) return handleEdit(event)
    if (isLoading == false) {
      const data = {
        content: contentToSubmit,
        chapterId: chapterID == 0 ? null : parseInt(chapterID),
        mangaId: parseInt(mangaID),
        parentId: replyID == 0 ? null : parseInt(replyID),
      }

      if (file) {
        data['image'] = file?.path
      }

      setLoading(true)
      resetForm()
      createCommentV1(data)
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

  const handleEdit = async (event) => {
    event.preventDefault()

    if (isLoading == false) {
      const formData = new FormData()
      formData.append('content', content.trim())

      const data = {
        content: content.trim(),
      }

      if (file) {
        // change new file
        data['image'] = file?.path
      } else if (!image) {
        // remove current image
        data['image'] = null
      } else {
        // not change image
        data['image'] = undefined
      }

      setLoading(true)
      resetForm()
      updateCommentV1({ commentID: currentItem.id, data })
        .then((res) => {
          handlePostSuccess(res)
          onCancelEdit()
        })
        .catch((err) => {
          setLoading(false)
          if (isEdit) {
            setError('Cập nhật thất bại')
          } else {
            setError('Bình luận thất bại')
          }
          handleErrorApi(err)
        })
    }
  }

  const handleVisibleChange = (flag) => {
    setVisible(flag)
  }

  useEffect(() => {
    if (isEdit == true && currentItem) {
      setMention({ ...mention, ...transformMention(currentItem.mentionUser) });
      setContent(currentItem.content)
      setImage(currentItem.image)
    }
  }, [isEdit, currentItem])

  const resetForm = () => {
    setContent('')
    setFile('')
    setImage('')
    setError('')
    setLoading(false)
  }

  useEffect(() => {
    if (replyUser) {
      setMention({ ...mention, [replyUser.id]: replyUser.name });
      setContent(`<@#${replyUser.id}> `);
    }
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex-wrap px-2 py-2 flex rounded-3xl w-full mx-auto border-2 bg-white items-center mb-2">
          <MentionsInput
            className="mentions flex-grow"
            value={content}
            onChange={event => setContent(event.target.value)}
            onKeyDown={handleKeydown}
            allowSuggestionsAboveCursor={true}
            placeholder={isEdit ? 'Sửa bình luận' : 'Viết bình luận'}
            customSuggestionsContainer={children => <div className="bg-white dark:bg-gray-600 rounded">{children}</div>}
          >
            <Mention
              className="bg-blue-400"
              markup='<@#__id__>'
              data={fetchSuggestions}
              displayTransform={displayTransform}
              renderSuggestion={renderSuggestions}
              appendSpaceOnAdd />
          </MentionsInput>
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
        {isEdit && (
          <p className="mb-6 mt-2 ml-auto" onClick={onCancelEdit}>
            <span className="block ml-auto cursor-pointer text-sm text-gray-400">
              Huỷ cập nhật.
            </span>
          </p>
        )}
        {image && (
          <div className="mt-6 relative max-w-xs flex items-center justify-center overflow-hidden rounded-md bg-white mb-2">
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
