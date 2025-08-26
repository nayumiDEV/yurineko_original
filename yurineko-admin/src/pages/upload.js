import React, { useEffect, useState } from "react";
import { Dropdown, Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  ReadOutlined,
  FileAddOutlined,
  FrownOutlined,
  MessageOutlined,
  ToolOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import WrapLayout from "layouts/Upload";
import styles from "../styles/Upload.module.css";
import useWindowSize from "hooks/useWindowSize";
import DropdownUploadUser from "components/menu/DropdownUploadUser";
import SidebarUpload from "components/menu/SidebarUpload";
import TabUploadListManga from "components/tab/TabUploadListManga";
import TabUploadListNovel from "components/tab/TabUploadListNovel";
import TabUploadUpload from "components/tab/TabUploadUpload";
import TabUploadComment from "components/tab/TabUploadComment";
import TabUploadCommentNovel from "components/tab/TabUploadCommentNovel";
import TabUploadReport from "components/tab/TabUploadReport";
import TabUploadReportNovel from "components/tab/TabUploadReportNovel";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import useAuth from "hooks/useAuth";
import TabUploadSetting from "components/tab/TabUploadSetting";
import TabUploadNovel from "components/tab/TabUploadNovel";

const { Header, Content, Footer, Sider } = Layout;
const menu = [
  {
    key: 1,
    type: "sub",
    label: "Danh sách truyện",
    icon: <ReadOutlined style={{ fontSize: 20 }} />,
    subs: [
      {
        key: 2,
        type: "single",
        label: "Manga",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadListManga />,
      },
      {
        key: 3,
        type: "single",
        label: "Novel",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadListNovel />,
      },
    ],
  },
  {
    key: 4,
    type: "sub",
    label: "Thêm truyện",
    icon: <FileAddOutlined style={{ fontSize: 20 }} />,
    subs: [
      {
        key: 5,
        type: "single",
        label: "Manga",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadUpload />,
      },
      {
        key: 6,
        type: "single",
        label: "Novel",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadNovel />,
      },
    ],
  },

  {
    key: 7,
    type: "sub",
    label: "Báo cáo",
    icon: <FrownOutlined style={{ fontSize: 20 }} />,
    subs: [
      {
        key: 71,
        type: "single",
        label: "Manga",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadReport />,
      },
      {
        key: 72,
        type: "single",
        label: "Novel",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadReportNovel />,
      },
    ],
  },
  {
    key: 8,
    type: "sub",
    label: "Bình luận",
    icon: <MessageOutlined style={{ fontSize: 20 }} />,
    subs: [
      {
        key: 81,
        type: "single",
        label: "Manga",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadComment />,
      },
      {
        key: 82,
        type: "single",
        label: "Novel",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabUploadCommentNovel />,
      },
    ],
  },
  {
    key: 9,
    type: "single",
    label: "Cài đặt",
    icon: <ToolOutlined style={{ fontSize: 20 }} />,
    component: <TabUploadSetting />,
  },
];

function Upload({ ...props }) {
  const [collapsed, setCollapsed] = useState(true);
  const [tab, setTab] = useState("2");

  const history = useHistory();
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const onChangeTab = ({ key }) => {
    setTab(key);
  };

  const auth = useAuth();

  useEffect(() => {
    if (!auth || !auth.token || auth.role != 2) {
      history.replace("/", "", { shallow: true });
    }
  }, [auth]);

  const listSub = menu.filter((item) => item.type == "sub");
  let listChild = [];
  listSub.forEach((item) => (listChild = [...listChild, ...item.subs]));

  return (
    <WrapLayout>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <a target="_blank" href={process.env.REACT_APP_CLIENT_URL}>
            <div
              className={`w-12 h-12 m-2 mx-auto flex items-center justify-center overflow-hidden`}
            >
              <img
                className="min-w-full min-h-full flex-shrink-0"
                src="/icons/icon-72.png"
              />
            </div>
          </a>
          <SidebarUpload tab={tab} onChangeTab={onChangeTab} menu={menu} />
        </Sider>
        <Layout className={styles.siteLayout}>
          <Header
            className={`${styles.siteLayoutBackground} flex items-center`}
            style={{ padding: 4 }}
          >
            <div className="flex flex-col md:flex-row ml-3">
              <h3 className="text-2xl text-bold mr-3">Team Manager</h3>
              <div className="leading-5 text-base">
                <p style={{ color: "#eb19ad" }}>
                  Quy định
                  <a href="https://docs.google.com/document/d/19Rf5CoA8LM-7knciE1wCY6oia-9wRQS1-cyxv98vRDk/edit"
                    target="_blank" rel="noreferrer"
                    className="ml-1 underline" style={{ color: "#1263d1" }}>
                    Đọc chi tiết
                  </a>
                </p>
                <p style={{ color: "#d11251" }}>Update 21/12/2021</p>
              </div>
            </div>
            <Dropdown
              overlay={<DropdownUploadUser />}
              placement="topCenter"
              className="bg-red ml-auto "
            >
              <div
                style={{ background: "#002140" }}
                className="rounded-full h-10 w-10 flex items-center justify-center"
              >
                <UserOutlined style={{ color: "white" }} />
              </div>
            </Dropdown>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            {[...menu, ...listChild].map((item) => {
              return item.key == tab && item.component;
            })}
          </Content>
          <Footer style={{ textAlign: "center" }} className="text-xs">
            Yurineko - Created by iHelloWorld
          </Footer>
        </Layout>
      </Layout>
    </WrapLayout>
  );
}

const mapStateToProps = (state) => ({
  auth: state.admin.auth,
});

const mapDispatchToProps = {};

let UploadPage = connect(mapStateToProps, mapDispatchToProps)(Upload);

export default UploadPage;
