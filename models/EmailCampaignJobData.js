const mongoose = require('mongoose');

const emailCampaignJobDataSchema = new mongoose.Schema({
    campaignExternalId: String,
    emailConfigId: String,
    attachment: Buffer,
    email: Buffer
}, { timestamps: false });

const EmailCampaignJobData = mongoose.model('EmailCampaignJobData', emailCampaignJobDataSchema);

module.exports = EmailCampaignJobData;