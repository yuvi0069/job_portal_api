import { application, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { JobApplication } from "../entities/jobApplication";
import { Postjobs } from "../entities/postjobs";
import { In, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import { UserDetails } from "../entities/userDetails";
import { Users } from "../entities/user";
import { CompanyProfiles } from "../entities/companyProfiles";
import dotenv from "dotenv";
import { FavouriteJob } from "../entities/favouritejob";
import { CompanySavedCandidates } from "../entities/companySavedCandidates";
import { PostJobBenefit } from "../entities/postJobBenefits";
dotenv.config();

export const getAllPostJobs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    page_no,
    job_keywords,
    categories,
    job_type,
    level,
    state,
    location,
    gender,
  } = req.headers;
  const postJobsRepository = AppDataSource.getRepository(Postjobs);
  try {
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const pageSize = 9;

    // const parsedJoblocation = location
    //   ? JSON.stringify(location as string).slice(
    //       1,
    //       location?.length ? location.length + 1 : 0
    //     )
    //   : null;

    // const parsedJoblocation1 = parsedJoblocation
    //   ? parsedJoblocation.split(",")
    //   : [];

    // const parsedJobType = job_type ? JSON.parse(job_type as string) : [];
    // const parsedLevel = level ? JSON.parse(level as string) : [];
    // const parsedsalary = salary_range ? JSON.parse(salary_range as string) : [];
    // const whereConditions: any = {};
    // whereConditions.deactivated = 0;
    // if (state) {
    //   whereConditions.state = state;
    // }
    // if (job_keywords) {
    //   whereConditions.job_role = job_keywords;
    // }

    // if (parsedJobType.length !== 0) {
    //   whereConditions.job_type = In(parsedJobType);
    // }
    // if (categories) {
    //   whereConditions.job_category = categories;
    // }
    // if (parsedLevel.length !== 0) {
    //   whereConditions.job_level = In(parsedLevel);
    // }
    // if (parsedsalary.length !== 0) {
    //   whereConditions.min_salary = MoreThanOrEqual(parsedsalary[0]);
    //   whereConditions.max_salary = LessThanOrEqual(parsedsalary[1]);
    // }
    // if (parsedJoblocation1.length !== 0) {
    //   whereConditions.city = parsedJoblocation1[0];
    //   whereConditions.state = parsedJoblocation1[1];
    // }
    // whereConditions.status = "Active";

    // const [postJobs, total] = await Promise.all([
    //   postJobsRepository.find({
    //     where: whereConditions,
    //     skip: (page - 1) * pageSize,
    //     take: pageSize,
    //     select: [
    //       "id",
    //       "job_role",
    //       "job_title",
    //       "company_name",
    //       "state",
    //       "city",
    //       "job_level",
    //       "created_date",
    //       "job_type",
    //       "experience",
    //       "min_salary",
    //       "max_salary",
    //       "company_logo",
    //       "status",
    //     ], // Only fetch necessary fields
    //     order: {
    //       created_date: "DESC",
    //     },
    //   }),
    //   postJobsRepository.count({
    //     where: whereConditions,
    //   }),
    // ]);

    // if (favouriteJob.length > 0) {
    //   postJobs.forEach((element) => {
    //     if (favouriteJob.some((job) => job.job_id === element.id)) {
    //       element.favourite = true;
    //     } else {
    //       element.favourite = false;
    //     }
    //   });
    // }
    //console.log(categories);
    let totalQuery = postJobsRepository
      .createQueryBuilder("postJobs")
      .leftJoin(
        "post_job_category",
        "category",
        "postJobs.id = category.job_id"
      );
    let postJobsQuery = postJobsRepository
      .createQueryBuilder("postJobs")
      .leftJoin(
        "post_job_category",
        "category",
        "postJobs.id = category.job_id"
      )
      .leftJoin(
        "company_profiles",
        "company_profile",
        "postJobs.user_uuid=company_profile.client_user_uuid"
      )
      .select([
        "CAST(postJobs.id AS INTEGER) AS id",
        "postJobs.user_uuid AS user_uuid",
        "company_profile.company_name AS company_name",
        "postJobs.deactivated AS deactivated",
        "postJobs.job_category AS job_category",
        "postJobs.status AS status",
        "postJobs.job_title AS job_title",
        "postJobs.tag AS tag",
        "postJobs.job_role AS job_role",
        "CAST(postJobs.min_salary AS INTEGER) AS min_salary",
        "CAST(postJobs.max_salary AS INTEGER) AS max_salary",
        "postJobs.education AS education",
        "postJobs.experience AS experience",
        "postJobs.job_type AS job_type",
        "postJobs.vacancies AS vacancies",
        "postJobs.expirationDate AS expirationDate",
        "postJobs.job_level AS job_level",
        "postJobs.state AS state",
        "postJobs.city AS city",
        "company_profile.company_logo AS company_logo",
        "postJobs.job_description AS job_description",
        "postJobs.job_valid_days AS job_valid_days",
        "postJobs.created_date AS created_date",
        "postJobs.gender as gender",
        "postJobs.age_group as age_group",
      ])
      .addSelect("ARRAY_AGG(DISTINCT category.category_name)", "categories")
      .where("postJobs.deactivated = :deactivated", { deactivated: 0 })
      .groupBy("postJobs.id")
      .addGroupBy("company_profile.company_name")
      .addGroupBy("company_profile.company_logo")
      .orderBy("postJobs.created_date", "DESC")
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    totalQuery.andWhere("postJobs.deactivated = :deactivated", {
      deactivated: 0,
    });
    if (state) {
      postJobsQuery.andWhere("postJobs.state = :state", { state });
      totalQuery.andWhere("postJobs.state = :state", { state });
    }
    if (job_keywords) {
      postJobsQuery.andWhere("postJobs.job_role ILIKE :job_keywords", {
        job_keywords: `%${job_keywords}%`,
      });
      totalQuery.andWhere("postJobs.job_role ILIKE :job_keywords", {
        job_keywords: `%${job_keywords}%`,
      });
    }
    if (categories) {
      postJobsQuery.andWhere("category.category_name = :categories", {
        categories,
      });
      totalQuery.andWhere("category.category_name = :categories", {
        categories,
      });
    }
    if (job_type) {
      postJobsQuery.andWhere("postJobs.job_type= :job_type", {
        job_type,
      });
      totalQuery.andWhere("postJobs.job_type= :job_type", {
        job_type,
      });
    }
    if (level) {
      postJobsQuery.andWhere("postJobs.job_level= :level", {
        level,
      });
      totalQuery.andWhere("postJobs.job_level= :level", {
        level,
      });
    }
    if (gender && gender != "Any") {
      postJobsQuery.andWhere("postJobs.gender= :gender", {
        gender,
      });
      totalQuery.andWhere("postJobs.gender= :gender", {
        gender,
      });
    }
    // if (parsedsalary.length === 2) {
    //   postJobsQuery.andWhere("postJobs.min_salary >= :minSalary", {
    //     minSalary: parsedsalary[0],
    //   });
    //   postJobsQuery.andWhere("postJobs.max_salary <= :maxSalary", {
    //     maxSalary: parsedsalary[1],
    //   });
    //   totalQuery.andWhere("postJobs.min_salary >= :minSalary", {
    //     minSalary: parsedsalary[0],
    //   });
    //   totalQuery.andWhere("postJobs.max_salary <= :maxSalary", {
    //     maxSalary: parsedsalary[1],
    //   });
    // }
    // if (parsedJoblocation1.length === 2) {
    //   postJobsQuery.andWhere("postJobs.city = :city", {
    //     city: parsedJoblocation1[0],
    //   });
    //   postJobsQuery.andWhere("postJobs.state = :state", {
    //     state: parsedJoblocation1[1],
    //   });
    //   totalQuery.andWhere("postJobs.city = :city", {
    //     city: parsedJoblocation1[0],
    //   });
    //   totalQuery.andWhere("postJobs.state = :state", {
    //     state: parsedJoblocation1[1],
    //   });
    // }

    postJobsQuery.andWhere("postJobs.status = :status", { status: "Active" });
    totalQuery.andWhere("postJobs.status = :status", { status: "Active" });
    const postjobs = await postJobsQuery.getRawMany();

    const total = await totalQuery.getCount();

    if (postjobs.length === 0) {
      res.status(200).json({ status: false, message: "No job posts found" });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Job posts fetched successfully",
      data: postjobs,
      env: process.env.AWS_URL,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res
      .status(500)
      .json({ status: false, message: "Error fetching job posts", error });
  }
};

export const applyJob = async (req: Request, res: Response): Promise<void> => {
  const { job_id, client_user_uuid } = req.body;
  try {
    const job_seeker_id = req.user?.userUuid;
    const jobRepository = AppDataSource.getRepository(JobApplication);
    if (!job_id || !client_user_uuid || !job_seeker_id) {
      res.status(200).json({ status: false, message: "Send all info" });
      return;
    }
    const jobApplication = new JobApplication();
    jobApplication.employer_uuid = client_user_uuid;
    jobApplication.job_id = job_id;
    jobApplication.job_seeker_uuid = job_seeker_id;
    await jobRepository.save(jobApplication);

    res.status(200).json({
      status: true,
      message: `Application send`,
      data: jobApplication,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      res.status(200).json({ status: false, message: "Already applied" });
      return;
    }
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
    return;
  }
};

export const getJobApplicationByJobId = async (req: Request, res: Response) => {
  const { job_id, job_status, page_no } = req.headers;
  try {
    const page = page_no ? Number(page_no) : 1;
    const pageSize = 8;
    const jobRepository = AppDataSource.getRepository(JobApplication);
    let status = job_status ? job_status : "Progress";
    if (!job_id) {
      res.status(200).json({ status: false, message: "Send info" });
      return;
    }

    const jobApplicantsDetails = await jobRepository
      .createQueryBuilder("job_applications")
      .innerJoin(
        "users",
        "users",
        "job_applications.job_seeker_uuid=users.uuid"
      )
      .leftJoin(
        "user_details",
        "user_details",
        "job_applications.job_seeker_uuid = user_details.user_uuid"
      )
      .select([
        "user_details.cv_url",
        "user_details.user_uuid",
        "user_details.profile_pic",
        //"user_details.total_experience",
        "user_details.user_role",
        "users.uuid",
        "users.full_name",
        "user_details.gender",
        "job_applications.application_id",
        "job_applications.application_status",
      ])
      .where("job_applications.job_id= :job_id", { job_id })
      .andWhere("job_applications.application_status= :status", { status })
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getRawMany();
    const total = await jobRepository
      .createQueryBuilder("job_applications")
      .innerJoin(
        "users",
        "users",
        "job_applications.job_seeker_uuid=users.uuid"
      )
      .leftJoin(
        "user_details",
        "user_details",
        "job_applications.job_seeker_uuid = user_details.user_uuid"
      )
      .where("job_applications.job_id= :job_id", { job_id })
      .andWhere("job_applications.application_status= :status", { status })
      .getCount();
    // const jobApplication = await jobRepository.find({
    //   where: { job_id: job_id, employer_uuid: req.user.userUuid },
    // });
    // if (jobApplication.length === 0) {
    //   res.status(200).json({ status: false, message: `No jobs found` });
    // } else {
    //   const userDetailsRepository = AppDataSource.getRepository(UserDetails);
    //   const userRepository = AppDataSource.getRepository(Users);

    //   const userApplication = await Promise.all(
    //     jobApplication.map(async (e) => {
    //       const userProfile = await userDetailsRepository.findOne({
    //         where: { user_uuid: e.job_seeker_uuid },
    //         select: [
    //           "cv_url",
    //           "user_uuid",
    //           "profile_pic",
    //           "total_experience",
    //           "user_role",
    //           "gender",
    //         ],
    //       });
    //       const user = await userRepository.findOne({
    //         where: { uuid: e.job_seeker_uuid },
    //         select: ["fullName", "mobile_number"],
    //       });
    //       if (userProfile) {
    //         userProfile.application_status = e.application_status;
    //         userProfile.application_id = e.application_id;
    //       }

    //       if (process.env.AWS_URL && user)
    //         return {
    //           totalapplication: jobApplication.length,

    //           user_role: userProfile?.user_role,
    //           user_uuid: e.job_seeker_uuid,
    //           fullName: user?.fullName,
    //           application_id: userProfile?.application_id,
    //           application_status: userProfile?.application_status,
    //           cv_url: process.env.AWS_URL + userProfile?.cv_url,
    //           total_experience: userProfile?.total_experience,
    //           mobile_number: user.mobile_number,
    //           profile_pic: process.env.AWS_URL + userProfile?.profile_pic,
    //           gender: userProfile?.gender,
    //         };
    //     })
    //   );
    res.status(200).json({
      status: true,
      data: jobApplicantsDetails,
      enc: process.env.AWS_URL,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(Number(total) / pageSize),
      },
      message: `Applications found`,
    });
    return;
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
    return;
  }
};

export const getJobyApplicationByJobSeekerUuid = async (
  req: Request,
  res: Response
) => {
  const { page_no, application_status } = req.headers;
  try {
    const job_seeker_uuid = req.user.userUuid;
    const pageSize = 5;
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const skip = (page - 1) * pageSize;
    if (!job_seeker_uuid) {
      res.status(200).json({ status: false, message: `No seeker found` });
    }
    const whereConditions: any = [];
    if (application_status) {
      whereConditions.application_status = application_status;
    }
    whereConditions.job_seeker_uuid = job_seeker_uuid;

    // const favourite_jobs = await FavJobRepository.find({
    //   where: { user_uuid: job_seeker_uuid },
    // });
    // console.log(favourite_job_count, favourite_jobs);

    const postJobsRepository = AppDataSource.getRepository(Postjobs);
    let user, total;

    if (application_status !== "All" && application_status !== undefined) {
      user = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .leftJoin(
          "company_profiles",
          "company_profiles",
          "post_jobs.user_uuid=company_profiles.client_user_uuid"
        )
        .addSelect("company_profiles.company_name", "company_name")
        .addSelect("company_profiles.company_logo", "company_logo")
        // //.addSelect("post_jobs.*")
        .where("job_applications.job_seeker_uuid =:jobSeekerUuid", {
          jobSeekerUuid: job_seeker_uuid,
        })
        .andWhere("job_applications.application_status = :applicationStatus", {
          applicationStatus: application_status,
        })
        .orderBy("job_applications.appiled_at", "DESC")
        .limit(pageSize)
        .offset(skip)
        .getRawMany();
      user = user.map((item: any) => ({
        id: Number(item.post_jobs_id),
        user_uuid: item.post_jobs_user_uuid,
        admin_posted_uuid: item.post_jobs_admin_posted_uuid,
        company_name: item.company_name,
        deactivated: item.post_jobs_deactivated,
        job_category: item.post_jobs_job_category,
        status: item.post_jobs_status,
        job_title: item.post_jobs_job_title,
        tag: item.post_jobs_tag,
        job_role: item.post_jobs_job_role,
        gender: item.post_jobs_gender,
        min_salary: parseFloat(item.post_jobs_min_salary),
        max_salary: parseFloat(item.post_jobs_max_salary),
        education: item.post_jobs_education,
        experience: item.post_jobs_experience,
        job_type: item.post_jobs_job_type,
        vacancies: item.post_jobs_vacancies,
        expirationDate: item.post_jobs_expirationDate,
        job_level: item.post_jobs_job_level,
        state: item.post_jobs_state,
        city: item.post_jobs_city,
        company_logo: item.company_logo,
        job_description: item.post_jobs_job_description,
        job_valid_days: item.post_jobs_job_valid_days,
        created_date: new Date(
          new Date(item.post_jobs_created_date).getTime() + 19800000
        ).toISOString(),
        updated_date: new Date(
          new Date(item.post_jobs_updated_date).getTime() + 19800000
        ).toISOString(),
        deleted_date: item.post_jobs_deleted_date,
        age_group: item.post_jobs_age_group,
        jobApplications: [
          {
            application_id: item.job_applications_application_id,
            application_status: item.job_applications_application_status,
            employer_uuid: item.job_applications_employer_uuid,
            job_seeker_uuid: item.job_applications_job_seeker_uuid,
            job_id: item.job_applications_job_id,
            appiled_at: item.job_applications_appiled_at,
            user_deactivated: item.job_applications_user_deactivated,
          },
        ],
      }));

      total = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .where("job_applications.job_seeker_uuid =:jobSeekerUuid", {
          jobSeekerUuid: job_seeker_uuid,
        })
        .andWhere("job_applications.application_status = :applicationStatus", {
          applicationStatus: application_status,
        })
        .getCount();
    } else {
      user = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .leftJoin(
          "company_profiles",
          "company_profiles",
          "post_jobs.user_uuid=company_profiles.client_user_uuid"
        )
        .addSelect("company_profiles.company_name", "company_name")
        .addSelect("company_profiles.company_logo", "company_logo")
        // //.addSelect("post_jobs.*")
        .where("job_applications.job_seeker_uuid =:jobSeekerUuid", {
          jobSeekerUuid: job_seeker_uuid,
        })
        .orderBy("job_applications.appiled_at", "DESC")
        .limit(pageSize)
        .offset(skip)
        .getRawMany();
      user = user.map((item: any) => ({
        id: Number(item.post_jobs_id),
        user_uuid: item.post_jobs_user_uuid,
        admin_posted_uuid: item.post_jobs_admin_posted_uuid,
        company_name: item.company_name,
        deactivated: item.post_jobs_deactivated,
        job_category: item.post_jobs_job_category,
        status: item.post_jobs_status,
        job_title: item.post_jobs_job_title,
        tag: item.post_jobs_tag,
        job_role: item.post_jobs_job_role,
        gender: item.post_jobs_gender,
        min_salary: parseFloat(item.post_jobs_min_salary),
        max_salary: parseFloat(item.post_jobs_max_salary),
        education: item.post_jobs_education,
        experience: item.post_jobs_experience,
        job_type: item.post_jobs_job_type,
        vacancies: item.post_jobs_vacancies,
        expirationDate: item.post_jobs_expirationDate,
        job_level: item.post_jobs_job_level,
        state: item.post_jobs_state,
        city: item.post_jobs_city,
        company_logo: item.company_logo,
        job_description: item.post_jobs_job_description,
        job_valid_days: item.post_jobs_job_valid_days,
        created_date: new Date(
          new Date(item.post_jobs_created_date).getTime() + 19800000
        ).toISOString(),
        updated_date: new Date(
          new Date(item.post_jobs_updated_date).getTime() + 19800000
        ).toISOString(),
        deleted_date: item.post_jobs_deleted_date,
        age_group: item.post_jobs_age_group,
        jobApplications: [
          {
            application_id: item.job_applications_application_id,
            application_status: item.job_applications_application_status,
            employer_uuid: item.job_applications_employer_uuid,
            job_seeker_uuid: item.job_applications_job_seeker_uuid,
            job_id: item.job_applications_job_id,
            appiled_at: item.job_applications_appiled_at,
            user_deactivated: item.job_applications_user_deactivated,
          },
        ],
      }));

      // user = user.map((job) => {
      //   const { company_profiles, ...rest } = job;
      //   return {
      //     ...rest,
      //     company_name: company_profiles?.company_name ?? null,
      //     company_logo: company_profiles?.company_logo ?? null,
      //   };
      // });

      total = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoinAndSelect("post_jobs.jobApplications", "job_applications")
        .where("job_applications.job_seeker_uuid =:jobSeekerUuid", {
          jobSeekerUuid: job_seeker_uuid,
        })
        .getCount();
    }
    //   const jobIds = job_application.map((application) => application.job_id);
    //   const jobDates=job_application.map((application)=>application.appiled_at);
    //   let jobApplicationStatus=job_application.map((application)=>application.application_status)
    //  if(application_status!=='All'){
    //    jobApplicationStatus.filter(())
    //  }
    //         let [jobs,total]=await Promise.all([
    //         postJobsRepository.find({where:{id:In(jobIds)},skip:(page-1)*pageSize,take:pageSize}),
    //         postJobsRepository.count({where:{id:In(jobIds)}})

    // ])

    res.status(200).json({
      status: true,
      message: `Jobs Applied Founded sucessfully`,
      data: user,
      env: process.env.AWS_URL,
      total_applied_job: total,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(Number(total) / pageSize),
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
    return;
  }
};

export const getJobAlertByJobSeekerRole = async (
  req: Request,
  res: Response
) => {
  const { page_no } = req.headers;
  try {
    const job_seeker_uuid = req.user.userUuid;
    const pageSize = 5;
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);

    const UserRepository = AppDataSource.getRepository(UserDetails);
    const user_role = await UserRepository.findOneBy({
      user_uuid: job_seeker_uuid,
    });

    const whereconditions: any = {};
    if (!user_role?.user_role) {
      res.status(200).json({
        status: false,
        message: `Please select your refernces`,
        pagination: {
          total: 0,
          page,
          pageSize,
          totalPages: Math.ceil(0 / pageSize),
        },
      });
      return;
    } else {
      whereconditions.job_role = user_role.user_role;

      whereconditions.status = "Active";
      const postJobsRepository = AppDataSource.getRepository(Postjobs);
      const total = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .where("post_jobs.job_role = :job_role", {
          job_role: user_role.user_role,
        })
        .andWhere("post_jobs.status = :status", { status: "Active" })
        .getCount();
      const jobs = await postJobsRepository
        .createQueryBuilder("post_jobs")
        .leftJoin(
          "company_profiles",
          "company_profiles",
          "post_jobs.user_uuid=company_profiles.client_user_uuid"
        )
        .where("post_jobs.job_role = :job_role", {
          job_role: user_role.user_role,
        })
        .andWhere("post_jobs.status = :status", { status: "Active" })

        .select([
          "post_jobs.*",
          "company_profiles.company_logo as company_logo",
          "company_profiles.company_name as company_name",
        ])
        .getRawMany();
      // const [jobs, total] = await Promise.all([
      //   postJobsRepository.find({
      //     where: whereconditions,
      //     skip: (page - 1) * pageSize,
      //     take: pageSize,
      //     order: { created_date: "DESC" },
      //   }),
      //   postJobsRepository.count({ where: whereconditions }),
      // ]);

      if (total !== 0) {
        res.status(200).json({
          status: true,
          message: `Jobs Alert Founded sucessfully`,
          data: jobs,
          env: process.env.AWS_URL,
          pagination: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      } else {
        res.status(200).json({
          status: false,
          message: `No Jobs Alert Founded`,
          pagination: {
            total: 0,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
    return;
  }
};

export const postJobToFavourite = async (req: Request, res: Response) => {
  const { job_id } = req.body;
  try {
    const job_seeker_uuid = req.user.userUuid;
    const FavJobRepository = AppDataSource.getRepository(FavouriteJob);
    const favouriteJob = await FavJobRepository.findOneBy({
      user_uuid: job_seeker_uuid,
      job_id: job_id,
    });
    if (favouriteJob) {
      res.status(200).json({ status: false, message: `already favourite job` });
      return;
    }
    await FavJobRepository.save({ job_id, user_uuid: job_seeker_uuid });
    // const newFavJob = new FavouriteJob();
    // newFavJob.job_id = job_id;
    // newFavJob.user_uuid = job_seeker_uuid;
    // await FavJobRepository.save(newFavJob);
    res.status(200).json({ status: true, message: `Added to favourite job` });
    //   }
    // const UserRepository = AppDataSource.getRepository(UserDetails);
    // const user_role = await UserRepository.findOneBy({
    //   user_uuid: job_seeker_uuid,
    // });

    // if (user_role) {
    //   if (!user_role.favourite_job_id) {
    //     user_role.favourite_job_id = [];
    //   }

    //   if (!user_role.favourite_job_id.includes(job_id)) {
    //     user_role.favourite_job_id.push(job_id);
    //     await UserRepository.save(user_role);
    //     res
    //       .status(200)
    //       .json({ status: true, message: `pushed to favourite job` });
    //   } else {
    //     res
    //       .status(200)
    //       .json({ status: false, message: `already favourite job` });
    //   }
    // } else {
    //   const new_user = new UserDetails();
    //   new_user.user_uuid = job_seeker_uuid;
    //   if (!new_user.favourite_job_id) {
    //     new_user.favourite_job_id = [];
    //   }

    //   new_user.favourite_job_id.push(job_id);
    //   await UserRepository.save(new_user);
    //   res.status(200).json({
    //     status: true,
    //     message: `User profile created and added to favourite job`,
    //   });
    // }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
    return;
  }
};

export const getJobToFavourite = async (req: Request, res: Response) => {
  const { page_no } = req.headers;
  const pageSize = 5;
  const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
  try {
    const job_seeker_uuid = req.user.userUuid;

    const FavJobRepository = AppDataSource.getRepository(FavouriteJob);
    // const favJob = await FavJobRepository.find({
    //   where: { user_uuid: job_seeker_uuid },
    //   order: { created_at: "DESC" },
    // });
    // const postJobsRepository = AppDataSource.getRepository(Postjobs);

    //res.status(200).json({ status: true, message: `Fav Job Found`, favJob });
    const fav = await FavJobRepository.createQueryBuilder("favJobs")
      .leftJoin("post_jobs", "postJobs", "favJobs.job_id=postJobs.id")
      .leftJoin(
        "company_profiles",
        "company_profile",
        "postJobs.user_uuid=company_profile.client_user_uuid"
      )
      .where("favJobs.user_uuid =:user_uuid", { user_uuid: job_seeker_uuid })
      .select([
        "CAST(postJobs.id AS INTEGER) AS id",
        "postJobs.user_uuid AS user_uuid",
        "company_profile.company_name AS company_name",
        "postJobs.deactivated AS deactivated",
        "postJobs.job_category AS job_category",
        "postJobs.status AS status",
        "postJobs.job_title AS job_title",
        "postJobs.tag AS tag",
        "postJobs.job_role AS job_role",
        "CAST(postJobs.min_salary AS INTEGER) AS min_salary",
        "CAST(postJobs.max_salary AS INTEGER) AS max_salary",
        "postJobs.education AS education",
        "postJobs.experience AS experience",
        "postJobs.job_type AS job_type",
        "postJobs.vacancies AS vacancies",
        "postJobs.expirationDate AS expirationDate",
        "postJobs.job_level AS job_level",
        "postJobs.state AS state",
        "postJobs.city AS city",
        "company_profile.company_logo AS company_logo",
        "postJobs.job_description AS job_description",
        "postJobs.job_valid_days AS job_valid_days",
        "postJobs.created_date AS created_date",
      ])
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy("favJobs.created_at", "DESC")
      .getRawMany();
    const total = await FavJobRepository.createQueryBuilder("favJobs")
      .innerJoin("favJobs.postJobs", "postJobs")
      .where("favJobs.user_uuid =:user_uuid", { user_uuid: job_seeker_uuid })
      .getCount();
    // console.log(fav);
    // if (favJob && favJob.length > 0) {
    //   const favJobId = favJob.map((elemnet) => {
    //     return elemnet.job_id;
    //   });
    //   const [jobs, total] = await Promise.all([
    //     postJobsRepository.find({ where: { id: In(favJobId) } }),
    //     postJobsRepository.count({ where: { id: In(favJobId) } }),
    //   ]);
    if (fav) {
      res.status(200).json({
        status: true,
        message: "Jobs fetched successfully",
        data: fav,
        env: process.env.AWS_URL,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } else {
      res.status(200).json({
        status: false,
        message: "No jobs favourtite fetched",

        pagination: {
          total: 0,
          page,
          pageSize,
          totalPages: Math.ceil(0 / pageSize),
        },
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
    return;
  }
};

export const deleteJobFavourite = async (req: Request, res: Response) => {
  const { job_id } = req.body;

  try {
    const job_seeker_uuid = req.user.userUuid;

    if (!job_seeker_uuid) {
      res.status(200).json({ status: false, message: `No seeker found` });
    }

    const FavJobRepository = AppDataSource.getRepository(FavouriteJob);
    const favJob = await FavJobRepository.findOneBy({
      user_uuid: job_seeker_uuid,
      job_id,
    });
    if (!favJob) {
      res
        .status(200)
        .json({ status: false, message: `No Favourite Job Found`, favJob });
      return;
    }
    await FavJobRepository.delete({
      favourite_job_uuid: favJob.favourite_job_uuid,
    });
    res
      .status(200)
      .json({ status: true, message: `Favourite Job Deleted`, favJob });
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

export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { application_id, application_status } = req.body;

  try {
    const jobRepository = AppDataSource.getRepository(JobApplication);

    if (!application_id) {
      res.status(200).json({ status: false, message: "Send info" });
      return;
    }
    const job = await jobRepository.findOne({
      where: {
        application_id: application_id,
        employer_uuid: req.user.userUuid,
      },
    });
    if (!job) {
      res.status(200).json({ status: false, message: "No job found" });
      return;
    }
    if (job.application_status !== application_status) {
      job.application_status = application_status;
      await jobRepository.save(job);
      res.status(200).json({
        status: true,
        message: "application status changed",
        data: job,
      });
    } else {
      res
        .status(200)
        .json({ status: false, message: "application status same" });
      return;
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getJobByJobIdForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { job_id } = req.headers;
  try {
    const JobApplicationRepository =
      AppDataSource.getRepository(JobApplication);

    const jobs = await AppDataSource.getRepository(Postjobs)
      .createQueryBuilder("job")
      .where("job.id = :job_id", { job_id: Number(job_id) })
      .leftJoin(
        "company_profiles",
        "company_profile",
        "job.user_uuid=company_profile.client_user_uuid"
      )
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

    const appliedJobs = await JobApplicationRepository.count({
      where: { job_id: Number(job_id), job_seeker_uuid: req.user.userUuid },
    });
    const jobs_length = await JobApplicationRepository.count({
      where: { job_id: Number(job_id) },
    });

    if (!jobs) {
      res.status(200).json({ message: "No job found", status: false });
      return;
    } else {
      jobs.applied = false;
      if (appliedJobs === 1) {
        jobs.applied = true;
      }
      jobs.job_length = jobs_length;
      if (jobs.company_logo) {
        jobs.company_logo = process.env.AWS_URL + jobs.company_logo;
      }
      console.log(jobs);
      jobs.web_link = `https://www.tresstalent.com/jobs/details/${jobs.id}`;
      res.status(200).json({ message: "Job found", status: true, data: jobs });
    }
  } catch (err) {
    res.status(500).json({ message: `Error found ${err}`, status: false });
  }
};

export const getAllPostJobsForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    page_no,
    job_keywords,
    categories,
    job_type,
    level,
    state,
    location,
    salary_range,
    gender,
  } = req.headers;
  const postJobsRepository = AppDataSource.getRepository(Postjobs);

  try {
    const page: number = isNaN(Number(page_no)) ? 1 : Number(page_no);
    const pageSize = 9;
    //console.log(job_keywords);
    // const parsedJoblocation = location
    //   ? JSON.stringify(location as string).slice(
    //       1,
    //       location?.length ? location.length + 1 : 0
    //     )
    //   : null;

    // const parsedJoblocation1 = parsedJoblocation
    //   ? parsedJoblocation.split(",")
    //   : [];

    // const parsedJobType = job_type ? JSON.parse(job_type as string) : [];
    // const parsedLevel = level ? JSON.parse(level as string) : [];
    // const parsedsalary = salary_range ? JSON.parse(salary_range as string) : [];
    // const whereConditions: any = {};
    // whereConditions.deactivated = 0;
    // if (state) {
    //   whereConditions.state = state;
    // }
    // if (job_keywords) {
    //   whereConditions.job_role = job_keywords;
    // }

    // if (parsedJobType.length !== 0) {
    //   whereConditions.job_type = In(parsedJobType);
    // }
    // if (categories) {
    //   whereConditions.job_category = categories;
    // }
    // if (parsedLevel.length !== 0) {
    //   whereConditions.job_level = In(parsedLevel);
    // }
    // if (parsedsalary.length !== 0) {
    //   whereConditions.min_salary = MoreThanOrEqual(parsedsalary[0]);
    //   whereConditions.max_salary = LessThanOrEqual(parsedsalary[1]);
    // }
    // if (parsedJoblocation1.length !== 0) {
    //   whereConditions.city = parsedJoblocation1[0];
    //   whereConditions.state = parsedJoblocation1[1];
    // }
    // whereConditions.status = "Active";

    // const [postJobs, total] = await Promise.all([
    //   postJobsRepository.find({
    //     where: whereConditions,
    //     skip: (page - 1) * pageSize,
    //     take: pageSize,
    //     select: [
    //       "id",
    //       "job_role",
    //       "job_title",
    //       "company_name",
    //       "state",
    //       "city",
    //       "job_level",
    //       "created_date",
    //       "job_type",
    //       "experience",
    //       "min_salary",
    //       "max_salary",
    //       "company_logo",
    //       "status",
    //     ], // Only fetch necessary fields
    //     order: {
    //       created_date: "DESC",
    //     },
    //   }),
    //   postJobsRepository.count({
    //     where: whereConditions,
    //   }),
    // ]);

    // if (favouriteJob.length > 0) {
    //   postJobs.forEach((element) => {
    //     if (favouriteJob.some((job) => job.job_id === element.id)) {
    //       element.favourite = true;
    //     } else {
    //       element.favourite = false;
    //     }
    //   });
    // }
    //console.log(categories);
    let totalQuery = postJobsRepository
      .createQueryBuilder("postJobs")
      .leftJoin(
        "user_favourite_jobs",
        "user_favourite_jobs",
        "user_favourite_jobs.job_id = postJobs.id"
      )
      .leftJoin(
        "post_job_category",
        "category",
        "postJobs.id = category.job_id"
      );
    let postJobsQuery = postJobsRepository
      .createQueryBuilder("postJobs")
      .leftJoin(
        "user_favourite_jobs",
        "user_favourite_jobs",
        "user_favourite_jobs.job_id = postJobs.id AND user_favourite_jobs.user_uuid = :user_uuid",
        { user_uuid: req.user.userUuid }
      )
      .leftJoin(
        "post_job_category",
        "category",
        "postJobs.id = category.job_id"
      )
      .leftJoin(
        "company_profiles",
        "company_profile",
        "postJobs.user_uuid=company_profile.client_user_uuid"
      )

      .select([
        "CAST(postJobs.id AS INTEGER) AS id",
        "postJobs.user_uuid AS user_uuid",
        "company_profile.company_name AS company_name",
        "postJobs.deactivated AS deactivated",
        "postJobs.job_category AS job_category",
        "postJobs.status AS status",
        "postJobs.job_title AS job_title",
        "postJobs.tag AS tag",
        "postJobs.job_role AS job_role",
        "CAST(postJobs.min_salary AS INTEGER) AS min_salary",
        "CAST(postJobs.max_salary AS INTEGER) AS max_salary",
        "postJobs.education AS education",
        "postJobs.experience AS experience",
        "postJobs.job_type AS job_type",
        "postJobs.vacancies AS vacancies",
        "postJobs.expirationDate AS expirationDate",
        "postJobs.job_level AS job_level",
        "postJobs.state AS state",
        "postJobs.city AS city",
        "company_profile.company_logo AS company_logo",
        "postJobs.job_description AS job_description",
        "postJobs.job_valid_days AS job_valid_days",
        "postJobs.created_date AS created_date",
        "postJobs.gender as gender",
        "postJobs.age_group as age_group",
      ])
      .addSelect(
        "CASE WHEN user_favourite_jobs.job_id IS NOT NULL THEN true ELSE false END",
        "favourite"
      )
      .addSelect("ARRAY_AGG(DISTINCT category.category_name)", "categories")
      .where("postJobs.deactivated = :deactivated", { deactivated: 0 })
      .groupBy(
        "postJobs.id, user_favourite_jobs.job_id,company_profile.company_name,company_profile.company_logo"
      )
      .orderBy("postJobs.created_date", "DESC")
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    totalQuery.andWhere("postJobs.deactivated = :deactivated", {
      deactivated: 0,
    });
    if (state) {
      postJobsQuery.andWhere("postJobs.state = :state", { state });
      totalQuery.andWhere("postJobs.state = :state", { state });
    }
    if (job_keywords) {
      console.log(job_keywords);
      postJobsQuery.andWhere("postJobs.job_role ILIKE :job_keywords", {
        job_keywords: `%${job_keywords}%`,
      });
      totalQuery.andWhere("postJobs.job_role ILIKE :job_keywords", {
        job_keywords: `%${job_keywords}%`,
      });
    }
    if (categories) {
      postJobsQuery.andWhere("category.category_name = :categories", {
        categories,
      });
      totalQuery.andWhere("category.category_name = :categories", {
        categories,
      });
    }

    // if (parsedJobType.length > 0) {
    //   postJobsQuery.andWhere("postJobs.job_type IN (:...parsedJobType)", {
    //     parsedJobType,
    //   });
    //   totalQuery.andWhere("postJobs.job_type IN (:...parsedJobType)", {
    //     parsedJobType,
    //   });
    // }
    // if (parsedLevel.length > 0) {
    //   postJobsQuery.andWhere("postJobs.job_level IN (:...parsedLevel)", {
    //     parsedLevel,
    //   });
    //   totalQuery.andWhere("postJobs.job_level IN (:...parsedLevel)", {
    //     parsedLevel,
    //   });
    // }
    // if (parsedsalary.length === 2) {
    //   postJobsQuery.andWhere("postJobs.min_salary >= :minSalary", {
    //     minSalary: parsedsalary[0],
    //   });
    //   postJobsQuery.andWhere("postJobs.max_salary <= :maxSalary", {
    //     maxSalary: parsedsalary[1],
    //   });
    //   totalQuery.andWhere("postJobs.min_salary >= :minSalary", {
    //     minSalary: parsedsalary[0],
    //   });
    //   totalQuery.andWhere("postJobs.max_salary <= :maxSalary", {
    //     maxSalary: parsedsalary[1],
    //   });
    // }
    // if (parsedJoblocation1.length === 2) {
    //   postJobsQuery.andWhere("postJobs.city = :city", {
    //     city: parsedJoblocation1[0],
    //   });
    //   postJobsQuery.andWhere("postJobs.state = :state", {
    //     state: parsedJoblocation1[1],
    //   });
    //   totalQuery.andWhere("postJobs.city = :city", {
    //     city: parsedJoblocation1[0],
    //   });
    //   totalQuery.andWhere("postJobs.state = :state", {
    //     state: parsedJoblocation1[1],
    //   });
    // }
    if (job_keywords) {
      postJobsQuery.andWhere("postJobs.job_role ILIKE :job_keywords", {
        job_keywords: `%${job_keywords}%`,
      });
      totalQuery.andWhere("postJobs.job_role ILIKE :job_keywords", {
        job_keywords: `%${job_keywords}%`,
      });
    }
    // if (categories) {
    //   postJobsQuery.andWhere("category.category_name = :categories", {
    //     categories,
    //   });
    //   totalQuery.andWhere("category.category_name = :categories", {
    //     categories,
    //   });
    // }
    if (job_type) {
      postJobsQuery.andWhere("postJobs.job_type= :job_type", {
        job_type,
      });
      totalQuery.andWhere("postJobs.job_type= :job_type", {
        job_type,
      });
    }
    if (level) {
      postJobsQuery.andWhere("postJobs.job_level= :level", {
        level,
      });
      totalQuery.andWhere("postJobs.job_level= :level", {
        level,
      });
    }
    if (gender && gender != "Any") {
      postJobsQuery.andWhere("postJobs.gender= :gender", {
        gender,
      });
      totalQuery.andWhere("postJobs.gender= :gender", {
        gender,
      });
    }
    postJobsQuery.andWhere("postJobs.status = :status", { status: "Active" });
    totalQuery.andWhere("postJobs.status = :status", { status: "Active" });
    const postjobs = await postJobsQuery.getRawMany();

    const total = await totalQuery.getCount();

    if (postjobs.length === 0) {
      res.status(200).json({ status: false, message: "No job posts found" });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Job posts fetched successfully",
      data: postjobs,
      env: process.env.AWS_URL,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res
      .status(500)
      .json({ status: false, message: "Error fetching job posts", error });
  }
};
