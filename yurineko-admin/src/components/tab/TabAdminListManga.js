import React, { Component, useEffect, useState } from "react";
import { delManga } from "../../redux/actions/upload";
import { getMangaList } from "../../redux/actions";
import { setStatusManga } from "../../redux/actions/index";
import { connect } from "react-redux";
import _ from "lodash";

import { Modal, Drawer, message, Empty } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import useWindowSize from "hooks/useWindowSize";
import DataField from "../table/AdminManga";
import AddOriginal from "../form/AddOriginal";
import FormUploadManga from "../form/FormUploadManga";
import FormUploadImageManga from "../form/FormUploadImageManga";

const { confirm } = Modal;

function TabAdminListManga({ ...props }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [editData, setEditData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mangaIDShow, setMangaIDShow] = useState("");

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
    props.delData(id, getData);
  };

  const handleAdd = (data) => {
    props.addData({ type: "manga", data }, getData);
  };

  const handleEdit = (data) => {
    let newData = { ...editData, ...data };
    props.editData({ type: "manga", data: newData }, getData);
    handleCloseDrawer();
  };

  const handleShowModal = (id) => {
    setIsModalVisible(true);
    setMangaIDShow(id);
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
    setEditData("");
  };
  const handleOpenDrawer = (data) => {
    setVisibleDrawer(true);
    setEditData(data);
  };

  const handleChangePage = ({ current }) => {
    getData(current);
  };

  const handleSetStatus = ({ id, status }) => {
    props.setStatusManga({ id, status }, getData);
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
              handleSetStatus={handleSetStatus}
            />
          ) : (
            <Empty />
          )}
        </div>
      </div>
      <Modal
        title="Danh sách chapter"
        width={1204 < width * 1 ? 1204 : width}
        footer={null}
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <FormUploadImageManga mangaID={mangaIDShow} />
      </Modal>
      {_.isEmpty(editData) == false && (
        <Drawer
          width={640 < width * 0.7 ? 640 : width}
          placement="right"
          closable={false}
          onClose={handleCloseDrawer}
          visible={visibleDrawer}
          closable={true}
        >
          <div className="mt-8">
            <FormUploadManga
              data={editData}
              closeDrawer={handleCloseDrawer}
              getData={getData}
            />
          </div>
        </Drawer>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  data: {
    ...state.admin.manga,
  },
  isLoading: state.general.isLoading,
});

const mapDispatchToProps = {
  apiGetData: getMangaList,
  setStatusManga,
  delData: delManga,
  // addData,
  // editData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabAdminListManga);
