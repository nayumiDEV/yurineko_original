import React, { useState, useEffect } from "react";
import { Dropdown, Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  ReadOutlined,
  ProfileOutlined,
  FrownOutlined,
  MessageOutlined,
  PieChartOutlined,
  TeamOutlined,
  FileImageOutlined,
  TagsOutlined,
  HeartOutlined,
  HighlightOutlined,
  DollarOutlined,
  ToolOutlined,
  FileAddOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import WrapLayout from "layouts/Upload";
import styles from "../styles/Upload.module.css";
import useWindowSize from "hooks/useWindowSize";
import DropdownUploadUser from "components/menu/DropdownUploadUser";
import SidebarUpload from "components/menu/SidebarUpload";
import TabAdminMonitor from "components/tab/TabAdminMonitor";
import TabAdminListManga from "components/tab/TabAdminListManga";
import TabAdminListOriginal from "components/tab/TabAdminListOriginal";
import TabAdminSetting from "components/tab/TabAdminSetting";
import { connect } from "react-redux";
import TabAdminListTeam from "components/tab/TabAdminListTeam";
import TabAdminListUser from "components/tab/TabAdminListUser";
import TabAdminListTag from "components/tab/TabAdminListTag";
import TabAdminListCouple from "components/tab/TabAdminListCouple";
import TabAdminListAuthor from "components/tab/TabAdminListAuthor";
import TabAdminListComment from "components/tab/TabAdminListComment";
import TabAdminListCommentNovel from "components/tab/TabAdminListCommentNovel";
import TabAdminListDonate from "components/tab/TabAdminListDonate";
import { useHistory } from "react-router";
import isClient from "utils/isClient";
import useAuth from "hooks/useAuth";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import TabAdminListNovel from "components/tab/TabAdminListNovel";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const menu = [
  {
    key: 1,
    type: "single",
    label: "Thống kê",
    icon: <PieChartOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminMonitor />,
  },
  {
    key: 3,
    type: "single",
    label: "Truyện gốc",
    icon: <FileImageOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminListOriginal />,
  },
  {
    key: 4,
    type: "sub",
    label: "Danh sách truyện",
    icon: <ProfileOutlined style={{ fontSize: 20 }} />,
    subs: [
      {
        key: 40,
        type: "single",
        label: "Manga",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabAdminListManga />,
      },
      {
        key: 41,
        type: "single",
        label: "Novel",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabAdminListNovel />,
      },
    ],
  },
  {
    key: 5,
    type: "single",
    label: "Quản lí group",
    icon: <TeamOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminListTeam />,
  },
  {
    key: 6,
    type: "single",
    label: "Quản lí user",
    icon: <UserOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminListUser />,
  },
  {
    key: 7,
    type: "single",
    label: "Tags",
    icon: <TagsOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminListTag />,
  },
  {
    key: 9,
    type: "single",
    label: "Couple",
    icon: <HeartOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminListCouple />,
  },
  {
    key: 10,
    type: "single",
    label: "Tác giả",
    icon: <HighlightOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminListAuthor />,
  },
  {
    key: 11,
    type: "sub",
    label: "Bình luận",
    icon: <MessageOutlined style={{ fontSize: 20 }} />,
    subs: [
      {
        key: 110,
        type: "single",
        label: "Manga",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabAdminListComment />,
      },
      {
        key: 111,
        type: "single",
        label: "Novel",
        icon: <FileAddOutlined style={{ fontSize: 20 }} />,
        component: <TabAdminListCommentNovel />,
      },
    ],
  },
  {
    key: 12,
    type: "single",
    label: "Donate",
    icon: <DollarOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminListDonate />,
  },
  {
    key: 13,
    type: "single",
    label: "Cài đặt trang web",
    icon: <ToolOutlined style={{ fontSize: 20 }} />,
    component: <TabAdminSetting />,
  },
];

function Admin({ ...props }) {
  const history = useHistory();
  const { width } = useWindowSize();
  const [collapsed, setCollapsed] = useState(true);
  const [tab, setTab] = useState("1");
  const [isLogin, setIsLogin] = useState(true);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const onChangeTab = ({ key }) => {
    setTab(key);
  };
  // if (typeof window !== 'undefined') {
  //   if (!auth || !auth.token || auth.role != 3) {
  //     route.replace('/', '', { shallow: true })
  //   }
  // }
  // if(!auth || !auth.token)

  // if (isClient()) {
  //   const auth = useAuth();
  //   if (!auth || !auth.token || auth.role != 3) {
  //     history.replace("/", "", { shallow: true });
  //   }
  // }

  const auth = useAuth();

  useEffect(() => {
    if (!auth || !auth.token || auth.role != 3) {
      history.replace("/", "", { shallow: true });
    }
  }, [auth]);
  const listSub = menu.filter((item) => item.type == "sub");
  let listChild = [];
  listSub.forEach((item) => (listChild = [...listChild, ...item.subs]));

  return (
    <WrapLayout>
      <Helmet>
        <title>Admin Control Panel</title>
      </Helmet>
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
            <h3 className="text-2xl text-bold">Admin Dashboard</h3>
            <Dropdown
              overlay={<DropdownUploadUser />}
              placement="topCenter"
              className="bg-red ml-auto"
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

let AdminPage = connect(mapStateToProps, mapDispatchToProps)(Admin);

export default AdminPage;
