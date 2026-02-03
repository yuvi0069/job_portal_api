import { Router } from "express";
import {
  addUserDetails,
  getUser,
  updateUser,
  deleteUser,
  getNotification,
  updateNotification,
  getFavJobAndAppliedJobCount,
  addUserExperience,
  getUserExperience,
  updateUserExperience,
  deleteUserExperience,
  deleteUserEducation,
  getUserEducation,
  updateUserEducation,
  addUserEducation,
  addUserSkills,
  updateUserSkills,
  getUserSkills,
  deleteUserSkills,
  addSocialMediaLinks,
  getSocialMediaLinks,
  deleteSocialMediaLinks,
  addCvUrl,
  getCvUrl,
  addSocialMediaLinksForMobile,
  addUserBasicDetails,
  addUserBasicRoleEduExpDetails,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const userRoutes = Router();

userRoutes.put("/updateUser", authMiddleware, updateUser);
userRoutes.get("/getUser", authMiddleware, getUser);
userRoutes.post(
  "/user-basic-details",
  authMiddleware,
  upload.fields([{ name: "profile_pic", maxCount: 1 }]),
  addUserBasicDetails
);
userRoutes.post(
  "/user-basic-edu-exp-role-details",
  authMiddleware,
  addUserBasicRoleEduExpDetails
);
userRoutes.post(
  "/details",
  authMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profile_pic", maxCount: 1 },
  ]),
  addUserDetails
);
userRoutes.delete("/deleteUser", authMiddleware, deleteUser);
userRoutes.get("/notification", authMiddleware, getNotification);
userRoutes.put("/notification", authMiddleware, updateNotification);
userRoutes.get(
  "/get-fav-job-candidates-count",
  authMiddleware,
  getFavJobAndAppliedJobCount
);
userRoutes.post("/add-experience", authMiddleware, addUserExperience);
userRoutes.put("/update-experience", authMiddleware, updateUserExperience);
userRoutes.get("/get-experience", authMiddleware, getUserExperience);
userRoutes.delete("/delete-experience", authMiddleware, deleteUserExperience);

userRoutes.post("/add-education", authMiddleware, addUserEducation);
userRoutes.put("/update-education", authMiddleware, updateUserEducation);
userRoutes.get("/get-education", authMiddleware, getUserEducation);
userRoutes.delete("/delete-education", authMiddleware, deleteUserEducation);

userRoutes.post("/add-skills", authMiddleware, addUserSkills);
userRoutes.put("/update-skills", authMiddleware, updateUserSkills);
userRoutes.get("/get-skills", authMiddleware, getUserSkills);
userRoutes.delete("/delete-skills", authMiddleware, deleteUserSkills);

userRoutes.post(
  "/add-social-media",
  upload.none(),
  authMiddleware,
  addSocialMediaLinks
);
userRoutes.post(
  "/add-social-media-mobile",
  authMiddleware,
  addSocialMediaLinksForMobile
);
userRoutes.get("/get-social-media", authMiddleware, getSocialMediaLinks);
userRoutes.delete(
  "/delete-social-media",
  authMiddleware,
  deleteSocialMediaLinks
);

userRoutes.post(
  "/add-resume",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  authMiddleware,
  addCvUrl
);
userRoutes.get("/get-resume", authMiddleware, getCvUrl);

export default userRoutes;
