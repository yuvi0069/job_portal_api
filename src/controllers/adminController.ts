// import { Request, Response } from 'express';
// import { AppDataSource } from '../config/database';
// import { ClientUsers } from '../entities/clientUsers';
// import { validate } from 'class-validator';
// import dotenv from 'dotenv';
// import { Users } from '../entities/user';
// import { CompanyProfiles } from '../entities/companyProfiles';
// import { Postjobs } from '../entities/postjobs';
// import { uploadImageToS3 } from '../utils/uploadimages';
// import { Readable } from 'stream';
// import { v4 as uuidv4 } from 'uuid';
// import { UserDetails } from '../entities/userDetails';
// dotenv.config();

// export const getAllCompanyProfile=async(req:Request,res:Response)=>{
//     const{filter,page_no}=req.body;
//     try {
//         const clientRepository=AppDataSource.getRepository(ClientUsers);

//     const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no)
//     const pageSize = 5;
//     const skip = (page - 1) * pageSize;

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
//     let clientUser,total;
// // if(filter){
// //         if (emailRegex.test(filter)){

// //             clientUser = await clientRepository
// //             .createQueryBuilder('clientUser')
// //             .leftJoin('clientUser.company_profile', 'companyProfile')
// //             .leftJoin('clientUser.postJobs', 'postJobs')
// //             .select(["clientUser.user_uuid","clientUser.email","clientUser.mobile_number","companyProfile.company_name","companyProfile.company_logo","companyProfile.company_location","clientUser.deactivated","COUNT(postJobs.id) AS postJobsCount"])
// //             .where("clientUser.email like :email",{email:`%${filter}%`})
// //             .groupBy('clientUser.user_uuid')
// //             .addGroupBy('companyProfile.company_name')
// //             .addGroupBy('companyProfile.company_logo')
// //             .addGroupBy('companyProfile.company_location')
// //             .addGroupBy('clientUser.email')
// //             .addGroupBy('clientUser.mobile_number')
// //             .addGroupBy('clientUser.deactivated')
// //             .limit(pageSize)
// //             .offset(skip)
// //             .getRawMany();
// //             total=await clientRepository.createQueryBuilder('clientUser')
// //             .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
// //             .leftJoin('clientUser.postJobs', 'postJobs')
// //             .where("clientUser.email like :email",{email:`%${filter}%`})
// //             .getCount();

// //         }
// //         else{
// //             clientUser = await clientRepository
// //             .createQueryBuilder('clientUser')
// //             .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
// //             .leftJoin('clientUser.postJobs', 'postJobs')
// //             .select(["clientUser.user_uuid","clientUser.email","clientUser.mobile_number","companyProfile.company_name","companyProfile.company_logo","companyProfile.company_location","clientUser.deactivated","COUNT(postJobs.id) AS postJobsCount"])
// //             .where("companyProfile.company_name like :name",{name:`%${filter}%`})
// //             .groupBy('clientUser.user_uuid')
// //             .addGroupBy('companyProfile.company_name')
// //             .addGroupBy('companyProfile.company_logo')
// //             .addGroupBy('companyProfile.company_location')
// //             .addGroupBy('clientUser.email')
// //             .addGroupBy('clientUser.mobile_number')
// //             .addGroupBy('clientUser.deactivated')
// //             .limit(pageSize)
// //             .offset(skip)
// //             .getRawMany();
// //             total=await clientRepository.createQueryBuilder('clientUser')
// //             .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
// //             .leftJoin('clientUser.postJobs', 'postJobs')
// //             .where("companyProfile.company_name like :name",{name:`%${filter}%`})
// //             .getCount();

// //         }

// //     }
// //     else{
// //     clientUser = await clientRepository
// //       .createQueryBuilder('clientUser')
// //       .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
// //       .leftJoin('clientUser.postJobs', 'postJobs')
// //       .select(["clientUser.user_uuid","clientUser.email","clientUser.mobile_number","companyProfile.company_name","companyProfile.company_logo","companyProfile.company_location","clientUser.deactivated","COUNT(postJobs.id) AS postJobsCount"])
// //       .groupBy('clientUser.user_uuid')
// //       .addGroupBy('companyProfile.company_name')
// //       .addGroupBy('companyProfile.company_logo')
// //       .addGroupBy('companyProfile.company_location')
// //       .addGroupBy('clientUser.email')
// //       .addGroupBy('clientUser.mobile_number')
// //       .addGroupBy('clientUser.deactivated')
// //       .limit(pageSize)
// //       .offset(skip)
// //       .getRawMany();

// //     total=await clientRepository.createQueryBuilder('clientUser')
// //     .leftJoin('clientUser.company_profile', 'companyProfile') // Join company_profile
// //     .leftJoin('clientUser.postJobs', 'postJobs')
// //     .getCount();
// //     }
// let filterConditions:any = {};
//         if (filter) {
//             if (emailRegex.test(filter)) {
//                 filterConditions['user.email'] = `%${filter}%`;
//             }
//              else {
//                 filterConditions['user.first_name'] = `%${filter}%`;
//             }
//         }

//         let query = AppDataSource.getRepository(Users)
//             .createQueryBuilder('user')
//             .leftJoin('user.jobs', 'jobApplication')
//             .leftJoin('user.details', 'userDetails')
//             .select([
//                 'user.uuid',
//                 'user.email',
//                 'user.first_name',
//                 'user.last_name',
//                 'user.mobile_number',
//                 'userDetails.profile_pic',
//                 'userDetails.gender',
//                 'userDetails.user_role',
//                 'COUNT(jobApplication.application_id) AS JobsCount',
//                 'userDetails.city',
//                 'userDetails.state',
//                 'user.deactivated'
//             ])
//             .groupBy('user.uuid')
//             .addGroupBy('user.email')
//             .addGroupBy('user.deactivated')
//             .addGroupBy('user.first_name')
//             .addGroupBy('user.last_name')
//             .addGroupBy('user.mobile_number')
//             .addGroupBy('userDetails.profile_pic')
//             .addGroupBy('userDetails.gender')
//             .addGroupBy('userDetails.user_role')
//             .addGroupBy('userDetails.state')
//             .addGroupBy('userDetails.city')
//             .limit(pageSize)
//             .offset(skip);

