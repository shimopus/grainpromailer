const EmailCampaignJobData = require("../models/EmailCampaignJobData");

function storeCampaignData(emailCampaign, emailConfig, data) {
    let emailCampaignJobData = new EmailCampaignJobData({
        campaignExternalId: emailCampaign.externalId,
        emailConfigId: emailConfig.id,
        attachment: data.attachment,
        email: data.email
    });

    return emailCampaignJobData.save();
}

function getCampaignData(emailCampaign, emailConfig) {
    return EmailCampaignJobData.findOne({
        campaignExternalId: emailCampaign.externalId,
        emailConfigId: emailConfig.id
    }).exec()
        .then((emailCampaignJobData) => {

            return {
                attachment: emailCampaignJobData.attachment,
                email: emailCampaignJobData.email
            }
        });
}

function clearCampaignData(emailCampaign) {
    return EmailCampaignJobData.deleteMany({
        campaignExternalId: emailCampaign.externalId
    }).catch((err) => {
        throw new Error(err);
    })
}

module.exports = {
    storeCampaignData: storeCampaignData,
    getCampaignData: getCampaignData,
    clearCampaignData: clearCampaignData
};