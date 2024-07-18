import nodemailer from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID = process.env.GCP_CLIENT_ID;
const CLIENT_SECRET = process.env.GCP_CLIENT_SECRET;
const REDIRECT_URI = process.env.GCP_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GCP_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(receiverMail: string) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            // @ts-ignore
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: "bratamalya2@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        let otp: string = "";
        for (let i = 0; i < 8; i++)
            otp = `${otp}${Math.floor(Math.random() * 10)}`;
        const mailOptions = {
            from: "Ecommerce app <bratamalya2@gmail.com>",
            to: receiverMail,
            subject: "OTP for email verification",
            text: `Your OTP is ${otp}`,
        }
        await transport.sendMail(mailOptions);

        return {
            isError: false,
            otp
        };
    }
    catch (err) {
        console.log(err);
        return {
            isError: true,
            otp: "null"
        }
    }
}

export default sendMail;