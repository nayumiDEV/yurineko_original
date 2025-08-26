import React, { Component, useEffect, useState } from "react";
import {
  getOriginalList,
  delData,
  addData,
  editData,
} from "../../redux/actions";
import { connect } from "react-redux";
import _ from "lodash";

import { Modal, Drawer, message, Empty } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import useWindowSize from "hooks/useWindowSize";
import DataField from "../table/AdminOriginal";
import AddOriginal from "../form/AddOriginal";

const { confirm } = Modal;

function TabAdminListManga({ ...props }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [editData, setEditData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getData();
  }, []);

  const { width } = useWindowSize();

  const getData = (page = currentPage) => {
    const hide = message.loading("Loading data..", 0);
    setCurrentPage(page);
    props.apiGetData(page);
    setTimeout(hide, 2000);
  };

  const handleDelete = (id) => {
    props.delData({ type: "origin", id }, getData);
  };

  const handleAdd = (data) => {
    props.addData({ type: "origin", data }, getData);
  };

  const handleEdit = (data) => {
    let newData = { ...editData, ...data };
    props.editData({ type: "origin", data: newData }, getData);
    handleCloseDrawer();
  };

  const handleShowModal = (id) => {
    setIsModalVisible(true);
  };
  const handleOk = (data) => {
    setIsModalVisible(false);
    handleAdd(data);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCloseDrawer = () => {
    setVisibleDrawer(false);
  };
  const handleOpenDrawer = (data) => {
    setVisibleDrawer(true);
    setEditData(data);
  };

  const handleChangePage = ({ current }) => {
    getData(current);
  };

  function showDeleteConfirm(id) {
    confirm({
      title: "Bạn có chắc muốn xóa mục này?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Dữ liệu đã xóa có thể ảnh hưởng tới những dữ liệu khác trên hệ thống!",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDelete(id);
      },
      onCancel() {},
    });
  }
  const { isLoading } = props.isLoading;
  const data = props.data;
  return (
    <>
      <div
        className="mt-2 bg-white p-2 md:px-2 md:py-5"
        style={{ minHeight: 360 }}
      >
        <div className="overflow-x-auto">
          {_.isEmpty(data) == false ? (
            <DataField
              data={data}
              handleShowModal={handleShowModal}
              showDeleteConfirm={showDeleteConfirm}
              handleOpenDrawer={handleOpenDrawer}
              handleChangePage={handleChangePage}
            />
          ) : (
            <Empty />
          )}
        </div>
      </div>
      <Modal
        title="Thêm truyện gốc"
        width={500 < width * 0.7 ? 500 : width}
        footer={null}
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <AddOriginal onCancel={handleCancel} handleOk={handleOk} />
      </Modal>
      {_.isEmpty(editData) == false && (
        <Drawer
          key={editData.id}
          width={640 < width * 0.7 ? 640 : width}
          placement="right"
          closable={false}
          onClose={handleCloseDrawer}
          visible={visibleDrawer}
          closable={true}
        >
          <div className="mt-8">
            <h2 className="mb-2 text-xl text-center text-pink-dark font-semibold">
              Chỉnh sửa truyện gốc
            </h2>
            <AddOriginal
              data={editData}
              handleOk={handleEdit}
              onCancel={handleCloseDrawer}
            />
          </div>
        </Drawer>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  data: {
    ...state.admin.original,
  },
  isLoading: state.general.isLoading,
});

const mapDispatchToProps = {
  apiGetData: getOriginalList,
  delData,
  addData,
  editData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabAdminListManga);
