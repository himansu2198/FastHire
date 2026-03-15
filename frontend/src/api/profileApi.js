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