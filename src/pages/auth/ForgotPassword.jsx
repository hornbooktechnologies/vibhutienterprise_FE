import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "sonner";
import api from "../../lib/api";
import Meta from "../../components/common/Meta";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.post("/auth/forgot-password", { email: values.email });
        setSubmitted(true);
        toast.success("Password reset request submitted successfully!");
      } catch (err) {
        console.error("Forgot Password error:", err);
        const errMsg = err.response?.data?.message || "Something went wrong. Please check the email and try again.";
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 text-slate-900">
      <Meta title="Recovery Console" />
      <Toaster position="top-right" theme="dark" richColors />

      {/* Background ambient glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow"></div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center animate-float">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-500 shadow-lg shadow-primary-500/20">
            <KeyRound className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Access Recovery
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Recover your Vibhuti administrative access credentials
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 backdrop-blur-xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>

          {!submitted ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-slate-600">
                  Registered Email Address
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
                    placeholder="name@vibhuti.com"
                    {...formik.getFieldProps("email")}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-400 font-light">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Dispatching Link...
                    </>
                  ) : (
                    "Send Recovery Instructions"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-slate-700">
                <p className="font-semibold text-emerald-400 mb-1">Simulated Dispatch Successful</p>
                <p className="text-sm">We've printed recovery logs in the backend node console! Since this is a local setup, please inspect the console logs to retrieve the recovery link.</p>
              </div>
              <p className="text-xs text-slate-600">Normally a secure SMTP system would forward instructions to {formik.values.email}.</p>
            </div>
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

export default ForgotPassword;
