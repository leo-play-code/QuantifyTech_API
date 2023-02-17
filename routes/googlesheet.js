import express from "express";
import { verifyToken } from "../middleware/auth";

import {
    get,
    getall,
    create,
    Delete,
    detect,
    GetSheetList
}from "../controllers/googlesheet.js";

const router = express.Router();

router.post("/detect/:docID",verifyToken,detect);
router.get("/get/:docID/:sheetID",verifyToken,get);
router.get("/getall",verifyToken,getall);
router.post("/create/:docID",verifyToken,create);
router.delete("/delete",verifyToken,Delete);
router.get("/getsheetlist/:id",verifyToken,GetSheetList)

export default router;