//         Object.keys(filterConditions).forEach(key => {
//             query = query.andWhere(`${key} LIKE :${key}`, { [key]: filterConditions[key] });
//         });

//         clientUser = await query.getRawMany();

//         let totalQuery = AppDataSource.getRepository(Users)
//             .createQueryBuilder('user')
//             .leftJoin('user.jobs', 'jobApplication')
//             .leftJoin('user.details', 'userDetails');

//         Object.keys(filterConditions).forEach(key => {
//             totalQuery = totalQuery.andWhere(`${key} LIKE :${key}`, { [key]: filterConditions[key] });
//         });

//         total = await totalQuery.getCount();

//         res.status(200).json({status:true,message:'Company profiles found',data:clientUser,env:process.env.AWS_URL,pagination: {
//             total,
//             page,
//             pageSize,
//             totalPages: Math.ceil(Number(total) / pageSize),
//         }})
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({status:false,message:error})
//     }
// }
// export const getAllEmployee=async(req:Request,res:Response)=>{
//     const {page_no,filter}=req.body;
//     try {
// const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no)
// const pageSize=5;
// const skip=(page-1)*pageSize;
// let usersWithApplications,total;

//  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//  const phoneRegex = /^\d{1,10}$/;

// // if(filter){
// //  if (emailRegex.test(filter)) {

// //    usersWithApplications = await AppDataSource.getRepository(Users)
// //     .createQueryBuilder('user')
// //     .leftJoin('user.jobs', 'jobApplication')
// //     .leftJoin('user.details','userDetails')
// //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
// //     .where("user.email like :email",{email:`%${filter}%`})
// //     .groupBy('user.uuid')
// //     .addGroupBy('user.email')
// //     .addGroupBy('user.deactivated')
// //     .addGroupBy('user.first_name')
// //     .addGroupBy('user.last_name')
// //     .addGroupBy('user.mobile_number')
// //     .addGroupBy('userDetails.profile_pic')
// //     .addGroupBy('userDetails.gender')
// //     .addGroupBy('userDetails.user_role')
// //     .addGroupBy('userDetails.state')
// //     .addGroupBy('userDetails.city')
// //     .limit(pageSize)
// //     .offset(skip)
// //     .getRawMany();
// // total=await AppDataSource.getRepository(Users)
// // .createQueryBuilder('user')
// // .leftJoin('user.jobs', 'jobApplication')  // Join with JobApplication using the 'jobs' relationship
// // .leftJoin('user.details','userDetails')
// // .where("user.email like :email",{email:`%${filter}%`})
// // .getCount();

// //  } else if (phoneRegex.test(filter)) {

// //    usersWithApplications = await AppDataSource.getRepository(Users)
// //     .createQueryBuilder('user')
// //     .leftJoin('user.jobs', 'jobApplication')
// //     .leftJoin('user.details','userDetails')
// //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
// //     .where("user.mobile_number like :mobile_number",{mobile_number:`%${filter}%`})
// //     .groupBy('user.uuid')
// //     .addGroupBy('user.email')
// //     .addGroupBy('user.deactivated')
// //     .addGroupBy('userDetails.state')
// //     .addGroupBy('userDetails.city')
// //     .addGroupBy('user.first_name')
// //     .addGroupBy('user.last_name')
// //     .addGroupBy('user.mobile_number')
// //     .addGroupBy('userDetails.profile_pic')
// //     .addGroupBy('userDetails.gender')
// //     .addGroupBy('userDetails.user_role')
// //     .limit(pageSize)
// //     .offset(skip)
// //     .getRawMany();
// // total=await AppDataSource.getRepository(Users)
// // .createQueryBuilder('user')
// // .leftJoin('user.jobs', 'jobApplication')  // Join with JobApplication using the 'jobs' relationship
// // .leftJoin('user.details','userDetails')
// // .where("user.mobile_number like :mobile_number",{mobile_number:`%${filter}%`})
// // .getCount();

// //  } else  {

// //    usersWithApplications = await AppDataSource.getRepository(Users)
// //     .createQueryBuilder('user')
// //     .leftJoin('user.jobs', 'jobApplication')
// //     .leftJoin('user.details','userDetails')
// //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
// //     .where("user.first_name like :name",{name:`%${filter}%`})
// //     .groupBy('user.uuid')
// //     .addGroupBy('user.email')
// //     .addGroupBy('user.deactivated')
// //     .addGroupBy('user.first_name')
// //     .addGroupBy('user.last_name')
// //     .addGroupBy('user.mobile_number')
// //     .addGroupBy('userDetails.profile_pic')
// //     .addGroupBy('userDetails.gender')
// //     .addGroupBy('userDetails.user_role')
// //     .addGroupBy('userDetails.state')
// //     .addGroupBy('userDetails.city')
// //     .limit(pageSize)
// //     .offset(skip)
// //     .getRawMany();
// // total=await AppDataSource.getRepository(Users)
// // .createQueryBuilder('user')
// // .leftJoin('user.jobs', 'jobApplication')  // Join with JobApplication using the 'jobs' relationship
// // .leftJoin('user.details','userDetails')
// // .where("user.first_name like :name",{name:`%${filter}%`})
// // .getCount();

