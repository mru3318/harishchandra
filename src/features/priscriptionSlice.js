import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL: API_BASE_URL });

// GET /api/prescriptions/all
export const fetchAllPrescriptions = createAsyncThunk(
  "prescription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/prescriptions/all");
      return res.data;
    } catch (err) {
      if (err.response) {
        const message =
          err.response.data?.message || err.response.data || err.message;
        return rejectWithValue({
          message,
          status: err.response.status,
          url: err.config?.url,
        });
      }
      return rejectWithValue({ message: err.message || "Network error" });
    }
  }
);

// POST /api/prescriptions
export const addPrescription = createAsyncThunk(
  "prescription/addPrescription",
  async (prescription, { rejectWithValue }) => {
    try {
      const res = await api.post("/prescriptions", prescription, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      // Normalize possible backend validation shapes
      if (err.response) {
        const respData = err.response.data;
        const errors = Array.isArray(respData)
          ? respData
          : respData?.errors || respData?.fieldErrors || undefined;
        const message =
          typeof respData === "string"
            ? respData
            : respData?.message || respData || err.message;
        return rejectWithValue({
          message,
          status: err.response.status,
          url: err.config?.url,
          errors,
        });
      }

      return rejectWithValue({
        message: err.message || "Network error",
        code: err.code,
      });
    }
  }
);

// DELETE /api/prescriptions/{id}
export const deletePrescription = createAsyncThunk(
  "prescription/deletePrescription",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      await api.delete(`/prescriptions/${prescriptionId}`);
      return prescriptionId;
    } catch (err) {
      if (err.response) {
        const message =
          err.response.data?.message || err.response.data || err.message;
        return rejectWithValue({
          message,
          status: err.response.status,
          url: err.config?.url,
        });
      }
      return rejectWithValue({ message: err.message || "Network error" });
    }
  }
);

// PUT /api/prescriptions/{id}
export const updatePrescription = createAsyncThunk(
  "prescription/updatePrescription",
  async ({ id, prescription }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/prescriptions/${id}`, prescription, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      if (err.response) {
        const respData = err.response.data;
        const errors = Array.isArray(respData)
          ? respData
          : respData?.errors || respData?.fieldErrors || undefined;
        const message =
          typeof respData === "string"
            ? respData
            : respData?.message || respData || err.message;
        return rejectWithValue({
          message,
          status: err.response.status,
          url: err.config?.url,
          errors,
        });
      }
      return rejectWithValue({
        message: err.message || "Network error",
        code: err.code,
      });
    }
  }
);

const initialState = {
  prescriptions: [],
  fetchStatus: "idle",
  fetchError: null,
  addStatus: "idle",
  addError: null,
  addErrors: null, // array or object from backend validations
  deleteStatus: "idle",
  deleteError: null,
  updateStatus: "idle",
  updateError: null,
  updateErrors: null,
};

const priscriptionSlice = createSlice({
  name: "priscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPrescriptions.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchAllPrescriptions.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const list =
          action.payload && action.payload.data
            ? action.payload.data
            : action.payload;
        state.prescriptions = Array.isArray(list) ? list : list ? [list] : [];
      })
      .addCase(fetchAllPrescriptions.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload?.message || action.error?.message;
      })

      .addCase(addPrescription.pending, (state) => {
        state.addStatus = "loading";
        state.addError = null;
        state.addErrors = null;
      })
      .addCase(addPrescription.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        const created =
          action.payload && action.payload.data
            ? action.payload.data
            : action.payload;
        if (created) {
          if (Array.isArray(created))
            state.prescriptions = [...created, ...state.prescriptions];
          else state.prescriptions.unshift(created);
        }
      })
      .addCase(addPrescription.rejected, (state, action) => {
        state.addStatus = "failed";
        state.addError = action.payload?.message || action.error?.message;
        state.addErrors = action.payload?.errors;
      })

      .addCase(deletePrescription.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.prescriptions = state.prescriptions.filter(
          (p) => p.id !== action.payload && p.prescriptionId !== action.payload
        );
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload?.message || action.error?.message;
      })

      .addCase(updatePrescription.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
        state.updateErrors = null;
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const updated =
          action.payload && action.payload.data
            ? action.payload.data
            : action.payload;
        if (updated) {
          const index = state.prescriptions.findIndex(
            (p) => p.id === updated.id || p.prescriptionId === updated.id
          );
          if (index !== -1) {
            state.prescriptions[index] = updated;
          }
        }
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload?.message || action.error?.message;
        state.updateErrors = action.payload?.errors;
      });
  },
});

export default priscriptionSlice.reducer;

// Selectors
export const selectPrescriptions = (state) => state.priscription?.prescriptions;
export const selectAddPrescriptionStatus = (state) =>
  state.priscription?.addStatus;
export const selectAddPrescriptionError = (state) =>
  state.priscription?.addError;
export const selectAddPrescriptionErrors = (state) =>
  state.priscription?.addErrors;
export const selectFetchPrescriptionsStatus = (state) =>
  state.priscription?.fetchStatus;
export const selectFetchPrescriptionsError = (state) =>
  state.priscription?.fetchError;
export const selectDeletePrescriptionStatus = (state) =>
  state.priscription?.deleteStatus;
export const selectDeletePrescriptionError = (state) =>
  state.priscription?.deleteError;
export const selectUpdatePrescriptionStatus = (state) =>
  state.priscription?.updateStatus;
export const selectUpdatePrescriptionError = (state) =>
  state.priscription?.updateError;
export const selectUpdatePrescriptionErrors = (state) =>
  state.priscription?.updateErrors;

// `addPrescription`, `deletePrescription`, and `updatePrescription` already exported above as named exports.
