import useAuth from '@/hooks/useAuth'
import usePushNotifications from '@/hooks/usePushNotifications'
import handleErrorApi from '@/utils/handleErrorApi'
import React, { useEffect, useState } from 'react'
import { addPush, getNotificationConfig, setNotificationConfig } from '../../../api/general'

export default function UserNotify() {
  const [notify, setNotify] = useState('')

  useEffect(async () => {
    try {
      const res = await getNotificationConfig()
      if (res) setNotify(res)
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
    try {
      const status = e.target.checked
      const name = e.target.name
      await setNotificationConfig({
        ...notify,
        [name]: status,
      })
      setNotify({
        ...notify,
        [name]: status,
      })
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
              Cập nhật chapter mới
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="mangaTeam"
              name="manga"
              onChange={handleChange}
              checked={notify.manga == 1 ? true : false}
            />
          </div>
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="mangaTeam" className="w-1/2 leading-none">
              Truyện từ team
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="mangaTeam"
              name="team"
              onChange={handleChange}
              checked={notify.team == 1 ? true : false}
            />
          </div>
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="replyComment" className="w-1/2 leading-none">
              Trả lời bình luận
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="replyComment"
              name="comment"
              onChange={handleChange}
              checked={notify.comment == 1 ? true : false}
            />
          </div>
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="replyComment" className="w-1/2 leading-none">
              Lượt thích bình luận
            </label>
            <input
              className="ml-2"
              type="checkbox"
              id="likeComment"
              name="comment_like"
              onChange={handleChange}
              checked={notify.comment_like == 1 ? true : false}
            />
          </div>
          {auth.role == 2 && (
            <>
              <div className="flex items-center mb-2 w-full">
                <label htmlFor="replyComment" className="w-1/2 leading-none">
                  Comment truyện của team
                </label>
                <input
                  className="ml-2"
                  type="checkbox"
                  id="replyCommentTeam"
                  name="comment_team"
                  onChange={handleChange}
                  checked={notify.comment_team == 1 ? true : false}
                />
              </div>
              <div className="flex items-center mb-2 w-full">
                <label htmlFor="replyComment" className="w-1/2 leading-none">
                  Report từ truyện của team
                </label>
                <input
                  className="ml-2"
                  type="checkbox"
                  id="reportTeam"
                  name="report_team"
                  onChange={handleChange}
                  checked={notify.report_team == 1 ? true : false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    )
  else return null
}
