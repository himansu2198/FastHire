import React, { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import {
  Building2, Globe, MapPin, Phone, Mail,
  Users, Calendar, Save, Edit, X, AlertCircle, Check,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
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

const Label = ({ icon: Icon, text }) => (
  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
    {Icon && <Icon className="h-4 w-4 text-gray-400" />}
    {text}
  </label>
);

const EmployerProfilePage = () => {
  const {
    profile,
    loadingProfile,
    fetchProfile,
    updateProfile,
    employerCompletionSections,
    employerCompletionPct,
  } = useProfile();

  const [saving,    setSaving]    = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "", phone: "", location: "",
    website: "", industry: "", companySize: "",
    founded: "", description: "",
  });

  // fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // sync form when profile updates in context
  useEffect(() => {
    if (!profile) return;
    setFormData({
      companyName:  profile.companyName  || "",
      phone:        profile.phone        || "",
      location:     profile.location     || "",
      website:      profile.website      || "",
      industry:     profile.industry     || "",
      companySize:  profile.companySize  || "",
      founded:      profile.founded      || "",
      description:  profile.description  || "",
    });
  }, [profile]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // updateProfile saves AND re-fetches via context automatically
      await updateProfile(formData);
      setIsEditing(false);
      alert("Company profile updated!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setFormData({
      companyName:  profile.companyName  || "",
      phone:        profile.phone        || "",
      location:     profile.location     || "",
      website:      profile.website      || "",
      industry:     profile.industry     || "",
      companySize:  profile.companySize  || "",
      founded:      profile.founded      || "",
      description:  profile.description  || "",
    });
    setIsEditing(false);
  };

  if (loadingProfile && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2
                          border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const editFields = [
    { icon: Building2, label: "Company Name",  name: "companyName", type: "text",   placeholder: "TechNova Solutions" },
    { icon: Mail,      label: "Email",          name: "email",       type: "email",  disabled: true, value: profile?.email },
    { icon: Phone,     label: "Phone",          name: "phone",       type: "tel",    placeholder: "+91 9876543210" },
    { icon: Globe,     label: "Website",        name: "website",     type: "url",    placeholder: "https://company.com" },
    { icon: MapPin,    label: "Location",       name: "location",    type: "text",   placeholder: "Bengaluru, India" },
    { icon: Calendar,  label: "Founded Year",   name: "founded",     type: "number", placeholder: "2015" },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your company information</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-medium px-5 py-2.5 rounded-xl
                         shadow-sm transition-colors">
              <Edit className="h-4 w-4" />Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ══ LEFT ══ */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader title="Company Information" />
              <CardBody>
                {isEditing ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {editFields.map(({ icon, label, name, type,
                        placeholder, disabled, value }) => (
                        <div key={name}>
                          <Label icon={icon} text={label} />
                          <input
                            type={type}
                            name={name}
                            value={disabled ? (value || "") : formData[name]}
                            onChange={disabled ? undefined : handleChange}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={disabled
                              ? "w-full px-4 py-2.5 bg-gray-50 text-gray-500 " +
                                "border border-gray-200 rounded-lg text-sm cursor-not-allowed"
                              : inputCls}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label icon={Users} text="Company Size" />
                      <select name="companySize" value={formData.companySize}
                        onChange={handleChange} className={inputCls}>
                        <option value="">Select size</option>
                        {["1-10 employees", "11-50 employees", "51-200 employees",
                          "201-500 employees", "501-1000 employees", "1000+ employees"]
                          .map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label text="Industry" />
                      <input type="text" name="industry" value={formData.industry}
                        onChange={handleChange}
                        placeholder="Technology, Finance, Healthcare..."
                        className={inputCls} />
                    </div>

                    <div>
                      <Label text="Company Description" />
                      <textarea name="description" value={formData.description}
                        onChange={handleChange} rows={5}
                        placeholder="Tell job seekers about your company..."
                        className={`${inputCls} resize-none`} />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button onClick={handleSubmit} disabled={saving}
                        className={`flex-1 inline-flex items-center justify-center
                                    gap-2 py-2.5 rounded-xl text-sm font-semibold
                                    transition-colors ${saving
                                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"}`}>
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button onClick={handleCancel}
                        className="flex-1 inline-flex items-center justify-center
                                   gap-2 py-2.5 rounded-xl text-sm font-semibold
                                   border border-gray-300 text-gray-700
                                   hover:bg-gray-50 transition-colors">
                        <X className="h-4 w-4" />Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { icon: Building2, label: "Company Name", value: profile?.companyName },
                        { icon: Mail,      label: "Email",         value: profile?.email       },
                        { icon: Phone,     label: "Phone",         value: profile?.phone       },
                        { icon: Globe,     label: "Website",       value: profile?.website     },
                        { icon: MapPin,    label: "Location",      value: profile?.location    },
                        { icon: Calendar,  label: "Founded",       value: profile?.founded     },
                        { icon: Users,     label: "Company Size",  value: profile?.companySize },
                        { icon: null,      label: "Industry",      value: profile?.industry    },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label}>
                          <p className="flex items-center gap-1.5 text-xs font-semibold
                                        text-gray-400 uppercase tracking-wide mb-1">
                            {Icon && <Icon className="h-3.5 w-3.5" />}{label}
                          </p>
                          <p className="text-gray-900 text-sm font-medium">
                            {value || "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                    {profile?.description && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400
                                      uppercase tracking-wide mb-1">
                          Description
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {profile.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="lg:col-span-1 space-y-6">

            {/* Company Logo */}
            <Card>
              <CardHeader title="Company Logo" />
              <CardBody className="flex flex-col items-center">
                <div className="h-24 w-24 bg-blue-50 rounded-2xl flex items-center
                                justify-center border border-blue-100 mb-4">
                  <Building2 className="h-10 w-10 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Logo upload coming soon
                </p>
              </CardBody>
            </Card>

            {/* Profile Completion — live from context */}
            <Card>
              <CardHeader title="Profile Completion" />
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {employerCompletionPct}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${employerCompletionPct}%` }}
                  />
                </div>
                <div className="space-y-3">
                  {Object.entries(employerCompletionSections).map(([label, done]) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          done ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      {done
                        ? <Check className="h-4 w-4 text-green-500" />
                        : <AlertCircle className="h-4 w-4 text-red-400" />}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">
                  A complete profile attracts more applicants.
                </p>
              </CardBody>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfilePage;