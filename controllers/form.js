import Form from "../models/Form.js";
import { gethistroy } from '../history/history';

export const CreateModel = async(req,res) =>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
        const {
            name,
            selectdata,
            schema,
            creator,
        } = req.body;
        const newform = new Form({
            name,
            selectdata,
            schema,
            creator
        });
        const savedform = await newform.save();
        res.status(201).json(savedform);
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const GetAllModel = async(req,res) =>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
        const formlist = await Form.find().populate({path:"datalist",populate:[{path:"comments",populate:{path:"user",select:["name","image"]}},{path:"history",populate:{path:"user",select:["name"]}}]}).lean();        
        res.status(201).json(formlist);
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const GetModel = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
        const {id} = req.params;
        const form = await Form.findById(id).populate({path:"datalist",populate:[{path:"comments",populate:{path:"user",select:["name","image"]}},{path:"history",populate:{path:"user",select:["name"]}}]}).lean();    
        res.status(201).json(form)    
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}


export const CreateData = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
        const {formid} = req.params;
        const data = req.body;
        const form = await Form.findById(formid).lean();
        form.datalist.push(data);
        await form.save();
        res.status(201).json(form);
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const UpdateData = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
        const {formid,dataid,userid} = req.params;
        const data = req.body;
        const formdata = await Form.findOne({"_id":formid,"datalist.id":dataid});
        const historyData = gethistroy(formdata['data'],data,userid);
        if (historyData['bool']){
            formdata.history.push(historyData['history'])
            formdata.data = data['data'];
            await formdata.save();
        }
        const form = await Form.findById(formid).lean();
        res.status(201).json(form);
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const DeleteData = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`)
        const {formid,dataid} = req.params;
        const formdata = await Form.findOne({"_id":formid,"datalist.id":dataid});
        await formdata.delete();
        const form = await Form.findById(formid).lean();
        res.status(201).json(form);
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}