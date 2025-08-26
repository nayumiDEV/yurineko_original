import { timeFromNow } from '@/utils/timeUpdate'
import { Modal } from 'antd'
import React from 'react'
import Countdown from 'react-countdown'

export default function BanModal({ banned, onClose }) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return '00:00:00'
    } else {
      // Render a countdown
      return (
        <span className="ml-2 text-gray-500">
          {days > 0 ? days + ' ngày' : ''} {hours}:{minutes}:{seconds}s
        </span>
      )
    }
  }

  return (
    <Modal visible={banned} footer={false} closable={true} onCancel={onClose}>
      <div className="p-5">
        <h2 className="text-red-500 text-4xl font-extrabold flex items-center">
          BẠN ĐÃ BỊ BAN! <img src="/icons/prohibited.png" className="w-10 h-10 ml-2" />
        </h2>
        <p className="my-2 text-xl">
          <span className="text-gray-dark font-extrabold text-2xl">Lý do:</span>
          <span className="ml-2 text-gray-500">{banned?.reason}</span>
        </p>
        <p className="my-2 text-xl">
          <span className="text-gray-dark font-extrabold text-2xl">Thời gian:</span>
          {/* <span className="ml-2 text-gray-500">{timeFromNow(banned?.expireAt)}</span> */}
          <Countdown date={new Date(banned?.expireAt)} renderer={renderer} />
        </p>
      </div>
    </Modal>
  )
}
