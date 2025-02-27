import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
  fullName: string | null;
  email: string | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: AdminState = {
  fullName: null,
  email: null,
  token: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
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
      state.fullName = action.payload.fullName;
      (state.email = action.payload.email),
        (state.token = action.payload.token),
        (state.isAuthenticated = true),
        (state.role = action.payload.role);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.error = action.payload);
    },
    logout: (state) => {
      (state.fullName = null),
        (state.email = null),
        (state.isAuthenticated = false);
      state.role = null;
      state.token = null;
    },
  },
});

export const { loginSuccess } = adminSlice.actions;
export default adminSlice.reducer;
