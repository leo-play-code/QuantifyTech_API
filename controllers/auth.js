import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`);
        const {email} = req.body;
        const user = await User.findOne({email:email}).lean();
        if (!user) return res.status(400).json({msg:"User does have permission. "});
        const token = await ((user.loginbool==true)?(jwt.sign({id:user._id},process.env.JWT_SECRET)):null)
        res.status(200).json({token,user});
    } catch (error) {   
        res.status(500).json({error:error.message})
    }
}

export const register = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`)
        const {
            name,
            email,
            image
        } = req.body;

        const newUser = new User({
            name,
            email,
            image
        });

        const user = await newUser.save();
        const token = await ((user.loginbool==true)?(jwt.sign({id:user._id},process.env.JWT_SECRET)):null)
        res.status(200).json({token,user});
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

