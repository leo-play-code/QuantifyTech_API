import GoogleSheet from '../models/GoogleSheet';
import  { GoogleSpreadsheet } from 'google-spreadsheet';

/* GET SHEET DATA */
export const get = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`);
        const {docID,sheetID} = req.params;
        const doc = new GoogleSpreadsheet(docID);
        await doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_SHEET_CRED));
        await doc.loadInfo();
        const sheet = doc.sheetsById[sheetID];
        const rows = await sheet.getRows();
        const title = await sheet.headerValues
        const result = [title];
        for (const row of rows) {
            result.push(row._rawData)
        }
        res.status(201).json(result)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

/* GET ALL GOOGLE SHEET DOC */
export const getall = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`);
        const Alllist = await GoogleSheet.find().lean();
        res.status(201).json(Alllist);
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}
/* CREATE GOOGLE SHEET DOC */
export const create = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` );
        const {docID} = req.params;
        const doc = new GoogleSpreadsheet(docID);
        await doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_SHEET_CRED));
        await doc.loadInfo();
        const {name} = req.body;
        const newGoogleSheet = new GoogleSheet({
            name,
            docID
        })
        const saved = await newGoogleSheet.save();
        res.status(201).json(saved)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

/* DETECT IS THIS DOCID EXISTS */
export const detect = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`);
        const {docID} = req.params;
        try{
            var tempsheet = await GoogleSheet.find({docID:docID});
        }catch(error){
            var tempsheet = []
        }
        const doc = new GoogleSpreadsheet(docID);
        await doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_SHEET_CRED));
        await doc.loadInfo();
        if (tempsheet.length>0){
            res.status(201).json({error:"Doc Exists"})
        }else{
            res.status(201).json({"pass":"pass"})
        }
    } catch (error) {
        res.status(404).json({error:"Doc is not able to use"})
    }
}
/* GET SHEET LIST */
export const GetSheetList = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`);
        const {id} = req.params;
        const googlesheet = await GoogleSheet.findById(id).lean()
        const doc = new GoogleSpreadsheet(googlesheet['docID']);
        await doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_SHEET_CRED));
        await doc.loadInfo();
        const sheetdict = await doc._rawSheets;
        const sheetlist = []
        for (const key in sheetdict){
            var tempdict = {}
            var sheet = await doc.sheetsById[key];
            var sheetname = sheet['_rawProperties']['title']
            tempdict['name'] = sheetname;
            tempdict['sheetID'] = key
            sheetlist.push(tempdict)
        }
        res.status(201).json(sheetlist)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}


/* DELETE */
export const Delete = async(req,res)=>{
    try {
        res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}`)
        const {id} = req.params;
        const googlesheet = await GoogleSheet.findById(id).lean()
        await googlesheet.delete()
        const Alllist = await GoogleSheet.find().lean();
        res.status(201).json(Alllist);
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}