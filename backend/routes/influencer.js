const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');


// Post model
const Creator = require('../models/Creator');
const Youtubepost = require('../models/Youtubepost');
const Facebookpost = require('../models/Facebookpost');

//Get the influencer post data
router.post('/:id', checkAuth, (req, res)=>{
    var youtubePostData = {};
    console.log(mongoose.Types.ObjectId(req.params.id));
    
    Youtubepost.find({creatorid:req.params.id}).sort({viewCount:-1}).collation({locale: "en_US", numericOrdering: true}).limit(3)
    .populate('creatorid',['name','channel_name','category_name','reach','fb_fan_count','yt_subscriber_count','ig_followers_count'])
    .exec()
      .then(posts=> {
        youtubePostData = {
            youtuebpostdata_count  : posts.length,
            youtuebpostdata: posts.map(post=>{
                return {
                    _id :  post._id,
                    creatorData : post.creatorid,
                    videoId : post.videoId,
                    videoViews : post.viewCount,
                    totalLikes : post.likeCount,
                    totalComment : post.commentCount,
                    title : post.title,
                    description : post.description,
                    channelTitle : post.channelTitle,
                    imageUrl : post.imageUrl    
                } 
            })
        };       
        // res.status(200).json(obj);
        console.log('completed youtube');
    }).then(aa=> {

        console.log('started facebook');
        //fb post data
        var facebookPostData = {};
        Facebookpost.find({creatorid:req.params.id}).sort({likes_count:-1}).collation({locale: "en_US", numericOrdering: true}).limit(3)
        .populate('creatorid',['name','channel_name','category_name','reach','fb_fan_count','yt_subscriber_count','ig_followers_count'])
        .exec()
        .then(posts=> {
            facebookPostData = {
                fbpostdata_count  : posts.length,
                fbpostdata: posts.map(post=>{
                    return {
                        _id :  post._id,
                        creatorData : post.creatorid,
                        link : post.link,
                        message : post.message,
                        picture : post.picture,
                        permalink_url : post.permalink_url,
                        likes_count : post.likes_count,
                        comments_count : post.comments_count                   
                    } 
                })
            };       
            
            res.status(200).json(Object.assign({}, youtubePostData, facebookPostData));
        });   
        console.log('facebook done');
    });    
});



router.post('/new/:id', checkAuth, (req, res)=>{
    var youtubePostData = {};
    var userData = {};
    Creator.find({_id:req.params.id,reach: {$gt: 1}}).sort({reach:-1}).collation({locale: "en_US", numericOrdering: true})
    .exec()
    .then(results=>{
        userData = {
            userData:results.map(result=>{
                return {
                    _id: result._id,
                    name : result.name,
                    channel_name : result.channel_name,
                    category_name: result.category_name,
                    reach : result.reach,
                    fb_fan_count : result.fb_fan_count,
                    yt_subscriber_count : result.yt_subscriber_count,
                    ig_followers_count : result.ig_followers_count
                }
            })
        };

        Youtubepost.find({creatorid:req.params.id}).sort({viewCount:-1}).collation({locale: "en_US", numericOrdering: true}).limit(3)
       .exec()
        .then(posts=> {
            youtubePostData = {
                youtuebpostdata_count  : posts.length,
                youtuebpostdata: posts.map(post=>{
                    return {
                        _id :  post._id,
                        videoId : post.videoId,
                        videoViews : post.viewCount,
                        totalLikes : post.likeCount,
                        totalComment : post.commentCount,
                        title : post.title,
                        description : post.description,
                        channelTitle : post.channelTitle,
                        imageUrl : post.imageUrl    
                    } 
                })
            };       
            // res.status(200).json(obj);
            console.log('completed youtube');
        })

        var facebookPostData = {};
        Facebookpost.find({creatorid:req.params.id}).sort({likes_count:-1}).collation({locale: "en_US", numericOrdering: true}).limit(3)
        .exec()
        .then(posts=> {
            facebookPostData = {
                fbpostdata_count  : posts.length,
                fbpostdata: posts.map(post=>{
                    return {
                        _id :  post._id,
                        creatorData : post.creatorid,
                        link : post.link,
                        message : post.message,
                        picture : post.picture,
                        permalink_url : post.permalink_url,
                        likes_count : post.likes_count,
                        comments_count : post.comments_count                   
                    } 
                })
            };       
            
            res.status(200).json(Object.assign({}, userData, youtubePostData, facebookPostData));
        })
        .catch(err=>res.status(404).json(err));    
    })    
});

module.exports = router;  