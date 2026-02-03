import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
    const resetLink = `https://yourapp.com/reset-password?token=${token}`; 

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    const mailOptions = {
        from: '"Your App" <no-reply@yourapp.com>', 
        to: email, 
        subject: 'Password Reset',  
        text: `Please click the following link to reset your password: ${resetLink}`, 
        html: `<p>Please click the following link to reset your password:</p><a href="${resetLink}">Reset Password</a>`
    };

    await transporter.sendMail(mailOptions);
};
