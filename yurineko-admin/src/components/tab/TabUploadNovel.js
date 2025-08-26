import React, { Component } from "react";

import { Layout, Menu, Breadcrumb, Table } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import FormUploadNovel from "components/form/FormUploadNovel";
import FormUploadCoverManga from "components/form/FormUploadCoverManga";
import FormUploadImageManga from "components/form/FormUploadImageManga";

export default class TabUploadNovel extends Component {
  render() {
    return (
      <>
        <div
          className="bg-white p-2 md:px-2 md:py-5"
          style={{ minHeight: 360 }}
        >
          <div className="overflow-x-auto">
            <FormUploadNovel />
            {/* <FormUploadCoverManga /> */}
            {/* <FormUploadImageManga /> */}
          </div>
        </div>
      </>
    );
  }
}
