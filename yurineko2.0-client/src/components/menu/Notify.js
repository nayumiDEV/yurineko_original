import { Dropdown } from 'antd'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import NotifyMenu from './NotifyMenu'
import { readNotify } from 'api/general'
import { timeFromNow } from '@/utils/timeUpdate'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNotification } from '../../redux/actions'

const BASE_STORAGE = 'https://storage.yurineko.moe'

const iconRouter = (icon) => <img className="block absolute w-8 h-8 -bottom-2 -right-1" src={`${BASE_STORAGE}/icons/${icon}.svg`}></img>

function Notify({ notification, ...props }) {
  const [visible, setVisible] = useState(false);

  const fetchMoreNotif = () => {
    props.getNotification(notification.cursor);
  }

  return (
    <div className="bg-white dark:bg-dark-gray z-top notification-panel rounded shadow-md max-w-screen h-screen overflow-hidden">
      <div className="p-2 px-4 flex justify-between items-center bg-pink-notif dark:bg-black text-white">
        <p className="text-2xl font-semibold">Thông báo</p>
        <Dropdown overlay={<NotifyMenu setVisible={setVisible} />} trigger={['click']} placement="bottomRight" visible={visible}>
          <button className="p-1 px-2 text-md" onClick={() => setVisible(!visible)}>
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </Dropdown>
      </div>
      <div id="notification-tab" className="max-h-full overflow-y-auto scrollbar-w-2 scrollbar-thumb-rounded scrollbar-track-gray-lighter scrollbar-thumb-gray">
        {notification && (
          <InfiniteScroll
            dataLength={notification.data.length}
            hasMore={notification.hasMore}
            next={fetchMoreNotif}
            scrollableTarget="notification-tab"
          >
            {notification.data.map((item) => (
              <div className={`cursor-pointer border-0 py-2.5 px-4 dark:text-dark-text ${item.mIsRead == false ? "bg-pink-lightness dark:bg-dark-cyan" : ""}`}>
                <a href={item.mUrl ?? '#'} onClick={() => readNotify(item.mId).then(() => true).catch(() => false)}>
                  <div className="flex flex-row space-x-3">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          alt="Yurineko"
                          src={`${BASE_STORAGE}/${item.mImage}`}
                          className="w-16 h-16 rounded-full object-cover object-center"
                        >
                        </img>
                        {iconRouter(item.mIcon || 'reaction-heart')}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`line-clamp-2 overflow-ellipsis ${item.mIsRead == false ? "text-black dark:text-white" : "text-notif-read dark:text-notif-read-dark"}`} style={{ fontSize: "1.1rem" }} dangerouslySetInnerHTML={{ __html: item.mTitle }}></span>
                      <span className="text-sm text-notif-read dark:text-notif-read-dark">{timeFromNow(item.mCreatedAt)}</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  notification: state.user.notification,
})

const mapDispatchToProps = {
  getNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Notify)
