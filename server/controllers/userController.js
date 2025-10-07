// This file is for handling user related operation after login.

import userModel from "../models/userModel.js";

// Function to get user data
export const getUserData = async(req,res)=>{
    try{
        const userId = req.user.id; //works for GET and POST

        const user = await userModel.findById(userId);

        if(!user)
        {
            res.json({success:false,message:"User not found."});
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified,
            }
        })
    }
    catch(error)
    {
        res.json({success:false,message:error.message})
    }
}

// Now using this cntrl function create a route 
// For this particular cntrl function create another route file name as userRoutes.js inside routes folder
