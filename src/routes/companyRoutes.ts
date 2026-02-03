import { Router } from "express";
import {
  createJobPost,
  getCompanyProfile,
  getGlobalCompanyProfile,
  getJobByJobId,
  //uploadCompanyProfile,
  getJobByCompanyId,
  updateJobStatus,
  getNotification,
  updateNotification,
  getTrendingCompany,
  getFilterCandidates,
  getsavedcandidates,
  addSavedCandidates,
  deleteSavedCandidates,
  createOrder,
  verifyPayment,
  getGlobalJobSeeker,
  getPostJobCount,
  getSavedCandidatesCount,
  updateClient,
  updateClientPassword,
  addUpdateCompanyFoundingInfo,
  addUpdateCompanyBasicInfo,
  addSocialMediaLinks,
  deleteSocialMediaLinks,
  getSkills,
} from "../controllers/companyController";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const companyRoutes = Router();

// companyRoutes.post(
//   "/uploadCompanyProfile",
//   authMiddleware,
//   upload.fields([
//     { name: "company_logo", maxCount: 1 },
//     { name: "company_banner", maxCount: 1 },
//   ]),
//   uploadCompanyProfile
// );
companyRoutes.post("/createJobPost", authMiddleware, createJobPost);
companyRoutes.get("/getCompanyProfile", authMiddleware, getCompanyProfile);
companyRoutes.get("/getsavedcandidates", authMiddleware, getsavedcandidates);
companyRoutes.get("/getJobByCompanyId", authMiddleware, getJobByCompanyId);
companyRoutes.post("/updateJobStatus", authMiddleware, updateJobStatus);
companyRoutes.post("/addSavedCandidates", authMiddleware, addSavedCandidates);
companyRoutes.get("/getJobByJobId", getJobByJobId);
companyRoutes.post("/getGlobalCompanyProfile", getGlobalCompanyProfile);
companyRoutes.get("/notification", authMiddleware, getNotification);
companyRoutes.put("/notification", authMiddleware, updateNotification);
companyRoutes.get("/getTrendingCompany", getTrendingCompany);
companyRoutes.get("/getFilterCandidates", authMiddleware, getFilterCandidates);
companyRoutes.delete(
  "/delete-saved-candidates",
  authMiddleware,
  deleteSavedCandidates
);
companyRoutes.get("/get-global-user", authMiddleware, getGlobalJobSeeker);
companyRoutes.post("/create-order", authMiddleware, createOrder);
companyRoutes.get("/get-post-job-count", authMiddleware, getPostJobCount);
companyRoutes.post("/verify-payment", authMiddleware, verifyPayment);
companyRoutes.get(
  "/get-sav-applied-job-count",
  authMiddleware,
  getSavedCandidatesCount
);
companyRoutes.post("/client/updateClient", authMiddleware, updateClient);
companyRoutes.post(
  "/client/updateClientPassword",
  authMiddleware,
  updateClientPassword
);
companyRoutes.post(
  "/add-company-basic-info",
  upload.fields([
    { name: "company_logo", maxCount: 1 },
    { name: "company_banner", maxCount: 1 },
  ]),
  authMiddleware,
  addUpdateCompanyBasicInfo
);
companyRoutes.post(
  "/add-company-founding-info",
  upload.none(),
  authMiddleware,
  addUpdateCompanyFoundingInfo
);
companyRoutes.post(
  "/add-company-social-media",
  upload.none(),
  authMiddleware,
  addSocialMediaLinks
);

companyRoutes.delete(
  "/delete-company-social-media",
  authMiddleware,
  deleteSocialMediaLinks
);

companyRoutes.get("/get-post-job-skills", authMiddleware, getSkills);
export default companyRoutes;
