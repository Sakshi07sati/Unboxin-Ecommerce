import React from "react";
import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./global_redux/stores";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </StrictMode>

);