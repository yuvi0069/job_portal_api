import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ClientUsers } from "../entities/clientUsers";
import { validate } from "class-validator";
import dotenv from "dotenv";
import { CompanyProfiles } from "../entities/companyProfiles";
import { Postjobs } from "../entities/postjobs";
import { uploadImageToS3 } from "../utils/uploadimages";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { Users } from "../entities/user";
import { UserDetails } from "../entities/userDetails";
import { PostJobSkill } from "../entities/postJobSkills";
import { PostJobLanguage } from "../entities/postJobLanguages";
import { PostJobBenefit } from "../entities/postJobBenefits";
import { PostJobCategory } from "../entities/postJobCategory";
import { CompanySocialMedia } from "../entities/companySocialLinks";
dotenv.config();

export const getAllCompanyProfile = async (req: Request, res: Response) => {
  const { filter, page_no } = req.headers;
  try {
    const clientRepository = AppDataSource.getRepository(ClientUsers);
    const filter_by = String(filter);
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const pageSize = 5;
    const skip = (page - 1) * pageSize;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let clientUser, total;
    // if(filter){
    //         if (emailRegex.test(filter)){

    //             clientUser = await clientRepository
    //             .createQueryBuilder('clientUser')
    //             .leftJoin('clientUser.company_profile', 'companyProfile')
    //             .leftJoin('clientUser.postJobs', 'postJobs')
    //             .select(["clientUser.user_uuid","clientUser.email","clientUser.mobile_number","companyProfile.company_name","companyProfile.company_logo","companyProfile.company_location","clientUser.deactivated","COUNT(postJobs.id) AS postJobsCount"])
    //             .where("clientUser.email like :email",{email:`%${filter}%`})
    //             .groupBy('clientUser.user_uuid')
    //             .addGroupBy('companyProfile.company_name')
    //             .addGroupBy('companyProfile.company_logo')
    //             .addGroupBy('companyProfile.company_location')
    //             .addGroupBy('clientUser.email')
    //             .addGroupBy('clientUser.mobile_number')
    //             .addGroupBy('clientUser.deactivated')
    //             .limit(pageSize)
    //             .offset(skip)
    //             .getRawMany();
    //             total=await clientRepository.createQueryBuilder('clientUser')
    //             .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
    //             .leftJoin('clientUser.postJobs', 'postJobs')
    //             .where("clientUser.email like :email",{email:`%${filter}%`})
    //             .getCount();

    //         }
    //         else{
    //             clientUser = await clientRepository
    //             .createQueryBuilder('clientUser')
    //             .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
    //             .leftJoin('clientUser.postJobs', 'postJobs')
    //             .select(["clientUser.user_uuid","clientUser.email","clientUser.mobile_number","companyProfile.company_name","companyProfile.company_logo","companyProfile.company_location","clientUser.deactivated","COUNT(postJobs.id) AS postJobsCount"])
    //             .where("companyProfile.company_name like :name",{name:`%${filter}%`})
    //             .groupBy('clientUser.user_uuid')
    //             .addGroupBy('companyProfile.company_name')
    //             .addGroupBy('companyProfile.company_logo')
    //             .addGroupBy('companyProfile.company_location')
    //             .addGroupBy('clientUser.email')
    //             .addGroupBy('clientUser.mobile_number')
    //             .addGroupBy('clientUser.deactivated')
    //             .limit(pageSize)
    //             .offset(skip)
    //             .getRawMany();
    //             total=await clientRepository.createQueryBuilder('clientUser')
    //             .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
    //             .leftJoin('clientUser.postJobs', 'postJobs')
    //             .where("companyProfile.company_name like :name",{name:`%${filter}%`})
    //             .getCount();

    //         }

    //     }
    //     else{
    //     clientUser = await clientRepository
    //       .createQueryBuilder('clientUser')
    //       .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
    //       .leftJoin('clientUser.postJobs', 'postJobs')
    //       .select(["clientUser.user_uuid","clientUser.email","clientUser.mobile_number","companyProfile.company_name","companyProfile.company_logo","companyProfile.company_location","clientUser.deactivated","COUNT(postJobs.id) AS postJobsCount"])
    //       .groupBy('clientUser.user_uuid')
    //       .addGroupBy('companyProfile.company_name')
    //       .addGroupBy('companyProfile.company_logo')
    //       .addGroupBy('companyProfile.company_location')
    //       .addGroupBy('clientUser.email')
    //       .addGroupBy('clientUser.mobile_number')
    //       .addGroupBy('clientUser.deactivated')
    //       .limit(pageSize)
    //       .offset(skip)
    //       .getRawMany();

    //     total=await clientRepository.createQueryBuilder('clientUser')
    //     .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
    //     .leftJoin('clientUser.postJobs', 'postJobs')
    //     .getCount();
    //     }
    let filterConditions: any = {};
    if (filter) {
      if (emailRegex.test(filter_by)) {
        filterConditions["clientUser.email"] = `%${filter_by}%`;
      } else {
        filterConditions["companyProfile.company_name"] = `%${filter_by}%`;
      }
    }

    let query = AppDataSource.getRepository(ClientUsers)
      .createQueryBuilder("clientUser")
      .leftJoin("clientUser.company_profile", "companyProfile")
      .leftJoin("clientUser.postJobs", "postJobs")
      .select([
        "clientUser.user_uuid",
        "clientUser.email",
        "clientUser.mobile_number",
        "companyProfile.company_name",
        "companyProfile.company_logo",
        "companyProfile.company_location",
        "clientUser.created_date",
        "clientUser.deactivated",
        "COUNT(postJobs.id) AS postJobsCount",
      ])
      .groupBy("clientUser.user_uuid")
      .addGroupBy("companyProfile.company_name")
      .addGroupBy("companyProfile.company_logo")
      .addGroupBy("companyProfile.company_location")
      .addGroupBy("clientUser.email")
      .addGroupBy("clientUser.mobile_number")
      .addGroupBy("clientUser.deactivated")
      .addGroupBy("clientUser.created_date")
      .orderBy("clientUser.created_date", "DESC")
      .limit(pageSize)
      .offset(skip);

    Object.keys(filterConditions).forEach((key) => {
      query = query.andWhere(`${key} ILIKE :${key}`, {
        [key]: filterConditions[key],
      });
    });

    clientUser = await query.getRawMany();

    let totalQuery = AppDataSource.getRepository(ClientUsers)
      .createQueryBuilder("clientUser")
      .leftJoin("clientUser.company_profile", "companyProfile")
      .leftJoin("clientUser.postJobs", "postJobs");

    Object.keys(filterConditions).forEach((key) => {
      totalQuery = totalQuery.andWhere(`${key} ILIKE :${key}`, {
        [key]: filterConditions[key],
      });
    });

    total = await totalQuery.getCount();

    res.status(200).json({
      status: true,
      message: "Company profiles found",
      data: clientUser,
      env: process.env.AWS_URL,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(Number(total) / pageSize),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error });
  }
};
// export const updateCompanyProfileByAdmin = async (
//   req: Request,
//   res: Response
// ) => {
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
//     company_social_media_id,
//     company_social_media_id_delete,
//   } = req.body;
//   const files = req.files as { [key: string]: Express.Multer.File[] };
//   const company_logo = files?.["company_logo"]?.[0] || null;
//   const company_banner = files?.["company_banner"]?.[0] || null;
//   const userRepository = AppDataSource.getRepository(ClientUsers);
//   const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles);
//   try {
//     const { user_uuid } = req.headers;
//     const uuid = String(user_uuid);
//     const clientUser = await userRepository.findOneBy({ user_uuid: uuid });

