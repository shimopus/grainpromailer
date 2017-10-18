const EmailCampaign = require('../models/EmailCampaign');
const emailCampaignService = require('../services/EmailCampaignJobService');

/**
 * POST /emailCampaign/create
 */
exports.postCreateEmailCampaign = (req, res, next) => {
    const emailCampaign = new EmailCampaign({
        externalId: req.body.id,
        name: req.body.name,
        plannedDate: req.body.date
    });

    emailCampaign.save((err) => {
        if (err) {
            return next(err);
        }
    });

    emailCampaignService.createJob(emailCampaign);

    res.status(200).end();
};