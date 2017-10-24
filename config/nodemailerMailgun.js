const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const config = require("config");

const auth = {
    auth: {
        api_key: config.get("mailgun.api_key"),
        domain: config.get("mailgun.domain")
    }
};

module.exports = nodemailer.createTransport(mg(auth));