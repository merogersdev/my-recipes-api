import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import type { User } from "../../../../../schemas/user";

interface AuthState {
  token: null | string;
  user: null | User;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.token = accessToken;
      state.user = user;
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
