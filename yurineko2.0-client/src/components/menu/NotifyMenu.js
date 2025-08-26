import { Menu } from "antd";
import React from "react"
import { connect } from "react-redux"
import { readAllNotification } from "../../redux/actions"

function NotifyMenu({ setVisible, ...props }) {
  const handleReadAllNotif = () => {
    props.readAllNotification();
    setVisible(false);
  }

  return (
    <Menu className="bg-white dark:bg-dark-gray text-black dark:text-white rounded border-0" style={{ fontSize: '1.1rem', boxShadow: "0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)" }}>
      <Menu.Item key="1" style={{ margin: 0 }} onClick={handleReadAllNotif}>
        <i class="fas fa-check mr-2"></i>
        Đánh dấu tất cả là đã đọc
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" style={{ margin: 0 }}>
        <a href="/me">
          <i class="text-black dark:text-white fas fa-cog mr-2"></i>
          <span className="text-black dark:text-white">Cài đặt thông báo</span>
        </a>
      </Menu.Item>
    </Menu>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  readAllNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifyMenu)