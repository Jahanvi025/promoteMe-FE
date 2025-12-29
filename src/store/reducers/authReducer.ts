import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  active?: boolean;
  blocked?: boolean;
  role?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profile_picture?: string;
  lastActiveRole?: string;
}

interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  postId: string | null;
  messageCount: number;
  walletBalance: number;
}

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  isAuthenticated: false,
  loading: true,
  user: null,
  postId: null,
  messageCount: 0,
  walletBalance: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    resetTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
    setSelectedPost: (state, action: PayloadAction<{ postId: string }>) => {
      state.postId = action.payload.postId;
    },
    setMessageCount: (state, action: PayloadAction<{ count: number }>) => {
      state.messageCount = action.payload.count;

    },
    setWalletBalance: (state, action: PayloadAction<{ balance: number }>) => {
      state.walletBalance = action.payload.balance;
    },
    logout: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuthenticated = false;
      state.loading = true;
      state.user = null;
      state.postId = null;
      state.messageCount = 0;
      state.walletBalance = 0
    },
    updateUserProfile: (
      state,
      action: PayloadAction<{
        profile_picture?: string;
        username?: string;
        displayName?: string;
      }>
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          profile_picture: action.payload.profile_picture ?? state.user.profile_picture,
          username: action.payload.username ?? state.user.username,
          displayName: action.payload.displayName ?? state.user.displayName,
        };
      }
    },

    switchUserProfile: (
      state,
      action: PayloadAction<{
        lastActiveRole: string;
      }>
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          lastActiveRole: action.payload.lastActiveRole,
        };
      }
    },

  },
});

export const { setLoading, setTokens, resetTokens, setUser, setSelectedPost, setMessageCount, logout, setWalletBalance, updateUserProfile, switchUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
