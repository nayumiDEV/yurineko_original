import { Divider, Drawer, Switch } from 'antd'
import React, { Component, useState } from 'react'
import Menu from '../menu/Menu'

export default function SlideBar({ visible, onClose }) {
  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ padding: 12 }}
      className="user-sidebar"
    >
      <Menu />
    </Drawer>
  )
}
