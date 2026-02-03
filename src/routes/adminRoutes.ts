import { Router } from "express";
import { authadminMiddleware } from "../middlewares/authMiddleware";
import {
  adminforgotPassword,
  loginAdmin,
  adminsendOtp,
  adduserByAdmin,
  getAllAdmin,
  deleteAdmin,
} from "../controllers/adminauthController";
import {
  getAllCompanyProfile,
  postJobByAdmin,
  //updateCompanyProfileByAdmin,
  getCompanyProfileByAdmin,
  updateClientByAdmin,
  deleteClientByAdmin,
  getGlobalJobSeekerByAdmin,
  addUpdateCompanyBasicInfoByAdmin,
  addUpdateCompanyFoundingInfoByAdmin,
  deleteCompanySocialMediaLinksByAdmin,
  addCompanySocialMediaLinksByAdmin,
} from "../controllers/adminCompanyController";
import {
  getAllJobSeeker,
  updateUserByAdmin,
  getUserProfileByAdmin,
  updateUserProfileByAdmin,
  deleteUserByAdmin,
  addUserExperienceByAdmin,
  updateUserExperienceByAdmin,
  getUserExperienceByAdmin,
  deleteUserExperienceByAdmin,
  addUserEducationByAdmin,
  updateUserEducationByAdmin,
  getUserEducationByAdmin,
  deleteUserEducationByAdmin,
  addUserSkillsByAdmin,
  updateUserSkillsByAdmin,
  getUserSkillsByAdmin,
  deleteUserSkillsByAdmin,
  addSocialMediaLinksByAdmin,
  getSocialMediaLinksByAdmin,
  deleteSocialMediaLinksByAdmin,
  addCvUrlByAdmin,
  getCvUrlByAdmin,
} from "../controllers/adminJobSeekerController";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const admin = Router();

admin.post("/login", loginAdmin);
admin.get("/getAllCompanyProfile", authadminMiddleware, getAllCompanyProfile);
admin.get("/getAllJobSeeker", authadminMiddleware, getAllJobSeeker);
admin.post("/adminforgotPassword", adminforgotPassword);
admin.post("/adminsendOtp", adminsendOtp);
admin.post("/deleteClientByAdmin", authadminMiddleware, deleteClientByAdmin);
admin.post("/postJobByAdmin", authadminMiddleware, postJobByAdmin);
// admin.post(
//   "/updateCompanyProfileByAdmin",
//   authadminMiddleware,
//   upload.fields([
//     { name: "company_logo", maxCount: 1 },
//     { name: "company_banner", maxCount: 1 },
//   ]),
//   updateCompanyProfileByAdmin
// );
admin.get(
  "/getCompanyProfileByAdmin",
  authadminMiddleware,
  getCompanyProfileByAdmin
);
admin.post("/updateClientByAdmin", authadminMiddleware, updateClientByAdmin);
admin.post("/updateUserByAdmin", authadminMiddleware, updateUserByAdmin);
admin.get("/getUserProfileByAdmin", authadminMiddleware, getUserProfileByAdmin);
admin.post(
  "/adduserByAdmin",
  upload.fields([
    { name: "profile[company_logo]", maxCount: 1 },
    { name: "profile[company_banner]", maxCount: 1 },
  ]),
  authadminMiddleware,
  adduserByAdmin
);
admin.post(
  "/updateUserProfileByAdmin",
  authadminMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profile_pic", maxCount: 1 },
  ]),
  updateUserProfileByAdmin
);
admin.post("/deleteUserByAdmin", authadminMiddleware, deleteUserByAdmin);
admin.get("/getAllAdmin", authadminMiddleware, getAllAdmin);
admin.get(
  "/get-global-jobSeeker",
  authadminMiddleware,
  getGlobalJobSeekerByAdmin
);
admin.post("/deleteAdmin", authadminMiddleware, deleteAdmin);

admin.post(
  "/admin-job-seeker-add-experience",
  authadminMiddleware,
  addUserExperienceByAdmin
);
admin.put(
  "/admin-job-seeker-update-experience",
  authadminMiddleware,
  updateUserExperienceByAdmin
);
admin.get(
  "/admin-job-seeker-get-experience",
  authadminMiddleware,
  getUserExperienceByAdmin
);
admin.delete(
  "/admin-job-seeker-delete-experience",
  authadminMiddleware,
  deleteUserExperienceByAdmin
);

admin.post(
  "/admin-job-seeker-add-education",
  authadminMiddleware,
  addUserEducationByAdmin
);
admin.put(
  "/admin-job-seeker-update-education",
  authadminMiddleware,
  updateUserEducationByAdmin
);
admin.get(
  "/admin-job-seeker-get-education",
  authadminMiddleware,
  getUserEducationByAdmin
);
admin.delete(
  "/admin-job-seeker-delete-education",
  authadminMiddleware,
  deleteUserEducationByAdmin
);

admin.post(
  "/admin-job-seeker-add-skills",
  authadminMiddleware,
  addUserSkillsByAdmin
);
admin.put(
  "/admin-job-seeker-update-skills",
  authadminMiddleware,
  updateUserSkillsByAdmin
);
admin.get(
  "/admin-job-seeker-get-skills",
  authadminMiddleware,
  getUserSkillsByAdmin
);
admin.delete(
  "/admin-job-seeker-delete-skills",
  authadminMiddleware,
  deleteUserSkillsByAdmin
);

admin.post(
  "/admin-job-seeker-add-social-media",
  upload.none(),
  authadminMiddleware,

  addSocialMediaLinksByAdmin
);
admin.get(
  "/admin-job-seeker-get-social-media",
  authadminMiddleware,
  getSocialMediaLinksByAdmin
);
admin.delete(
  "/admin-job-seeker-delete-social-media",
  authadminMiddleware,
  deleteSocialMediaLinksByAdmin
);

admin.post(
  "/admin-job-seeker-add-resume",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  authadminMiddleware,
  addCvUrlByAdmin
);
admin.get("/admin-job-seeker-get-resume", authadminMiddleware, getCvUrlByAdmin);

admin.post(
  "/admin-add-company-basic-info",
  upload.fields([
    { name: "company_logo", maxCount: 1 },
    { name: "company_banner", maxCount: 1 },
  ]),
  authadminMiddleware,
  addUpdateCompanyBasicInfoByAdmin
);
admin.post(
  "/admin-add-company-founding-info",
  upload.none(),
  authadminMiddleware,
  addUpdateCompanyFoundingInfoByAdmin
);
admin.post(
  "/admin-add-company-social-media",
  upload.none(),
  authadminMiddleware,
  addCompanySocialMediaLinksByAdmin
);

admin.delete(
  "/admin-delete-company-social-media",
  authadminMiddleware,
  deleteCompanySocialMediaLinksByAdmin
);

export default admin;
