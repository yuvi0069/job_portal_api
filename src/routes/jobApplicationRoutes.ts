import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  applyJob,
  postJobToFavourite,
  deleteJobFavourite,
  updateApplicationStatus,
  getJobToFavourite,
  getJobApplicationByJobId,
  getJobyApplicationByJobSeekerUuid,
  getJobAlertByJobSeekerRole,
  getJobByJobIdForUser,
  getAllPostJobsForUser,
  getAllPostJobs,
} from "../controllers/jobApplicationController";
const jobRoutes = Router();
jobRoutes.post("/applyJob", authMiddleware, applyJob);
jobRoutes.get(
  "/getJobyApplicationByJobSeekerUuid",
  authMiddleware,
  getJobyApplicationByJobSeekerUuid
);
jobRoutes.get(
  "/getJobAlertByJobSeekerRole",
  authMiddleware,
  getJobAlertByJobSeekerRole
);
jobRoutes.post("/postJobToFavourite", authMiddleware, postJobToFavourite);
jobRoutes.get("/getJobToFavourite", authMiddleware, getJobToFavourite);
jobRoutes.post("/deleteJobFavourite", authMiddleware, deleteJobFavourite);
jobRoutes.get(
  "/getJobApplicationByJobId",
  authMiddleware,
  getJobApplicationByJobId
);
jobRoutes.put(
  "/updateApplicationStatus",
  authMiddleware,
  updateApplicationStatus
);
jobRoutes.get("/getJobByJobIdForUser", authMiddleware, getJobByJobIdForUser);
jobRoutes.get("/getAllPostJobsForUser", authMiddleware, getAllPostJobsForUser);
jobRoutes.get("/getAllPostJobs", getAllPostJobs);
export default jobRoutes;
