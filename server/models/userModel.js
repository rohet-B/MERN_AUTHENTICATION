import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verifyOTP:{type:String,default:''},
    verifyOTPExpireAt:{type:Number,default:0},
    isAccountVerified:{type:Boolean,default:false},
    resetOTP:{type:String,default:''},
    resetOTPExpireAt:{type:Number,default:0},
})
const userModel = mongoose.models.user || mongoose.model('user',userSchema);
// It checks if the user model (collection) already exists (mongoose.models.user).
// If it exists → reuse it.
// If not → create a new model with userSchema.

export default userModel;