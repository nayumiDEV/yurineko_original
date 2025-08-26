import React, { Component, useEffect, useState } from 'react';
import {
  getUserList,
  delData,
  addData,
  editData,
  addDonate,
  banUser,
} from '../../redux/actions';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Modal, Drawer, message, Empty, Input, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import useWindowSize from 'hooks/useWindowSize';
import DataField from '../table/AdminUser';
import AddDonate from '../form/AddDonate';
import { findUser } from 'api/admin';
import TextArea from 'antd/lib/input/TextArea';

const { confirm } = Modal;

function TabAdminListManga({ ...props }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModalBan, setModalBan] = useState(false);
  const [addDonateData, setAddDonateData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cb, setCb] = useState(null);
  const [banData, setBanData] = useState({
    id: '',
    time: '',
    isDeleteComment: false,
    reason: '',
  });

  useEffect(() => {
    getData();
  }, []);

  const { width } = useWindowSize();

  const getData = (page = currentPage) => {
    const hide = message.loading('Loading data..', 0);
    setCurrentPage(page);
    props.apiGetData(page);
    setTimeout(hide, 2000);
  };

  const handleDelete = (id) => {
    props.delData({ type: 'user', id }, getData);
  };

  const handleAddDonate = (data) => {
    props.addDonate(data, getData);
  };

  const handleOk = (data) => {
    setIsModalVisible(false);
    handleAddDonate({ ...data, userID: addDonateData.id });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleShowModal = (data) => {
    setIsModalVisible(true);
    setAddDonateData(data);
  };

  const handleChangePage = ({ current }) => {
    getData(current);
  };
  const handleBanUser = (status, id, callbackOfSwitch) => {
    if (status == 0) {
      setBanData({ ...banData, id });
      setModalBan(true);
      setCb(callbackOfSwitch);
    } else {
      props.banUser({ id, time: 0 }, () => {
        getData();
        callbackOfSwitch();
      });
    }
  };

  const banUser = () => {
    if (banData.id && banData.time) {
      props.banUser({ ...banData }, () => {
        getData();
        setBanData({
          id: '',
          time: '',
          isDeleteComment: false,
          reason: '',
        });
        setModalBan(false);
        cb?.();
      });
    } else {
      message.error('Thông tin chưa đủ để ban user');
    }
  };

  function showDeleteConfirm(id) {
    confirm({
      title: 'Bạn có chắc muốn xóa mục này?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Dữ liệu đã xóa có thể ảnh hưởng tới những dữ liệu khác trên hệ thống!',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
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
        className='mt-2 bg-white p-2 md:px-2 md:py-5'
        style={{ minHeight: 360 }}
      >
        <div className='overflow-x-auto'>
          {_.isEmpty(data) == false ? (
            <DataField
              data={data}
              showDeleteConfirm={showDeleteConfirm}
              handleShowModal={handleShowModal}
              handleChangePage={handleChangePage}
              handleBanUser={handleBanUser}
            />
          ) : (
            <Empty />
          )}
        </div>
      </div>
      <Modal
        title='Thêm donate'
        width={500 < width * 0.7 ? 500 : width}
        footer={null}
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <AddDonate onCancel={handleCancel} handleOk={handleOk} />
      </Modal>
      <Modal
        title='Ban user'
        width={500 < width * 0.7 ? 500 : width}
        visible={showModalBan}
        onCancel={() => setModalBan(false)}
        onOk={banUser}
        okText='Tiếp tục'
        cancelText='Huỷ'
      >
        <Input
          value={banData.time}
          placeholder='Số ngày ban'
          type='number'
          className='w-full mb-2'
          onChange={(e) => setBanData({ ...banData, time: e.target.value })}
        />
        <TextArea
          value={banData.reason}
          placeholder='Lý do'
          lines={3}
          className='w-full mb-2'
          onChange={(e) => setBanData({ ...banData, reason: e.target.value })}
        />
        <Checkbox
          checked={banData.isDeleteComment}
          onChange={(e) =>
            setBanData({ ...banData, isDeleteComment: e.target.checked })
          }
        >
          Xoá bình luận
        </Checkbox>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  data: {
    ...state.admin.user,
  },
  isLoading: state.general.isLoading,
});

const mapDispatchToProps = {
  apiGetData: getUserList,
  delData,
  addData,
  editData,
  addDonate,
  banUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabAdminListManga);
