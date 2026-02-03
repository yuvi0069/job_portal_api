import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import {
  firstTimeCompanySendResetPasswordEmail,
  otpSendResetPasswordEmail,
} from "../email";
import { Adminuser } from "../entities/admin";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { ClientUsers } from "../entities/clientUsers";
import { Users } from "../entities/user";
import { v4 as uuidv4 } from "uuid";
import { CompanyProfiles } from "../entities/companyProfiles";
import { addCompany, addJobSeeker } from "../utils/adminAddUserHelper";
import { UserDetails } from "../entities/userDetails";

export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const AdminRepository = AppDataSource.getRepository(Adminuser);
    const admin = await AdminRepository.findOneBy({ email });
    if (!admin || admin.deactivated === 1) {
      res.status(400).json({ status: false, message: "Unauthorized" });
      return;
    } else {
      const isPasswordValid = await comparePassword(password, admin.password);
      if (!isPasswordValid) {
        res.status(400).json({ status: false, message: "Unauthorized" });
        return;
      }
      const token = generateToken(admin.uuid);
      admin.token = token;
      await AdminRepository.save(admin);
      res
        .status(200)
        .json({ status: true, message: "Admin user logged in", data: admin });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Error logging in", err });
  }
};

// export const registerAdmin=async(req:Request,res:Response):Promise<void>=>{
//     const{email,name}=req.body;
//     try{
//         const AdminRepository=AppDataSource.getRepository(Adminuser);
//         const admin=await AdminRepository.findOneBy({email})
//         if(admin && admin!==null){

//             res.status(400).json({status:false,message:'already admin'})
//             return;
//         }
//         else{
//         const newAdmin =new Adminuser();
//         newAdmin.email=email;
//         newAdmin.name=name;
//         res.status(200).json({status:true,message:'Admin made',data:newAdmin})
//         }
//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(500).json({ status: false, message: 'Error logging in', err });
//     }

// };

