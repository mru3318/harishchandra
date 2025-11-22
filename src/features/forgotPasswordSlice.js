import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";
// Example: export const API_BASE_URL = "http://localhost:8080/api";

/* ======================================================
   1️⃣  REQUEST OTP
   Endpoint: POST /forgot-password/request
   Body: { email }
====================================================== */
export const requestOtp = createAsyncThunk(
  "forgotPassword/requestOtp",
  async (email, thunkAPI) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password/request`, {
        email,
      });
      return res.data; // e.g. "OTP sent successfully"
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Network error";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================================================
   2️⃣  VALIDATE OTP
   Endpoint: POST /forgot-password/validate
   Body: { email, otp }
====================================================== */
export const validateOtp = createAsyncThunk(
  "forgotPassword/validateOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password/validate`, {
        email,
        otp,
      });
      return res.data; // e.g. "OTP validated successfully"
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Network error";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================================================
   3️⃣  RESET PASSWORD
   Endpoint: POST /forgot-password/reset
   Body: { email, otp, newPassword, confirmPassword }
====================================================== */
export const resetPassword = createAsyncThunk(
  "forgotPassword/resetPassword",
  async ({ email, otp, newPassword, confirmPassword }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password/reset`, {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      return res.data || "Password reset successfully";
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.response?.status === 400
          ? "Invalid OTP or mismatched passwords"
          : err.message || "Network error");
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================================================
   🔄 SLICE CONFIGURATION
====================================================== */
const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    message: null,
    step: "email", // Controls UI flow: 'email' → 'otp' → 'reset'
  },
  reducers: {
    clearForgotError(state) {
      state.error = null;
    },
    clearForgotMessage(state) {
      state.message = null;
    },
    setStep(state, action) {
      state.step = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      /* ========== 📩 REQUEST OTP ========== */
      .addCase(requestOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload || "OTP sent successfully";
        state.error = null;
        state.step = "otp";
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
        state.message = null;
      })

      /* ========== 🔢 VALIDATE OTP ========== */
      .addCase(validateOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(validateOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload || "OTP validated successfully";
        state.error = null;
        state.step = "reset";
      })
      .addCase(validateOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
        state.message = null;
      })

      /* ========== 🔐 RESET PASSWORD ========== */
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload || "Password reset successfully";
        state.error = null;
        state.step = "email"; // Return to initial email step
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
        state.message = null;
      });
  },
});

/* ======================================================
   🧾 EXPORTS
====================================================== */
export const { clearForgotError, clearForgotMessage, setStep } =
  forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;

/* ======================================================
   🔍 SELECTORS
====================================================== */
export const selectForgotStatus = (state) => state.forgotPassword.status;
export const selectForgotError = (state) => state.forgotPassword.error;
export const selectForgotMessage = (state) => state.forgotPassword.message;
export const selectForgotStep = (state) => state.forgotPassword.step;
