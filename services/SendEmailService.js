const nodemailerMailgun = require("../config/nodemailerMailgun");
const moment = require("moment");
const config = require("config");
const emailCampaignDataStorageService = require("../services/EmailCampaignDataStorageService");
const emailTemplate = require("./emailTemplate");

function sendEmailCampaign(emailConfig, emailCampaign) {
    console.log("Sending mail");

    return emailCampaignDataStorageService.getCampaignData(emailCampaign, emailConfig)
        .then((emailJobData) => {
            return new Promise((resolve, reject) => {
                console.dir(emailConfig);
                console.dir(emailJobData);

                let momentPlannedDate = moment(emailCampaign.plannedDate);

                nodemailerMailgun.sendMail({
                    from: {name: config.get("mailgun.from_name"), address: config.get("mailgun.from_email")},
                    to: emailConfig.contactEmail,
                    subject: config.get("mailgun.subject") + " " + momentPlannedDate.format("DD.MM.YYYY"),
                    'h:Reply-To': config.get("mailgun.from_email"),
                    'o:tag' : ['email campaign', 'email campaign ' + momentPlannedDate.format("DD.MM.YYYY")],
                    html: emailTemplate.getHTML(emailJobData.email.toString('utf8'), emailConfig.stationName,
                        emailConfig.partnerId, momentPlannedDate.format("DD.MM.YYYY"), emailConfig.subscriptionType),
                    attachments: [{
                        filename: generateFileName(momentPlannedDate,
                            emailConfig.subscriptionType, emailConfig.stationName, emailConfig.stationCode),
                        content: addTrackingImage(emailJobData.attachment.toString('utf8'),
                            emailConfig.partnerId, momentPlannedDate, "FILE_OPEN"),
                    }]
                }, function (err, info) {
                    if (err) {
                        console.log('Error: ' + err);
                        reject(err);
                    }
                    else {
                        console.log('Response: ');
                        console.dir(info);
                        resolve();
                    }
                });
            });
        });
}


function addTrackingImage(content, partnerId, momentPlannedDate, type) {
    content = "<div><img width=\"1px\" height=\"1px\" src=\"" +
        config.get("grainproadmin.url") +
        "/tracking/image/" +
        partnerId + "" +
        "/1x1.gif?date=" +
        momentPlannedDate.format("DD-MM-YYYY") +
        "&type=" +
        type +
        "\"/></div>" +
        content;

    return content;
}

function generateFileName(momentPlannedDate, bidType, stationName, stationCode) {
    return momentPlannedDate.format("YYYYMMDD")
        + " пшеница "
        + (bidType === 'SELL' ? "продавцы" : "покупатели")
        + (stationName ? (" " + stationName) : "")
        + (stationCode ? ("(" + stationCode + ")") : "")
        + ".html"
}

module.exports = {
  sendEmailCampaign: sendEmailCampaign
};