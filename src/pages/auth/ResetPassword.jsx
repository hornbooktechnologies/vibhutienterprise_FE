import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "sonner";
import api from "../../lib/api";
import Meta from "../../components/common/Meta";
import { Eye, EyeOff, Lock, ArrowLeft, Loader2, KeyRound } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = searchParams.get("id");

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!userId) {
        toast.error("Invalid or missing user identity in request query. Please request another reset link.");
        return;
      }
      setLoading(true);
      try {
        await api.post("/auth/reset-password", {
          userId,
          password: values.password,
          confirm_password: values.confirm_password,
        });
        toast.success("Password updated successfully! Redirecting...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (err) {
        console.error("Reset Password error:", err);
        const errMsg = err.response?.data?.message || "Failed to update your password. Please try again.";
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 text-slate-900">
      <Meta title="Password Reset Gateway" />
      <Toaster position="top-right" theme="dark" richColors />

      {/* Background ambient glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary-500/10 blur-[120px] animate-pulse-slow"></div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center animate-float">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/20">
            <KeyRound className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Configure secure access credentials for user account
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 backdrop-blur-xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>

          {!userId ? (
            <div className="text-center py-4 space-y-4">
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-300">
                <p className="font-semibold text-red-400 mb-1">Invalid Recovery Context</p>
                <p className="text-sm">This reset link appears to be malformed or expired. Please trigger a new forgot-password workflow to acquire a correct link.</p>
              </div>
              <a
                href="/forgot-password"
                className="inline-flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Go back to Recovery
              </a>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-slate-600">
                  New Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`glass-input block w-full rounded-xl py-3 pl-10 pr-10 text-sm ${
                      formik.touched.password && formik.errors.password ? "border-red-500/50 focus:border-red-500 focus:shadow-red-500/15" : ""
                    }`}
                    placeholder="••••••••"
                    {...formik.getFieldProps("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-red-400 font-light">{formik.errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-xs font-medium uppercase tracking-wider text-slate-600">
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`glass-input block w-full rounded-xl py-3 pl-10 pr-10 text-sm ${
                      formik.touched.confirm_password && formik.errors.confirm_password ? "border-red-500/50 focus:border-red-500 focus:shadow-red-500/15" : ""
                    }`}
                    placeholder="••••••••"
                    {...formik.getFieldProps("confirm_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formik.touched.confirm_password && formik.errors.confirm_password && (
                  <p className="mt-1 text-xs text-red-400 font-light">{formik.errors.confirm_password}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary-500 hover:to-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Password...
                    </>
                  ) : (
                    "Apply New Credentials"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-slate-200/80 pt-6">
            <a
              href="/login"
              className="flex items-center justify-center text-xs text-slate-600 hover:text-slate-800 transition-colors gap-1.5 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to login portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
