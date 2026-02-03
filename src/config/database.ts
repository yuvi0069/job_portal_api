import { DataSource } from "typeorm";
import { Users } from "../entities/user";
import { Companys } from "../entities/company";
import { ClientUsers } from "../entities/clientUsers";
import { CompanyProfiles } from "../entities/companyProfiles";
import { UserDetails } from "../entities/userDetails";
import { Postjobs } from "../entities/postjobs";
import { JobApplication } from "../entities/jobApplication";
import { Adminuser } from "../entities/admin";
import { UsersNotification } from "../entities/userNotification";
import { CompanyNotification } from "../entities/companyNotification";
import { FavouriteJob } from "../entities/favouritejob";
import { CompanySavedCandidates } from "../entities/companySavedCandidates";
import { CompanyPlanTypes } from "../entities/companyPlanTypes";
import { CompanySucessTrans } from "../entities/companySucessTrans";
import { CompanyFailedTrans } from "../entities/companyFailTrans";
import { CompanyPlan } from "../entities/companyPlans";
import { PostJobBenefit } from "../entities/postJobBenefits";
import { PostJobCategory } from "../entities/postJobCategory";
import { PostJobLanguage } from "../entities/postJobLanguages";
import { PostJobSkill } from "../entities/postJobSkills";
import { UserExperience } from "../entities/userExperience";
import { UserEducation } from "../entities/userEducation";
import { UserSkills } from "../entities/userSkills";
import { UserSocialMedia } from "../entities/userSocialLink";
import { CompanySocialMedia } from "../entities/companySocialLinks";
import { SkillMaster } from "../entities/skillMaster";
import { SkillCategory } from "../entities/skillCategory";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "ls-7ef5ef3e5e4746b34bac294a150cc6d98fcfa678.cb09gwzlecxa.ap-southeast-1.rds.amazonaws.com",
  port: 5432,
  username: "dbmasteruser",
  password: "3p%OBJ9*BMx1Q&u]UoH|}<18>Hqo?Vze",
  database: "career_app_test",
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [
    Users,
    Companys,
    ClientUsers,
    CompanyProfiles,
    UserDetails,
    Postjobs,
    JobApplication,
    Adminuser,
    UsersNotification,
    CompanyNotification,
    FavouriteJob,
    CompanySavedCandidates,
    CompanyPlanTypes,
    CompanySucessTrans,
    CompanyFailedTrans,
    CompanyPlan,
    PostJobBenefit,
    PostJobCategory,
    PostJobLanguage,
    PostJobSkill,
    UserExperience,
    UserEducation,
    UserSkills,
    UserSocialMedia,
    CompanySocialMedia,
    SkillMaster,
    SkillCategory,
  ],
});
