import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import { connect } from "react-redux";
import { adminLogin } from "../redux/actions";
import useAuth from "hooks/useAuth";
import { useHistory } from "react-router";
import isClient from "utils/isClient";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = ({ isLoading, adminDetail, error, data, ...props }) => {
  const history = useHistory();

  const onFinish = (values) => {
    props.adminLogin(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // if (isClient()) {
  const auth = useAuth();

  useEffect(() => {
    if (auth && auth.token) {
      if (auth.role == 2) {
        history.replace("/upload", "", { shallow: true });
      }
      if (auth.role == 3) {
        history.replace("/admin", "", { shallow: true });
      }
    }
  }, [auth]);

  // }

  return (
    <div className="w-screen h-screen flex items-center justify-center admin-login overflow-hidden">
      <div className="w-xl mx-auto">
        {isLoading == false && error.length > 0 && (
          <Alert message={error} type="error" />
        )}
        <div className="w-full flex items-center justify-center bg-blue-200 pt-4 px-8 rounded border shadow-md">
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập email!",
                  type: "email",
                  autoComplete: "off",
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
  error: state.admin.error,
  adminDetail: state.admin.adminDetail,
  auth: state.admin.auth,
});

const mapDispatchToProps = {
  adminLogin,
};

let LoginPage = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginPage;
