// const mongoose = require("mongoose");
import mongoose from "mongoose";
// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

   const connect = ()=>{
    console.log("Mongodb connected");
    return mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
  }
export default connect;