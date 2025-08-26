import { Menu } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { adminLogout } from '../../redux/actions'

function DropdownUploadUser({ ...props }) {
  const handleLogout = () => {
    props.adminLogout()
  }
  return (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="#" className="text-center text-bold">
          YuneYune
        </a>
      </Menu.Item>

      <Menu.Item>
        <a rel="noopener noreferrer" href="#">
          Trang chủ
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={handleLogout}>Đăng xuất</a>
      </Menu.Item>
    </Menu>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
  adminLogout,
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownUploadUser)
