import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { User } from "../../../../../schemas/user";

interface AuthState {
  user: User | null;
}

const initialAuthState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { logout, setUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
