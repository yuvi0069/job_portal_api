import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import dotenv from "dotenv";
import { Users } from "../entities/user";
import { uploadImageToS3 } from "../utils/uploadimages";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { UserDetails } from "../entities/userDetails";
import { UserExperience } from "../entities/userExperience";
import { UserEducation } from "../entities/userEducation";
import { UserSkills } from "../entities/userSkills";
import { UserSocialMedia } from "../entities/userSocialLink";
dotenv.config();

export const getAllJobSeeker = async (req: Request, res: Response) => {
  const { page_no, filter } = req.headers;
  try {
    const filter_by = String(filter);
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const pageSize = 25;
    const skip = (page - 1) * pageSize;
    let usersWithApplications, total;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const phoneRegex = /^\d{1,10}$/;

    // if(filter){
    //  if (emailRegex.test(filter)) {

    //    usersWithApplications = await AppDataSource.getRepository(Users)
    //     .createQueryBuilder('user')
    //     .leftJoin('user.jobs', 'jobApplication')
    //     .leftJoin('user.details','userDetails')
    //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
    //     .where("user.email like :email",{email:`%${filter}%`})
    //     .groupBy('user.uuid')
    //     .addGroupBy('user.email')
    //     .addGroupBy('user.deactivated')
    //     .addGroupBy('user.first_name')
    //     .addGroupBy('user.last_name')
    //     .addGroupBy('user.mobile_number')
    //     .addGroupBy('userDetails.profile_pic')
    //     .addGroupBy('userDetails.gender')
    //     .addGroupBy('userDetails.user_role')
    //     .addGroupBy('userDetails.state')
    //     .addGroupBy('userDetails.city')
    //     .limit(pageSize)
    //     .offset(skip)
    //     .getRawMany();
    // total=await AppDataSource.getRepository(Users)
    // .createQueryBuilder('user')
    // .leftJoin('user.jobs', 'jobApplication')  // Join with JobApplication using the 'jobs' relationship
    // .leftJoin('user.details','userDetails')
    // .where("user.email like :email",{email:`%${filter}%`})
    // .getCount();

    //  } else if (phoneRegex.test(filter)) {

    //    usersWithApplications = await AppDataSource.getRepository(Users)
    //     .createQueryBuilder('user')
    //     .leftJoin('user.jobs', 'jobApplication')
    //     .leftJoin('user.details','userDetails')
    //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
    //     .where("user.mobile_number like :mobile_number",{mobile_number:`%${filter}%`})
    //     .groupBy('user.uuid')
    //     .addGroupBy('user.email')
    //     .addGroupBy('user.deactivated')
    //     .addGroupBy('userDetails.state')
    //     .addGroupBy('userDetails.city')
    //     .addGroupBy('user.first_name')
    //     .addGroupBy('user.last_name')
    //     .addGroupBy('user.mobile_number')
    //     .addGroupBy('userDetails.profile_pic')
    //     .addGroupBy('userDetails.gender')
    //     .addGroupBy('userDetails.user_role')
    //     .limit(pageSize)
    //     .offset(skip)
    //     .getRawMany();
    // total=await AppDataSource.getRepository(Users)
    // .createQueryBuilder('user')
    // .leftJoin('user.jobs', 'jobApplication')  // Join with JobApplication using the 'jobs' relationship
    // .leftJoin('user.details','userDetails')
    // .where("user.mobile_number like :mobile_number",{mobile_number:`%${filter}%`})
    // .getCount();

    //  } else  {

    //    usersWithApplications = await AppDataSource.getRepository(Users)
    //     .createQueryBuilder('user')
    //     .leftJoin('user.jobs', 'jobApplication')
    //     .leftJoin('user.details','userDetails')
    //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
    //     .where("user.first_name like :name",{name:`%${filter}%`})
    //     .groupBy('user.uuid')
    //     .addGroupBy('user.email')
    //     .addGroupBy('user.deactivated')
    //     .addGroupBy('user.first_name')
    //     .addGroupBy('user.last_name')
    //     .addGroupBy('user.mobile_number')
    //     .addGroupBy('userDetails.profile_pic')
    //     .addGroupBy('userDetails.gender')
    //     .addGroupBy('userDetails.user_role')
    //     .addGroupBy('userDetails.state')
    //     .addGroupBy('userDetails.city')
    //     .limit(pageSize)
    //     .offset(skip)
    //     .getRawMany();
    // total=await AppDataSource.getRepository(Users)
    // .createQueryBuilder('user')
    // .leftJoin('user.jobs', 'jobApplication')  // Join with JobApplication using the 'jobs' relationship
    // .leftJoin('user.details','userDetails')
    // .where("user.first_name like :name",{name:`%${filter}%`})
    // .getCount();

    //  }
    //  } else {
    //    usersWithApplications = await AppDataSource.getRepository(Users)
    //     .createQueryBuilder('user')
    //     .leftJoin('user.jobs', 'jobApplication')
    //     .leftJoin('user.details','userDetails')
    //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
    //     .groupBy('user.uuid')
    //     .addGroupBy('user.email')
    //     .addGroupBy('user.deactivated')
    //     .addGroupBy('user.first_name')
    //     .addGroupBy('user.last_name')
    //     .addGroupBy('user.mobile_number')
    //     .addGroupBy('userDetails.profile_pic')
    //     .addGroupBy('userDetails.gender')
    //     .addGroupBy('userDetails.user_role')
    //     .addGroupBy('userDetails.state')
    //     .addGroupBy('userDetails.city')
    //     .limit(pageSize)
    //     .offset(skip)
    //     .getRawMany();
    // total=await AppDataSource.getRepository(Users)
    // .createQueryBuilder('user')
    // .leftJoin('user.jobs', 'jobApplication')
    // .leftJoin('user.details','userDetails')
    // .getCount();

    //  }
    let filterConditions: any = {};
    if (filter) {
      if (emailRegex.test(filter_by)) {
        filterConditions["user.email"] = `%${filter_by}%`;
      } else if (phoneRegex.test(filter_by)) {
        filterConditions["user.mobile_number"] = `%${filter_by}%`;
      } else {
        filterConditions["user.full_name"] = `%${filter_by}%`;
      }
    }

    let query = AppDataSource.getRepository(Users)
      .createQueryBuilder("user")
      .leftJoin("user.jobs", "jobApplication")
      .leftJoin("user.details", "userDetails")
      .select([
        "user.uuid",
        "user.email",
        "user.full_name",
        "user.mobile_number",
        "userDetails.profile_pic",
        "userDetails.gender",
        "userDetails.user_role",
        "COUNT(jobApplication.application_id) AS JobsCount",
        "userDetails.city",
        "userDetails.state",
        "user.deactivated",
        "user.created_at",
      ])
      .groupBy("user.uuid")
      .addGroupBy("user.email")
      .addGroupBy("user.deactivated")
      .addGroupBy("user.full_name")
      .addGroupBy("user.mobile_number")
      .addGroupBy("userDetails.profile_pic")
      .addGroupBy("userDetails.gender")
      .addGroupBy("userDetails.user_role")
      .addGroupBy("userDetails.state")
      .addGroupBy("userDetails.city")
      .addGroupBy("user.created_at")
      .orderBy("user.created_at", "DESC")
      .limit(pageSize)
      .offset(skip);

    Object.keys(filterConditions).forEach((key) => {
      query = query.andWhere(`${key} ILIKE :${key}`, {
        [key]: filterConditions[key],
      });
    });

    usersWithApplications = await query.getRawMany();

    let totalQuery = AppDataSource.getRepository(Users)
      .createQueryBuilder("user")
      .leftJoin("user.jobs", "jobApplication")
      .leftJoin("user.details", "userDetails");

    Object.keys(filterConditions).forEach((key) => {
      totalQuery = totalQuery.andWhere(`${key} ILIKE :${key}`, {
        [key]: filterConditions[key],
      });
    });

    total = await totalQuery.getCount();

    res.status(200).json({
      status: true,
      message: "Employer list found",
      data: usersWithApplications,
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
// export const getUserProfileByAdmin = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const userRepository = AppDataSource.getRepository(Users);
//   const userDetailsRepository = AppDataSource.getRepository(UserDetails);
//   try {
//     const { user_uuid } = req.headers;
//     const uuid = String(user_uuid);
//     const user = await userRepository.findOneBy({ uuid });

//     if (!user) {
//       res.status(404).json({ status: false, message: "User not found" });
//       return;
//     }

//     const userDetails = await userDetailsRepository.findOneBy({
//       user_uuid: uuid,
//     });
//     let cv_url, profile_pic_url;
//     if (process.env.AWS_URL && userDetails?.profile_pic) {
//       profile_pic_url = process.env.AWS_URL + userDetails?.profile_pic;
//     }
//     if (process.env.AWS_URL && userDetails?.cv_url) {
//       cv_url = process.env.AWS_URL + userDetails?.cv_url;
//     }

//     res.status(200).json({
//       status: true,
//       message: "User profile fetched successfully",
//       userData: {
//         id: user.id,
//         uuid: user.uuid,
//         fullName: user.fullName,
//         email: user.email,
//         mobile_number: user.mobile_number,
//         date_of_birth: user.date_of_birth,
//         created_at: user.created_at,
//         ispin: user.ispin,
//         pin: user.pin,
//         country_code: user.country_code,
//         email_verified: user.email_verified,
//         userDetails: userDetails
//           ? {
//               id: userDetails.id,
//               languages_spoken: userDetails.languages_spoken,
//               skills: userDetails.skills,
//               city: userDetails.city,
//               state: userDetails.state,
//               about_you: userDetails.about_you,
//               cv_url: cv_url,
//               is_fresher: userDetails.is_fresher,
//               experience: userDetails.experience,
//               created_at: userDetails.created_at,
//               updated_at: userDetails.updated_at,
//               education: userDetails.education,
//               gender: userDetails.gender,
//               cv_name: userDetails.cv_name,
//               user_role: userDetails.user_role,
//               profile_pic: profile_pic_url,
//               social_media: userDetails.social_media,
//               profile_completion: userDetails.profile_completion,
//             }
//           : null,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: false, message: "Error fetching user", error });
//   }
// };
export const getUserProfileByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_uuid = String(req.headers.user_uuid);

  const userRepository = AppDataSource.getRepository(Users);
  //const userDetailsRepository = AppDataSource.getRepository(UserDetails);

  try {
    const user = await userRepository.findOneBy({ uuid: user_uuid });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    const userDetails = await userRepository
      .createQueryBuilder("users")
      .leftJoin(
        UserDetails,
        "user_details",
        "users.uuid = user_details.user_uuid"
      )
      .where("users.uuid = :user_uuid", { user_uuid })
      .select([
        "users.uuid",
        "users.email",
        "users.mobile_number",
        "users.full_name",
        "users.date_of_birth",
        "users.email_verified",
        "users.country_code",
        "users.pin",
        "users.ispin",
        "users.created_at",
        "user_details.languages_spoken",
        "user_details.city",
        "user_details.state",
        "user_details.about_you",
        "user_details.cv_url",
        "user_details.created_at",
        "user_details.updated_at",
        "user_details.gender",
        "user_details.cv_name",
        "user_details.user_role",
        "user_details.profile_pic",
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
      .getRawOne();

    // const userDetails = await userDetailsRepository.findOneBy({ user_uuid });
    let cv_url = null,
      profile_pic_url = null;
    console.log(userDetails);
    if (process.env.AWS_URL && userDetails?.user_details_profile_pic) {
      profile_pic_url =
        process.env.AWS_URL + userDetails.user_details_profile_pic;
    }
    if (process.env.AWS_URL && userDetails?.user_details_cv_url) {
      cv_url = process.env.AWS_URL + userDetails.user_details_cv_url;
    }
    //console.log(userDetails);
    res.status(200).json({
      status: true,
      message: "User profile fetched successfully",
      userData: {
        uuid: userDetails.users_uuid,
        fullName: userDetails.full_name,
        email: userDetails.users_email,
        mobile_number: userDetails.users_mobile_number,
        date_of_birth: userDetails.users_date_of_birth,
        created_at: userDetails.users_created_at,
        ispin: userDetails.users_ispin,
        pin: userDetails.users_pin,
        country_code: userDetails.users_country_code,
        email_verified: userDetails.users_email_verified,
        userDetails: {
          languages_spoken: userDetails.user_details_languages_spoken,
          skills: userDetails.skills,
          city: userDetails.user_details_city,
          state: userDetails.user_details_state,
          about_you: userDetails.user_details_about_you,
          cv_url: cv_url,
          is_fresher: userDetails.user_details_is_fresher,
          experience: userDetails.experience,
          created_at: userDetails.user_details_created_at,
          updated_at: userDetails.user_details_updated_at,
          education: userDetails.education,
          gender: userDetails.user_details_gender,
          cv_name: userDetails.user_details_cv_name,
          user_role: userDetails.user_details_user_role,
          profile_pic: profile_pic_url,
          social_media: userDetails.social_media,
          profile_completion: userDetails.user_details_profile_completion,
          country: userDetails.user_details_country,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Error fetching user", error });
  }
};

export const updateUserByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, mobile_number, name } = req.body;

  const { user_uuid } = req.headers;
  const uuid = String(user_uuid);

  if (!uuid) {
    res.status(401).json({ status: false, message: "Unauthorized" });
    return;
  }

  const userRepository = AppDataSource.getRepository(Users);
  const user = await userRepository.findOneBy({ uuid });

  if (!user) {
    res.status(404).json({ status: false, message: "User not found." });
    return;
  }

  try {
    if (email) {
      user.email = email;
    }
    if (mobile_number) {
      user.mobile_number = mobile_number;
    }
    if (name) {
      user.fullName = name;
    }
    await userRepository.save(user);
    res
      .status(200)
      .json({ status: true, message: "User updated successfully!", user });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Error updating user.", error });
  }
};
export const updateUserProfileByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    fullName,

    email,
    mobile_number,
    languages_spoken,
    //skills,
    city,
    state,
    about_you,
    // education,
    // social_media,
    // social_media_id,
    // social_media_id_delete,
    //cv_url,
    //is_fresher,
    // experience,
    // experience_id,
    // experience_id_delete,
    // education_id_delete,
    // skill_id_delete,
    // education_id,
    // skills_id,
    gender,
    //cv_name,
    user_role,
  } = req.body;

  const { user_uuid } = req.headers;
  const uuid = String(user_uuid);
  const userRepository = AppDataSource.getRepository(Users);
  const userDetailsRepository = AppDataSource.getRepository(UserDetails);
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const profile_pic = files?.["profile_pic"]?.[0] || null;
  //const resume = files?.["resume"]?.[0] || null;

  try {
    const user = await userRepository.findOneBy({ uuid });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    if (fullName) {
      //             let first_name,last_name;
      //    const spilted_name=user_name.split(' ');
      //    if (spilted_name.length >= 3) {
      //        first_name = spilted_name[0];
      //        last_name = spilted_name.slice(1).join(' ');
      //    }
      //      else{
      //    first_name = spilted_name[0];
      //    last_name = spilted_name[1];
      //      }
      user.fullName = fullName;
    }
    if (email) {
      const userverify = await userRepository.findOneBy({ email });
      if (userverify) {
        if (userverify?.uuid !== user.uuid) {
          res
            .status(404)
            .json({ status: false, message: "alraedy a registered user" });
          return;
        }
      }
      user.email = email;
    }
    if (mobile_number) {
      const userverify = await userRepository.findOneBy({ mobile_number });
      if (userverify) {
        if (userverify?.uuid !== user.uuid) {
          res
            .status(404)
            .json({ status: false, message: "alraedy a registered user" });
          return;
        }
      }
      user.mobile_number = mobile_number;
    }
    await userRepository.save(user);
    let userDetails = await userDetailsRepository.findOneBy({
      user_uuid: uuid,
    });

    // const exp = userDetails?.experience || [];
    // const edu = userDetails?.education || [];
    // const skillsList = userDetails?.skills || [];
    // const social_links = userDetails?.social_media || [];
    // if (experience && experience_id === undefined) {
    //   experience.id = uuidv4();
    //   exp.push(experience);
    // }

    // if (education && education_id === undefined) {
    //   education.id = uuidv4();
    //   edu.push(education);
    // }

    // if (skills && skills_id === undefined) {
    //   skills.id = uuidv4();
    //   skillsList.push(skills);
    // }

    // let socialLinks: any[] = [];
    // if (social_media && social_media_id === undefined) {
    //   socialLinks = JSON.parse(social_media);
    //   socialLinks.forEach((e: any) => {
    //     e.id = uuidv4();
    //     social_links.push(e);
    //   });
    // }

    let profile_pic_url: any;
    //let resume_url: any;
    let name = uuid;
    let name1 = uuid;

    // if (resume) {
    //   const { buffer, mimetype } = resume;
    //   name += "_resume";
    //   const fileStream = Readable.from(buffer);
    //   await uploadImageToS3(fileStream, "userdata", name, mimetype);
    //   resume_url = "/userdata/" + name;
    // }

    if (profile_pic) {
      const { buffer, mimetype, filename } = profile_pic;
      name1 += "_profile_pic";
      const fileStream = Readable.from(buffer);
      await uploadImageToS3(fileStream, "userdata", name1, mimetype);
      profile_pic_url = "/userdata/" + name1;
    }

    if (userDetails) {
      if (
        user_role &&
        state &&
        city &&
        userDetails.user_role === null &&
        userDetails.state === null &&
        userDetails.city === null
      ) {
        userDetails.profile_completion =
          userDetails.profile_completion !== 0
            ? userDetails.profile_completion + 20
            : 20;
      }
      // if (
      //   education &&
      //   edu.length > 0 &&
      //   userDetails.education.length == 1 &&
      //   education_id_delete === undefined &&
      //   education_id === undefined
      // ) {
      //   userDetails.profile_completion =
      //     userDetails.profile_completion !== 0
      //       ? userDetails.profile_completion + 30
      //       : 30;
      // }
      // if (
      //   experience &&
      //   exp.length > 0 &&
      //   userDetails.experience.length === 1 &&
      //   experience_id_delete === undefined &&
      //   experience_id === undefined
      // ) {
      //   userDetails.profile_completion =
      //     userDetails.profile_completion !== 0
      //       ? userDetails.profile_completion + 17
      //       : 17;
      // }
      // if (
      //   skills &&
      //   skillsList.length > 0 &&
      //   userDetails.skills.length === 1 &&
      //   skill_id_delete === undefined &&
      //   skills_id === undefined
      // ) {
      //   userDetails.profile_completion =
      //     userDetails.profile_completion !== 0
      //       ? userDetails.profile_completion + 10
      //       : 10;
      // }
      // if (resume_url !== undefined && userDetails.cv_url === null) {
      //   userDetails.profile_completion =
      //     userDetails.profile_completion !== 0
      //       ? userDetails.profile_completion + 18
      //       : 18;
      // }
      // if (
      //   social_media &&
      //   social_links.length > 0 &&
      //   userDetails.social_media.length === 1 &&
      //   social_media_id_delete === undefined &&
      //   social_media_id === undefined
      // ) {
      //   userDetails.profile_completion =
      //     userDetails.profile_completion !== 0
      //       ? userDetails.profile_completion + 5
      //       : 5;
      // }
      // if (experience_id !== undefined) {
      //   const experienceIndex = exp.findIndex(
      //     (item) => item.id === experience_id
      //   );
      //   if (experienceIndex > -1) {
      //     exp[experienceIndex] = { ...exp[experienceIndex], ...experience };
      //   }
      // } else {
      //   userDetails.experience = exp || userDetails.experience;
      // }

      // if (education_id !== undefined) {
      //   const educationIndex = edu.findIndex(
      //     (item) => item.id === education_id
      //   );
      //   if (educationIndex > -1) {
      //     edu[educationIndex] = { ...edu[educationIndex], ...education };
      //   }
      // } else {
      //   userDetails.education = edu || userDetails.education;
      // }

      // if (skills_id !== undefined) {
      //   const skillsIndex = skillsList.findIndex(
      //     (item) => item.id === skills_id
      //   );
      //   if (skillsIndex > -1) {
      //     skillsList[skillsIndex] = { ...skillsList[skillsIndex], ...skills };
      //   }
      // } else {
      //   userDetails.skills = skillsList || userDetails.skills;
      // }

      // if (social_media_id !== undefined) {
      //   const socialIndex = social_links.findIndex(
      //     (item) => item.id === social_media_id
      //   );
      //   if (socialIndex > -1) {
      //     social_links[socialIndex] = {
      //       ...social_links[socialIndex],
      //       ...social_media,
      //     };
      //   }
      // } else {
      //   userDetails.social_media = social_links || userDetails.social_media;
      // }

      // if (
      //   experience_id_delete !== undefined &&
      //   userDetails.experience.length > 0
      // ) {
      //   const experienceIndex = userDetails.experience.findIndex(
      //     (item: any) => item.id === experience_id_delete
      //   );
      //   if (experienceIndex > -1) {
      //     userDetails.experience.splice(experienceIndex, 1);

      //     if (userDetails.experience.length === 0) {
      //       userDetails.profile_completion -= 17;
      //     }
      //   }
      // }
      // if (
      //   education_id_delete !== undefined &&
      //   userDetails.education.length > 0
      // ) {
      //   const educationIndex = userDetails.education.findIndex(
      //     (item: any) => item.id === education_id_delete
      //   );
      //   if (educationIndex > -1) {
      //     userDetails.education.splice(educationIndex, 1);
      //     if (userDetails.education.length === 0) {
      //       userDetails.profile_completion -= 30;
      //     }
      //   }
      // }
      // if (skill_id_delete !== undefined && userDetails.skills.length > 0) {
      //   const skillIndex = userDetails.skills.findIndex(
      //     (item: any) => item.id === skill_id_delete
      //   );
      //   if (skillIndex > -1) {
      //     userDetails.skills.splice(skillIndex, 1);
      //     if (userDetails.skills.length === 0) {
      //       userDetails.profile_completion -= 10;
      //     }
      //   }
      // }
      // if (
      //   social_media_id_delete !== undefined &&
      //   userDetails.social_media.length > 0
      // ) {
      //   const socialIndex = userDetails.social_media.findIndex(
      //     (item: any) => item.id === social_media_id_delete
      //   );
      //   if (socialIndex > -1) {
      //     userDetails.social_media.splice(socialIndex, 1);
      //     if (userDetails.social_media.length === 0) {
      //       userDetails.profile_completion -= 5;
      //     }
      //   }
      // }
      // let total_exp = 0;
      // const currentYear = new Date().getFullYear();
      // const currentMonth = new Date().getMonth() + 1;
      // const currentDay = new Date().getDate();
      // for (let i = 0; i < userDetails.experience.length; i++) {
      //   const startDate = new Date(userDetails.experience[i].start_year);
      //   const endDate = userDetails.experience[i].end_year
      //     ? new Date(userDetails.experience[i].end_year)
      //     : new Date(currentYear, currentMonth - 1, currentDay);
      //   const timeDiff = endDate.getTime() - startDate.getTime();
      //   const totalYears = timeDiff / (1000 * 3600 * 24 * 365);
      //   total_exp += totalYears;
      // }
      // userDetails.total_experience = total_exp;
      userDetails.languages_spoken =
        languages_spoken || userDetails.languages_spoken;
      userDetails.city = city || userDetails.city;
      userDetails.state = state || userDetails.state;
      userDetails.about_you = about_you || userDetails.about_you;
      userDetails.profile_pic = profile_pic_url || userDetails.profile_pic;
      //userDetails.cv_url = resume_url || userDetails.cv_url;
      // userDetails.is_fresher = is_fresher || userDetails.is_fresher;
      // userDetails.cv_name = cv_name || userDetails.cv_name;
      userDetails.gender = gender || userDetails.gender;
      userDetails.user_role = user_role || userDetails.user_role;
      await userDetailsRepository.save(userDetails);
    } else {
      userDetails = new UserDetails();
      if (user_role && state && city) {
        userDetails.profile_completion = 20;
      }
      // if (edu.length > 0) {
      //   userDetails.profile_completion = 30;
      // }
      // if (exp.length > 0) {
      //   userDetails.profile_completion = 17;
      // }
      // if (skillsList.length > 0) {
      //   userDetails.profile_completion = 10;
      // }
      // if (cv_url) {
      //   userDetails.profile_completion = 18;
      // }
      // if (social_links.length > 0) {
      //   userDetails.profile_completion = 5;
      // }

      userDetails.user_uuid = user.uuid;
      userDetails.languages_spoken = languages_spoken;
      userDetails.city = city;
      userDetails.about_you = about_you;
      // userDetails.cv_url = cv_url;
      // userDetails.is_fresher = is_fresher;
      // userDetails.experience = exp;
      // userDetails.skills = skillsList;
      // userDetails.education = edu;
      userDetails.profile_pic = profile_pic_url;
      //userDetails.cv_url = resume_url;
      //userDetails.cv_name = cv_name;
      userDetails.gender = gender;
      userDetails.user_role = user_role;
      //userDetails.social_media = social_links;
      userDetails.state = state;
      await userDetailsRepository.save(userDetails);
    }
    await userDetailsRepository.save(userDetails);
    res.status(200).json({
      status: true,
      message: "User details updated successfully",
      userData: {
        id: user.id,
        uuid: user.uuid,
        fullName: user.fullName,

        email: user.email,
        mobile_number: user.mobile_number,
        date_of_birth: user.date_of_birth,
        user_details: userDetails,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error saving user details", error });
  }
};
export const deleteUserByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_uuid, filter } = req.body;
    const uuid = String(user_uuid);
    const UserRepository = AppDataSource.getRepository(Users);
    const userDetailsRepository = AppDataSource.getRepository(UserDetails);
    const user = await UserRepository.findOneBy({ uuid });
    const userDetails = await userDetailsRepository.findOneBy({
      user_uuid: uuid,
    });
    //  if(userDetails?.profile_pic){
    //   const profilePicDeleted = await deleteFileFromS3(userDetails.profile_pic || '');
    //  }
    //  if(userDetails?.cv_url){

    //   const resumeDeleted = await deleteFileFromS3(userDetails.cv_url || '');

    // }
    // if(jobDetails){
    //  await jobRepository.delete({job_seeker_uuid:user_uuid});
    // }
    //  if(userDetails){
    //  await userDetailsRepository.delete({user_uuid:user_uuid});
    //  }
    //   await UserRepository.delete({uuid:user_uuid});
    if (userDetails) {
      if (filter === "Delete") {
        userDetails.deactivated = 1;
      }
      if (filter === "Restore" && userDetails.deactivated === 1) {
        userDetails.deactivated = 0;
      }

      await userDetailsRepository.save(userDetails);
    }
    if (user) {
      if (filter === "Delete") {
        user.deactivated = 1;
        user.token = null;
        user.deleted_by = req.user.userUuid;
        user.deleted_date = new Date();
        await UserRepository.save(user);
        res.status(200).json({ status: true, message: "Deleted successfully" });
        return;
      }
      if (filter === "Restore" && user.deactivated === 1) {
        user.deactivated = 0;
        user.restoredby = req.user.userUuid;
        user.restore_date = new Date();
        await UserRepository.save(user);
        res
          .status(200)
          .json({ status: true, message: "Restored successfully" });
        return;
      }
    }
    res.status(400).json({ status: false, message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error saving user details",
      err: error,
    });
  }
};

export const addUserExperienceByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { company_name, experience_years, is_working, job_title, city } =
    req.body;
  try {
    const user_uuid = String(req.headers.user_uuid);
    const user_experience_repositry =
      AppDataSource.getRepository(UserExperience);
    const new_experince = new UserExperience();
    new_experince.company_name = company_name;
    new_experince.experience_years = experience_years;
    new_experince.job_title = job_title;
    new_experince.is_working = is_working;
    new_experince.user_uuid = user_uuid;
    new_experince.city = city;
    await user_experience_repositry.save(new_experince);
    res
      .status(200)
      .json({ status: true, message: "User experience added sucessfully" });
    const user_experience_count = await user_experience_repositry.count({
      where: { user_uuid },
    });
    if (user_experience_count === 1) {
      const userDetailsRepository = AppDataSource.getRepository(UserDetails);
      const user_details = await userDetailsRepository.findOneBy({ user_uuid });
      if (!user_details) {
        const newUser = userDetailsRepository.create({
          user_uuid,
          profile_completion: 17,
        });
        await userDetailsRepository.save(newUser);
      } else {
        user_details.profile_completion += 17;
        await userDetailsRepository.save(user_details);
      }
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error adding user details",
      err: error,
    });
  }
};
export const updateUserExperienceByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    experience_uuid,
    company_name,
    experience_years,
    is_working,
    job_title,
  } = req.body;
  try {
    const user_experience_repositry =
      AppDataSource.getRepository(UserExperience);
    const existingExperience = await user_experience_repositry.findOneBy({
      experience_uuid,
    });
    if (!existingExperience) {
      res
        .status(401)
        .json({ status: false, message: "No existing experience found" });
      return;
    }

    existingExperience.company_name = company_name;
    existingExperience.experience_years = experience_years;
    existingExperience.job_title = job_title;
    existingExperience.is_working = is_working;
    existingExperience.updated_at = new Date();
    await user_experience_repositry.save(existingExperience);
    res.status(200).json({ message: "User experience updated sucessfully" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error updating user details",
      err: error,
    });
  }
};
export const getUserExperienceByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_experience_repositry =
      AppDataSource.getRepository(UserExperience);
    const existingExperience = await user_experience_repositry.find({
      where: { user_uuid },
      order: { created_at: "DESC" },
    });
    if (!existingExperience || existingExperience.length === 0) {
      res
        .status(200)
        .json({ status: false, message: "No existing experience found" });
      return;
    }
    res.status(200).json({
      message: "User experience found sucessfully",
      existingExperience,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error getting user details",
      err: error,
    });
  }
};
export const deleteUserExperienceByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { experience_uuid } = req.query;
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const experience_id = String(experience_uuid);
    const user_experience_repositry =
      AppDataSource.getRepository(UserExperience);
    const existingExperience = await user_experience_repositry.delete({
      experience_uuid: experience_id,
    });
    if (existingExperience.affected === 0) {
      res
        .status(200)
        .json({ status: false, message: `No experience found to delete.` });

      return;
    } else {
      res
        .status(200)
        .json({ status: true, message: `Experience deleted successfully` });
      const user_experience_count = await user_experience_repositry.count({
        where: { user_uuid },
      });
      if (user_experience_count === 0) {
        const userDetailsRepository = AppDataSource.getRepository(UserDetails);
        const user_details = await userDetailsRepository.findOneBy({
          user_uuid,
        });
        if (!user_details) {
          return;
        } else {
          user_details.profile_completion -= 17;
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

export const addUserEducationByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { specialization, basic_education, academy, certificate_name } =
    req.body;
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_education_repository =
      AppDataSource.getRepository(UserEducation);
    const new_education = new UserEducation();
    new_education.academy = academy;
    new_education.basic_education = basic_education;
    new_education.certificate_name = certificate_name;
    new_education.user_uuid = user_uuid;
    new_education.specialization = specialization;
    await user_education_repository.save(new_education);
    res.status(200).json({ message: "User education added sucessfully" });
    const user_education_count = await user_education_repository.count({
      where: { user_uuid },
    });
    if (user_education_count === 1) {
      const userDetailsRepository = AppDataSource.getRepository(UserDetails);
      const user_details = await userDetailsRepository.findOneBy({ user_uuid });
      if (!user_details) {
        const newUser = userDetailsRepository.create({
          user_uuid,
          profile_completion: 30,
        });
        await userDetailsRepository.save(newUser);
      } else {
        user_details.profile_completion += 30;
        await userDetailsRepository.save(user_details);
      }
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error adding user details",
      err: error,
    });
  }
};
export const updateUserEducationByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      specialization,
      basic_education,
      academy,
      certificate_name,
      education_uuid,
    } = req.body;
    const user_education_repositry = AppDataSource.getRepository(UserEducation);
    const existingEducation = await user_education_repositry.findOneBy({
      education_uuid,
    });
    if (!existingEducation) {
      res
        .status(401)
        .json({ status: false, message: "No existing education found" });
      return;
    }

    existingEducation.academy = academy;
    existingEducation.basic_education = basic_education;
    existingEducation.specialization = specialization;
    existingEducation.certificate_name = certificate_name;
    existingEducation.updated_at = new Date();
    await user_education_repositry.save(existingEducation);
    res
      .status(200)
      .json({ status: true, message: "User education updated sucessfully" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error updating user details",
      err: error,
    });
  }
};
export const getUserEducationByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_education_repositry = AppDataSource.getRepository(UserEducation);
    const existingEducation = await user_education_repositry.find({
      where: { user_uuid },
      order: { created_at: "DESC" },
    });
    if (!existingEducation || existingEducation.length === 0) {
      res
        .status(200)
        .json({ status: false, message: "No existing education found" });
      return;
    }
    res.status(200).json({
      status: true,
      message: "User education found sucessfully",
      existingEducation,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error getting user details",
      err: error,
    });
  }
};
export const deleteUserEducationByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { education_uuid } = req.query;
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const education_id = String(education_uuid);
    const user_education_repository =
      AppDataSource.getRepository(UserEducation);
    const existingEducation = await user_education_repository.delete({
      education_uuid: education_id,
    });
    if (existingEducation.affected === 0) {
      res
        .status(200)
        .json({ status: false, message: `No education found to delete.` });

      return;
    } else {
      res
        .status(200)
        .json({ status: true, message: `Education deleted successfully` });
      const user_education_count = await user_education_repository.count({
        where: { user_uuid },
      });
      if (user_education_count === 0) {
        const userDetailsRepository = AppDataSource.getRepository(UserDetails);
        const user_details = await userDetailsRepository.findOneBy({
          user_uuid,
        });
        if (!user_details) {
          return;
        } else {
          user_details.profile_completion -= 30;
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

export const addUserSkillsByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { skill_name, skill_level } = req.body;
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_skill_repository = AppDataSource.getRepository(UserSkills);
    const new_skill = new UserSkills();
    new_skill.skill_name = skill_name;
    new_skill.skill_level = skill_level;
    new_skill.user_uuid = user_uuid;

    await user_skill_repository.save(new_skill);
    res
      .status(200)
      .json({ status: true, message: "User skills added sucessfully" });
    const user_skill_count = await user_skill_repository.count({
      where: { user_uuid },
    });
    if (user_skill_count === 1) {
      const userDetailsRepository = AppDataSource.getRepository(UserDetails);
      const user_details = await userDetailsRepository.findOneBy({ user_uuid });
      if (!user_details) {
        const newUser = userDetailsRepository.create({
          user_uuid,
          profile_completion: 10,
        });
        await userDetailsRepository.save(newUser);
      } else {
        user_details.profile_completion -= 10;
        await userDetailsRepository.save(user_details);
      }
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error saving user details",
      err: error,
    });
  }
};
export const updateUserSkillsByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { skill_name, skill_level, skill_uuid } = req.body;
  try {
    const user_skill_repository = AppDataSource.getRepository(UserSkills);
    const existingSkill = await user_skill_repository.findOneBy({
      skill_uuid,
    });
    if (!existingSkill) {
      res.status(401).json({ status: false, message: "No skills found" });
      return;
    }
    existingSkill.skill_level = skill_level;
    existingSkill.skill_name = skill_name;
    existingSkill.updated_at = new Date();
    await user_skill_repository.save(existingSkill);
    res
      .status(200)
      .json({ status: true, message: "User skills updated sucessfully" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error updating user details",
      err: error,
    });
  }
};
export const getUserSkillsByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_skill_repositry = AppDataSource.getRepository(UserSkills);
    const existingSKills = await user_skill_repositry.find({
      where: { user_uuid },
      order: { created_at: "DESC" },
    });
    if (!existingSKills || existingSKills.length === 0) {
      res
        .status(200)
        .json({ status: false, message: "No existing skills found" });
      return;
    }
    res.status(200).json({
      status: true,
      message: "User skills found sucessfully",
      existingSKills,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error getting user details",
      err: error,
    });
  }
};
export const deleteUserSkillsByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { skill_uuid } = req.query;
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const skill_id = String(skill_uuid);
    const user_skill_repositry = AppDataSource.getRepository(UserSkills);
    const existingSKills = await user_skill_repositry.delete({
      skill_uuid: skill_id,
    });
    if (existingSKills.affected === 0) {
      res
        .status(200)
        .json({ status: false, message: `No skill found to delete.` });

      return;
    } else {
      res
        .status(200)
        .json({ status: false, message: `Experience deleted successfully` });
      const user_skill_count = await user_skill_repositry.count({
        where: { user_uuid },
      });
      if (user_skill_count === 0) {
        const userDetailsRepository = AppDataSource.getRepository(UserDetails);
        const user_details = await userDetailsRepository.findOneBy({
          user_uuid,
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

export const addSocialMediaLinksByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_social_repositry = AppDataSource.getRepository(UserSocialMedia);
    const socialMediaData = JSON.parse(req.body.social_media);
    const socialMediaEntities = socialMediaData.map((item: any) => {
      const socialMedia = new UserSocialMedia();
      socialMedia.social_media_uuid = uuidv4();
      socialMedia.user_uuid = user_uuid;
      socialMedia.platform = item.platform;
      socialMedia.url = item.url;
      return socialMedia;
    });
    await user_social_repositry.save(socialMediaEntities);
    res.status(200).json({ status: true, message: "Social media link saved" });
    const user_social_count = await user_social_repositry.count({
      where: { user_uuid },
    });
    if (user_social_count === 1) {
      const userDetailsRepository = AppDataSource.getRepository(UserDetails);
      const user_details = await userDetailsRepository.findOneBy({ user_uuid });
      if (!user_details) {
        const newUser = userDetailsRepository.create({
          user_uuid,
          profile_completion: 5,
        });
        await userDetailsRepository.save(newUser);
      } else {
        user_details.profile_completion += 5;
        await userDetailsRepository.save(user_details);
      }
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error adding user details",
      err: error,
    });
  }
};
export const getSocialMediaLinksByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_social_repositry = AppDataSource.getRepository(UserSocialMedia);
    const social_media_data = await user_social_repositry.find({
      where: { user_uuid },
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: true,
      message: "Social media link saved",
      social_media_data,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error getting user details",
      err: error,
    });
  }
};
export const deleteSocialMediaLinksByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { social_media_uuid } = req.query;
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const user_social_repositry = AppDataSource.getRepository(UserSocialMedia);
    const social_media_id = String(social_media_uuid);
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
      const user_social_count = await user_social_repositry.count({
        where: { user_uuid },
      });
      if (user_social_count === 0) {
        const userDetailsRepository = AppDataSource.getRepository(UserDetails);
        const user_details = await userDetailsRepository.findOneBy({
          user_uuid,
        });
        if (!user_details) {
          return;
        } else {
          user_details.profile_completion -= 5;
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

export const addCvUrlByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cv_name } = req.body;
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);
    const files = req.files as { [key: string]: Express.Multer.File[] };
    const resume = files?.["resume"]?.[0] || null;

    let name = user_uuid;
    let resume_url;
    if (resume) {
      const { buffer, mimetype } = resume;
      name += "_resume";
      const fileStream = Readable.from(buffer);
      await uploadImageToS3(fileStream, "userdata", name, mimetype);
      resume_url = "/userdata/" + name;
    }
    const userDetailsRepository = AppDataSource.getRepository(UserDetails);
    const user_details = await userDetailsRepository.findOneBy({
      user_uuid,
    });
    if (!user_details) {
      const new_user_details = new UserDetails();
      new_user_details.cv_name = cv_name;
      new_user_details.cv_url = resume_url;
      new_user_details.profile_completion = 18;
      await userDetailsRepository.save(new_user_details);
    } else {
      if (user_details.cv_url !== null || user_details.cv_url !== undefined) {
        user_details.profile_completion += 18;
      }
      user_details.cv_url = resume_url;
      user_details.cv_name = cv_name;
      await userDetailsRepository.save(user_details);
    }
    res
      .status(200)
      .json({ status: true, message: "Resume added successfully" });

    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error adding user details",
      err: error,
    });
  }
};
export const getCvUrlByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { user_uuid } = req.headers;
    user_uuid = String(user_uuid);

    const userDetailsRepository = AppDataSource.getRepository(UserDetails);
    const user_details = await userDetailsRepository.findOne({
      where: { user_uuid },
      select: ["user_uuid", "cv_name", "cv_url"],
    });
    if (!user_details || !user_details.cv_url) {
      res
        .status(200)
        .json({ status: false, message: "No resume found", data: null });
      return;
    }
    user_details.cv_url = process.env.AWS_URL + user_details.cv_url;
    res
      .status(200)
      .json({ status: true, message: "Resume found", data: user_details });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error getting user details",
      err: error,
    });
  }
};
