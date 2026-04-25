// src/hooks/useProfile.js
import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
};