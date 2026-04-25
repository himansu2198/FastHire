import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import { applicationApi } from "../../api/applicationApi";
import { profileApi } from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";
import {
  AlertCircle, CheckCircle, MapPin, DollarSign,
  Briefcase, Clock, Users, Globe, ExternalLink,
  ArrowLeft, LogIn,
} from "lucide-react";

const timeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const diff = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff} days ago`;
  return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const DetailChip = ({ icon, label, value, highlight }) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
    <div className={`p-2 rounded-lg shrink-0 ${highlight ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 border border-gray-200'}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>{value}</p>
    </div>
  </div>
);

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isJobSeeker, user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await jobApi.getJobById(id);
        setJob(jobRes?.job || jobRes?.data?.job);
        if (isJobSeeker) {
          const profileRes = await profileApi.getProfile();
          setProfile(profileRes?.profile);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isJobSeeker]);

  // ── APPLY LOGIC UNCHANGED ──
  const handleApply = async () => {
    if (!isAuthenticated) { alert("Please login to apply for this job"); navigate("/login"); return; }
    if (!isJobSeeker) { alert("Only job seekers can apply for jobs"); return; }
    if (!profile?.profileCompleted) {
      alert("Please complete your profile and upload your resume before applying");
      navigate("/jobseeker/profile"); return;
    }
    if (!profile?.resume) {
      alert("Please upload your resume in your profile before applying");
      navigate("/jobseeker/profile"); return;
    }
    setApplying(true);
    try {
      await applicationApi.applyJob(id);
      setApplied(true);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);
      if (error.response?.status === 401) navigate("/login");
      else if (error.response?.status === 400) {
        const msg = error.response?.data?.message;
        if (msg?.includes("profile") || msg?.includes("resume")) {
          alert(msg); navigate("/jobseeker/profile");
        }
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mb-4">Job not found</p>
          <button onClick={() => navigate("/jobs")}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg
                       hover:bg-blue-700 active:scale-95 transition-all duration-200">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const salary = job.salary
    || (job.salaryRange?.min && job.salaryRange?.max
        ? `₹${job.salaryRange.min} – ₹${job.salaryRange.max}`
        : null);

  const profileReady = profile?.profileCompleted && profile?.resume;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-5">

        {/* Back */}
        <button onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700
                     transition-colors duration-200 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Jobs
        </button>

        {/* ── SECTION 1: Job Header ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
              <p className="text-gray-500 font-medium">{job.companyName}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {job.jobType && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full capitalize">
                    {job.jobType.replace("-", " ")}
                  </span>
                )}
                {job.category && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                    {job.category}
                  </span>
                )}
                {job.role && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                    {job.role}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 shrink-0">
              <Users className="h-4 w-4" />
              <span>{job.applicationsCount || 0} applicants</span>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Job Details Grid ── */}
        {(job.location || salary || job.jobType || job.createdAt || job.experienceRequired) && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {job.location && (
                <DetailChip icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location} />
              )}
              {salary && (
                <DetailChip icon={<DollarSign className="h-4 w-4" />} label="Salary" value={salary} highlight />
              )}
              {job.jobType && (
                <DetailChip icon={<Briefcase className="h-4 w-4" />} label="Job Type"
                  value={job.jobType.replace("-", " ")} />
              )}
              {job.createdAt && (
                <DetailChip icon={<Clock className="h-4 w-4" />} label="Posted"
                  value={timeAgo(job.createdAt)} />
              )}
              {job.experienceRequired && (
                <DetailChip icon={<Briefcase className="h-4 w-4" />} label="Experience"
                  value={job.experienceRequired} />
              )}
            </div>
          </div>
        )}

        {/* ── SECTION 3: Job Description ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Job Description</h2>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* ── SECTION 4: Company Links ── */}
        {(job.companyWebsite || job.careerPageLink) && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Company Links</h2>
            <div className="flex flex-wrap gap-3">
              {job.companyWebsite && (
                <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200
                             rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50
                             hover:border-gray-300 hover:scale-105 active:scale-95
                             transition-all duration-200">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Company Website
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                </a>
              )}
              {job.careerPageLink && (
                <a href={job.careerPageLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200
                             rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50
                             hover:border-gray-300 hover:scale-105 active:scale-95
                             transition-all duration-200">
                  <Briefcase className="h-4 w-4 text-purple-500" />
                  Career Page
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* ── SECTION 5: Apply ── */}

        {/* Job Seeker apply section */}
        {isJobSeeker && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Apply for this position</h2>

            {profileReady ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Profile is complete and ready!</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Your resume will be automatically submitted with your application.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Complete your profile to apply</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {!profile?.resume ? "Please upload your resume in your profile." : "Please complete all required profile fields."}
                  </p>
                </div>
              </div>
            )}

            <button onClick={handleApply}
              disabled={applied || applying || !profileReady}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200
                ${applied
                  ? "bg-green-100 text-green-700 cursor-default"
                  : applying
                  ? "bg-gray-100 text-gray-500 cursor-wait"
                  : !profileReady
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95"
                }`}>
              {applying ? "Submitting…"
                : applied ? "✓ Application Submitted"
                : !profileReady ? "Complete Profile to Apply"
                : "Apply Now"}
            </button>

            {!profileReady && !applied && (
              <p className="text-center text-xs text-gray-400 mt-3">
                <button onClick={() => navigate("/jobseeker/profile")}
                  className="text-blue-600 hover:underline font-medium">
                  Go to Profile
                </button>
                {" "}to add your details and resume
              </p>
            )}
          </div>
        )}

        {/* Employer warning */}
        {user && !isJobSeeker && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              You're logged in as an employer. Only job seekers can apply for jobs.
            </p>
          </div>
        )}

        {/* Guest login prompt */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <LogIn className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-blue-900 mb-1">Want to apply for this job?</p>
            <p className="text-xs text-blue-700 mb-4">Log in as a job seeker to submit your application.</p>
            <button onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg
                         hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm">
              Login to Apply
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobDetailPage;



