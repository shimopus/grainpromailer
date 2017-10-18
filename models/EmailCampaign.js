const mongoose = require('mongoose');

const emailCampaignSchema = new mongoose.Schema({
    externalId: String,
    name: String,
    plannedDate: Date,
}, { timestamps: true });

const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);

module.exports = EmailCampaign;