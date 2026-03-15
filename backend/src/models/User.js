const mongoose = require("mongoose");

const workExperienceSchema = new mongoose.Schema({
  jobTitle:    { type: String, default: "" },
  company:     { type: String, default: "" },
  location:    { type: String, default: "" },
  startDate:   { type: String, default: "" },
  endDate:     { type: String, default: "" },
  current:     { type: Boolean, default: false },
  description: { type: String, default: "" },
});

const educationSchema = new mongoose.Schema({
  degree:       { type: String, default: "" },
  institution:  { type: String, default: "" },
  fieldOfStudy: { type: String, default: "" },
  startDate:    { type: String, default: "" },
  endDate:      { type: String, default: "" },
  grade:        { type: String, default: "" },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["jobseeker", "employer"], required: true },

    // ── Job Seeker fields ──
    phone:               { type: String, default: "" },
    location:            { type: String, default: "" },
    professionalTitle:   { type: String, default: "" },
    professionalSummary: { type: String, default: "" },
    skills:              { type: [String], default: [] },
    resume:              { type: String, default: null },
    profileCompleted:    { type: Boolean, default: false },
    workExperience:      { type: [workExperienceSchema], default: [] },
    education:           { type: [educationSchema], default: [] },

    // ── Employer fields ──
    companyName:  { type: String, default: "" },
    website:      { type: String, default: "" },
    industry:     { type: String, default: "" },
    companySize:  { type: String, default: "" },
    founded:      { type: String, default: "" },
    description:  { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


