import React from 'react'

export function AdminTag() {
  return (
    // <span className="select-none p-2 px-2  mr-1 inline-block leading-none font-semibold rounded bg-blue text-white">
    //   Admin
    // </span>
    <img
      className="mr-1 w-16 inline"
      src="/img/admin-icon.png"
      alt="admin"
    />
  )
}

export function UserTag() {
  return (
    <span className="select-none mr-1 inline-block leading-tight px-1 font-semibold rounded bg-blue-dark text-white">
      User
    </span>
  )
}

export function UploadTag() {
  return (
    // <span className="select-none p-2 px-2  mr-1 inline-block leading-none font-semibold rounded bg-pink-dark text-white">
    //   U
    // </span>
    <img
      style={{ width: '1.2rem' }}
      className="mr-1 inline"
      src="/img/uploader-icon.png"
      alt="upload"
    />
  )
}

export function PremiumTag() {
  return (
    // <span className="select-none p-2 px-2  mr-1 inline-block leading-none font-semibold rounded bg-green text-white">
    //   P
    // </span>
    <img
    style={{ width: '1.2rem' }}
    
    className="mr-1 inline" src="/img/premium-icon.png" alt="premium" />
  )
}
