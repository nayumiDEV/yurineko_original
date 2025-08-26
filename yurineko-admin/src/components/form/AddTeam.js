import createUrlName from "utils/createUrlName";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState, useEffect } from "react";
import Editor from "./Editor";

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const formTailLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19, offset: 5 },
};

export default function AddTeam({ onCancel, handleOk, data }) {
  const [form] = useForm();
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([
    {
      name: ["name"],
      value: "",
    },
    {
      name: ["description"],
      value: "",
    },
    {
      name: ["url"],
      value: "",
    },
  ]);
  useEffect(() => {
    if (data) {
      let newFields = fields.map((item) => {
        return {
          ...item,
          value: data[item.name[0]] ? data[item.name[0]] : "",
        };
      });
      setFields(newFields);
      setDescription(data["description"] ?? "");
    } else {
      setFields(fields);
      setDescription("");
    }
  }, [data]);
  const onReset = () => {};
  return (
    <div>
      <Form
        name="tag-form"
        {...formItemLayout}
        form={form}
        fields={fields}
        onValuesChange={({ name }) => {
          if (name && !data?.url) {
            form.setFieldsValue({
              ...form.getFieldsValue,
              url: createUrlName(name),
            });
          }
        }}
        onFieldsChange={(_, allFields) => {
          //   setFields(allFields)
        }}
        onFinish={(data) => {
          handleOk({ ...data, description: description });
          form.resetFields();
          setDescription("");
        }}
      >
        <Form.Item
          name="name"
          label="Tên nhóm"
          type="text"
          rules={[
            {
              required: true,
              message: "Tên nhóm là bắt buộc",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={"description"} label="Mô tả">
          <Editor
            onChange={(value) => {
              setDescription(value);
            }}
            value={description}
          />
        </Form.Item>
        <Form.Item
          name="url"
          label="url"
          type="text"
          rules={[{ required: true }]}
        >
          <Input addonBefore="https://yurineko.moe/team/" />
        </Form.Item>

        <Form.Item {...formTailLayout}>
          <div className="flex items-center justify-end">
            <Button
              type="danger"
              className="login-form-button mr-2"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Lưu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
