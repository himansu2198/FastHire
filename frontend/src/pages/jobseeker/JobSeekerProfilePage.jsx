// src/pages/jobseeker/ProfilePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useProfile } from "../../hooks/useProfile";
import {
  Upload, Check, AlertCircle, Save, User, Mail,
  Phone, MapPin, Briefcase, Edit, FileText, X,
  Plus, Trash2, GraduationCap, Building2, CheckCircle2,
} from "lucide-react";

// ── primitives ───────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 shadow-sm
                overflow-hidden hover:shadow-md transition-shadow
                duration-200 ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({ title }) => (
  <div className="px-6 pt-6 pb-4 border-b border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
  </div>
);
const CardBody = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

const inputCls =
  "w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 " +
  "border border-gray-300 rounded-lg text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
  "transition-colors duration-150";

const disabledCls =
  "w-full px-4 py-2.5 bg-gray-50 text-gray-500 border border-gray-200 " +
  "rounded-lg text-sm cursor-not-allowed";

const Label = ({ icon: Icon, text }) => (
  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
    {Icon && <Icon className="h-4 w-4 text-gray-400" />}
    {text}
  </label>
);

const emptyExp = () => ({
  jobTitle: "", company: "", location: "",
  startDate: "", endDate: "", current: false, description: "",
});
const emptyEdu = () => ({
  degree: "", institution: "", fieldOfStudy: "",
  startDate: "", endDate: "", grade: "",
});

// ── toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg
                  text-sm font-medium flex items-center gap-2 ${colors}
                  animate-slide-up`}
    >
      {type === "success"
        ? <CheckCircle2 className="h-4 w-4" />
        : <AlertCircle  className="h-4 w-4" />}
      {msg}
    </div>
  );
};

// ── animated progress bar ─────────────────────────────────────────────────────
const ProgressBar = ({ pct, color = "bg-blue-500" }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-1.5 rounded-full transition-all duration-700 ease-out ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
const JobSeekerProfilePage = () => {
  const {
    profile,
    loadingProfile,
    fetchProfile,
    updateProfile,
    uploadResume,
    completionSections,
    completionPct,
    sectionWeights,
  } = useProfile();

  const [saving,          setSaving]          = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isEditing,       setIsEditing]       = useState(false);
  const [toast,           setToast]           = useState(null); // { msg, type }

  const [formData, setFormData] = useState({
    username: "", phone: "", location: "",
    professionalTitle: "", professionalSummary: "", skills: "",
  });
  const [workExperience, setWorkExperience] = useState([]);
  const [education,      setEducation]      = useState([]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  // fetch on mount
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // sync form when profile loads/changes
  useEffect(() => {
    if (!profile) return;
    setFormData({
      username:            profile.username            || "",
      phone:               profile.phone               || "",
      location:            profile.location            || "",
      professionalTitle:   profile.professionalTitle   || "",
      professionalSummary: profile.professionalSummary || "",
      // display comma-separated; backend will re-split on save
      skills:              Array.isArray(profile.skills)
                             ? profile.skills.join(", ")
                             : (profile.skills || ""),
    });
    setWorkExperience(profile.workExperience || []);
    setEducation(profile.education           || []);
  }, [profile]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleExpChange = (i, field, val) =>
    setWorkExperience((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  const handleEduChange = (i, field, val) =>
    setEducation((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
     console.log("SENDING payload:", JSON.stringify({ workExperience, education }));
    try {
      // skills: pass as array — ProfileContext will handle string → array too
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        ...formData,
        skills: skillsArray,
        workExperience,
        education,
      });
      setIsEditing(false);
      showToast("Profile saved successfully!", "success");
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast("Failed to save profile. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setFormData({
      username:            profile.username            || "",
      phone:               profile.phone               || "",
      location:            profile.location            || "",
      professionalTitle:   profile.professionalTitle   || "",
      professionalSummary: profile.professionalSummary || "",
      skills:              Array.isArray(profile.skills)
                             ? profile.skills.join(", ")
                             : (profile.skills || ""),
    });
    setWorkExperience(profile.workExperience || []);
    setEducation(profile.education           || []);
    setIsEditing(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Only PDF files are allowed.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large. Max 5 MB.", "error");
      return;
    }
    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      await uploadResume(fd);
      showToast("Resume uploaded!", "success");
    } catch {
      showToast("Upload failed. Try again.", "error");
    } finally {
      setUploadingResume(false);
    }
  };

  const barColor = (pct) =>
    pct === 100 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-400";

  if (loadingProfile && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12
                          border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your personal information and resume
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-medium px-5 py-2.5 rounded-xl
                         shadow-sm transition-colors"
            >
              <Edit className="h-4 w-4" />Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`inline-flex items-center gap-2 text-white text-sm
                            font-medium px-5 py-2.5 rounded-xl shadow-sm
                            transition-colors ${
                              saving
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 border border-gray-300
                           text-gray-700 hover:bg-gray-50 text-sm font-medium
                           px-5 py-2.5 rounded-xl transition-colors"
              >
                <X className="h-4 w-4" />Cancel
              </button>
            </div>
          )}
        </div>

        {/* Incomplete alert */}
        {!profile?.profileCompleted && (
          <div className="mb-6 flex items-start gap-3 bg-yellow-50 border
                          border-yellow-200 rounded-2xl px-5 py-4">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Complete your profile to apply for jobs
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Fill all sections and upload your resume.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ══ LEFT ══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Information */}
            <Card>
              <CardHeader title="Basic Information" />
              <CardBody>
                {isEditing ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label icon={User}  text="Full Name *" />
                        <input
                          type="text" name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <Label icon={Mail} text="Email Address" />
                        <input
                          type="email" value={profile?.email || ""}
                          disabled className={disabledCls}
                        />
                      </div>
                      <div>
                        <Label icon={Phone} text="Phone Number *" />
                        <input
                          type="tel" name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 9876543210"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <Label icon={MapPin} text="Location *" />
                        <input
                          type="text" name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Bengaluru, India"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <Label icon={Briefcase} text="Professional Title *" />
                      <input
                        type="text" name="professionalTitle"
                        value={formData.professionalTitle}
                        onChange={handleChange}
                        placeholder="Frontend Developer"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <Label text="Professional Summary (Bio) *" />
                      <textarea
                        name="professionalSummary"
                        value={formData.professionalSummary}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your experience…"
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    <div>
                      <Label text="Skills * (comma-separated)" />
                      <input
                        type="text" name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, JavaScript, Node.js"
                        className={inputCls}
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Separate skills with commas
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { icon: User,   label: "Full Name",     value: profile?.username },
                        { icon: Mail,   label: "Email Address", value: profile?.email    },
                        { icon: Phone,  label: "Phone Number",  value: profile?.phone    },
                        { icon: MapPin, label: "Location",      value: profile?.location },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label}>
                          <p className="flex items-center gap-1.5 text-xs font-semibold
                                        text-gray-400 uppercase tracking-wide mb-1">
                            <Icon className="h-3.5 w-3.5" />{label}
                          </p>
                          <p className="text-gray-900 text-sm font-medium">
                            {value || "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold
                                    text-gray-400 uppercase tracking-wide mb-1">
                        <Briefcase className="h-3.5 w-3.5" />Professional Title
                      </p>
                      <p className="text-gray-900 text-sm font-medium">
                        {profile?.professionalTitle || "—"}
                      </p>
                    </div>
                    {profile?.professionalSummary && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400
                                      uppercase tracking-wide mb-1">Bio</p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {profile.professionalSummary}
                        </p>
                      </div>
                    )}
                    {profile?.skills?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400
                                      uppercase tracking-wide mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs
                                         font-semibold rounded-full border border-blue-100"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader title="Work Experience" />
              <CardBody>
                {isEditing ? (
                  <div className="space-y-5">
                    {workExperience.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-2">
                        No experience added.
                      </p>
                    )}
                    {workExperience.map((exp, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-xl p-4 space-y-4 relative"
                      >
                        <button
                          onClick={() =>
                            setWorkExperience((prev) =>
                              prev.filter((_, idx) => idx !== i))
                          }
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500
                                     transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label icon={Briefcase} text="Job Title *" />
                            <input
                              type="text" value={exp.jobTitle}
                              onChange={(e) =>
                                handleExpChange(i, "jobTitle", e.target.value)}
                              placeholder="Frontend Developer"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label icon={Building2} text="Company *" />
                            <input
                              type="text" value={exp.company}
                              onChange={(e) =>
                                handleExpChange(i, "company", e.target.value)}
                              placeholder="TechNova"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label icon={MapPin} text="Location" />
                            <input
                              type="text" value={exp.location}
                              onChange={(e) =>
                                handleExpChange(i, "location", e.target.value)}
                              placeholder="Bengaluru"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label text="Start Date" />
                            <input
                              type="month" value={exp.startDate}
                              onChange={(e) =>
                                handleExpChange(i, "startDate", e.target.value)}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label text="End Date" />
                            <input
                              type="month" value={exp.endDate}
                              onChange={(e) =>
                                handleExpChange(i, "endDate", e.target.value)}
                              disabled={exp.current}
                              className={exp.current ? disabledCls : inputCls}
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="checkbox" id={`cur-${i}`}
                              checked={exp.current}
                              onChange={(e) =>
                                handleExpChange(i, "current", e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            />
                            <label
                              htmlFor={`cur-${i}`}
                              className="text-sm text-gray-700"
                            >
                              Currently working here
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label text="Description" />
                          <textarea
                            value={exp.description}
                            onChange={(e) =>
                              handleExpChange(i, "description", e.target.value)}
                            rows={3}
                            placeholder="Describe your role…"
                            className={`${inputCls} resize-none`}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setWorkExperience((prev) => [...prev, emptyExp()])
                      }
                      className="w-full py-2.5 border-2 border-dashed border-gray-300
                                 text-gray-500 hover:border-blue-400 hover:text-blue-600
                                 rounded-xl text-sm font-medium flex items-center
                                 justify-center gap-2 transition-colors"
                    >
                      <Plus className="h-4 w-4" />Add Work Experience
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {!profile?.workExperience?.length ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No work experience added.
                      </p>
                    ) : (
                      profile.workExperience.map((exp, i) => (
                        <div
                          key={i}
                          className={`pb-5 ${
                            i < profile.workExperience.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {exp.jobTitle}
                              </p>
                              <p className="text-sm text-blue-600 font-medium mt-0.5">
                                {exp.company}
                              </p>
                              {exp.location && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {exp.location}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                              {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader title="Education" />
              <CardBody>
                {isEditing ? (
                  <div className="space-y-5">
                    {education.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-2">
                        No education added.
                      </p>
                    )}
                    {education.map((edu, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-xl p-4 space-y-4 relative"
                      >
                        <button
                          onClick={() =>
                            setEducation((prev) =>
                              prev.filter((_, idx) => idx !== i))
                          }
                          className="absolute top-3 right-3 text-gray-400
                                     hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label icon={GraduationCap} text="Degree *" />
                            <input
                              type="text" value={edu.degree}
                              onChange={(e) =>
                                handleEduChange(i, "degree", e.target.value)}
                              placeholder="B.Tech / B.Sc"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label icon={Building2} text="Institution *" />
                            <input
                              type="text" value={edu.institution}
                              onChange={(e) =>
                                handleEduChange(i, "institution", e.target.value)}
                              placeholder="IIT Bombay"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label text="Field of Study" />
                            <input
                              type="text" value={edu.fieldOfStudy}
                              onChange={(e) =>
                                handleEduChange(i, "fieldOfStudy", e.target.value)}
                              placeholder="Computer Science"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label text="Grade / CGPA" />
                            <input
                              type="text" value={edu.grade}
                              onChange={(e) =>
                                handleEduChange(i, "grade", e.target.value)}
                              placeholder="8.5 / 10"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label text="Start Date" />
                            <input
                              type="month" value={edu.startDate}
                              onChange={(e) =>
                                handleEduChange(i, "startDate", e.target.value)}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <Label text="End Date" />
                            <input
                              type="month" value={edu.endDate}
                              onChange={(e) =>
                                handleEduChange(i, "endDate", e.target.value)}
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEducation((prev) => [...prev, emptyEdu()])
                      }
                      className="w-full py-2.5 border-2 border-dashed border-gray-300
                                 text-gray-500 hover:border-blue-400 hover:text-blue-600
                                 rounded-xl text-sm font-medium flex items-center
                                 justify-center gap-2 transition-colors"
                    >
                      <Plus className="h-4 w-4" />Add Education
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {!profile?.education?.length ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No education added.
                      </p>
                    ) : (
                      profile.education.map((edu, i) => (
                        <div
                          key={i}
                          className={`pb-5 ${
                            i < profile.education.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {edu.degree}
                                {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                              </p>
                              <p className="text-sm text-blue-600 font-medium mt-0.5">
                                {edu.institution}
                              </p>
                              {edu.grade && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Grade: {edu.grade}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                              {edu.startDate} — {edu.endDate || "Present"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Sticky save bar when editing (mobile UX) */}
            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`flex-1 inline-flex items-center justify-center gap-2
                              py-3 rounded-xl text-sm font-semibold transition-colors
                              ${saving
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                              }`}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving…" : "Save All Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 inline-flex items-center justify-center gap-2
                             py-3 rounded-xl text-sm font-semibold border
                             border-gray-300 text-gray-700 hover:bg-gray-50
                             transition-colors"
                >
                  <X className="h-4 w-4" />Cancel
                </button>
              </div>
            )}
          </div>

          {/* ══ RIGHT ══ */}
          <div className="lg:col-span-1 space-y-6">

            {/* Resume */}
            <Card>
              <CardHeader title="Resume" />
              <CardBody>
                {profile?.resume ? (
                  <div className="flex items-start gap-2.5 bg-green-50 border
                                  border-green-200 rounded-xl px-4 py-3 mb-5">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Resume uploaded
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        Ready for applications
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 bg-red-50 border
                                  border-red-200 rounded-xl px-4 py-3 mb-5">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Resume required
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">
                        Upload to apply for jobs
                      </p>
                    </div>
                  </div>
                )}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl
                              flex flex-col items-center justify-center gap-3
                              px-4 py-8 hover:border-blue-400 hover:bg-blue-50/30
                              transition-colors"
                >
                  <FileText className="h-10 w-10 text-gray-300" />
                  <p className="text-sm text-gray-500 text-center">
                    Upload your resume<br />
                    <span className="text-xs text-gray-400">(PDF only, max 5 MB)</span>
                  </p>
                  <label className="cursor-pointer">
                    <span
                      className="inline-flex items-center justify-center gap-2
                                 bg-blue-600 hover:bg-blue-700 text-white text-sm
                                 font-medium px-5 py-2.5 rounded-xl shadow-sm
                                 transition-colors whitespace-nowrap"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingResume
                        ? "Uploading…"
                        : profile?.resume ? "Replace Resume" : "Upload Resume"}
                    </span>
                    <input
                      type="file" accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                </div>
              </CardBody>
            </Card>

            {/* Profile Completion (weighted bars) */}
            <Card>
              <CardHeader title="Profile Completion" />
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-blue-600 tabular-nums">
                    {completionPct}%
                  </span>
                </div>
                <ProgressBar
                  pct={completionPct}
                  color={barColor(completionPct)}
                />
                <div className="mt-5 space-y-4">
                  {Object.entries(completionSections).map(([label, done]) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">{label}</span>
                          {sectionWeights?.[label] && (
                            <span className="text-xs text-gray-400">
                              ({sectionWeights[label]}%)
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            done ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {done ? "✓" : "Missing"}
                        </span>
                      </div>
                      <ProgressBar
                        pct={done ? 100 : 0}
                        color={done ? "bg-green-500" : "bg-gray-200"}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-sm text-gray-500">Overall</span>
                  <span className="text-lg font-bold text-blue-600">
                    {completionPct}%
                  </span>
                </div>
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
                        <input
                          type="checkbox" defaultChecked className="sr-only peer"
                        />
                        <div
                          className="w-10 h-6 bg-gray-200 rounded-full peer
                                      peer-checked:bg-blue-600
                                      after:content-[''] after:absolute after:top-[2px]
                                      after:left-[2px] after:bg-white after:border
                                      after:rounded-full after:h-5 after:w-5
                                      after:transition-all peer-checked:after:translate-x-4"
                        />
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

export default JobSeekerProfilePage;