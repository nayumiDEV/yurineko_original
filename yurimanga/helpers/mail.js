const mailer = require('nodemailer');
const env = require('../configs/env');
const fs = require('fs');
const { resolve } = require('path');
const { InternalServerError } = require('./response');

/**
 * 
 * @param {Object} options
 */
const mailTo = (options, next) => {
    try {
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: env.EMAIL_SERVICE,
                pass: env.EMAIL_SERVICE_PASSWORD,
                clientId: env.EMAIL_SERVICE_CLIENT_ID,
                clientSecret: env.EMAIL_SERVICE_CLIENT_SECRET,
                refreshToken: env.EMAIL_SERVICE_REFRESH_TOKEN
            }
        });

        let mailContent = fs.readFileSync(resolve('./views/email-template.html'));
        mailContent = mailContent.toString().replace("%title", options.title);
        mailContent = mailContent.toString().replace("%name", options.name);
        mailContent = mailContent.toString().replace("%content", options.content);
        mailContent = mailContent.toString().replace("%link", options.link);
        mailContent = mailContent.toString().replace("%button", options.button);

        transporter.sendMail({
            from: {
                address: "noreply@yurineko.moe",
                name: "Yurineko"
            },
            to: options.target,
            subject: "Yurineko: " + options.subject,
            html: mailContent
        }, err => {
            next(new Error("Mail server error!"));
        });
    } catch (error) {
        throw error;
    }
}

module.exports = mailTo;