// //  }
// //  } else {
// //    usersWithApplications = await AppDataSource.getRepository(Users)
// //     .createQueryBuilder('user')
// //     .leftJoin('user.jobs', 'jobApplication')
// //     .leftJoin('user.details','userDetails')
// //     .select(['user.uuid','user.email','user.first_name','user.last_name','user.mobile_number','userDetails.profile_pic','userDetails.gender','userDetails.user_role','COUNT(jobApplication.application_id) AS JobsCount','userDetails.city','userDetails.state','user.deactivated'])
// //     .groupBy('user.uuid')
// //     .addGroupBy('user.email')
// //     .addGroupBy('user.deactivated')
// //     .addGroupBy('user.first_name')
// //     .addGroupBy('user.last_name')
// //     .addGroupBy('user.mobile_number')
// //     .addGroupBy('userDetails.profile_pic')
// //     .addGroupBy('userDetails.gender')
// //     .addGroupBy('userDetails.user_role')
// //     .addGroupBy('userDetails.state')
// //     .addGroupBy('userDetails.city')
// //     .limit(pageSize)
// //     .offset(skip)
// //     .getRawMany();
// // total=await AppDataSource.getRepository(Users)
// // .createQueryBuilder('user')
// // .leftJoin('user.jobs', 'jobApplication')
// // .leftJoin('user.details','userDetails')
// // .getCount();

// //  }
// let filterConditions:any = {};
//         if (filter) {
//             if (emailRegex.test(filter)) {
//                 filterConditions['user.email'] = `%${filter}%`;
//             } else if (phoneRegex.test(filter)) {
//                 filterConditions['user.mobile_number'] = `%${filter}%`;
//             } else {
//                 filterConditions['user.first_name'] = `%${filter}%`;
//             }
//         }

//         let query = AppDataSource.getRepository(Users)
//             .createQueryBuilder('user')
//             .leftJoin('user.jobs', 'jobApplication')
//             .leftJoin('user.details', 'userDetails')
//             .select([
//                 'user.uuid',
//                 'user.email',
//                 'user.first_name',
//                 'user.last_name',
//                 'user.mobile_number',
//                 'userDetails.profile_pic',
//                 'userDetails.gender',
//                 'userDetails.user_role',
//                 'COUNT(jobApplication.application_id) AS JobsCount',
//                 'userDetails.city',
//                 'userDetails.state',
//                 'user.deactivated'
//             ])
//             .groupBy('user.uuid')
//             .addGroupBy('user.email')
//             .addGroupBy('user.deactivated')
//             .addGroupBy('user.first_name')
//             .addGroupBy('user.last_name')
//             .addGroupBy('user.mobile_number')
//             .addGroupBy('userDetails.profile_pic')
//             .addGroupBy('userDetails.gender')
//             .addGroupBy('userDetails.user_role')
//             .addGroupBy('userDetails.state')
//             .addGroupBy('userDetails.city')
//             .limit(pageSize)
//             .offset(skip);

//         Object.keys(filterConditions).forEach(key => {
//             query = query.andWhere(`${key} LIKE :${key}`, { [key]: filterConditions[key] });
//         });

//         usersWithApplications = await query.getRawMany();

//         let totalQuery = AppDataSource.getRepository(Users)
//             .createQueryBuilder('user')
//             .leftJoin('user.jobs', 'jobApplication')
//             .leftJoin('user.details', 'userDetails');

//         Object.keys(filterConditions).forEach(key => {
//             totalQuery = totalQuery.andWhere(`${key} LIKE :${key}`, { [key]: filterConditions[key] });
//         });

//         total = await totalQuery.getCount();

//     res.status(200).json({status:true,message:'Employer list found',data:usersWithApplications,env:process.env.AWS_URL,pagination: {
//         total,
//         page,
//         pageSize,
//         totalPages: Math.ceil(Number(total) / pageSize),
//     }})
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({status:false,message:error})
//     }
// }
// export const postJobByAdmin=async(req:Request,res:Response)=>{

//     const { job_title, tag, job_role, min_salary, max_salary, education, experience, job_type, vacancies, expirationDate, job_level, state, city, job_description,categories } = req.body;
//         const userRepository = AppDataSource.getRepository(ClientUsers);
//         const companyRepository = AppDataSource.getRepository(CompanyProfiles);
//         const jobRepository = AppDataSource.getRepository(Postjobs);
//         try {
//             const {user_uuid} = req.headers;
//             const useruuid=String(user_uuid);
//             console.log('user_uuid:', user_uuid);

//             const clientUser = await userRepository.findOneBy({ user_uuid:useruuid });

