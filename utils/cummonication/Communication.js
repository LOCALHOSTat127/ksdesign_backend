"use strict";
import nodemailer from "nodemailer";
import * as dotenv from 'dotenv'
import validator from "validator";
import fs from "fs";

dotenv.config();

export default class Communication_Provider {
    static EmailTransporter = nodemailer.createTransport({
        host: process.env.SERVER_SMTP_RELAY_HOST,
        port: process.env.SERVER_SMTP_RELAY_PORT,
        secure: false,
        auth: {
            user: process.env.SERVER_SMTP_SERVICE_EMAIL,
            pass: process.env.SERVER_SMTP_RELAY_MASTER_PWD,
        },
    });


    // validate-email
    static verifyEmail = (emailID) => {
        if (validator.isEmail(emailID) === true) {
            return true;
        } else {
            return false;
        }
    }


    // create-email
    static createEmailMSG = (emailID,TEMPLETE_CONFIG) => {
        // let htmlstream = fs.createReadStream("./email_templates/demo.html");

        return {
            from: process.env.SERVER_SMTP_SERVICE_EMAIL,    
            to: emailID,
            subject: TEMPLETE_CONFIG.subject,
            text: TEMPLETE_CONFIG.txt,
            
        }
    }


    // send-email
    static sendEmail = async (EMAIL_MSG) => {
        let EMAIL_INFO = await this.EmailTransporter.sendMail(EMAIL_MSG);
        if (EMAIL_INFO.rejected.length == 0) {
            return {
                status_code: 200,
                status_msg: "Email Sent",
                msg_id: EMAIL_INFO.messageId,
                from_id: EMAIL_INFO.envelope.from,
                to_id: EMAIL_INFO.envelope.to,
            }
        } else {
            return {
                status_code: 903,
                status_msg: "Error White sending Email"
            }
        }
    }


    // is-phone-valid
    static isValidPhone = (phoneNumber) => {
        if (phoneNumber.length > 10 || phoneNumber.length < 10) {
            return false;
        }

        for (let i = 0; i < phoneNumber.length; i++) {
            if (validator.isNumeric(phoneNumber[i]) == false) {
                return false;
            }
        }
        return true;
    }


}