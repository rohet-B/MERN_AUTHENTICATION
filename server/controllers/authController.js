// This file is for handling user's authentication related operation

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // to generate a token for authentication
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// user registration function
export const register = async (req,res) =>{
    const {name,email,password} = req.body;
    if(!name || !email || !password)
    {
        return res.json({success:false, message: "Missing Details"});
    }
    try{
        const existingUser = await userModel.findOne({email});
        
        if(existingUser)
        {
            return res.json({success:false, message: "User already exists."});
        }
        
        // to store password in encrypted manner we have to import bcrypt.js and jwt
        const hasedPassword = await bcrypt.hash(password,10);

        const user = new userModel({name,email,password:hasedPassword});
        await user.save();

        // For authentication we have to generate one token and we have to send this token using cookies
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie("token",token, {
            httpOnly:true,
            // when running project on live server then change development to production in .env file so that project run on https not in http else keep it same 
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        // This code generates a JWT token using the user’s ID and a secret key, with an expiry of 7 days. It then stores this token in a browser cookie named "token". The cookie is set as HTTP-only, meaning it can’t be accessed by client-side JavaScript, which improves security. The secure and sameSite options are configured based on whether the app is running in production or development mode—in production, the cookie works with HTTPS and allows cross-site requests, while in development, it remains restricted. Overall, this setup securely keeps the user logged in for 7 days using a token-based authentication system.

        // Sending Welcome email
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome to MERN AUTHENTICATION',
            text:`Welcome to MERN-AUTH, Your account has been created with email id : ${email}.`,
        }
        await transporter.sendMail(mailOptions);
        
        return res.json({success:true});
    }
    catch(error)
    {
        res.json({success:false, message:error.message});
    }
}

// user login function
export const login = async (req,res) =>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        return res.json({
            success:false,
            message:'Email and Password are required.'
        })
    }
    // if email and password is filled
    try {
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false,message:"Invalid Email."});
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch)
        {
            return res.json({success:false,message:"Invalid password."});
        }

        // if both are correct email and password then we have to create a token and using this token user will be authenticated and logged in the website for 7 days
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie("token",token, {
            httpOnly:true,
            // when running project on live server then change development to production in .env file so that project run on https not in http else keep it same 
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({success:true});


    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

// logout function
export const logout = async (req,res) =>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.json({success:true,message:"Logged Out successfully"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

// Now create routes


// Send Verification OTP to user's email function
export const sendVerifyOtp = async(req,res) =>{
    try{
        // We will get the userId from token.
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        // Check if the user's account is already verified
        if(user.isAccountVerified)
        {
            // If isAccountVerified === true, that means the user has already verified their account
            return res.json({success:false,message:"Account already verified."})
        }
        // If the code reaches here, that means isAccountVerified === false
        // So we can proceed to generate and send a new OTP for email verification

        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.verifyOTP = otp;
        user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();

        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            text:`Your OTP is ${otp}. Verify your account using this OTP.`,
        }
        await transporter.sendMail(mailOptions);


        res.json({success:true,message:'Verification OTP sent on Mail.'});
    }
    catch(error){
        res.json({success:false,message:error.message});
    }
}


// Check if the user typed the correct OTP for verification
export const verifyEmail = async (req,res)=>{
    const {userId, otp} = req.body;
    
    if(!userId || !otp)
    {
        return res.json({success:false,message:"Missing Details."});      
    }
    
    try {
        
        const user = await userModel.findById(userId);
        // if user not found
        if(!user)
        {
            return res.json({success:false,message:"User not found."});      
        }

        // if user's verify otp is empty or not equal to otp send to the user.
        if(!user.verifyOTP || user.verifyOTP !== String(otp))
        {
            return res.json({success:false,message:"Invalid OTP."});      
        }

        // if otp is expired
        if(user.verifyOTPExpireAt < Date.now()){
            return res.json({success:false,message:"OTP is expired."});      
        }

        // If otp is correct and not expired then verify user account
        user.isAccountVerified = true;


        // Reseting verification otp and it's expire date.
        user.verifyOTP = '';
        user.verifyOTPExpireAt = 0;
        
        await user.save();

        return res.json({success:true,message:"Email verified Successfully."});
    } 
    catch (error) 
    {
        return res.json({success:false,message:error.message});
    }
};

// We will get the userId from token and token is stored in the cookies so we need a middleware that will get the cookie and from that cookie we will get
// token and from that token we will find the userID and then we will add in req.body.
// For this create a new folder middleware


// check if user is Authenticated 
// isAuthenticated simply checks if a user is logged in or not. When you call it, it looks for a login token in the browser’s cookies. If the token is valid, it means the user is still logged in and sends back { success: true }. If the token is missing or expired, it means the user is logged out.
export const isAuthenticated = async (req,res)=>{
    try {
        return res.json({success:true});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

// GO to authroutes.js

// Send Password reset OTP
export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false,message:"Email is required."});
    }

    try {
        const user = await userModel.findOne({email});

        if(!user)
        {
            return res.json({success:false,message:"User not found"});
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.resetOTP = otp;
        user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000
        await user.save();

        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subejct:"Password Reset OTP",
            text:`Your OTP for resetting your password is ${otp}`,
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true,message:"OTP sent to your email."});

    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

// Reset User password
export const resetPassword = async (req,res) =>{
    const {email,otp,newPassword} = req.body;

    if(!email || !otp || !newPassword)
    {
        return res.json({success:false,message:"Email, OTP and new password are required."});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false,message:"User not found."});

        }

        if(user.resetOTP === '' || user.resetOTP !== otp)
        {
            return res.json({success:false,message:"Invalid OTP"});
        }

        if(user.resetOTPExpireAt < Date.now())
        {
            return res.json({success:false,message:"OTP is expired."});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOTP = '';
        user.resetOTPExpireAt = 0;
        user.save();

        return res.json({success:true,message:'Password has been reset successfully.'});

    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}
// Now add this new route to authRoutes.js