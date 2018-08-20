const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


router.post('/login', (req,res,next)=>{

    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Email Not Found'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err,result)=>{
            if(err){
                return res.status(401).json({
                    error:err
                });
            }
            if(result){
             const token =  jwt.sign({email:user[0].email,userId:user[0]._id},process.env.JWT_KEY,{expiresIn:"1h"});
                return res.status(200).json({
                    message:'Auth successful',
                    token: 'Bearer '+ token
                })
            }
            return res.status(401).json({
                message:'Password Incorrect'
            });
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});


module.exports =router; 