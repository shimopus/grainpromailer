const agenda = require("../config/agenda");
const config = require("config");
const restClient = require("../config/restClient");
const Aigle = require('aigle');
const sendEmailService = require("../services/SendEmailService");
const emailCampaignDataStorageServcie = require("../services/EmailCampaignDataStorageService");

const PARALLEL_DOWNLOADS = config.get("email_job.parallelFilesDownload");

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

    sendEmailService.sendEmailCampaign(emailConfig, emailCampaign)
        .then(() => done())
        .catch((err) => {
            console.dir(err);
            done(err);
        });
});

agenda.define("clear job data", (job, done) => {
    const emailCampaign = job.attrs.data;

    emailCampaignDataStorageServcie.clearCampaignData(emailCampaign)
        .then(() => {
            done();
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
    //TODO: prod version
    return restClient.getPromise(config.get("grainproadmin.url") + "/api/subscription-configs/getactive")

    //TODO: test version
    /*return new Promise(function(resolve, reject) {
        resolve({
            data: [{
                "id": 261954,
                "subscriptionType": "BUY",
                "isActive": true,
                "creationDate": "2018-01-27T20:55:50.122Z",
                "lastUpdateDate": "2018-01-27T20:55:50.122Z",
                "contactId": 261951,
                "contactPersonName": "Сергей",
                "contactEmail": "sergey@babinskiy.ru",
                "stationId": 9022,
                "stationCode": "657108",
                "stationName": "Давлеканово (Кбш)",
                "partnerId": 261950,
                "partnerName": "Тест Сергей"
            },{
                "id": 261955,
                "subscriptionType": "BUY",
                "isActive": true,
                "creationDate": "2018-01-27T20:55:50.122Z",
                "lastUpdateDate": "2018-01-27T20:55:50.122Z",
                "contactId": 261951,
                "contactPersonName": "Алексей",
                "contactEmail": "alexpitsyk@gmail.com",
                "stationId": 9022,
                "stationCode": "657108",
                "stationName": "Давлеканово (Кбш)",
                "partnerId": 261950,
                "partnerName": "Тест Сергей"
            },{
                "id": 261957,
                "subscriptionType": "BUY",
                "isActive": true,
                "creationDate": "2018-01-27T20:55:50.122Z",
                "lastUpdateDate": "2018-01-27T20:55:50.122Z",
                "contactId": 261951,
                "contactPersonName": "Павел",
                "contactEmail": "tarkhanov.pv@gmail.com",
                "stationId": 9022,
                "stationCode": "657108",
                "stationName": "Давлеканово (Кбш)",
                "partnerId": 261950,
                "partnerName": "Тест Сергей"
            },{
                "id": 261956,
                "subscriptionType": "BUY",
                "isActive": true,
                "creationDate": "2018-01-27T20:55:50.122Z",
                "lastUpdateDate": "2018-01-27T20:55:50.122Z",
                "contactId": 261951,
                "contactPersonName": "Алексей",
                "contactEmail": "alexey.pitsyk@netcracker.com ",
                "stationId": 9022,
                "stationCode": "657108",
                "stationName": "Давлеканово (Кбш)",
                "partnerId": 261950,
                "partnerName": "Тест Сергей"
            }]
        });
    })*/

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

            return Aigle.resolve(uniqueStations.BUY).mapLimit(PARALLEL_DOWNLOADS, (stationCode) =>
                Aigle.resolve({
                    attachment: getTableForStationFunction(stationCode, "BUY"),
                    email: getEmailForStationFunction(stationCode, "BUY")
                })
                    .parallel()
                    .then((tables) => uniqueTableFunctions.BUY[stationCode] = tables)
            )
                .then(() => Aigle.resolve(uniqueStations.SELL).mapLimit(PARALLEL_DOWNLOADS, (stationCode) =>
                    Aigle.resolve({
                        attachment: getTableForStationFunction(stationCode, "SELL"),
                        email: getEmailForStationFunction(stationCode, "SELL")
                    })
                        .parallel()
                        .then((tables) => uniqueTableFunctions.SELL[stationCode] = tables)
                ))
                .then(() => uniqueTableFunctions);
        })

        //далее, сложить конфиг получателя и его таблицу в список джоб на отсылку писем.
        .then((uniqueTables) => {
            console.log("3. Store email parameters");
            console.dir(uniqueTables);

            let subscriptionConfigsPromises = [];

            subscriptionConfigs.forEach((subscriptionConfig) => {
                let subscriptionType = subscriptionConfig.subscriptionType;
                let stationCode = subscriptionConfig.stationCode;

                subscriptionConfigsPromises.push(
                    emailCampaignDataStorageServcie.storeCampaignData(emailCampaign, subscriptionConfig, {
                        attachment: uniqueTables[subscriptionType][stationCode].attachment.data,
                        email: uniqueTables[subscriptionType][stationCode].email.data
                    }).then(() => {
                        return subscriptionConfig;
                    })
                );
            });

            return Aigle.resolve(subscriptionConfigsPromises).parallel();
        })

        //далее создать джобы на отсылку
        .then((subscriptionConfigs) => {
            subscriptionConfigs.forEach((subscriptionConfig) => {
                agenda.now("email send", {
                    emailConfig: subscriptionConfig,
                    emailCampaign: emailCampaign
                });
            });

            //запланировать очищение БД через семь дней
            agenda.schedule("in 7 days", "clear job data", emailCampaign);
        }) ;
}

function getTableForStationFunction(stationCode, subscriptionType) {
    return restClient.getPromise(config.get("grainproadmin.url")
        + "/pages/market-table/download?code=" + stationCode +
        "&bidType=" + subscriptionType);
}

function getEmailForStationFunction(stationCode, subscriptionType) {
    return restClient.getPromise(config.get("grainproadmin.url")
        + "/pages/market-table/email-inside?code=" + stationCode +
        "&bidType=" + subscriptionType +
        "&rowsLimit=" + config.get("email_job.emailTableRowsLimit"))

}

module.exports = {
    createJob: createNewEmailCampaignJob
};
