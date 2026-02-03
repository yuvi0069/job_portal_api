import { AppDataSource } from "../config/database";
import { Request, Response } from "express";
import { ClientUsers } from "../entities/clientUsers";
import { CompanyProfiles } from "../entities/companyProfiles";
import { Postjobs } from "../entities/postjobs";
import { validate } from "class-validator";
import { uploadImageToS3 } from "../utils/uploadimages";
import { Readable } from "stream";
import { In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { JobApplication } from "../entities/jobApplication";
import { CompanyNotification } from "../entities/companyNotification";
import { Companys } from "../entities/company";
import { Users } from "../entities/user";
import { UserDetails } from "../entities/userDetails";
import { CompanySavedCandidates } from "../entities/companySavedCandidates";
import { CompanyPlanTypes } from "../entities/companyPlanTypes";
import { razorpay } from "../utils/razorpay";
import * as crypto from "crypto";
import { CompanySucessTrans } from "../entities/companySucessTrans";
import { CompanyFailedTrans } from "../entities/companyFailTrans";
import { CompanyPlan } from "../entities/companyPlans";
import { PostJobBenefit } from "../entities/postJobBenefits";
import { PostJobCategory } from "../entities/postJobCategory";
import { PostJobLanguage } from "../entities/postJobLanguages";
import { PostJobSkill } from "../entities/postJobSkills";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { CompanySocialMedia } from "../entities/companySocialLinks";
import { SkillMaster } from "../entities/skillMaster";
import { SkillCategory } from "../entities/skillCategory";
dotenv.config();

// export const uploadCompanyProfile = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const {
//     company_name,
//     company_size,
//     company_industry,
//     company_website,
//     company_location,
//     company_founded_year,
//     company_contact,
//     company_description,
//     company_social_media,
//     company_vision,
//     // company_social_media_id,
//     // company_social_media_id_delete,
//   } = req.body;
//   const files = req.files as { [key: string]: Express.Multer.File[] };
//   const company_logo = files?.["company_logo"]?.[0] || null;
//   const company_banner = files?.["company_banner"]?.[0] || null;
//   const userRepository = AppDataSource.getRepository(ClientUsers);
//   const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles);

//   try {
//     const user_uuid = req.user?.userUuid;
//     const clientUser = await userRepository.findOneBy({ user_uuid });

//     if (!clientUser || clientUser.deactivated === 1) {
//       res.status(404).json({ status: false, message: "User not found" });
//       return;
//     }

//     let companyProfile = await companyProfileRepository.findOneBy({
//       client_user_uuid: clientUser.user_uuid,
//     });
//     let company_founded;
//     console.log(company_founded_year);
//     if (!/^\d{4}$/.test(company_founded_year)) {
//       company_founded = null;
//     } else {
//       company_founded = company_founded_year;
//     }

//     let company_logo_url: any;
//     let company_banner_url: any;
//     let name = clientUser.user_uuid;
//     let name1 = clientUser.user_uuid;
//     if (company_logo) {
//       const { buffer, mimetype } = company_logo;
//       name += "_company_logo";
//       const fileStream = Readable.from(buffer);
//       await uploadImageToS3(fileStream, "company_images", name, mimetype);
//       company_logo_url = "/company_images/" + name;
//     }
//     if (company_banner) {
//       const { buffer, mimetype } = company_banner;
//       name1 += "_company_banner";
//       const fileStream = Readable.from(buffer);
//       await uploadImageToS3(fileStream, "company_images", name1, mimetype);
//       company_banner_url = "/company_images/" + name1;
//     }
//     const social_links = companyProfile?.company_social_media_links || [];
//     let socialLinks: any[] = [];
//     console.log(company_social_media);
//     if (company_social_media && company_social_media_id === undefined) {
//       socialLinks = JSON.parse(company_social_media);
//       console.log(socialLinks);
//       socialLinks.forEach((e: any) => {
//         e.id = uuid();
//         social_links.push(e);
//       });
//     }
//     if (companyProfile) {
//       if (
//         company_social_media_id_delete !== undefined &&
//         companyProfile.company_social_media_links.length > 0
//       ) {
//         const socialIndex = companyProfile.company_social_media_links.findIndex(
//           (item) => item.id === company_social_media_id_delete
//         );

//         if (socialIndex > -1) {
//           companyProfile.company_social_media_links.splice(socialIndex, 1);
//         }
//       } else {
//         companyProfile.company_social_media_links =
//           social_links || companyProfile.company_social_media_links;
//       }
//       companyProfile.company_name = company_name || companyProfile.company_name;
//       companyProfile.company_logo =
//         company_logo_url || companyProfile.company_logo;
//       companyProfile.company_size = company_size || companyProfile.company_size;
//       companyProfile.company_industry =
//         company_industry || companyProfile.company_industry;
//       companyProfile.company_website =
//         company_website || companyProfile.company_website;
//       companyProfile.company_location =
//         company_location || companyProfile.company_location;
//       companyProfile.company_founded_year =
//         company_founded || companyProfile.company_founded_year;
//       companyProfile.company_contact =
//         company_contact || companyProfile.company_contact;
//       companyProfile.company_description =
//         company_description || companyProfile.company_description;
//       companyProfile.company_banner =
//         company_banner_url || companyProfile.company_banner;

//       companyProfile.company_vision =
//         company_vision || companyProfile.company_vision;
//       await companyProfileRepository.save(companyProfile);
//     } else {
//       companyProfile = new CompanyProfiles();
//       companyProfile.client_user_uuid = clientUser.user_uuid;
//       companyProfile.company_name = company_name;
//       companyProfile.company_logo = company_logo_url;
//       companyProfile.company_size = company_size;
//       companyProfile.company_industry = company_industry;
//       companyProfile.company_website = company_website;
//       companyProfile.company_location = company_location;
//       companyProfile.company_founded_year = company_founded;
//       companyProfile.company_contact = company_contact;
//       companyProfile.company_description = company_description;
//       companyProfile.company_banner = company_banner_url;
//       companyProfile.company_social_media_links = social_links;
//       companyProfile.company_vision = company_vision;
//       companyProfile.profile_completion = 0;
//       await companyProfileRepository.save(companyProfile);
//     }
//     if (
//       companyProfile.company_name &&
//       companyProfile.company_logo &&
//       companyProfile.company_description &&
//       companyProfile.profile_completion != 35 &&
//       companyProfile.profile_completion <= 65
//     ) {
//       companyProfile.profile_completion =
//         companyProfile.profile_completion !== 0
//           ? companyProfile.profile_completion + 35
//           : 35;
//       console.log(companyProfile.profile_completion);
//     }
//     if (
//       companyProfile.company_location &&
//       companyProfile.company_industry &&
//       companyProfile.company_size &&
//       companyProfile.company_founded_year &&
//       companyProfile.profile_completion != 55 &&
//       companyProfile.profile_completion <= 45
//     ) {
//       companyProfile.profile_completion =
//         companyProfile.profile_completion !== 0
//           ? companyProfile.profile_completion + 55
//           : 55;
//       console.log(companyProfile.profile_completion);
//     }
//     if (
//       companyProfile.company_social_media_links.length > 0 &&
//       companyProfile.profile_completion != 10 &&
//       companyProfile.profile_completion != 65 &&
//       companyProfile.profile_completion != 45 &&
//       companyProfile.profile_completion <= 90
//     ) {
//       companyProfile.profile_completion =
//         companyProfile.profile_completion !== 0
//           ? companyProfile.profile_completion + 10
//           : 10;
//     }
//     if (
//       company_social_media_id_delete !== undefined &&
//       companyProfile.company_social_media_links.length === 0
//     ) {
//       companyProfile.profile_completion -= 10;
//     }
//     await companyProfileRepository.save(companyProfile);
//     let company_l = process.env.AWS_URL + company_logo_url;
//     let company_b = process.env.AWS_URL + company_banner_url;
//     res.status(200).json({
//       status: true,
//       message: "Company profile uploaded successfully",
//       token: clientUser.token,
//       clientData: {
//         id: clientUser.id,
//         user_uuid: clientUser.user_uuid,
//         fullName: clientUser.full_name,
//         mobile_number: clientUser.mobile_number,
//         country_code: clientUser.country_code,
//         email: clientUser.email,
//         created_date: clientUser.created_date,
//         updated_date: clientUser.updated_date,
//         company_profile: {
//           company: companyProfile.company_name,
//           company_logo: company_l,
//           company_size: companyProfile.company_size,
//           company_industry: companyProfile.company_industry,
//           company_website: companyProfile.company_website,
//           company_location: companyProfile.company_location,
//           company_founded_year: companyProfile.company_founded_year,
//           company_contact: companyProfile.company_contact,
//           company_description: companyProfile.company_description,
//           created_date: companyProfile.created_date,
//           updated_date: companyProfile.updated_date,
//           company_banner: company_b,
//           company_social_media: companyProfile.company_social_media_links,
//           company_vision: companyProfile.company_vision,
//           profile_completion: companyProfile.profile_completion,
//         },
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: "Error processing company profile",
//       error,
//     });
//   }
// };
export const addUpdateCompanyBasicInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { company_name, company_description } = req.body;
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const company_logo = files?.["company_logo"]?.[0] || null;
  const company_banner = files?.["company_banner"]?.[0] || null;
  const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles);

  try {
    const user_uuid = req.user?.userUuid;

    let companyProfile = await companyProfileRepository.findOneBy({
      client_user_uuid: user_uuid,
    });

    let company_logo_url: any;
    let company_banner_url: any;
    let name = user_uuid;
    let name1 = user_uuid;
    if (company_logo) {
      const { buffer, mimetype } = company_logo;
      name += "_company_logo";
      const fileStream = Readable.from(buffer);
      await uploadImageToS3(fileStream, "company_images", name, mimetype);
      company_logo_url = "/company_images/" + name;
    }
    if (company_banner) {
      const { buffer, mimetype } = company_banner;
      name1 += "_company_banner";
      const fileStream = Readable.from(buffer);
      await uploadImageToS3(fileStream, "company_images", name1, mimetype);
      company_banner_url = "/company_images/" + name1;
    }

    if (companyProfile) {
      companyProfile.company_name = company_name || companyProfile.company_name;
      companyProfile.company_logo =
        company_logo_url || companyProfile.company_logo;

      companyProfile.company_description =
        company_description || companyProfile.company_description;
      companyProfile.company_banner =
        company_banner_url || companyProfile.company_banner;
      if (
        companyProfile.company_name &&
        companyProfile.company_logo &&
        companyProfile.company_description &&
        companyProfile.profile_completion != 35 &&
        companyProfile.profile_completion <= 65
      ) {
        companyProfile.profile_completion =
          companyProfile.profile_completion !== 0
            ? companyProfile.profile_completion + 35
            : 35;
      }
      await companyProfileRepository.save(companyProfile);
    } else {
      companyProfile = new CompanyProfiles();
      companyProfile.client_user_uuid = user_uuid;
      companyProfile.company_name = company_name;
      companyProfile.company_logo = company_logo_url;

      companyProfile.company_description = company_description;
      companyProfile.company_banner = company_banner_url;

      companyProfile.profile_completion = 35;
      await companyProfileRepository.save(companyProfile);
    }
    res.status(200).json({
      status: true,
      message: "Company profile uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error processing company profile",
      error,
    });
  }
};
export const addUpdateCompanyFoundingInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    company_size,
    company_industry,
    company_website,
    company_location,
    company_founded_year,
    company_vision,
  } = req.body;
  const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles);

  try {
    const user_uuid = req.user?.userUuid;

    let companyProfile = await companyProfileRepository.findOneBy({
      client_user_uuid: user_uuid,
    });
    let company_founded;
    console.log(company_founded_year);
    if (!/^\d{4}$/.test(company_founded_year)) {
      company_founded = null;
    } else {
      company_founded = company_founded_year;
    }

    if (companyProfile) {
      companyProfile.company_size = company_size || companyProfile.company_size;
      companyProfile.company_industry =
        company_industry || companyProfile.company_industry;
      companyProfile.company_website =
        company_website || companyProfile.company_website;
      companyProfile.company_location =
        company_location || companyProfile.company_location;
      companyProfile.company_founded_year =
        company_founded || companyProfile.company_founded_year;
      companyProfile.company_vision =
        company_vision || companyProfile.company_vision;
      if (
        companyProfile.company_location &&
        companyProfile.company_industry &&
        companyProfile.company_size &&
        companyProfile.company_founded_year &&
        companyProfile.profile_completion != 55 &&
        companyProfile.profile_completion <= 45
      ) {
        companyProfile.profile_completion =
          companyProfile.profile_completion !== 0
            ? companyProfile.profile_completion + 55
            : 55;
        console.log(companyProfile.profile_completion);
      }
      await companyProfileRepository.save(companyProfile);
    } else {
      companyProfile = new CompanyProfiles();

      companyProfile.company_size = company_size;
      companyProfile.company_industry = company_industry;
      companyProfile.company_website = company_website;
      companyProfile.company_location = company_location;
      companyProfile.company_founded_year = company_founded;
      companyProfile.company_vision = company_vision;
      companyProfile.profile_completion = 55;
      await companyProfileRepository.save(companyProfile);
    }

    res.status(200).json({
      status: true,
      message: "Company profile uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error processing company profile",
      error,
    });
  }
};
export const addSocialMediaLinks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company_uuid = req.user.userUuid;
    const company_social_repositry =
      AppDataSource.getRepository(CompanySocialMedia);
    if (!req.body.company_social_media) {
      res
        .status(200)
        .json({ message: "No social media link added", status: false });
      return;
    }
    const socialMediaData = JSON.parse(req.body.company_social_media);
    const socialMediaEntities = socialMediaData.map((item: any) => {
      const socialMedia = new CompanySocialMedia();
      socialMedia.company_uuid = company_uuid;
      socialMedia.platform = item.platform;
      socialMedia.url = item.url;
      return socialMedia;
    });
    await company_social_repositry.save(socialMediaEntities);
    res.status(200).json({ status: true, message: "Social media link saved" });
    const company_social_count = await company_social_repositry.count({
      where: { company_uuid },
    });
    if (company_social_count === 1) {
      const companyDetailsRepository =
        AppDataSource.getRepository(CompanyProfiles);
      const company_details = await companyDetailsRepository.findOneBy({
        client_user_uuid: company_uuid,
      });
      if (!company_details) {
        const newUser = companyDetailsRepository.create({
          client_user_uuid: company_uuid,
          profile_completion: 10,
        });
        await companyDetailsRepository.save(newUser);
      } else {
        if (
          company_details.profile_completion != 10 &&
          company_details.profile_completion != 65 &&
          company_details.profile_completion != 45 &&
          company_details.profile_completion <= 90
        ) {
          company_details.profile_completion =
            company_details.profile_completion !== 0
              ? company_details.profile_completion + 10
              : 10;
        }
        await companyDetailsRepository.save(company_details);
      }
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error processing company profile",
      err: error,
    });
  }
};
// export const getSocialMediaLinks = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const user_uuid = req.user.userUuid;
//     const user_social_repositry = AppDataSource.getRepository(UserSocialMedia);
//     const social_media_data = await user_social_repositry.find({
//       where: { user_uuid },
//       order: { created_at: "DESC" },
//     });
//     res.status(200).json({
//       status: true,
//       message: "Social media link saved",
//       social_media_data,
//     });
//     return;
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: "Error deleting user details",
//       err: error,
//     });
//   }
// };
export const deleteSocialMediaLinks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { company_social_media_id_delete } = req.query;
  try {
    const company_uuid = req.user.userUuid;
    const user_social_repositry =
      AppDataSource.getRepository(CompanySocialMedia);
    const social_media_id = String(company_social_media_id_delete);
    const social_media_data = await user_social_repositry.delete({
      social_media_uuid: social_media_id,
    });
    if (social_media_data.affected === 0) {
      res.status(200).json({
        status: false,
        message: `No social media account found to delete.`,
      });

      return;
    } else {
      res.status(200).json({
        status: true,
        message: `Social Media Link deleted successfully`,
      });
      const company_social_count = await user_social_repositry.count({
        where: { company_uuid },
      });
      if (company_social_count === 0) {
        const userDetailsRepository =
          AppDataSource.getRepository(CompanyProfiles);
        const user_details = await userDetailsRepository.findOneBy({
          client_user_uuid: company_uuid,
        });
        if (!user_details) {
          return;
        } else {
          user_details.profile_completion -= 10;
          await userDetailsRepository.save(user_details);
        }
      }
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error deleting user details",
      err: error,
    });
  }
};

