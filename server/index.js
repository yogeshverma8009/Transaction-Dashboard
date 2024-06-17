import express from  "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import transactionRoute from "./routes/transaction.route.js";
import cors from  "cors";
import path from "path";

dotenv.config();


//database connection
mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log("Database Connected Successfully");
}).catch((err)=>{
    console.log(err);
})

const __dirname  = path.resolve();


const app = express();

const Port = process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors())

app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
})

app.use('/api/v1',transactionRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname, 'client','dist','index.html'));
})