//             if (!clientUser) {
//                 res.status(404).json({ status: false, message: 'User not found' });
//                 return;
//             }
//             const companyUser = await companyRepository.findOneBy({ client_user_uuid: clientUser.user_uuid });
//             const jobPost = new Postjobs();
//             jobPost.user_uuid = clientUser.user_uuid;
//             jobPost.job_title = job_title;
//             jobPost.tag = tag;
//             jobPost.job_role = job_role;
//             jobPost.min_salary = min_salary;
//             jobPost.max_salary = max_salary;
//             jobPost.education = education;
//             jobPost.experience = experience;
//             jobPost.job_type = job_type;
//             jobPost.vacancies = vacancies;
//             jobPost.expirationDate = expirationDate;
//             jobPost.job_level = job_level;
//             jobPost.state = state;
//             jobPost.city = city;
//             jobPost.job_description = job_description;
//             jobPost.company_name = companyUser?.company_name;
//             jobPost.company_logo = companyUser?.company_logo;
//             jobPost.job_category=categories;
//             const validationErrors = await validate(jobPost);
//             if (validationErrors.length > 0) {
//                 res.status(400).json({
//                     status: false,
//                     message: 'Validation failed',
//                     errors: validationErrors,
//                 });
//                 return;
//             }
//             const savedJobPost = await jobRepository.save(jobPost);
//             if(process.env.AWS_URL)
//             res.status(200).json({
//                 status: true,
//                 message: 'Job post created successfully',
//                 jobData: {
//                     id: savedJobPost.id,
//                     user_uuid: savedJobPost.user_uuid,
//                     job_title: savedJobPost.job_title,
//                     tag: savedJobPost.tag,
//                     job_role: savedJobPost.job_role,
//                     min_salary: savedJobPost.min_salary,
//                     max_salary: savedJobPost.max_salary,
//                     education: savedJobPost.education,
//                     experience: savedJobPost.experience,
//                     job_type: savedJobPost.job_type,
//                     vacancies: savedJobPost.vacancies,
//                     expirationDate: savedJobPost.expirationDate,
//                     job_level: savedJobPost.job_level,
//                     state: savedJobPost.state,
//                     city: savedJobPost.city,
//                     company_name: savedJobPost.company_name,
//                     job_description: savedJobPost.job_description,
//                     created_date: savedJobPost.created_date,
//                     updated_date: savedJobPost.updated_date,
//                     company_logo: process.env.AWS_URL+savedJobPost.company_logo
//                 },
//             });
//         } catch (error) {
//             console.error('Error creating job post:', error);
//             res.status(500).json({ status: false, message: 'Error processing job post', error });
//         }
// };
// export const adduserByAdmin=async(req:Request,res:Response)=>{
//  const {typeuser,socialLinks}=req.body;
//  try{
//  if(typeuser==='Job Seeker')
// {
//   const userRepository = AppDataSource.getRepository(Users);
//   const users = socialLinks.map((socialLink: any) => {
//     let first_name,last_name;
//     const spilted_name=socialLink.fullName.split(' ');
//     if (spilted_name.length >= 3) {
//         first_name = spilted_name[0];
//         last_name = spilted_name.slice(1).join(' ');
//     }
//       else{
//     first_name = spilted_name[0];
//     last_name = spilted_name[1];
//       }

//         return {

//             email: socialLink.email,
//             mobile_number: socialLink.mobile_number,
//             otp_verified:true,
//             first_name:first_name,
//             last_name:last_name
//         };
//     });
//     await userRepository.insert(users);
//     res.status(200).json({status:true, message: 'Users added successfully' });
//     return;
// }

//     const companyRepository = AppDataSource.getRepository(ClientUsers);
//     const  company = socialLinks.map((socialLink: any) => {
//         let first_name,last_name;
//     const spilted_name=socialLink.fullName.split(' ');
//     if (spilted_name.length >= 3) {
//         first_name = spilted_name[0];
//         last_name = spilted_name.slice(1).join(' ');
//     }
//       else{
//     first_name = spilted_name[0];
//     last_name = spilted_name[1];
//       }

//           return {
//               name: socialLink.name,
//               email: socialLink.email,
//               mobile_number: socialLink.mobile_number,
//               first_name:first_name,
// last_name:last_name
//           };
//       });
//       await companyRepository.insert(company);
//        res.status(200).json({ status:true, message: 'Company added successfully' });
// return;
//  }
//  catch(error:any)
//  {

//     if(error.code==='23505'){
//         res.status(422).json({status:false, message: 'One of email or mobile already exist' });
//     return;
//      }
//      console.log(error);
//     res.status(500).json({ status: false, message: 'Error updating user.', error });
//  return;
// }

// }
// export const updateCompanyProfileByAdmin=async(req:Request,res:Response)=>{
//    const { company_name, company_size, company_industry, company_website, company_location, company_founded_year, company_contact, company_description, company_social_media, company_vision,company_social_media_id,company_social_media_id_delete } = req.body;
//        const files = req.files as { [key: string]: Express.Multer.File[] }
//        const company_logo = files?.['company_logo']?.[0] || null;
//        const company_banner = files?.['company_banner']?.[0] || null;
//        const userRepository = AppDataSource.getRepository(ClientUsers);
//        const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles)
//        try {
//            const {user_uuid} = req.headers;
//            const uuid=String(user_uuid)
//            const clientUser = await userRepository.findOneBy({ user_uuid:uuid });

//            if (!clientUser || clientUser.deactivated===1) {
//                res.status(404).json({ status: false, message: 'User not found' });
//                return;
//            }

//            let companyProfile = await companyProfileRepository.findOneBy({ client_user_uuid: clientUser.user_uuid })
//            let company_founded;
//            console.log(company_founded_year)
//            if (!/^\d{4}$/.test(company_founded_year)) {

//                company_founded = null;

//              }
//              else{
//                company_founded=company_founded_year
//              }

//            let company_logo_url:any;
//            let company_banner_url:any;
//            let name=clientUser.user_uuid;
//            let name1=clientUser.user_uuid;
//            if(company_logo){
//                const { buffer,mimetype } = company_logo;
//                name+='_company_logo'
//                const fileStream = Readable.from(buffer);
//                await uploadImageToS3(fileStream, 'company_images',name , mimetype);
//                company_logo_url='/company_images/'+name;
//            }
//            if (company_banner) {
//                const { buffer, mimetype } = company_banner;
//                name1+='_company_banner'
//                const fileStream = Readable.from(buffer);
//                await uploadImageToS3(fileStream, 'company_images',name1, mimetype);
//                company_banner_url='/company_images/'+name1
//            }
//            const social_links = companyProfile?.company_social_media_links|| [];
//                    let socialLinks: any[] = [];
//                    console.log(company_social_media)
//                    if (company_social_media&& company_social_media_id === undefined) {

//                        socialLinks = JSON.parse(company_social_media);
//                        console.log(socialLinks)
//                        socialLinks.forEach((e: any) => {
//                            e.id = uuidv4();
//                            social_links.push(e);
//                        });
//                    }
//            if (companyProfile) {