export const getCompanyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cleintRepository = AppDataSource.getRepository(ClientUsers);

  try {
    const user_uuid = req.user?.userUuid;
    console.log("user_uuid:", user_uuid);
    const clientUser = await cleintRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect(
        "company_profiles",
        "company",
        "company.client_user_uuid = user.user_uuid"
      )
      .select([
        "user.email",
        "user.mobile_number",
        "user.country_code",
        "user.full_name",
        "user.designation",
        "company.company_name",
        "company.company_logo",
        "company.company_banner",
        "company.company_size",
        "company.company_industry",
        "company.company_website",
        "company.company_location",
        "company.company_founded_year",
        "company.company_contact",
        "company.company_description",
        "company.company_vision",
        "company.company_social_media_links",
        "company.created_date",
        "company.updated_date",
        "company.profile_completion",
        `(SELECT json_agg(company_social_media_links.*) 
      FROM company_social_media_links 
      WHERE company_social_media_links.company_uuid = company.client_user_uuid) AS social_media_links`,
      ])
      .where("user.user_uuid = :user_uuid", { user_uuid })
      .getRawOne();

    // const [clientUser, companyProfile] = await Promise.all([
    //   userRepository.findOne({
    //     where: { user_uuid },
    //     select: [
    //       "email",
    //       "mobile_number",
    //       "country_code",
    //       "full_name",
    //       "designation",
    //     ],
    //   }),
    //   companyProfileRepository.findOneBy({ client_user_uuid: user_uuid }),
    // ]);

    if (!clientUser || clientUser.user_deactivated === 1) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    const awsUrl = process.env.AWS_URL || "";
    if (clientUser.company_company_name) {
      res.status(200).json({
        status: true,
        message: "Company profile get successfully",
        company_profile: {
          company_name: clientUser.company_company_name,
          company_logo: clientUser.company_company_logo
            ? awsUrl + clientUser.company_company_logo
            : undefined,
          company_banner: clientUser.company_company_banner
            ? awsUrl + clientUser.company_company_banner
            : undefined,
          company_size: clientUser.company_company_size,
          company_industry: clientUser.company_company_industry,
          company_website: clientUser.company_company_website,
          company_location: clientUser.company_company_location,
          company_founded_year: clientUser.company_company_founded_year,
          company_contact: clientUser.company_company_contact,
          company_description: clientUser.company_company_description,
          company_vision: clientUser.company_company_vision,
          company_social_media_link: clientUser.social_media_links,
          created_date: clientUser.company_created_date,
          updated_date: clientUser.company_updated_date,
          profile_completion: clientUser.company_profile_completion,
          email: clientUser.user_email,
          mobile_number: clientUser.user_mobile_number,
          country_code: clientUser.user_country_code,
          designation: clientUser.user_designation,
          fullName: clientUser.user_full_name,
        },
      });
      return;
    } else {
      res.status(200).json({
        status: false,
        message: "Company profile not there",
        company_profile: {
          email: clientUser.user_email,
          mobile_number: clientUser.user_mobile_number,
          country_code: clientUser.user_country_code,
          designation: clientUser.user_designation,
          fullName: clientUser.user_full_name,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error processing company profile",
      error,
    });
  }
};

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skillRepository = AppDataSource.getRepository(SkillCategory);

    const skills = await skillRepository
      .createQueryBuilder("category")
      .select([
        "category.skill_category_id AS id",
        "category.skill_category_name AS category",
        `(SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', skill.skill_id,
              'title', skill.skill_name
            )
            ORDER BY skill.skill_id
          )
          FROM skill_master AS skill
          WHERE skill.skill_category_id = category.skill_category_id
        ) AS skills`,
      ])
      .orderBy("category.skill_category_id", "ASC")
      .getRawMany();

    res.status(200).json({
      status: true,
      message: "Skills fetched successfully",
      data: skills,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching skills",
      error,
    });
  }
};

