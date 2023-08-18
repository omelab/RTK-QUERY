import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType, AuthContextType } from '../types';

const initialState: AuthContextType = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export default authSlice.reducer;
export const { setUser, setToken, logout } = authSlice.actions;
