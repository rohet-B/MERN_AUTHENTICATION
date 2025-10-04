import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // to generate a token for authentication
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// user registration function
export const register = async (req,res) =>{
    const {name,email,password} = req.body;
    if(!name || !email || !password)
    {
        return res.json({sucess:false, message: "Missing Details"});
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
        res.json({sucess:false, message:error.message});
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