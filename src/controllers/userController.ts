import { AppDataSource } from "../config/database";
import { Users } from "../entities/user";
import { Request, Response } from "express";
import { UserDetails } from "../entities/userDetails";
import { deleteFileFromS3, uploadImageToS3 } from "../utils/uploadimages";
import { Readable } from "stream";
import { JobApplication } from "../entities/jobApplication";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { UsersNotification } from "../entities/userNotification";
import { FavouriteJob } from "../entities/favouritejob";
import { UserExperience } from "../entities/userExperience";
import { UserEducation } from "../entities/userEducation";
import { UserSkills } from "../entities/userSkills";
import { UserSocialMedia } from "../entities/userSocialLink";
dotenv.config();
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, mobile_number, name } = req.body;

  const userUuid = req.user?.userUuid;

  if (!userUuid) {
    res.status(401).json({ status: false, message: "Unauthorized" });
    return;
  }

  const userRepository = AppDataSource.getRepository(Users);
  const user = await userRepository.findOneBy({ uuid: userUuid });

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
    user.updated_at = new Date();
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

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user_uuid = req.user.userUuid;

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
        `(
  SELECT json_agg(ordered_rows)
  FROM (
    SELECT *
    FROM user_experience_details
    WHERE user_experience_details.user_uuid = users.uuid
    ORDER BY user_experience_details.is_working DESC
  ) AS ordered_rows
) AS experience`,
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

// export const addUserDetails = async (req: Request, res: Response): Promise<void> => {
//     const {
//         languages_spoken,
//         skills,
//         city,
//         state,
//         about_you,
//         education,
//         social_media,
//         social_media_id,
//         cv_url,
//         is_fresher,
//         experience,
//         experience_id,
//         education_id,
//         skills_id,
//         gender,
//         cv_name,
//         user_role
//     } = req.body;

//     const user_uuid = req.user?.userUuid;

//     const userRepository = AppDataSource.getRepository(Users);
//     const userDetailsRepository = AppDataSource.getRepository(UserDetails);
//     const files = req.files as { [key: string]: Express.Multer.File[] }
//     const profile_pic = files?.['profile_pic']?.[0] || null;
//     const resume = files?.['resume']?.[0] || null;
//     try {
//         const user = await userRepository.findOneBy({ uuid: user_uuid });
//         if (!user) {
//             res.status(404).json({ status: false, message: 'User not found' });
//             return;
//         }
//         let userDetails = await userDetailsRepository.findOneBy({ user_uuid: user_uuid });

//         const exp=userDetails?.experience||[];
//         const edu=userDetails?.education||[];
//         const skillls=userDetails?.skills||[];
//         const social_links=userDetails?.social_media||[];
//         if (experience && experience_id===undefined) {
//             console.log(experience);
//             experience.id=exp.length;
//             exp.push(experience);
//         }
//         if (education && education_id===undefined) {
//             education.id=edu.length;
//             edu.push(education);
//         }
//         if (skills && skills_id===undefined) {
//             skills.id=skillls.length;
//             skillls.push(skills);
//         }
//         let so:any=[];
//         if (social_media && social_media_id===undefined) {
//             so=JSON.parse(social_media);
//             so.forEach((e:any)=>{
//                 e.id=social_links.length;
//                 social_links.push(e);
//             })

//         }
//                 let profile_pic_url:any;
//                 let resume_url:any;
//                 let name=user_uuid;

//                 if(resume){
//                     const { buffer,mimetype } = resume;

//                     // const stream = require('stream').Readable.from(buffer);

//                     name+='_resume'
//                     const fileStream = Readable.from(buffer);
//                     resume_url = await uploadImageToS3(fileStream, 'userdata',name , mimetype);
//                 }
//                 if (profile_pic) {
//                     const { buffer, mimetype,filename } = profile_pic;
//                     name+='_profile_pic'
//                     const fileStream = Readable.from(buffer);
//                     profile_pic_url = await uploadImageToS3(fileStream,'userdata',name, mimetype);
//                 }
//         if (userDetails) {

//             if(experience_id>=0){
//                 console.log(experience_id)
//                 experience.id=experience_id;
//                 userDetails.experience[experience_id]=experience;
//                 console.log(experience);
//                 console.log(userDetails.experience[experience_id]);