export const createJobPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    job_title,
    tag,
    job_role,
    min_salary,
    max_salary,
    education,
    experience,
    job_type,
    vacancies,
    expirationDate,
    job_level,
    state,
    city,
    job_description,
    gender,
    benefits,
    languages,
    categories,
    skills,
    age_group,
  } = req.body;
  const clientRepository = AppDataSource.getRepository(ClientUsers);
  const companyRepository = AppDataSource.getRepository(CompanyProfiles);
  const jobCategoryRepository = AppDataSource.getRepository(PostJobCategory);
  const jobBenefitsRepository = AppDataSource.getRepository(PostJobBenefit);
  const jobLanguageRepository = AppDataSource.getRepository(PostJobLanguage);
  const jobSkillRepository = AppDataSource.getRepository(PostJobSkill);
  const jobRepository = AppDataSource.getRepository(Postjobs);
  try {
    const user_uuid = req.user?.userUuid;
    console.log("user_uuid:", user_uuid);

    const clientUser = await clientRepository.findOneBy({ user_uuid });

    if (!clientUser || clientUser.deactivated === 1) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    const plan_expiry = clientUser.purchased_plan_expiry;
    const companyUser = await companyRepository.findOneBy({
      client_user_uuid: clientUser.user_uuid,
    });
    if (!companyUser) {
      res.status(500).json({
        message: `Please create a company profile and add company name`,
        status: false,
      });
      return;
    }
    if (!plan_expiry || new Date(plan_expiry) < new Date()) {
      const jobLength = await jobRepository.count({ where: { user_uuid } });
      if (jobLength >= 2) {
        res
          .status(401)
          .json({ status: false, message: "Please upgarde your plan" });
        return;
      }
    }
    const jobPost = new Postjobs();
    jobPost.user_uuid = clientUser.user_uuid;
    jobPost.job_title = job_title;

    if (tag && tag.length > 2) {
      jobPost.tag = tag;
    }

    if (job_description && job_description.length > 2) {
      jobPost.job_description = job_description;
    }
    jobPost.job_role = job_role;
    jobPost.min_salary = min_salary;
    jobPost.max_salary = max_salary;
    if (education && education.length > 2) {
      jobPost.education = education;
    }
    jobPost.experience = experience;
    jobPost.job_type = job_type;
    jobPost.vacancies = vacancies;
    jobPost.expirationDate = expirationDate;
    jobPost.job_level = job_level;
    jobPost.state = state;
    jobPost.city = city;
    if (job_description && job_description.length > 2) {
      jobPost.job_description = job_description;
    }
    // if (companyUser) {
    //   jobPost.company_name = companyUser?.company_name;
    //   jobPost.company_logo = companyUser?.company_logo;
    // }
    // jobPost.job_category = categories;
    jobPost.gender = gender;
    jobPost.age_group = age_group;
    let date = new Date();
    const job_remaining = Math.floor(
      (new Date(expirationDate).getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (job_remaining <= 0) {
      jobPost.status = "Expired";
      jobPost.job_valid_days = 0;
    } else {
      jobPost.job_valid_days = job_remaining;
    }
    const savedJobPost = await jobRepository.save(jobPost);
    if (Array.isArray(benefits) && benefits.length > 0) {
      const jobBenefits = benefits.map((benefit: string) => ({
        job_id: savedJobPost.id,
        job_benefit_name: benefit,
      }));

      await jobBenefitsRepository
        .createQueryBuilder()
        .insert()
        .into(PostJobBenefit)
        .values(jobBenefits)
        .execute();
    }
    if (Array.isArray(categories) && categories.length > 0) {
      const categoryRecords = categories.map((category: string) => ({
        job_id: savedJobPost.id,
        category_name: category,
      }));

      await jobCategoryRepository
        .createQueryBuilder()
        .insert()
        .into(PostJobCategory)
        .values(categoryRecords)
        .execute();
    }
    if (Array.isArray(languages) && languages.length > 0) {
      const languageRecords = languages.map((lang: string) => ({
        job_id: savedJobPost.id,
        language: lang,
      }));

      await jobLanguageRepository
        .createQueryBuilder()
        .insert()
        .into(PostJobLanguage)
        .values(languageRecords)
        .execute();
    }
    if (Array.isArray(skills) && skills.length > 0) {
      const skills_map = skills.map((skill_name: string) => ({
        job_id: savedJobPost.id,
        skill_name: skill_name,
      }));

      await jobSkillRepository
        .createQueryBuilder()
        .insert()
        .into(PostJobSkill)
        .values(skills_map)
        .execute();
    }

    if (process.env.AWS_URL)
      res.status(200).json({
        status: true,
        message: "Job post created successfully",
        // jobData: {
        //   id: savedJobPost.id,
        //   user_uuid: savedJobPost.user_uuid,
        //   job_title: savedJobPost.job_title,
        //   tag: savedJobPost.tag,
        //   job_role: savedJobPost.job_role,
        //   min_salary: savedJobPost.min_salary,
        //   max_salary: savedJobPost.max_salary,
        //   education: savedJobPost.education,
        //   experience: savedJobPost.experience,
        //   job_type: savedJobPost.job_type,
        //   vacancies: savedJobPost.vacancies,
        //   expirationDate: savedJobPost.expirationDate,
        //   job_level: savedJobPost.job_level,
        //   state: savedJobPost.state,
        //   city: savedJobPost.city,
        //   company_name: savedJobPost.company_name,
        //   job_description: savedJobPost.job_description,
        //   created_date: savedJobPost.created_date,
        //   updated_date: savedJobPost.updated_date,
        //   company_logo: savedJobPost.company_logo
        //     ? process.env.AWS_URL + savedJobPost.company_logo
        //     : null,
        //   job_languages,
        //   job_categories,
        //   job_benefits,
        // },
      });
  } catch (error) {
    console.error("Error creating job post:", error);
    res
      .status(500)
      .json({ status: false, message: "Error processing job post", error });
  }
};

export const getJobByCompanyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status, page_no } = req.headers;
  const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
  const pageSize = 5;
  const skip = (page - 1) * pageSize;
  const user_uuid = req.user?.userUuid;
  try {
    const postJobsRepository = AppDataSource.getRepository(Postjobs);
    const savedCandidateRepository = AppDataSource.getRepository(
      CompanySavedCandidates
    );
    const saved_candidates_length = await savedCandidateRepository.count({
      where: { company_uuid: user_uuid },
    });
    const whereConditions: any = {};

    whereConditions.user_uuid = user_uuid;

    let jobs, total;
    if (status && status != "All") {
      jobs = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .where("post_jobs.user_uuid=:user_uuid", { user_uuid: user_uuid })
        .andWhere("post_jobs.status=:status", { status: status })
        .orderBy("post_jobs.created_date")
        .skip(skip)
        .take(pageSize)
        .getMany();

      total = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .where("post_jobs.user_uuid=:user_uuid", { user_uuid: user_uuid })
        .andWhere("post_jobs.status=:status", { status: status })
        .getCount();
    } else {
      jobs = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .where("post_jobs.user_uuid=:user_uuid", { user_uuid: user_uuid })
        .orderBy("post_jobs.created_date")
        .skip(skip)
        .take(pageSize)
        .getMany();
      total = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .where("post_jobs.user_uuid=:user_uuid", { user_uuid: user_uuid })
        .orderBy("post_jobs.created_date")
        .skip(skip)
        .take(pageSize)
        .getCount();
    }
    const whereConditionsforactivejob: any = {};
    whereConditionsforactivejob.user_uuid = user_uuid;
    whereConditionsforactivejob.status = "Active";
    const [activejobs, totalactivejobs] = await postJobsRepository.findAndCount(
      {
        where: whereConditionsforactivejob,
      }
    );
    if (!jobs) {
      res.status(200).json({ message: "No jobs found", status: false });
    } else {
      //const diffDays = Math.floor(Math.abs(new Date(jobs[0].expirationDate).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

      await postJobsRepository.save(jobs);
      res.status(200).json({
        message: "Jobs found",
        status: true,
        activejobcount: totalactivejobs,
        data: jobs,
        env: process.env.AWS_URL,
        saved_candidates_length,
        pagination: {
          page,
          total,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }
  } catch (err) {
    res.status(500).json({ message: `Error found ${err}`, status: false });
  }
};

export const updateJobStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_uuid = req.user;
  const { id, status } = req.body;
  try {
    if (!id) {
      res.status(404).json({ message: "No jobs found", status: false });
      return;
    }
    const postJobsRepository = AppDataSource.getRepository(Postjobs);
    const jobs = await postJobsRepository.findOneBy({ id });
    if (jobs?.status === "Expired") {
      res.status(200).json({ message: "Already Expired", status: false });
      return;
    }
    if (!jobs) {
      res.status(200).json({ message: "No jobs found", status: false });
      return;
    } else {
      if (status) {
        jobs.status = status;
        await postJobsRepository.save(jobs);
        // if (process.env.AWS_URL)
        //   jobs.company_logo = process.env.AWS_URL + jobs.company_logo;
      }
      res
        .status(200)
        .json({ message: "Jobs stauts updated", status: true, data: jobs });
    }
  } catch (err) {
    res.status(500).json({ message: `Error found ${err}`, status: false });
  }
};

export const getJobByJobId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { job_id } = req.headers;
  try {
    const postJobsRepository = AppDataSource.getRepository(Postjobs);
    const JobApplicationRepository =
      AppDataSource.getRepository(JobApplication);

    //const jobs = await postJobsRepository.findOneBy({ id: Number(job_id) });
    // const jobs = await postJobsRepository
    //   .createQueryBuilder("job")
    //   .leftJoin("post_job_benefits", "benefit", "job.id = benefit.job_id")
    //   .leftJoin("post_job_category", "category", "job.id = category.job_id")
    //   .leftJoin("post_job_languages", "language", "job.id = language.job_id")
    //   .leftJoin("post_job_skill", "skill", "job.id=skill.job_id")
    //   .where("job.id = :job_id", { job_id: Number(job_id) })
    //   .select([
    //     "job.*",
    //     "benefit.job_benefit_name",
    //     "category.category_name",
    //     "language.language",
    //     "skill.skill_name",
    //   ])
    //   .getRawMany();
    const jobs = await AppDataSource.getRepository(Postjobs)
      .createQueryBuilder("job")
      .leftJoin(
        "company_profiles",
        "company_profile",
        "job.user_uuid=company_profile.client_user_uuid"
      )
      .where("job.id = :job_id", { job_id: Number(job_id) })
      .select([
        "job.*",
        "company_profile.company_name as company_name",
        "company_profile.company_logo as company_logo",
        `(SELECT json_agg(job_benefit.job_benefit_name) 
      FROM post_job_benefits job_benefit 
      WHERE job_benefit.job_id = job.id) AS benefits`,

        `(SELECT json_agg(job_category.category_name) 
      FROM post_job_category job_category 
      WHERE job_category.job_id = job.id) AS categories`,

        `(SELECT json_agg(job_language.language) 
      FROM post_job_languages job_language 
      WHERE job_language.job_id = job.id) AS languages`,

        `(SELECT json_agg(job_skill.skill_name) 
      FROM post_job_skill job_skill 
      WHERE job_skill.job_id = job.id) AS skills`,
      ])
      .getRawOne();

    const jobs_length = await JobApplicationRepository.count({
      where: { job_id: Number(job_id) },
    });
    console.log(jobs_length);
    if (!jobs) {
      res.status(200).json({ message: "No job found", status: false });
    } else {
      if (process.env.AWS_URL && jobs?.company_logo) {
        jobs.company_logo = process.env.AWS_URL + jobs?.company_logo;
      }
      res.status(200).json({ message: "Job found", status: true, data: jobs });
    }
  } catch (err) {
    res.status(500).json({ message: `Error found ${err}`, status: false });
  }
};

