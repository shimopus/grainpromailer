const agenda = require("../config/agenda");
const config = require("config");
const restClient = require("../config/restClient");
const Aigle = require('aigle');

agenda.define("email campaign start", (job, done) => {
    emailCampaignSendingJob(job.attrs.data)
        .then(() => done())
        .catch((err) => {
            console.dir(err);
            done(err);
        });
});

agenda.define("email send", (job, done) => {
    let emailConfig = job.attrs.data;

    sendEmailJob(emailConfig)
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

            uniqueStations.BUY.map((stationCode) => {
                uniqueTableFunctions.BUY[stationCode] = getTableForStationFunction(stationCode, "BUY");
            });

            uniqueStations.SELL.map((stationCode) => {
                uniqueTableFunctions.SELL[stationCode] = getTableForStationFunction(stationCode, "SELL");
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

                subscriptionConfig.table = uniqueTables[subscriptionType][stationCode].data.toString("utf8");
            });

            return subscriptionConfigs;
        })

        //далее создать джобы на отсылку
        .then((subscriptionConfigs) => {
            subscriptionConfigs.forEach((subscriptionConfig) => {
                agenda.now("email send", subscriptionConfig);
            });
        });
}

function sendEmailJob(emailConfig) {
    console.log("Sending mail");

    return new Promise((resolve, reject) => {
        console.dir(emailConfig);
        resolve();
    });
}

function getTableForStationFunction(stationCode, subscriptionType) {
    return restClient.getPromise(config.get("grainproadmin.url")
        + "/pages/market-table/download?code=" + stationCode +
        "&bidType=" + subscriptionType);
}

module.exports = {
    createJob: createNewEmailCampaignJob
};