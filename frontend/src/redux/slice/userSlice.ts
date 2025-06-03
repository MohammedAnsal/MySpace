import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import socketService from "@/services/socket/socket.service";

interface userState {
  userId: string | null;
  fullName: string | null;
  email: string | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean | null;
  error: string | null;
}

const initialState: userState = {
  userId: null,
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
        userId: string;
        token: string;
        fullName: string;
        email: string;
        role: string;
      }>
    ) => {
      state.loading = false;
      state.userId = action.payload.userId;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      
      // socketService.connect();
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.error = action.payload);
    },
    logout: (state) => {
      // socketService.disconnect();
      
      (state.loading = false),
        (state.userId = null),
        (state.token = null),
        (state.error = null),
        (state.email = null),
        (state.fullName = null),
        (state.isAuthenticated = false);
      state.role = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;
