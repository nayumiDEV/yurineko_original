import "./styles/globals.css";
import "react-quill/dist/quill.snow.css";
import { PersistGate } from "redux-persist/integration/react";

import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import store from "redux/store";
import MyRoute from "route/route";

function MyApp() {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={store.__PERSISTOR}>
          <div className="App">
            <MyRoute />
          </div>
        </PersistGate>
      </Provider>
    </CookiesProvider>
  );
}

export default MyApp;