//     if (!clientUser || clientUser.deactivated === 1) {
//       res.status(404).json({ status: false, message: "User not found" });
//       return;
//     }

//     let companyProfile = await companyProfileRepository.findOneBy({
//       client_user_uuid: clientUser.user_uuid,
//     });
//     let company_founded;

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
//         e.id = uuidv4();
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
// export const getCompanyProfileByAdmin = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const userRepository = AppDataSource.getRepository(ClientUsers);
//   const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles);

//   try {
//     const { user_uuid } = req.headers;
//     const uuid = String(user_uuid);
//     console.log("user_uuid:", user_uuid);
//     const [clientUser, companyProfile] = await Promise.all([
//       userRepository.findOne({
//         where: { user_uuid: uuid },
//         select: ["email", "mobile_number", "full_name", "designation"],
//         order: { created_date: "DESC" },
//       }),
//       companyProfileRepository.findOneBy({ client_user_uuid: uuid }),
//     ]);

//     if (!clientUser || clientUser.deactivated === 1) {
//       res.status(404).json({ status: false, message: "User not found" });
//       return;
//     }
//     let company_b;
//     let company_l;
//     if (process.env.AWS_URL) {
//       if (companyProfile?.company_banner) {
//         company_b = process.env.AWS_URL + companyProfile.company_banner;
//       }
//       if (companyProfile?.company_logo) {
//         company_l = process.env.AWS_URL + companyProfile.company_logo;
//       }
//     }

