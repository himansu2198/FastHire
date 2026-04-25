// src/api/profileApi.js
// axiosClient interceptor already returns res.data — no .then(res=>res.data) needed
import axiosClient from "./axiosClient";

export const profileApi = {
  getProfile: () =>
    axiosClient.get("/profile"),

  updateProfile: (profileData) =>
    axiosClient.put("/profile", profileData),

  uploadResume: (formData) =>
    axiosClient.post("/profile/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};