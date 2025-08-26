import { Row } from 'antd'
import { getBanner } from 'api/general'
import React, { useEffect } from 'react'

export default function Banner({ url }) {
  return (
    <div className="w-full bg-gray-light hidden md:block dark:bg-dark">
      <div className="container mx-auto xl:px-40">
        <div className="mr-2 flex item-center justify-center w-full">
          <img className="block mx-auto rounded-bl-xl rounded-br-xl flex-shrink-0 min-w-full min-h-full" src={url} alt="banner" />
        </div>
      </div>
    </div>
  )
}
