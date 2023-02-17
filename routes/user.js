import express from "express";
import {
    get,
    getall,
    update
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

router.get("/get/:id",verifyToken,get);
router.get("/getall",verifyToken,getall);
router.post("/update/:id",verifyToken,update)


export default router;
