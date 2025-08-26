import React, { useMemo, useState } from "react";
import { addChapter, editChapter } from "../../redux/actions/upload";
import { Modal, message, Empty, Progress } from "antd";
import { connect } from "react-redux";
import {
  getNovelChapterList,
  deleteChapter,
  deleteNovelChapter,
  swapChapterOrder,
} from "api/uploader";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import edjsParser from "editorjs-parser";
import ReactDragListView from "react-drag-listview";

const { confirm } = Modal;

function NovelChapterList({ mangaID, ...props }) {
  const [html, setHTML] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [chapterList, setChapterList] = useState("");
  const [selectChapter, setChapter] = useState("");

  const getChapter = async () => {
    try {
      setLoading(true);
      const res = await getNovelChapterList(mangaID);
      setChapterList(res);
      if (res.length > 0) {
        setChapter(res[0]);
      } else setChapter("");
      setLoading(false);
    } catch (e) {}
  };
  useMemo(async () => {
    try {
      await getChapter();
    } catch (e) {}
  }, [mangaID]);

  useMemo(async () => {
    if (selectChapter) {
      const content = JSON.parse(selectChapter?.content ?? {});
      const blocks = content.blocks.map((item) => ({
        ...item,
        ["data"]: {
          ...item.data,
          ["tunes"]: item.tunes,
        },
      }));
      content.blocks = blocks;

      const parser = new edjsParser();
      const html = parser.parse(content);
      setHTML(html);
    }
  }, [selectChapter]);

  const handleDelete = async () => {
    try {
      const res = await deleteNovelChapter(selectChapter.id);
      getChapter();
    } catch (err) {
      message.error("Có lỗi xảy ra");
    }
  };

  const showConfirm = () => {
    confirm({
      title: "Bạn có chắc muốn xóa chapter này?",
      icon: <ExclamationCircleOutlined />,
      content: "Dữ liệu bị xóa không thể phục hồi.",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk() {
        handleDelete();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onDragEnd = async (fromIndex, toIndex) => {
    try {
      if (toIndex < 0) return;
      const id = chapterList[fromIndex].id;
      const sequence = chapterList[toIndex].sequence;

      const items = [...chapterList];
      const item = items.splice(fromIndex, 1)[0];
      items.splice(toIndex, 0, item);
      setChapterList(items);

      await swapChapterOrder(id, sequence);
      message.success("Đã cập nhật!");
    } catch (err) {
      message.error("Thất bại!");
    }
  };

  return (
    <div className="w-full modal-chapter overflow-y-hidden" style={{}}>
      {!isLoading && (
        <>
          <>
            <div className="w-full mb-2 flex">
              <div className="flex-1">
                <a
                  className="text-center w-full p-2 border-rounded bg-green-500 ml-auto block text-white hover:text-white"
                  href={`/novel-editor/${mangaID}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  + Thêm chapter
                </a>
              </div>
              <div className="flex-3 flex ">
                {selectChapter && (
                  <>
                    <div className="flex-1 text-center text-xl font-semibold">
                      {selectChapter.name}
                    </div>
                    <button
                      onClick={() => {
                        window.open(
                          `/novel-editor/${mangaID}/${selectChapter.id}`,
                          "_blank"
                        );
                      }}
                      className="block ml-auto p-1 "
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => {
                        showConfirm();
                      }}
                      className="block ml-auto p-1"
                    >
                      <DeleteOutlined />
                    </button>
                  </>
                )}
              </div>
            </div>
            {chapterList && chapterList.length > 0 ? (
              <div className="flex item-center h-full">
                <div className="flex-1 h-full overflow-y-auto">
                  <ReactDragListView nodeSelector="li" onDragEnd={onDragEnd}>
                    <ul
                      style={{ maxHeight: 500 }}
                      className="h-auto w-full overflow-y-auto p-2 pb-12"
                    >
                      {chapterList &&
                        chapterList.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => setChapter(item)}
                            className="font-semibold hover:bg-gray-100 cursor-pointer py-2 flex justify-between items-center"
                          >
                            <span className="flex items-center">
                              <HolderOutlined className="mr-2" />
                              {item.name}
                            </span>
                            {item.publish == 0 && <EyeInvisibleOutlined />}
                          </li>
                        ))}
                    </ul>
                  </ReactDragListView>
                </div>
                <div className="flex-3 m-0 h-full">
                  <div className="h-auto max-h-full w-full overflow-y-auto p-2 flex flex-wrap pb-12">
                    <div
                      dangerouslySetInnerHTML={{ __html: html }}
                      className="overflow-y-auto w-full"
                      style={{ maxHeight: 500 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Empty
                className="h-full"
                description="Truyện chưa có chapter nào"
              />
            )}
          </>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  addChapter,
  editChapter,
};

export default connect(mapStateToProps, mapDispatchToProps)(NovelChapterList);
