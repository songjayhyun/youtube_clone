const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require('../models/Subscriber');
const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename : (req,file,cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req,file,cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, ture)
    }
});

const upload = multer({ storage: storage}).single("file");

//=================================
//            Video
//=================================


// req : req를 통해 클라이언트에서 받음

router.post('/uploadfiles', (req,res) => {
    
    // 비디오 파일을 서버에 저장한다.
    upload(req,res,err => {
        if(err) {
            return res.json({ success : false, err})
        } 
        return res.json({ success : true, url: res.req.file.path, fileName : res.req.file.filename }) // url : file download path
    })
})


router.post('/uploadVideo', (req,res) => {
    
    // 비디오 정보를 서버에 저장한다.

    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json ({ success : false, err})
        res.status(200).json({ success : true })
        
    })
    
})



router.get('/getVideos' , (req,res) => {
    
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.


    Video.find()
        .populate('writer') // video에 있는 모든 정보
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success : true, videos })
        })
})

 

router.post('/getVideoDetail' , (req,res) => {
    
    // 비디오 id를 이용해 맞는 비디오 정보를 가져와야함
    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer') // 이 유저의 모든 정보를 가져옴
    .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({ success : true, videoDetail})
    })
})



router.post('/thumbnail', (req,res) => {

    // 썸네일 생성 후 비디오 러닝타임도 가져오기

    let filePath = ""
    let fileDuration= ""


    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });


    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
        console.log('Will generate' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function() {
        console.log('Screenshots taken');
        return res.json({ success : true, url : filePath, fileDuration : fileDuration})
    })
    .on('error', function (err) {
        console.error(err);
        return res.json({ success : false, err});
    })
    .screenshots({ // option
        // Will take screenshots at 20%, 40%, 60^, and 80% of the video
        count : 3,
        folder : 'uploads/thumbnails',
        size: '320x240',
        // %b : input basename (filename w/o extension)
        filename : 'thumbnail-%b.png'
    })
})


router.post("/getSubscriptionVideos", (req, res) => {


    //Need to find all of the Users that I am subscribing to From Subscriber Collection 
    
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })


        //Need to Fetch all of the Videos that belong to the Users that I found in previous step. 
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })
});



module.exports = router;
