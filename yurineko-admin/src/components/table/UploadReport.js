import React, { useMemo, useState } from "react";
import { Table, Tag, Space, Select, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { banUser } from "../../redux/actions";
import parseTypeReport from "utils/parseTypeReport";

const { Search } = Input;

function mapFromResultToData(result) {
  return result.map((item) => ({
    manga: item.mangaID,
    key: item.id,
    chapter: item.chapterID,
    type: item.type,
    createAt: item.createAt,
    userID: item.userID,
    content: item.content,
    chapterName: item.chapterName,
    mangaName: item.mangaName
  }));
}

function AdminOriginal({ data, handleChangePage, handleDelete, ...props }) {
  const onSearch = (text) => {
    // console.log(text)
    if (text.length > 0) {
      setSearchData(
        allData.filter((item) =>
          String(item.otherName)
            .toLocaleLowerCase()
            .includes(text.toLocaleLowerCase())
        )
      );
    } else setSearchData([]);
  };
  const [allData, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  useMemo(() => {
    setData(mapFromResultToData(data.result));
  }, [data]);

  const columns = [
    {
      title: "Manga",
      dataIndex: "manga",
      key: "manga",
      render: (text, item) => (
        <a
          target="_blank"
          href={process.env.REACT_APP_CLIENT_URL + `/manga/${item.manga}`}
        >
          {item.mangaName}
        </a>
      ),
    },
    {
      title: "Chapter",
      dataIndex: "chapter",
      key: "chapter",
      render: (text, item) => (
        <a
          target="_blank"
          href={
            process.env.REACT_APP_CLIENT_URL +
            `/read/${item.manga}/${item.chapter}`
          }
        >
          {item.chapterName}
        </a>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (text) => <p>{parseTypeReport(text)}</p>,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => <p>{text}</p>,
    },
  ];

  return (
    <div>
      <div className="w-100 bg-red flex flex-wrap items-center justify-between"></div>
      <Table
        columns={columns}
        dataSource={searchData.length > 0 ? searchData : allData}
        onChange={(pagi) => handleChangePage(pagi)}
        pagination={{
          pageSize: 20,
          total: data.resultCount,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}

const mapDispatchToProps = {
  banUser,
};

export default connect(null, mapDispatchToProps)(AdminOriginal);
