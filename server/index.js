import express from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDB from './db/connectDB.js';
import cors from 'cors'
import bodyParser from 'body-parser'
import ProductRoutes from './routes/product.js'

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use("/product", ProductRoutes);


const PORT = process.env.SERVER_PORT || 5001;

const start = async ()=>{
    try {
        await connectDB();
        app.listen(PORT,()=>{
        console.log("Server is running at port", PORT);
        })
    } catch (err) {
        console.log(err);
    }
}
start();