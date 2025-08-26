import React from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { Avatar, Skeleton } from 'antd'

export default function AdminUserCard({ value, isLoading }) {
  return (
    <div className="bg-white rounded p-4 flex items-center">
      {isLoading ? (
        <Skeleton avatar paragraph={{ rows: 1 }} />
      ) : (
        <>
          <div>
            <Avatar src={`${value.avatar}`} />
          </div>
          <div className="ml-3">
            <p className="text-md">{value.name}</p>
            <p className="text-gray text-sm">{value.email}</p>
            {value.confirmed == 1 ? (
              <p className="text-green text-md font-bold">Activated</p>
            ) : (
              <p className="text-red text-md font-bold">Not activated</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
