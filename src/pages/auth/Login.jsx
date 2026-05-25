import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../context/AuthContext";
import Meta from "../../components/common/Meta";
import { Eye, EyeOff, Lock, Mail, Loader2, Sparkles } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.email, values.password);
        toast.success("Successfully logged in! Welcome back.", {
          duration: 3000,
        });
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      } catch (err) {
        console.error("Login component error:", err);
        const errMsg = err.response?.data?.message || "Invalid email or password. Please try again.";
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 text-slate-900">
      <Meta title="Secure Access Gateway" />
      <Toaster position="top-right" theme="dark" richColors />

      {/* Background ambient glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary-500/10 blur-[120px] animate-pulse-slow"></div>

      <div className="w-full max-w-md">
        {/* Logo/Branding Header */}
        <div className="mb-8 text-center animate-float flex flex-col items-center">
          <div className="mb-4">
            <img src="/logo.png" alt="Vibhuti Logo" className="h-16 w-auto object-contain filter drop-shadow-md" />
          </div>
          {/* <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            <span className="text-slate-800">Vibhuti</span>
            <span className="text-gradient-primary ml-2 font-light">Portal</span>
          </h2> */}
          <p className="mt-2 text-sm text-slate-600">
            Access secure dashboard management and controls
          </p>
        </div>

        {/* Premium Glass Card */}
        <div className="glass-card rounded-2xl p-8 backdrop-blur-xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`glass-input block w-full rounded-xl py-3 pl-10 pr-4 text-sm ${
                    formik.touched.email && formik.errors.email ? "border-red-500/50 focus:border-red-500 focus:shadow-red-500/15" : ""
                  }`}
                  placeholder="name@example.com"
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-400 font-light">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-glow flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary-500 hover:to-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Identity...
                  </>
                ) : (
                  "Secure Sign In"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-6 glass-panel rounded-xl p-4 border-slate-200 text-xs">
          <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary-400" />
            Quick Demo Login Access:
          </div>
          <div className="grid grid-cols-2 gap-4 text-slate-600">
            <div>
              <span className="font-medium text-slate-700">Administrator:</span>
              <p>admin@vibhuti.com</p>
              <p>admin123</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Basic User:</span>
              <p>user@vibhuti.com</p>
              <p>user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
