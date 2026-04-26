// src/pages/jobseeker/JobSeekerApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase, CheckCircle, XCircle, Clock,
  Star, ArrowRight, Search, FileText,
} from "lucide-react";
import { applicationApi } from "../../api/applicationApi";

// ── helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7)  return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)} weeks ago`;
  return `${Math.floor(d / 30)} months ago`;
}

// ── status config ─────────────────────────────────────────────────────────────
const STATUS = {
  applied:     { label: "Applied",     bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  shortlisted: { label: "Shortlisted", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  hired:       { label: "Hired",       bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  rejected:    { label: "Rejected",    bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
};

// ── StatusBadge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.applied;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                      text-xs font-semibold border
                      ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ── StatCard ──────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-4 rounded-2xl border text-left
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                ${active
                  ? "bg-blue-600 border-blue-600 text-white shadow-md"
                  : "bg-white border-gray-200 text-gray-900"}`}
  >
    <div className={`p-2.5 rounded-xl ${active ? "bg-blue-500" : color}`}>
      {icon}
    </div>
    <div>
      <p className={`text-2xl font-bold tabular-nums ${active ? "text-white" : ""}`}>
        {value}
      </p>
      <p className={`text-xs ${active ? "text-blue-100" : "text-gray-500"}`}>
        {label}
      </p>
    </div>
  </button>
);

// ── FilterTabs ────────────────────────────────────────────────────────────────
const TABS = ["all", "applied", "shortlisted", "hired", "rejected"];

const FilterTabs = ({ active, onChange, counts }) => (
  <div className="flex gap-2 flex-wrap">
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                    duration-200 border
                    ${active === tab
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"}`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
        {counts[tab] !== undefined && (
          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                            ${active === tab ? "bg-blue-500" : "bg-gray-100 text-gray-500"}`}>
            {counts[tab]}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ── ApplicationCard ───────────────────────────────────────────────────────────
const ApplicationCard = ({ app }) => (
  <div className="group bg-white rounded-2xl border border-gray-200 p-5
                  hover:shadow-lg hover:-translate-y-0.5 transition-all
                  duration-200 flex flex-col sm:flex-row sm:items-center gap-4">
    {/* Icon */}
    <div className="flex-shrink-0 h-12 w-12 bg-blue-50 rounded-xl flex
                    items-center justify-center border border-blue-100">
      <Briefcase className="h-6 w-6 text-blue-600" />
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <p className="text-base font-semibold text-gray-900 truncate">
        {app.job?.title || "Job"}
      </p>
      <p className="text-sm text-gray-500 mt-0.5 truncate">
        {app.job?.companyName || "Company"}
      </p>
      <div className="flex items-center gap-3 mt-2">
        <StatusBadge status={app.status} />
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="h-3 w-3" />{timeAgo(app.createdAt)}
        </span>
      </div>
    </div>

    {/* Action */}
    <div className="flex-shrink-0">
      <Link
        to={`/jobs/${app.job?._id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium
                   text-blue-600 hover:text-blue-700 border border-blue-200
                   hover:border-blue-400 px-4 py-2 rounded-xl transition-all
                   duration-150 hover:bg-blue-50"
      >
        View Job <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  </div>
);

// ── EmptyState ────────────────────────────────────────────────────────────────
const EmptyState = ({ filtered }) => (
  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
    <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center
                    justify-center mx-auto mb-4">
      <FileText className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">
      {filtered ? "No applications found" : "No applications yet"}
    </h3>
    <p className="text-sm text-gray-400 mb-5">
      {filtered
        ? "Try a different filter"
        : "You haven't applied to any jobs yet"}
    </p>
    {!filtered && (
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                   text-white text-sm font-medium px-5 py-2.5 rounded-xl
                   transition-colors"
      >
        Browse Jobs <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

// ── PAGE ──────────────────────────────────────────────────────────────────────
const JobSeekerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filter,       setFilter]       = useState("all");
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await applicationApi.getMyApplications();
        const data = res.applications || res.data?.applications || [];
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = {
    all:         applications.length,
    applied:     applications.filter((a) => a.status === "applied").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    hired:       applications.filter((a) => a.status === "hired").length,
    rejected:    applications.filter((a) => a.status === "rejected").length,
  };

  const filtered = filter === "all"
    ? applications
    : applications.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2
                          border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Loading applications…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Track all your job applications in one place
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <StatCard label="Total"       value={counts.all}         icon={<Briefcase  className="h-5 w-5 text-gray-600"  />} color="bg-gray-100"   onClick={() => setFilter("all")}         active={filter === "all"}         />
          <StatCard label="Applied"     value={counts.applied}     icon={<Clock      className="h-5 w-5 text-blue-600"  />} color="bg-blue-50"    onClick={() => setFilter("applied")}     active={filter === "applied"}     />
          <StatCard label="Shortlisted" value={counts.shortlisted} icon={<Star       className="h-5 w-5 text-yellow-600"/>} color="bg-yellow-50"  onClick={() => setFilter("shortlisted")} active={filter === "shortlisted"} />
          <StatCard label="Hired"       value={counts.hired}       icon={<CheckCircle className="h-5 w-5 text-green-600"/>} color="bg-green-50"   onClick={() => setFilter("hired")}       active={filter === "hired"}       />
          <StatCard label="Rejected"    value={counts.rejected}    icon={<XCircle    className="h-5 w-5 text-red-600"   />} color="bg-red-50"     onClick={() => setFilter("rejected")}    active={filter === "rejected"}    />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <FilterTabs active={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.length > 0
            ? filtered.map((app) => (
                <ApplicationCard key={app._id} app={app} />
              ))
            : <EmptyState filtered={filter !== "all"} />
          }
        </div>

      </div>
    </div>
  );
};

export default JobSeekerApplicationsPage;
