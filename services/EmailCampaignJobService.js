const agenda = require("../config/agenda");
const moment = require("moment");
const config = require("config");
const restClient = require("../config/restClient");
const Aigle = require('aigle');

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

agenda.define("email campaign start", (job, done) => {
    emailCampaignSendingJob(job.attrs.data)
        .then(() => done())
        .catch((err) => {
            console.dir(err);
            done(err);
        });
});

agenda.define("email send", (job, done) => {
    let emailConfig = job.attrs.data.emailConfig;
    let emailCampaign = job.attrs.data.emailCampaign;

    sendEmailJob(emailConfig, emailCampaign)
        .then(() => done())
        .catch((err) => {
            console.dir(err);
            done(err);
        });
});

function createNewEmailCampaignJob(emailCampaign) {
    agenda.schedule(emailCampaign.plannedDate, "email campaign start", emailCampaign);
}

function emailCampaignSendingJob(emailCampaign) {
    console.log("I am a job which will send this campaign");
    console.dir(emailCampaign);

    let subscriptionConfigs;

    //должна брать список всех, кому отправлять и что отправлять,
    console.log("try to connect: " + config.get("grainproadmin.url") + "/api/subscription-configs/getactive");
    return restClient.getPromise(config.get("grainproadmin.url") + "/api/subscription-configs/getactive")

    //далее, подобрать уникальный набор станций
        .then((retObj) => {
            console.log("1. Result of active subscriptions");
            if (!Array.isArray(retObj.data)) {
                console.log("1. Error");
                console.dir(retObj);
                throw new Error("Couldn't get a set of active subscriptions");
            }

            subscriptionConfigs = retObj.data;

            console.log("1. Try to get unique stations");
            let uniqueStations = subscriptionConfigs.reduce((uniqueStations, subscriptionConfig) => {
                let currentStation = subscriptionConfig.stationCode;
                let subscriptionType = subscriptionConfig.subscriptionType;

                if (uniqueStations[subscriptionType].indexOf(currentStation) < 0) {
                    uniqueStations[subscriptionType].push(currentStation);
                }

                return uniqueStations;
            }, {
                BUY: [],
                SELL: []
            });

            console.dir(uniqueStations);

            return uniqueStations;
        })

        //далее, по каждой станции сгенерить табличку
        .then((uniqueStations) => {
            console.log("2. Try to get Unique functions");
            let uniqueTableFunctions = {
                BUY: {},
                SELL: {}
            };

            uniqueStations.BUY.map((stationCode) =>
                uniqueTableFunctions.BUY[stationCode] = Aigle.resolve({
                    attachment: getTableForStationFunction(stationCode, "BUY"),
                    email: getEmailForStationFunction(stationCode, "BUY")
                }).parallel()
            );

            uniqueStations.SELL.map((stationCode) => {
                uniqueTableFunctions.SELL[stationCode] = Aigle.resolve({
                    attachment: getTableForStationFunction(stationCode, "SELL"),
                    email: getEmailForStationFunction(stationCode, "SELL")
                }).parallel()
            });

            console.log("2. Unique functions");
            console.dir(uniqueTableFunctions);

            return Aigle.resolve({
                BUY: Aigle.resolve(uniqueTableFunctions.BUY).parallel(),
                SELL: Aigle.resolve(uniqueTableFunctions.SELL).parallel(),
            })
                .parallel();
        })

        //далее, сложить конфиг получателя и его таблицу в список джоб на отсылку писем.
        .then((uniqueTables) => {
            console.log("3. Store email parameters");

            subscriptionConfigs.forEach((subscriptionConfig) => {
                let subscriptionType = subscriptionConfig.subscriptionType;
                let stationCode = subscriptionConfig.stationCode;

                subscriptionConfig.attachment = uniqueTables[subscriptionType][stationCode].attachment.data;
                subscriptionConfig.email = uniqueTables[subscriptionType][stationCode].email.data;
            });

            return subscriptionConfigs;
        })

        //далее создать джобы на отсылку
        .then((subscriptionConfigs) => {
            subscriptionConfigs.forEach((subscriptionConfig) => {
                agenda.now("email send", {
                    emailConfig: subscriptionConfig,
                    emailCampaign: emailCampaign
                });
            });
        });
}

function sendEmailJob(emailConfig, emailCampaign) {
    console.log("Sending mail");

    const auth = {
        auth: {
            api_key: config.get("mailgun.api_key"),
            domain: config.get("mailgun.domain")
        }
    };

    let nodemailerMailgun = nodemailer.createTransport(mg(auth));
    return new Promise((resolve, reject) => {
        console.dir(emailConfig);
        nodemailerMailgun.sendMail({
            from: {name: config.get("mailgun.from_name"), address: config.get("mailgun.from_email")},
            to: emailConfig.contactEmail,
            subject: config.get("mailgun.subject") + " " + moment(emailCampaign.plannedDate).format("DD.MM.YYYY"),
            'h:Reply-To': config.get("mailgun.from_email"),
            'o:tag' : ['email campaign', 'email campaign ' + moment(emailCampaign.plannedDate).format("DD.MM.YYYY")],
            html: addTrackingImage(emailConfig.email.buffer.toString('utf8'),
                emailConfig.partnerId, emailCampaign.plannedDate, "OPEN"),
            attachments: [{
                filename: generateFileName(emailCampaign.plannedDate, emailConfig.stationName, emailConfig.stationCode),
                content: addTrackingImage(emailConfig.attachment.buffer.toString('utf8'),
                    emailConfig.partnerId, emailCampaign.plannedDate, "FILE_OPEN"),
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
}

function getTableForStationFunction(stationCode, subscriptionType) {
    return restClient.getPromise(config.get("grainproadmin.url")
        + "/pages/market-table/download?code=" + stationCode +
        "&bidType=" + subscriptionType);
}

function getEmailForStationFunction(stationCode, subscriptionType) {
    return restClient.getPromise(config.get("grainproadmin.url")
        + "/pages/market-table/email-inside?code=" + stationCode +
        "&bidType=" + subscriptionType);
}

function addTrackingImage(content, partnerId, date, type) {
    content = "<div><img width=\"1px\" height=\"1px\" src=\"" +
        config.get("grainproadmin.url") +
        "/tracking/image/" +
        partnerId + "" +
        "/1x1.gif?date=" +
        moment(date).format("DD-MM-YYYY") +
        "&type=" +
        type +
        "\"/></div>" +
        content;

    return content;
}

function generateFileName(plannedDate, bidType, stationName, stationCode) {
    return moment(plannedDate).format("YYYYMMDD") +
        " пшеница" +
        (bidType === 'SELL' ? " продавцы" : " покупатели") + " " +
        (stationName ? stationName : "") +
        (stationCode ? ("(" + stationCode + ")") : "") +
        ".html"
}

module.exports = {
    createJob: createNewEmailCampaignJob
};
