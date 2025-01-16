const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET ='aryafhgg$vg'

//ROUTE 1:Create a user using:POST"/api/auth/createuser" No login required
router.post('/createuser' ,[
    body('name','Enter  a valid name').isLength({min:3}),
    body('email','Enter valid Email').isEmail(),
    body('password','password must be atleast 5 character').isLength({min:5})
], async (req,res)=>{
    let success=false;
    //If there are errors , retuen bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //cheak whether the user with this email exist already
    try{
    let user = await User.findOne({email:req.body.email});
    if(user){
        success=false;
        return res.status(400).json({error:"Sorry a user with this email already exists"})
    }

    const salt= await bcrypt.genSaltSync(10);
    const secPass=await bcrypt.hashSync(req.body.password,salt);
    //Create a new user
   user = await User.create({
 name:req.body.name,
 email:req.body.email,
 password:secPass,
 });

 const data ={
    user:{ 
        id:user.id
    }
 }

 const authtoken= jwt.sign(data,JWT_SECRET)
 success=true;
res.json({success,authtoken})

    } catch(error) {
        console.error(error.message)
        res.status(500).send("Internal serval error")
    }
})


//ROUTE 2:Authenticate a user using:POST"/api/auth/login" No login required
router.post('/login' ,[
    body('email','Enter valid Email').isEmail(), 
    body('password','password cannot be blank').exists(),
], async (req,res)=>{

    let success=false;
//If there are errors , retuen bad request and the errors
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
}

const {email,password}= req.body;
try{
 let user = await User.findOne({email});
 if(!user){
    success=false ;
    return res.status(400).json({error:'please try to login with correct credential'})
 }

 const passwordCompare= await bcrypt.compare(password,user.password);
 if(!passwordCompare){
    success=false ;
    return res.status(400).json({error:'please try to login with correct credential'})
 }

 const data ={
    user:{
        id:user.id
    }
 }

 const authtoken= jwt.sign(data,JWT_SECRET);
 success=true;
 res.json({success,authtoken})

} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal serval error")
}
})


//ROUTE 3:Get loggedin user Details using: POST '/api/auth/getuser',login required
router.post('/getuser' , fetchuser , async (req,res)=>{

try {
   const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal serval error")
}
})

module.exports = router