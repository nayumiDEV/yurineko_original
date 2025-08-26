import { Button, Divider } from 'antd'
import React, { Component } from 'react'
import UploadBanner from '../form/UploadBanner'

export default class TabAdminSetting extends Component {
  render() {
    return (
      <div>
        {/* <h3 className="text-center font-bold text-3xl p-3">Quản lí banner</h3> */}
        <div>
          <Divider orientation="left" className="mt-3">
            Homepage Banner
          </Divider>
          <UploadBanner name="homepage" />

          <Divider orientation="left" className="mt-3">
            R18 Banner
          </Divider>
          <UploadBanner name="r18" />

          <Divider orientation="left" className="mt-3">
            Manga Banner
          </Divider>
          <UploadBanner name="manga" />
        </div>
      </div>
    )
  }
}
