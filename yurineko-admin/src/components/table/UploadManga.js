import React, { useMemo, useState } from "react";
import { Table, Tag, Space, Select, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MangaTeamManager from "../form/MangaTeamManager";
import useAuth from "hooks/useAuth";
import { findManga } from "api/admin";

const { Search } = Input;

function mapFromResultToData(result) {
  return result.map((item) => ({
    otherName: item.otherName,
    originalName: item.originalName,
    key: item.id,
    chapCount: item.totalChapter,
    description: item.description,
    group: item.team?.name,
    status: item.status,
    view: item.totalView,
    tags: [],
    type: item.type,
    follow: item.totalFollow,
    ...item,
  }));
}

export default function AdminOriginal({
  data,
  handleShowModal,
  showDeleteConfirm,
  handleOpenDrawer,
  handleChangePage,
  handleSetStatus,
}) {
  const onSearch = async (text) => {
    // console.log(text)
    if (text.length > 0) {
      const res = await findManga(text);
      setSearchData(mapFromResultToData(res));
    } else setSearchData([]);
  };
  const [allData, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isOpen, setIsOpenModal] = useState(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleChange = (value) => {};

  useMemo(() => {
    setData(mapFromResultToData(data.result));
  }, [data]);

  const auth = useAuth();

  const columns = [
    {
      title: "Tên Truyện",
      dataIndex: "originalName",
      key: "originalName",
      render: (text, item) => (
        <a target="_blank" href={process.env.REACT_APP_CLIENT_URL + `/manga/${item.key}`}>
          {text}
        </a>
      ),
    },
    {
      title: "Thể Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => <span>{type == 1 ? "Truyện thường" : "Doujin"}</span>,
    },
    // {
    //   title: 'Nhóm dịch',
    //   dataIndex: 'team',
    //   key: 'team',
    //   render: (team) => <span>{team.name}</span>,
    // },
    {
      title: "Tình Trạng",
      dataIndex: "status",
      key: "status",
      render: (status, item) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          onChange={(value) => {
            handleSetStatus({ id: item.key, status: value });
          }}
        >
          <Select.Option value={1}>Chưa ra mắt</Select.Option>
          <Select.Option value={2}>Đã hoàn thành</Select.Option>
          <Select.Option value={3}>Sắp ra mắt</Select.Option>
          <Select.Option value={4}>Đang tiến hành</Select.Option>
          <Select.Option value={5}>Ngừng dịch</Select.Option>
          <Select.Option value={6}>Tạm ngưng</Select.Option>
          <Select.Option value={7}>Ngừng xuất bản</Select.Option>
        </Select>
      ),
    },
    {
      title: "Follow",
      dataIndex: "follow",
      key: "follow",
    },
    {
      title: "Lượt Xem",
      dataIndex: "view",
      key: "view",
    },
    {
      title: "Công Cụ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {/* <a>Invite {record.name}</a> */}
          <a
            className="text-green-600"
            onClick={() => handleShowModal(record.key)}
          >
            Chapter
          </a>
          <a className="text-blue" onClick={() => handleOpenDrawer(record)}>
            Sửa
          </a>
          {/* <a className="text-yellow-600">Report</a> */}
          <a
            className="text-red-600"
            onClick={() => showDeleteConfirm(record.key)}
          >
            Xóa
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div className="w-100 bg-red flex flex-wrap items-center justify-between">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
            style={{ width: 200 }}
          />
        </div>
        {auth && auth.role == 3 && (
          <div>
            <Button onClick={handleOpenModal}>Quản lí sở hữu</Button>
          </div>
        )}
      </div>
      <Table
        columns={columns}
        dataSource={searchData.length > 0 ? searchData : allData}
        onChange={(pagi) => handleChangePage(pagi)}
        pagination={{
          pageSize: process.env.REACT_APP_PAGE_SIZE,
          total: data.resultCount,
          showSizeChanger: false,
        }}
      />
      {auth && auth.role == 3 && (
        <MangaTeamManager
          isOpen={isOpen}
          handleCancel={() => setIsOpenModal(false)}
        />
      )}
    </div>
  );
}
