import React, { useEffect, useState } from "react";
import {
  getCommentList,
  delData,
  addData,
  editData,
} from "../../redux/actions";
import { connect } from "react-redux";
import _ from "lodash";

import { message, Empty } from "antd";

import useWindowSize from "hooks/useWindowSize";
import DataField from "../table/AdminComment";
import { deleteComment } from "api/uploader";

function TabAdminListManga({ ...props }) {
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

  const handleDelete = async (id) => {
    try {
      const res = await deleteComment(id);
      getData();
    } catch (err) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleChangePage = ({ current }) => {
    getData(current);
  };

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
              handleDelete={handleDelete}
              handleChangePage={handleChangePage}
            />
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  data: {
    ...state.admin.comment,
  },
  isLoading: state.general.isLoading,
});

const mapDispatchToProps = {
  apiGetData: getCommentList,
  delData,
  addData,
  editData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabAdminListManga);
