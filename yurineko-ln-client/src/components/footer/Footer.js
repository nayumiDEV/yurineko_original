import { Layout } from 'antd'
import React from 'react'

const { Footer } = Layout

export default function MyFooter() {
  const currentDate = new Date()
  return (
    <Footer className="absolute bg-gray-footer dark:bg-dark-black mt-auto bottom-0 w-screen">
      <div className="flex flex-col justify-center items-center">
        <img src="/img/logo-footer.png" alt="logo" className="w-48" />
        <p className="text-white">Project Yurineko ver 2.0</p>
        <p className="text-white">© Copyright {currentDate.getFullYear()} Yunene</p>
        <p className="text-white">Email: info@yurineko.moe</p>
      </div>
    </Footer>
  )
}
