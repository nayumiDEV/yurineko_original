import { Avatar, Modal, Tabs } from 'antd'
import { getChapterReaction, getCommentReaction, getCommentReactionV1 } from 'api/general'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const { TabPane } = Tabs

export default function ReactionModal({
  visible,
  id,
  sourceType = 'chapter',
  onCancel,
  reactionData,
}) {
  const [tab, setTab] = useState('all')

  const defaultList = [
    {
      type: 'like',
      reactionCount: 0,
    },
    {
      type: 'love',
      reactionCount: 0,
    },
    {
      type: 'what',
      reactionCount: 0,
    },
    {
      type: 'wow',
      reactionCount: 0,
    },
    {
      type: 'haha',
      reactionCount: 0,
    },
    {
      type: 'angry',
      reactionCount: 0,
    },
    {
      type: 'sad',
      reactionCount: 0,
    },
  ]

  const list = _.unionBy(reactionData, defaultList, 'type').sort(
    (a, b) => b.reactionCount - a.reactionCount
  )
  const reactionDataObj = Object.fromEntries(list.map((item) => [item.type, item]))

  return (
    <Modal
      visible={visible}
      footer={false}
      closable={true}
      onCancel={onCancel}
      closeIcon={undefined}
      width={700}
    >
      <div className="relative">
        <Tabs
          defaultActiveKey="all"
          onChange={(type) => setTab(type)}
          tabBarExtraContent={<span> </span>}
        >
          <TabPane tab="Tất cả" key="all">
            <ReactionTab type="all" id={id} sourceType={sourceType} />
          </TabPane>

          {list.map((item) => {
            return (
              <TabPane
                tab={
                  <div className="flex items-center justify-center">
                    <img
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
                      className="w-5 h-5 mr-1 max-w-none"
                    />
                    {reactionDataObj?.[item.type]?.reactionCount > 0 && (
                      <span>{reactionDataObj?.[item.type]?.reactionCount}</span>
                    )}
                  </div>
                }
                key={item.type}
              >
                <ReactionTab type={item.type} id={id} sourceType={sourceType} />
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    </Modal>
  )
}

function ReactionTab({ id, type = 'all', sourceType = 'comment' }) {
  const [listUser, setListUser] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = async (page = 1, size = 20) => {
    try {
      if (sourceType == 'chapter') {
        const res = await getChapterReaction(id, type, page, size)
        setListUser(_.uniqBy([...listUser, ...(res.listUser ?? [])], 'username'))
        if (res.listUser.length == 20) {
          setCurrentPage(currentPage + 1)
        } else {
          setHasMore(false)
        }
      } else {
        // const res = await getCommentReaction(id, type, page, size)
        const res = await getCommentReactionV1({ commentID: id, type, page, size })
        setListUser(_.uniqBy([...listUser, ...(res.listUser ?? [])], 'user.username'))
        if (res.listUser.length == 20) {
          setCurrentPage(currentPage + 1)
        } else {
          setHasMore(false)
        }
      }
    } catch (err) {
      setListUser([])
    }
  }

  useEffect(() => fetchData(), [id, sourceType, type])

  return (
    <div className="w-full max-h-80 overflow-y-auto flex-col-reverse" id={`${type}-scrollableDiv`}>
      {listUser.length > 0 && (
        <InfiniteScroll
          dataLength={listUser.length}
          loader={<h4>Loading...</h4>}
          hasMore={hasMore}
          // height={400}
          scrollableTarget={`${type}-scrollableDiv`}
          next={() => {
            fetchData(currentPage, 20)
          }}
        >
          {listUser.map((item, index) => {
            return <ReactionRecord record={item} key={index} />
          })}
        </InfiniteScroll>
      )}
      {listUser.length == 0 && (
        <p className="text-center opacity-60">Chưa có lượt tương tác nào.</p>
      )}
    </div>
  )
}

function ReactionRecord({ record }) {
  return (
    <div className="flex justify-start items-center my-3">
      <div className="w-12 h-12 relative">
        <Avatar name="User" src={record.avatar ?? record.user.avatar ?? ''} className="w-12 h-12" />
        {record.type == 'love' && (
          <img src="/reaction/Love.svg" className="absolute bottom-0 right-0 w-6 h-6" />
        )}
        {record.type == 'like' && (
          <img src="/reaction/Like.svg" className="absolute bottom-0 right-0 w-6 h-6" />
        )}
        {record.type == 'haha' && (
          <img src="/reaction/Haha.svg" className="absolute bottom-0 right-0 w-6 h-6" />
        )}
        {record.type == 'wow' && (
          <img src="/reaction/Wow.svg" className="absolute bottom-0 right-0 w-6 h-6" />
        )}
        {record.type == 'angry' && (
          <img src="/reaction/Angry.svg" className="absolute bottom-0 right-0 w-6 h-6" />
        )}
        {record.type == 'sad' && (
          <img src="/reaction/Sad.svg" className="absolute bottom-0 right-0 w-6 h-6" />
        )}
        {record.type == 'what' && (
          <img src="/reaction/Chamhoi.svg" className="absolute bottom-0 right-0 w-6 h-6" />
        )}
      </div>
      <span className="ml-4 text-md">{record.name ?? record.user.name ?? ''}</span>
    </div>
  )
}
