import React, { useMemo, useState } from "react";
import { Table, Tag, Space, Select, Input, Switch, message } from "antd";
import { findUser } from "api/admin";

const { Search } = Input;

function mapFromResultToData(result) {
  return result.map((item) => ({
    name: item.name,
    key: item.id,
    team: item.teamName,
    role: item.role,
    mail: item.email,
    createAt: item.createAt,
    isBanned: item.isBanned,
    money: item.money,
    ...item,
  }));
}

export default function AdminOriginal({
  data,
  handleShowModal,
  showDeleteConfirm,
  handleOpenDrawer,
  handleChangePage,
  handleBanUser,
  isLoading,
  ...props
}) {
  const [allData, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSearch = async (text) => {
    if (text.length > 0) {
      const res = await findUser(text);
      setSearchData(mapFromResultToData(res));
    } else setSearchData([]);
  };
  const handleChange = (e) => {
    // console.log()
    if (e.target.value.length == 0) {
      setSearchData([]);
    }
  };

  useMemo(() => {
    const newData = mapFromResultToData(data.result);
    setData(newData);
  }, [data]);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "mail",
      key: "mail",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role == 1) return <Tag color={"blue"}>User</Tag>;
        if (role == 2) return <Tag color={"green"}>Uploader</Tag>;
        if (role == 3) return <Tag color={"red"}>Admin</Tag>;
        return null;
      },
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
    },

    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (time) => (
        <span>{new Date(time).toLocaleDateString("vi-VN")}</span>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "isBanned",
      key: "isBanned",
      render: (isBanned, record) => {
        return (
          <>
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Banned"
              loading={loading}
              defaultChecked={!isBanned}
              checked={!isBanned}
              onChange={() => {
                setLoading(true);
                handleBanUser(isBanned, record.key, () => setLoading(false));
              }}
            />
          </>
        );
      },
    },

    {
      title: "Công Cụ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {/* <a>Invite {record.name}</a> */}
          <a className="text-green-600" onClick={() => handleShowModal(record)}>
            Thêm donate
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="w-100 bg-red flex flex-wrap items-center justify-between">
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          onChange={handleChange}
          enterButton
          style={{ width: 200 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={searchData.length > 0 ? searchData : allData}
        onChange={(pagi) => handleChangePage(pagi)}
        pagination={{
          pageSize: 20,
          total: searchData.length > 0 ? searchData.length : data.resultCount,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
