import { userLink } from '@/utils/generateLink'
import handleErrorApi from '@/utils/handleErrorApi'
import parseComment from '@/utils/parseComment'
import { Checkbox, Image, Input, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { getCommentEditHistoryV1 } from 'api/general'
import React, { useEffect, useState } from 'react'
import ReactImageFallback from 'react-image-fallback'
import Link from 'next/link'
import { RoleName } from '../tag/Text'
import { timeFromNow } from '@/utils/timeUpdate'

export default function CommentEditHistory({ visible, commentID, onCancel }) {
  const [history, setHistory] = useState([])

  const getHistory = async () => {
    try {
      const res = await getCommentEditHistoryV1({ commentID })
      setHistory(res)
    } catch (err) {
      handleErrorApi(err)
    }
  }

  const mapImageStatusToText = (status) => {
    switch (status) {
      case 'HAVE_ATTACHMENT':
        return 'Có ảnh đính kèm'
      case 'ATTACHMENT_ADDED':
        return 'Đã thêm ảnh đính kèm'
      case 'ATTACHMENT_CHANGED':
        return 'Đã thay đổi ảnh đính kèm'
      case 'ATTACHMENT_DELETED':
        return 'Đã xóa ảnh đính kèm'
      default:
        return ''
    }
  }

  useEffect(() => {
    if (visible) {
      getHistory()
    }
  }, [commentID, visible])

  return (
    <Modal title="Lịch sử chỉnh sửa" visible={visible} onCancel={() => onCancel()} footer={null}>
      <div className="overflow-y-auto" style={{ maxHeight: 500 }}>
        {history.map((item) => (
          <div className={`flex items-center relative`}>
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

                      <p
                        className="text-base leading-tight dark:text-dark-text break-words"
                      >
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
                    <div className="flex items-center py-1 dark:text-dark-text">
                      <p className="ml-2 text-gray-500 text-sm dark:text-dark-icon">
                        {timeFromNow(item.createdAt)}
                      </p>
                      <p className="text-sm text-gray-400 ml-2">
                        {mapImageStatusToText(item.status)}
                      </p>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
