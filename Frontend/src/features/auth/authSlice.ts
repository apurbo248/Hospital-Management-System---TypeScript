import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";    
import type { PayloadAction } from '@reduxjs/toolkit';
import api from "../../axios/api"; // Adjust the import path as necessary

// ------------------ Role-specific Types ------------------

// Base User
export interface BaseUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  profilePic?: string;
  gender?: string;
  blood_type?: string;
  dateOfBirth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

// Doctor-specific fields
export interface DoctorUser extends BaseUser {
  role: "doctor";
  specialization?: string[];
  license_number?: string;
  availability?: { day: string; status: string; timeSlots: { start: string; end: string }[] }[];
  language?: string[];
  consultation_fee?: number;
  experienceYears?: number;
  bio?: string;
  department_id?: string[];
}

// Receptionist-specific fields
export interface ReceptionistUser extends BaseUser {
  role: "receptionist";
  shift?: string;
}

// Admin-specific fields
export interface AdminUser extends BaseUser {
  role: "admin";
  accessLevel?: string;
}

// Patient-specific fields
export interface PatientUser extends BaseUser {
  role: "patient";
  medical_history?: string[];
}

// Union type for all roles
export type User = DoctorUser | ReceptionistUser | AdminUser | PatientUser;

// ------------------ State ------------------
interface AuthState {
  user: User | null;
  users: User[];
  roleData: {
    role?: string;
    total?: number;
  } | null;
  message: string; 
  loading: boolean;
  error: string | null;
}

// ------------------ Payloads ------------------
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
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
  users: [],
  roleData: null,
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

export const getUserByRole = createAsyncThunk<{ users: User[]; role: string; total: number }, string, { rejectValue: string }>(
  "user_role/getByRole",
  async (role, thunkAPI) => {
    try {
      const res = await api.get(`/user_role/${role}`, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users by role");
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
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })    
      // Login   
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User fetched successfully";
      })
      // Fetch user by role
      .addCase(getUserByRole.fulfilled, (state, action: PayloadAction<{ users: User[]; role: string; total: number }>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.roleData = { role: action.payload.role, total: action.payload.total };
      })
      // Handle pending actions
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Handle rejected actions
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? "Unknown error";
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