export const getGlobalCompanyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_uuid } = req.body;
  const clientRepository = AppDataSource.getRepository(ClientUsers);

  try {
    const clientUser = await clientRepository
      .createQueryBuilder("client_users")
      .leftJoin(
        CompanyProfiles,
        "company_profiles",
        "client_users.user_uuid=company_profiles.client_user_uuid"
      )
      .select([
        "client_users.user_uuid",
        "client_users.email",
        "client_users.mobile_number",
        "company_profiles.company_name",
        "company_profiles.company_size",
        "company_profiles.company_industry",
        "company_profiles.company_website",
        "company_profiles.company_location",
        "company_profiles.company_founded_year",
        "company_profiles.company_contact",
        "company_profiles.company_description",
        "company_profiles.company_vision",
        "company_profiles.company_social_media_links",
        "company_profiles.company_banner",
        "company_profiles.company_logo",
        "company_profiles.created_date",
        "company_profiles.updated_date",
        "company_profiles.profile_completion",
        `(SELECT json_agg(company_social_media_links.*) 
      FROM company_social_media_links 
      WHERE company_social_media_links.company_uuid = client_users.user_uuid) AS social_media_links`,
      ])
      .where("client_users.user_uuid = :user_uuid", { user_uuid })
      .getRawOne();
    if (!clientUser || clientUser.deactivated === 1) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    let company_b;
    let company_l;
    if (process.env.AWS_URL) {
      if (clientUser.company_profiles_company_banner) {
        company_b =
          process.env.AWS_URL + clientUser.company_profiles_company_banner;
      }
      if (clientUser.company_profiles_company_logo) {
        company_l =
          process.env.AWS_URL + clientUser.company_profiles_company_logo;
      }
    }

    if (clientUser.company_profiles_company_name) {
      res.status(200).json({
        status: true,
        message: "Company profile get successfully",
        company_profile: {
          company_name: clientUser.company_profiles_company_name,
          company_logo: company_l,
          company_size: clientUser.company_profiles_company_size,
          company_industry: clientUser.company_profiles_company_industry,
          company_website: clientUser.company_profiles_company_website,
          company_location: clientUser.company_profiles_company_location,
          company_founded_year:
            clientUser.company_profiles_company_founded_year,
          company_contact: clientUser.company_profiles_company_contact,
          company_description: clientUser.company_profiles_company_description,
          company_vision: clientUser.company_profiles_company_vision,
          company_banner: company_b,
          company_social_media_link: clientUser.social_media_links,
          created_date: clientUser.company_profiles_created_date,
          updated_date: clientUser.company_profiles_updated_date,
          profile_completion: clientUser.company_profiles_profile_completion,
          email: clientUser.client_users_email,
          mobile_number: clientUser.client_users_mobile_number,
        },
      });
    } else {
      res.status(200).json({
        status: false,
        message: `company profile not found`,
        company_profile: {
          company_name: null,
          company_logo: null,
          company_size: null,
          company_industry: null,
          company_website: null,
          company_location: null,
          company_founded_year: null,
          company_contact: null,
          company_description: null,
          company_vision: null,
          company_banner: null,
          company_social_media_link: null,
          created_date: null,
          updated_date: null,
          profile_completion: null,
          email: clientUser.client_users_email,
          mobile_number: clientUser.client_users_mobile_number,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error processing company profile",
      error,
    });
  }
};

export const getNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page_no } = req.headers;
  try {
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const pageSize = 9;
    const user_uuid = req.user?.userUuid;
    const userNotificationRepository =
      AppDataSource.getRepository(CompanyNotification);
    const userNotification = await userNotificationRepository.find({
      where: { company_uuid: user_uuid },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { created_at: "DESC" },
    });
    const total = await userNotificationRepository.count({
      where: { company_uuid: user_uuid },
    });
    const totalNewJobs = await userNotificationRepository.count({
      where: { company_uuid: user_uuid, isread: false },
    });
    if (userNotification.length === 0) {
      res.status(200).json({ status: false, message: "No alerts found" });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Notification found",
      data: userNotification,
      unreadnotifications: totalNewJobs,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error Fetching Notifications",
      err: error,
    });
  }
};

