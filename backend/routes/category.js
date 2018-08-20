const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Post model
const Category = require('../models/Category');

const checkAuth = require('../middleware/check-auth');

router.post('/all', checkAuth, (req, res)=>{
    Category.find()
    .exec()
    .then(results=>{
        const response = {
            count:results.length,
            category:results.map(result=>{
                return {
                    _id:result._id,
                    name:result.wall_cat,
                    status:result.status
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err=>res.status(404).json({
        error:err
    }));
});

module.exports = router;  