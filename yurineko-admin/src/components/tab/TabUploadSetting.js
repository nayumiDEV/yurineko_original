import useAuth from "hooks/useAuth";
import { Button, Col, Divider, Form, Input, message, Select, Space, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from "antd-img-crop";
import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateTeamProfile, getTeamProfile } from "api/uploader";
import Editor from "../form/Editor";
import { Link } from "react-router-dom";

const { Option } = Select;

function TabUploadSetting({ isLoading, ...props }) {
  const [cover, setCover] = useState("");
  const [avatar, setAvatar] = useState("");
  const [url, setUrl] = useState("");
  const [fileCover, setFileCover] = useState("");
  const [fileAvatar, setFileAvatar] = useState("");
  const [defaultData, setDefault] = useState([
    {
      name: ["description"],
      value: "",
    },
    {
      name: ["url"],
      value: "",
    },
    {
      name: ["social"],
      value: [{
        type: "",
        link: ""
      }]
    }
  ]);

  useEffect(async () => {
    try {
      const data = await getTeamProfile();
      if (data) {
        setCover(data.cover);
        setAvatar(data.avatar);
        setUrl(data.url);
        let newFields = defaultData.map((item) => {
          return {
            ...item,
            value: data[item.name[0]] ? data[item.name[0]] : "",
          };
        });
        setDefault(newFields);
      }
    } catch (err) { }
  }, []);

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      setUrl(data.url);
      formData.append("url", data.url);
      formData.append("description", data.description);
      formData.append("social", JSON.stringify(data.social));
      formData.append("avatar", fileAvatar);
      formData.append("cover", fileCover);
      message.loading("Updating...");
      await updateTeamProfile(formData);
      message.success("Cập nhật thành công");
    } catch (err) {
      message.error("Có lỗi xảy ra");
    }
  };

  const customActionAvatar = ({ file }) => {
    setFileAvatar(file);
    return new Promise(async (res, rej) => {
      let src = file.url;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        });
      }
      if (src) {
        res(src);
        setAvatar(src);
      }
    });
  };

  const customActionCover = ({ file }) => {
    setFileCover(file);
    return new Promise(async (res, rej) => {
      let src = file.url;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        });
      }
      if (src) {
        res(src);
        setCover(src);
      }
    });
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
  return (
    <div>
      <h3 className="text-center font-bold text-3xl p-3">
        Thông tin nhóm dịch - <a target="_blank" rel="noreferrer" href={`https://yurineko.moe/team/${url}`} className="text-lg font-medium align-middle text-blue-600 hover:text-blue-600">Đến trang team</a>
      </h3>
      <div className="max-w-5xl mx-auto">
        <Form
          onFinish={handleSubmit}
          fields={defaultData}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
        >
          <Form.Item require={true} name="url" label="Url">
            <Input addonBefore="https://yurineko.moe/team/" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Editor />
            {/* <Input.TextArea /> */}
          </Form.Item>
          <Form.Item label="Avatar">
            <ImgCrop aspect={1} modalTitle="Chỉnh sửa ảnh">
              <Upload
                customRequest={customActionAvatar}
                multiple={false}
                showUploadList={false}
                listType={false}
                beforeUpload={beforeUpload}
                accept="image/png, image/jpeg"
                disabled={isLoading}
              >
                <div className="w-32 h-32 border-dotted border border-blue-500 rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src={avatar ? avatar : "https://via.placeholder.com/150.webp?text=Avatar"}
                    alt="Team avatar "
                    className="min-w-full min-h-full flex-shrink-0"
                  />
                </div>
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item label="Cover">
            <ImgCrop aspect={4.5} modalTitle="Chỉnh sửa ảnh">
              <Upload
                customRequest={customActionCover}
                multiple={false}
                showUploadList={false}
                listType={false}
                beforeUpload={beforeUpload}
                accept="image/png, image/jpeg"
                disabled={isLoading}
              >
                <div className="min-w-full h-32 border-dotted border border-blue-500 rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src={cover ? cover : "https://via.placeholder.com/1350x300.webp?text=Cover"}
                    alt="Team banner "
                    className="min-w-full min-h-full flex-shrink-0"
                  />
                </div>
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item label="Gắn link">
            <Form.List name="social">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(field => (
                    <Space key={field.key} align="start">
                      <Form.Item
                        noStyle
                        shouldUpdate
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            label="Loại"
                            name={[field.name, 'type']}
                            fieldKey={[field.fieldKey, 'type']}
                            rules={[{ required: true, message: 'Chọn thể loại link!' }]}
                          >
                            <Select style={{ width: 130 }}>
                              <Option key="link" value="link">Custom Link</Option>
                              <Option key="facebook" value="facebook" >Facebook</Option>
                              <Option key="discord" value="discord" >Discord</Option>
                              <Option key="wordpress" value="wordpress" >Wordpress</Option>
                              <Option key="blogger" value="blogger" >Blogger</Option>
                            </Select>
                          </Form.Item>
                        )}
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Link"
                        name={[field.name, 'link']}
                        fieldKey={[field.fieldKey, 'link']}
                        rules={[{ required: true, message: 'Link còn thiếu!' }]}
                      >
                        <Input type="url" style={{ width: 300 }}/>
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Thêm link
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item labelCol={0} wrapperCol={24}>
            <Button type="primary" className="block ml-auto" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TabUploadSetting);
