import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";

// Thunk to fetch all patients
export const fetchPatients = createAsyncThunk(
  "comman/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/patients/all`);
      return res.data; // assume API returns array of patients
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk to fetch all departments
export const fetchDepartments = createAsyncThunk(
  "comman/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/department/all`);
      return res.data; // assume API returns array of departments
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const commanSlice = createSlice({
  name: "comman",
  initialState: {
    patients: [],
    departments: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // optional reducers if needed in future
    clearPatients(state) {
      state.patients = [];
      state.status = "idle";
      state.error = null;
    },
    clearDepartments(state) {
      state.departments = [];
      state.departmentsStatus = "idle";
      state.departmentsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Normalize payload if it's wrapped
        state.patients = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
    // departments reducers
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.departmentsStatus = "loading";
        state.departmentsError = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departmentsStatus = "succeeded";
        state.departments = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.departmentsStatus = "failed";
        state.departmentsError = action.payload || action.error.message;
      });
  },
});

export const { clearPatients, clearDepartments } = commanSlice.actions;

// Selectors
export const selectPatients = (state) => state.comman?.patients || [];
export const selectPatientsStatus = (state) => state.comman?.status || "idle";
export const selectPatientsError = (state) => state.comman?.error || null;

export const selectDepartments = (state) => state.comman?.departments || [];
export const selectDepartmentsStatus = (state) =>
  state.comman?.departmentsStatus || "idle";
export const selectDepartmentsError = (state) =>
  state.comman?.departmentsError || null;

export default commanSlice.reducer;