//                if (company_social_media_id_delete!==undefined && companyProfile.company_social_media_links.length>0) {
//                    const socialIndex = companyProfile.company_social_media_links.findIndex((item) => item.id === company_social_media_id_delete);

//                    if (socialIndex > -1) {
//                        companyProfile.company_social_media_links.splice(socialIndex,1);
//                    }
//                }
//        else{

//            companyProfile.company_social_media_links = social_links || companyProfile.company_social_media_links;
//        }
//                    companyProfile.company_name = company_name || companyProfile.company_name;
//                    companyProfile.company_logo = company_logo_url || companyProfile.company_logo;
//                    companyProfile.company_size = company_size || companyProfile.company_size;
//                    companyProfile.company_industry = company_industry || companyProfile.company_industry;
//                    companyProfile.company_website = company_website || companyProfile.company_website;
//                    companyProfile.company_location = company_location || companyProfile.company_location;
//                    companyProfile.company_founded_year = company_founded || companyProfile.company_founded_year;
//                    companyProfile.company_contact = company_contact || companyProfile.company_contact;
//                    companyProfile.company_description = company_description || companyProfile.company_description;
//                    companyProfile.company_banner = company_banner_url || companyProfile.company_banner;

//                    companyProfile.company_vision = company_vision || companyProfile.company_vision;
//                    await companyProfileRepository.save(companyProfile);
//                } else {
//                    companyProfile = new CompanyProfiles();
//                    companyProfile.client_user_uuid = clientUser.user_uuid;
//                    companyProfile.company_name = company_name;
//                    companyProfile.company_logo = company_logo_url;
//                    companyProfile.company_size = company_size;
//                    companyProfile.company_industry = company_industry;
//                    companyProfile.company_website = company_website;
//                    companyProfile.company_location = company_location;
//                    companyProfile.company_founded_year = company_founded;
//                    companyProfile.company_contact = company_contact;
//                    companyProfile.company_description = company_description;
//                    companyProfile.company_banner=company_banner_url;
//                companyProfile.company_social_media_links=social_links;
//                    companyProfile.company_vision=company_vision;
//                    companyProfile.profile_completion=0;
//                    await companyProfileRepository.save(companyProfile);
//                }
//        if(companyProfile.company_name && companyProfile.company_logo && companyProfile.company_description &&  companyProfile.profile_completion!=35 && companyProfile.profile_completion<=65){
//        companyProfile.profile_completion=companyProfile.profile_completion!==0?companyProfile.profile_completion+35:35;
//        console.log(companyProfile.profile_completion)
//        }
//        if(companyProfile.company_location && companyProfile.company_industry && companyProfile.company_size && companyProfile.company_founded_year &&  companyProfile.profile_completion!=55 && companyProfile.profile_completion<=45){
//            companyProfile.profile_completion=companyProfile.profile_completion!==0?companyProfile.profile_completion+55:55;
//            console.log(companyProfile.profile_completion)
//            }
//        if(companyProfile.company_social_media_links.length>0 && companyProfile.profile_completion!=10 && companyProfile.profile_completion!=65 && companyProfile.profile_completion!=45 &&companyProfile.profile_completion<=90){
//            companyProfile.profile_completion=companyProfile.profile_completion!==0?companyProfile.profile_completion+10:10;
//            }
//        if(company_social_media_id_delete!==undefined&&companyProfile.company_social_media_links.length===0){
//            companyProfile.profile_completion-=10
//        }
//        await companyProfileRepository.save(companyProfile);
//                let company_l=process.env.AWS_URL+company_logo_url;
//                let company_b=process.env.AWS_URL+company_banner_url;
//                res.status(200).json({
//                    status: true,
//                    message: 'Company profile uploaded successfully',
//                    token: clientUser.token,
//                    clientData: {
//                        id: clientUser.id,
//                        user_uuid: clientUser.user_uuid,
//                        first_name: clientUser.first_name,
//                        last_name: clientUser.last_name,
//                        mobile_number: clientUser.mobile_number,
//                        country_code: clientUser.country_code,
//                        email: clientUser.email,
//                        designation: clientUser.designation,
//                        created_date: clientUser.created_date,
//                        updated_date: clientUser.updated_date,
//                        company_profile: {
//                            company: companyProfile.company_name,
//                            company_logo: company_l,
//                            company_size: companyProfile.company_size,
//                            company_industry: companyProfile.company_industry,
//                            company_website: companyProfile.company_website,
//                            company_location: companyProfile.company_location,
//                            company_founded_year: companyProfile.company_founded_year,
//                            company_contact: companyProfile.company_contact,
//                            company_description: companyProfile.company_description,
//                            created_date: companyProfile.created_date,
//                            updated_date: companyProfile.updated_date,
//                            company_banner:company_b,
//                            company_social_media:companyProfile.company_social_media_links,
//                            company_vision:companyProfile.company_vision,
//                            profile_completion:companyProfile.profile_completion
//                        }
//                    }
//                });
//            } catch (error) {
//                console.log(error)
//                res.status(500).json({ status: false, message: 'Error processing company profile', error });
//            }
// }
// export const getCompanyProfileByAdmin = async (req: Request, res: Response): Promise<void> => {
//     const userRepository = AppDataSource.getRepository(ClientUsers);
//     const companyProfileRepository = AppDataSource.getRepository(CompanyProfiles);

//     try {
//         const {user_uuid} = req.headers;
//            const uuid=String(user_uuid)
//         console.log('user_uuid:', user_uuid);
//         const [clientUser, companyProfile] = await Promise.all([
//             userRepository.findOne({  where: { user_uuid:uuid },
//                 select: ['email', 'mobile_number']
//                 ,order:{created_date:'DESC'} }),
//             companyProfileRepository.findOneBy({ client_user_uuid: uuid })
//         ])

