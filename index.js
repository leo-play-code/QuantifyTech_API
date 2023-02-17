/* API MODULES */
import  express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* CKEDITOR UPLOAD MODULES */
import multiparty from 'connect-multiparty';

/* ROUTES MODULES */
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import formRouter from "./routes/form.js";
import googlesheetRouter from "./routes/googlesheet.js";

/* MODEL MODULES */
import User from "./models/User.js";
import Form from "./models/Form.js";
import GoogleSheet from "./models/GoogleSheet.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));


/* FILE STORAGE */
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    },
});

const upload = multer({storage});
// upload middleware
const MultipartyMiddleware = multiparty({uploadDir:'./images'});
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// url 可以用static 內圖片的路徑來顯示圖片
app.post('/upload/images',MultipartyMiddleware,(req,res)=>{
    res.set("Access-Control-Allow-Origin",`${process.env.CLIENT_URL}` )
    const imagePath = req.files.upload.path;
    res.status(200).json({
        uploaded:true,
        url: `${process.env.SERVER_URL}/${imagePath}`
    })
})

/* ROUTES */
app.use("/auth",authRouter);
app.use("/user",userRouter);
app.use("/form",formRouter);
app.use("/googlesheet",googlesheetRouter);




/* MOGOOSE SETUP */
const PORT = process.env.PORT || 6003;
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,() => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`))