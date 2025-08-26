import handleErrorApi from '@/utils/handleErrorApi'
import parseCommentToHtml from '@/utils/parseCommentToHtml'
import { timeFromNow } from '@/utils/timeUpdate'
import { Image, Pagination } from 'antd'
import { deleteComment, getComment } from 'api/general'
import React, { useRef, useState, useEffect } from 'react'
import ReactImageFallback from 'react-image-fallback'
import InputComment from '../form/InputComment'
import Heart from '../like/Heart'
import { RoleName } from '../tag/Text'
import Link from 'next/link'
import { userLink } from '@/utils/generateLink'

export default function Comment({ mangaID, chapterID }) {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState({ result: [] })
  const [page, setPage] = useState(1)

  useEffect(async () => {
    try {
      getData(1)
    } catch (err) {
      handleErrorApi(err)
    }
  }, [])

  const getData = async (page) => {
    try {
      setLoading(true)
      const res = await getComment({ mangaID, chapterID, page })
      if (res) {
        setData({
          ...res,
          result: [...res.result],
        })
      }
      setLoading(false)
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const changePage = async (page) => {
    setPage(page)
    try {
      getData(page)
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const onCommentSuccess = (res) => {
    setData({
      ...data,
      result: [res, ...data.result],
    })
  }

  const onDeleteComment = async (id) => {
    try {
      if (confirm("Bạn muốn xóa comment này?") == true) {
        deleteComment(id).then((res) => {
          let indexOfComment = data.result.findIndex((item) => item.id == id)
          if (indexOfComment > -1) {
            let newArr = data.result
            newArr.splice(indexOfComment, 1)
            setData({
              ...data,
              result: [...newArr],
            })
          }
        })
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const comments = data.result ? data.result.filter((item) => item.replyID == 0) : []

  return (
    <>
      <div className="mt-2">
        <InputComment
          id="comment-main"
          mangaID={mangaID}
          chapterID={chapterID}
          replyID={0}
          handlePostSuccess={onCommentSuccess}
        />
      </div>
      {isLoading ? null : (
        <>
          <div>
            {comments.map((item) => {
              const replyComment = data.result.filter((reply) => reply.replyID == item.id).reverse()
              return (
                <MainComment
                  key={item.id}
                  item={item}
                  replyComment={replyComment}
                  mangaID={mangaID}
                  chapterID={chapterID}
                  deleteAble={data.deleteAble}
                  onCommentSuccess={onCommentSuccess}
                  onDeleteComment={onDeleteComment}
                />
              )
            })}
          </div>
          <div className="mt-2 flex items-center justify-center">
            <Pagination
              total={data?.resultCount ?? 0}
              current={page}
              onChange={(page, pageSize) => changePage(page)}
              defaultPageSize={10}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </>
  )
}

export function MainComment({
  item,
  replyComment,
  deleteAble,
  mangaID,
  chapterID,
  onCommentSuccess,
  onDeleteComment,
}) {
  const [replyPerPage, setPageSize] = useState(5)
  const [page, setPage] = useState(0)
  const [isReply, setIsReply] = useState(false)
  const [tagName, setTagName] = useState('')
  const ref = useRef(null)
  const hanldeClickReply = (name) => {
    setTagName(name)
    setIsReply(true)
    // ref.current.scrollIntoView()
  }
  const handleClickShowMoreReply = () => {
    // if (2 + (page + 1) * replyPerPage - 1 <= replyComment.length) {
    //   setPage(page + 1)
    // }
    setPage(page + 1)
  }
  return (
    <div className="flex items-center relative">
      {deleteAble && (
        <button
          onClick={() => onDeleteComment(item.id)}
          className="text-xs absolute bg-gray-400 text-white flex items-center justify-center w-4 h-4 top-0 right-0 rounded-full "
        >
          <i className="fas fa-times"></i>
        </button>
      )}
      {/* left  */}
      {/* user section  */}
      <div
        className="flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full cursor-pointer self-start"
        style={{ width: 50, height: 50 }}
      >
        <Link href={userLink(item.username ? item.username : item.userID)}>
          <ReactImageFallback
            className="min-w-full min-h-full block flex-shrink-0"
            src={item.avatar}
            fallbackImage="/img/defaultAvatar.jpg"
            alt="logo"
          />
        </Link>
      </div>
      <div className="flex-1 ml-2" style={{ maxWidth: `calc(100% - 50px)` }}>
        <div>
          <div>
            {/* content section  */}
            <div className="rounded-xl bg-gray-100 dark:bg-dark-gray-comment p-2">
              <RoleName
                username={item.username}
                userID={item.userID}
                text={item.name}
                role={item.role}
                teamID={item.teamID}
                teamName={item.teamName}
                premium={item.isPremium}
              />

              <p
                className="text-base leading-tight dark:text-dark-text break-words"
                dangerouslySetInnerHTML={{
                  __html: parseCommentToHtml(item.content),
                }}
              ></p>
            </div>
            {/* image section  */}
            <div className="max-w-xs mt-1 flex items-center justify-center overflow-hidden rounded-md">
              {item.image && (
                <Image
                  preview={false}
                  className="max-w-full max-h-full"
                  src={item.image}
                  alt="image"
                />
              )}
            </div>

            {/* action section */}
            <div className="flex items-center py-1 dark:text-dark-text">
              <div className="flex items-center text-md mr-2">
                <Heart id={item.id} defaultLike={item.liked} likeCount={item.likeCount} />
              </div>
              <button
                className="text-md ml-1 text-gray"
                onClick={() => hanldeClickReply(item.name)}
              >
                <i className="fas fa-reply text-gray"></i>
              </button>
              <p className="ml-2 text-gray-500 text-sm">{timeFromNow(item.createAt)}</p>
            </div>
            {/* end */}
          </div>
        </div>
        {/* answer section */}

        {replyComment.length > 0 && (
          <div>
            {replyComment.length > 0 &&
              replyComment
                .slice(0, 2)
                .map((subComment, index) => (
                  <AnswerComment
                    name={item.name}
                    key={index}
                    onDeleteComment={onDeleteComment}
                    item={subComment}
                    hanldeClickReply={hanldeClickReply}
                    deleteAble={deleteAble}
                  />
                ))}
            {replyComment.length > 2 &&
              replyComment
                .slice(2, page * replyPerPage)
                .map((subComment, index) => (
                  <AnswerComment
                    name={item.name}
                    key={index}
                    onDeleteComment={onDeleteComment}
                    item={subComment}
                    hanldeClickReply={hanldeClickReply}
                    deleteAble={deleteAble}
                  />
                ))}

            {/* {new Array(page * replyPerPage).fill(0).map((_, index) => (
              <AnswerComment
                name={item.name}
                key={index}
                onDeleteComment={onDeleteComment}
                item={replyComment[index]}
                hanldeClickReply={hanldeClickReply}
                deleteAble={deleteAble}
              />
            ))} */}
            {(page > 0 ? page + 1 : 0) * replyPerPage + 2 <= replyComment.length && (
              <p className="text-left text-semibold text-gray hover:pink break-words">
                <a onClick={handleClickShowMoreReply}>
                  <i className="fas fa-chevron-down"></i> Xem thêm phản hồi
                </a>
              </p>
            )}
          </div>
        )}
        {/* reply form section */}
        <div ref={ref}>
          {isReply ? (
            <InputComment
              id={`reply-${item.id}`}
              mangaID={mangaID}
              chapterID={chapterID}
              replyID={item.id}
              handlePostSuccess={onCommentSuccess}
              tagName={tagName}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function AnswerComment({ hanldeClickReply, item, deleteAble, onDeleteComment, name }) {
  if (item)
    return (
      <div className="relative">
        {deleteAble == true && (
          <button
            onClick={() => onDeleteComment(item.id)}
            className="text-xs absolute bg-gray-400 text-white flex items-center justify-center w-4 h-4 top-0 right-0 rounded-full "
          >
            <i className="fas fa-times"></i>
          </button>
        )}
        {/* left */}
        <div className="flex items-center">
          {/* user section  */}
          <div
            className="flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full cursor-pointer self-start"
            style={{ width: 40, height: 40 }}
          >
            <Link href={userLink(item.username ? item.username : item.userID)}>
              <ReactImageFallback
                className="min-w-full min-h-full block flex-shrink-0"
                src={item.avatar}
                fallbackImage="/img/defaultAvatar.jpg"
                alt="logo"
              />
            </Link>
          </div>
          {/* right */}
          <div className="flex-1 ml-2" style={{ maxWidth: `calc(100% - 50px)` }}>
            <div>
              <div>
                {/* content section  */}
                <div className="rounded-xl bg-gray-100 dark:bg-dark-gray-comment p-2">
                  <RoleName
                    username={item.username}
                    userID={item.userID}
                    text={item.name}
                    role={item.role}
                    teamID={item.teamID}
                    teamName={item.teamName}
                    premium={item.isPremium}
                  />
                  <div className="flex text-base leading-tight dark:text-dark-text break-words">
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          `<span class="text-blue-500 mr-2">@${name}</span>` +
                          parseCommentToHtml(`` + item.content),
                      }}
                    ></p>
                  </div>
                </div>
                {/* image section  */}
                <div className="max-w-xs mt-1 flex items-center justify-center overflow-hidden rounded-md">
                  {item.image && (
                    <Image
                      preview={false}
                      className="max-w-full max-h-full"
                      src={item.image}
                      alt="image"
                    />
                  )}
                </div>
                {/* action section  */}
                <div className="flex items-center py-1 dark:text-dark-text">
                  <div className="flex items-center text-md mr-2">
                    <Heart id={item.id} defaultLike={item.liked} likeCount={item.likeCount} />
                  </div>
                  {/* <button className="text-md ml-1 text-gray" onClick={() => hanldeClickReply(name)}>
                    <i className="fas fa-reply text-gray"></i>
                  </button> */}
                  <p className="ml-2 text-gray-500 text-sm">{timeFromNow(item.createAt)}</p>
                </div>
                {/* end */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  else return null
}
