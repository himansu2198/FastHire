// src/pages/employer/EmployerJobApplicationsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Mail, Calendar, MapPin, Briefcase, Phone,
  CheckCircle, XCircle, FileText, Star,
  ArrowLeft, Users, Clock, Award,
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
                      text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

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
                            ${active === tab
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-500"}`}>
            {counts[tab]}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg
                     text-sm font-medium flex items-center gap-2
                     ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success"
        ? <CheckCircle className="h-4 w-4" />
        : <XCircle className="h-4 w-4" />}
      {msg}
    </div>
  );
};

// ── ApplicantCard ─────────────────────────────────────────────────────────────
const ApplicantCard = ({ app, onShortlist, onReject, onHire, actionLoading }) => {
  const isLoading = actionLoading === app._id;
  const isLocked  = app.status === "rejected" || app.status === "hired";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6
                    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-11 w-11 bg-gradient-to-br from-blue-500 to-blue-700
                          rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base">
              {(app.applicant?.username || "?")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {app.applicant?.username || "Applicant"}
            </p>
            {app.applicant?.professionalTitle && (
              <p className="text-xs text-gray-500 mt-0.5">
                {app.applicant.professionalTitle}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
        {app.applicant?.email && (
          <span className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />{app.applicant.email}
          </span>
        )}
        {app.applicant?.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />{app.applicant.phone}
          </span>
        )}
        {app.applicant?.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />{app.applicant.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />Applied {timeAgo(app.createdAt)}
        </span>
      </div>

      {/* Skills */}
      {app.applicant?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {app.applicant.skills.slice(0, 6).map((s, i) => (
            <span key={i}
              className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs
                         font-medium rounded-full border border-blue-100">
              {s}
            </span>
          ))}
          {app.applicant.skills.length > 6 && (
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs
                             font-medium rounded-full">
              +{app.applicant.skills.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-3 flex-wrap">

        {/* Resume */}
        {app.applicant?.resume ? (
          <a
            href={`https://job-listing-portal-dpov.onrender.com${app.applicant.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium
                       text-blue-600 hover:text-blue-700 border border-blue-200
                       hover:border-blue-400 px-3 py-1.5 rounded-lg
                       hover:bg-blue-50 transition-all"
          >
            <FileText className="h-3.5 w-3.5" />View Resume
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">No resume</span>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {/* Shortlist */}
          <button
            onClick={() => onShortlist(app._id)}
            disabled={isLoading || isLocked || app.status === "shortlisted"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-xs font-semibold transition-all duration-150
                        ${app.status === "shortlisted"
                          ? "bg-yellow-100 text-yellow-700 cursor-default"
                          : isLocked || isLoading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 hover:shadow-sm"}`}
          >
            <Star className="h-3.5 w-3.5" />
            {app.status === "shortlisted" ? "Shortlisted" : "Shortlist"}
          </button>

          {/* Hire */}
          <button
            onClick={() => onHire(app._id)}
            disabled={isLoading || isLocked || app.status === "hired"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-xs font-semibold transition-all duration-150
                        ${app.status === "hired"
                          ? "bg-green-100 text-green-700 cursor-default"
                          : isLocked || isLoading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:shadow-sm"}`}
          >
            <Award className="h-3.5 w-3.5" />
            {app.status === "hired" ? "Hired" : "Hire"}
          </button>

          {/* Reject */}
          <button
            onClick={() => onReject(app._id)}
            disabled={isLoading || isLocked}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-xs font-semibold transition-all duration-150
                        ${app.status === "rejected"
                          ? "bg-red-100 text-red-700 cursor-default"
                          : isLocked || isLoading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:shadow-sm"}`}
          >
            <XCircle className="h-3.5 w-3.5" />
            {app.status === "rejected" ? "Rejected" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── PAGE ──────────────────────────────────────────────────────────────────────
const EmployerJobApplicationsPage = () => {
  const { jobId } = useParams();
  const [applications,  setApplications]  = useState([]);
  const [filter,        setFilter]        = useState("all");
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = useCallback((msg, type = "success") =>
    setToast({ msg, type }), []);

  const fetchApplications = useCallback(async () => {
    try {
      const res     = await applicationApi.getEmployerApplications();
      const allApps = res.applications || res.data?.applications || [];
      setApplications(allApps.filter((app) => app.job?._id === jobId));
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const updateStatus = (id, status) =>
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a)));

  const handleShortlist = async (id) => {
    setActionLoading(id);
    try {
      await applicationApi.shortlistApplication(id);
      updateStatus(id, "shortlisted");
      showToast("Candidate shortlisted!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to shortlist", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await applicationApi.rejectApplication(id);
      updateStatus(id, "rejected");
      showToast("Candidate rejected", "error");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reject", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // hire = shortlist with extra step — use shortlist API or add hire API later
  const handleHire = async (id) => {
    setActionLoading(id);
    try {
      await applicationApi.shortlistApplication(id); // swap with hireApplication when available
      updateStatus(id, "hired");
      showToast("Candidate hired! 🎉", "success");
    } catch (err) {
      showToast("Failed to hire candidate", "error");
    } finally {
      setActionLoading(null);
    }
  };

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

  const jobTitle = applications[0]?.job?.title || "Job";

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
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="container mx-auto px-4 max-w-4xl">

        {/* Back */}
        <Link
          to="/employer/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500
                     hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />Back to Jobs
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Applicants
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {jobTitle} · {applications.length} total applicant{applications.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total",       value: counts.all,         icon: <Users      className="h-5 w-5 text-gray-600"   />, color: "bg-gray-100"  },
            { label: "Shortlisted", value: counts.shortlisted, icon: <Star       className="h-5 w-5 text-yellow-600" />, color: "bg-yellow-50" },
            { label: "Hired",       value: counts.hired,       icon: <Award      className="h-5 w-5 text-green-600"  />, color: "bg-green-50"  },
            { label: "Rejected",    value: counts.rejected,    icon: <XCircle    className="h-5 w-5 text-red-600"    />, color: "bg-red-50"    },
          ].map(({ label, value, icon, color }) => (
            <div key={label}
              className="bg-white rounded-2xl border border-gray-200 p-4
                         flex items-center gap-3 hover:shadow-md
                         hover:-translate-y-0.5 transition-all duration-200">
              <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mb-6">
          <FilterTabs active={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Applicant cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((app) => (
              <ApplicantCard
                key={app._id}
                app={app}
                actionLoading={actionLoading}
                onShortlist={handleShortlist}
                onReject={handleReject}
                onHire={handleHire}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl
                            border border-gray-200">
              <div className="h-16 w-16 bg-gray-100 rounded-2xl flex
                              items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No applicants found
              </h3>
              <p className="text-sm text-gray-400">
                {filter === "all"
                  ? "No one has applied to this job yet"
                  : `No ${filter} applicants`}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmployerJobApplicationsPage;
