import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../utils/authToken";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk to fetch radiology technicians
export const fetchRadiologyTechnicians = createAsyncThunk(
  "radiology/fetchRadiologyTechnicians",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await axios.get(
        `${API_BASE_URL}/laboratorists/radiology-technicians`,
        { headers }
      );
      const data = res.data?.data || res.data;
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create radiology report (POST /radiology/create)
export const createRadiology = createAsyncThunk(
  "radiology/createRadiology",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getToken();
      // If payload is FormData (file upload), let axios set Content-Type (including boundary)
      const isFormData =
        typeof FormData !== "undefined" && payload instanceof FormData;
      const headers = {};
      if (!isFormData) headers["Content-Type"] = "application/json";
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post(
        `${API_BASE_URL}/radiology/create`,
        payload,
        {
          headers,
        }
      );
      return res.data;
    } catch (err) {
      const payloadErr = err.response
        ? {
            message:
              err.response.data?.message || err.response.data || err.message,
            status: err.response.status,
            url: err.config?.url,
          }
        : { message: err.message || "Network error", code: err.code };
      return rejectWithValue(payloadErr);
    }
  }
);

const initialState = {
  createStatus: "idle",
  createError: null,
  lastCreated: null,
  technicians: [],
  techniciansStatus: "idle",
  techniciansError: null,
};

const radiologySlice = createSlice({
  name: "radiology",
  initialState,
  reducers: {
    resetCreateState(state) {
      state.createStatus = "idle";
      state.createError = null;
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRadiology.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createRadiology.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.lastCreated = action.payload || null;
      })
      .addCase(createRadiology.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || action.error.message;
      });
    // fetch radiology technicians
    builder
      .addCase(fetchRadiologyTechnicians.pending, (state) => {
        state.techniciansStatus = "loading";
        state.techniciansError = null;
      })
      .addCase(fetchRadiologyTechnicians.fulfilled, (state, action) => {
        state.techniciansStatus = "succeeded";
        state.technicians = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchRadiologyTechnicians.rejected, (state, action) => {
        state.techniciansStatus = "failed";
        state.techniciansError = action.payload || action.error.message;
      });
  },
});

export const { resetCreateState } = radiologySlice.actions;

export default radiologySlice.reducer;

// Selectors
export const selectCreateRadiologyStatus = (state) =>
  state.radiology?.createStatus || "idle";
export const selectCreateRadiologyError = (state) =>
  state.radiology?.createError || null;
export const selectLastCreatedRadiology = (state) =>
  state.radiology?.lastCreated || null;

// selectors for technicians
export const selectRadiologyTechnicians = (state) =>
  state.radiology?.technicians || [];
export const selectRadiologyTechniciansStatus = (state) =>
  state.radiology?.techniciansStatus || "idle";
export const selectRadiologyTechniciansError = (state) =>
  state.radiology?.techniciansError || null;
