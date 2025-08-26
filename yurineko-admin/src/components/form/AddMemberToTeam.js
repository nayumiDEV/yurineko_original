import { Avatar, Button, Empty, Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState, useEffect } from "react";
import { SmileOutlined, UserOutlined } from "@ant-design/icons";
import { addMemberToTeam, removeMemberFromTeam } from "../../redux/actions";
import { connect } from "react-redux";
import { getMemberOfTeam } from "api/admin";
import _ from "lodash";

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const formTailLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19, offset: 5 },
};

function AddMemberToTeam({ onCancel, handleOk, data, ...props }) {
  const [form] = useForm();
  const [userList, setUserList] = useState([]);
  const [fields, setFields] = useState([
    {
      name: ["email"],
      value: "",
    },
    { name: ["id"], value: "" },
    { name: ["name"], value: "" },
  ]);
  useEffect(async () => {
    if (data) {
      let newFields = fields.map((item) => {
        return {
          ...item,
          value: data[item.name[0]] ? data[item.name[0]] : "",
        };
      });
      setFields(newFields);
      handleGetData();
    } else {
      setFields(fields);
    }
  }, [data]);

  const handleGetData = () => {
    setUserList([]);
    return getMemberOfTeam(data.id)
      .then((res) => setUserList(res.result))
      .catch((e) => setUserList([]));
  };

  const handleRemoveMemberFromTeam = (id) => {
    props.removeMemberFromTeam({ id }, handleGetData);
  };
  const handleAddMemberToTeam = (formData) => {
    props.addMemberToTeam({ ...formData, id: data.id }, handleGetData);
  };
  return (
    <div>
      <Form
        name="add-form"
        {...formItemLayout}
        form={form}
        fields={fields}
        onFinish={(data) => {
          handleAddMemberToTeam(data);
          // console.log(data)
          //   handleOk(data)
          // form.resetFields()
        }}
      >
        <Form.Item name="name" label="Tên nhóm" type="text">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email user"
          rules={[
            {
              required: true,
              message: "Email không hợp lệ",
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Input name="id" value={data.id} hidden />
        <Form.Item {...formTailLayout}>
          <div className="flex items-center justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Thêm
            </Button>
          </div>
        </Form.Item>
      </Form>
      <div>
        <p className="text-md font-bold mb-2">Thành viên hiện tại:</p>
        <div className="shadow-inner">
          {_.isEmpty(userList) == false ? (
            <ul style={{ maxHeight: "400px", overflowY: "auto", padding: 2 }}>
              {userList.map((user, index) => (
                <li
                  key={index}
                  onClick={() => handleRemoveMemberFromTeam(user.id)}
                  className="user flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-300"
                >
                  {/* <div className="w-10 h-10 rounded-full bg-gray flex items-center justify-center text-white mr-2"> */}
                  {/* <UserOutlined style={{ fontSize: 20 }} /> */}
                  <Avatar
                    src={`https://yurineko.moe/uploads/avatars/${user.avatar}`}
                    size="large"
                  />

                  {/* </div> */}
                  <p className="text-md font-semibold ml-2">{user.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <Empty description="loading..." />
          )}
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  addMemberToTeam,
  removeMemberFromTeam,
};

export default connect(null, mapDispatchToProps)(AddMemberToTeam);
