import EditorPage from "pages/editor";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginPage from "../pages";
import AdminPage from "../pages/admin";
import UploadPage from "../pages/upload";

export default function MyRoute() {
  return (
    <Router>
      <Switch>
        <Route path={`/novel-editor/:novelId/:chapterId?`}>
          <EditorPage />
        </Route>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route path="/upload">
          <UploadPage />
        </Route>
        <Route path="/">
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  );
}
