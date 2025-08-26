import LayoutHome from '@/layouts/Home'
import React from 'react'
import Link from 'next/link'

export default function error() {
  return (
    <LayoutHome>
      <div className="container mx-auto xl:px-40">
        <div className="flex items-center justify-center mt-8 overflow-hidden h-full w-full flex-col text-left">
          <h1 className="text-center text-lg font-bold">Chính sách bảo mật</h1>
          <p>
            Yurineko biết rằng sự riêng tư và bảo mật thông tin cá nhân rất quan trọng đối với người
            dùng, vì vậy yurineko sẽ luôn nỗ lực hết sức để bảo vệ thông tin của người dùng.
          </p>
          <h2>1. Những dữ liệu yurineko cần người dùng cung cấp:</h2>
          <p>Người dùng cần cung cấp địa chỉ email để đăng ký tài khoản yurineko.</p>
          <h2>2. Mục đích sử dụng dữ liệu của người dùng</h2>
          <p>
            Chúng tôi sử dụng dữ liệu người dùng cung cấp với mục đích hỗ trợ người dùng trong các
            trường hợp như quên mật khẩu hay mất quyền truy cập vào tài khoản.
          </p>
          <h2>3. Cách người dùng có thể xóa, yêu cầu các quyền liên quan đến dữ liệu cá nhân</h2>
          <p>
            Người dùng có thể yêu cầu xóa dữ liệu bằng cách liên hệ với địa chỉ email chính thức của
            yurineko: info@yurineko.moe
          </p>
        </div>
      </div>
    </LayoutHome>
  )
}