//         if (!clientUser || clientUser.deactivated===1) {
//             res.status(404).json({ status: false, message: 'User not found' });
//             return;
//         }
// let company_b;
// let company_l;
// if(process.env.AWS_URL){
//     if(companyProfile?.company_banner){
// company_b=process.env.AWS_URL+companyProfile.company_banner;
//     }
//     if(companyProfile?.company_logo){
//         company_l=process.env.AWS_URL+companyProfile.company_logo;
//             }
// }

//         if(companyProfile){
//         res.status(200).json({
//             status: true,
//             message: 'Company profile get successfully',
//                 company_profile: {
//                     company_name: companyProfile.company_name,
//                     company_logo: company_l,
//                     company_size: companyProfile.company_size,
//                     company_industry: companyProfile.company_industry,
//                     company_website: companyProfile.company_website,
//                     company_location: companyProfile.company_location,
//                     company_founded_year: companyProfile.company_founded_year,
//                     company_contact: companyProfile.company_contact,
//                     company_description: companyProfile.company_description,
//                     company_vision: companyProfile.company_vision,
//                     company_banner: company_b,
//                     company_social_media_link: companyProfile.company_social_media_links,
//                     created_date: companyProfile.created_date,
//                     updated_date: companyProfile.updated_date,
//                     profile_completion:companyProfile.profile_completion,
//                     email: clientUser.email,
//                     mobile_number: clientUser.mobile_number
//                 }

//             })
//         }
//         else {
//             res.status(200).json({ status: false, message: `company profile not there` })
//         }
//     } catch (error) {
//         res.status(500).json({ status: false, message: 'Error processing company profile', error });
//     }
// };
// export const getUserProfileByAdmin=async(req: Request, res: Response):Promise<void>=>{

//         const userRepository = AppDataSource.getRepository(Users);
//         const userDetailsRepository = AppDataSource.getRepository(UserDetails);
//         try {
//             const {user_uuid} = req.headers;
//             const uuid=String(user_uuid);
//             const user = await userRepository.findOneBy({ uuid });

//             if (!user) {
//                 res.status(404).json({ status: false, message: 'User not found' });
//                 return;
//             }

//             const userDetails = await userDetailsRepository.findOneBy({ user_uuid:uuid });
//             let cv_url,profile_pic_url;
//         if(process.env.AWS_URL && userDetails?.profile_pic){

//     profile_pic_url=process.env.AWS_URL+userDetails?.profile_pic;
//         }
//         if(process.env.AWS_URL && userDetails?.cv_url){
//         cv_url=process.env.AWS_URL+userDetails?.cv_url;
//         }

//             res.status(200).json({
//                 status: true,
//                 message: 'User profile fetched successfully',
//                 userData: {
//                     id: user.id,
//                     uuid: user.uuid,
//                     first_name: user.first_name,
//                     last_name: user.last_name,
//                     email: user.email,
//                     mobile_number: user.mobile_number,
//                     date_of_birth: user.date_of_birth,
//                     created_at: user.created_at,
//                     userDetails: userDetails ? {
//                         id: userDetails.id,
//                         languages_spoken: userDetails.languages_spoken,
//                         skills: userDetails.skills,
//                         city: userDetails.city,
//                         state:userDetails.state,
//                         about_you: userDetails.about_you,
//                         cv_url: cv_url,
//                         is_fresher: userDetails.is_fresher,
//                         experience: userDetails.experience,
//                         created_at: userDetails.created_at,
//                         updated_at: userDetails.updated_at,
//                         education:userDetails.education,
//                         gender: userDetails.gender,
//                         cv_name:userDetails.cv_name,
//                         user_role:userDetails.user_role,
//                         profile_pic:profile_pic_url,
//                         social_media:userDetails.social_media,
//                         profile_completion:userDetails.profile_completion
//                     } : null
//                 },
//             });
//         } catch (error) {
//             res.status(500).json({ status: false, message: 'Error fetching user', error });
//         }
// }
// export const updateClientByAdmin=async (req:Request,res:Response):Promise<void>=>{
//     const {email,mobile_number}=req.body;
//     try{
//         const {user_uuid} = req.headers;
//         const uuid=String(user_uuid)
//     const userRepository = AppDataSource.getRepository(ClientUsers);

//     const client_user=await userRepository.findOneBy({user_uuid:uuid})
//     if(client_user){
//         if(email){
//         const emailfinder=await userRepository.findOneBy({email});
//         if(emailfinder?.user_uuid!==client_user.user_uuid && emailfinder?.email!==undefined){
//             res.status(200).json({status:false,message:"Email already exist"})
//             return
//         }
//         client_user.email=email;
//     }
//     if(mobile_number){
//         const mobilefinder=await userRepository.findOneBy({mobile_number});
//         if(mobilefinder?.user_uuid!==client_user.user_uuid && mobilefinder?.mobile_number!==undefined){
//             res.status(200).json({status:false,message:"Mobile already exist"})
//             return;
//         }
//         client_user.mobile_number=mobile_number
//     }
//         await userRepository.save(client_user);
//         res.status(200).json({ status: true, message: 'Details changed successfully' });
//             return;

//     }
//     else{
//         res.status(200).json({ status: false, message: 'Details not found' });
//             return;
//     }

//     }catch(err){
//         console.log(err)
//         res.status(500).json({status:false,message:'Internal Error'})
//     }
// };
// export const updateUserByAdmin = async (req: Request, res: Response): Promise<void> => {
//     const {email,mobile_number,name}=req.body;

//     const user_uuid=req.headers;
//     const uuid=String(user_uuid)

//     if (!uuid) {
//         res.status(401).json({ status: false, message: 'Unauthorized' });
//         return;
//     }