export const updateNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notification_uuid } = req.body;
  try {
    const userNotificationRepository =
      AppDataSource.getRepository(CompanyNotification);
    const userNotification = await userNotificationRepository.findOne({
      where: { notification_uuid },
    });
    if (!userNotification) {
      res.status(200).json({
        status: true,
        message: "No notification found",
      });
      return;
    }
    userNotification.isread = true;
    await userNotificationRepository.save(userNotification);
    res.status(200).json({
      status: true,
      message: "Notification updated",
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error Updating notifications",
      err: error,
    });
  }
};

export const getTrendingCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const companyRepository = AppDataSource.getRepository(Companys);
    const topCompanies =
      await AppDataSource.query(`Select cp.company_name,cp.company_logo,cp.client_user_uuid,COUNT(pj.id) AS total_jobs from company_profiles cp join post_jobs pj ON 
    cp.client_user_uuid = pj.user_uuid WHERE 
    pj.deactivated = 0 
    AND cp.deactivated = 0 GROUP BY 
    cp.company_name, cp.company_logo,cp.client_user_uuid
    ORDER BY 
    total_jobs DESC
    LIMIT 10`);
    res.status(200).json({
      status: true,
      message: "Top comapnies list",
      topCompanies,
      env: process.env.AWS_URL,
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error Updating notifications",
      err: error,
    });
  }
};

