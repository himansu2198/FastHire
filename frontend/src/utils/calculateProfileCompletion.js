// src/utils/calculateProfileCompletion.js
// Basic Info 20 · Phone 10 · Skills 15 · Experience 15 · Education 10 · Resume 20 · Bio 10 = 100

const SECTIONS = [
  { key: "Basic Info", weight: 20, check: (p) => !!(p?.username && p?.email && p?.location && p?.professionalTitle) },
  { key: "Phone",      weight: 10, check: (p) => !!(p?.phone) },
  { key: "Skills",     weight: 15, check: (p) => Array.isArray(p?.skills) && p.skills.length > 0 },
  { key: "Experience", weight: 15, check: (p) => Array.isArray(p?.workExperience) && p.workExperience.length > 0 },
  { key: "Education",  weight: 10, check: (p) => Array.isArray(p?.education) && p.education.length > 0 },
  { key: "Resume",     weight: 20, check: (p) => !!(p?.resume) },
  { key: "Bio",        weight: 10, check: (p) => !!(p?.professionalSummary) },
];

export function calculateProfileCompletion(profile) {
  let total = 0;
  const completionSections = {};
  const sectionWeights     = {};

  for (const { key, weight, check } of SECTIONS) {
    const done = check(profile);
    completionSections[key] = done;
    sectionWeights[key]     = weight;
    if (done) total += weight;
  }

  return { completionPct: total, completionSections, sectionWeights };
}