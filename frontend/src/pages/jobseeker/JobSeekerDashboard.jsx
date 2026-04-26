// src/pages/jobseeker/Dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase, FileText, Bell, CheckCircle,
  Clock, XCircle, User, MapPin, GraduationCap,
  AlertCircle, ArrowRight, Sparkles, Star,
} from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { applicationApi } from "../../api/applicationApi";
import { notificationApi } from "../../api/notificationApi";
import { useAuth } from "../../context/AuthContext";
import { useCounter } from "../../hooks/useCounter";

// ── primitives ───────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm
                   overflow-hidden transition-shadow duration-200
                   hover:shadow-md ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ title, action }) => (
  <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
    <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    {action}
  </div>
);
const CardBody = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

// ── status helpers (standardised) ────────────────────────────────────────────
const statusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "hired":
    case "shortlisted": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected":    return <XCircle     className="h-4 w-4 text-red-500"   />;
    default:            return <Clock       className="h-4 w-4 text-yellow-500" />;
  }
};

const statusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "hired":        return "bg-green-50  text-green-700  border border-green-200";
    case "shortlisted":  return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "rejected":     return "bg-red-50    text-red-700    border border-red-200";
    default:             return "bg-blue-50   text-blue-700   border border-blue-200";
  }
};

const statusLabel = (status) => {
  const map = {
    applied:     "Applied",
    under_review:"Under Review",
    shortlisted: "Shortlisted",
    hired:       "Hired",
    rejected:    "Rejected",
    // legacy compat
    pending:     "Applied",
    accepted:    "Hired",
  };
  return map[status?.toLowerCase()] || status;
};

const EmptyState = ({ text, link, linkText }) => (
  <div className="text-center py-6">
    <p className="text-sm text-gray-400">{text}</p>
    <Link to={link}
      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600
                 font-medium hover:underline">
      {linkText} <ArrowRight className="h-3 w-3" />
    </Link>
  </div>
);

// ── animated stat card ────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, bg }) => {
  const animated = useCounter(value);
  return (
    <Card className="group cursor-default">
      <CardBody className="flex items-center gap-4">
        <div className={`${bg} p-3 rounded-xl transition-transform duration-200
                         group-hover:-translate-y-0.5`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{animated}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
};

// ── animated progress bar ─────────────────────────────────────────────────────
const ProgressBar = ({ pct }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);
  const color = pct === 100 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${color}`}
           style={{ width: `${width}%` }} />
    </div>
  );
};

// ── PAGE ──────────────────────────────────────────────────────────────────────
const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const { profile, loadingProfile, fetchProfile,
          completionSections, completionPct, sectionWeights } = useProfile();

  const [applications,  setApplications]  = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingRest,   setLoadingRest]   = useState(true);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchProfile();
    (async () => {
      try {
        const [appRes, notifRes] = await Promise.all([
          applicationApi.getMyApplications().catch(() => ({})),
          notificationApi.getNotifications().catch(() => ({})),
        ]);
        setApplications(appRes?.applications || appRes?.data?.applications || []);
        setNotifications(notifRes?.notifications || notifRes?.data?.notifications || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoadingRest(false);
      }
    })();
  }, []); // eslint-disable-line

  const loading = loadingProfile || loadingRest;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const unread      = notifications.filter((n) => !n.isRead).length;
  const filledCount = Object.values(completionSections).filter(Boolean).length;
  const totalCount  = Object.keys(completionSections).length;

  // ── normalise status for counting (handle legacy "accepted"/"pending") ──
  const normStatus = (s) => {
    if (!s) return "applied";
    const m = { accepted: "hired", pending: "applied" };
    return m[s.toLowerCase()] ?? s.toLowerCase();
  };

  const counts = {
    total:       applications.length,
    applied:     applications.filter((a) => normStatus(a.status) === "applied").length,
    underReview: applications.filter((a) => normStatus(a.status) === "under_review").length,
    shortlisted: applications.filter((a) => normStatus(a.status) === "shortlisted").length,
    hired:       applications.filter((a) => normStatus(a.status) === "hired").length,
    rejected:    applications.filter((a) => normStatus(a.status) === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back,{" "}
              <span className="text-blue-600">
                {profile?.username || user?.username || "there"}
              </span>{" "}
              👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {profile?.professionalTitle
                ? `${profile.professionalTitle}${profile.location ? " · " + profile.location : ""}`
                : "Complete your profile to start applying for jobs"}
            </p>
          </div>
          {completionPct === 100 && (
            <span className="inline-flex items-center gap-1.5 bg-green-50 border
                             border-green-200 text-green-700 text-xs font-semibold
                             px-3 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />Profile Complete
            </span>
          )}
        </div>

        {/* Incomplete alert */}
        {completionPct < 100 && (
          <div className="mb-6 flex items-start gap-3 bg-yellow-50 border
                          border-yellow-200 rounded-2xl px-5 py-4">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800">
                Your profile is {completionPct}% complete
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Complete your profile to unlock job applications.
              </p>
            </div>
            <Link to="/jobseeker/profile"
              className="text-xs font-semibold text-yellow-800 underline whitespace-nowrap">
              Complete now →
            </Link>
          </div>
        )}

        {/* ── Stat cards (5 cols) ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Applications" value={counts.total}
            icon={<Briefcase   className="h-5 w-5 text-blue-600"   />} bg="bg-blue-50"   />
          <StatCard label="Applied"      value={counts.applied}
            icon={<Clock       className="h-5 w-5 text-blue-600"   />} bg="bg-blue-50"   />
          <StatCard label="Shortlisted"  value={counts.shortlisted}
            icon={<Star        className="h-5 w-5 text-yellow-600" />} bg="bg-yellow-50" />
          <StatCard label="Hired"        value={counts.hired}
            icon={<CheckCircle className="h-5 w-5 text-green-600"  />} bg="bg-green-50"  />
          <StatCard label="Notifications" value={unread}
            icon={<Bell        className="h-5 w-5 text-purple-600" />} bg="bg-purple-50" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ══ LEFT ══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Skills */}
            <Card>
              <CardHeader title="Skills" />
              <CardBody>
                {profile?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, i) => (
                      <span key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs
                                   font-semibold rounded-full border border-blue-100
                                   hover:bg-blue-100 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No skills added yet" link="/jobseeker/profile" linkText="Add skills" />
                )}
              </CardBody>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader title="Work Experience" />
              <CardBody>
                {profile?.workExperience?.length > 0 ? (
                  <div className="space-y-5">
                    {profile.workExperience.map((exp, i) => (
                      <div key={i} className={`pb-5 ${i < profile.workExperience.length - 1 ? "border-b border-gray-100" : ""}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{exp.jobTitle}</p>
                            <p className="text-sm text-blue-600 font-medium mt-0.5">{exp.company}</p>
                            {exp.location && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" />{exp.location}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No work experience added yet" link="/jobseeker/profile" linkText="Add experience" />
                )}
              </CardBody>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader title="Education" />
              <CardBody>
                {profile?.education?.length > 0 ? (
                  <div className="space-y-5">
                    {profile.education.map((edu, i) => (
                      <div key={i} className={`flex items-start gap-3 pb-5 ${i < profile.education.length - 1 ? "border-b border-gray-100" : ""}`}>
                        <div className="bg-blue-50 p-2 rounded-xl flex-shrink-0">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                              </p>
                              <p className="text-sm text-blue-600 font-medium mt-0.5">{edu.institution}</p>
                              {edu.grade && <p className="text-xs text-gray-400 mt-0.5">Grade: {edu.grade}</p>}
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                              {edu.startDate} — {edu.endDate || "Present"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No education added yet" link="/jobseeker/profile" linkText="Add education" />
                )}
              </CardBody>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader
                title="Recent Applications"
                action={
                  <Link to="/jobseeker/applications"
                    className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                }
              />
              <CardBody>
                {applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app._id}
                        className="flex items-center justify-between py-2
                                   border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          {statusIcon(app.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {app.job?.title || "Job"}
                            </p>
                            <p className="text-xs text-gray-400">{app.job?.companyName || ""}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge(app.status)}`}>
                          {statusLabel(app.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No applications yet" link="/jobs" linkText="Browse jobs" />
                )}
              </CardBody>
            </Card>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="lg:col-span-1 space-y-6">

            {/* Profile Completion */}
            <Card>
              <CardHeader title="Profile Completion" />
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-blue-600 tabular-nums">{completionPct}%</span>
                  <span className="text-xs text-gray-400">{filledCount}/{totalCount} sections</span>
                </div>
                <ProgressBar pct={completionPct} />
                <div className="mt-5 space-y-3">
                  {Object.entries(completionSections).map(([label, done]) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${done ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-sm text-gray-700">{label}</span>
                        {sectionWeights?.[label] && (
                          <span className="text-xs text-gray-400">({sectionWeights[label]}%)</span>
                        )}
                      </div>
                      <span className={`text-xs font-bold ${done ? "text-green-600" : "text-red-400"}`}>
                        {done ? "✓ Done" : "Missing"}
                      </span>
                    </div>
                  ))}
                </div>
                {completionPct < 100 && (
                  <Link to="/jobseeker/profile"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2
                               bg-blue-600 hover:bg-blue-700 text-white text-sm
                               font-medium py-2.5 rounded-xl transition-colors">
                    <User className="h-4 w-4" />Complete Profile
                  </Link>
                )}
              </CardBody>
            </Card>

            {/* Resume */}
            <Card>
              <CardHeader title="Resume" />
              <CardBody>
                {profile?.resume ? (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">Resume uploaded</p>
                      <p className="text-xs text-green-600 mt-0.5">Ready to send with applications</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-800">No resume uploaded</p>
                        <p className="text-xs text-red-600 mt-0.5">Required to apply for jobs</p>
                      </div>
                    </div>
                    <Link to="/jobseeker/profile"
                      className="w-full inline-flex items-center justify-center gap-2
                                 bg-blue-600 hover:bg-blue-700 text-white text-sm
                                 font-medium py-2.5 rounded-xl transition-colors">
                      <FileText className="h-4 w-4" />Upload Resume
                    </Link>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader title={`Notifications${unread > 0 ? ` (${unread} new)` : ""}`} />
              <CardBody>
                {notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.slice(0, 5).map((n, i) => (
                      <div key={i}
                        className={`text-xs px-3 py-2.5 rounded-lg ${
                          n.isRead ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-800 font-medium"}`}>
                        {n.message}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-2">No notifications yet</p>
                )}
              </CardBody>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader title="Privacy Settings" />
              <CardBody>
                <div className="space-y-4">
                  {[
                    { label: "Profile Visibility", sub: "Visible to employers" },
                    { label: "Job Alerts",          sub: "Email notifications"  },
                  ].map(({ label, sub }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{label}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-6 bg-gray-200 rounded-full peer
                                        peer-checked:bg-blue-600
                                        after:content-[''] after:absolute after:top-[2px]
                                        after:left-[2px] after:bg-white after:border
                                        after:rounded-full after:h-5 after:w-5
                                        after:transition-all peer-checked:after:translate-x-4" />
                      </label>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;