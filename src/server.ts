import "reflect-metadata";
import dotenv from "dotenv";
import compression from "compression";
dotenv.config();
//
import cron from "node-cron";
import express from "express";
import authRoutes from "./routes/authRoutes";
import { AppDataSource } from "./config/database";
import userRoutes from "./routes/userRoutes";
import companyRoutes from "./routes/companyRoutes";
import cors from "cors";
import jobRoutes from "./routes/jobApplicationRoutes";
import admin from "./routes/adminRoutes";
import { Postjobs } from "./entities/postjobs";
import { ClientUsers } from "./entities/clientUsers";

const app = express();
const PORT = process.env.PORT || 5020;

app.use(express.json());
app.use(cors());
app.use(compression());
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    setInterval(() => {
      AppDataSource.manager.query("SELECT 1");
    }, 1200000);
    cron.schedule(
      "0 1 * * *",
      async () => {
        console.log("Running cron job: Deleting old records...");
        try {
          await AppDataSource.manager.query(`
            DELETE FROM company_notification
            WHERE created_at < NOW() - INTERVAL '15 days';
          `);
          await AppDataSource.manager.query(`
            DELETE FROM user_notification
            WHERE created_at < NOW() - INTERVAL '15 days';
          `);
          console.log("Old records deleted successfully.");
          let date = new Date();
          const postJobsRepository = AppDataSource.getRepository(Postjobs);
          const jobs = await postJobsRepository.find();
          jobs.forEach((element) => {
            const job_remaining = Math.floor(
              (new Date(element.expirationDate).getTime() -
                new Date(date).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            if (job_remaining) {
              if (job_remaining <= 0) {
                element.status = "Expired";
                element.job_valid_days = 0;
              } else {
                element.job_valid_days = job_remaining;
              }
            }
          });
          const clientUserRepository = AppDataSource.getRepository(ClientUsers);
          await postJobsRepository.save(jobs);
          const activeUsers = await clientUserRepository.find({
            where: { purchase_plan_status: "ACTIVE" },
          });

          activeUsers.forEach((user: any) => {
            if (user.purchase_plan_remaining_days > 0) {
              user.purchase_plan_remaining_days -= 1;
              if (user.purchase_plan_remaining_days <= 0) {
                user.purchase_plan_remaining_days = 0;
                user.purchase_plan_status = "INACTIVE";
              }
            }
          });

          await clientUserRepository.save(activeUsers);
          console.log("Client user plans updated.");
        } catch (error) {
          console.error("Error deleting old records:", error);
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );
  })
  .catch((error) => console.log("Database connection error:", error));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobRoutes", jobRoutes);
app.use("/api/admin", admin);

app.get("/health", async (req, res): Promise<void> => {
  try {
    await AppDataSource.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      message: "Server and Database are healthy",
      port: PORT,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      port: PORT,
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
