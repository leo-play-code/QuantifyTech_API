import express from "express";
import {
    GetModel,
    GetAllModel,
    UpdateData,
    DeleteData,
    CreateModel,
    CreateData
}from "../controllers/form.js";
import { verifyToken } from '../middleware/auth';
const router = express.Router();

router.post("/CreateModel",verifyToken,CreateModel);
router.get("/GetModel/:id",verifyToken,GetModel);
router.get("/GetAllModel",verifyToken,GetAllModel);


router.post("/UpdateData/:formid/:dataid/:userid",verifyToken,UpdateData);
router.delete("/DeleteData/:formid/:dataid",verifyToken,DeleteData);
router.post("/CreateData/:formid",verifyToken,CreateData);

export default router;