export const adminsendOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  try {
    const AdminRepository = AppDataSource.getRepository(Adminuser);
    const admin = await AdminRepository.findOneBy({ email });
    console.log("heree");
    if (!admin || admin.deactivated === 1) {
      res.status(400).json({ status: false, message: "Unauthorized" });
      return;
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otp_send = await otpSendResetPasswordEmail(
        admin.email,
        admin.name,
        otp
      );
      admin.otp = otp;
      await AdminRepository.save(admin);
      if (otp_send.success) {
        res
          .status(200)
          .json({ status: true, message: "Otp send successfully" });
      } else {
        console.log(otp_send.message);
        res
          .status(200)
          .json({ status: true, message: "Otp not send successfully" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "sending otp", err });
  }
};

export const adminforgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp, new_password } = req.body;

  const adminRepository = AppDataSource.getRepository(Adminuser);

  try {
    const admin = await adminRepository.findOneBy({ email });
    if (!admin) {
      res.status(200).json({ status: false, message: "unauthorized" });
      return;
    }
    if (otp !== admin.otp) {
      res.status(200).json({ status: false, message: "otp mismatched" });
      return;
    }
    admin.password = await hashPassword(new_password);
    admin.otp = null;
    await adminRepository.save(admin);
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

export const adduserByAdmin = async (req: Request, res: Response) => {
  const { typeuser, profile, socialLinks } = req.body;
  if (typeuser === "Job Seeker") {
    const userRepository = AppDataSource.getRepository(Users);
    //  const users = socialLinks.map((socialLink: any) => {
    //    let first_name,last_name;
    //    const spilted_name=socialLink.fullName.split(' ');
    //    if (spilted_name.length >= 3) {
    //        first_name = spilted_name[0];
    //        last_name = spilted_name.slice(1).join(' ');
    //    }
    //      else{
    //    first_name = spilted_name[0];
    //    last_name = spilted_name[1];
    //      }

    //        return {

    //            email: socialLink.email,
    //            mobile_number: socialLink.mobile_number,
    //            otp_verified:true,
    //            first_name:first_name,
    //            last_name:last_name
    //        };
    //    });
    //    await userRepository.insert(users);
    // const userDetailsRepository = AppDataSource.getRepository(UserDetails);
    try {
      const result = await addJobSeeker(profile, userRepository);
      res.status(Number(result.statusCode)).json(result);
      return;
    } catch (error: any) {
      if (error.message === "Validation failed") {
        res.status(400).json({ status: false, message: "Validation failed" });
      } else {
        console.log(error);
        res
          .status(500)
          .json({ status: false, message: "Error adding company.", error });
      }
      return;
    }
  } else if (typeuser === "Admin") {
    const adminRepository = AppDataSource.getRepository(Adminuser);
    const admin = await adminRepository.findOneBy({ uuid: req.user.userUuid });
    try {
      if (admin?.type === "Super Admin") {
        const new_admin = new Adminuser();
        new_admin.uuid = uuidv4();
        new_admin.name = profile.fullName;
        new_admin.email = profile.email;
        new_admin.mobile_number = profile.mobileNumber;
        await adminRepository.save(new_admin);
        res
          .status(200)
          .json({ status: true, message: "Admin added successfully" });
        await firstTimeCompanySendResetPasswordEmail(
          new_admin.email,
          new_admin.name
        );
        return;
      } else {
        res.status(404).json({ status: false, message: "Not a super admin" });
        return;
      }
    } catch (error: any) {
      if (error.code === "23505") {
        res.status(500).json({
          status: false,
          message: "Already an email or mobile exist",
        });
        return;
      }
      if (error.message === "Validation failed") {
        res.status(400).json({ status: false, message: "Validation failed" });
      } else {
        console.log(error);
        res
          .status(500)
          .json({ status: false, message: "Error adding company.", error });
      }
      return;
    }
  } else {
    const companyRepository = AppDataSource.getRepository(ClientUsers);
    const companyProfileRepository =
      AppDataSource.getRepository(CompanyProfiles);
    //    const  company = socialLinks.map((socialLink: any) => {
    //        let first_name,last_name;
    //    const spilted_name=socialLink.fullName.split(' ');
    //    if (spilted_name.length >= 3) {
    //        first_name = spilted_name[0];
    //        last_name = spilted_name.slice(1).join(' ');
    //    }
    //      else{
    //    first_name = spilted_name[0];
    //    last_name = spilted_name[1];
    //      }

    //          return {
    //              name: socialLink.name,
    //              email: socialLink.email,
    //              mobile_number: socialLink.mobile_number,
    //              first_name:first_name,
    //              last_name:last_name
    //          };
    //      });
    try {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      const result = await addCompany(
        files,
        profile,
        companyRepository,
        companyProfileRepository
      );
      res.status(Number(result.statusCode)).json(result);
      return;
    } catch (error: any) {
      if (error.message === "Validation failed") {
        res.status(400).json({ status: false, message: "Validation failed" });
      } else {
        console.log(error);
        res
          .status(500)
          .json({ status: false, message: "Error adding company.", error });
      }
      return;
    }
  }
};

export const getAllAdmin = async (req: Request, res: Response) => {
  const { page_no } = req.headers;
  try {
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const pageSize = 5;
    const skip = (page - 1) * pageSize;
    const adminRepository = AppDataSource.getRepository(Adminuser);
    const admin = await adminRepository.findOneBy({ uuid: req.user.userUuid });
    if (admin?.type !== "Super Admin") {
      res.status(404).json({ status: true, message: "Not as super admin" });
      return;
    }
    const admins = await adminRepository
      .createQueryBuilder("admin")
      .select([
        "admin.uuid",
        "admin.name",
        "admin.email",
        "admin.mobile_number",
        "admin.created_at",
        "admin.type",
        "admin.deactivated",
      ])
      .limit(pageSize)
      .offset(skip)
      .getMany();
    const total = await adminRepository
      .createQueryBuilder("admin")
      .limit(pageSize)
      .offset(skip)
      .getCount();
    res.status(200).json({
      status: true,
      message: "Get all admin",
      data: admins,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(Number(total) / pageSize),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Error updating user.", error });
    return;
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  const { user_uuid, filter } = req.body;
  try {
    const uuid = String(user_uuid);
    const adminRepository = AppDataSource.getRepository(Adminuser);
    const superadmin = await adminRepository.findOneBy({
      uuid: req.user.userUuid,
    });
    if (superadmin?.type !== "Super Admin") {
      res.status(404).json({ status: false, message: "Not a super Admin" });
      return;
    }
    const admin = await adminRepository.findOneBy({ uuid });
    if (!admin) {
      res.status(404).json({ status: false, message: "Admin not found" });
      return;
    } else {
      if (filter === "Delete") {
        admin.deactivated = 1;
        admin.token = null;
        admin.deleted_by = req.user.userUuid;
        admin.deleted_date = new Date();
        await adminRepository.save(admin);
        res.status(200).json({ status: true, message: "Admin Deleted" });
        return;
      }
      if (filter === "Restore" && admin.deactivated === 1) {
        admin.deactivated = 0;
        admin.restoredby = req.user.userUuid;
        admin.restore_date = new Date();
        await adminRepository.save(admin);
        res.status(200).json({ status: true, message: "Admin Restored" });
        return;
      }
    }
    res.status(400).json({ status: false, message: "Admin not found" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Error updating user.", error });
    return;
  }
};
