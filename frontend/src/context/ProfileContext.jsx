import React, { createContext, useContext, useState, useCallback } from "react";
import { profileApi } from "../api/profileApi";

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile,        setProfile]        = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const res = await profileApi.getProfile();
      const p = res?.profile ?? res;
      setProfile({ ...p });
      return p;
    } catch (err) {
      console.error("fetchProfile error:", err);
      return null;
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const updateProfile = useCallback(async (formData) => {
    try {
      const res = await profileApi.updateProfile(formData);
      const p = res?.profile ?? res;
      if (p && typeof p === "object" && p.email) {
        setProfile({ ...p });
      } else {
        await fetchProfile();
      }
      return res;
    } catch (err) {
      console.error("updateProfile error:", err);
      throw err;
    }
  }, [fetchProfile]);

  const uploadResume = useCallback(async (fd) => {
    try {
      await profileApi.uploadResume(fd);
      await fetchProfile();
    } catch (err) {
      console.error("uploadResume error:", err);
      throw err;
    }
  }, [fetchProfile]);

  const jobSeekerCompletionSections = {
    "Basic Information": !!(
      profile?.username &&
      profile?.phone &&
      profile?.location &&
      profile?.professionalTitle
    ),
    Skills:     !!(profile?.skills?.length > 0),
    Experience: !!(profile?.workExperience?.length > 0),
    Education:  !!(profile?.education?.length > 0),
    Resume:     !!(profile?.resume),
  };

  const jobSeekerCompletionPct = Math.round(
    (Object.values(jobSeekerCompletionSections).filter(Boolean).length /
      Object.keys(jobSeekerCompletionSections).length) * 100
  );

  const employerCompletionSections = {
    "Company Name": !!(profile?.companyName),
    "Contact Info": !!(profile?.phone && profile?.location),
    "Website":      !!(profile?.website),
    "Industry":     !!(profile?.industry),
    "Description":  !!(profile?.description),
  };

  const employerCompletionPct = Math.round(
    (Object.values(employerCompletionSections).filter(Boolean).length /
      Object.keys(employerCompletionSections).length) * 100
  );

  const isEmployer        = profile?.role === "employer";
  const completionSections = isEmployer ? employerCompletionSections : jobSeekerCompletionSections;
  const completionPct      = isEmployer ? employerCompletionPct      : jobSeekerCompletionPct;

  return (
    <ProfileContext.Provider value={{
      profile, setProfile, loadingProfile,
      fetchProfile, updateProfile, uploadResume,
      completionSections, completionPct,
      jobSeekerCompletionSections, jobSeekerCompletionPct,
      employerCompletionSections,  employerCompletionPct,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};