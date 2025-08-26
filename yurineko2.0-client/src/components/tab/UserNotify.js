import useAuth from '@/hooks/useAuth'
import usePushNotifications from '@/hooks/usePushNotifications'
import handleErrorApi from '@/utils/handleErrorApi'
import { Button, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { addPush, getUserPreference, setUserPreference } from '../../../api/general'

export default function UserNotify() {
  const [notify, setNotify] = useState('');
  const userPreferenceRef = useRef(null);
  const [changed, setChanged] = useState(false);

  useEffect(async () => {
    try {
      const res = await getUserPreference()
      if (res) {
        userPreferenceRef.current = res;
        setNotify({ ...res.notification });
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }, [])

  const auth = useAuth()

  const { onClickSusbribeToPushNotification, getExixtingSubscription } = usePushNotifications()

  useEffect(async () => {
    if ('Notification' in window && auth && auth.token) {
      console.log('Has Notification in window')
      const defaultSub = await getExixtingSubscription()
      console.log('Has default subscribe')

      if (!defaultSub) {
        console.log('Dont have default subscribe')

        onClickSusbribeToPushNotification().then((userSub) => {
          if (userSub) addPush(userSub)
        })
      }
    }
  }, [])

  const handleChange = async (e) => {
    const status = e.target.checked
    const name = e.target.name
    setChanged(true)
    setNotify({
      ...notify,
      [name]: status,
    })
  }

  const handleCancel = async () => {
    setNotify({ ...userPreferenceRef.current.notification });
    setChanged(false);
  }

  const handleSave = async () => {
    try {
      await setUserPreference({ notification: notify })
      message.success('Lưu cài đặt thành công!')
      userPreferenceRef.current = { notification: notify };
      setChanged(false);
    } catch (err) {
      handleErrorApi(err)
    }
  }

  if (notify)
    return (
      <div className="rounded-md bg-blue-200 dark:bg-dark-gray dark:text-dark-text flex flex-col">
        <div className="rounded-md leading-tight text-md bg-blue-300 dark:bg-dark-black font-semibold p-3 flex items-center justify-start">
          Tùy chọn các loại thông báo muốn nhận
        </div>
        <div className="flex-1 text-base leading-tight font-semibold p-3 flex items-start justify-start flex-col dark:text-dark-text w-full">
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="mangaChap" className="w-1/2 leading-none">
              Khi có chapter mới từ truyện bạn theo dõi
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="mangaTeam"
              name="mangaFollowingNewChapter"
              onChange={handleChange}
              checked={notify.mangaFollowingNewChapter == 1 ? true : false}
            />
          </div>
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="mangaTeam" className="w-1/2 leading-none">
              Khi có truyện mới từ team bạn theo dõi
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="mangaTeam"
              name="teamFollowingNewManga"
              onChange={handleChange}
              checked={notify.teamFollowingNewManga == 1 ? true : false}
            />
          </div>
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="replyComment" className="w-1/2 leading-none">
              Khi có trả lời bình luận của bạn
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="replyComment"
              name="commentReply"
              onChange={handleChange}
              checked={notify.commentReply == 1 ? true : false}
            />
          </div>
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="replyComment" className="w-1/2 leading-none">
              Khi có lượt thích bình luận của bạn
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="likeComment"
              name="commentReaction"
              onChange={handleChange}
              checked={notify.commentReaction == 1 ? true : false}
            />
          </div>
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="replyComment" className="w-1/2 leading-none">
              Khi có người nhắc đến bạn trong bình luận
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="likeComment"
              name="commentMention"
              onChange={handleChange}
              checked={notify.commentMention == 1 ? true : false}
            />
          </div>
          {auth.role == 2 && (
            <>
              <div className="flex items-center mb-2 w-full">
                <label htmlFor="replyComment" className="w-1/2 leading-none">
                  Khi có bình luận mới trong truyện của team
                </label>
                <input
                  className="ml-2"
                  type="checkbox"
                  id="replyCommentTeam"
                  name="teamFollowingNewManga"
                  onChange={handleChange}
                  checked={notify.teamFollowingNewManga == 1 ? true : false}
                />
              </div>
              <div className="flex items-center mb-2 w-full">
                <label htmlFor="replyComment" className="w-1/2 leading-none">
                  Khi có report mới tới team của bạn
                </label>
                <input
                  className="ml-2"
                  type="checkbox"
                  id="reportTeam"
                  name="teamNewReport"
                  disabled
                  onChange={handleChange}
                  checked={notify.teamNewReport == 1 ? true : false}
                />
              </div>
            </>
          )}
          {changed && (
            <div className="flex ml-auto space-x-2">
              <Button type="default" onClick={handleCancel}>Hủy</Button>
              <Button type="primary" onClick={handleSave}>Lưu thay đổi</Button>
            </div>
          )}
        </div>
      </div>
    )
  else return null
}