//     const userRepository = AppDataSource.getRepository(Users);
//     const user = await userRepository.findOneBy({ uuid });

//     if (!user) {
//         res.status(404).json({ status: false, message: 'User not found.' });
//         return;
//     }

//     try {
//         if(email){
//             user.email=email;
//         }
//         if(mobile_number){

//             user.mobile_number=mobile_number;
//         }
//         if(name){
//             const spilted_name=name.split(' ');
//             user.first_name = spilted_name[0];
//             user.last_name =spilted_name[1];
//         }
//         await userRepository.save(user);
//         res.status(200).json({ status: true, message: 'User updated successfully!', user });
//     } catch (error) {
//         res.status(500).json({ status: false, message: 'Error updating user.', error });
//     }
// };
// export const updateUserProfileByAdmin=async(req:Request,res:Response):Promise<void>=>{
//     const {
//             languages_spoken,
//             skills,
//             city,
//             state,
//             about_you,
//             education,
//             social_media,
//             social_media_id,
//             social_media_id_delete,
//             cv_url,
//             is_fresher,
//             experience,
//             experience_id,
//             experience_id_delete,
//             education_id_delete,
//             skill_id_delete,
//             education_id,
//             skills_id,
//             gender,
//             cv_name,
//             user_role
//         } = req.body;

//         const {user_uuid} =req.headers;
//         const uuid=String(user_uuid);
//         const userRepository = AppDataSource.getRepository(Users);
//         const userDetailsRepository = AppDataSource.getRepository(UserDetails);
//         const files = req.files as { [key: string]: Express.Multer.File[] };
//         const profile_pic = files?.['profile_pic']?.[0] || null;
//         const resume = files?.['resume']?.[0] || null;
//         try {

//             const user = await userRepository.findOneBy({ uuid });
//             if (!user) {
//                 res.status(404).json({ status: false, message: 'User not found' });
//                 return;
//             }
//             let userDetails = await userDetailsRepository.findOneBy({ user_uuid: uuid });

//             const exp = userDetails?.experience || [];
//             const edu = userDetails?.education || [];
//             const skillsList = userDetails?.skills || [];
//             const social_links = userDetails?.social_media || [];
//             if (experience && experience_id === undefined) {
//                 experience.id = uuidv4();
//                 exp.push(experience);
//             }

//             if (education && education_id === undefined) {
//                 education.id = uuidv4();
//                 edu.push(education);
//             }

//             if (skills && skills_id === undefined) {
//                 skills.id = uuidv4();
//                 skillsList.push(skills);
//             }

//             let socialLinks: any[] = [];
//             if (social_media && social_media_id === undefined) {
//                 socialLinks = JSON.parse(social_media);
//                 socialLinks.forEach((e: any) => {
//                     e.id = uuidv4();
//                     social_links.push(e);
//                 });
//             }

//             let profile_pic_url: any;
//             let resume_url: any;
//             let name = uuid;
//             let name1 = uuid;

//             if (resume) {
//                 const { buffer, mimetype } = resume;
//                 name += '_resume';
//                 const fileStream = Readable.from(buffer);
//                 await uploadImageToS3(fileStream, 'userdata', name, mimetype);
//                 resume_url='/userdata/'+name
//             }

//             if (profile_pic) {
//                 const { buffer, mimetype, filename } = profile_pic;
//                 name1 += '_profile_pic';
//                 const fileStream = Readable.from(buffer);
//                 await uploadImageToS3(fileStream, 'userdata', name1, mimetype);
//                 profile_pic_url='/userdata/'+name1
//             }

//             if (userDetails) {
//                 if(user_role && state && city && userDetails.user_role===null && userDetails.state===null && userDetails.city===null){
//                     userDetails.profile_completion=userDetails.profile_completion!==0?userDetails.profile_completion+20:20;
//                 }
//                 if(education && edu.length>0 && userDetails.education.length==1 && education_id_delete===undefined && education_id===undefined){
//                         userDetails.profile_completion=userDetails.profile_completion!==0?userDetails.profile_completion+30:30;

//                     }
//                 if(experience && exp.length>0 && userDetails.experience.length===1 && experience_id_delete===undefined && experience_id===undefined)
//                     {

//                     userDetails.profile_completion=userDetails.profile_completion!==0?userDetails.profile_completion+17:17;
//                     }
//                 if(skills && skillsList.length>0 && userDetails.skills.length===1 && skill_id_delete===undefined && skills_id===undefined){
//                     userDetails.profile_completion=userDetails.profile_completion!==0?userDetails.profile_completion+10:10;
//                     }
//                 if(resume_url!==undefined && userDetails.cv_url===null){
//                     userDetails.profile_completion=userDetails.profile_completion!==0?userDetails.profile_completion+18:18;

//                 }
//                 if(social_media&&social_links.length>0 && userDetails.social_media.length===1 && social_media_id_delete===undefined && social_media_id===undefined){
//                     userDetails.profile_completion=userDetails.profile_completion!==0?userDetails.profile_completion+5:5;
//                     }
//                 if (experience_id!==undefined) {

//                     const experienceIndex = exp.findIndex((item) => item.id === experience_id);
//                     if (experienceIndex > -1) {
//                         exp[experienceIndex] = { ...exp[experienceIndex], ...experience };
//                     }
//                 } else {
//                     userDetails.experience = exp || userDetails.experience;

//                             }

//                 if (education_id!==undefined) {
//                     const educationIndex = edu.findIndex((item) => item.id === education_id);
//                     if (educationIndex > -1) {
//                         edu[educationIndex] = { ...edu[educationIndex], ...education };
//                     }
//                 } else {
//                     userDetails.education = edu || userDetails.education;
//                 }

