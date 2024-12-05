import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ApiProvider } from "@reduxjs/toolkit/query/react";

import App from "./app/App.tsx";
import { store } from "./app/store.ts";
import { apiSlice } from "./features/api/apiSlice.ts";

import "@/assets/styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ApiProvider api={apiSlice}>
        <App />
      </ApiProvider>
    </Provider>
  </StrictMode>
);
