// src/context/ProfileContext.jsx
import React, { createContext, useState, useCallback } from "react";
import { profileApi } from "../api/profileApi";
import { calculateProfileCompletion } from "../utils/calculateProfileCompletion";

export const ProfileContext = createContext(null);

// ── employer completion (inline, no separate file needed) ─────────────────
function calcEmployer(profile) {
  const sections = {
    "Company Name": !!(profile?.companyName),
    "Contact Info": !!(profile?.phone && profile?.location),
    "Website":      !!(profile?.website),
    "Industry":     !!(profile?.industry),
    "Description":  !!(profile?.description),
  };
  const pct = Math.round(
    (Object.values(sections).filter(Boolean).length /
      Object.keys(sections).length) * 100
  );
  return { employerCompletionSections: sections, employerCompletionPct: pct };
}

export const ProfileProvider = ({ children }) => {
  const [profile,        setProfile]        = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // ── FETCH ────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const data = await profileApi.getProfile(); // axiosClient returns res.data
      const p    = data?.profile ?? data;
      setProfile(p && p.email ? { ...p } : null);
      return p ?? null;
    } catch (err) {
      console.error("fetchProfile error:", err);
      return null;
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // ── UPDATE ───────────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (formData) => {
    const payload = { ...formData };
    if (typeof payload.skills === "string") {
      payload.skills = payload.skills
        .split(",").map((s) => s.trim()).filter(Boolean);
    }
    try {
      const data = await profileApi.updateProfile(payload);
      const p    = data?.profile ?? data;
      if (p && p.email) {
        setProfile({ ...p });
      } else {
        await fetchProfile();
      }
      return data;
    } catch (err) {
      console.error("updateProfile error:", err);
      throw err;
    }
  }, [fetchProfile]);

  // ── UPLOAD RESUME ────────────────────────────────────────────────────────
  const uploadResume = useCallback(async (fd) => {
    try {
      const data = await profileApi.uploadResume(fd);
      if (data?.resumePath) {
        setProfile((prev) =>
          prev ? {
            ...prev,
            resume: data.resumePath,
            profileCompleted: data.profileCompleted ?? prev.profileCompleted,
          } : prev
        );
      } else {
        await fetchProfile();
      }
      return data;
    } catch (err) {
      console.error("uploadResume error:", err);
      throw err;
    }
  }, [fetchProfile]);

  // ── COMPLETION ───────────────────────────────────────────────────────────
  const { completionPct, completionSections, sectionWeights } =
    calculateProfileCompletion(profile);

  const { employerCompletionSections, employerCompletionPct } =
    calcEmployer(profile);

  return (
    <ProfileContext.Provider value={{
      profile, setProfile, loadingProfile,
      fetchProfile, updateProfile, uploadResume,
      // jobseeker
      completionPct, completionSections, sectionWeights,
      // employer
      employerCompletionSections, employerCompletionPct,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};