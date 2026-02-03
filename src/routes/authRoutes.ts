import { Router } from "express";
import {
  registerUser,
  sendResetPasswordEmail,
  loginUser,
  clientRegister,
  clientLogin,
  forgotPassword,
  sendOtp,
  deleteClient,
  emailSender,
  deleteUserPin,
  setUserPin,
  updateUserPin,
  emailVerification,
  verifyEmail,
  sendRegisterTimeOTP,
  sendLoginTimeOTP,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "API is working successfully" });
});

// Client
router.post("/emailSender", emailSender);
router.post("/client/register", clientRegister);
router.post("/client/login", clientLogin);
//router.post("/client/updateClient", authMiddleware, updateClient);
router.post("/client/deleteClient", authMiddleware, deleteClient);
router.post("/client/forgotPassword", forgotPassword);
router.post("/client/sendOtpToReset", sendResetPasswordEmail);
// User
router.post("/user/sendotp", sendOtp);
router.post("/user/sendotp-register", sendRegisterTimeOTP);
router.post("/user/sendotp-login", sendLoginTimeOTP);
router.post("/user/login", loginUser);
router.post("/user/register", registerUser);
router.delete("/user/pin", authMiddleware, deleteUserPin);
router.post("/user/pin", authMiddleware, setUserPin);
router.put("/user/pin", authMiddleware, updateUserPin);
router.put(
  "/user/send-email-for-verification",
  authMiddleware,
  emailVerification
);
router.post("/user/verify-email", verifyEmail);

export default router;
