const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');
// Post model
const Creator = require('../models/Creator');
const Category = require('../models/Category');
const Youtubepost = require('../models/Youtubepost');
const Facebookpost = require('../models/Facebookpost');

router.get('/test/:creatorID', (req, res) => {
    Facebookpost.find({creatorid:req.params.creatorID}) 
    .exec()
    .then(result=>res.status(200).json(result))
    .catch();
});


router.get('/all', checkAuth, (req, res)=>{
    res.status(200).json('test page')   
});

//list of all creators and influencer
router.post('/all', checkAuth, (req, res)=>{
    Creator.find({reach: {$gt: 0}}).sort({reach:-1}).collation({locale: "en_US", numericOrdering: true}).limit(50)
    .populate('cat_id',['wall_cat','wall_cat_code'])
    .exec()
      .then(creators=> {
         const response = {
            count  : creators.length,
            creator: creators.map(creator=>{
                return {
                    name : creator.name,
                    _id :  creator._id,
                    reach: creator.reach,
                    cat_id:creator.cat_id,
                    channel_name:creator.channel_name,
                    category_name: creator.category_name,
                    fb_fan_count: creator.fb_fan_count,
                    yt_subscriber_count:creator.yt_subscriber_count,
                    ig_followers_count:creator.ig_followers_count,
                    address:creator.address,
                    yt_imageUrl:creator.yt_imageUrl,
                    isInf:creator.isInf,
                    status:creator.status                   
                } 
            })
        };       
        res.status(200).json(response);
    })  
    .catch(error=>res.json(error));
});

//list of influencr
router.post('/influencer', checkAuth, (req, res)=>{
    Creator.find({reach: {$gt: 50000}}).sort({reach:-1}).collation({locale: "en_US", numericOrdering: true})
    .populate('cat_id',['wall_cat','wall_cat_code'])
     .lean()  .exec()
      .then(creators=> {
         const response = {
            count  : creators.length,
            creator: creators.map(creator=>{
                return {
                    name : creator.name,
                    _id :  creator._id,
                    reach: creator.reach,
                    cat_id:creator.cat_id,
                    channel_name:creator.channel_name,
                    category_name: creator.category_name,
                    fb_fan_count: creator.fb_fan_count,
                    yt_subscriber_count:creator.yt_subscriber_count,
                    ig_followers_count:creator.ig_followers_count,
                    address:creator.address,
                    yt_imageUrl:creator.yt_imageUrl,
                    isInf:creator.isInf,
                    status:creator.status                   
                }
            })
        };       
        res.status(200).json(response);
    })    
});


router.get('/list/:youtube?/:facebook?/:insta?', checkAuth, (req, res)=>{
    const yt = req.params.youtube;
    const fb =  req.params.facebook;
    const insta = req.params.insta;
    cat = new Array('Entertainment');

    Creator.find({category_name:cat, reach:{$gt: 0}}).sort({reach:-1})
    .collation({locale: "en_US", numericOrdering: true})
    .limit(50)
    .populate('cat_id',['wall_cat','wall_cat_code'])
    .exec()
      .then(creators=> {
         const response = {
            count  : creators.length,
            creator: creators.map(creator=>{
                return {
                    name : creator.name,
                    _id :  creator._id,
                    reach: creator.reach,
                    cat_id:creator.cat_id,
                    channel_name:creator.channel_name,
                    category_name: creator.category_name,
                }
            })
        };       
        res.status(200).json(response);
    })
    .catch(err=>res.status(400).json({
        error:err
    }))
});

module.exports = router;  