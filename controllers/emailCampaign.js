const EmailCampaign = require('../models/EmailCampaign');

/**
 * POST /emailCampaign/create
 */
exports.postCreateEmailCampaign  = (req, res, next) => {
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

    res.status(200).end();
};