export const getFilterCandidates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const companyRepository = AppDataSource.getRepository(Companys);
    const loggedInUserId = req.user.userUuid;
    const { job_role, state, city, gender, page_no } = req.headers;
    const page = page_no ? Number(page_no) : 1;
    const pageSize = 12;
    const userRepository = AppDataSource.getRepository(UserDetails);
    const whereConditions: any = {};
    if (job_role) {
      whereConditions.user_role = job_role;
    }
    if (gender) {
      whereConditions.gender = gender;
    }
    if (city) {
      whereConditions.city = city;
    }
    if (state) {
      whereConditions.state = state;
    }
    // const usert=await userRepository.createQueryBuilder("users").leftJoin
    const userDetails = await userRepository
      .createQueryBuilder("user_details")
      .leftJoin("user_details.user", "user")
      .leftJoin(
        "company_saved_candidates",
        "company_saved_candidates",
        "company_saved_candidates.job_seeker_uuid = user_details.user_uuid AND company_saved_candidates.company_uuid = :loggedInUserId",
        { loggedInUserId }
      )
      .select([
        "user_details.user_uuid",
        "user_details.profile_pic",
        "user_details.gender",
        "user_details.user_role",
        "user_details.state",
        "user_details.city",
        "user.fullName",
      ])
      .addSelect(
        `CASE WHEN company_saved_candidates.saved_candidates_uuid IS NOT NULL THEN true ELSE false END`,
        "is_saved"
      )
      .where(`1=1`)
      .andWhere(whereConditions)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getRawMany();

    const total = await userRepository.count({
      where: whereConditions,
    });
    res.status(200).json({
      message: "Candidates details",
      status: true,
      data: userDetails,
      env: process.env.AWS_URL,
      pagination: {
        page,
        total,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error getting users",
      err: error,
    });
  }
};

export const addSavedCandidates = async (req: Request, res: Response) => {
  const user_uuid = req.user.userUuid;
  const { job_seeker_uuid, job_id } = req.body;
  try {
    const companyRepository = AppDataSource.getRepository(ClientUsers);
    const savedCandidateRepository = AppDataSource.getRepository(
      CompanySavedCandidates
    );
    const companyDetails = await companyRepository.findOneBy({ user_uuid });
    if (companyDetails?.plan_uuid === null) {
      const savd_candidate_length = await savedCandidateRepository.count({
        where: { company_uuid: user_uuid },
      });
      if (savd_candidate_length === 5) {
        res
          .status(401)
          .json({ status: false, message: "Please upgrade your plan" });
        return;
      }
    }

    const newSavedCandidates = new CompanySavedCandidates();
    newSavedCandidates.company_uuid = user_uuid;
    newSavedCandidates.job_seeker_uuid = job_seeker_uuid;
    newSavedCandidates.job_id = job_id;
    await savedCandidateRepository.save(newSavedCandidates);
    res.status(200).json({
      message: "Candidates saved",
      status: true,
    });
    return;
  } catch (error: any) {
    if (error.code === "23505") {
      res.status(422).json({
        status: false,
        message: "Already saved",
      });
      return;
    }
    res.status(500).json({
      status: false,
      message: "Error in saving candidates",
      err: error,
    });
  }
};

