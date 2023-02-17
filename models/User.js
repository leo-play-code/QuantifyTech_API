
import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        image:{
            type:String,
        },
        loginbool:{
            type:Boolean,
            default:false
        },
        setting:{
            type:{},
        },
    },
    {timestamps:true}
);


const User = mongoose.model("User",UserSchema);
export default User;
