import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../utils/authToken";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create pathology report (POST /pathology/create)
export const createPathology = createAsyncThunk(
  "pathology/createPathology",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post(
        `${API_BASE_URL}/pathology/create`,
        payload,
        { headers }
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
};

const pathologySlice = createSlice({
  name: "pathology",
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
      .addCase(createPathology.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createPathology.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.lastCreated = action.payload || null;
      })
      .addCase(createPathology.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || action.error.message;
      });
  },
});

export const { resetCreateState } = pathologySlice.actions;

export default pathologySlice.reducer;

// Selectors
export const selectCreatePathologyStatus = (state) =>
  state.pathology?.createStatus;
export const selectCreatePathologyError = (state) =>
  state.pathology?.createError;
export const selectLastCreatedPathology = (state) =>
  state.pathology?.lastCreated;
