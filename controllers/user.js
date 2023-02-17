import User from "../models/User.js";

export const get = async(req,res) =>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`);
        const {id} = req.params;
        const user = await User.findById(id).lean();
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({error:error.message});
    }
}

export const getall = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
        const UserList = await User.find().sort({name:'asc'}).select(["name","email","image"]).lean();
        res.status(201).json(UserList)
    } catch (error) {
        res.status(404).json({error:error.message});
    }
}

export const update = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
        const {id} = req.params;
        const data = req.body;
        const user = await User.findById(id).lean();
        for (const num in data){
            user[num] = data[num]
        }
        await user.save();
        res.status(201).json(user)
    } catch (error) {
        res.status(404).json({error:error.message});
    }
}

