import EditorJS from "@editorjs/editorjs";
import { useEffect, useState } from "react";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Paragraph from "editorjs-paragraph-with-alignment";
import Image from "@editorjs/image";
import Underline from "@editorjs/underline";
import Delimiter from "@editorjs/delimiter";
import AlignmentBlockTune from "editorjs-text-alignment-blocktune";
import { getNovelChapterInfo, getNovelInfo, uploadImage } from "api/uploader";
import { Affix, Menu, Dropdown } from "antd";
import {
  RedoOutlined,
  UndoOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useHistory, useParams } from "react-router";
import confirm from "antd/lib/modal/confirm";
import { connect } from "react-redux";
import {
  initEditor,
  updateEditor,
  createNovelChapter,
} from "redux/actions/upload";

function Editor({ data, ...props }) {
  const [editor, seteditor] = useState(null);
  const [novelName, setNovelName] = useState("");
  const [isPublish, setPublish] = useState(0);
  const history = useHistory();
  const params = useParams();

  const handleUploadImage = async (file) => {
    const response = await uploadImage(file);
    return {
      success: 1,
      file: {
        url: process.env.REACT_APP_STORAGE_URL + response.path,
      },
    };
  };

  const initEditor = (initData) => {
    props.initEditor({
      ...initData,
    });
    if (editor) editor.destroy();
    seteditor(
      new EditorJS({
        holderId: "editorjs",
        minHeight: 500,
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["link"],
            tunes: ["align"],
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          underline: Underline,
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile: handleUploadImage,
              },
            },
          },
          align: {
            class: AlignmentBlockTune,
          },
        },

        /**
         * Previously saved data that should be rendered
         */
        data: initData.content ? JSON.parse(initData.content) : {},
        onReady: () => {},
      })
    );
  };

  const handleCancel = async () => {
    confirm({
      title: "Bạn có muốn huỷ bài viết và quay lại?",
      icon: <ExclamationCircleOutlined />,
      content: "Hãy chắc chắn đã lưu dữ liệu!",
      cancelText: "Ở lại",
      onOk() {
        history.push("/upload");
      },
      onCancel() {},
    });
  };

  useEffect(
    () =>
      (async () => {
        const { novelId, chapterId } = params;
        let initData = {};

        if (!chapterId && novelId) {
          // create new chapter
          initData = {
            name: "",
            lightnovelId: novelId,
            publish: 0,
            content: `{}`,
            chapterId: "",
          };
        } else if (chapterId && novelId) {
          // fetch data here
          const res = await getNovelChapterInfo(chapterId);
          initData = {
            name: res.name,
            lightnovelId: res.lnID,
            publish: res.publish,
            content: res.content,
            chapterId: res.id,
          };
        }
        setPublish(initData.publish);
        initEditor(initData);

        return () => {
          if (editor) editor.destroy();
        };
      })(),
    []
  );

  useEffect(
    () =>
      (async () => {
        const { novelId } = params;
        if (novelId) {
          const res = await getNovelInfo(novelId);
          setNovelName(res.originalName);
        }
      })(),
    []
  );

  const handleUpdateEditor = (data) => {
    props.updateEditor(data);
  };

  const handleSave = async (publish) => {
    try {
      const currentData = await editor?.save().then((data) => data);
      const newState = {
        ...data,
        content: currentData,
      };
      if (publish) {
        newState["publish"] = 1;
        setPublish(1);
      } else {
        newState["publish"] = 0;
        setPublish(0);
      }

      props.createNovelChapter(newState);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (data.chapterId) {
      const { novelId } = params;
      history.replace({
        pathname: `/novel-editor/${novelId}/${data.chapterId}`,
      });
    }
  }, [data.chapterId]);

  const listenSave = (e) => {
    // handleSave(false);
    if (e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
      handleSave(isPublish);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", listenSave);
    return () => {
      document.removeEventListener("keydown", listenSave);
    };
  }, [editor]);

  const buttonMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleSave(true)}>
        Xuất bản
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Affix className="bg-white">
        <h1 className="text-center text-md md:text-3xl font-semibold p-2 text-gray-500 block md:hidden">
          {novelName}
        </h1>
        <div className="bg-white py-1 px-2 flex items-center justify-between shadow-sm relative">
          <div className="flex items-center justify-center flex-col md:flex-row">
            <div
              className="bg-blue-500 w-10 h-10 flex items-center justify-center rounded"
              onClick={handleCancel}
            >
              <HomeOutlined style={{ fontSize: 20 }} className="text-white" />
            </div>
            <h1 className="text-left text-md md:text-3xl font-semibold p-4 text-gray-500 hidden md:block">
              {novelName}
            </h1>
          </div>
          <div className="flex items-center justify-end my-4">
            <button
              className="px-4 py-2 bg-white ml-4 font-semibold rounded"
              onClick={handleCancel}
            >
              Huỷ
            </button>
            <Dropdown.Button
              overlay={buttonMenu}
              type="primary"
              onClick={() => handleSave(false)}
            >
              Lưu nháp
            </Dropdown.Button>
          </div>
          <div className="flex items-center justify-end my-4 absolute -bottom-20 right-0">
            <button
              className="w-12 h-12 bg-white ml-4 font-semibold rounded shadow"
              onClick={() => {
                document.execCommand("undo", false, null);
              }}
            >
              <UndoOutlined style={{ fontSize: 18 }} />
            </button>
            <button
              className="w-12 h-12 bg-white ml-4 font-semibold rounded shadow"
              onClick={() => {
                document.execCommand("redo", false, null);
              }}
            >
              <RedoOutlined style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </Affix>

      <div className="mx-auto w-full md:w-3/6 mt-4 px-2 md:px-0">
        <div className="mx-auto py-2">
          <input
            value={data.name}
            placeholder="Tên chapter"
            onChange={(e) => handleUpdateEditor({ name: e.target.value })}
            className="w-full p-2 bg-transparent border-b-2 border-gray-300 text-xl text-center"
          />
        </div>
        <div id="editorjs" className="mx-auto bg-white shadow-sm p-4 rounded" />
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  data: state.upload.editor,
});

const mapDispatchToProps = {
  initEditor,
  updateEditor,
  createNovelChapter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
