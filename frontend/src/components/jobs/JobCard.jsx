import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Clock, Users, ArrowRight } from "lucide-react";

const getJobTypeBadge = (type) => {
  const types = {
    "full-time":  { label: "Full Time",  cls: "bg-green-100 text-green-700"  },
    "part-time":  { label: "Part Time",  cls: "bg-blue-100 text-blue-700"    },
    "internship": { label: "Internship", cls: "bg-amber-100 text-amber-700"  },
  };
  return types[type] || { label: type, cls: "bg-gray-100 text-gray-700" };
};

const timeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const diff = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Posted today";
  if (diff === 1) return "Posted yesterday";
  if (diff < 7)  return `Posted ${diff} days ago`;
  if (diff < 30) return `Posted ${Math.floor(diff / 7)} week${Math.floor(diff / 7) > 1 ? 's' : ''} ago`;
  return `Posted ${Math.floor(diff / 30)} month${Math.floor(diff / 30) > 1 ? 's' : ''} ago`;
};

const JobCard = ({ job }) => {
  const badge = getJobTypeBadge(job.jobType);

  const salary = job.salary
    || (job.salaryRange?.min && job.salaryRange?.max
        ? `₹${job.salaryRange.min} – ₹${job.salaryRange.max}`
        : null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm
                    hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">

      {/* ── TOP ── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600
                         transition-colors duration-200">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.companyName}</p>

          {/* Category + Role tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {job.category && (
              <span className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-md font-medium">
                {job.category}
              </span>
            )}
            {job.role && (
              <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-md font-medium">
                {job.role}
              </span>
            )}
          </div>
        </div>

        {/* Job type badge */}
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      {/* ── MIDDLE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {job.location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}
        {salary && (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span className="truncate">{salary}</span>
          </div>
        )}
        {job.experienceRequired && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">{job.experienceRequired}</span>
          </div>
        )}
      </div>

      {/* Description snippet */}
      {job.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>
      )}

      {/* ── BOTTOM ── */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo(job.createdAt)}
          </span>
          {job.applicationsCount !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {job.applicationsCount} applicants
            </span>
          )}
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600
                     hover:text-blue-700 hover:gap-2.5 transition-all duration-200"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;