//     if (companyProfile) {
//       res.status(200).json({
//         status: true,
//         message: "Company profile get successfully",
//         company_profile: {
//           company_name: companyProfile.company_name,
//           company_logo: company_l,
//           company_size: companyProfile.company_size,
//           company_industry: companyProfile.company_industry,
//           company_website: companyProfile.company_website,
//           company_location: companyProfile.company_location,
//           company_founded_year: companyProfile.company_founded_year,
//           company_contact: companyProfile.company_contact,
//           company_description: companyProfile.company_description,
//           company_vision: companyProfile.company_vision,
//           company_banner: company_b,
//           company_social_media_link: companyProfile.company_social_media_links,
//           created_date: companyProfile.created_date,
//           updated_date: companyProfile.updated_date,
//           profile_completion: companyProfile.profile_completion,
//           email: clientUser.email,
//           mobile_number: clientUser.mobile_number,
//           designation: clientUser.designation,
//         },
//       });
//     } else {
//       res.status(200).json({
//         status: false,
//         message: `company profile not there`,
//         company_profile: {
//           email: clientUser.email,
//           mobile_number: clientUser.mobile_number,
//           country_code: clientUser.country_code,
//         },
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "Error processing company profile",
//       error,
//     });
//   }
// };
// export const getCompanyProfileByAdmin = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const cleintRepository = AppDataSource.getRepository(ClientUsers);

//   try {
//     const user_uuid = String(req.headers.user_uuid);
//     console.log("user_uuid:", user_uuid);
//     const clientUser = await cleintRepository
//       .createQueryBuilder("user")
//       .leftJoinAndSelect(
//         "company_profiles",
//         "company",
//         "company.client_user_uuid = user.user_uuid"
//       )
//       .select([
//         "user.email",
//         "user.mobile_number",
//         "user.country_code",
//         "user.full_name",
//         "user.designation",
//         "company.company_name",
//         "company.company_logo",
//         "company.company_banner",
//         "company.company_size",
//         "company.company_industry",
//         "company.company_website",
//         "company.company_location",
//         "company.company_founded_year",
//         "company.company_contact",
//         "company.company_description",
//         "company.company_vision",
//         "company.company_social_media_links",
//         "company.created_date",
//         "company.updated_date",
//         "company.profile_completion",
//       ])
//       .where("user.user_uuid = :user_uuid", { user_uuid })
//       .getRawOne();

//     // const [clientUser, companyProfile] = await Promise.all([
//     //   userRepository.findOne({
//     //     where: { user_uuid },
//     //     select: [
//     //       "email",
//     //       "mobile_number",
//     //       "country_code",
//     //       "full_name",
//     //       "designation",
//     //     ],
//     //   }),
//     //   companyProfileRepository.findOneBy({ client_user_uuid: user_uuid }),
//     // ]);

//     if (!clientUser || clientUser.user_deactivated === 1) {
//       res.status(404).json({ status: false, message: "User not found" });
//       return;
//     }

