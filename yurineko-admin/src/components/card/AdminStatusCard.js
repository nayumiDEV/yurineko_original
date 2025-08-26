import React from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { Skeleton } from 'antd'

export default function AdminStatusCard({ isLoading, title, value, description, icon }) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-300 rounded p-4 flex justify-between items-center text-white">
      <div>
        <p className="uppercase font-bold text-sm">
          {isLoading ? <Skeleton.Input style={{ width: 150 }} active={true} active /> : title}
        </p>
        <p className="uppercase font-bold text-3xl mt-3">
          {isLoading ? <Skeleton.Input style={{ width: 150 }} active={true} active /> : value}
        </p>
        <p>
          {isLoading ? <Skeleton.Input style={{ width: 150 }} active={true} active /> : description}
        </p>
      </div>
      <div className="rounded-full bg-blue-300 p-4 md:flex items-center justify-center hidden">
        {isLoading == true ? <Skeleton.Avatar size="18" shape="circle" active={true} /> : icon}
      </div>
    </div>
  )
}
