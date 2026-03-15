import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase, Users, Bell, Plus, Eye,
  CheckCircle, Clock, XCircle, ArrowRight,
  Building2, AlertCircle,
} from "lucide-react";
import { jobApi } from "../../api/jobApi";
import { applicationApi } from "../../api/applicationApi";
import { notificationApi } from "../../api/notificationApi";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";

// ── shared card primitives ──────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ title }) => (
  <div className="px-6 pt-6 pb-4 border-b border-gray-100">
    <h2 className="text-base font-semibold text-gray-800">{title}</h2>
  </div>
);
const CardBody = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

const statusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "accepted": return "bg-green-50 text-green-700 border border-green-200";
    case "rejected": return "bg-red-50 text-red-700 border border-red-200";
    default:         return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  }
};

const EmptyState = ({ text, link, linkText }) => (
  <div className="text-center py-4">
    <p className="text-sm text-gray-400">{text}</p>
    {link && (
      <Link to={link}
        className="mt-2 inline-flex items-center gap-1 text-xs
                   text-blue-600 font-medium hover:underline">
        {linkText} <ArrowRight className="h-3 w-3" />
      </Link>
    )}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
const EmployerDashboard = () => {
  const { user } = useAuth();
  const {
    profile,
    loadingProfile,
    fetchProfile,
    employerCompletionSections,
    employerCompletionPct,
  } = useProfile();

  const [jobs,          setJobs]          = useState([]);
  const [applications,  setApplications]  = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingRest,   setLoadingRest]   = useState(true);

  useEffect(() => {
    // always fetch fresh profile when dashboard mounts
    fetchProfile();

    const loadRest = async () => {
      try {
        const jobsRes  = await jobApi.getEmployerJobs();
        const appsRes  = await applicationApi.getEmployerApplications();
        const notifRes = await notificationApi.getNotifications();

        setJobs(
          jobsRes.jobs  || jobsRes.data?.jobs  || []
        );
        setApplications(
          appsRes.applications  || appsRes.data?.applications  || []
        );
        setNotifications(
          notifRes.notifications || notifRes.data?.notifications || []
        );
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoadingRest(false);
      }
    };
    loadRest();
  }, [fetchProfile]);

  const loading = loadingProfile || loadingRest;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12
                          border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const unread      = notifications.filter((n) => !n.isRead).length;
  const filledCount = Object.values(employerCompletionSections).filter(Boolean).length;
  const totalCount  = Object.keys(employerCompletionSections).length;

  const barColor =
    employerCompletionPct === 100 ? "bg-green-500"
    : employerCompletionPct >= 60 ? "bg-yellow-400"
    : "bg-red-400";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {profile?.companyName || user?.username || "Employer"} 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your jobs, applications and hiring
            </p>
          </div>
          <Link to="/employer/post-job"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                       text-white text-sm font-medium px-5 py-2.5 rounded-xl
                       shadow-sm transition-colors">
            <Plus className="h-4 w-4" />Post Job
          </Link>
        </div>

        {/* Profile incomplete alert */}
        {employerCompletionPct < 100 && (
          <div className="mb-6 flex items-start gap-3 bg-yellow-50 border
                          border-yellow-200 rounded-2xl px-5 py-4">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800">
                Your company profile is {employerCompletionPct}% complete
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                A complete profile attracts more applicants.
              </p>
            </div>
            <Link to="/employer/profile"
              className="text-xs font-semibold text-yellow-800
                         underline whitespace-nowrap">
              Complete now →
            </Link>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Jobs",
              value: jobs.length,
              icon:  <Briefcase className="h-5 w-5 text-blue-600" />,
              bg:    "bg-blue-50",
            },
            {
              label: "Applications",
              value: applications.length,
              icon:  <Users className="h-5 w-5 text-green-600" />,
              bg:    "bg-green-50",
            },
            {
              label: "Notifications",
              value: unread,
              icon:  <Bell className="h-5 w-5 text-purple-600" />,
              bg:    "bg-purple-50",
            },
            {
              label: "Total Applicants",
              value: jobs.reduce((sum, job) =>
                sum + (job.applicationsCount || 0), 0),
              icon:  <Eye className="h-5 w-5 text-orange-600" />,
              bg:    "bg-orange-50",
            },
          ].map(({ label, value, icon, bg }) => (
            <Card key={label}>
              <CardBody className="flex items-center gap-4">
                <div className={`${bg} p-2.5 rounded-xl`}>{icon}</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ══ LEFT ══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Job Postings */}
            <Card>
              <div className="px-6 pt-6 pb-4 border-b border-gray-100
                              flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">
                  Recent Job Postings
                </h2>
                <Link to="/employer/jobs"
                  className="text-xs text-blue-600 font-medium
                             hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <CardBody>
                {jobs.length === 0 ? (
                  <EmptyState
                    text="No jobs posted yet"
                    link="/employer/post-job"
                    linkText="Post your first job"
                  />
                ) : (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job._id}
                        className="flex justify-between items-center
                                   border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {job.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {job.applicationsCount || 0} applicants
                          </p>
                        </div>
                        <Link to={`/employer/jobs/${job._id}/applications`}
                          className="text-xs text-blue-600 font-medium
                                     hover:underline flex items-center gap-1">
                          View Applications <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Recent Applications */}
            <Card>
              <div className="px-6 pt-6 pb-4 border-b border-gray-100
                              flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">
                  Recent Applications
                </h2>
              </div>
              <CardBody>
                {applications.length === 0 ? (
                  <EmptyState text="No applications received yet" />
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app._id}
                        className="flex items-center justify-between py-2
                                   border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {app.applicant?.username || "Applicant"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Applied for {app.job?.title || ""}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full
                                         font-medium capitalize
                                         ${statusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader
                title={`Notifications${unread > 0 ? ` (${unread} new)` : ""}`}
              />
              <CardBody>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-2">
                    No notifications yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 5).map((n, i) => (
                      <div key={i}
                        className={`text-xs px-3 py-2.5 rounded-lg ${
                          n.isRead
                            ? "bg-gray-50 text-gray-600"
                            : "bg-blue-50 text-blue-800 font-medium"}`}>
                        {n.message}
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="lg:col-span-1 space-y-6">

            {/* Company Profile Completion — live from context */}
            <Card>
              <CardHeader title="Profile Completion" />
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {employerCompletionPct}%
                  </span>
                  <span className="text-xs text-gray-400">
                    {filledCount}/{totalCount} sections
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                  <div
                    className={`h-2 rounded-full transition-all duration-700
                                ${barColor}`}
                    style={{ width: `${employerCompletionPct}%` }}
                  />
                </div>
                <div className="space-y-3">
                  {Object.entries(employerCompletionSections).map(
                    ([label, done]) => (
                      <div key={label}
                        className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            done ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <span className={`text-xs font-bold ${
                          done ? "text-green-600" : "text-red-400"}`}>
                          {done ? "✓ Done" : "Missing"}
                        </span>
                      </div>
                    )
                  )}
                </div>
                {employerCompletionPct < 100 && (
                  <Link to="/employer/profile"
                    className="mt-5 w-full inline-flex items-center justify-center
                               gap-2 bg-blue-600 hover:bg-blue-700 text-white
                               text-sm font-medium py-2.5 rounded-xl
                               transition-colors">
                    <Building2 className="h-4 w-4" />Complete Profile
                  </Link>
                )}
              </CardBody>
            </Card>

            {/* Company Info snapshot */}
            <Card>
              <CardHeader title="Company Info" />
              <CardBody>
                <div className="space-y-3">
                  {[
                    { label: "Company",  value: profile?.companyName },
                    { label: "Location", value: profile?.location    },
                    { label: "Industry", value: profile?.industry    },
                    { label: "Size",     value: profile?.companySize },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-gray-400 uppercase
                                       font-semibold tracking-wide">
                        {label}
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/employer/profile"
                  className="mt-4 w-full inline-flex items-center justify-center
                             gap-2 border border-gray-300 text-gray-700
                             hover:bg-gray-50 text-sm font-medium py-2.5
                             rounded-xl transition-colors">
                  Edit Company Profile
                </Link>
              </CardBody>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
