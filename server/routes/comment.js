const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");

//=================================
//            Comment
//=================================


router.post("/saveComment", (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if(err) return res.json({ success : false, err})

        Comment.find({'_id' : comment._id})
        .populate('writer')
        .exec((err, result) => {
            if(err) return res.json({ success : false, err})
            res.status(200).json({ success : true, result})
        })
    }) // 모든 정보를 mongoDb에 저장 // save하면 populate 불가능 // id->populate get all info
});

router.post("/getComments", (req, res) => {

    Comment.find( { "postId" : req.body.videoId })
    .populate('writer')
    .exec(( err, comments) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success : true, comments})
    })
});


module.exports = router;
