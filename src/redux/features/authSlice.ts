import { Cookies } from 'react-cookie';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType, AuthContextType } from '../types';
import refreshTokenApiCall from '../api/refreshTokenApiCall';
const cookies = new Cookies();

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

const initialState: AuthContextType = {
  user: null,
  tokens: {
    access_token: cookies.get('access_token'),
    refresh_token: cookies.get('refresh_token'),
  },
};

const refreshRedditAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (refreshToken: string) => {
    // Replace with your token refresh logic
    const newAccessToken = await refreshTokenApiCall(refreshToken); // Replace with your actual token refresh logic
    return newAccessToken;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<AuthResponse | null>) => {
      if (null === action.payload) return;
      state.tokens.access_token = action.payload.access_token;
      state.tokens.refresh_token = action.payload.refresh_token;
    },
    logout: (state) => {
      state.user = null;
      state.tokens.access_token = null;
      state.tokens.refresh_token = null;

      //clear token form cookies
      cookies.remove('access_token');
      cookies.remove('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshRedditAccessToken.fulfilled, (state, action) => {
      if (action.payload === null) return;
      state.tokens.access_token = action.payload.access_token;
      state.tokens.refresh_token = action.payload.refresh_token;
    });
  },
});

export { refreshRedditAccessToken };

export const { setUser, setToken, logout } = authSlice.actions;

export default authSlice.reducer;
