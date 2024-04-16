import express from "express";
import cors from 'cors';
import 'dotenv/config';
import bodyParser from "body-parser";

import adminRouter from "./v1/routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("SV-Admin-Microservice..");
});

app.use("/api/v1/admin", adminRouter);

app.listen(process.env.PORT,()=>{
    console.log("SV-Admin-Microservice listening on ",process.env.PORT);
});
