const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Report = mongoose.model("Report");

router.post('/report', requireLogin, (req, res) => {
    const { reason, postId } = req.body;
    if (!reason ) {
        return res.status(422).json({ error: "Please add a reason!" });
    }
    req.user.email = undefined;
    req.user.password = undefined;
    const report = new Report({
        reason,
        postId,
        reportedBy: req.user
    });
    report.save().then(result => {
        res.json({ report: result });
    })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;