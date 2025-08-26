import React, { Component, useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Radio,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import Editor from "./Editor";
import {
  findAuthor,
  findOrigin,
  findCouple,
  findTag,
  getMangaInfo,
} from "api/admin";

import { uploadImage, getNovelInfo } from "api/uploader";
import { createNovel, editNovel } from "../../redux/actions/upload";
import { connect } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import MultiSelect from "./MultiSelect";

function FormEditNovel({ isLoading, data, closeDrawer, getData, ...props }) {
  const [form] = useForm();
  const [loadingManga, setLoadingManga] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [type, setTypeManga] = useState(1);
  const [file, setFile] = useState("");
  const [imgData, setImgData] = useState("");
  const [manga, setManga] = useState({});
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState([]);
  const [author, setAuthor] = useState([]);
  const [origin, setOrigin] = useState([]);
  const [couple, setCouple] = useState([]);
  const [editData, setEditData] = useState("");
  const [blob, setBlob] = useState("");

  useMemo(async () => {
    try {
      if (data) {
        setIsEdit(true);
        setLoadingManga(true);
        form.resetFields();
        const res = await getNovelInfo(data.id);
        if (res) {
          setEditData({ ...res });
          setTypeManga(parseInt(res.type));
          setManga({ ...res });
          setImgData(res.thumbnail);
          setDescription(res.description);
          form.setFieldsValue({ ...data });
          // cons
          // setTypeManga(res.ty)
          setLoadingManga(false);
        }
      } else setLoadingManga(false);
    } catch (e) {
      setLoadingManga(false);
      message.error("Có lỗi xảy ra!");
    }
  }, [data]);

  const customAction = async ({ file }) => {
    const uploadResponse = await uploadImage(file);
    setImgData(uploadResponse.path);
    setFile(uploadResponse.path);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận JPG/PNG file!");
    }
    const isLt7M = file.size / 1024 / 1024 < 7;
    if (!isLt7M) {
      message.error("Kích thước phải bé hơn 7MB");
    }
    return isJpgOrPng && isLt7M;
  };

  const onTypeMangaChange = (e) => {
    setTypeManga(e.target.value);
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const validateMessages = {
    required: "${label} không thể bỏ trống!",
    types: {
      email: "${label} không hợp lệ!",
      number: "${label} không hợp lệ!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const descriptionChange = (value) => {
    setManga({ ...manga, description: value });
    setDescription(value);
  };

  const onFinish = (values) => {
    const postData = {
      thumbnail: imgData,
      type: type,
    };

    Object.keys(values).forEach((key) => {
      if (!postData[key] && key != "otherName" && key != "description")
        postData[key] = values[key];
    });

    if (values["otherName"] && values["otherName"].length != 0)
      postData["otherName"] = values["otherName"];
    if (description.length != 0) postData["description"] = description;

    if (isEdit) {
      props.editNovel(data.id, postData, () => {
        getData();
        closeDrawer();
      });
    } else {
      props.createNovel(postData, () => {
        form.resetFields();
        setFile("");
        setImgData("");
        setDescription("");
      });
    }
  };
  const handleSearchAuthor = async (query) => {
    const res = await findAuthor(query);
    setAuthor(res);
  };

  const handleSearchTag = async (query) => {
    const res = await findTag(query);
    setTag(res);
  };

  const handleSearchCouple = async (query) => {
    const res = await findCouple(query);
    setCouple(res);
  };
  const handleSearchOrigin = async (query) => {
    const res = await findOrigin(query);
    setOrigin(res);
  };

  if (loadingManga) return null;

  return (
    <Form
      {...layout}
      form={form}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
      className="md:max-w-3xl mx-auto"
      onValuesChange={(changeField, allFields) => {
        // console.log({...})
        setManga({ ...manga, ...changeField });
      }}
    >
      <h3 className="text-center text-3xl m-3 font-bold">
        {isEdit ? "Cập nhật novel" : "Thêm novel mới"}
      </h3>
      {isEdit && (
        <h5 className="text-left text-red-500 text-md m-1 font-light">
          * Chỉ những trường chỉnh sửa sẽ được cập nhật!
        </h5>
      )}
      {/* {!isEdit && (
       
      )} */}
      <div className="flex justify-center mb-3">
        <Radio.Group
          value={type}
          onChange={onTypeMangaChange}
          className="bg-red m-3"
        >
          <Radio.Button value={1}>Novel thường</Radio.Button>
          <Radio.Button value={2}>Novel Doujin</Radio.Button>
        </Radio.Group>
      </div>

      <Form.Item
        name={"originalName"}
        label="Tên"
        rules={[{ required: !isEdit }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name={"otherName"} label="Tên khác" rules={[{}]}>
        <Input />
      </Form.Item>
      {type == 2 && (
        <MultiSelect
          required={false}
          label="Couple"
          name="couple"
          data={couple}
          defaultData={editData.couple}
          handleSearch={handleSearchCouple}
          placeholder="Hãy chọn couple"
          isEdit={isEdit}
        />
      )}

      {type == 2 && (
        <MultiSelect
          label="Truyện gốc"
          name="origin"
          data={origin}
          defaultData={editData.origin}
          handleSearch={handleSearchOrigin}
          placeholder="Hãy chọn truyện gốc"
          isEdit={isEdit}
        />
      )}

      <MultiSelect
        label="Tags"
        name="tag"
        data={tag}
        defaultData={editData.tag}
        handleSearch={handleSearchTag}
        placeholder="Hãy chọn tag"
        isEdit={isEdit}
      />

      <MultiSelect
        required={false}
        label="Tác giả"
        name="author"
        data={author}
        defaultData={editData.author}
        handleSearch={handleSearchAuthor}
        placeholder="Hãy chọn tác giả"
        isEdit={isEdit}
      />
      <Form.Item name={"description"} label="Mô tả">
        <Editor
          onChange={descriptionChange}
          value={editData?.description ?? description}
        />
      </Form.Item>
      <Form.Item
        name={"thumbnail"}
        label="Thumbnail"
        rules={[{ required: !isEdit }]}
      >
        <div className="flex flex-col overflow-hidden">
          <ImgCrop aspect={0.704} modalTitle="Chỉnh sửa ảnh">
            <Upload
              showUploadList={false}
              customRequest={customAction}
              multiple={false}
              beforeUpload={beforeUpload}
            >
              <div
                className="block rounded border-dotted border-blue-300 w-100 h-100 border-2 flex items-center justify-center"
                style={{ width: 200, height: 285 }}
              >
                {!imgData && (
                  <p className="color-blue">
                    <UploadOutlined
                      style={{ fontSize: 35, color: "#3fd2f6" }}
                    />
                  </p>
                )}
                {imgData && (
                  <img src={process.env.REACT_APP_STORAGE_URL + imgData} />
                )}
              </div>
            </Upload>
          </ImgCrop>
        </div>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
        <Button
          type="primary"
          size="middle"
          htmlType="submit"
          className="bg-green-400 border-green-500"
        // disabled={isLoading}
        >
          {isEdit ? "Cập nhật" : "Thêm"}
        </Button>
      </Form.Item>
    </Form>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
});

const mapDispatchToProps = {
  createNovel,
  editNovel,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormEditNovel);
