const agenda = require("../config/agenda");

agenda.define("email campaign start", (job, done) => {
    emailCampaignSendingJob(job.attrs.data);
    done();
});

function createNewEmailCampaignJob(emailCampaign) {
    agenda.schedule(emailCampaign.plannedDate, "email campaign start", emailCampaign);
}

function emailCampaignSendingJob(emailCampaign) {
    console.log("I am a job which will send this campaign");
    console.dir(emailCampaign);

    //должна брать список всех, кому отправлять и что отправлять,
    //далее, подобрать уникальный набор станций
    //далее, по каждой станции сгенерить табличку
    //далее, сложить конфиг получателя и его таблицу в список джоб на отсылку писем.
}

module.exports = {
    createJob: createNewEmailCampaignJob
};