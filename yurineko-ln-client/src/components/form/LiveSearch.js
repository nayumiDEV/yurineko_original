import { search } from '@/utils/makeRequest'
import { Empty, Input, Skeleton } from 'antd'
import React, { useState } from 'react'
import Link from 'next/link'
import { searchByKeywork } from 'api/general'
import { lightnovelLink } from '@/utils/generateLink'
import { useRouter } from 'next/router'
import handleErrorApi from '@/utils/handleErrorApi'

export default function LiveSearch() {
  const [visiblePanel, setVisiblePanel] = useState(false)
  const [result, setResult] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChoose, setChoose] = useState(false)

  const handleFocus = () => {
    setVisiblePanel(true)
  }
  const handleBlur = () => {
    if (isChoose == false) {
      setVisiblePanel(false)
    }
  }
  const handleInput = (event) => {
    handleSearch(event.target.value)
  }
  const handlePushSearch = (event) => {
    if (event.which == 13) window.location.replace(`/search?query=${event.target.value}`)
  }
  const handleSearch = async (query) => {
    try {
      if (query.length > 0) {
        setIsLoading(true)
        const res = await searchByKeywork(query)
        setIsLoading(false)
        if (res) setResult(res.result)
      } else {
        setResult([])
      }
    } catch (e) {
      handleErrorApi(e)
    }
  }
  return (
    <div className="relative p-2 hidden md:flex search-panel flex-col justify-center items-center 2xl:mr-24 mr-10">
      {visiblePanel && (
        <div
          onMouseEnter={() => setChoose(true)}
          onMouseLeave={() => setChoose(false)}
          className={`z-40 shadow-md  w-full top-0 absolute `}
        >
          <div className="shadow-md opacity-0 rounded bg-white p-2 w-full h-full pt-12 search-result-panel">
            <div className="w-full pt-2 search-result scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
              {/* <Empty /> */}
              {isLoading == true ? (
                <>
                  <Skeleton active />
                  <Skeleton active />
                </>
              ) : result.length == 0 ? (
                <Empty description={<p className="text-gray">Không tìm thấy kết quả...</p>} />
              ) : (
                <ul className="w-full">
                  {result.slice(0, 6).map((item) => (
                    <a key={item.id} href={lightnovelLink(item.id)}>
                      <li className="flex my-1 cursor-pointer hover:bg-blue-light w-full overflow-hidden items-center">
                        <div className="flex-shrink-0 w-10 h-12 flex items-center justify-center overflow-hidden">
                          <img
                            className="flex-shrink-0 max-w-full max-h-full w-full "
                            src={item.thumbnail}
                            alt="image"
                          />
                        </div>
                        <div className="pl-2 flex-1">
                          <p className="clamp-1 text-md font-semibold text-black leading-tight">
                            {item.originalName}
                          </p>
                          <p className="text-blue font-semibold leading-tight text-xs italic clamp-1">
                            {item.author?.map((item) => <a key={item.name}>{item.name}</a>) ?? ''}
                          </p>
                          <div className="clamp-1">
                            {item.tag?.map((item) => (
                              <span
                                key={item.name}
                                className="mr-1 italic text-xs text-gray leading-tight"
                              >
                                {item.name}
                              </span>
                            )) ?? ''}
                            {item.couple?.map((item) => (
                              <span
                                key={item.name}
                                className="mr-1 italic text-xs text-pink leading-tight"
                              >
                                {item.name}
                              </span>
                            )) ?? ''}
                          </div>
                        </div>
                      </li>
                    </a>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      <div className=" relative z-50 justify-center items-center hidden md:flex ">
        <Input
          prefix={<i className="fas fa-search text-md text-gray-300"></i>}
          type="text"
          placeholder="Tìm kiếm..."
          allowClear={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInput}
          onKeyPress={handlePushSearch}
          className="search-input w-72 rounded-full py-1 px-3 text-gray-800 text-md font-semibold"
        />
      </div>
    </div>
  )
}
