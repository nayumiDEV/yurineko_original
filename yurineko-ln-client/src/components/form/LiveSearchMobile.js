import React, { useState } from 'react'
import { Drawer, Empty, Input, Skeleton } from 'antd'
import Link from 'next/link'
import { search } from '@/utils/makeRequest'
import { searchByKeywork } from 'api/general'
import { lightnovelLink } from '@/utils/generateLink'
import imgLink from '@/utils/imgLink'
import handleErrorApi from '@/utils/handleErrorApi'
import useWindowSize from '@/hooks/useWindowSize'

export default function LiveSearchMobile() {
  const [visible, setVisible] = useState(false)
  const [visiblePanel, setVisiblePanel] = useState(false)
  const [result, setResult] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
    setVisiblePanel(false)
  }

  const onChange = (e) => {}

  const handleFocus = () => {
    setVisiblePanel(true)
  }
  const handleBlur = () => {
    // setVisiblePanel(false)
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
        //   console.log(res)
        setIsLoading(false)
        if (res) setResult(res.result)
      } else {
        setResult([])
      }
    } catch (e) {
      handleErrorApi(e)
      // console.log(e)
    }
  }

  const size = useWindowSize();

  return (
    <>
      <div className="ml-2" onClick={showDrawer}>
        <i className="fas fa-search text-2xl" />
      </div>
      <Drawer
        placement="top"
        closable={false}
        onClose={onClose}
        visible={visible}
        key="drawer-search"
        className="search-drawer"
        height={80}
        bodyStyle={{
          padding: 0,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          height: 'fit-content',
        }}
        drawerStyle={
          {
            // height: "fit-content"
          }
        }
      >
        <div className="w-full z-top mb-2">
          <div className="relative flex z-top justify-center items-center mt-2 px-3">
            <Input
              prefix={<i className="fas fa-search text-md text-gray-300"></i>}
              type="text"
              placeholder="Tìm kiếm..."
              allowClear={true}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInput}
              onKeyPress={handlePushSearch}
              className="search-input w-full rounded-full py-1 px-3 text-gray-800 text-md font-semibold"
            />
          </div>
          <div className="relative search-panel flex-col justify-center items-center w-full">
            {visiblePanel && (
              <div className={`z-top w-full top-0 left-0 `}>
                <div className=" opacity-0 rounded bg-white p-2 w-full h-full search-result-panel">
                  <div className="pt-2 scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
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
                              <div className="w-10 h-12 flex items-center justify-center overflow-hidden">
                                <img
                                  className="flex-shrink-0 max-w-full max-h-full w-full "
                                  src={imgLink(item.thumbnail)}
                                  alt="image"
                                />
                              </div>
                              <div className="pl-2 flex-1">
                                <p className="clamp-1 text-md font-semibold text-black leading-tight">
                                  {item.originalName}
                                </p>
                                <p className="text-blue font-semibold leading-tight text-xs italic clamp-1">
                                  {item.author?.map((item) => (
                                    <span key={item.name} className="text-blue">{item.name}</span>
                                  )) ?? ''}
                                </p>
                                <div className="clamp-1">
                                  {item.tag?.map((item) => (
                                    <span key={item.name} className="mr-1 italic text-xs text-gray leading-tight">
                                      {item.name}
                                    </span>
                                  )) ?? ''}
                                  {item.couple?.map((item) => (
                                    <span key={item.name} className="mr-1 italic text-xs text-pink leading-tight">
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
          </div>
        </div>
        <Link href="/advanced">
          <div className="p-2 text-right text-white bg-blue-dark w-full">
            Tìm kiếm nâng cao <i className="fas fa-search-plus"></i>
          </div>
        </Link>
      </Drawer>
    </>
  )
}
