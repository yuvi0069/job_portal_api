import { validate } from "class-validator";
import { ClientUsers } from "../entities/clientUsers";
import { CompanyProfiles } from "../entities/companyProfiles";
import { uploadImageToS3 } from "./uploadimages";
import { Readable } from "stream";
import { Users } from "../entities/user";
import { UserDetails } from "../entities/userDetails";
import { firstTimeCompanySendResetPasswordEmail } from "../email";

export const addCompany = async (
  files: any,
  profile: any,
  companyRepository: any,
  companyProfileRepository: any
) => {
  try {
    const company_logo = files?.["profile[company_logo]"]?.[0] || null;
    const company_banner = files?.["profile[company_banner]"]?.[0] || null;

    const new_company = new ClientUsers();
    new_company.full_name = profile.fullName;

    new_company.email = profile.email;
    new_company.mobile_number = profile.mobileNumber;
    new_company.country_code = profile.countrycode;
    new_company.purchase_plan_status = "ACTIVE";
    new_company.purchase_plan_remaining_days = 15;
    const now = new Date();
    new_company.purchased_plan_expiry = new Date(
      now.getTime() + 15 * 24 * 60 * 60 * 1000
    );
    new_company.plan_uuid = "74bb896a-aa84-47f5-be85-b6956b9df57b";
    const errors = await validate(new_company);
    // if (errors.length > 0) {
    //     throw new Error("Validation failed");
    // }

    const new_company_info = await companyRepository.save(new_company);
    let companyProfile = new CompanyProfiles();
    let company_founded;

    if (!/^\d{4}$/.test(profile.company_founded_year)) {
      company_founded = null;
    } else {
      company_founded = profile.company_founded_year;
    }

    let company_logo_url: any;
    let company_banner_url: any;
    let name = new_company_info.user_uuid;
    let name1 = new_company_info.user_uuid;
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
    await firstTimeCompanySendResetPasswordEmail(
      new_company.email,
      new_company.full_name
    );
    companyProfile.client_user_uuid = new_company_info.user_uuid;
    companyProfile.company_name = profile.company_name;
    companyProfile.company_logo = company_logo_url;
    companyProfile.company_size = profile.company_size;
    companyProfile.company_industry = profile.company_industry;
    companyProfile.company_website = profile.company_website;
    companyProfile.company_location = profile.company_location;
    companyProfile.company_founded_year = company_founded;
    companyProfile.company_contact = profile.company_contact;
    companyProfile.company_description = profile.company_description;
    companyProfile.company_banner = company_banner_url;
    // companyProfile.company_social_media_links = profile.social_links;
    companyProfile.company_vision = profile.company_vision;
    companyProfile.profile_completion = 0;

    await companyProfileRepository.save(companyProfile);

    // Profile completion calculation
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
    }
    // if (companyProfile.company_social_media_links.length > 0 && companyProfile.profile_completion != 10 && companyProfile.profile_completion != 65 && companyProfile.profile_completion != 45 && companyProfile.profile_completion <= 90) {
    //     companyProfile.profile_completion = companyProfile.profile_completion !== 0 ? companyProfile.profile_completion + 10 : 10;
    // }

    await companyProfileRepository.save(companyProfile);

    return {
      statusCode: 200,
      status: true,
      message: "Company added successfully",
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        statusCode: 500,
        status: false,
        message: "Already an email or mobile exist",
      };
    }
    console.log(error);
    return { status: false, message: "Error adding company", err: error };
  }
};
export const addJobSeeker = async (profile: any, userRepository: any) => {
  try {
    const new_user = new Users();

    new_user.fullName = profile.fullName;
    new_user.email = profile.email;
    new_user.mobile_number = profile.mobileNumber;
    new_user.city = profile.city;
    new_user.state = profile.state;
    new_user.country_code = profile.countrycode;
    const new_user_info = await userRepository.save(new_user);
    let userProfile = new UserDetails();
    userProfile.user_uuid = new_user_info.uuid;
    userProfile.gender = profile.gender;
    userProfile.user_role = profile.job_role;

    // if (errors.length > 0) {
    //     throw new Error("Validation failed");
    // }

    return {
      statusCode: 200,
      status: true,
      message: "User added successfully",
    };
  } catch (error: any) {
    console.log(error);
    if (error.code === "23505") {
      return {
        statusCode: 500,
        status: false,
        message: "Already an email or mobile exist",
      };
    }

    return { status: false, message: "Error adding user", err: error };
  }
};