export const getsavedcandidates = async (req: Request, res: Response) => {
  const { page_no } = req.headers;
  try {
    const pageSize = 5;
    const user_uuid = req.user.userUuid;
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const savedCandidateRepository = AppDataSource.getRepository(
      CompanySavedCandidates
    );

    const candidates = await savedCandidateRepository
      .createQueryBuilder("company_saved_candidates")
      .innerJoin(
        Users,
        "users",
        "company_saved_candidates.job_seeker_uuid = users.uuid"
      )
      .leftJoin(
        UserDetails,
        "user_details",
        "company_saved_candidates.job_seeker_uuid = user_details.user_uuid"
      )
      .select([
        "company_saved_candidates.saved_candidates_uuid",
        "company_saved_candidates.job_seeker_uuid",
        "company_saved_candidates.company_uuid",
        "company_saved_candidates.job_id",
        "company_saved_candidates.created_at",
        "users.full_name",
        "user_details.profile_pic",
        "user_details.user_role",
        "user_details.gender",
        "user_details.cv_url",
      ])
      .where("company_saved_candidates.company_uuid = :user_uuid", {
        user_uuid,
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getRawMany();
    const total = await savedCandidateRepository
      .createQueryBuilder("company_saved_candidates")
      .where("company_saved_candidates.company_uuid = :user_uuid", {
        user_uuid,
      })
      .getCount();
    res.status(200).json({
      status: true,
      message: "Saved candidates details",
      data: candidates,
      env: process.env.AWS_URL,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteSavedCandidates = async (req: Request, res: Response) => {
  try {
    const { job_seeker_uuid } = req.body;
    const savedCandidateRepository = AppDataSource.getRepository(
      CompanySavedCandidates
    );

    await savedCandidateRepository.delete({
      job_seeker_uuid,
    });

    res.status(200).json({
      status: true,
      message: "Deleted candidates details",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const company_uuid = req.user.userUuid;
    const companyRepository = AppDataSource.getRepository(ClientUsers);
    const { plan_name } = req.body;
    const companyDetails = await companyRepository.findOneBy({
      user_uuid: company_uuid,
    });
    if (!companyDetails) {
      res.status(401).json({ status: false, message: "No user found" });
    }
    const companyPlanRepository = AppDataSource.getRepository(CompanyPlanTypes);
    const plan = await companyPlanRepository.findOne({ where: { plan_name } });
    if (!plan) {
      res.status(400).json({ status: false, message: `No plan found` });
      return;
    }
    const plan_amount = plan.plan_amount;
    const options = {
      amount: plan_amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      status: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      company_uuid,
      message: "Plan found and order created",
      email: companyDetails?.email,
    });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
    return;
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const company_uuid = req.user.userUuid;
    console.log(company_uuid);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_name,
    } = req.body;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const planRepository = AppDataSource.getRepository(CompanyPlanTypes);
    const companyPlanType = await planRepository.findOneBy({
      plan_name,
    });
    if (!companyPlanType) {
      res.status(401).json({ status: false, message: `No plan found` });
      return;
    }
    if (expectedSignature === razorpay_signature) {
      const companyRepository = AppDataSource.getRepository(ClientUsers);
      const companyPlansRepository = AppDataSource.getRepository(CompanyPlan);

      const companyPlanDetails = await companyPlansRepository.findOneBy({
        company_uuid,
      });
      const companyDetails = await companyRepository.findOneBy({
        user_uuid: company_uuid,
      });
      if (!companyDetails) {
        res.status(401).json({ status: false, message: "No user found" });
        return;
      }
      const companySuccesTransRepository =
        AppDataSource.getRepository(CompanySucessTrans);
      const purchasedPlan = new CompanySucessTrans();
      const purchase_plan_uuid = uuid();
      purchasedPlan.purchase_uuid = purchase_plan_uuid;
      purchasedPlan.company_uuid = company_uuid;
      purchasedPlan.plan_uuid = companyPlanType.plan_uuid;
      purchasedPlan.razorpay_order_id = razorpay_order_id;
      purchasedPlan.razorpay_payment_id = razorpay_payment_id;
      purchasedPlan.success = true;

      await companySuccesTransRepository.save(purchasedPlan);
      if (!companyPlanDetails) {
        const newCompanyPlan = new CompanyPlan();
        console.log(company_uuid);
        newCompanyPlan.company_uuid = company_uuid;
        newCompanyPlan.purchase_uuid = purchase_plan_uuid;
        newCompanyPlan.plan_uuid = companyPlanType.plan_uuid;
        const now = new Date();
        const futureDate = new Date(
          now.getTime() + companyPlanType.plan_days * 24 * 60 * 60 * 1000
        );
        newCompanyPlan.plan_expiry = futureDate;
        companyDetails.purchased_plan_expiry = newCompanyPlan.plan_expiry;
        companyDetails.purchase_plan_remaining_days = companyPlanType.plan_days;
        companyDetails.purchase_plan_status = "ACTIVE";
        await companyPlansRepository.save(newCompanyPlan);
      } else {
        companyPlanDetails.company_uuid = company_uuid;
        companyPlanDetails.updated_at = new Date();
        const extensionMillis = companyPlanType.plan_days * 24 * 60 * 60 * 1000;
        const now = new Date();
        const futureDate = new Date(
          now.getTime() + companyPlanType.plan_days * 24 * 60 * 60 * 1000
        );
        companyDetails.purchase_plan_remaining_days = companyPlanType.plan_days;
        companyDetails.purchase_plan_status = "ACTIVE";
        if (companyPlanDetails.plan_expiry < now) {
          companyPlanDetails.plan_expiry = futureDate;
        } else {
          companyPlanDetails.plan_expiry = new Date(
            companyPlanDetails.plan_expiry.getTime() + extensionMillis
          );
        }
        companyDetails.purchased_plan_expiry = companyPlanDetails.plan_expiry;
        companyPlanDetails.purchase_uuid = purchase_plan_uuid;
        companyPlanDetails.plan_uuid = companyPlanType.plan_uuid;
        await companyPlansRepository.save(companyPlanDetails);
      }
      companyDetails.purchase_plan_uuid = purchase_plan_uuid;
      companyDetails.plan_uuid = companyPlanType.plan_uuid;

      await companyRepository.save(companyDetails);
      res.status(200).json({
        status: true,
        message: "Payment verified found sucessfully",
        purchase_plan_uuid: companyDetails.purchase_plan_uuid,
        plan_name: plan_name,
        purchased_plan_expiry: companyDetails.purchased_plan_expiry,
        purchase_plan_remaining_days:
          companyDetails.purchase_plan_remaining_days,
        purchase_plan_status: companyDetails.purchase_plan_status,
      });
      return;
    }
    const companyFailTransRepository =
      AppDataSource.getRepository(CompanyFailedTrans);
    const companyFailedDetails = new CompanyFailedTrans();
    companyFailedDetails.company_uuid = company_uuid;
    companyFailedDetails.plan_uuid = companyPlanType.plan_uuid;
    companyFailedDetails.razorpay_order_id = razorpay_order_id;
    companyFailedDetails.razorpay_payment_id = razorpay_payment_id;
    await companyFailTransRepository.save(companyFailedDetails);
    res.status(400).json({ status: false, message: `payment not verified` });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getGlobalJobSeeker = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_uuid } = req.headers;
  const company_uuid = req.user.userUuid;
  try {
    const companyRepository = AppDataSource.getRepository(ClientUsers);
    const userRepository = AppDataSource.getRepository(Users);
    const companyDetails = await companyRepository.findOneBy({
      user_uuid: company_uuid,
    });

    const users = await userRepository
      .createQueryBuilder("users")
      .leftJoin(
        UserDetails,
        "user_details",
        "users.uuid = user_details.user_uuid"
      )
      .select([
        "users.uuid",
        "users.full_name",
        "users.mobile_number",
        "users.state",
        "users.city",
        "users.email",
        "user_details.languages_spoken",
        "user_details.city",
        "user_details.state",
        "user_details.about_you",
        "user_details.cv_url as cv_url",
        "user_details.gender",
        "user_details.cv_name",
        "user_details.user_role",
        "user_details.profile_pic as profile_pic",
        "user_details.profile_completion",
        "user_details.country",
        `(SELECT json_agg(user_experience_details.*) 
      FROM user_experience_details 
      WHERE user_experience_details.user_uuid = users.uuid) AS experience`,

        `(SELECT json_agg(user_education_details.*) 
      FROM user_education_details 
      WHERE user_education_details.user_uuid = users.uuid) AS education`,

        `(SELECT json_agg(user_skills_details.*) 
      FROM user_skills_details 
      WHERE user_skills_details.user_uuid = users.uuid) AS skills`,

        `(SELECT json_agg(user_social_media.*) 
      FROM user_social_media 
      WHERE user_social_media.user_uuid = users.uuid) AS social_media`,
      ])
      .where("users.uuid = :user_uuid", { user_uuid })
      .getRawOne();

    if (!users || users.users_deactivated === 0) {
      res.status(200).json({ status: false, message: `No user found` });
      return;
    }
    users.cv_url = users.cv_url ? process.env.AWS_URL + users.cv_url : null;

    users.profile_pic = users.profile_pic
      ? process.env.AWS_URL + users.profile_pic
      : null;

    let data;
    let userProfile = {
      experience: users.experience,
      languages_spoken: users.user_details_languages_spoken,
      city: users.user_details_city,
      about_you: users.user_details_about_you,
      cv_url: users.cv_url,
      profile_pic: users.profile_pic,
      created_at: users.user_details_created_at,
      updated_at: users.user_details_updated_at,
      education: users.education,
      skills: users.skills,
      user_role: users.user_details_user_role,
      state: users.user_details_state,
      gender: users.user_details_gender,
      cv_name: users.user_details_cv_name,
      social_media: users.social_media,
      country: users.user_details_country,
    };
    if (companyDetails?.plan_uuid === null) {
      data = {
        fullName: users.full_name,
        userProfile: userProfile,
      };
    } else {
      data = {
        fullName: users.full_name,
        mobile_number: users?.users_mobile_number,
        email: users?.users_email,
        userProfile: userProfile,
      };
    }

    res.status(200).json({ message: "profile found", status: true, data });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", status: false, err: err });
  }
};

export const getPostJobCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const company_uuid = req.user.userUuid;
  try {
    const jobRepository = AppDataSource.getRepository(Postjobs);
    const jobCount = await jobRepository.count({
      where: { user_uuid: company_uuid },
    });
    res
      .status(200)
      .json({ message: "Job count found", status: true, jobCount });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", status: false, err: err });
  }
};

export const getActiveJobCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const company_uuid = req.user.userUuid;
  try {
    const jobRepository = AppDataSource.getRepository(Postjobs);
    const activejobcount = await jobRepository
      .createQueryBuilder("job")
      .where("job.user_uuid = :company_uuid", { company_uuid })
      .andWhere("job.job_valid_days > 0")
      .getCount();
    res
      .status(200)
      .json({ message: "Job count found", status: true, activejobcount });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", status: false, err: err });
  }
};

export const getSavedCandidatesCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const company_uuid = req.user.userUuid;
  try {
    const savedCandidateRepository = AppDataSource.getRepository(ClientUsers);
    const result = await savedCandidateRepository
      .createQueryBuilder("client_users")
      .select([
        `(SELECT COUNT(DISTINCT company_saved_candidates.saved_candidates_uuid)
       FROM company_saved_candidates
       WHERE company_saved_candidates.company_uuid = :company_uuid
     ) AS saved_candidates_length`,
        `(SELECT COUNT(*)
       FROM post_jobs
       WHERE post_jobs.user_uuid = :company_uuid
       AND post_jobs.job_valid_days > 0
     ) AS activejobcount`,
      ])
      .setParameters({ company_uuid })
      .getRawOne();
    // const result = await savedCandidateRepository
    // .createQueryBuilder("client_users")
    // .leftJoin(
    //   CompanySavedCandidates,
    //   "company_saved_candidates",
    //   "client_users.user_uuid=company_saved_candidates.company_uuid"
    // )
    // .leftJoin(
    //   Postjobs,
    //   "post_jobs",
    //   "client_users.user_uuid=post_jobs.user_uuid"
    // )
    // .select([
    //   "COUNT(DISTINCT company_saved_candidates.saved_candidates_uuid) AS saved_candidates_length",
    //   "COUNT(CASE WHEN post_jobs.job_valid_days > 0 THEN 1 END) AS activejobcount",
    // ])
    // .where("company_saved_candidates.company_uuid = :company_uuid", {
    //   company_uuid,
    // })
    // .getRawOne();

    res.status(200).json({
      message: "Saved and active candidates count found",
      status: true,
      saved_candidates_length: isNaN(Number(result.saved_candidates_length))
        ? 0
        : Number(result.saved_candidates_length),
      activejobcount: isNaN(Number(result.activejobcount))
        ? 0
        : Number(result.activejobcount),
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", status: false, err: err });
  }
};

export const updateClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, mobile_number, designation, full_name } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
    const companyRepository = AppDataSource.getRepository(ClientUsers);

    const client_user = await companyRepository.findOneBy({ user_uuid });
    if (!client_user) {
      res.status(200).json({ status: false, message: `No user found` });
      return;
    }
    if (email) {
      const emailfinder = await companyRepository.findOneBy({ email });
      if (emailfinder?.user_uuid !== client_user.user_uuid) {
        res
          .status(204)
          .json({ status: false, message: `Already an email exists` });
        return;
      } else {
        client_user.email = email;
      }
    }
    if (mobile_number) {
      const mobilefinder = await companyRepository.findOneBy({ mobile_number });
      if (mobilefinder?.user_uuid !== client_user.user_uuid) {
        res
          .status(204)
          .json({ status: false, message: `Already a mobile number exists` });
        return;
      } else {
        client_user.mobile_number = mobile_number;
      }
    }
    if (full_name) {
      client_user.full_name = full_name;
    }
    if (designation) {
      client_user.designation = designation;
    }
    await companyRepository.save(client_user);
    res.status(200).json({ status: true, message: `Company profile updated` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Error" });
  }
};

export const updateClientPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { current_password, new_password } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
    const companyRepository = AppDataSource.getRepository(ClientUsers);

    const client_user = await companyRepository.findOneBy({ user_uuid });
    if (!client_user) {
      res.status(401).json({ status: false, message: `No user found` });
      return;
    }
    const isPasswordValid = comparePassword(
      client_user.password,
      current_password
    );
    if (!isPasswordValid) {
      res.status(401).json({ status: false, message: `Incorrect password` });
      return;
    }
    const newHashPassword = await hashPassword(new_password);
    client_user.password = newHashPassword;

    await companyRepository.save(client_user);
    res
      .status(200)
      .json({ status: true, message: `Credentails updated sucessfully` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Error" });
  }
};
