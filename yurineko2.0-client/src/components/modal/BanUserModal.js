import { Checkbox, Input, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'

export default function BanUserModal({ visible, banData, setBanData, onOk, onCancel }) {
  return (
    <Modal
      title="Ban user"
      visible={visible}
      onCancel={() => onCancel()}
      onOk={onOk}
      okText="Tiếp tục"
      cancelText="Huỷ"
    >
      <Input
        value={banData.time}
        placeholder="Số ngày ban"
        type="number"
        className="w-full mb-2"
        onChange={(e) => setBanData({ ...banData, time: e.target.value })}
      />
      <TextArea
        value={banData.reason}
        placeholder="Lý do"
        lines={3}
        className="w-full mb-2"
        onChange={(e) => setBanData({ ...banData, reason: e.target.value })}
      />
      <Checkbox
        checked={banData.isDeleteComment}
        onChange={(e) => setBanData({ ...banData, isDeleteComment: e.target.checked })}
      >
        Xoá bình luận
      </Checkbox>
    </Modal>
  )
}
