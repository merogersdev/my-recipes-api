import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";

interface OpenState {
  value: boolean;
}

const initialOpenState: OpenState = {
  value: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: initialOpenState,
  reducers: {
    setCollapsed: (state) => {
      state.value = false;
    },
    setExpanded: (state) => {
      state.value = true;
    },
    toggleExpanded: (state) => {
      state.value = !state.value;
    },
  },
});

export const { setCollapsed, setExpanded, toggleExpanded } =
  sidebarSlice.actions;

export const sidebarOpen = (state: RootState) => state.sidebar.value;

export default sidebarSlice.reducer;
