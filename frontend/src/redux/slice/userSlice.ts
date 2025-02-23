import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  fullName: string | null;
  email: string | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean | null;
  error: string | null;
}

const initialState: userState = {
  fullName: null,
  email: null,
  token: null,
  role: null,
  loading: false,
  isAuthenticated: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        fullName: string;
        email: string;
        role: string;
      }>
    ) => {
      state.loading = false;
      state.token = action.payload.token;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.error = action.payload);
    },
    logout: (state) => {
      (state.loading = false),
        (state.token = null),
        (state.error = null),
        (state.fullName = null),
        (state.isAuthenticated = false);
      state.role = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;
