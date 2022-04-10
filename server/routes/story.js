const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Story = mongoose.model("Story");

router.get('/getsubstories', requireLogin, (req, res) => {
    Story.find({ postedBy: { $in: [...req.user.following, req.user._id] }, createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        .populate("postedBy", "_id username profPic")
        .sort('-createdAt')
        .then(stories => {
            res.json({
                stories
            });
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/highlightedStories/:userId', requireLogin, (req, res) => {
    Story.find({ postedBy: req.params.userId, isHighlight: true })
        .populate("postedBy", "_id username profPic")
        .sort('-createdAt')
        .then(stories => {
            res.json({
                stories
            });
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/myUnhighlightedStories', requireLogin, (req, res) => {
    Story.find({ postedBy: req.user._id, isHighlight: false })
        .populate("postedBy", "_id username profPic")
        .sort('-createdAt')
        .then(stories => {
            res.json({
                stories
            });
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/story/:storyId', requireLogin, (req, res) => {
    Story.findOne({ _id: req.params.storyId })
        .then(story => {
            res.json({ story });
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/createstory', requireLogin, (req, res) => {
    const { file } = req.body;
    if (!file) {
        return res.status(422).json({ error: "Please upload an image or video!" });
    }

    const story = new Story({
        file,
        postedBy: req.user
    });

    story.save().then(result => {
        res.json({ story: result });
    })
        .catch(err => {
            console.log(err);
        })
});

router.put('/editstory/:storyId', requireLogin, (req, res) => {
    const { file } = req.body;
    if (!file) {
        return res.status(422).json({ error: "Please upload an image or video!" });
    }

    Story.findByIdAndUpdate(req.params.storyId, {
        file,
    }, {
        new: true
    })
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            else {
                res.json(result);
            }
        })
})

router.delete('/deletestory/:storyId', requireLogin, (req, res) => {
    Story.findOne({ _id: req.params.storyId })
        .populate("postedBy", "_id")
        .exec((err, story) => {
            if (err || !story) {
                return res.status(422).json({ error: err });
            }
            if (story.postedBy._id.toString() === req.user._id.toString()) {
                story.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err);
                    })
            }
        })
})

router.put('/highlightStories', requireLogin, (req, res) => {
    const { storyIds } = req.body;

    Story.updateMany({ _id: { $in: storyIds } },
        {
            $set: { isHighlight: true },
        }, {
        new: true
    })
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            else {
                res.json(result);
            }
        })
})

router.put('/unhighlightStory', requireLogin, (req, res) => {
    const { storyId } = req.body;

    Story.findByIdAndUpdate({ _id: storyId },
        {
            $set: { isHighlight: false },
        }, {
        new: true
    })
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            else {
                res.json(result);
            }
        })
})

module.exports = router;