import LayoutHome from '@/layouts/Home'
import React from 'react'
import Link from 'next/link'

export default function error() {
  return (
    <LayoutHome>
      <div className="container mx-auto xl:px-40">
        <div className="flex items-center justify-center mt-8 overflow-hidden h-full w-full flex-col">
          <img
            className="max-w-md max-h-full flex-shrink-0"
            src="/img/quenmatkhau.png"
            alt="img"
          />
          <div className="text-center">
            <h2 className="text-2xl text-pink font-bold text-center ">
              Không tìm thấy trang bạn yêu cầu{' '}
            </h2>
            <Link href="/" replace={true}>
              <a className="underline text-blue">Quay về trang chủ</a>
            </Link>
          </div>
        </div>
      </div>
    </LayoutHome>
  )
}
