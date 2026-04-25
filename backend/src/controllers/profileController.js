const User = require("../models/User");

const checkCompleted = (user) =>
  Boolean(
    user.username &&
    user.phone &&
    user.location &&
    user.professionalTitle &&
    user.professionalSummary &&
    user.skills?.length > 0 &&
    user.resume
  );

const buildProfile = (user) => ({
  id:                  user._id,
  username:            user.username,
  email:               user.email,
  phone:               user.phone,
  location:            user.location,
  professionalTitle:   user.professionalTitle,
  professionalSummary: user.professionalSummary,
  skills:              user.skills          || [],
  resume:              user.resume          || null,
  profileCompleted:    user.profileCompleted,
  role:                user.role,
  // ✅ THESE WERE MISSING — added back
  workExperience:      user.workExperience  || [],
  education:           user.education       || [],
  // employer fields
  companyName:         user.companyName     || "",
  website:             user.website         || "",
  industry:            user.industry        || "",
  companySize:         user.companySize     || "",
  founded:             user.founded         || "",
  description:         user.description     || "",
});

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, profile: buildProfile(user) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      username, phone, location,
      professionalTitle, professionalSummary,
      skills, workExperience, education,
      companyName, website, industry,
      companySize, founded, description,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username            !== undefined) user.username            = username;
    if (phone               !== undefined) user.phone               = phone;
    if (location            !== undefined) user.location            = location;
    if (professionalTitle   !== undefined) user.professionalTitle   = professionalTitle;
    if (professionalSummary !== undefined) user.professionalSummary = professionalSummary;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : String(skills).split(",").map((s) => s.trim()).filter(Boolean);
    }

    // ✅ always save arrays even if empty
    user.workExperience = Array.isArray(workExperience) ? workExperience : user.workExperience;
    user.education      = Array.isArray(education)      ? education      : user.education;

    if (companyName !== undefined) user.companyName = companyName;
    if (website     !== undefined) user.website     = website;
    if (industry    !== undefined) user.industry    = industry;
    if (companySize !== undefined) user.companySize = companySize;
    if (founded     !== undefined) user.founded     = founded;
    if (description !== undefined) user.description = description;

    user.profileCompleted = checkCompleted(user);
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: buildProfile(user),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Resume file is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const relativePath    = "/uploads/resumes/" + req.file.filename;
    user.resume           = relativePath;
    user.profileCompleted = checkCompleted(user);
    await user.save();

    res.json({
      success:          true,
      message:          "Resume uploaded successfully",
      resumePath:       relativePath,
      profileCompleted: user.profileCompleted,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload resume", error: err.message });
  }
};