import React, { useEffect } from "react";
import { Layout } from "antd";
import WrapLayout from "layouts/Upload";
import useAuth from "hooks/useAuth";
import { Content, Footer } from "antd/lib/layout/layout";
import { useHistory } from "react-router";
import Editor from "components/editor/Editor";

function EditorPage({ ...props }) {
  const history = useHistory();
  const auth = useAuth();

  useEffect(() => {
    if (!auth || !auth.token ) {
      history.replace("/", "", { shallow: true });
    }
  }, [auth]);

  return (
    <WrapLayout>
      <Layout style={{ minHeight: "100vh" }} className="overflow-y-auto">
        <Content>
          <Editor />
        </Content>
        <Footer style={{ textAlign: "center" }} className="text-xs">
          Yurineko - Created by iHelloWorld
        </Footer>
      </Layout>
    </WrapLayout>
  );
}

export default EditorPage;
