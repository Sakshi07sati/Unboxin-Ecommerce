import React from "react";
import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store,persistor } from "./global_redux/stores";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </StrictMode>
);

 
