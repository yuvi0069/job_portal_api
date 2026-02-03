import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Users } from "../entities/user";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { validate } from "class-validator";
import { generateEmailtoken, generateToken } from "../utils/generateToken";
import { ClientUsers } from "../entities/clientUsers";
import { CompanyProfiles } from "../entities/companyProfiles";
import { UserDetails } from "../entities/userDetails";
import * as jwt from "jsonwebtoken";
import twilio from "twilio";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const client = twilio(
  process.env.twilioAccountsid,
  process.env.twilioauthtoken
);
import {
  otpSendEmail,
  otpSendResetPasswordEmail,
  sendEmailForVerification,
  sendEnquiryEmail,
} from "../email";
import { Postjobs } from "../entities/postjobs";

import { JwtPayloadWithUser } from "../types/JwtPayloadWithUser";
import { CompanyPlanTypes } from "../entities/companyPlanTypes";

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { mobile_number, action, email, country_code, name } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(Users);
    let user, user_email;

    if (mobile_number) {
      user = await userRepository.findOneBy({ mobile_number });
    }

    if (action === "Register") {
      let shortName;
      const firstWord = name.trim().split(" ")[0];
      shortName =
        firstWord.length > 7 ? firstWord.substring(0, 7) + "..." : firstWord;

      if (user && user.otp_verified) {
        if (user && user.deactivated === 1) {
          res.status(401).json({
            status: false,
            message:
              "Account deactivated please contact support email yuvraj.sy@intacting.in to activate your account",
          });

          return;
        }

        res
          .status(400)
          .json({ status: false, message: "User already present" });
        return;
      }

      if (user?.uuid !== undefined && !user.otp_verified) {
        // if (user_email) {
        //   if (user.uuid !== user_email?.uuid) {
        //     res
        //       .status(400)
        //       .json({ status: false, message: "User already present" });
        //     return;
        //   }
        // }
        // if (user_email?.uuid !== undefined && !user_email.otp_verified) {
        //   if (user) {
        //     if (user.uuid !== user_email?.uuid) {
        //       res
        //         .status(400)
        //         .json({ status: false, message: "User already present" });
        //       return;
        //     }
        //   }
        // }

        const otp = Math.floor(100000 + Math.random() * 900000);

        // const otp_send = await otpSendEmail(email, user.first_name, otp);
        // const message = await client.messages.create({
        //   body: `Your OTP for account verification is ${otp}. Please do not share this code with anyone.`,
        //   messagingServiceSid: process.env.twiliomessageId,
        //   to: `${country_code}${user.mobile_number}`,
        // });
        await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          new URLSearchParams({
            sender_id: String(process.env.SMS_SENDER_ID),
            message: String(process.env.REGISTER_SMS_ID),
            variables_values: `${shortName}|${otp}`,
            route: "dlt",
            numbers: mobile_number,
          }),
          {
            headers: {
              authorization: process.env.SMS_API_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        user.otp = otp;
        await userRepository.save(user);
        console.log(otp);
        res
          .status(200)
          .json({ status: true, message: "Otp send successfully" });
        return;
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      const newUser = new Users();
      newUser.mobile_number = mobile_number;
      newUser.otp = otp;
      // newUser.email = email;
      newUser.country_code = country_code;
      //const otp_send = await otpSendEmail(email, name, otp);
      try {
        await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          new URLSearchParams({
            sender_id: String(process.env.SMS_SENDER_ID),
            message: String(process.env.REGISTER_SMS_ID),
            variables_values: `${shortName}|${otp}`,
            route: "dlt",
            numbers: mobile_number,
          }),
          {
            headers: {
              authorization: process.env.SMS_API_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        // axios
        //   .post(
        //     "https://www.fast2sms.com/dev/bulkV2",
        //     new URLSearchParams({
        //       sender_id: String(process.env.SMS_SENDER_ID),
        //       message: String(process.env.SMS_MESSAGE_ID),
        //       variables_values: `${otp}`,
        //       route: "dlt",
        //       numbers: mobile_number,
        //     }),
        //     {
        //       headers: {
        //         authorization: process.env.SMS_API_KEY,
        //         "Content-Type": "application/x-www-form-urlencoded",
        //       },
        //     }
        //   )
        //   .then((response) => {
        //     console.log(response.data);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });

        // const message = await client.messages.create({
        //   body: `Your OTP for account verification is ${otp}. Please do not share this code with anyone.`,
        //   messagingServiceSid: process.env.twiliomessageId,
        //   to: `${newUser.country_code}${newUser.mobile_number}`,
        // });
      } catch (error: any) {
        console.error("Failed to send SMS OTP:", error.message);
      }

      await userRepository.save(newUser);

      res.status(200).json({ status: true, message: "Otp send successfully" });

      return;
    } else {
      if (email) {
        user_email = await userRepository.findOneBy({ email });
      }
      if (
        (user && user.isadmin_otp) ||
        (user_email && user_email.isadmin_otp)
      ) {
        if (user) {
          user.otp = 123456;
          user.updated_at = new Date();
          await userRepository.save(user);
          res
            .status(200)
            .json({ status: true, message: "Otp send successfully" });
          return;
        }
        if (user_email) {
          user_email.otp = 123456;
          user_email.updated_at = new Date();
          await userRepository.save(user_email);
          res
            .status(200)
            .json({ status: true, message: "Otp send successfully" });
          return;
        }
      }

      if (email) {
        if (!user_email || !user_email.email_verified) {
          res.status(404).json({
            status: false,
            message: "No user or unverified email found.",
          });
          return;
        }
        if (user_email.deactivated === 1) {
          res.status(401).json({
            status: false,
            message:
              "Account deactivated please contact support email yuvraj.sy@intacting.in to activate your account",
          });
          return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(email);
        user_email.otp = otp;
        user_email.updated_at = new Date();
        await userRepository.save(user_email);
        let name = user_email.fullName;
        const otp_send = await otpSendEmail(user_email.email, name, otp);
        if (otp_send.success) {
          res
            .status(200)
            .json({ status: true, message: "Otp send successfully" });
        } else {
          console.log(otp_send.message);
          res.status(200).json({ status: true, message: "Otp not send" });
        }
      } else {
        if (!user) {
          res.status(400).json({
            status: false,
            message: "No user found",
          });
          return;
        }
        if (user.deactivated === 1) {
          res.status(401).json({
            status: false,
            message:
              "Account deactivated please contact support email yuvraj.sy@intacting.in to activate your account",
          });
          return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.updated_at = new Date();
        await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          new URLSearchParams({
            sender_id: String(process.env.SMS_SENDER_ID),
            message: String(process.env.SMS_MESSAGE_ID),
            variables_values: `${otp}`,
            route: "dlt",
            numbers: mobile_number,
          }),
          {
            headers: {
              authorization: process.env.SMS_API_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        // const message = await client.messages.create({
        //   body: `Hi ${user.fullName}, your OTP to access your account is ${otp}. Keep it confidential and do not share it with anyone.`,
        //   messagingServiceSid: process.env.twiliomessageId,
        //   to: `${user.country_code}${user.mobile_number}`,
        // });
        await userRepository.save(user);

        res
          .status(200)
          .json({ status: true, message: "Otp send successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error ${error}` });
  }
};

export const sendRegisterTimeOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { mobile_number, country_code } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const userRepository = AppDataSource.getRepository(Users);
    let user;
    if (!mobile_number && !country_code) {
      res.status(400).json({ status: false, message: `Bad request` });
      return;
    }

    user = await userRepository.findOneBy({ mobile_number });

    if (user) {
      if (user.deactivated === 1) {
        res.status(401).json({
          status: false,
          message:
            "Account deactivated please contact support email yuvraj.sy@intacting.in to activate your account",
        });

        return;
      }
      if (!user.otp_verified) {
        // if (user_email) {
        //   if (user.uuid !== user_email?.uuid) {
        //     res
        //       .status(400)
        //       .json({ status: false, message: "User already present" });
        //     return;
        //   }
        // }
        // if (user_email?.uuid !== undefined && !user_email.otp_verified) {
        //   if (user) {
        //     if (user.uuid !== user_email?.uuid) {
        //       res
        //         .status(400)
        //         .json({ status: false, message: "User already present" });
        //       return;
        //     }
        //   }
        // }

        user.otp = otp;
      }
    } else {
      user = userRepository.create({ mobile_number, country_code, otp });
    }
    await userRepository.save(user);
    try {
      const message = await client.messages.create({
        body: `Your OTP for account verification is ${otp}. Please do not share this code with anyone.`,
        messagingServiceSid: process.env.twiliomessageId,
        to: `${country_code}${mobile_number}`,
      });
    } catch (error: any) {
      console.error("Failed to send SMS OTP:", error.message);
    }

    res.status(200).json({ status: true, message: "Otp send successfully" });

    return;
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error}` });
  }
};

export const sendLoginTimeOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { mobile_number, email } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(Users);
    let user;
    if (!mobile_number || !email) {
      res.status(400).json({ status: false, message: `Bad Request` });
      return;
    }
    user = mobile_number
      ? await userRepository.findOneBy({ mobile_number })
      : await userRepository.findOneBy({ email });
    if (!user) {
      res.status(404).json({ status: false, message: `No user found` });
      return;
    }
    if (user?.deactivated === 1) {
      res.status(401).json({
        status: false,
        message:
          "Account deactivated please contact support email yuvraj.sy@intacting.in to activate your account",
      });
      return;
    }
    if (user?.isadmin_otp) {
      user.otp = 123456;
      user.updated_at = new Date();
      await userRepository.save(user);
      res.json({ status: true, message: `OTP send successfully` });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.updated_at = new Date();
    await userRepository.save(user);
    if (mobile_number) {
      const message = await client.messages.create({
        body: `Hi ${user.fullName}, your OTP to access your account is ${otp}. Keep it confidential and do not share it with anyone.`,
        messagingServiceSid: process.env.twiliomessageId,
        to: `${user.country_code}${user.mobile_number}`,
      });

      res.status(200).json({ status: true, message: "Otp send successfully" });
      return;
    }
    if (email) {
      const otp_send = await otpSendEmail(user.email, user.fullName, otp);
      if (otp_send.success) {
        res
          .status(200)
          .json({ status: true, message: "Otp send successfully" });
      } else {
        console.log(otp_send.message);
        res.status(502).json({ status: true, message: "Otp not send" });
      }
      return;
    }
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error}` });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    email,
    password,
    mobile_number,
    date_of_birth,
    otp,
    state,
    city,
    country_code,
  } = req.body;

  const userRepository = AppDataSource.getRepository(Users);
  try {
    const existingUser = await userRepository.findOneBy({ mobile_number });
    if (existingUser && existingUser.otp_verified) {
      res.status(400).json({
        status: false,
        message: "User with this mobile already exists",
      });
      return;
    }
    if (!existingUser?.otp_verified && !name) {
      res.status(404).json({ status: false, mesaage: "enter all details" });
      return;
    }
    if (existingUser) {
      if (existingUser.otp !== otp) {
        res.status(400).json({ status: false, message: "otp not matched" });
        return;
      } else {
        existingUser.fullName = name;

        existingUser.otp_verified = true;
        existingUser.otp = null;
        if (email) {
          existingUser.email = email;
        }
        if (password) {
          existingUser.password = await hashPassword(password);
        }
        existingUser.mobile_number = mobile_number;
        existingUser.date_of_birth = date_of_birth
          ? new Date(date_of_birth)
          : null;
        existingUser.state = state;
        existingUser.city = city;
        const token = generateToken(existingUser!.uuid);
        existingUser.token = token;
        const errors = await validate(existingUser);
        if (errors.length > 0) {
          res.status(400).json({ status: false, errors });
          return;
        }

        await userRepository.save(existingUser);
        res.status(201).json({
          status: true,
          message: "User registered successfully",
          userData: {
            id: existingUser.id,
            uuid: existingUser.uuid,
            fullName: existingUser.fullName,
            email: existingUser.email,
            mobile_number: existingUser.mobile_number,
            date_of_birth: existingUser.date_of_birth,
            token: existingUser.token,
            created_at: existingUser.created_at,
            state: existingUser.state,
            city: existingUser.city,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error saving user", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, mobile_number, otp } = req.body;

  const userRepository = AppDataSource.getRepository(Users);
  let user_join;
  if (mobile_number) {
    try {
      user_join = await userRepository
        .createQueryBuilder("users")
        .leftJoin(
          UserDetails,
          "user_details",
          "users.uuid = user_details.user_uuid"
        )

        .select([
          "users.uuid",
          "users.id",
          "users.fullName",
          "users.mobile_number",
          "users.otp_verified",
          "users.otp",
          "users.state",
          "users.city",
          "users.token",
          "users.email",
          "user_details.profile_completion",
          "users.ispin",
          "users.pin",
          "users.email_verified",
        ])
        .where("users.mobile_number = :mobile_number", { mobile_number })

        .getRawOne();
      console.log(user_join);
      if (!user_join || !user_join.users_otp_verified) {
        //console.log("heree");
        res.status(400).json({ status: false, message: "User not found" });
        return;
      } else {
        if (user_join.users_otp !== otp) {
          res.status(400).json({ status: false, message: "OTP not matched" });
          return;
        }
        const token = generateToken(user_join!.users_uuid);
        await userRepository.update(
          { uuid: user_join.users_uuid },
          {
            token: token,
            otp: null,
            updated_at: new Date(),
          }
        );
        res.status(200).json({
          status: true,
          message: "Login suceesfully",
          userData: {
            id: user_join.users_id,
            fullName: user_join.users_full_name,
            uuid: user_join.users_uuid,
            mobile_number: user_join.users_mobile_number,
            state: user_join.users_state,
            city: user_join.users_city,
            token: user_join.users_token,
            email: user_join.users_email,
            profile_completion: user_join.user_details_profile_completion,
            unreadnotification: user_join.totalUnreadNotifications,
            ispin: user_join.users_ispin,
            pin: user_join.users_pin,
            email_verified: user_join.users_email_verified,
            favourite_job_length: user_join.totalfavjob,
            total_job_applied: user_join.totaljobapplications,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, message: "Error logging in", error });
    }
  } else {
    try {
      user_join = await userRepository
        .createQueryBuilder("users")
        .leftJoin(
          UserDetails,
          "user_details",
          "users.uuid = user_details.user_uuid"
        )

        .select([
          "users.uuid",
          "users.id",
          "users.fullName",
          "users.mobile_number",
          "users.otp_verified",
          "users.otp",
          "users.state",
          "users.city",
          "users.token",
          "users.email",
          "user_details.profile_completion",
          "users.ispin",
          "users.pin",
          "users.email_verified",
        ])
        .where("users.email = :email", { email })

        .getRawOne();
      console.log(user_join);
      if (!user_join || !user_join.users_otp_verified) {
        //console.log("heree");
        res.status(400).json({ status: false, message: "User not found" });
        return;
      } else {
        if (user_join.users_otp !== otp) {
          res.status(400).json({ status: false, message: "OTP not matched" });
          return;
        }
        const token = generateToken(user_join!.users_uuid);
        await userRepository.update(
          { uuid: user_join.users_uuid },
          {
            token: token,
            otp: null,
            updated_at: new Date(),
          }
        );
        res.status(200).json({
          status: true,
          message: "Login suceesfully",
          userData: {
            id: user_join.users_id,
            fullName: user_join.users_full_name,
            uuid: user_join.users_uuid,
            mobile_number: user_join.users_mobile_number,
            state: user_join.users_state,
            city: user_join.users_city,
            token: user_join.users_token,
            email: user_join.users_email,
            profile_completion: user_join.user_details_profile_completion,
            unreadnotification: Number(user_join.totalUnreadNotifications),
            ispin: user_join.users_ispin,
            pin: user_join.users_pin,
            email_verified: user_join.users_email_verified,
          },
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error logging in", error });
    }
  }
};

const generateResetToken = (user_uuid: string, email?: string): string => {
  return jwt.sign(
    { user_uuid, email },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "1h" }
  );
};

export const sendResetPasswordEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(ClientUsers);
    const clientUser = await userRepository.findOneBy({ email });
    if (!clientUser || clientUser.deactivated === 1) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    let name = clientUser.full_name;
    const otp_send = await otpSendResetPasswordEmail(
      clientUser.email,
      name,
      otp
    );
    clientUser.otp = otp;
    await userRepository.save(clientUser);
    if (otp_send.success) {
      res.status(200).json({ status: true, message: "Otp send successfully" });
    } else {
      console.log(otp_send.message);
      res.status(200).json({ status: true, message: "Otp not send" });
    }
    return;
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "error sending email", error });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp, new_password } = req.body;

  const userRepository = AppDataSource.getRepository(ClientUsers);

  try {
    const user = await userRepository.findOneBy({ email });
    if (!user || user.deactivated === 1) {
      res.status(404).json({ status: false, message: "User not found." });
      return;
    }
    if (otp !== user.otp) {
      res.status(200).json({ status: false, message: "otp mismatched" });
      return;
    }
    user.password = await hashPassword(new_password);
    user.otp = null;
    await userRepository.save(user);
    res.status(200).json({ status: true, message: "password rested" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "An error occurred while processing the request.",
      error,
    });
  }
};

export const clientRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullName, email, mobileNumber, countryCode, password } = req.body;

  const userRepository = AppDataSource.getRepository(ClientUsers);
  const decactivatedemailuser = await userRepository.findOne({
    where: { email },
  });
  if (decactivatedemailuser) {
    if (decactivatedemailuser.deactivated === 1) {
      res.status(400).json({
        status: false,
        message: "Contact admin to reactivate your account",
      });
      return;
    } else {
      res.status(400).json({
        status: false,
        message: "User with this email already exists",
      });
      return;
    }
  }
  const deactivatedmobileuser = await userRepository.findOne({
    where: { mobile_number: mobileNumber },
  });
  if (deactivatedmobileuser) {
    if (deactivatedmobileuser.deactivated === 1) {
      res.status(400).json({
        status: false,
        message: "Contact admin to reactivate your account",
      });
      return;
    } else {
      res.status(400).json({
        status: false,
        message: "User with this mobile number already exists",
      });
      return;
    }
  }

  const newUser = new ClientUsers();
  newUser.full_name = fullName;
  newUser.email = email;
  newUser.mobile_number = mobileNumber;
  newUser.country_code = countryCode;
  newUser.password = await hashPassword(password);
  newUser.purchase_plan_status = "ACTIVE";
  newUser.purchase_plan_remaining_days = 15;
  const now = new Date();
  newUser.purchased_plan_expiry = new Date(
    now.getTime() + 15 * 24 * 60 * 60 * 1000
  );
  newUser.plan_uuid = "74bb896a-aa84-47f5-be85-b6956b9df57b";
  const errors = await validate(newUser);
  if (errors.length > 0) {
    res.status(400).json({ status: false, errors });
    return;
  }

  try {
    await userRepository.save(newUser);

    const savedUser = await userRepository.findOneBy({ email });
    if (!savedUser) {
      throw new Error("User not found after saving.");
    }

    const token = generateToken(savedUser.user_uuid);
    savedUser.token = token;

    await userRepository.update(savedUser.id, { token });

    res.status(200).json({
      status: true,
      message: "User registered successfully!",
      token: token,
      clientData: {
        id: savedUser.id,
        user_uuid: savedUser.user_uuid,
        fullName: savedUser.full_name,
        mobile_number: savedUser.mobile_number,
        country_code: savedUser.country_code,
        email: savedUser.email,
        created_date: savedUser.created_date,
        updated_date: savedUser.updated_date,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error saving user", error });
  }
};

export const clientLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const clientRepository = AppDataSource.getRepository(ClientUsers);

  try {
    const clientUser = await clientRepository
      .createQueryBuilder("client_users")
      .leftJoin(
        CompanyProfiles,
        "company_profiles",
        "client_users.user_uuid=company_profiles.client_user_uuid"
      )

      .leftJoin(
        CompanyPlanTypes,
        "company_plans_types",
        "client_users.plan_uuid=company_plans_types.plan_uuid"
      )
      .select([
        "client_users.id",
        "client_users.user_uuid",
        "client_users.full_name",
        "client_users.mobile_number",
        "client_users.country_code",
        "client_users.email",
        "client_users.password",
        "client_users.created_date",
        "client_users.updated_date",
        "client_users.purchase_plan_uuid",
        "client_users.purchase_plan_remaining_days",
        "client_users.purchase_plan_status",
        "company_plans_types.plan_name",
        "client_users.purchased_plan_expiry",
        "company_profiles.profile_completion",
        "company_profiles.company_name",
      ])
      .where("client_users.email = :email", { email })
      .getRawOne();
    console.log(clientUser);
    if (!clientUser || clientUser.deactivated === 1) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    const isPasswordValid = await comparePassword(
      password,
      clientUser.client_users_password
    );
    if (!clientUser.client_users_password || !isPasswordValid) {
      res.status(401).json({ status: false, message: "Invalid credentials" });
      return;
    }

    const token = generateToken(clientUser.client_users_user_uuid);

    clientUser.token = token;
    clientUser.updated_date = new Date();
    await clientRepository.update(
      { user_uuid: clientUser.client_users_user_uuid },
      {
        token: token,
        updated_date: new Date(),
      }
    );
    res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
      clientData: {
        id: Number(clientUser.client_users_id),
        user_uuid: clientUser.client_users_user_uuid,
        fullName: clientUser.client_users_full_name,
        mobile_number: clientUser.client_users_mobile_number,
        country_code: clientUser.client_users_country_code,
        email: clientUser.client_users_email,
        created_date: clientUser.client_users_created_date,
        updated_date: clientUser.client_users_updated_date,
        purchase_plan_uuid: clientUser.client_users_purchase_plan_uuid,
        plan_name: clientUser.company_plans_types_plan_name,
        purchased_plan_expiry: clientUser.client_users_purchased_plan_expiry,
        profile_completion: clientUser.company_profiles_profile_completion,
        company_name: clientUser.company_profiles_company_name,
        purchase_plan_status: clientUser.client_users_purchase_plan_status,
        purchase_plan_remaining_days:
          clientUser.client_users_purchase_plan_remaining_days,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error logging in user", error });
  }
};

export const deleteClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_uuid = req.user?.userUuid;
    const userRepository = AppDataSource.getRepository(ClientUsers);
    const postJobsRepository = AppDataSource.getRepository(Postjobs);
    const clientUser = await userRepository.findOneBy({ user_uuid });
    const companyProfileRepository =
      AppDataSource.getRepository(CompanyProfiles);
    const companyProfile = await companyProfileRepository.findOneBy({
      client_user_uuid: user_uuid,
    });
    if (!clientUser) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    if (companyProfile) {
      companyProfile.deactivated = 1;
    }
    clientUser.deactivated = 1;
    clientUser.deleted_date = new Date();
    clientUser.token = null;
    clientUser.deletedBy = req.user.userUuid;
    await userRepository.save(clientUser);
    res.status(200).json({
      status: true,
      message: "Client and company profile deleted successfully",
    });

    const jobs = await postJobsRepository.find({
      where: { user_uuid: user_uuid },
    });
    jobs.forEach((e) => {
      e.deactivated = 1;
    });
    await postJobsRepository.save(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Error deleting client" });
  }
};

export const emailSender = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, subject, message } = req.body;
  try {
    const mesaageSend = await sendEnquiryEmail(email, subject, name, message);
    if (mesaageSend.success) {
      res.status(200).json({ status: true, message: "Enquiry send" });
      return;
    } else {
      res.status(200).json({ status: false, message: "Error sending enquiry" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Error" });
  }
};

export const setUserPin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pin } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
    const userRepository = AppDataSource.getRepository(Users);
    const user = await userRepository.findOneBy({ uuid: user_uuid });
    if (!user) {
      res.status(400).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    user.ispin = true;
    user.pin = pin;
    await userRepository.save(user);
    res.status(200).json({
      status: true,
      message: "Pin setted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Error setting pin" });
  }
};

export const updateUserPin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { new_pin, old_pin } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
    const userRepository = AppDataSource.getRepository(Users);
    const user = await userRepository.findOneBy({ uuid: user_uuid });
    if (!user) {
      res.status(400).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    if (!user.ispin) {
      res.status(400).json({
        status: false,
        message: "User pin not setted",
      });
      return;
    }
    if (user.pin !== old_pin) {
      res.status(400).json({
        status: false,
        message: "Pin value mismatched please enter correct pin",
      });
      return;
    }
    user.pin = new_pin;
    await userRepository.save(user);
    res.status(200).json({
      status: true,
      message: "Pin setted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Error setting pin" });
  }
};

export const deleteUserPin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pin } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
    const userRepository = AppDataSource.getRepository(Users);
    const user = await userRepository.findOneBy({ uuid: user_uuid });
    if (!user) {
      res.status(400).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    if (!user.ispin) {
      res.status(400).json({
        status: false,
        message: "User pin not setted",
      });
      return;
    }
    if (user.pin !== pin) {
      res.status(400).json({
        status: false,
        message: "Pin value mismatched please enter correct pin",
      });
      return;
    }
    user.ispin = false;
    user.pin = null;
    await userRepository.save(user);
    res.status(200).json({
      status: true,
      message: "Pin deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Error deleting pin" });
  }
};

export const emailVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const userUuid = req.user.userUuid;
    const userRepository = AppDataSource.getRepository(Users);
    const user = await userRepository.findOneBy({ uuid: userUuid });
    const userEmail = await userRepository.findOneBy({ email: email });
    if (userEmail && userEmail.email_verified) {
      res
        .status(400)
        .json({ status: true, message: `Already a verified email registered` });
      return;
    }
    if (!user) {
      res.status(400).json({
        status: false,
        message: "Error while sending email verification link",
      });
      return;
    }
    const emailToken = generateEmailtoken(userUuid);
    const emailSend = await sendEmailForVerification(
      email,
      user?.fullName,
      emailToken
    );
    user.email = email;
    user.email_token = emailToken;
    user.email_verified = false;
    await userRepository.save(user);
    if (emailSend.success) {
      res
        .status(200)
        .json({ status: true, message: `Email Verification Link Send` });
      return;
    } else {
      res
        .status(400)
        .json({ status: false, message: `Error in sending verification link` });
      return;
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(
      String(token),
      process.env.JWT_SECRET as string
    ) as JwtPayloadWithUser;
    if (decoded && decoded.userUuid) {
      const userRepository = AppDataSource.getRepository(Users);
      const user = await userRepository.findOneBy({ uuid: decoded.userUuid });
      if (!user) {
        res.status(400).json({
          status: false,
          message: "Error while verifying email",
        });
        return;
      }
      user.email_token = null;
      user.email_verified = true;
      user.email_verified_date = new Date();
      await userRepository.save(user);
      res.status(200).json({
        status: true,
        message: "Email verified successfully.",
      });
      return;
    } else {
      res.status(401).json({ message: "Invalid token or token expired" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