//                 if (skills_id!==undefined) {
//                     const skillsIndex = skillsList.findIndex((item) => item.id === skills_id);
//                     if (skillsIndex > -1) {
//                         skillsList[skillsIndex] = { ...skillsList[skillsIndex], ...skills };
//                     }
//                 } else {
//                     userDetails.skills = skillsList || userDetails.skills;
//                 }

//                 if (social_media_id!==undefined) {
//                     const socialIndex = social_links.findIndex((item) => item.id === social_media_id);
//                     if (socialIndex > -1) {
//                         social_links[socialIndex] = { ...social_links[socialIndex], ...social_media };
//                     }
//                 } else {
//                     userDetails.social_media = social_links || userDetails.social_media;
//                 }

//              if(experience_id_delete!==undefined && userDetails.experience.length>0){
//                 const experienceIndex = userDetails.experience.findIndex((item:any) => item.id === experience_id_delete);
//         if (experienceIndex > -1) {
//             userDetails.experience.splice(experienceIndex, 1);

//             if(userDetails.experience.length===0){

//                 userDetails.profile_completion-=17;

//             }
//              }
//             }
//             if(education_id_delete!==undefined && userDetails.education.length>0){
//                 const educationIndex = userDetails.education.findIndex((item:any) => item.id === education_id_delete);
//         if (educationIndex > -1) {
//             userDetails.education.splice(educationIndex, 1);
//             if(userDetails.education.length===0){
//                 userDetails.profile_completion-=30;
//             }
//              }
//             }
//             if(skill_id_delete!==undefined && userDetails.skills.length>0){
//                 const skillIndex = userDetails.skills.findIndex((item:any) => item.id === skill_id_delete);
//         if (skillIndex > -1) {
//             userDetails.skills.splice(skillIndex, 1);
//             if(userDetails.skills.length===0){
//                 userDetails.profile_completion-=10;
//             }
//              }
//             }
//             if(social_media_id_delete!==undefined && userDetails.social_media.length>0){
//                 const socialIndex = userDetails.social_media.findIndex((item:any) => item.id === social_media_id_delete);
//         if (socialIndex > -1) {
//             userDetails.social_media.splice(socialIndex, 1);
//             if(userDetails.social_media.length===0){
//                 userDetails.profile_completion-=5;
//             }
//              }
//             }
//             let total_exp = 0;
//             const currentYear = new Date().getFullYear();
//             const currentMonth = new Date().getMonth() + 1;
//             const currentDay = new Date().getDate();
//             console.log(userDetails.experience)
//             for (let i = 0; i < userDetails.experience.length; i++) {
//                 const startDate = new Date(userDetails.experience[i].start_year);
//                 const endDate = userDetails.experience[i].end_year ? new Date(userDetails.experience[i].end_year) : new Date(currentYear, currentMonth - 1, currentDay); // Use current date if end_date is not provided
//                 const timeDiff = endDate.getTime() - startDate.getTime();
//                 const totalYears = timeDiff / (1000 * 3600 * 24 * 365);
//                 total_exp += totalYears;
//                 }
//             userDetails.total_experience = total_exp;
//                 userDetails.languages_spoken = languages_spoken || userDetails.languages_spoken;
//                 userDetails.city = city || userDetails.city;
//                 userDetails.state = state || userDetails.state;
//                 userDetails.about_you = about_you || userDetails.about_you;
//                 userDetails.profile_pic = profile_pic_url || userDetails.profile_pic;
//                 userDetails.cv_url = resume_url || userDetails.cv_url;
//                 userDetails.is_fresher = is_fresher || userDetails.is_fresher;
//                 userDetails.cv_name = cv_name || userDetails.cv_name;
//                 userDetails.gender = gender || userDetails.gender;
//                 userDetails.user_role = user_role || userDetails.user_role;
//                 await userDetailsRepository.save(userDetails);

//             } else {

//                 userDetails = new UserDetails();
//                 if(user_role && state && city){
//                     userDetails.profile_completion=20;
//                     console.log(userDetails.profile_completion)
//                 }
//                 if(edu.length>0){
//                         userDetails.profile_completion=30;
//                         }
//                 if(exp.length>0){
//                             userDetails.profile_completion=17;
//                             }
//                 if(skillsList.length>0){
//                     userDetails.profile_completion=10;
//                     }
//                 if(cv_url){
//                     userDetails.profile_completion=18;
//                     }
//                 if(social_links.length>0){
//                     userDetails.profile_completion=5;
//                     }

//                 userDetails.user_uuid = user.uuid;
//                 userDetails.languages_spoken = languages_spoken;
//                 userDetails.city = city;
//                 userDetails.about_you = about_you;
//                 userDetails.cv_url = cv_url;
//                 userDetails.is_fresher = is_fresher;
//                 userDetails.experience = exp;
//                 userDetails.skills = skillsList;
//                 userDetails.education = edu;
//                 userDetails.profile_pic = profile_pic_url;
//                 userDetails.cv_url = resume_url;
//                 userDetails.cv_name = cv_name;
//                 userDetails.gender = gender;
//                 userDetails.user_role = user_role;
//                 userDetails.social_media = social_links;
//                 userDetails.state = state;
//                 await userDetailsRepository.save(userDetails);

//             }
//                 await userDetailsRepository.save(userDetails);
//                 res.status(200).json({
//                     status: true,
//                     message: 'User details updated successfully',
//                     userData: {
//                         id: user.id,
//                         uuid: user.uuid,
//                         first_name: user.first_name,
//                         last_name: user.last_name,
//                         email: user.email,
//                         mobile_number: user.mobile_number,
//                         date_of_birth: user.date_of_birth,
//                         user_details: userDetails,
//                     },
//                 });

//         } catch (error) {
//             console.log(error);
//             res.status(500).json({ status: false, message: 'Error saving user details', error });
//         }
// }