//     const awsUrl = process.env.AWS_URL || "";
//     if (clientUser.company_company_name) {
//       res.status(200).json({
//         status: true,
//         message: "Company profile get successfully",
//         company_profile: {
//           company_name: clientUser.company_company_name,
//           company_logo: clientUser.company_company_logo
//             ? awsUrl + clientUser.company_company_logo
//             : undefined,
//           company_banner: clientUser.company_company_banner
//             ? awsUrl + clientUser.company_company_banner
//             : undefined,
//           company_size: clientUser.company_company_size,
//           company_industry: clientUser.company_company_industry,
//           company_website: clientUser.company_company_website,
//           company_location: clientUser.company_company_location,
//           company_founded_year: clientUser.company_company_founded_year,
//           company_contact: clientUser.company_company_contact,
//           company_description: clientUser.company_company_description,
//           company_vision: clientUser.company_company_vision,
//           company_social_media_link:
//             clientUser.company_company_social_media_links,
//           created_date: clientUser.company_created_date,
//           updated_date: clientUser.company_updated_date,
//           profile_completion: clientUser.company_profile_completion,
//           email: clientUser.user_email,
//           mobile_number: clientUser.user_mobile_number,
//           country_code: clientUser.user_country_code,
//           designation: clientUser.user_designation,
//           fullName: clientUser.user_full_name,
//         },
//       });
//       return;
//     } else {
//       res.status(200).json({
//         status: false,
//         message: "Company profile not there",
//         company_profile: {
//           email: clientUser.user_email,
//           mobile_number: clientUser.user_mobile_number,
//           country_code: clientUser.user_country_code,
//           designation: clientUser.user_designation,
//           fullName: clientUser.user_full_name,
//         },
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: "Error processing company profile",
//       error,
//     });
//   }
// };
export const getCompanyProfileByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cleintRepository = AppDataSource.getRepository(ClientUsers);

  try {
    const user_uuid = String(req.headers.user_uuid);
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
export const updateClientByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, mobile_number, designation, full_name } = req.body;
  try {
    const { user_uuid } = req.headers;
    const uuid = String(user_uuid);
    const clientRepository = AppDataSource.getRepository(ClientUsers);

    const client_user = await clientRepository.findOneBy({ user_uuid: uuid });
    if (client_user) {
      if (email) {
        const emailfinder = await clientRepository.findOneBy({ email });
        if (
          emailfinder?.user_uuid !== client_user.user_uuid &&
          emailfinder?.email !== undefined
        ) {
          res
            .status(200)
            .json({ status: false, message: "Email already exist" });
          return;
        }
        client_user.email = email;
      }
      if (mobile_number) {
        const mobilefinder = await clientRepository.findOneBy({
          mobile_number,
        });
        if (
          mobilefinder?.user_uuid !== client_user.user_uuid &&
          mobilefinder?.mobile_number !== undefined
        ) {
          res
            .status(200)
            .json({ status: false, message: "Mobile already exist" });
          return;
        }
        client_user.mobile_number = mobile_number;
      }
      if (designation) {
        client_user.designation = designation;
      }
      if (full_name) {
        client_user.full_name = full_name;
      }
      await clientRepository.save(client_user);
      res
        .status(200)
        .json({ status: true, message: "Details changed successfully" });
      return;
    } else {
      res.status(200).json({ status: false, message: "Details not found" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Error" });
  }
};

export const addUpdateCompanyBasicInfoByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { company_name, company_description } = req.body;
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const company_logo = files?.["company_logo"]?.[0] || null;
  const company_banner = files?.["company_banner"]?.[0] || null;
  const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles);

  try {
    const user_uuid = String(req.headers.user_uuid);

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
export const addUpdateCompanyFoundingInfoByAdmin = async (
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
    const user_uuid = String(req.headers.user_uuid);

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
export const addCompanySocialMediaLinksByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company_uuid = String(req.headers.user_uuid);
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
      message: "Error deleting user details",
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
export const deleteCompanySocialMediaLinksByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { company_social_media_id_delete } = req.query;
  try {
    const company_uuid = String(req.headers.user_uuid);
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

export const postJobByAdmin = async (req: Request, res: Response) => {
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
    categories,
    age_group,
    gender,
    skills,
    benefits,
    languages,
  } = req.body;

  const userRepository = AppDataSource.getRepository(ClientUsers);
  const adminUuid = req.user.userUuid;
  const companyRepository = AppDataSource.getRepository(CompanyProfiles);
  const jobRepository = AppDataSource.getRepository(Postjobs);
  const jobCategoryRepository = AppDataSource.getRepository(PostJobCategory);
  const jobBenefitsRepository = AppDataSource.getRepository(PostJobBenefit);
  const jobLanguageRepository = AppDataSource.getRepository(PostJobLanguage);
  const jobSkillRepository = AppDataSource.getRepository(PostJobSkill);
  try {
    const { user_uuid } = req.headers;
    const useruuid = String(user_uuid);
    console.log("user_uuid:", user_uuid);

    const clientUser = await userRepository.findOneBy({ user_uuid: useruuid });

    if (!clientUser) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
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
    const jobPost = new Postjobs();
    jobPost.user_uuid = clientUser.user_uuid;
    jobPost.job_title = job_title;
    if (tag && tag.length > 2) {
      jobPost.tag = tag;
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
    jobPost.admin_posted_uuid = String(adminUuid);
    if (job_description && job_description.length > 2) {
      jobPost.job_description = job_description;
    }
    // if (companyUser) {
    //   jobPost.company_name = companyUser?.company_name;
    //   jobPost.company_logo = companyUser?.company_logo;
    // }
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
    //const validationErrors = await validate(jobPost);

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
        // // jobData: {
        // //   id: savedJobPost.id,
        // //   user_uuid: savedJobPost.user_uuid,
        // //   job_title: savedJobPost.job_title,
        // //   tag: savedJobPost.tag,
        // //   job_role: savedJobPost.job_role,
        // //   min_salary: savedJobPost.min_salary,
        // //   max_salary: savedJobPost.max_salary,
        // //   education: savedJobPost.education,
        // //   experience: savedJobPost.experience,
        // //   job_type: savedJobPost.job_type,
        // //   vacancies: savedJobPost.vacancies,
        // //   expirationDate: savedJobPost.expirationDate,
        // //   job_level: savedJobPost.job_level,
        // //   state: savedJobPost.state,
        // //   city: savedJobPost.city,
        // //   company_name: savedJobPost.company_name,
        // //   job_description: savedJobPost.job_description,
        // //   created_date: savedJobPost.created_date,
        // //   updated_date: savedJobPost.updated_date,
        // //   company_logo: savedJobPost.company_logo
        // //     ? process.env.AWS_URL + savedJobPost.company_logo
        // //     : null,
        // },
      });
  } catch (error) {
    console.error("Error creating job post:", error);
    res
      .status(500)
      .json({ status: false, message: "Error processing job post", error });
  }
};
export const deleteClientByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_uuid, filter } = req.body;
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
      if (filter === "Delete") companyProfile.deactivated = 1;
      if (filter === "Restore") companyProfile.deactivated = 0;
    }
    if (filter === "Delete") {
      clientUser.deactivated = 1;
      clientUser.deleted_date = new Date();
      clientUser.deletedBy = req.user.userUuid;
      clientUser.token = null;
      await userRepository.save(clientUser);
      res.status(200).json({
        status: true,
        message: "Client and company profile deleted successfully",
      });
      return;
    }
    if (filter === "Restore" && clientUser.deactivated === 1) {
      clientUser.deactivated = 0;
      clientUser.restore_date = new Date();
      clientUser.restoredby = req.user.userUuid;
      await userRepository.save(clientUser);
      res.status(200).json({
        status: true,
        message: "Client and company profile restored successfully",
      });
      return;
    }

    res
      .status(200)
      .json({ status: true, message: "Client and company profile not found" });

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

export const getGlobalJobSeekerByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_uuid } = req.headers;
  try {
    const userRepository = AppDataSource.getRepository(Users);

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
    users.cv_url = process.env.AWS_URL + users.cv_url;

    users.profile_pic = process.env.AWS_URL + users.profile_pic;

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
    let data = {
      fullName: users.full_name,
      mobile_number: users?.users_mobile_number,
      email: users?.users_email,
      userProfile: userProfile,
    };

    res.status(200).json({ message: "profile found", status: true, data });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", status: false, err: err });
  }
};