//             }
//             else{
//                 userDetails.experience=exp||userDetails.experience;
//                 let total_exp=0;

//                     for(let i=0;i<userDetails.experience.length;i++){
//                     total_exp+=Number(userDetails.experience[i].end_year)-Number(userDetails.experience[i].start_year)
//                     }

//                 userDetails.total_experience=total_exp;
//             }
//             if(education_id){
//                 education.id=education_id;
//                 userDetails.education[education_id]=education;
//             }else{
//              userDetails.education=edu||userDetails.education;

//             }
//             if(skills_id){
//                 skills.id=skills_id;
//                 userDetails.skills[skills_id]=skills;
//             }else{
//              userDetails.skills=skillls||userDetails.skills;

//             }
//             if(social_media_id){
//                 social_media.id=social_media_id;
//                 userDetails.social_media[social_media_id]=social_media;
//             }else{
//              userDetails.social_media=social_links||userDetails.social_media;

//             }
//             userDetails.languages_spoken = languages_spoken||userDetails.languages_spoken;
//             userDetails.user_uuid = user.uuid;
//             userDetails.city = city||userDetails.city;
//             userDetails.state = state||userDetails.state;
//             userDetails.about_you = about_you||userDetails.about_you;
//             userDetails.profile_pic=profile_pic_url||userDetails.profile_pic;
//             userDetails.cv_url = resume_url||userDetails.cv_url;
//             userDetails.is_fresher = is_fresher||userDetails.is_fresher;
//             userDetails.cv_name=cv_name||userDetails.cv_name;
//             userDetails.gender=gender||userDetails.gender;
//             userDetails.user_role=user_role||userDetails.user_role;
//             await userDetailsRepository.save(userDetails);
//             res.status(200).json({
//                 status: true,
//                 message: 'User details updated successfully',
//                 userData: {
//                     id: user.id,
//                     uuid: user.uuid,
//                     first_name: user.first_name,
//                     last_name: user.last_name,
//                     email: user.email,
//                     mobile_number: user.mobile_number,
//                     date_of_birth: user.date_of_birth,
//                     user_details: userDetails
//                 },
//             });
//         } else {
//             userDetails = new UserDetails();
//             userDetails.user_uuid = user.uuid;
//             userDetails.languages_spoken = languages_spoken;
//             userDetails.city = city;
//             userDetails.about_you = about_you;
//             userDetails.cv_url = cv_url;
//             userDetails.is_fresher = is_fresher;
//             userDetails.experience = exp;
//             userDetails.skills=skillls;
//             userDetails.education=edu;
//             userDetails.profile_pic=profile_pic_url;
//             userDetails.cv_url=resume_url;
//             userDetails.cv_name=cv_name;
//             userDetails.gender=gender;
//             userDetails.user_role=user_role;
//             userDetails.social_media=social_links;
//             userDetails.state=state;
//             await userDetailsRepository.save(userDetails);

//             res.status(201).json({
//                 status: true,
//                 message: 'User details added successfully',
//                 userData: {
//                     id: user.id,
//                     uuid: user.uuid,
//                     first_name: user.first_name,
//                     last_name: user.last_name,
//                     email: user.email,
//                     mobile_number: user.mobile_number,
//                     date_of_birth: user.date_of_birth,
//                     created_at: user.created_at,
//                     user_details: userDetails
//                 },
//             });
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ status: false, message: 'Error saving user details', error });
//     }
// };

