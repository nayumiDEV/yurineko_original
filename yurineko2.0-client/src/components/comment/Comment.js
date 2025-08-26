import { teamLink, userLink } from '@/utils/generateLink'
import handleErrorApi from '@/utils/handleErrorApi'
import parseComment from '@/utils/parseComment'
import { timeFromNow } from '@/utils/timeUpdate'
import {
  CheckOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  EllipsisOutlined,
  PushpinOutlined,
  StopOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Dropdown, Image, message, Pagination } from 'antd'
import {
  banUser,
  deleteComment,
  deleteCommentV1,
  getCommentV1,
  getHighlightComments,
  getSubCommentV1,
  pinComment,
  pinCommentV1,
} from 'api/general'
import _ from 'lodash'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import ReactImageFallback from 'react-image-fallback'
import { connect } from 'react-redux'
import InputComment from '../form/InputComment'
import BanUserModal from '../modal/BanUserModal'
import CommentEditHistory from '../modal/CommentEditHistory'
import Reaction from '../reaction/Reaction'
import { RoleName } from '../tag/Text'
import { useRouter } from 'next/router'

const MAX_COMMENT_DEPTH = 3

function Comment({ mangaID, chapterID, user, ...props }) {
  // get highlightComment from query string
  const router = useRouter()
  const highlightComment = router?.query?.highlightComment

  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState({ results: [] })
  const [page, setPage] = useState(1)
  const [renderTime, setRenderTime] = useState(1)
  const [visibleBanModal, setVisibleBanModal] = useState(false)
  const [banData, setBanData] = useState({
    id: '',
    time: '',
    isDeleteComment: false,
    reason: '',
  })
  const [offlineList, setOfflineList] = useState([])
  const [highlightComments, setHighlightComment] = useState([])

  useEffect(async () => {
    try {
      await getData(page > 1 ? page : 1)
      if (highlightComment && user) {
        fetchHighlightComment(highlightComment)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }, [renderTime])

  const getData = async (page) => {
    try {
      setLoading(true)
      const res = await getCommentV1({
        mangaID,
        chapterID: chapterID == 0 ? null : chapterID,
        page,
      })
      if (res) {
        setData({
          ...res,
          results: [...res.results],
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
    if (res?.parentId) {
      setOfflineList([...offlineList, res])
    } else {
      setData({
        ...data,
        results: [res, ...data.results],
      })
    }
  }

  const onEditCommentSuccess = (res) => {
    if (res?.parentId) {
      const index = offlineList.findIndex((item) => item.id === res.id)
      if (index > -1) {
        offlineList[index] = res
        setOfflineList([...offlineList])
      }
    } else {
      const index = data.results.findIndex((item) => item.id == res.id)
      data.results[index] = res
      setData({
        ...data,
        results: [...data.results],
      })
    }
  }

  const onDeleteComment = async (id) => {
    try {
      if (confirm('Bạn muốn xóa comment này?') == true) {
        deleteCommentV1({ commentID: id }).then((res) => {
          let indexOfComment = data.results.findIndex((item) => item.id == id)
          if (indexOfComment > -1) {
            let newArr = data.results
            newArr.splice(indexOfComment, 1)
            setData({
              ...data,
              results: [...newArr],
            })
          }

          let indexOfCommentOfflineList = offlineList.findIndex((item) => item.id == id)
          if (indexOfCommentOfflineList > -1) {
            let newArr = offlineList
            newArr.splice(indexOfCommentOfflineList, 1)
            setOfflineList([...newArr])
          }
        })
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const onPinComment = async (id, isUnpin = false) => {
    try {
      if (
        confirm(isUnpin ? 'Bạn có muốn gỡ ghim bình luận này' : 'Bạn muốn ghim bình luận này?') ==
        true
      ) {
        await pinCommentV1({ commentID: id })
        message.success(isUnpin ? 'Gỡ thành công' : 'Ghim thành công!')
        setRenderTime(renderTime + 1)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const onBanUser = async () => {
    try {
      if (banData.id && banData.time) {
        await banUser({ ...banData })
        onCloseBanModal()
        setRenderTime(renderTime + 1)
        message.success('Ban user thành công!')
      } else {
        message.error('Thông tin chưa đủ để ban user')
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const onUnBanUser = async (id) => {
    try {
      await banUser({ id: id, time: 0 })
      onCloseBanModal()
      setRenderTime(renderTime + 1)
      message.success('UnBan user thành công!')
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const onCloseBanModal = () => {
    setBanData({
      id: '',
      time: '',
      isDeleteComment: false,
      reason: '',
    })
    setVisibleBanModal(false)
  }

  const onOpenBanModal = (id) => {
    setBanData({ ...banData, id })
    setVisibleBanModal(true)
  }

  const fetchHighlightComment = async (commentID) => {
    try {
      setLoading(true)
      const res = await getHighlightComments(commentID)
      if (res) {
        setHighlightComment([...res])
        setOfflineList([...offlineList, ...res.filter((item) => item.parentId != null)])
        setTimeout(() => {
          // scroll to comment with id
          const el = document.getElementById(`comment-${commentID}`)
          el?.scrollIntoView()
        }, 2000)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  const comments = _.uniqBy(
    (data.results ? data.results : [])
      .concat(highlightComments.filter((item) => item.parentId == null)), 
      'id'
  )

  return (
    <>
      <div className="mt-2 mb-6">
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
              const replyComment = offlineList
                .filter((reply) => reply.parentId == item.id)
                .reverse()
              return (
                <MainComment
                  key={item.id}
                  item={item}
                  mangaID={mangaID}
                  chapterID={chapterID}
                  deleteAble={data.deleteAble}
                  canUnPin={user?.id == item.pinUserID || user?.role == 3}
                  canBan={user?.role == 3}
                  onCommentSuccess={onCommentSuccess}
                  onDeleteComment={onDeleteComment}
                  onPinComment={onPinComment}
                  onBanUser={onOpenBanModal}
                  onUnBanUser={onUnBanUser}
                  offlineList={replyComment}
                  level={1}
                  onEditCommentSuccess={onEditCommentSuccess}
                  highlightComments={highlightComments}
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
          <BanUserModal
            visible={visibleBanModal}
            setBanData={setBanData}
            banData={banData}
            onCancel={onCloseBanModal}
            onOk={onBanUser}
          />
        </>
      )}
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.user?.user,
})

export default connect(mapStateToProps, null)(Comment)

export function MainComment({
  item,
  mangaID,
  chapterID,
  canUnPin,
  onCommentSuccess,
  onEditCommentSuccess,
  onDeleteComment,
  onPinComment,
  onBanUser,
  onUnBanUser,
  offlineList,
  level,
  highlightComments = [],
}) {
  const [isEditing, setEditing] = useState(false)
  const [page, setPage] = useState(0)
  const [isReply, setIsReply] = useState(false)
  const [isShowHistory, setIsShowHistory] = useState(false)

  const hanldeClickReply = (name) => {
    setIsReply(true)
  }

  const handleClickShowMoreReply = () => {
    setPage(page + 1)
  }

  const onEdit = () => {
    setEditing(true)
  }

  const isPinned = item.pinUser?.id != null
  const deleteAble = item.permission?.delete
  const canBan = item.permission?.ban
  const isBanned = item.user?.isBanned
  const isHidden = item.isHidden
  const canPin = item.permission?.pin
  const isEdited = item.isEdited
  const canEdit = item.permission?.edit

  const menu = (
    <div className="p-2 shadow-sm rounded-sm bg-white flex flex-col min-w-max">
      {canEdit && (
        <a className="my-1 text-md flex items-center" onClick={() => onEdit()}>
          Chỉnh sửa <EditOutlined className="ml-2" />
        </a>
      )}

      {isPinned && canPin && (
        <a className="my-1 text-md flex items-center" onClick={() => onPinComment(item.id, true)}>
          Gỡ ghim <DisconnectOutlined className="ml-2" />
        </a>
      )}

      {!isPinned && canPin && (
        <a className="my-1 text-md flex items-center" onClick={() => onPinComment(item.id)}>
          Ghim <PushpinOutlined className="ml-2" />
        </a>
      )}
      {deleteAble && (
        <a className="my-1 text-md flex items-center" onClick={() => onDeleteComment(item.id)}>
          Xoá <DeleteOutlined className="ml-2" />
        </a>
      )}
      {canBan && isBanned == false && (
        <a className="my-1 text-md flex items-center" onClick={() => onBanUser(item.user.id)}>
          Ban <StopOutlined className="ml-2" />
        </a>
      )}

      {canBan && isBanned == true && (
        <a className="my-1 text-md flex items-center" onClick={() => onUnBanUser(item.user.id)}>
          UnBan <CheckOutlined className="ml-2" />
        </a>
      )}
    </div>
  )

  return (
    <div
      className={`flex items-center relative ${isPinned ? 'mt-5' : ''} ${
        isHidden ? 'opacity-50' : ''
      }`}
      id={`comment-${item.id}`}
    >
      {isPinned && (
        <p className="absolute -top-5 left-16 flex items-center text-sm text-gray-400">
          <i className="fas fa-thumbtack mr-1"></i>{' '}
          {item.pinUser?.role == 3 ? (
            <Link href={userLink(item.pinUser?.id)}>
              <a className="mr-1">{item.pinUser?.name}</a>
            </Link>
          ) : (
            <>
              <Link href={userLink(item.pinUser?.id)}>
                <a className="mr-1">{item.pinUser?.name}</a>
              </Link>
              [
              <Link href={teamLink(item.pinUser?.team?.id)}>
                <a>{item.pinUser?.team?.name}</a>
              </Link>
              ]
            </>
          )}{' '}
          đã ghim
        </p>
      )}
      {deleteAble && !isEditing && (
        <Dropdown
          className="text-xl absolute text-gray-500 flex items-center justify-center top-0 right-2 rounded-full "
          overlay={menu}
        >
          <a onClick={(e) => e.preventDefault()} className="p-2">
            <EllipsisOutlined size={20} />
          </a>
        </Dropdown>
      )}
      {/* left  */}
      {/* user section  */}
      <div
        className="flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full cursor-pointer self-start"
        style={{ width: 50, height: 50 }}
      >
        <Link href={userLink(item.username ? item.username : item.user.id)}>
          <ReactImageFallback
            className="min-w-full min-h-full block flex-shrink-0"
            src={item.user?.avatar}
            fallbackImage="/img/defaultAvatar.jpg"
            alt="logo"
          />
        </Link>
      </div>
      <div className={`flex-1 ml-2`} style={{ maxWidth: `calc(100% - 50px)` }}>
        <div>
          <div>
            {isEditing ? (
              <InputComment
                id={`edit-${item.id}`}
                mangaID={mangaID}
                chapterID={chapterID}
                replyID={item.id}
                isEdit={true}
                currentItem={item}
                handlePostSuccess={isEditing ? onEditCommentSuccess : onCommentSuccess}
                onCancelEdit={() => setEditing(false)}
              />
            ) : (
              <>
                {/* content section  */}
                <div className="rounded-xl bg-gray-100 dark:bg-dark-gray-comment p-2">
                  <RoleName
                    username={item.user.username}
                    userID={item.user.id}
                    text={item.user.name}
                    role={item.user.role}
                    teamID={item.user?.team?.id}
                    teamName={item.user?.team?.name}
                    premium={item.user.isPremium}
                    isBanned={item.user.isBanned}
                  />

                  <p className="text-base leading-tight dark:text-dark-text break-words mt-1">
                    {parseComment(item.content, item.mentionUser)}
                  </p>
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
                  <button
                    className="text-md text-gray mr-2 "
                    onClick={() => hanldeClickReply(item.name)}
                  >
                    <i className="fas fa-reply text-gray"></i>
                  </button>
                  <div className="flex items-center text-md ml-1">
                    {/* <Heart id={item.id} defaultLike={item.liked} likeCount={item.likeCount} /> */}
                    <Reaction
                      sourceType="comment"
                      id={item.id}
                      reactionInfo={item.reactionCount || []}
                      userData={{ reaction: item.reactionInfo }}
                    />
                  </div>
                  <p className="ml-2 text-gray-500 text-sm dark:text-dark-icon">
                    {timeFromNow(item.createdAt)}
                    {isEdited && (
                      <span
                        className="text-sm text-gray-400 ml-2 cursor-pointer"
                        onClick={() => setIsShowHistory(true)}
                      >
                        Đã chỉnh sửa
                      </span>
                    )}
                  </p>
                </div>

                {isHidden && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">
                      <Link className="mr-2" href={userLink(item.user?.id)}>
                        {item.user?.name}
                      </Link>{' '}
                      đã xoá.
                    </p>
                  </div>
                )}
              </>
            )}

            <SubComment
              commentID={item.id}
              countSubComment={item.replyCount}
              offlineList={offlineList}
              level={level + 1}
              onBanUser={onBanUser}
              onUnBanUser={onUnBanUser}
              onPinComment={onPinComment}
              onDeleteComment={onDeleteComment}
              onEditCommentSuccess={onEditCommentSuccess}
              highlightComments={highlightComments}
            />
            {/* end */}
          </div>
        </div>

        {/* reply form section */}
        <div className="mb-2">
          {isReply && level <= 2 ? (
            <InputComment
              id={`reply-${item.id}`}
              mangaID={mangaID}
              chapterID={chapterID}
              replyID={item.id}
              replyUser={item.user}
              handlePostSuccess={onCommentSuccess}
            />
          ) : null}
        </div>
      </div>
      <CommentEditHistory
        commentID={item.id}
        visible={isShowHistory}
        onCancel={() => setIsShowHistory(false)}
      />
    </div>
  )
}

export function AnswerComment({
  item,
  onDeleteComment,
  onBanUser,
  onUnBanUser,
  level,
  onEditCommentSuccess,
  appendParentOfflineList = (comment) => {},
  highlightComments = [],
}) {
  const [isShowHistory, setIsShowHistory] = useState(false)
  const [isEditing, setEditing] = useState(false)

  const onEdit = () => {
    setEditing(true)
  }

  const deleteAble = item.permission?.delete
  const canBan = item.permission?.ban
  const isBanned = item.user.isBanned
  const isHidden = item.isHidden
  const isEdited = item.isEdited
  const canEdit = item.permission?.edit

  const menu = (
    <div className="p-2 shadow-sm rounded-sm bg-white flex flex-col min-w-max">
      {canEdit && (
        <a className="my-1 text-md flex items-center" onClick={() => onEdit()}>
          Chỉnh sửa <EditOutlined className="ml-2" />
        </a>
      )}
      {deleteAble && (
        <a className="my-1 text-md flex items-center" onClick={() => onDeleteComment(item.id)}>
          Xoá <DeleteOutlined className="ml-2" />
        </a>
      )}
      {canBan && isBanned == false && (
        <a className="my-1 text-md flex items-center" onClick={() => onBanUser(item.user.id)}>
          Ban <StopOutlined className="ml-2" />
        </a>
      )}
      {canBan && isBanned == true && (
        <a className="my-1 text-md flex items-center" onClick={() => onUnBanUser(item.user.id)}>
          UnBan <CheckOutlined className="ml-2" />
        </a>
      )}
    </div>
  )

  const [isReply, setIsReply] = useState(false)
  const [offlineList, setOfflineList] = useState([])

  useEffect(() => {
    setOfflineList(highlightComments.filter((item) => item.parentId == item.id))
  }, [highlightComments])

  const handleClickReply = () => {
    setIsReply(!isReply)
  }

  const handlePostSuccess = (comment) => {
    if (level == MAX_COMMENT_DEPTH) {
      appendParentOfflineList(comment)
    } else setOfflineList([...offlineList, comment])
    setIsReply(!isReply)
  }

  if (item)
    return (
      <div className={`relative  ${isHidden ? 'opacity-50' : ''}`} id={`comment-${item.id}`}>
        {deleteAble == true && !isEditing && (
          // <button
          //   onClick={() => onDeleteComment(item.id)}
          //   className="text-xs absolute bg-gray-400 text-white flex items-center justify-center w-4 h-4 top-0 right-0 rounded-full "
          // >
          //   <i className="fas fa-times"></i>
          // </button>
          <Dropdown
            className="text-xl absolute text-gray-500 flex items-center justify-center top-0 right-2 rounded-full "
            overlay={menu}
          >
            <a onClick={(e) => e.preventDefault()} className="p-2">
              <EllipsisOutlined size={20} />
            </a>
          </Dropdown>
        )}

        {/* left */}
        <div className="flex items-center">
          {/* user section  */}
          <div
            className="flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full cursor-pointer self-start"
            style={{ width: 40, height: 40 }}
          >
            <Link href={userLink(item.username ? item.username : item.user.id)}>
              <ReactImageFallback
                className="min-w-full min-h-full block flex-shrink-0"
                src={item.user?.avatar}
                fallbackImage="/img/defaultAvatar.jpg"
                alt="logo"
              />
            </Link>
          </div>
          {/* right */}
          <div className="flex-1 ml-2" style={{ maxWidth: `calc(100% - 50px)` }}>
            <div>
              <div>
                {isEditing ? (
                  <InputComment
                    id={`edit-${item.id}`}
                    isEdit={true}
                    currentItem={item}
                    handlePostSuccess={onEditCommentSuccess}
                    onCancelEdit={() => setEditing(false)}
                  />
                ) : (
                  <>
                    {/* content section  */}
                    <div className="rounded-xl bg-gray-100 dark:bg-dark-gray-comment p-2">
                      <RoleName
                        username={item.user.username}
                        userID={item.user.id}
                        text={item.user.name}
                        role={item.user.role}
                        teamID={item.user?.team?.id}
                        teamName={item.user?.team?.name}
                        premium={item.user.isPremium}
                        isBanned={isBanned}
                      />
                      <div className="flex text-base leading-tight dark:text-dark-text break-words">
                        <p>{parseComment(item.content, item.mentionUser)}</p>
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
                    {/* action section */}
                    <div className="flex items-center py-1 dark:text-dark-text">
                      {level <= MAX_COMMENT_DEPTH && (
                        <button
                          className="text-md text-gray mr-2 "
                          onClick={() => handleClickReply()}
                        >
                          <i className="fas fa-reply text-gray"></i>
                        </button>
                      )}
                      <div className="flex items-center text-md ml-1">
                        {/* <Heart id={item.id} defaultLike={item.liked} likeCount={item.likeCount} /> */}
                        <Reaction
                          sourceType="comment"
                          id={item.id}
                          reactionInfo={item.reactionCount || []}
                          userData={{ reaction: item.reactionInfo }}
                        />
                      </div>
                      <p className="ml-2 text-gray-500 text-sm dark:text-dark-icon">
                        {timeFromNow(item.createdAt)}
                        {isEdited && (
                          <span
                            className="text-sm text-gray-400 ml-2 cursor-pointer"
                            onClick={() => setIsShowHistory(true)}
                          >
                            Đã chỉnh sửa
                          </span>
                        )}
                      </p>
                    </div>

                    {isHidden && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400">
                          <Link className="mr-2" href={userLink(item.user?.id)}>
                            {item.user?.name}
                          </Link>{' '}
                          đã xoá.
                        </p>
                      </div>
                    )}
                  </>
                )}

                <SubComment
                  commentID={item.id}
                  countSubComment={item.replyCount}
                  offlineList={offlineList}
                  level={level + 1}
                  onBanUser={onBanUser}
                  onUnBanUser={onUnBanUser}
                  onDeleteComment={onDeleteComment}
                  onEditCommentSuccess={onEditCommentSuccess}
                  highlightComments={highlightComments}
                />
                {/* end */}
              </div>
            </div>
          </div>
        </div>

        {isReply && level <= MAX_COMMENT_DEPTH && (
          <div>
            <InputComment
              id={`reply-${item.id}`}
              mangaID={0}
              chapterID={0}
              replyID={level == MAX_COMMENT_DEPTH ? item.parentId : item.id}
              replyUser={item.user}
              handlePostSuccess={handlePostSuccess}
            />
          </div>
        )}

        <CommentEditHistory
          commentID={item.id}
          visible={isShowHistory}
          onCancel={() => setIsShowHistory(false)}
        />
      </div>
    )
  else return null
}

export const SubComment = ({
  commentID,
  countSubComment,
  offlineList = [],
  level,
  onDeleteComment,
  onBanUser,
  onUnBanUser,
  onEditCommentSuccess,
  highlightComments = [],
}) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [currentSubComment, setCurrentSubComment] = useState(countSubComment)

  const getData = (cursor = null) => {
    setLoading(true)
    getSubCommentV1({ commentID, cursor })
      .then((res) => {
        setComments([...comments, ...res.results])
      })
      .catch((err) => handleErrorApi(err))
      .finally(() => setLoading(false))
  }

  const handleShowComment = () => {
    setShowComment(true)

    const lastComment = comments[comments.length - 1]
    getData(lastComment?.id)
  }

  const handleOnDeleteSuccess = (id) => {
    const newComments = comments.filter((item) => item.id !== id)
    setComments(newComments)
    setCurrentSubComment(currentSubComment - 1)
  }

  const handleEditCommentSuccess = (res) => {
    const index = comments.findIndex((item) => item.id === res.id)
    if (index > -1) {
      comments[index] = res
      setComments([...comments])
    }

    onEditCommentSuccess(res)
  }

  const handleDeleteComment = async (id) => {
    await onDeleteComment(id)
    handleOnDeleteSuccess(id)
  }

  const appendParentOfflineList = (comment) => {
    setComments([...comments, comment])
  }

  useEffect(() => {
    if (offlineList.length > 0) {
      setShowComment(true)
      setComments(_.unionBy([...offlineList, ...comments], 'id'))
      setCurrentSubComment(currentSubComment + _.xorBy([...offlineList, ...comments], 'id').length)
    }
  }, [offlineList.length])

  useEffect(() => {
    if (highlightComments.map((item) => item.id).includes(commentID)) {
      setShowComment(true)
      setComments(highlightComments.filter((item) => item.parentId === commentID))
      setCurrentSubComment(currentSubComment - 1)
    }
  }, [highlightComments])

  return (
    <div className={showComment && 'border-l border-blue-100 pl-2'}>
      {showComment == true && (
        <div className="flex flex-col">
          {comments.map((item, index) => (
            <AnswerComment
              key={item.id}
              item={item}
              onDeleteComment={handleDeleteComment}
              onBanUser={onBanUser}
              onUnBanUser={onUnBanUser}
              level={level}
              onEditCommentSuccess={handleEditCommentSuccess}
              appendParentOfflineList={appendParentOfflineList}
              highlightComments={highlightComments}
            />
          ))}
        </div>
      )}

      {currentSubComment - comments.length > 0 && (
        <div
          onClick={handleShowComment}
          className="text-sm flex items-center justify-center w-max text-gray-500 cursor-pointer mb-4"
        >
          Xem tất cả {currentSubComment - comments.length} phản hồi
        </div>
      )}
    </div>
  )
}
