import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export interface ContactFormState {
  message: string;
  error: boolean;
  success: boolean;
  fieldValues: {
    sender_name: string;
    sender_email: string;
    sender_message: string;
  };
}
export async function otpSendEmail(
  emailTo: string | undefined,
  name: string,
  otpCode: number
) {
  const apiKey = process.env.BREVO_API_KEY;
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: emailTo }],
      subject: "Tresstalent otp",
      htmlContent: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
 
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body 
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif !important;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://job-portal-tresstalent.s3.eu-west-2.amazonaws.com/Group+10.png"
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px;"
                  >${currentDate} ${currentTime} </span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>
 
      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 42px 25px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              OTP To Access Account
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Thank you for choosing Tress Talent. Use the following OTP to access the portal.
              Do not share this code with others, including Tress Talent employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 15px;
                color: #F15625;
              "
            >
              ${otpCode}
            </p>
          </div>
        </div>
 
        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:tresstalent@example.com"
            style="color: #499fb6; text-decoration: none;"
            >tresstalent@example.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>
 
      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
        Tress Talent Company
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 540, City, State.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2025 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
 `,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
  if (response.data.messageId) {
    return {
      success: true,
      message: "Email send successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email send Error",
    };
  }
}
export async function otpSendResetPasswordEmail(
  emailTo: string | undefined,
  name: string,
  otpCode: number
) {
  const apiKey = process.env.BREVO_API_KEY;
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: emailTo }],
      subject: "Tresstalent otp",
      htmlContent: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
 
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body 
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif !important;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://job-portal-tresstalent.s3.eu-west-2.amazonaws.com/Group+10.png"
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px;"
                  >${currentDate} ${currentTime} </span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>
 
      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 42px 25px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
            OTP To Change Password
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Thank you for choosing Tress Talent. Use the following OTP to reset your password.
              Do not share this code with others, including Tress Talent employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 15px;
                color: #F15625;
              "
            >
              ${otpCode}
            </p>
          </div>
        </div>
 
        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:tresstalent@example.com"
            style="color: #499fb6; text-decoration: none;"
            >tresstalent@example.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>
 
      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
        Tress Talent Company
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 540, City, State.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2025 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>`,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
  if (response.data.messageId) {
    return {
      success: true,
      message: "Email send successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email send Error",
    };
  }
}
export async function sendEnquiryEmail(
  emailTo: string | undefined,
  subject: string,
  name: string,
  mesaage: string
) {
  const apiKey = process.env.BREVO_API_KEY;
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: "yuvraj.sy@intacting.in" }],
      subject: subject,
      htmlContent: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
 
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body 
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif !important;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://job-portal-tresstalent.s3.eu-west-2.amazonaws.com/Group+10.png"
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px;"
                  >${currentDate} ${currentTime} </span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>
 
      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 42px 25px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
            Enquiry from ${name}
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Hey Tresstalent,
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Below is the enquiry send by <span style="font-weight:bold;">${name}</span> with email <a href="mailto:${emailTo}">${emailTo}</a>.Please got through it and help them to resolve their doubts.
              
              </p>
            <p
              style="
                margin: 0;
                margin-top: 20px;
                font-size: 20px;
                font-weight: 300;
                color: #F15625;
              "
            >
              ${mesaage}
            </p>
          </div>
        </div>
 
        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:tresstalent@example.com"
            style="color: #499fb6; text-decoration: none;"
            >tresstalent@example.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>
 
      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
        Tress Talent Company
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 540, City, State.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2025 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>`,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
  if (response.data.messageId) {
    return {
      success: true,
      message: "Email send successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email send Error",
    };
  }
}
export async function adminSendResetPasswordEmail(
  emailTo: string | undefined,
  name: string
) {
  const apiKey = process.env.BREVO_API_KEY;
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: emailTo }],
      subject: "Tresstalent Admin Acccount Setup",
      htmlContent: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
 
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body 
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif !important;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://job-portal-tresstalent.s3.eu-west-2.amazonaws.com/Group+10.png"
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px;"
                  >${currentDate} ${currentTime} </span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>
 
      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 42px 25px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
            Admin Account Password Setup
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Welcome to Tress Talent. Use the following link to reset your password and activate your account.
              Do not share this code with others, including Tress Talent employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 15px;
                color: #F15625;
              "
            >
              <a href='https://development.d3jv61a9t5enk7.amplifyapp.com/admin/resetPassword'>
              LINK
              </a>
              
            </p>
          </div>
        </div>
 
        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:tresstalent@example.com"
            style="color: #499fb6; text-decoration: none;"
            >tresstalent@example.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>
 
      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
        Tress Talent Company
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 540, City, State.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2025 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>`,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
  if (response.data.messageId) {
    return {
      success: true,
      message: "Email send successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email send Error",
    };
  }
}
export async function firstTimeCompanySendResetPasswordEmail(
  emailTo: string | undefined,
  name: string
) {
  const apiKey = process.env.BREVO_API_KEY;
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: emailTo }],
      subject: "Tresstalent Company Acccount Setup",
      htmlContent: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
 
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body 
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif !important;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://job-portal-tresstalent.s3.eu-west-2.amazonaws.com/Group+10.png"
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px;"
                  >${currentDate} ${currentTime} </span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>
 
      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 42px 25px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
            Company Account Password Setup
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Welcome to Tress Talent. Use the following link to reset your password and activate this account.
             
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 15px;
                color: #F15625;
              "
            >
              <a href='https://tresstalent.com/resetPassword'>
              LINK
              </a>
              
            </p>
          </div>
        </div>
 
        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:tresstalent@example.com"
            style="color: #499fb6; text-decoration: none;"
            >tresstalent@example.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>
 
      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
        Tress Talent Company
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 540, City, State.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2025 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>`,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
  if (response.data.messageId) {
    return {
      success: true,
      message: "Email send successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email send Error",
    };
  }
}
export async function sendEmailForVerification(
  emailTo: string | undefined,
  name: string | undefined,
  token: string
) {
  const apiKey = process.env.BREVO_API_KEY;
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: emailTo }],
      subject: "Email verification",
      htmlContent: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
 
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body 
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif !important;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://job-portal-tresstalent.s3.eu-west-2.amazonaws.com/Group+10.png"
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px;"
                  >${currentDate} ${currentTime} </span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>
 
      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 42px 25px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
             EMAIL Verification.
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Thank you for choosing Tress Talent. Click on the following link to verify your email.
              Do not share this link with others, including Tress Talent employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 15px;
                color: #F15625;
              "
            >
              <a href="https://www.tresstalent.com/Verified-Email/${token}" style="color: #499fb6; text-decoration: none;"
            >LINK</a>
            </p>
          </div>
        </div>
 
        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:tresstalent@example.com"
            style="color: #499fb6; text-decoration: none;"
            >tresstalent@example.com</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>
 
      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
        Tress Talent Company
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address 540, City, State.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2025 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
 `,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
  if (response.data.messageId) {
    return {
      success: true,
      message: "Email send successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email send Error",
    };
  }
}
