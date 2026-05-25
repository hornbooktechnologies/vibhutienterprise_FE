import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  Users,
  Shield,
  UserCheck,
  History,
  ArrowUpRight,
  TrendingUp,
  Settings,
  ShieldAlert,
  UserPlus
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        toast.error("Failed to fetch administrative metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60dvh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalRoles: 0,
    activeUsers: 0,
    totalLogs: 0,
  };

  const recentLogs = data?.recentLogs || [];

  const statCards = [
    {
      title: "Total Accounts",
      value: stats.totalUsers,
      desc: "Registered system accounts",
      icon: Users,
      gradient: "from-secondary-600/20 to-cyan-500/5",
      border: "border-secondary-500/20",
      iconColor: "text-secondary-400",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      desc: "Accounts marked active",
      icon: UserCheck,
      gradient: "from-emerald-600/20 to-teal-500/5",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      title: "Configured Roles",
      value: stats.totalRoles,
      desc: "Database access levels",
      icon: Shield,
      gradient: "from-purple-600/20 to-primary-500/5",
      border: "border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "System Logs",
      value: stats.totalLogs,
      desc: "Total recorded actions",
      icon: History,
      gradient: "from-amber-600/20 to-orange-500/5",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  const getActionBadge = (action) => {
    switch (action?.toUpperCase()) {
      case "LOGIN":
        return "bg-secondary-500/10 text-secondary-400 border border-secondary-500/20";
      case "CREATE":
      case "CREATE_USER":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "UPDATE":
      case "UPDATE_USER":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "DELETE":
      case "DELETE_USER":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "FORGOT_PASSWORD":
      case "RESET_PASSWORD":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Administrative Console
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Overview of system performance, roles, logs and active user registries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 px-3 py-1.5 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Server: Connected
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between ${card.border}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} -z-10`}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-50/40 border border-white/5 ${card.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-light">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Dashboard layout split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent logs */}
        <div className="xl:col-span-2 glass-panel rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <History className="h-5 w-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Recent Activities
                </h2>
              </div>
              <Link
                to="/settings/logs"
                className="flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors gap-1"
              >
                View Full Audit
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-xs text-slate-600 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Action</th>
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-sm text-slate-700">
                  {recentLogs.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-6 text-center text-slate-500 text-xs">
                        No recent operations or audits recorded.
                      </td>
                    </tr>
                  ) : (
                    recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3.5 pr-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${getActionBadge(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800">
                              {log.details ? log.details.replace(/^User logged in: /, "") : "System"}
                            </span>
                          </div>
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

        {/* Quick action panel */}
        <div className="glass-panel rounded-2xl border border-slate-200/60 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary-400" />
              Quick Operations
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Immediate control shortcuts for site administrators.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/users"
              className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-slate-200/60 hover:bg-white/80 hover:border-slate-300/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20 group-hover:bg-primary-500/20 transition-all">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">User Control Desk</h4>
                  <p className="text-xs text-slate-600">View users list and manage memberships</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-slate-800 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              to="/settings/permissions"
              className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-slate-200/60 hover:bg-white/80 hover:border-slate-300/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Role & Privileges</h4>
                  <p className="text-xs text-slate-600">Configure mapped role permissions</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-slate-800 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              to="/settings/logs"
              className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-slate-200/60 hover:bg-white/80 hover:border-slate-300/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Audit Vault</h4>
                  <p className="text-xs text-slate-600">Inspect full database system logs</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-slate-800 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Quick info status summary */}
          <div className="p-4 rounded-xl bg-primary-950/20 border border-primary-500/10 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-primary-300">Quick Note:</span>
              <p className="text-slate-600 mt-0.5">Database connections are pooling automatically using Node-MySQL2 promise streams. Performance is optimized.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
