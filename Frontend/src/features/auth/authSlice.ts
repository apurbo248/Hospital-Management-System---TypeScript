import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";    
import type { PayloadAction } from '@reduxjs/toolkit';
import api from "../../axios/api"; // Adjust the import path as necessary


// ------------------ Types ------------------
export interface User {
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  message: string; 
  loading: boolean;
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  message: string;
}

// ------------------ Initial State ------------------
const initialState: AuthState = {
  user: null,
  message: "",
  loading: false,
  error: null,
};

// ------------------ Async Thunks ------------------


export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  'user_registration',
  async (data, thunkAPI) => {
    try {
      const res = await api.post<AuthResponse>('/user_registration', data,{ withCredentials: true });
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'user_login',
  async (data, thunkAPI) => {
    try {
      const res = await api.post<AuthResponse>('/user_login', data,{ withCredentials: true });
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "my_profile",
  async (_, thunkAPI) => {
    try {
      const res = await api.get<User>("/my_profile", { withCredentials: true });
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);
// ------------------ Slice ------------------
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
     
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
       // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User fetched successfully"; // required message
      });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
