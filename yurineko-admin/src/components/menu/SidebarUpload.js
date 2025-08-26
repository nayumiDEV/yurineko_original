import { Menu } from 'antd'
import React from 'react'


const { SubMenu } = Menu



export default function SidebarUpload({tab, onChangeTab, menu}) {
  return (
    <Menu theme="dark" defaultSelectedKeys={[tab]} mode="inline" onClick={onChangeTab}>
      {menu.map((item) => {
        return (
          <>
            {item.type === 'single' ? (
              <Menu.Item key={item.key} icon={item.icon} className="flex items-center text-lg">
                {item.label}
              </Menu.Item>
            ) : item.type === 'sub' ? (
              <SubMenu key={item.key} icon={item.icon} title={item.label} className="text-lg">
                {item.subs.map((sub) => (
                  <Menu.Item key={sub.key} className="flex items-center text-lg">
                    {sub.label}
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : null}
          </>
        )
      })}
      
    </Menu>
  )
}
