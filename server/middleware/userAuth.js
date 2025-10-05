import jwt from "jsonwebtoken";

const userAuth = async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token)
    {
        return res.json({success:false, message:'Not Authorized. Login Again.'});
    }
try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

    // if token decode has ._id then add this id to req.body
    if(tokenDecode.id){
        req.body.userId = tokenDecode.id;
    }   
    else{
        return res.json({success:false, message:'Not Authorized. Login Again.'});
    }

    next();
    // `next()` passes the data from middleware to the next route or handler; without it, the process stops, and the next route doesn’t execute. 
} catch (error) {
    res.json({success:false, message:error.message})
}
}
export default userAuth;

// NOw go to authRoutes.js file and add another route