export const addUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
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
    cv_name,
    user_role,
    country,
  } = req.body;

  const user_uuid = req.user?.userUuid;

  const userRepository = AppDataSource.getRepository(Users);
  const userDetailsRepository = AppDataSource.getRepository(UserDetails);
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const profile_pic = files?.["profile_pic"]?.[0] || null;
  // const resume = files?.["resume"]?.[0] || null;
  try {
    const user = await userRepository.findOneBy({ uuid: user_uuid });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    let userDetails = await userDetailsRepository.findOneBy({
      user_uuid: user_uuid,
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
    // let resume_url: any;
    let name = user_uuid;
    let name1 = user_uuid;

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
      // console.log(
      //   "here",
      //   user_role,
      //   userDetails.gender,
      //   gender,
      //   userDetails.user_role
      // );
      if (
        user_role &&
        (userDetails.user_role === null || userDetails.user_role?.length === 0)
      ) {
        userDetails.profile_completion =
          userDetails.profile_completion !== 0
            ? userDetails.profile_completion + 6
            : 6;
      }
      if (
        gender &&
        (userDetails.gender === null || userDetails.gender?.length === 0)
      ) {
        userDetails.profile_completion =
          userDetails.profile_completion !== 0
            ? userDetails.profile_completion + 3
            : 3;
      }
      if (
        state &&
        city &&
        (userDetails.state === null || userDetails.state?.length === 0) &&
        (userDetails.city === null || userDetails.city?.length === 0)
      ) {
        userDetails.profile_completion =
          userDetails.profile_completion !== 0
            ? userDetails.profile_completion + 11
            : 11;
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
      //   console.log("hetre");
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
      // console.log(userDetails.experience);
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
      // userDetails.cv_url = resume_url || userDetails.cv_url;
      //userDetails.is_fresher = is_fresher || userDetails.is_fresher;
      userDetails.cv_name = cv_name || userDetails.cv_name;
      userDetails.gender = gender || userDetails.gender;
      userDetails.user_role = user_role || userDetails.user_role;
      userDetails.country = country || userDetails.country;
      await userDetailsRepository.save(userDetails);
    } else {
      userDetails = new UserDetails();
      let profileCompletion = 0;
      if (user_role) {
        profileCompletion += 6;
      }
      if (gender) {
        profileCompletion += 3;
      }
      if (state && city) {
        profileCompletion += 11;
      }
      // if (edu.length > 0) {
      //   profileCompletion += 30;
      // }
      // if (exp.length > 0) {
      //   profileCompletion += 17;
      // }
      // if (skillsList.length > 0) {
      //   profileCompletion += 10;
      // }
      // if (cv_url) {
      //   profileCompletion += 18;
      // }
      // if (social_links.length > 0) {
      //   profileCompletion += 5;
      // }

      userDetails.user_uuid = user.uuid;
      userDetails.languages_spoken = languages_spoken;
      userDetails.city = city || user.city;
      userDetails.about_you = about_you;
      // userDetails.cv_url = cv_url;
      // userDetails.is_fresher = is_fresher;
      // userDetails.experience = exp;
      // userDetails.skills = skillsList;
      // userDetails.education = edu;
      userDetails.profile_pic = profile_pic_url;
      // userDetails.cv_url = resume_url;
      userDetails.cv_name = cv_name;
      userDetails.gender = gender;
      userDetails.user_role = user_role;
      //userDetails.social_media = social_links;
      userDetails.state = state || user.state;
      userDetails.country = country;
      userDetails.profile_completion = profileCompletion;
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

export const addUserBasicDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, state, city } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
    const userRepository = AppDataSource.getRepository(Users);
    const userProfileRepository = AppDataSource.getRepository(UserDetails);
    const userDetails = await userRepository.findOneBy({
      uuid: user_uuid,
    });
    if (!userDetails) {
      res.status(401).json({ message: "User Not Found" });
      return;
    }
    const files = req.files as { [key: string]: Express.Multer.File[] };
    const profile_pic = files?.["profile_pic"]?.[0] || null;
    let name1 = userDetails?.fullName,
      profile_pic_url;
    const newUserProfile = new UserDetails();
    newUserProfile.user_uuid = user_uuid;
    if (profile_pic) {
      const { buffer, mimetype, filename } = profile_pic;
      name1 += "_profile_pic";
      const fileStream = Readable.from(buffer);
      await uploadImageToS3(fileStream, "userdata", String(name1), mimetype);
      profile_pic_url = "/userdata/" + name1;
      newUserProfile.profile_pic = profile_pic_url;
    }
    let profile_completion = 0;
    if (state && city) {
      newUserProfile.state = state;
      newUserProfile.city = city;
      profile_completion += 11;
      newUserProfile.profile_completion = profile_completion;
    }
    if (email) {
      userDetails.email = email;
      await userRepository.save(userDetails);
    }
    await userProfileRepository.save(newUserProfile);
    res.status(200).json({ message: "User Profile updated sucessfully" });
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

export const addUserBasicRoleEduExpDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { role, basic_education, current_org, experience_level } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
    const userRepository = AppDataSource.getRepository(Users);
    const userProfileRepository = AppDataSource.getRepository(UserDetails);
    const userEducationRepository = AppDataSource.getRepository(UserEducation);
    const userExperienceRepository =
      AppDataSource.getRepository(UserExperience);
    const userDetails = await userRepository.findOneBy({
      uuid: user_uuid,
    });
    if (!userDetails) {
      res.status(401).json({ message: "User Not Found" });
      return;
    }
    let profile_completion = 0;
    if (basic_education) {
      const newUserEducation = new UserEducation();
      newUserEducation.user_uuid = user_uuid;
      newUserEducation.basic_education = basic_education;
      await userEducationRepository.save(newUserEducation);
      profile_completion += 30;
    }
    if (current_org) {
      const newUserExperience = new UserExperience();
      newUserExperience.user_uuid = user_uuid;
      newUserExperience.city = String(userDetails?.city);
      newUserExperience.company_name = current_org;
      newUserExperience.experience_years = experience_level;
      await userExperienceRepository.save(newUserExperience);
      profile_completion += 17;
    }
    const existingUserProfile = await userProfileRepository.findOneBy({
      user_uuid,
    });

    if (!existingUserProfile) {
      if (role) {
        const newUserProfile = new UserDetails();
        newUserProfile.user_uuid = user_uuid;
        newUserProfile.user_role = role;
        profile_completion += 6;
        newUserProfile.profile_completion = profile_completion;
        await userProfileRepository.save(newUserProfile);
      }
    } else {
      if (role) {
        existingUserProfile.user_role = role;
        profile_completion += 6;
        existingUserProfile.profile_completion += profile_completion;
        await userProfileRepository.save(existingUserProfile);
      }
    }

    res.status(200).json({ message: "User Profile updated sucessfully" });
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

export const addUserExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { company_name, experience_years, is_working, job_title, city } =
    req.body;
  try {
    const user_uuid = req.user?.userUuid;

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
export const updateUserExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    experience_uuid,
    company_name,
    experience_years,
    is_working,
    job_title,
    city,
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
    existingExperience.city = city;
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
export const getUserExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_uuid = req.user?.userUuid;

    const user_experience_repositry =
      AppDataSource.getRepository(UserExperience);
    const existingExperience = await user_experience_repositry.find({
      where: { user_uuid },
      order: { is_working: "DESC", created_at: "DESC" },
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
export const deleteUserExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { experience_uuid } = req.query;
  try {
    const user_uuid = req.user.userUuid;
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

export const addUserEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { specialization, basic_education, academy, certificate_name } =
    req.body;
  try {
    const user_uuid = req.user?.userUuid;
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
export const updateUserEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_uuid = req.user?.userUuid;
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
export const getUserEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_uuid = req.user?.userUuid;

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
export const deleteUserEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { education_uuid } = req.query;
  try {
    const user_uuid = req.user.userUuid;
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

export const addUserSkills = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { skill_name, skill_level } = req.body;
  try {
    const user_uuid = req.user?.userUuid;
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
        user_details.profile_completion += 10;
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
export const updateUserSkills = async (
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
export const getUserSkills = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_uuid = req.user?.userUuid;
  try {
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
export const deleteUserSkills = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { skill_uuid } = req.query;
  try {
    const user_uuid = req.user.userUuid;
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

export const addSocialMediaLinks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_uuid = req.user.userUuid;
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
    const user_social_count = await user_social_repositry.count({
      where: { user_uuid },
    });
    if (user_social_count === 0) {
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
    await user_social_repositry.save(socialMediaEntities);
    res.status(200).json({ status: true, message: "Social media link saved" });

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
export const addSocialMediaLinksForMobile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { platform, url } = req.body;
  try {
    const user_uuid = req.user.userUuid;
    const user_social_repositry = AppDataSource.getRepository(UserSocialMedia);

    const socialMedia = new UserSocialMedia();
    socialMedia.social_media_uuid = uuidv4();
    socialMedia.user_uuid = user_uuid;
    socialMedia.platform = platform;
    socialMedia.url = url;
    await user_social_repositry.save(socialMedia);
    const user_social_count = await user_social_repositry.count({
      where: { user_uuid },
    });
    if (user_social_count === 0) {
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

    res.status(200).json({ status: true, message: "Social media link saved" });

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
export const getSocialMediaLinks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_uuid = req.user.userUuid;
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
export const deleteSocialMediaLinks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { social_media_uuid } = req.query;
  try {
    const user_uuid = req.user.userUuid;
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

export const addCvUrl = async (req: Request, res: Response): Promise<void> => {
  const { cv_name } = req.body;
  try {
    const user_uuid = req.user.userUuid;
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
export const getCvUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_uuid = req.user.userUuid;

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
function sendResetPasswordEmail(email: string, resetToken: any) {
  throw new Error("Function not implemented.");
}

// export const updateUserDetails = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { education, experience, skills, resume, social_links } = req.body;
//   try {
//     const user_uuid = req.user?.userUuid;
//     console.log(experience[0].company_name);
//     const user_repositry = AppDataSource.getRepository(UserDetails);
//     const user_details = await user_repositry.findOneBy({ user_uuid });
//     if (user_details) {
//       if (experience) {
//         user_details.experience.forEach((element) => {
//           if (
//             element.company_name === experience[0].company_name &&
//             element.designation === experience[0].designation
//           ) {
//             res
//               .status(200)
//               .json({ message: "User details updated sucessfully" });
//             element.experience = experience;
//             return;
//           }
//         });
//         user_details.experience.push(experience);
//         await user_repositry.save(user_details);
//         res.status(200).json({ message: "User details updated sucessfully" });
//         return;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: "Error saving user details",
//       err: error,
//     });
//   }
// };

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_uuid = req.user?.userUuid;
    const UserRepository = AppDataSource.getRepository(Users);
    const userDetailsRepository = AppDataSource.getRepository(UserDetails);
    const jobRepository = AppDataSource.getRepository(JobApplication);
    const user = await UserRepository.findOneBy({ uuid: user_uuid });
    const userDetails = await userDetailsRepository.findOneBy({
      user_uuid: user_uuid,
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
    if (user) {
      user.deactivated = 1;
      user.token = null;
      user.deleted_by = user.uuid;
      user.deleted_date = new Date();
      user.updated_at = new Date();
      UserRepository.save(user);
    }
    if (userDetails) {
      userDetails.deactivated = 1;
      userDetailsRepository.save(userDetails);
    }
    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error Deleting user details",
      err: error,
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
      AppDataSource.getRepository(UsersNotification);
    const userNotification = await userNotificationRepository.find({
      where: { job_seeker_uuid: user_uuid },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { created_at: "DESC" },
    });
    const total = await userNotificationRepository.count({
      where: { job_seeker_uuid: user_uuid },
    });
    const totalNewJobs = await userNotificationRepository.count({
      where: { job_seeker_uuid: user_uuid, isread: false },
    });
    if (userNotification.length === 0) {
      res.status(200).json({ status: false, message: "No alerts found" });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Job Notification found",
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
      AppDataSource.getRepository(UsersNotification);
    const userNotification = await userNotificationRepository.findOne({
      where: { notification_uuid },
    });
    if (!userNotification) {
      res.status(200).json({
        status: true,
        message: "No job notification found",
      });
      return;
    }
    userNotification.isread = true;
    await userNotificationRepository.save(userNotification);
    res.status(200).json({
      status: true,
      message: "Job Notification updated",
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

export const getFavJobAndAppliedJobCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_uuid = req.user.userUuid;
  try {
    const savedCandidateRepository = AppDataSource.getRepository(Users);
    const results = await savedCandidateRepository
      .createQueryBuilder("users")
      .leftJoin(
        FavouriteJob,
        "user_favourite_jobs",
        "users.uuid=user_favourite_jobs.user_uuid"
      )
      .leftJoin(
        JobApplication,
        "job_applications",
        "users.uuid=job_applications.job_seeker_uuid"
      )
      .select([
        "COUNT(DISTINCT job_applications.application_id) AS totalJobApplications",
        "COUNT(DISTINCT user_favourite_jobs.favourite_job_uuid) AS totalFavjob",
      ])
      .where("users.uuid = :user_uuid", {
        user_uuid,
      })
      .getRawOne();
    console.log(results);
    res.status(200).json({
      message: "Fav Job and applied job count found",
      status: true,
      favourite_job_count: isNaN(Number(results.totalfavjob))
        ? 0
        : Number(results.totalfavjob),
      total_job_applied: isNaN(Number(results.totaljobapplications))
        ? 0
        : Number(results.totaljobapplications),
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", status: false, err: err });
  }
};
