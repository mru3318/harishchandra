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
      // debug token presence (will be visible in browser console)
      console.debug("fetchPathologies - token present:", !!token);
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

// Fetch all pathology reports (GET /pathology/all)
export const fetchPathologies = createAsyncThunk(
  "pathology/fetchPathologies",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.get(`${API_BASE_URL}/pathology/all`, { headers });
      const data = res.data?.data || res.data;
      return data;
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
  pathologies: [],
  pathologiesStatus: "idle",
  pathologiesError: null,
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

    // fetch pathologies reducers
    builder
      .addCase(fetchPathologies.pending, (state) => {
        state.pathologiesStatus = "loading";
        state.pathologiesError = null;
      })
      .addCase(fetchPathologies.fulfilled, (state, action) => {
        state.pathologiesStatus = "succeeded";
        state.pathologies = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchPathologies.rejected, (state, action) => {
        state.pathologiesStatus = "failed";
        state.pathologiesError = action.payload || action.error.message;
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

// selectors for fetched pathologies
export const selectPathologies = (state) => state.pathology?.pathologies || [];
export const selectPathologiesStatus = (state) =>
  state.pathology?.pathologiesStatus || "idle";
export const selectPathologiesError = (state) =>
  state.pathology?.pathologiesError || null;
