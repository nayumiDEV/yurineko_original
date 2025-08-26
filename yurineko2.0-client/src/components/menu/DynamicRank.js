import { Divider, message } from 'antd'
import Skeleton from 'react-loading-skeleton'
import React, { useEffect, useState } from 'react'
import MangaRank from '../manga/MangaRank'
import _ from 'lodash'

export const number = [
  'text-red-500',
  'text-blue-500',
  'text-green-500',
  'text-pink-500',
  'text-gray-500',
]

const type = {
  view: {
    name: 'Lượt xem',
    type: 'view',
    child: {
      day: 'Ngày',
      week: 'Tuần',
      month: 'Tháng',
      total: 'Tất cả',
    },
  },
  list: {
    name: 'Yuri list',
    type: 'list',
    child: {},
  },
  like: {
    name: 'Yêu thích',
    type: 'like',
    child: {},
  },
}

export default function DynamicRank({apiType, getRanking, teamId, ...props }) {
  const [selectedType, setType] = useState('view')
  const [selectedTime, setTime] = useState('day')
  const [isLoading, setIsLoading] = useState(false)
  const [rank, setRank] = useState({})
  const [data, setData] = useState([])

  useEffect(async () => {
    setIsLoading(true)
    getRanking[apiType](type[selectedType].type, teamId)
      .then((res) => {
        setRank(res)
        setIsLoading(false)
      })
      .catch(() => {
        message.error('Có lỗi xảy ra!')
      })
  }, [apiType])

  useEffect(() => {
    if (!_.isEmpty(rank)) {
      if (selectedType == 'like') {
        setData(rank)
      } else if (selectedType == 'list') {
        setData(rank)
      } else {
        if (setData(rank[selectedTime])) {
          setData(rank[selectedTime])
        }
      }
    }
  }, [selectedTime, rank])

  const handleChangeTab = async (tab) => {
    setIsLoading(true)
    setType(tab)
    getRanking[apiType](type[tab].type, teamId)
      .then((res) => {
        setRank(res)
        setTime(Object.keys(type[tab].child)[0])
        setIsLoading(false)
      })
      .catch((e) => { })
  }

  const handleChangeTime = (time) => setTime(time)

  return (
    <div className="mt-5 bg-pink dark:bg-dark-black p-3 rounded-xl w-5/6 md:w-full max-w-screen rank-panel mx-auto md:ml-auto md:mr-0">
      <div>
        <h2 className="flex items-center">
          <span className="bg-white flex transform rotate-90 p-1 rounded dark:bg-dark-gray">
            <i className="fas fa-align-right text-pink text-md dark:text-dark-text"></i>
          </span>
          <span className="text-white dark:text-dark-text font-semibold text-2xl ml-2">
            Xếp hạng
          </span>
        </h2>
      </div>
      <div className="">
        <div className="mt-2 flex bg-pink dark:bg-dark-black">
          {Object.keys(type).map((itemType, index) => (
            <button
              key={`type-${index}`}
              onClick={() => handleChangeTab(itemType)}
              className={
                selectedType == itemType
                  ? 'flex-1 text-md p-2 pb-4 rounded-tr-xl rounded-tl-xl font-semibold text-gray-800 bg-white leading-none'
                  : 'text-white bg-transparent pb-4 flex-1 text-md p-2 rounded-tr-xl rounded-tl-xl font-semibold font-md leading-none'
              }
            >
              {type[itemType].name}
            </button>
          ))}
        </div>
        <div className="flex bg-transparent transform -translate-y-2">
          {Object.keys(type[selectedType].child).map((childType, index) => (
            <button
              key={`time-${index}`}
              onClick={() => handleChangeTime(childType)}
              className={
                selectedTime == childType
                  ? 'bg-white dark:bg-dark-white dark:text-dark-black flex-1 text-base p-2 font-semibold font-xs leading-none'
                  : 'flex-1 text-base p-2  font-semibold font-xs bg-pink-dark dark:bg-dark-black text-white leading-none'
              }
            >
              {type[selectedType].child[childType]}
            </button>
          ))}
        </div>
      </div>

      {isLoading == true || !data || data.length == 0 ? (
        <div className="transform -translate-y-2 bg-gray-200 dark:bg-dark-black">
          {number.map((item, index) => (
            <>
              <div key={`skeleton-${index}`} className="flex items-center p-1">
                <div
                  className={`text-7xl font-medium flex items-center justify-center flex-shrink-0 flex-grown-0 w-20 ${item}`}
                >
                  {index + 1}
                </div>
                <div className="flex items-center justify-center w-16">
                  <Skeleton height={110} width={70} />
                </div>
                <div className="items-center p-2 w-full">
                  <Skeleton count={5} />
                </div>
              </div>
              <Divider className="my-1" />
            </>
          ))}
        </div>
      ) : (
        <div className="transform -translate-y-2 bg-gray-200 dark:bg-dark-gray pt-4">
          {data &&
            data.map((item, index) => {
              return (
                <>
                  <MangaRank item={item} index={index} key={`manga-${index}`} type={selectedType} mangaType={apiType}/>
                  <Divider key={`devider-${index}`} className="my-1" />
                </>
              )
            })}
        </div>
      )}
    </div>
  )
}

