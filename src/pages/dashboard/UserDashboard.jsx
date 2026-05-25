import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  User,
  History,
  Phone,
  Mail,
  Shield,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  BookOpen
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await api.get("/dashboard/user");
        setData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
        toast.error("Failed to load user portal details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60dvh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const profile = data?.stats?.profile || {
    first_name: user?.first_name || "Guest",
    last_name: user?.last_name || "User",
    email: user?.email || "",
    mobile: user?.mobile || "N/A",
    role_name: user?.role || "User",
  };

  const activityCount = data?.stats?.activityCount || 0;
  const recentLogs = data?.recentLogs || [];

  return (
    <div className="space-y-8">
      {/* Header section with welcoming greeting */}
      <div className="relative overflow-hidden rounded-3xl border border-primary-500/10 bg-gradient-to-r from-primary-950/20 to-slate-900/40 p-8 md:p-10 shadow-lg">
        {/* Glow ambient circle */}
        <div className="absolute top-[-30%] right-[-10%] h-[300px] w-[300px] rounded-full bg-primary-500/10 blur-[80px] -z-10 animate-pulse-slow"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400 border border-primary-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome to Vibhuti Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
              Hello, {profile.first_name} {profile.last_name}!
            </h1>
            <p className="text-slate-600 text-sm max-w-xl font-light">
              You are signed in under the <strong className="text-primary-400 font-semibold">{profile.role_name}</strong> privilege tier. From this dashboard, you can view logs, access profile settings, and check permissions.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/profile"
              className="btn-glow inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 px-5 py-3 text-sm font-semibold text-slate-800 shadow-md hover:from-primary-500 hover:to-secondary-500 transition-all cursor-pointer"
            >
              <User className="h-4 w-4" />
              Manage Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Profile & Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 glass-panel rounded-2xl border border-slate-200/60 p-6 space-y-6">
          <div className="flex items-center gap-2.5">
            <User className="h-5 w-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-slate-800">Personal Profile Summary</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 rounded-lg bg-slate-50/50 border border-white/5 text-slate-600">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Full Name</p>
                  <p className="font-medium text-slate-800">{profile.first_name} {profile.last_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 rounded-lg bg-slate-50/50 border border-white/5 text-slate-600">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="font-medium text-slate-800">{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 rounded-lg bg-slate-50/50 border border-white/5 text-slate-600">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone Contact</p>
                  <p className="font-medium text-slate-800">{profile.mobile || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 rounded-lg bg-slate-50/50 border border-white/5 text-slate-600">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Assigned Role</p>
                  <p className="font-medium text-primary-400">{profile.role_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary Stats Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border-primary-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent -z-10" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Audit Statistics</span>
            <div className="p-2 rounded-xl bg-slate-50/40 border border-white/5 text-primary-400">
              <History className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight">
              {activityCount}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 font-light">
              Total actions performed by your account
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span>Security Status</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Secure
            </span>
          </div>
        </div>
      </div>

      {/* Logs & Help Desk Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent logs */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <History className="h-5 w-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-slate-800">Your Recent Operations</h2>
              </div>
              <span className="text-xs text-slate-600">Showing last 5 audits</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-xs text-slate-600 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Operation</th>
                    <th className="pb-3 font-semibold">Details</th>
                    <th className="pb-3 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-sm text-slate-700">
                  {recentLogs.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-6 text-center text-slate-500 text-xs">
                        No activity records found for this account.
                      </td>
                    </tr>
                  ) : (
                    recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3.5 pr-4">
                          <span className="inline-flex px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20 text-[10px] font-mono uppercase">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-xs font-light text-slate-700">
                          {log.details}
                        </td>
                        <td className="py-3.5 text-right text-xs text-slate-600 font-mono">
                          {new Date(log.created_at).toLocaleString([], {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resources Panel */}
        <div className="glass-panel rounded-2xl border border-slate-200/60 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary-400" />
              Information & Help
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Helpful resources and links for Vibhuti users.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/40 border border-slate-200/60 hover:bg-white/80 hover:border-slate-300/60 transition-all text-sm text-slate-700 group"
            >
              <span className="font-medium group-hover:text-slate-800 transition-colors">User Documentation</span>
              <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-slate-800 transition-colors" />
            </a>

            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/40 border border-slate-200/60 hover:bg-white/80 hover:border-slate-300/60 transition-all text-sm text-slate-700 group"
            >
              <span className="font-medium group-hover:text-slate-800 transition-colors">Security Guidelines</span>
              <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-slate-800 transition-colors" />
            </a>

            <div className="p-4 rounded-xl bg-white/40 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-700 block mb-1">Session Policy</span>
              Our security policy requires validation of requests using Bearer JSON Web Tokens expiring after 24 hours. For security reasons, please log out if you leave the console.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
