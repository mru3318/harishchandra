import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { login, selectIsAuthenticated } from "../../../features/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./LoginPage.css";

const LoginPage = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const [fade, setFade] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Use absolute path and replace history to avoid duplicate entries
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ✅ Validation schema for username + password
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password must be at least 8 characters, include 1 uppercase & 1 special character."
      ),
  });

  useEffect(() => {
    if (successMessage) {
      // Start fading out after 3 seconds
      const fadeTimer = setTimeout(() => setFade(true), 3000);

      // Remove message completely after fade animation
      const removeTimer = setTimeout(() => {
        setSuccessMessage("");
        window.history.replaceState({}, document.title); // Clean URL state
      }, 4000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [successMessage]);

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Left Section */}
      <div className="left-section d-flex align-items-end text-white p-4 flex-fill">
        <div className="caption bg-dark bg-opacity-50 p-3 rounded">
          <h2 className="fw-bold">Harishchandra Medicity</h2>
          <p>"Your health, our priority. Trusted care for every family."</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section d-flex justify-content-center align-items-center flex-fill bg-white shadow-sm p-4">
        <div className="form-container w-100" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-2">
            Welcome To Harishchandra Medicity
          </h2>
          <p className="text-center text-muted mb-4">
            Please login to continue
          </p>

          {/* ✅ Show message if redirected from Forgot Password */}
          {successMessage && (
            <div className="alert alert-success text-center py-2 mb-3">
              {successMessage}
            </div>
          )}

          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              setServerError("");
              try {
                const res = await dispatch(
                  login({
                    username: values.username,
                    password: values.password,
                  })
                );

                if (res.meta && res.meta.requestStatus === "fulfilled") {
                  setSuccessMsg("Login successful! Redirecting...");
                  setTimeout(
                    () => navigate("/dashboard", { replace: true }),
                    800
                  );
                } else {
                  // Handle 401 or invalid credentials gracefully
                  const errMsg =
                    res.payload?.status === 401 ||
                    res.payload?.message
                      ?.toLowerCase()
                      .includes("unauthorized") ||
                    res.payload?.message?.toLowerCase().includes("invalid")
                      ? "Invalid username or password"
                      : "Login failed. Please try again.";

                  setFieldError("password", errMsg);
                }
              } catch (err) {
                setServerError("Something went wrong. Please try again later.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form id="loginForm">
                {/* Global Error Message */}
                {serverError && (
                  <div className="alert alert-danger text-center py-2">
                    {serverError}
                  </div>
                )}

                {/* Username Field */}
                <div className="mb-3">
                  <Field
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>

                <div className="text-end mb-3">
                  <NavLink
                    to="/forgot-password"
                    className="text-decoration-none text-primary"
                  >
                    Forgot password?
                  </NavLink>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Log In"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Success Message */}
          {successMsg && (
            <div className="success-popup text-center mt-3">
              <p>{successMsg}</p>
              <button
                className="btn btn-success btn-sm"
                onClick={() => setSuccessMsg("")}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
