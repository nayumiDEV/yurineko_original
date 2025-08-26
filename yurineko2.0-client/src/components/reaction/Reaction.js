import handleErrorApi from '@/utils/handleErrorApi'
import { SmileOutlined } from '@ant-design/icons'
import {
  toggleCommentReactionV1,
  likeChapter,
  likeComment,
  unLikeChapter,
  unLikeComment,
} from 'api/general'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import ReactionModal from './ReactionModal'

export default function Reaction({ id, sourceType = 'comment', reactionInfo, userData }) {
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reactType, setReactType] = useState(
    userData?.reaction?.type == 'none' ? '' : userData?.reaction?.type
  )
  const [reactionData, setReactionData] = useState([])
  const [count, setCount] = useState('')

  let timeoutId = null

  const handleShow = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      setShow(true)
    }, 300)
  }

  const handleHide = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      setShow(false)
    }, 800)
  }

  const handleClick = (type) => {
    clearTimeout(timeoutId)
    setShow(false)

    if (sourceType == 'chapter') {
      handleLikeChapter(type)
    } else {
      handleLikeComment(type)
    }
  }

  const handleShowModal = () => {
    setVisible(true)
  }

  const handleLikeComment = async (type) => {
    try {
      if (reactType == false || reactType != type) {
        // await likeComment(id, type)
        await toggleCommentReactionV1({ commentID: id, type })
        setReactType(type)
        updateCount(reactType, -1)
        updateCount(type, 1)
      } else {
        await toggleCommentReactionV1({ commentID: id, type })
        updateCount(type, -1)
        setReactType('')
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const handleLikeChapter = async (type) => {
    try {
      if (reactType == false || reactType != type) {
        await likeChapter(id, type)
        setReactType(type)
        updateCount(reactType, -1)
        updateCount(type, 1)
      } else {
        await unLikeChapter(id)
        setReactType('')
        updateCount(type, -1)
        handleHide()
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const updateCount = (type, number) => {
    const index = reactionData.findIndex((item) => item.type == type)
    let newArr = reactionData
    if (index > -1) {
      reactionData[index] = {
        ...reactionData[index],
        reactionCount: reactionData[index].reactionCount + number,
      }
    } else if (type) {
      newArr.push({ type, reactionCount: 1 })
    }

    // const sortedData = _.sortBy([...newArr], 'reactionCount').reverse()
    setReactionData(newArr)
    let sum = 0
    newArr.forEach((item) => {
      sum = sum + item.reactionCount
    })
    setCount(sum)
  }

  useEffect(() => {
    if (reactionInfo) {
      const sortedData = _.sortBy([...reactionInfo], 'reactionCount').reverse()
      setReactionData(sortedData)
      let sum = 0
      sortedData.forEach((item) => {
        sum = sum + item.reactionCount
      })
      setCount(sum)
    }
  }, [reactionInfo])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId)
    }
  })

  return (
    <div className="relative flex justify-center items-center m-auto h-8 reaction-wrap w-full">
      <div
        className="mr-2 flex items-center justify-center cursor-pointer h-full max-w-none"
        onMouseOver={handleShow}
        onMouseLeave={handleHide}
        onClick={() => (reactType ? handleClick(reactType) : {})}
      >
        {reactType == 'love' && <img src="/reaction/Love.svg" className="w-6 h-6" />}
        {reactType == 'like' && <img src="/reaction/Like.svg" className="w-6 h-6" />}
        {reactType == 'haha' && <img src="/reaction/Haha.svg" className="w-6 h-6" />}
        {reactType == 'wow' && <img src="/reaction/Wow.svg" className="w-6 h-6" />}
        {reactType == 'angry' && <img src="/reaction/Angry.svg" className="w-6 h-6" />}
        {reactType == 'sad' && <img src="/reaction/Sad.svg" className="w-6 h-6" />}
        {reactType == 'what' && <img src="/reaction/Chamhoi.svg" className="w-6 h-6" />}
        {reactType == '' && (
          <SmileOutlined
            className={`text-lg text-gray-500 dark:text-dark-icon ${
              reactType ? 'text-pink-dark' : ''
            }`}
          />
        )}
      </div>

      {reactionData.filter((item) => item.reactionCount > 0).length > 0 && (
        <div
          className="bg-white dark:bg-dark border-2 dark:border-gray-500 rounded-full px-1 py-1 flex items-center w-22 justify-center cursor-pointer"
          onClick={handleShowModal}
        >
          <div className="flex items-center">
            {reactionData.filter((item) => item.reactionCount > 0).length > 0 &&
              reactionData
                .filter((item) => item.reactionCount > 0)
                ?.slice(0, 3)
                .map((item, index) => (
                  <img
                    key={item.type + item.reactionCount}
                    src={`/reaction/${
                      item.type == 'like'
                        ? 'Like'
                        : item.type == 'love'
                        ? 'Love'
                        : item.type == 'haha'
                        ? 'Haha'
                        : item.type == 'wow'
                        ? 'Wow'
                        : item.type == 'what'
                        ? 'Chamhoi'
                        : item.type == 'angry'
                        ? 'Angry'
                        : item.type == 'sad'
                        ? 'Sad'
                        : 'Like'
                    }.svg`}
                    className={`w-5 h-5 max-w-none`}
                  />
                ))}
            <span className={`ml-1 text-sm dark:text-dark-icon`}>
              {count < 1000 && count}
              {count >= 1000 && (count / 1000).toFixed(1) + 'K'}
            </span>
          </div>
        </div>
      )}

      <div
        className={`absolute w-80 bg-white dark:bg-dark shadow-md left-0 rounded-full justify-around flex items-center reaction ${
          show ? 'visible active' : 'invisible'
        }`}
        onMouseOver={handleShow}
        onMouseLeave={handleHide}
      >
        <div className="icon relative">
          <div className="absolute -top-full left-0 w-auto icon-name text-sm bg-gray-600 rounded-full py-0 px-2 text-center text-white">
            Thích
          </div>
          <img src="/reaction/Like.svg" className="w-10 h-10" onClick={() => handleClick('like')} />
        </div>
        <div className="icon relative">
          <div className="absolute -top-full w-auto icon-name text-sm bg-gray-600 rounded-full py-0 px-2 text-center text-white">
            Yêu
          </div>
          <img src="/reaction/Love.svg" className="w-10 h-10" onClick={() => handleClick('love')} />
        </div>
        <div className="icon relative">
          <div className="absolute -top-full w-auto icon-name text-sm bg-gray-600 rounded-full py-0 px-2 text-center text-white">
            Haha
          </div>
          <img src="/reaction/Haha.svg" className="w-10 h-10" onClick={() => handleClick('haha')} />
        </div>
        <div className="icon relative">
          <div className="absolute -top-full w-auto icon-name text-sm bg-gray-600 rounded-full py-0 px-2 text-center text-white">
            Wow
          </div>
          <img src="/reaction/Wow.svg" className="w-10 h-10" onClick={() => handleClick('wow')} />
        </div>
        <div className="icon relative">
          <div className="absolute -top-full w-auto icon-name text-sm bg-gray-600 rounded-full py-0 px-2 text-center text-white">
            Buồn
          </div>
          <img src="/reaction/Sad.svg" className="w-10 h-10" onClick={() => handleClick('sad')} />
        </div>
        <div className="icon relative">
          <div className="absolute -top-full w-20 icon-name text-sm bg-gray-600 rounded-full py-0 px-2 text-center text-white">
            Hỏi chấm
          </div>
          <img
            src="/reaction/Chamhoi.svg"
            className="w-10 h-10"
            onClick={() => handleClick('what')}
          />
        </div>
        <div className="icon relative">
          <div className="absolute -top-full w-20 icon-name text-sm bg-gray-600 rounded-full py-0 px-2 text-center text-white">
            Tức giận
          </div>
          <img
            src="/reaction/Angry.svg"
            className="w-10 h-10"
            onClick={() => handleClick('angry')}
          />
        </div>
      </div>

      <ReactionModal
        id={id}
        visible={visible}
        sourceType={sourceType}
        onCancel={() => setVisible(false)}
        reactionData={reactionData}
      />
    </div>
  )
}
